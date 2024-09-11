import React, { useState } from 'react';
import styles from '../styles/KeywordInput.module.css';

const KeywordInput = ({
  onSubmit,
  onRelatedSubmit,
  onTop3Submit,
  loadingStates,
}) => {
  const [keywords, setKeywords] = useState(['', '', '', '', '']);

  const handleChange = (index, value) => {
    const newKeywords = [...keywords];
    newKeywords[index] = value;
    setKeywords(newKeywords);
  };

  const handleSubmit = (e, submitFunction) => {
    e.preventDefault();
    const filteredKeywords = keywords.filter(
      (keyword) => keyword.trim() !== ''
    );
    submitFunction(filteredKeywords);
  };

  return (
    <form className={styles.form}>
      <h2 className={styles.title}>Analiza słów kluczowych</h2>
      {keywords.map((keyword, index) => (
        <input
          key={index}
          type='text'
          value={keyword}
          onChange={(e) => handleChange(index, e.target.value)}
          placeholder={`Słowo kluczowe ${index + 1}`}
          className={styles.input}
          disabled={Object.values(loadingStates).some((state) => state)}
        />
      ))}
      <div className={styles.buttonContainer}>
        <button
          type='submit'
          className={styles.button}
          onClick={(e) => handleSubmit(e, onSubmit)}
          disabled={loadingStates.keywordPropositions}
        >
          {loadingStates.keywordPropositions
            ? 'Analizuję...'
            : 'Analizuj propozycje słów kluczowych'}
        </button>
        <button
          type='submit'
          className={styles.button}
          onClick={(e) => handleSubmit(e, onRelatedSubmit)}
          disabled={loadingStates.relatedKeywords}
        >
          {loadingStates.relatedKeywords
            ? 'Analizuję...'
            : 'Analizuj powiązane słowa kluczowe'}
        </button>
        <button
          type='submit'
          className={styles.button}
          onClick={(e) => handleSubmit(e, onTop3Submit)}
          disabled={loadingStates.top3Results}
        >
          {loadingStates.top3Results ? 'Pobieram...' : 'Pobierz TOP 3 wyniki'}
        </button>
      </div>
    </form>
  );
};

export default KeywordInput;
