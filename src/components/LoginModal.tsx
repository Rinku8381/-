import React, { useState, useEffect } from 'react';
import styles from '@/styles/login.module.css';

interface LoginModalProps {
  isVisible: boolean;
  onLogin: () => void;
  onCancel: () => void;
}

export default function LoginModal({
  isVisible,
  onLogin,
  onCancel,
}: LoginModalProps): JSX.Element {
  const [formData, setFormData] = useState({ username: '', accessCode: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingSequence, setLoadingSequence] = useState({
    currentLine: 0,
    currentText: '',
    showCursor: true,
    isComplete: false,
  });
  const [showForm, setShowForm] = useState(false);

  // Show form after modal animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowForm(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowForm(false);
      setIsSubmitting(false);
      setLoadingSequence({
        currentLine: 0,
        currentText: '',
        showCursor: true,
        isComplete: false,
      });
      return undefined;
    }
  }, [isVisible]);

  // Loading sequence animation
  useEffect(() => {
    if (!isSubmitting) return;

    const loadingTexts = [
      'Decrypting access...',
      'Validating neural ID...',
      'Access Granted.',
    ];

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentLineIndex >= loadingTexts.length) {
        setLoadingSequence(prev => ({ ...prev, isComplete: true }));
        setTimeout(() => {
          onLogin();
        }, 1500);
        return;
      }

      const currentFullText = loadingTexts[currentLineIndex];

      if (currentFullText && currentCharIndex <= currentFullText.length) {
        setLoadingSequence(prev => ({
          ...prev,
          currentLine: currentLineIndex,
          currentText: currentFullText.substring(0, currentCharIndex),
        }));
        currentCharIndex++;
        typingTimer = setTimeout(typeNextChar, 60);
      } else {
        setTimeout(() => {
          currentLineIndex++;
          currentCharIndex = 0;
          if (currentLineIndex < loadingTexts.length) {
            typingTimer = setTimeout(typeNextChar, 800);
          } else {
            setLoadingSequence(prev => ({ ...prev, isComplete: true }));
            setTimeout(() => {
              onLogin();
            }, 1500);
          }
        }, 1000);
      }
    };

    const startDelay = setTimeout(() => {
      typeNextChar();
    }, 500);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(startDelay);
    };
  }, [isSubmitting, onLogin]);

  // Cursor blinking effect
  useEffect(() => {
    if (loadingSequence.isComplete || !isSubmitting) return;

    const cursorTimer = setInterval(() => {
      setLoadingSequence(prev => ({ ...prev, showCursor: !prev.showCursor }));
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [loadingSequence.isComplete, isSubmitting]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.username && formData.accessCode) {
      setIsSubmitting(true);
    }
  };

  const handleCancel = () => {
    setFormData({ username: '', accessCode: '' });
    onCancel();
  };

  if (!isVisible) return <></>;

  return (
    <div
      className={`${styles.loginOverlay} ${isVisible ? styles.visible : styles.hidden}`}
    >
      {/* Background Particles */}
      <div className={styles.backgroundParticles}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className={`${styles.loginParticle} ${styles[`loginParticle${(i % 3) + 1}`]}`}
          />
        ))}
      </div>

      <div
        className={`${styles.loginModal} ${showForm ? styles.modalVisible : ''}`}
      >
        {!isSubmitting ? (
          <>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <h2 className={styles.loginTitle}>
                <span className={styles.titlePrimary}>SERAPHINE</span>
                <span className={styles.titleSecondary}>LOGIN SYSTEM</span>
              </h2>
              <div className={styles.titleGlitch}>
                <span className={styles.titlePrimary}>SERAPHINE</span>
                <span className={styles.titleSecondary}>LOGIN SYSTEM</span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className={styles.loginForm}>
              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Username</label>
                <div className={styles.inputWrapper}>
                  <input
                    type='text'
                    value={formData.username}
                    onChange={e =>
                      handleInputChange('username', e.target.value)
                    }
                    className={styles.loginInput}
                    placeholder='Enter neural ID...'
                    required
                  />
                  <div className={styles.inputGlow}></div>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.inputLabel}>Access Code</label>
                <div className={styles.inputWrapper}>
                  <input
                    type='password'
                    value={formData.accessCode}
                    onChange={e =>
                      handleInputChange('accessCode', e.target.value)
                    }
                    className={styles.loginInput}
                    placeholder='Enter access key...'
                    required
                  />
                  <div className={styles.inputGlow}></div>
                </div>
              </div>

              <div className={styles.buttonGroup}>
                <button type='submit' className={styles.loginButton}>
                  <span className={styles.buttonText}>INITIALIZE ACCESS</span>
                  <div className={styles.buttonGlow}></div>
                  <div className={styles.buttonRipple}></div>
                </button>

                <button
                  type='button'
                  onClick={handleCancel}
                  className={styles.cancelButton}
                >
                  <span className={styles.buttonText}>CANCEL</span>
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Loading Sequence */
          <div className={styles.loadingContainer}>
            <div className={styles.loadingOrb}>
              <div className={styles.orbCore}></div>
              <div className={styles.orbRing1}></div>
              <div className={styles.orbRing2}></div>
            </div>

            <div className={styles.loadingText}>
              <span className={styles.loadingLine}>
                {loadingSequence.currentText}
                {loadingSequence.showCursor && (
                  <span className={styles.loadingCursor}>|</span>
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
