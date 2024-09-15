import React from 'react';
import styles from '../styles/TabSwitcher.module.css';

const TabSwitcher = ({ intentMode, setIntentMode }) => {
  return (
    <div className={styles.tabSwitcher}>
      <button
        className={`${styles.tabButton} ${
          intentMode === 'single' ? styles.active : ''
        }`}
        onClick={() => setIntentMode('single')}
      >
        Jedna intencja
      </button>
      <button
        className={`${styles.tabButton} ${
          intentMode === 'multiple' ? styles.active : ''
        }`}
        onClick={() => setIntentMode('multiple')}
      >
        Wiele intencji
      </button>
    </div>
  );
};

export default TabSwitcher;
