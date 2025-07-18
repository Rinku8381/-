// src/components/LoginScreen.tsx

'use client';

import { useState } from 'react';
import { loginUser } from '@/utils/auth';
import styles from '@/styles/login.module.css';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const success = loginUser(username, password);
    if (success) {
      setError('');
      onLoginSuccess();
    } else {
      setError('❌ Invalid username or password');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginContent}>
        <h2 className={styles.loginTitle}>Welcome to Seraphine</h2>

        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Username</label>
            <input
              className={styles.formInput}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Password</label>
            <input
              className={styles.formInput}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button className={styles.loginButton} onClick={handleLogin}>
            Log In
          </button>

          {error && <p className={styles.error}>{error}</p>}
        </div>
      </div>
    </div>
  );
}
