'use client';

import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Video,
  Mic,
  UserCircle,
  Lock,
  Zap,
  Sparkles,
  Clock,
  Crown,
  Wand2,
  Brain,
  Palette,
  Play,
  Upload,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface MiniAIFeaturesProps {
  isVisible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

interface DailyLimit {
  used: number;
  total: number;
  resetTime: string;
}

interface AIFeature {
  id: string;
  name: string;
  icon: any;
  description: string;
  dailyLimit?: DailyLimit;
  isPremium: boolean;
  isLocked: boolean;
  action: string;
}

export default function MiniAIFeatures({
  isVisible,
  onClose,
  onUpgrade,
}: MiniAIFeaturesProps): JSX.Element | null {
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const [aiFeatures] = useState<AIFeature[]>([
    {
      id: 'image-gen',
      name: 'Image Generator',
      icon: ImageIcon,
      description: 'Create stunning AI-generated images',
      dailyLimit: { used: 1, total: 3, resetTime: '24:00:00' },
      isPremium: false,
      isLocked: false,
      action: 'Generate Image',
    },
    {
      id: 'voice-gen',
      name: 'Voice Generator',
      icon: Mic,
      description: 'Generate realistic AI voices',
      dailyLimit: { used: 2, total: 5, resetTime: '24:00:00' },
      isPremium: false,
      isLocked: false,
      action: 'Generate Voice',
    },
    {
      id: 'video-gen',
      name: 'Video Snippet',
      icon: Video,
      description: 'Create 1-second video clips',
      dailyLimit: { used: 0, total: 1, resetTime: '24:00:00' },
      isPremium: false,
      isLocked: false,
      action: 'Generate Video',
    },
    {
      id: 'avatar-gen',
      name: 'Avatar Generator',
      icon: UserCircle,
      description: 'Preview AI avatars (editor locked)',
      isPremium: true,
      isLocked: true,
      action: 'Preview Only',
    },
    {
      id: 'music-gen',
      name: 'Music Generator',
      icon: Wand2,
      description: 'Generate AI music tracks',
      isPremium: true,
      isLocked: true,
      action: 'Upgrade Required',
    },
    {
      id: 'code-gen',
      name: 'Code Assistant',
      icon: Brain,
      description: 'AI-powered coding help',
      isPremium: true,
      isLocked: true,
      action: 'Upgrade Required',
    },
    {
      id: 'art-style',
      name: 'Art Style Transfer',
      icon: Palette,
      description: 'Transform images with AI styles',
      isPremium: true,
      isLocked: true,
      action: 'Upgrade Required',
    },
    {
      id: 'video-full',
      name: 'Full Video Creator',
      icon: Play,
      description: 'Create full-length videos',
      isPremium: true,
      isLocked: true,
      action: 'Upgrade Required',
    },
  ]);

  if (!isVisible) return null;

  const handleFeatureClick = async (feature: AIFeature) => {
    if (feature.isLocked) {
      onUpgrade();
      return;
    }

    if (
      feature.dailyLimit &&
      feature.dailyLimit.used >= feature.dailyLimit.total
    ) {
      alert('Daily limit reached! Upgrade to Premium for unlimited access.');
      return;
    }

    setActiveFeature(feature.id);
    setGenerating(true);

    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 2000));

    setGenerating(false);
    setActiveFeature(null);

    // Update daily limit (mock)
    if (feature.dailyLimit) {
      feature.dailyLimit.used += 1;
    }
  };

  const getProgressPercent = (feature: AIFeature) => {
    if (!feature.dailyLimit) return 0;
    return (feature.dailyLimit.used / feature.dailyLimit.total) * 100;
  };

  const isLimitReached = (feature: AIFeature) => {
    if (!feature.dailyLimit) return false;
    return feature.dailyLimit.used >= feature.dailyLimit.total;
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.aiFeatureModal}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Sparkles size={24} />
            AI Features
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            title='Close'
          >
            ×
          </button>
        </div>

        <div className={styles.aiFeatureGrid}>
          {aiFeatures.map(feature => {
            const FeatureIcon = feature.icon;
            const isActive = activeFeature === feature.id;
            const limitReached = isLimitReached(feature);

            return (
              <div
                key={feature.id}
                className={`${styles.aiFeatureCard} ${feature.isLocked ? styles.lockedCard : ''} ${isActive ? styles.activeCard : ''}`}
              >
                <div className={styles.featureHeader}>
                  <div className={styles.featureIcon}>
                    <FeatureIcon size={32} />
                    {feature.isPremium && (
                      <div className={styles.premiumBadge}>
                        <Crown size={16} />
                      </div>
                    )}
                  </div>
                  <h3 className={styles.featureName}>{feature.name}</h3>
                </div>

                <p className={styles.featureDescription}>
                  {feature.description}
                </p>

                {feature.dailyLimit && (
                  <div className={styles.dailyLimitInfo}>
                    <div className={styles.limitText}>
                      {feature.dailyLimit.used}/{feature.dailyLimit.total} today
                    </div>
                    <div className={styles.limitProgress}>
                      <div
                        className={`${styles.limitBar} ${styles[`progress${Math.round(getProgressPercent(feature) / 10) * 10}`]}`}
                      />
                    </div>
                    <div className={styles.resetTime}>
                      <Clock size={12} />
                      Resets in {feature.dailyLimit.resetTime}
                    </div>
                  </div>
                )}

                <button
                  className={`${styles.featureButton} ${
                    feature.isLocked
                      ? styles.lockedButton
                      : limitReached
                        ? styles.limitButton
                        : styles.activeButton
                  }`}
                  onClick={() => handleFeatureClick(feature)}
                  disabled={generating && isActive}
                >
                  {generating && isActive ? (
                    <>
                      <div className={styles.spinner} />
                      Generating...
                    </>
                  ) : feature.isLocked ? (
                    <>
                      <Lock size={16} />
                      {feature.action}
                    </>
                  ) : limitReached ? (
                    <>
                      <Crown size={16} />
                      Upgrade for More
                    </>
                  ) : (
                    <>
                      <Zap size={16} />
                      {feature.action}
                    </>
                  )}
                </button>

                {feature.isLocked && (
                  <div className={styles.lockOverlay}>
                    <Lock size={48} />
                    <span>Premium Only</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Upload Section */}
        <div className={styles.quickUploadSection}>
          <h3>Quick Upload & Process</h3>
          <div className={styles.uploadArea}>
            <Upload size={32} />
            <p>Drag & drop files here or click to upload</p>
            <input
              type='file'
              multiple
              accept='image/*,video/*,audio/*'
              className={styles.fileInput}
              title='Upload files for AI processing'
              aria-label='Upload files for AI processing'
            />
          </div>
        </div>

        <div className={styles.featureStats}>
          <div className={styles.statItem}>
            <Zap size={20} />
            <span>Free features used today</span>
            <span className={styles.statValue}>
              {aiFeatures
                .filter(f => f.dailyLimit)
                .reduce((sum, f) => sum + (f.dailyLimit?.used || 0), 0)}
            </span>
          </div>
          <div className={styles.statItem}>
            <Crown size={20} />
            <span>Premium features</span>
            <span className={styles.statValue}>
              {aiFeatures.filter(f => f.isPremium).length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
