"use client";

import React from 'react';
import styles from '../styles/splash.module.css';

interface OnboardingStep2Props {
  onNext: () => void;
  onBack: () => void;
  onSkip: () => void;
}

export default function OnboardingStep2({ onNext, onBack, onSkip }: OnboardingStep2Props) {
  return (
    <div className={styles.onboardingContainer}>
      <div className={styles.onboardingContent}>
        <h2 className={styles.onboardingTitle}>Getting Started</h2>
        <p className={styles.onboardingText}>
          Step 2: Customize your settings
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
          <button className={styles.skipButton} onClick={onSkip}>
            Skip
          </button>
        </div>
      </div>
    </div>
  );
}
