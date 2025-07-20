'use client';

import React from 'react';
import { Loader2, Sparkles, Zap } from 'lucide-react';
import styles from '@/styles/LoadingComponents.module.css';

interface CyberpunkLoaderProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'spinner' | 'pulse' | 'dots' | 'neural';
  text?: string;
  color?: 'cyan' | 'magenta' | 'violet' | 'green';
  className?: string;
}

const CyberpunkLoader: React.FC<CyberpunkLoaderProps> = ({
  size = 'medium',
  variant = 'spinner',
  text,
  color = 'cyan',
  className = '',
}) => {
  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
            <Loader2 className={styles.spinnerIcon} />
          </div>
        );

      case 'pulse':
        return (
          <div className={`${styles.pulse} ${styles[size]} ${styles[color]}`}>
            <Sparkles className={styles.pulseIcon} />
          </div>
        );

      case 'dots':
        return (
          <div className={`${styles.dots} ${styles[size]} ${styles[color]}`}>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
            <div className={styles.dot}></div>
          </div>
        );

      case 'neural':
        return (
          <div className={`${styles.neural} ${styles[size]} ${styles[color]}`}>
            <div className={styles.neuralCore}>
              <Zap className={styles.neuralIcon} />
              <div className={styles.neuralRings}>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
                <div className={styles.ring}></div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`${styles.spinner} ${styles[size]} ${styles[color]}`}>
            <Loader2 className={styles.spinnerIcon} />
          </div>
        );
    }
  };

  return (
    <div className={`${styles.loaderContainer} ${className}`}>
      {renderLoader()}
      {text && (
        <div className={`${styles.loaderText} ${styles[color]}`}>{text}</div>
      )}
    </div>
  );
};

interface SkeletonProps {
  variant?: 'text' | 'image' | 'card' | 'grid';
  count?: number;
  animated?: boolean;
  className?: string;
}

const CyberpunkSkeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  count = 1,
  animated = true,
  className = '',
}) => {
  const renderSkeleton = () => {
    switch (variant) {
      case 'text':
        return Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`${styles.skeletonText} ${styles[`textWidth${(i % 3) + 1}`]} ${animated ? styles.animated : ''}`}
          />
        ));

      case 'image':
        return Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`${styles.skeletonImage} ${animated ? styles.animated : ''}`}
          />
        ));

      case 'card':
        return Array.from({ length: count }, (_, i) => (
          <div
            key={i}
            className={`${styles.skeletonCard} ${animated ? styles.animated : ''}`}
          >
            <div className={styles.skeletonImage} />
            <div className={styles.skeletonContent}>
              <div className={styles.skeletonText} />
              <div className={`${styles.skeletonText} ${styles.textWidth60}`} />
            </div>
          </div>
        ));

      case 'grid':
        return (
          <div className={styles.skeletonGrid}>
            {Array.from({ length: count }, (_, i) => (
              <div
                key={i}
                className={`${styles.skeletonGridItem} ${animated ? styles.animated : ''}`}
              />
            ))}
          </div>
        );

      default:
        return (
          <div
            className={`${styles.skeletonText} ${animated ? styles.animated : ''}`}
          />
        );
    }
  };

  return (
    <div className={`${styles.skeletonContainer} ${className}`}>
      {renderSkeleton()}
    </div>
  );
};

interface LoadingOverlayProps {
  isVisible: boolean;
  text?: string;
  variant?: 'neural' | 'pulse' | 'dots';
  onCancel?: () => void;
  progress?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  text = 'Processing...',
  variant = 'neural',
  onCancel,
  progress,
}) => {
  if (!isVisible) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <CyberpunkLoader variant={variant} size='large' text={text} />

        {progress !== undefined && (
          <div className={styles.progressContainer}>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progressFill} ${styles[`progress${Math.floor(progress / 10) * 10}`]}`}
              />
            </div>
            <span className={styles.progressText}>{Math.round(progress)}%</span>
          </div>
        )}

        {onCancel && (
          <button
            onClick={onCancel}
            className={styles.cancelButton}
            aria-label='Cancel operation'
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export { CyberpunkLoader, CyberpunkSkeleton, LoadingOverlay };
export default CyberpunkLoader;
