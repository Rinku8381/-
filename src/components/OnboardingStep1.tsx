"use client";

import React from 'react';
import styles from '../styles/splash.module.css';

interface OnboardingStep1Props {
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingStep1({ onNext, onSkip }: OnboardingStep1Props) {
  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingContent}>
        <h2 className={styles.onboardingTitle}>Welcome to Seraphine</h2>
        <p className={styles.onboardingText}>
          Step 1: Set up your profile
        </p>
        <div className={styles.onboardingProgress}>
          <div className={styles.progressStep}>
            <span className={styles.progressNumber}>1</span>
          </div>
          <div className={styles.progressStep}>
            <span className={styles.progressNumber}>2</span>
          </div>
          <div className={styles.progressStep}>
            <span className={styles.progressNumber}>3</span>
          </div>
        </div>
        <button className={styles.nextButton} onClick={onNext}>
          Next
        </button>
        <button className={styles.skipButton} onClick={onSkip}>
          Skip
        </button>
      </div>
    </div>
  );
}
