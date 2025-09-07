import { OpenAI } from 'openai';
import { Pinecone } from '@pinecone-database/pinecone';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
});

// Get or create Pinecone index with correct dimension
async function getPineconeIndex() {
  const indexName = process.env.PINECONE_INDEX_NAME || 'pdf-qa-index';
  const indexList = await pinecone.listIndexes();
  
  const existingIndex = indexList.indexes?.find(index => index.name === indexName);
  
  if (!existingIndex) {
    // Create new index with correct dimension
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // OpenAI embedding-ada-002 dimension
      metric: 'cosine',
      spec: {
        serverless: {
          cloud: 'aws',
          region: 'us-east-1'
        }
      }
    });
    
    // Wait for index to be ready
    console.log('Waiting for index to be ready...');
    await new Promise(resolve => setTimeout(resolve, 60000));
  } else {
    console.log(`Using existing index: ${indexName}`);
  }
  
  return pinecone.index(indexName);
}

export async function generateEmbeddings(text) {
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
    });
    
    return response.data[0].embedding;
  } catch (error) {
    console.error('Error generating embeddings:', error);
    throw error;
  }
}

export async function storeEmbeddings(embeddings, text, documentId) {
  try {
    const index = await getPineconeIndex();
    
    // Store embedding in Pinecone
    await index.upsert([{
      id: documentId,
      values: embeddings,
      metadata: { text, documentId: documentId.split('-chunk-')[0] }
    }]);
    
    return documentId;
  } catch (error) {
    console.error('Error storing embeddings:', error);
    throw error;
  }
}

export async function retrieveSimilarVectors(questionEmbedding, topK = 3) {
  try {
    const index = await getPineconeIndex();
    
    // Query Pinecone for similar vectors
    const results = await index.query({
      vector: questionEmbedding,
      topK,
      includeMetadata: true
    });
    
    return results.matches.map(match => match.metadata.text);
  } catch (error) {
    console.error('Error retrieving similar vectors:', error);
    throw error;
  }
}

export async function answerQuestion(question, contextTexts) {
  try {
    // Combine context texts
    const context = contextTexts.join('\n\n');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a helpful assistant that answers questions based on the provided context. 
          If the answer cannot be found in the context, say "I don't have enough information to answer this question."`
        },
        {
          role: "user",
          content: `Context: ${context}\n\nQuestion: ${question}\n\nAnswer:`
        }
      ],
      max_tokens: 500,
    });
    
    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error answering question:', error);
    throw error;
  }
}