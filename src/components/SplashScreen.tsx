// SplashScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/styles/splash.module.css';
import TermsModal from '@/components/TermsModal';

export default function SplashScreen(): JSX.Element {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fireflyContainerRef = useRef<HTMLDivElement>(null);
  const dustContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      setTimeout(() => setShowContent(true), 500);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Set up firefly positions and animations
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

    // Set up dust particle positions and animations
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
  }, [showContent]);

  // Generate firefly data
  const generateFireflies = () => {
    const colors = ['Cyan', 'Magenta', 'Violet', 'Blue'];
    const sizes = ['Tiny', 'Small', 'Medium'];
    const fireflies = [];

    for (let i = 0; i < 25; i++) {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const size = sizes[Math.floor(Math.random() * sizes.length)];

      fireflies.push({
        id: i,
        color,
        size,
      });
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

      {/* Animated Background Layer */}
      <div className={styles.animatedBackground}>
        <div className={styles.crackedGlass}></div>
        <div className={styles.dynamicGlow}></div>
        <div className={styles.layeredGlow}></div>
      </div>

      {/* Firefly Particle System */}
      <div ref={fireflyContainerRef} className={styles.fireflyContainer}>
        {fireflies.map(firefly => (
          <div
            key={firefly.id}
            className={`${styles.firefly} ${styles[`firefly${firefly.color}`]} ${styles[`firefly${firefly.size}`]}`}
          />
        ))}
      </div>

      {/* Rising Dust Particles */}
      <div ref={dustContainerRef} className={styles.dustParticles}>
        {[...Array(15)].map((_, i) => (
          <div key={i} className={styles.dustParticle} />
        ))}
      </div>

      {!showTerms && isLoaded && showContent && (
        <div className={styles.splashContainer}>
          {/* Central Avatar with Glowing Frame */}
          <div className={styles.avatarWrapper}>
            <div className={styles.avatarGlowRing}></div>
            <div className={styles.avatarPulseRing}></div>
            <img
              src='/assets/splash/SeraphineAvatar.png'
              alt='Seraphine Avatar'
              className={styles.avatarImage}
            />
          </div>

          {/* Cyberpunk Title with Glitch Effect */}
          <div className={styles.titleContainer}>
            <h1
              className={`${styles.splashTitle} ${isLoaded ? styles.loaded : ''}`}
            >
              <span className={styles.titleLine1}>Seraphine</span>
              <span className={styles.titleLine2}>Hybrid</span>
            </h1>
            <div className={styles.titleGlitch}>
              <span className={styles.titleLine1}>Seraphine</span>
              <span className={styles.titleLine2}>Hybrid</span>
            </div>
          </div>

          <p
            className={`${styles.splashSubtitle} ${isLoaded ? styles.loaded : ''}`}
          >
            Welcome to the future of smart home automation
          </p>

          {/* Enhanced Start Button */}
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
// SplashScreen.tsx
