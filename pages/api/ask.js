import { generateEmbeddings, retrieveSimilarVectors, answerQuestion } from '../../utils/openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { question } = req.body;
    
    if (!question) {
      return res.status(400).json({ error: 'No question provided' });
    }

    // Generate embedding for the question
    const questionEmbedding = await generateEmbeddings(question);
    
    // Retrieve similar content from vector database
    const contextTexts = await retrieveSimilarVectors(questionEmbedding);
    
    // Use the retrieved content to answer the question
    const answer = await answerQuestion(question, contextTexts);
    
    res.status(200).json({ answer });
  } catch (error) {
    console.error('Error answering question:', error);
    res.status(500).json({ error: 'Failed to answer question' });
  }
}








// import { answerQuestion } from '../../utils/openai';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { question } = req.body;
    
//     if (!question) {
//       return res.status(400).json({ error: 'No question provided' });
//     }

//     // In a real implementation, we would:
//     // 1. Generate embedding for the question
//     // 2. Search for similar content in the vector database
//     // 3. Use the retrieved content to answer the question
    
//     // For this simplified version, we'll use a basic approach
//     const answer = await answerQuestion(question);
    
//     res.status(200).json({ answer });
//   } catch (error) {
//     console.error('Error answering question:', error);
//     res.status(500).json({ error: 'Failed to answer question' });
//   }
// }