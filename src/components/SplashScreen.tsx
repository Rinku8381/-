import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/splash.module.css';
import TermsModal from '@/components/TermsModal';

export default function SplashScreen(): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fireflyContainerRef = useRef<HTMLDivElement>(null);
  const dustContainerRef = useRef<HTMLDivElement>(null);
  const risingParticlesRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [typingSequence, setTypingSequence] = useState({
    currentLine: 0,
    currentText: '',
    showCursor: true,
    isComplete: false,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => {
        setShowContent(true);
        setTimeout(() => setShowAvatar(true), 1500); // delay avatar after portal
      }, 800);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (fireflyContainerRef.current) {
      const fireflies = fireflyContainerRef.current.querySelectorAll(
        `.${styles.firefly}`
      );
      fireflies.forEach((firefly, index) => {
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        const delay = Math.random() * 8;
        const duration = 8 + Math.random() * 6;

        (firefly as HTMLElement).style.left = `${left}%`;
        (firefly as HTMLElement).style.top = `${top}%`;
        (firefly as HTMLElement).style.animationDelay = `${delay}s`;
        (firefly as HTMLElement).style.animationDuration = `${duration}s`;
      });
    }
    if (dustContainerRef.current) {
      const dustParticles = dustContainerRef.current.querySelectorAll(
        `.${styles.dustParticle}`
      );
      dustParticles.forEach(particle => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 15 + Math.random() * 10;

        (particle as HTMLElement).style.left = `${left}%`;
        (particle as HTMLElement).style.animationDelay = `${delay}s`;
        (particle as HTMLElement).style.animationDuration = `${duration}s`;
      });
    }

    // Initialize rising particles
    if (risingParticlesRef.current) {
      const risingParticles = risingParticlesRef.current.querySelectorAll(
        `.${styles.neonParticle}`
      );
      risingParticles.forEach(particle => {
        const left = Math.random() * 100;
        const delay = Math.random() * 10;
        const duration = 8 + Math.random() * 6;

        (particle as HTMLElement).style.left = `${left}%`;
        (particle as HTMLElement).style.animationDelay = `${delay}s`;
        (particle as HTMLElement).style.animationDuration = `${duration}s`;
      });
    }
  }, [showContent]);

  // Typing sequence effect
  useEffect(() => {
    if (!showContent) return;

    const typingTexts = [
      'Initializing neural core...',
      'Authenticating user...',
      'Welcome, Master.',
    ];

    let currentLineIndex = 0;
    let currentCharIndex = 0;
    let typingTimer: NodeJS.Timeout;

    const typeNextChar = () => {
      if (currentLineIndex >= typingTexts.length) {
        setTypingSequence(prev => ({ ...prev, isComplete: true }));
        return;
      }

      const currentFullText = typingTexts[currentLineIndex];

      if (currentFullText && currentCharIndex <= currentFullText.length) {
        setTypingSequence(prev => ({
          ...prev,
          currentLine: currentLineIndex,
          currentText: currentFullText.substring(0, currentCharIndex),
        }));
        currentCharIndex++;
        typingTimer = setTimeout(typeNextChar, 80);
      } else {
        // Line complete, pause then move to next
        setTimeout(() => {
          currentLineIndex++;
          currentCharIndex = 0;
          if (currentLineIndex < typingTexts.length) {
            typingTimer = setTimeout(typeNextChar, 500);
          } else {
            setTypingSequence(prev => ({ ...prev, isComplete: true }));
          }
        }, 1200);
      }
    };

    // Start typing after a delay
    const startDelay = setTimeout(() => {
      typeNextChar();
    }, 1000);

    return () => {
      clearTimeout(typingTimer);
      clearTimeout(startDelay);
    };
  }, [showContent]);

  // Cursor blinking effect
  useEffect(() => {
    if (typingSequence.isComplete) return;

    const cursorTimer = setInterval(() => {
      setTypingSequence(prev => ({ ...prev, showCursor: !prev.showCursor }));
    }, 530);

    return () => clearInterval(cursorTimer);
  }, [typingSequence.isComplete]);

  const generateFireflies = () => {
    const colors = ['Cyan', 'Magenta', 'Violet', 'Blue'];
    const sizes = ['Tiny', 'Small', 'Medium'];
    const fireflies = [];

    for (let i = 0; i < 25; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];
      fireflies.push({ id: i, color, size });
    }
    return fireflies;
  };

  const fireflies = generateFireflies();

  const handleAccept = () => {
    setShowTerms(false);
    setTimeout(() => {
      router.push('/login');
    }, 300);
  };

  const handleDecline = () => {
    setShowTerms(false);
  };

  return (
    <main className={styles.splashMain}>
      <audio ref={audioRef} loop preload='auto'>
        <source
          src='/assets/splash/SplashFuturisticSynthwave.mp3'
          type='audio/mpeg'
        />
      </audio>

      <div className={styles.animatedBackground}>
        <div className={styles.crackedGlass}></div>
        <div className={styles.dynamicGlow}></div>
        <div className={styles.layeredGlow}></div>
      </div>

      {/* Rising Neon Particles */}
      <div ref={risingParticlesRef} className={styles.risingParticles}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`${styles.neonParticle} ${styles[`particle${(i % 4) + 1}`]}`}
          />
        ))}
      </div>

      <div ref={fireflyContainerRef} className={styles.fireflyContainer}>
        {fireflies.map(firefly => (
          <div
            key={firefly.id}
            className={`${styles.firefly} ${styles[`firefly${firefly.color}`]} ${styles[`firefly${firefly.size}`]}`}
          />
        ))}
      </div>

      <div ref={dustContainerRef} className={styles.dustParticles}>
        {[...Array(15)].map((_, i) => (
          <div key={i} className={styles.dustParticle} />
        ))}
      </div>

      {!showTerms && isLoaded && showContent && (
        <div className={styles.splashContainer}>
          {/* Typing Intro Text Sequence */}
          {!typingSequence.isComplete && (
            <div className={styles.typingIntro}>
              <span className={styles.typingText}>
                {typingSequence.currentText}
                {typingSequence.showCursor && (
                  <span className={styles.cursor}>|</span>
                )}
              </span>
            </div>
          )}

          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlowRing}></div>
            <div className={styles.avatarPulseRing}></div>
            <div className={styles.avatarPortal}>
              <div className={styles.portalRing1}></div>
              <div className={styles.portalRing2}></div>
              <div className={styles.portalRing3}></div>
              <div className={styles.portalCenter}></div>
            </div>
            {showAvatar && (
              <img
                src='/assets/splash/SeraphineAvatar.gif'
                alt='Seraphine Avatar'
                className={styles.avatarImage}
              />
            )}
          </div>

          <div className={styles.titleContainer}>
            <h1
              className={`${styles.splashTitle} ${isLoaded ? styles.loaded : ''} ${styles.holoSwipe}`}
            >
              <span className={styles.titleLine1}>Seraphine Hybrid</span>
              <span className={styles.titleLine2}>V1.5</span>
            </h1>
            <div className={styles.titleGlitch}>
              <span className={styles.titleLine1}>Seraphine Hybrid</span>
              <span className={styles.titleLine2}>V1.5</span>
            </div>
          </div>

          <p
            className={`${styles.splashSubtitle} ${isLoaded ? styles.loaded : ''} ${styles.holoSwipe}`}
          >
            Your Home. Your House. Your Seraphine.
          </p>

          <div className={styles.buttonContainer}>
            <button
              className={`${styles.startButton} ${isLoaded ? styles.loaded : ''}`}
              onClick={() => {
                audioRef.current?.play();
                setShowTerms(true);
              }}
            >
              <span className={styles.buttonText}>Get Started</span>
              <div className={styles.buttonGlow}></div>
              <div className={styles.buttonRipple}></div>
            </button>

            {/* Loading Plasma Orb */}
            <div className={styles.plasmaOrbContainer}>
              <div className={styles.plasmaOrb}>
                <div className={styles.orbCore}></div>
                <div className={styles.orbRing1}></div>
                <div className={styles.orbRing2}></div>
                <div className={styles.orbRing3}></div>
                <div className={styles.orbGlow}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showTerms && (
        <TermsModal
          isVisible={showTerms}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
      )}
    </main>
  );
}

