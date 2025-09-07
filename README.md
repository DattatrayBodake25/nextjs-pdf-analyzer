# 
PDF Q&A App (Next.js + OpenAI + Pinecone)

A mini application built with **Next.js** that allows users to **upload a PDF** and then **ask questions** based on its content.  
The app uses **OpenAI embeddings** + **Pinecone vector database** to enable **retrieval-augmented generation (RAG)** for accurate answers.

---

## Features

- Upload a PDF file and extract its text content.
- Generate embeddings using **OpenAI API**.
- Store embeddings in **Pinecone vector database**.
- Ask natural language questions and get answers from the PDF content.
- Simple frontend built with **Next.js** components.
- Protected backend API routes.

---

## Tech Stack

- **Frontend:** Next.js, React  
- **Backend:** Next.js API Routes  
- **AI/Embeddings:** OpenAI API  
- **Vector DB:** Pinecone  
- **PDF Processing:** `pdf-parse`, `pdfjs-dist`  

---

## Project Structure
```
pdf-qa-app/
├── components/
│ ├── FileUpload.js                                # UI for uploading PDFs
│ └── QuestionForm.js                              # UI for entering questions
├── pages/
│ ├── api/
│ │ ├── upload.js                                  # API route for PDF upload & embeddings
│ │ └── ask.js                                     # API route for answering questions
│ ├── _app.js
│ └── index.js                                     # Main page with upload + Q&A form
├── utils/
│ ├── openai.js                                    # OpenAI API helper
│ └── pdfProcessor.js                              # PDF text extraction utility
├── styles/
│ └── globals.css
└── public/
```

---

## ⚙Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pdf-qa-app.git
cd pdf-qa-app
```
### 2. Install dependencies
```
npm install
```
### 3. Set up environment variables
Create a .env.local file in the project root and add:
```
OPENAI_API_KEY=your_open_ai_api_key_here
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=your_index_name
```

### 4. Run the app locally
```
npm run dev
```
Visit: 
```
http://localhost:3000
```
---

## Usage
1. Upload a PDF using the Upload PDF button.
2. Enter your question in the input field.
3. The app queries Pinecone for relevant chunks → retrieves context → asks OpenAI → returns the best answer.
Example:
- Question: How did the Green Revolution solve India’s food shortage problem?
- Answer: Explains increased production and long-term environmental challenges.
  
---

## Approach
1. PDF Upload & Processing
   - User uploads a PDF → Extract text using pdf-parse / pdfjs-dist.
2. Embedding Generation & Storage
   - Split text into chunks.
   - Generate embeddings with OpenAI’s text-embedding-ada-002.
   - Store embeddings in Pinecone index.

3. Question Answering (RAG)
   - User submits a question.
   - App queries Pinecone for the most relevant text chunks.
   - Combine context + question → Send to OpenAI GPT for final answer.
   - Return and display the answer in UI.

---

## Requirements Checklist
1. Backend API routes for upload & Q&A
2. PDF text extraction
3. OpenAI embeddings
4. Pinecone vector database integration
5. Retrieval-based Q&A (RAG)
6. Frontend: Upload, Ask Question, Display Answer
7. Local testing successful

---

## Future Improvements
1. Add support for larger PDFs with better chunking.
2. Improve UI with loading spinners & error handling.
3. Deploy on Vercel with Pinecone cloud integration.
4. Add user authentication.

---

# THANK YOU!

---
>>>>>>> 65d30639b27303211b30c7ba9ebc8b91da00de49
