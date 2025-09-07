import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function FileUpload({ onUploadSuccess }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please select a PDF file');
      return;
    }

    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      
      if (result.success) {
        onUploadSuccess && onUploadSuccess();
        alert('PDF uploaded successfully!');
      } else {
        alert('Failed to upload PDF: ' + result.error);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload PDF');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <h2 className={styles.subtitle}>Upload PDF</h2>
      <input 
        type="file" 
        accept=".pdf" 
        onChange={handleFileUpload}
        disabled={isUploading}
        className={styles.fileInput}
      />
      {isUploading && <p>Uploading and processing PDF...</p>}
    </div>
  );
}