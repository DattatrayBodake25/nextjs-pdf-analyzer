import { useState } from 'react';
import FileUpload from '../components/FileUpload';
import QuestionForm from '../components/QuestionForm';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [isUploaded, setIsUploaded] = useState(false);

  const handleUploadSuccess = () => {
    setIsUploaded(true);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>PDF Q&A App</h1>
      
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      
      {isUploaded && (
        <>
          <hr className={styles.divider} />
          <QuestionForm />
        </>
      )}
    </div>
  );
}