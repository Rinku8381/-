"use client";

import React from 'react';
import styles from '../styles/splash.module.css';

interface OnboardingStep3Props {
  onNext: () => void;
  onBack: () => void;
}

export default function OnboardingStep3({ onNext, onBack }: OnboardingStep3Props) {
  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingContent}>
        <h2 className={styles.onboardingTitle}>Final Setup</h2>
        <p className={styles.onboardingText}>
          Step 3: Complete your setup
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
        <div className={styles.onboardingButtons}>
          <button className={styles.backButton} onClick={onBack}>
            Back
          </button>
          <button className={styles.nextButton} onClick={onNext}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
