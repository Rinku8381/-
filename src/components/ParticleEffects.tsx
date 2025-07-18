'use client';

import React, { useEffect, useRef } from 'react';
import styles from '../styles/ParticleEffects.module.css';

export default function ParticleEffects() {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    const createParticle = (intensity: boolean = false) => {
      const particle = document.createElement('div');
      particle.className = styles.particle || '';

      if (intensity) {
        const highIntensityClass = styles.highIntensity;
        if (highIntensityClass) {
          particle.classList.add(highIntensityClass);
        }
      }

      const x = Math.random() * 200 - 100;
      const y = Math.random() * 200 - 100;
      particle.style.setProperty('--x', x.toString());
      particle.style.setProperty('--y', y.toString());

      container.appendChild(particle);

      setTimeout(
        () => {
          const fadeOutClass = styles.fadeOut;
          if (fadeOutClass) {
            particle.classList.add(fadeOutClass);
          }
          setTimeout(() => {
            particle.remove();
          }, 1000);
        },
        Math.random() * 5000 + 2000
      );
    };

    const interval = setInterval(() => {
      createParticle(Math.random() > 0.8);
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return <div ref={particlesRef} className={styles.particles || ''} />;
}
