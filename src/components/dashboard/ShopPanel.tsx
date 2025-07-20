'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Coins,
  Crown,
  Zap,
  CreditCard,
  Calendar,
  Star,
  Gift,
  Sparkles,
  Infinity,
  Check,
  ArrowRight,
  Package,
  Gem,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface ShopPanelProps {
  isVisible: boolean;
  onClose: () => void;
  userTokens: number;
  onUpgrade: () => void;
}

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  bonus?: number;
  popular?: boolean;
  savings?: string;
}

interface PremiumFeature {
  id: string;
  name: string;
  icon: any;
  description: string;
  tokenCost: number;
  category: 'generation' | 'editing' | 'storage' | 'special';
}

interface PremiumPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export default function ShopPanel({
  isVisible,
  onClose,
  userTokens,
  onUpgrade,
}: ShopPanelProps): JSX.Element | null {
  const [activeTab, setActiveTab] = useState<'tokens' | 'features' | 'premium'>(
    'tokens'
  );
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>(
    'monthly'
  );

  const [tokenPackages] = useState<TokenPackage[]>([
    {
      id: 'starter',
      tokens: 100,
      price: 4.99,
      bonus: 10,
    },
    {
      id: 'popular',
      tokens: 500,
      price: 19.99,
      bonus: 75,
      popular: true,
      savings: 'Best Value',
    },
    {
      id: 'pro',
      tokens: 1000,
      price: 34.99,
      bonus: 200,
      savings: '20% Bonus',
    },
    {
      id: 'enterprise',
      tokens: 2500,
      price: 79.99,
      bonus: 750,
      savings: '30% Bonus',
    },
  ]);

  const [premiumFeatures] = useState<PremiumFeature[]>([
    {
      id: 'unlimited-images',
      name: 'Unlimited Image Generation',
      icon: Sparkles,
      description: 'Generate unlimited AI images daily',
      tokenCost: 0,
      category: 'generation',
    },
    {
      id: 'hd-video',
      name: 'HD Video Creation',
      icon: Zap,
      description: 'Create high-definition videos up to 30 seconds',
      tokenCost: 50,
      category: 'generation',
    },
    {
      id: 'voice-cloning',
      name: 'Voice Cloning',
      icon: Crown,
      description: 'Clone any voice with AI technology',
      tokenCost: 100,
      category: 'generation',
    },
    {
      id: 'avatar-editor',
      name: 'Avatar Editor',
      icon: Star,
      description: 'Full avatar customization and editing',
      tokenCost: 75,
      category: 'editing',
    },
    {
      id: 'cloud-storage',
      name: 'Cloud Storage 100GB',
      icon: Package,
      description: 'Store all your creations in the cloud',
      tokenCost: 0,
      category: 'storage',
    },
    {
      id: 'api-access',
      name: 'API Access',
      icon: Gem,
      description: 'Integrate Seraphine into your apps',
      tokenCost: 200,
      category: 'special',
    },
  ]);

  const [premiumPlans] = useState<PremiumPlan[]>([
    {
      id: 'basic',
      name: 'Basic Premium',
      monthlyPrice: 9.99,
      yearlyPrice: 99.99,
      features: [
        'Unlimited image generation',
        '50 video generations/month',
        '100 voice generations/month',
        '10GB cloud storage',
        'Priority support',
      ],
    },
    {
      id: 'pro',
      name: 'Pro Premium',
      monthlyPrice: 19.99,
      yearlyPrice: 199.99,
      popular: true,
      savings: 'Most Popular',
      features: [
        'Everything in Basic',
        'Unlimited video generation',
        'Unlimited voice generation',
        'Avatar editor access',
        '100GB cloud storage',
        'API access (limited)',
        '24/7 priority support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 49.99,
      yearlyPrice: 499.99,
      savings: '2 months free',
      features: [
        'Everything in Pro',
        'Custom AI model training',
        'Unlimited cloud storage',
        'Full API access',
        'White-label options',
        'Dedicated account manager',
        'Custom integrations',
      ],
    },
  ]);

  if (!isVisible) return null;

  const handlePurchaseTokens = (packageItem: TokenPackage) => {
    // Handle token purchase
    console.log('Purchasing tokens:', packageItem);
  };

  const handlePurchaseFeature = (feature: PremiumFeature) => {
    if (userTokens >= feature.tokenCost) {
      // Handle feature purchase
      console.log('Purchasing feature:', feature);
    } else {
      alert('Insufficient tokens! Purchase more tokens first.');
    }
  };

  const handleSubscribe = (plan: PremiumPlan) => {
    onUpgrade();
  };

  const getPrice = (plan: PremiumPlan) => {
    return billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
  };

  const tabs = [
    { id: 'tokens', label: 'Buy Tokens', icon: Coins },
    { id: 'features', label: 'Premium Features', icon: Star },
    { id: 'premium', label: 'Premium Plans', icon: Crown },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.shopModal}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <ShoppingBag size={24} />
            Seraphine Shop
          </h2>
          <div className={styles.tokenBalance}>
            <Coins size={20} />
            {userTokens} tokens
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            title='Close'
          >
            ×
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.shopTabs}>
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.shopTab} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id as any)}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={styles.shopContent}>
          {activeTab === 'tokens' && (
            <div className={styles.tokenShop}>
              <div className={styles.sectionHeader}>
                <h3>Token Packages</h3>
                <p>Purchase tokens to unlock premium features instantly</p>
              </div>

              <div className={styles.packageGrid}>
                {tokenPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`${styles.packageCard} ${pkg.popular ? styles.popular : ''}`}
                  >
                    {pkg.popular && (
                      <div className={styles.popularBadge}>
                        <Star size={16} />
                        {pkg.savings}
                      </div>
                    )}

                    <div className={styles.packageHeader}>
                      <div className={styles.tokenAmount}>
                        {pkg.tokens}
                        {pkg.bonus && (
                          <span className={styles.bonus}>+{pkg.bonus}</span>
                        )}
                      </div>
                      <div className={styles.tokenLabel}>tokens</div>
                    </div>

                    <div className={styles.packagePrice}>${pkg.price}</div>

                    {pkg.bonus && (
                      <div className={styles.totalTokens}>
                        Total: {pkg.tokens + pkg.bonus} tokens
                      </div>
                    )}

                    <button
                      className={styles.purchaseButton}
                      onClick={() => handlePurchaseTokens(pkg)}
                    >
                      <CreditCard size={16} />
                      Purchase
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className={styles.featureShop}>
              <div className={styles.sectionHeader}>
                <h3>Premium Features</h3>
                <p>Unlock individual features with tokens</p>
              </div>

              <div className={styles.featureGrid}>
                {premiumFeatures.map(feature => {
                  const FeatureIcon = feature.icon;
                  const canAfford = userTokens >= feature.tokenCost;

                  return (
                    <div key={feature.id} className={styles.featureCard}>
                      <div className={styles.featureIcon}>
                        <FeatureIcon size={32} />
                      </div>

                      <h4 className={styles.featureName}>{feature.name}</h4>
                      <p className={styles.featureDescription}>
                        {feature.description}
                      </p>

                      <div className={styles.featureCost}>
                        {feature.tokenCost === 0 ? (
                          <span className={styles.included}>
                            <Crown size={16} />
                            Premium Only
                          </span>
                        ) : (
                          <span className={styles.tokenCost}>
                            <Coins size={16} />
                            {feature.tokenCost} tokens
                          </span>
                        )}
                      </div>

                      <button
                        className={`${styles.featureButton} ${!canAfford && feature.tokenCost > 0 ? styles.disabled : ''}`}
                        onClick={() => handlePurchaseFeature(feature)}
                        disabled={!canAfford && feature.tokenCost > 0}
                      >
                        {feature.tokenCost === 0 ? (
                          <>
                            <Crown size={16} />
                            Get Premium
                          </>
                        ) : canAfford ? (
                          <>
                            <Zap size={16} />
                            Unlock Now
                          </>
                        ) : (
                          <>
                            <Coins size={16} />
                            Need More Tokens
                          </>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'premium' && (
            <div className={styles.premiumShop}>
              <div className={styles.sectionHeader}>
                <h3>Premium Subscription Plans</h3>
                <p>Get unlimited access to all features</p>
              </div>

              <div className={styles.billingToggle}>
                <button
                  className={`${styles.billingOption} ${billingCycle === 'monthly' ? styles.active : ''}`}
                  onClick={() => setBillingCycle('monthly')}
                >
                  Monthly
                </button>
                <button
                  className={`${styles.billingOption} ${billingCycle === 'yearly' ? styles.active : ''}`}
                  onClick={() => setBillingCycle('yearly')}
                >
                  Yearly
                  <span className={styles.saveBadge}>Save 17%</span>
                </button>
              </div>

              <div className={styles.planGrid}>
                {premiumPlans.map(plan => (
                  <div
                    key={plan.id}
                    className={`${styles.planCard} ${plan.popular ? styles.popular : ''}`}
                  >
                    {plan.popular && (
                      <div className={styles.popularBadge}>
                        <Crown size={16} />
                        {plan.savings}
                      </div>
                    )}

                    <div className={styles.planHeader}>
                      <h4 className={styles.planName}>{plan.name}</h4>
                      <div className={styles.planPrice}>
                        <span className={styles.currency}>$</span>
                        <span className={styles.amount}>{getPrice(plan)}</span>
                        <span className={styles.period}>
                          /{billingCycle === 'monthly' ? 'mo' : 'year'}
                        </span>
                      </div>
                    </div>

                    <div className={styles.planFeatures}>
                      {plan.features.map((feature, index) => (
                        <div key={index} className={styles.planFeature}>
                          <Check size={16} />
                          {feature}
                        </div>
                      ))}
                    </div>

                    <button
                      className={`${styles.subscribeButton} ${plan.popular ? styles.popular : ''}`}
                      onClick={() => handleSubscribe(plan)}
                    >
                      <Crown size={16} />
                      Subscribe Now
                      <ArrowRight size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
