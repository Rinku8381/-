// TermsModal.tsx - Cyberpunk Terms & Conditions Modal

'use client';

import React, { useEffect, useState } from 'react';
import styles from '../styles/terms.module.css';

interface TermsModalProps {
  onAccept: () => void;
  onDecline: () => void;
  isVisible: boolean;
}

export default function TermsModal({
  onAccept,
  onDecline,
  isVisible,
}: TermsModalProps) {
  const [particleElements, setParticleElements] = useState<JSX.Element[]>([]);

  // Generate floating particles for background effect
  useEffect(() => {
    const particles = Array.from({ length: 15 }, (_, i) => (
      <div key={i} className={`${styles.neonParticle} neonParticle${i}`} />
    ));
    setParticleElements(particles);
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={styles.cyberpunkModalOverlay}
      role='dialog'
      aria-modal='true'
    >
      {/* Animated Background Particles */}
      <div className={styles.particleContainer}>{particleElements}</div>

      {/* Glassmorphism Modal Container */}
      <div className={styles.cyberpunkModal}>
        {/* Animated Border Glow */}
        <div className={styles.modalBorderGlow}></div>

        {/* Header Section */}
        <div className={styles.modalHeader}>
          <div className={styles.titleContainer}>
            <div className={styles.warningIcon}>⚠️</div>
            <h1 className={styles.modalTitle}>
              TERMS & CONDITIONS
              <span className={styles.ageBadge}>18+ ACCESS ONLY</span>
            </h1>
          </div>
          <div className={styles.neuralSeparator}></div>
        </div>

        {/* Scrollable Content */}
        <div className={styles.modalContent}>
          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🔞</span>
              <h3>ADULT CONTENT WARNING</h3>
            </div>
            <p>
              SeraphineHybrid V1.5 contains mature themes, adult content, and AI
              interactions designed exclusively for users 18 years or older. By
              proceeding, you confirm you meet this age requirement and
              understand the nature of this application.
            </p>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🔒</span>
              <h3>PRIVACY POLICY & DATA USE</h3>
            </div>
            <p>
              Your interactions with SeraphineHybrid are processed using
              advanced neural networks. Personal data is encrypted and stored
              locally. Voice patterns, preferences, and behavioral data enhance
              your AI companion experience while maintaining strict
              confidentiality protocols.
            </p>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>📋</span>
              <h3>USER AGREEMENT</h3>
            </div>
            <p>
              You agree to use SeraphineHybrid responsibly and within legal
              boundaries. The AI companion is designed for personal
              entertainment and emotional support. Misuse of the system or
              attempts to manipulate the AI for harmful purposes will result in
              immediate termination of access.
            </p>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>⚖️</span>
              <h3>YOUR RIGHTS & OBLIGATIONS</h3>
            </div>
            <p>
              You retain ownership of your personal data and can request
              deletion at any time. You are obligated to provide accurate age
              verification, maintain system security, and respect the AI&apos;s
              learning boundaries. Harassment or abuse of the AI system is
              strictly prohibited.
            </p>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🚫</span>
              <h3>TERMINATION & VIOLATIONS</h3>
            </div>
            <p>
              Access may be terminated for violation of terms, age
              misrepresentation, or system abuse. Upon termination, all
              personalization data will be permanently deleted. Appeals can be
              submitted through official channels within 30 days of termination.
            </p>
          </div>

          <div className={styles.contentSection}>
            <div className={styles.sectionHeader}>
              <span className={styles.sectionIcon}>🌐</span>
              <h3>CYBERPUNK NETWORK ETHICS</h3>
            </div>
            <p>
              SeraphineHybrid operates within the Cyberpunk Network Protocol,
              emphasizing digital consciousness, ethical AI relationships, and
              human-machine symbiosis. Users are expected to maintain respect
              for both human and artificial intelligence within this ecosystem.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.modalActions}>
          <button className={styles.declineBtn} onClick={onDecline}>
            <span className={styles.btnIcon}>❌</span>
            DECLINE
          </button>
          <button className={styles.acceptBtn} onClick={onAccept}>
            <span className={styles.btnIcon}>✨</span>
            ACCEPT & ENTER
          </button>
        </div>
      </div>
    </div>
  );
}

