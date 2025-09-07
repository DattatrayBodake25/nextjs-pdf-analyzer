import { useState } from 'react';
import styles from '../styles/Home.module.css';

export default function QuestionForm() {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!question.trim()) {
      alert('Please enter a question');
      return;
    }

    setIsLoading(true);
    setAnswer('');

    try {
      const response = await fetch('/api/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setAnswer(result.answer);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error asking question:', error);
      alert('Failed to get answer');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className={styles.subtitle}>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your question about the PDF content"
          rows={4}
          disabled={isLoading}
          className={styles.textarea}
        />
        <br />
        <button type="submit" disabled={isLoading} className={styles.button}>
          {isLoading ? 'Processing...' : 'Ask Question'}
        </button>
      </form>
      
      {answer && (
        <div>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}