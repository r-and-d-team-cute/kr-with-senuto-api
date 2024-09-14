import React from 'react';
import styles from '../styles/LoadingScreen.module.css';
import loadingGif from '../assets/naruto-running.gif'; // Załóżmy, że mamy taki plik

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingContent}>
        <img
          src={loadingGif}
          alt='Ładowanie'
          className={styles.loadingGif}
        />
        <h2 className={styles.loadingTitle}>Sprawdzanie statusu...</h2>
        <p className={styles.loadingMessage}>
          Upewniamy się, że jesteś dobrym ziomkiem. To może potrwać chwilę.
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;
