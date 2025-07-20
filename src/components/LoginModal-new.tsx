import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/login.module.css';
import {
  Mail,
  Phone,
  Lock,
  User,
  Key,
  Shield,
  Chrome,
  Facebook,
  Eye,
  EyeOff,
  ArrowLeft,
  Zap,
  Settings,
} from 'lucide-react';

type LoginType = 'selector' | 'free' | 'premium' | 'admin' | 'developer';

interface LoginModalProps {
  isVisible: boolean;
  onLogin: (userType: string, redirectPath: string) => void;
  onCancel: () => void;
}

interface LoadingSequence {
  currentLine: number;
  currentText: string;
  showCursor: boolean;
  isComplete: boolean;
}

export default function LoginModal({
  isVisible,
  onLogin,
  onCancel,
}: LoginModalProps): JSX.Element {
  const [currentView, setCurrentView] = useState<LoginType>('selector');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Form data for different login types
  const [freeFormData, setFreeFormData] = useState({ email: '', phone: '' });
  const [premiumFormData, setPremiumFormData] = useState({
    emailOrPhone: '',
    subscriptionCode: '',
  });
  const [adminFormData, setAdminFormData] = useState({
    email: '',
    password: '',
  });
  const [devFormData, setDevFormData] = useState({ devKey: '', otp: '' });

  const [loadingSequence, setLoadingSequence] = useState<LoadingSequence>({
    currentLine: 0,
    currentText: '',
    showCursor: true,
    isComplete: false,
  });

  // Show form after modal animation
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => setShowForm(true), 300);
      return () => clearTimeout(timer);
    } else {
      setShowForm(false);
      setIsSubmitting(false);
      setCurrentView('selector');
      setError('');
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

    const getLoadingTexts = () => {
      switch (currentView) {
        case 'premium':
          return [
            'Validating access...',
            'Decrypting neural key...',
            'Access Granted.',
          ];
        case 'admin':
          return [
            'Authenticating admin...',
            'Verifying permissions...',
            'Admin Access Granted.',
          ];
        case 'developer':
          return [
            'Validating dev key...',
            'Processing OTP...',
            'Developer Access Granted.',
          ];
        default:
          return ['Processing...', 'Validating...', 'Access Granted.'];
      }
    };

    const loadingTexts = getLoadingTexts();
    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentLineIndex >= loadingTexts.length) {
        setLoadingSequence(prev => ({ ...prev, isComplete: true }));
        setTimeout(() => {
          const redirectPaths = {
            premium: '/dashboard/premium',
            admin: '/admin/dashboard',
            developer: '/dev/console',
            free: '/dashboard/free',
          };
          onLogin(
            currentView,
            redirectPaths[currentView as keyof typeof redirectPaths] ||
              '/dashboard'
          );
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
              const redirectPaths = {
                premium: '/dashboard/premium',
                admin: '/admin/dashboard',
                developer: '/dev/console',
                free: '/dashboard/free',
              };
              onLogin(
                currentView,
                redirectPaths[currentView as keyof typeof redirectPaths] ||
                  '/dashboard'
              );
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
  }, [isSubmitting, currentView, onLogin]);

  // Cursor blinking effect
  useEffect(() => {
    if (loadingSequence.isComplete || !isSubmitting) return;

    const cursorTimer = setInterval(() => {
      setLoadingSequence(prev => ({ ...prev, showCursor: !prev.showCursor }));
    }, 500);

    return () => clearInterval(cursorTimer);
  }, [loadingSequence.isComplete, isSubmitting]);

  // Handle form submissions
  const handleFreeLogin = (
    method: 'google' | 'facebook' | 'email' | 'phone'
  ) => {
    setIsSubmitting(true);
    setCurrentView('free');
    // Simulate API call
    setTimeout(() => {
      onLogin('free', '/dashboard/free');
    }, 2000);
  };

  const handlePremiumSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!premiumFormData.emailOrPhone || !premiumFormData.subscriptionCode) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate subscription code validation
    if (premiumFormData.subscriptionCode.toUpperCase().startsWith('PREM')) {
      setIsSubmitting(true);
    } else {
      setError('Invalid subscription code');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!adminFormData.email || !adminFormData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate admin validation
    if (
      adminFormData.email.includes('@admin') &&
      adminFormData.password.length >= 6
    ) {
      setIsSubmitting(true);
    } else {
      setError('Invalid admin credentials');
    }
  };

  const handleDevSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!devFormData.devKey || !devFormData.otp) {
      setError('Please fill in all fields');
      return;
    }

    // Simulate dev key validation
    if (devFormData.devKey.startsWith('DEV_') && devFormData.otp.length === 6) {
      setIsSubmitting(true);
    } else {
      setError('Invalid developer credentials');
    }
  };

  const handleBack = () => {
    setCurrentView('selector');
    setError('');
  };

  const handleCancel = () => {
    setCurrentView('selector');
    setError('');
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
                <span className={styles.titleSecondary}>ACCESS CONTROL</span>
              </h2>
              <div className={styles.titleGlitch}>
                <span className={styles.titlePrimary}>SERAPHINE</span>
                <span className={styles.titleSecondary}>ACCESS CONTROL</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className={styles.errorMessage}>
                <Shield className={styles.errorIcon} />
                {error}
              </div>
            )}

            {/* Login Type Selector */}
            {currentView === 'selector' && (
              <div className={styles.loginSelector}>
                <div className={styles.selectorGrid}>
                  <button
                    onClick={() => setCurrentView('free')}
                    className={`${styles.selectorButton} ${styles.freeButton}`}
                  >
                    <User className={styles.selectorIcon} />
                    <span className={styles.selectorTitle}>Free Access</span>
                    <span className={styles.selectorDesc}>Basic features</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('premium')}
                    className={`${styles.selectorButton} ${styles.premiumButton}`}
                  >
                    <Zap className={styles.selectorIcon} />
                    <span className={styles.selectorTitle}>Premium</span>
                    <span className={styles.selectorDesc}>Full AI suite</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('admin')}
                    className={`${styles.selectorButton} ${styles.adminButton}`}
                  >
                    <Shield className={styles.selectorIcon} />
                    <span className={styles.selectorTitle}>Admin</span>
                    <span className={styles.selectorDesc}>System control</span>
                  </button>

                  <button
                    onClick={() => setCurrentView('developer')}
                    className={`${styles.selectorButton} ${styles.devButton}`}
                  >
                    <Settings className={styles.selectorIcon} />
                    <span className={styles.selectorTitle}>Developer</span>
                    <span className={styles.selectorDesc}>Debug console</span>
                  </button>
                </div>

                <button onClick={handleCancel} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            )}

            {/* Free User Login */}
            {currentView === 'free' && (
              <div className={styles.loginForm}>
                <button onClick={handleBack} className={styles.backButton}>
                  <ArrowLeft className={styles.backIcon} />
                  Back
                </button>

                <h3 className={styles.formTitle}>Free Access Login</h3>

                <div className={styles.socialButtons}>
                  <button
                    onClick={() => handleFreeLogin('google')}
                    className={`${styles.socialButton} ${styles.googleButton}`}
                  >
                    <Chrome className={styles.socialIcon} />
                    Continue with Google
                  </button>

                  <button
                    onClick={() => handleFreeLogin('facebook')}
                    className={`${styles.socialButton} ${styles.facebookButton}`}
                  >
                    <Facebook className={styles.socialIcon} />
                    Continue with Facebook
                  </button>
                </div>

                <div className={styles.divider}>
                  <span>or</span>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} />
                    <input
                      type='email'
                      value={freeFormData.email}
                      onChange={e =>
                        setFreeFormData(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Enter your email...'
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Phone className={styles.inputIcon} />
                    <input
                      type='tel'
                      value={freeFormData.phone}
                      onChange={e =>
                        setFreeFormData(prev => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Or enter phone number...'
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <button
                  onClick={() => handleFreeLogin('email')}
                  className={styles.loginButton}
                  disabled={!freeFormData.email && !freeFormData.phone}
                >
                  <span className={styles.buttonText}>
                    ACCESS FREE DASHBOARD
                  </span>
                  <div className={styles.buttonGlow}></div>
                </button>
              </div>
            )}

            {/* Premium User Login */}
            {currentView === 'premium' && (
              <form onSubmit={handlePremiumSubmit} className={styles.loginForm}>
                <button
                  type='button'
                  onClick={handleBack}
                  className={styles.backButton}
                >
                  <ArrowLeft className={styles.backIcon} />
                  Back
                </button>

                <h3 className={styles.formTitle}>Premium Access</h3>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Mail className={styles.inputIcon} />
                    <input
                      type='text'
                      value={premiumFormData.emailOrPhone}
                      onChange={e =>
                        setPremiumFormData(prev => ({
                          ...prev,
                          emailOrPhone: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Email or phone number...'
                      required
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Key className={styles.inputIcon} />
                    <input
                      type='text'
                      value={premiumFormData.subscriptionCode}
                      onChange={e =>
                        setPremiumFormData(prev => ({
                          ...prev,
                          subscriptionCode: e.target.value.toUpperCase(),
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Premium subscription code...'
                      required
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <button type='submit' className={styles.loginButton}>
                  <span className={styles.buttonText}>ACTIVATE PREMIUM</span>
                  <div className={styles.buttonGlow}></div>
                </button>
              </form>
            )}

            {/* Admin Login */}
            {currentView === 'admin' && (
              <form onSubmit={handleAdminSubmit} className={styles.loginForm}>
                <button
                  type='button'
                  onClick={handleBack}
                  className={styles.backButton}
                >
                  <ArrowLeft className={styles.backIcon} />
                  Back
                </button>

                <h3 className={styles.formTitle}>Administrator Access</h3>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Shield className={styles.inputIcon} />
                    <input
                      type='email'
                      value={adminFormData.email}
                      onChange={e =>
                        setAdminFormData(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Admin email address...'
                      required
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Lock className={styles.inputIcon} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminFormData.password}
                      onChange={e =>
                        setAdminFormData(prev => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Admin password...'
                      required
                    />
                    <button
                      type='button'
                      onClick={() => setShowPassword(!showPassword)}
                      className={styles.passwordToggle}
                    >
                      {showPassword ? (
                        <EyeOff className={styles.eyeIcon} />
                      ) : (
                        <Eye className={styles.eyeIcon} />
                      )}
                    </button>
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <button type='submit' className={styles.loginButton}>
                  <span className={styles.buttonText}>ADMIN LOGIN</span>
                  <div className={styles.buttonGlow}></div>
                </button>
              </form>
            )}

            {/* Developer Login */}
            {currentView === 'developer' && (
              <form onSubmit={handleDevSubmit} className={styles.loginForm}>
                <button
                  type='button'
                  onClick={handleBack}
                  className={styles.backButton}
                >
                  <ArrowLeft className={styles.backIcon} />
                  Back
                </button>

                <h3 className={styles.formTitle}>Developer Console</h3>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Key className={styles.inputIcon} />
                    <input
                      type='text'
                      value={devFormData.devKey}
                      onChange={e =>
                        setDevFormData(prev => ({
                          ...prev,
                          devKey: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='Developer API key...'
                      required
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <div className={styles.inputGroup}>
                  <div className={styles.inputWrapper}>
                    <Settings className={styles.inputIcon} />
                    <input
                      type='text'
                      value={devFormData.otp}
                      onChange={e =>
                        setDevFormData(prev => ({
                          ...prev,
                          otp: e.target.value,
                        }))
                      }
                      className={styles.loginInput}
                      placeholder='6-digit OTP...'
                      maxLength={6}
                      required
                    />
                    <div className={styles.inputGlow}></div>
                  </div>
                </div>

                <button type='submit' className={styles.loginButton}>
                  <span className={styles.buttonText}>ACCESS DEV CONSOLE</span>
                  <div className={styles.buttonGlow}></div>
                </button>
              </form>
            )}
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
