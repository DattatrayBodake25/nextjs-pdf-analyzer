import pdfParse from 'pdf-parse';

// Split text into chunks for better retrieval
function splitTextIntoChunks(text, chunkSize = 1000, overlap = 200) {
  const chunks = [];
  let start = 0;
  
  while (start < text.length) {
    let end = start + chunkSize;
    
    // Try to end at a sentence boundary
    const nextPeriod = text.indexOf('.', end);
    const nextNewline = text.indexOf('\n', end);
    
    if (nextPeriod !== -1 && nextPeriod > end - 100) {
      end = nextPeriod + 1;
    } else if (nextNewline !== -1 && nextNewline > end - 100) {
      end = nextNewline + 1;
    }
    
    chunks.push(text.substring(start, end));
    start = end - overlap; // Overlap chunks for context
  }
  
  return chunks;
}

export async function processPDF(fileBuffer) {
  try {
    const data = await pdfParse(fileBuffer);
    const chunks = splitTextIntoChunks(data.text);
    return chunks;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
}