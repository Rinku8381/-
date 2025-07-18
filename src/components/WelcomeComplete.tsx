"use client";

import React from 'react';
import styles from '../styles/splash.module.css';

interface WelcomeCompleteProps {
  onToDashboard: () => void;
}

export default function WelcomeComplete({ onToDashboard }: WelcomeCompleteProps) {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.welcomeContent}>
        <h2 className={styles.welcomeTitle}>Welcome to Seraphine!</h2>
        <p className={styles.welcomeText}>
          Your setup is complete. Let's get started!
        </p>
        <button className={styles.startButton} onClick={onToDashboard}>
          Start Exploring
        </button>
      </div>
    </div>
  );
}
