'use client';

import React, { useState } from 'react';
import {
  Crown,
  X,
  Check,
  Zap,
  Star,
  Gift,
  Infinity,
  ArrowRight,
  Sparkles,
  Rocket,
  Shield,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface SubscriptionPopupProps {
  isVisible: boolean;
  onClose: () => void;
  onSubscribe: (planId: string) => void;
  trigger?: 'login' | 'upgrade' | 'limit';
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  period: string;
  features: string[];
  highlight?: string;
  popular?: boolean;
}

export default function SubscriptionPopup({
  isVisible,
  onClose,
  onSubscribe,
  trigger = 'upgrade',
}: SubscriptionPopupProps): JSX.Element | null {
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [isProcessing, setIsProcessing] = useState(false);

  const [plans] = useState<SubscriptionPlan[]>([
    {
      id: 'basic',
      name: 'Basic Premium',
      price: 9.99,
      period: 'month',
      features: [
        'Unlimited image generation',
        '50 video generations/month',
        '100 voice generations/month',
        '10GB cloud storage',
        'Priority support',
        'No daily limits',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Premium',
      price: 19.99,
      originalPrice: 29.99,
      period: 'month',
      popular: true,
      highlight: '33% OFF - Limited Time!',
      features: [
        'Everything in Basic',
        'Unlimited video generation',
        'Unlimited voice generation',
        'Avatar editor access',
        '100GB cloud storage',
        'API access',
        'Custom AI models',
        '24/7 priority support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: 49.99,
      period: 'month',
      features: [
        'Everything in Pro',
        'White-label solutions',
        'Unlimited cloud storage',
        'Full API access',
        'Custom integrations',
        'Dedicated account manager',
        'Advanced analytics',
      ],
    },
  ]);

  if (!isVisible) return null;

  const handleSubscribe = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsProcessing(false);
    onSubscribe(selectedPlan);
    onClose();
  };

  const getHeaderContent = () => {
    switch (trigger) {
      case 'login':
        return {
          title: '🎉 Welcome to Seraphine!',
          subtitle: 'Unlock the full power of AI with Premium',
          icon: Gift,
        };
      case 'limit':
        return {
          title: '⚡ Daily Limit Reached',
          subtitle: 'Upgrade to Premium for unlimited access',
          icon: Zap,
        };
      default:
        return {
          title: '👑 Upgrade to Premium',
          subtitle: 'Unlock unlimited AI generation power',
          icon: Crown,
        };
    }
  };

  const headerContent = getHeaderContent();
  const HeaderIcon = headerContent.icon;

  return (
    <div className={styles.modalOverlay}>
      <div className={`${styles.modalContent} ${styles.subscriptionPopup}`}>
        {/* Header */}
        <div className={styles.popupHeader}>
          <button
            className={styles.closeButton}
            onClick={onClose}
            title='Close'
          >
            <X size={24} />
          </button>

          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <HeaderIcon size={48} />
            </div>
            <h2 className={styles.popupTitle}>{headerContent.title}</h2>
            <p className={styles.popupSubtitle}>{headerContent.subtitle}</p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className={styles.benefitsSection}>
          <h3>Why Choose Premium?</h3>
          <div className={styles.benefitsList}>
            <div className={styles.benefit}>
              <Infinity size={20} />
              <span>Unlimited AI generations</span>
            </div>
            <div className={styles.benefit}>
              <Sparkles size={20} />
              <span>Access to latest AI models</span>
            </div>
            <div className={styles.benefit}>
              <Rocket size={20} />
              <span>10x faster processing</span>
            </div>
            <div className={styles.benefit}>
              <Shield size={20} />
              <span>Priority support & updates</span>
            </div>
          </div>
        </div>

        {/* Plans Selection */}
        <div className={styles.plansSection}>
          <h3>Choose Your Plan</h3>
          <div className={styles.plansGrid}>
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`${styles.planOption} ${selectedPlan === plan.id ? styles.selected : ''} ${plan.popular ? styles.popular : ''}`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {plan.popular && (
                  <div className={styles.popularBadge}>
                    <Star size={16} />
                    Most Popular
                  </div>
                )}

                {plan.highlight && (
                  <div className={styles.highlightBadge}>{plan.highlight}</div>
                )}

                <div className={styles.planHeader}>
                  <h4 className={styles.planName}>{plan.name}</h4>
                  <div className={styles.planPricing}>
                    {plan.originalPrice && (
                      <span className={styles.originalPrice}>
                        ${plan.originalPrice}
                      </span>
                    )}
                    <span className={styles.planPrice}>${plan.price}</span>
                    <span className={styles.planPeriod}>/{plan.period}</span>
                  </div>
                </div>

                <div className={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <div key={index} className={styles.planFeature}>
                      <Check size={14} />
                      {feature}
                    </div>
                  ))}
                </div>

                <div className={styles.selectionIndicator}>
                  {selectedPlan === plan.id && <Check size={20} />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <div className={styles.guarantee}>
            <Shield size={16} />
            <span>30-day money-back guarantee</span>
          </div>

          <button
            className={`${styles.subscribeButton} ${isProcessing ? styles.processing : ''}`}
            onClick={handleSubscribe}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <div className={styles.spinner} />
                Processing...
              </>
            ) : (
              <>
                <Crown size={20} />
                Subscribe to {plans.find(p => p.id === selectedPlan)?.name}
                <ArrowRight size={20} />
              </>
            )}
          </button>

          <p className={styles.disclaimer}>Cancel anytime. No hidden fees.</p>
        </div>

        {/* Special Offer */}
        {trigger === 'login' && (
          <div className={styles.specialOffer}>
            <div className={styles.offerContent}>
              <Gift size={24} />
              <div>
                <strong>Welcome Bonus!</strong>
                <span>Get 50 free tokens with any Premium subscription</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
