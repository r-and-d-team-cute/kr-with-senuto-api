import React, { useState } from 'react';
import styles from '../styles/KeywordInput.module.css';

const KeywordInput = ({
  onSubmit,
  onRelatedSubmit,
  onTop3Submit,
  intentMode,
  loadingStates,
}) => {
  const [singleKeywords, setSingleKeywords] = useState(['', '', '', '', '']);
  const [multipleKeywords, setMultipleKeywords] = useState('');

  const handleSingleChange = (index, value) => {
    const newKeywords = [...singleKeywords];
    newKeywords[index] = value;
    setSingleKeywords(newKeywords);
  };

  const handleMultipleChange = (event) => {
    setMultipleKeywords(event.target.value);
  };

  const handleSubmit = (e, submitFunction) => {
    e.preventDefault();
    if (intentMode === 'single') {
      const filteredKeywords = singleKeywords.filter(
        (keyword) => keyword.trim() !== ''
      );
      submitFunction(filteredKeywords);
    } else {
      const keywordList = multipleKeywords
        .split('\n')
        .map((k) => k.trim())
        .filter((k) => k !== '');
      if (keywordList.length > 8) {
        alert('Maksymalna liczba słów kluczowych to 8.');
        return;
      }
      submitFunction(keywordList);
    }
  };

  return (
    <form className={styles.form}>
      <h2 className={styles.title}>Analiza słów kluczowych</h2>
      {intentMode === 'single' ? (
        singleKeywords.map((keyword, index) => (
          <input
            key={index}
            type='text'
            value={keyword}
            onChange={(e) => handleSingleChange(index, e.target.value)}
            placeholder={`Słowo kluczowe ${index + 1}`}
            className={styles.input}
            disabled={Object.values(loadingStates).some((state) => state)}
          />
        ))
      ) : (
        <textarea
          value={multipleKeywords}
          onChange={handleMultipleChange}
          placeholder='Wprowadź listę słów kluczowych (maksymalnie 8), każde w nowej linii'
          className={styles.textArea}
          disabled={Object.values(loadingStates).some((state) => state)}
          rows={8}
        />
      )}
      <div className={styles.buttonContainer}>
        <button
          type='submit'
          className={styles.button}
          onClick={(e) => handleSubmit(e, onSubmit)}
          disabled={
            loadingStates.keywordPropositions ||
            loadingStates.multipleKeywordPropositions
          }
        >
          {loadingStates.keywordPropositions ||
          loadingStates.multipleKeywordPropositions
            ? 'Analizuję...'
            : 'Analizuj propozycje słów kluczowych'}
        </button>
        <button
          type='submit'
          className={styles.button}
          onClick={(e) => handleSubmit(e, onRelatedSubmit)}
          disabled={
            loadingStates.relatedKeywords ||
            loadingStates.multipleRelatedKeywords
          }
        >
          {loadingStates.relatedKeywords ||
          loadingStates.multipleRelatedKeywords
            ? 'Analizuję...'
            : 'Analizuj powiązane słowa kluczowe'}
        </button>
        <button
          type='submit'
          className={styles.button}
          onClick={(e) => handleSubmit(e, onTop3Submit)}
          disabled={
            loadingStates.top3Results || loadingStates.multipleTop3Results
          }
        >
          {loadingStates.top3Results || loadingStates.multipleTop3Results
            ? 'Pobieram...'
            : 'Pobierz TOP 3 wyniki'}
        </button>
      </div>
    </form>
  );
};

export default KeywordInput;
