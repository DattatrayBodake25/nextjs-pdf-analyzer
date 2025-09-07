import { IncomingForm } from 'formidable';
import fs from 'fs';
import { generateEmbeddings, storeEmbeddings } from '../../utils/openai';
import { processPDF } from '../../utils/pdfProcessor';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse the form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });

    const pdfFile = files.pdf[0];
    
    if (!pdfFile) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    // Read and process the PDF
    const fileBuffer = fs.readFileSync(pdfFile.filepath);
    const textChunks = await processPDF(fileBuffer);
    
    // Generate and store embeddings for each chunk
    const documentId = Date.now().toString();
    
    for (let i = 0; i < textChunks.length; i++) {
      const chunk = textChunks[i];
      const embeddings = await generateEmbeddings(chunk);
      await storeEmbeddings(embeddings, chunk, `${documentId}-chunk-${i}`);
    }
    
    res.status(200).json({ 
      success: true, 
      message: 'PDF processed successfully',
      documentId 
    });
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
}