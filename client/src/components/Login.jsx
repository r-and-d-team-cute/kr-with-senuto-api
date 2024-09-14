import React, { useState } from 'react';
import styles from '../styles/Login.module.css';

const Login = ({ onLogin, statusMessage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onLogin(email, password);
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginBox}>
        <h2 className={styles.title}>Logowanie</h2>
        {statusMessage && (
          <div
            className={`${styles.statusMessage} ${styles[statusMessage.type]}`}
          >
            {statusMessage.message}
          </div>
        )}
        <form
          className={styles.loginForm}
          onSubmit={handleSubmit}
        >
          <div className={styles.formGroup}>
            <input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.formGroup}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder='Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
            />
          </div>
          <div className={styles.checkbox}>
            <label>
              <input
                type='checkbox'
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              Pokaż hasełko
            </label>
          </div>
          <button
            type='submit'
            className={styles.loginButton}
          >
            ZALOGUJ SIĘ
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
