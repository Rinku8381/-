'use client';

import React, { useState, useEffect } from 'react';
import {
  X,
  Coins,
  Zap,
  Crown,
  Gift,
  ShoppingBag,
  Star,
  Clock,
  Plus,
  Minus,
  CreditCard,
  Calendar,
  User,
  Award,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Info,
} from 'lucide-react';

interface TokenPackage {
  id: string;
  name: string;
  tokens: number;
  price: number;
  bonus: number;
  popular?: boolean;
  icon: React.ReactNode;
  description: string;
}

interface NeuralTokenSystemProps {
  isVisible: boolean;
  onClose: () => void;
  currentTokens: number;
  onPurchase?: (packageId: string) => void;
  userLevel?: 'free' | 'premium';
}

const NeuralTokenSystem: React.FC<NeuralTokenSystemProps> = ({
  isVisible,
  onClose,
  currentTokens,
  onPurchase,
  userLevel = 'free',
}) => {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [dailyReset, setDailyReset] = useState<Date>(new Date());
  const [tokenUsageToday, setTokenUsageToday] = useState(40);
  const [isAnimating, setIsAnimating] = useState(false);

  const dailyLimit = userLevel === 'premium' ? Infinity : 50;
  const remainingTokens =
    userLevel === 'premium'
      ? Infinity
      : Math.max(0, dailyLimit - tokenUsageToday);
  const tokenPercentage =
    userLevel === 'premium' ? 100 : (currentTokens / dailyLimit) * 100;

  const tokenPackages: TokenPackage[] = [
    {
      id: 'starter',
      name: 'Neural Starter',
      tokens: 100,
      price: 4.99,
      bonus: 0,
      icon: <Zap className='w-6 h-6' />,
      description: 'Perfect for casual creation',
    },
    {
      id: 'creator',
      name: 'Creator Pack',
      tokens: 300,
      price: 12.99,
      bonus: 50,
      popular: true,
      icon: <Star className='w-6 h-6' />,
      description: 'Most popular choice',
    },
    {
      id: 'professional',
      name: 'Pro Neural',
      tokens: 750,
      price: 29.99,
      bonus: 150,
      icon: <Crown className='w-6 h-6' />,
      description: 'For serious creators',
    },
    {
      id: 'unlimited',
      name: 'Neural Infinity',
      tokens: 2000,
      price: 69.99,
      bonus: 500,
      icon: <Sparkles className='w-6 h-6' />,
      description: 'Ultimate creative freedom',
    },
  ];

  const usageHistory = [
    { action: 'AI Image Generation', tokens: 10, time: '2 hours ago' },
    { action: 'Style Transfer', tokens: 5, time: '4 hours ago' },
    { action: 'Canvas AI Edit', tokens: 15, time: '6 hours ago' },
    { action: 'Voice Generation', tokens: 8, time: '8 hours ago' },
    { action: 'Video Creation', tokens: 25, time: '12 hours ago' },
  ];

  const achievements = [
    {
      name: 'First Generation',
      icon: <Gift className='w-4 h-4' />,
      unlocked: true,
    },
    {
      name: 'Creative Streak',
      icon: <TrendingUp className='w-4 h-4' />,
      unlocked: true,
    },
    {
      name: 'Token Saver',
      icon: <Award className='w-4 h-4' />,
      unlocked: false,
    },
    {
      name: 'Master Creator',
      icon: <Crown className='w-4 h-4' />,
      unlocked: false,
    },
  ];

  useEffect(() => {
    if (isVisible) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible]);

  useEffect(() => {
    // Calculate next daily reset
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setDailyReset(tomorrow);
  }, []);

  const handlePurchase = (packageId: string) => {
    setSelectedPackage(packageId);
    if (onPurchase) {
      onPurchase(packageId);
    }
  };

  const getTimeUntilReset = () => {
    const now = new Date();
    const diff = dailyReset.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm'>
      <div className='seraphine-holo-panel h-full m-4 flex flex-col max-w-6xl mx-auto'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-cyan-500/20'>
          <div className='flex items-center gap-4'>
            <div className='seraphine-plasma-orb w-12 h-12'></div>
            <div>
              <h2
                className='text-2xl font-bold text-cyan-400 seraphine-glitch'
                data-text='Neural Token System'
              >
                Neural Token System
              </h2>
              <p className='text-sm text-cyan-300/70'>
                Power your AI creativity
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='seraphine-neural-btn ghost p-3'
            title='Close Token System'
          >
            <X size={20} />
          </button>
        </div>

        <div className='flex-1 overflow-hidden flex'>
          {/* Left Panel - Token Status */}
          <div className='w-80 border-r border-cyan-500/20 p-6 space-y-6 overflow-y-auto'>
            {/* Current Token Display */}
            <div className='seraphine-holo-panel p-6'>
              <div className='text-center'>
                <div className='flex items-center justify-center gap-2 mb-2'>
                  <Coins className='w-6 h-6 text-cyan-400' />
                  <span className='text-2xl font-bold text-cyan-300'>
                    {currentTokens}
                  </span>
                </div>
                <p className='text-sm text-cyan-300/70 mb-4'>Neural Tokens</p>

                {userLevel === 'free' && (
                  <>
                    {/* Daily Usage Meter */}
                    <div className='seraphine-token-meter mb-4'>
                      <div className='seraphine-token-progress seraphine-token-progress-dynamic w-full max-w-full' />
                    </div>

                    <div className='flex justify-between text-xs text-cyan-300/70 mb-2'>
                      <span>Used: {tokenUsageToday}</span>
                      <span>Limit: {dailyLimit}</span>
                    </div>

                    <div className='flex items-center gap-2 text-xs text-cyan-300/50'>
                      <Clock className='w-3 h-3' />
                      <span>Resets in {getTimeUntilReset()}</span>
                    </div>
                  </>
                )}

                {userLevel === 'premium' && (
                  <div className='flex items-center justify-center gap-2 text-yellow-400'>
                    <Crown className='w-4 h-4' />
                    <span className='text-sm font-medium'>Unlimited</span>
                  </div>
                )}
              </div>
            </div>

            {/* Usage History */}
            <div>
              <h3 className='text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2'>
                <Clock className='w-5 h-5' />
                Recent Usage
              </h3>

              <div className='space-y-2'>
                {usageHistory.map((usage, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5'
                  >
                    <div>
                      <p className='text-sm text-cyan-300'>{usage.action}</p>
                      <p className='text-xs text-cyan-300/50'>{usage.time}</p>
                    </div>
                    <div className='flex items-center gap-1 text-cyan-400'>
                      <Minus className='w-3 h-3' />
                      <span className='text-sm font-medium'>
                        {usage.tokens}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div>
              <h3 className='text-lg font-semibold text-cyan-300 mb-4 flex items-center gap-2'>
                <Award className='w-5 h-5' />
                Achievements
              </h3>

              <div className='space-y-2'>
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className={`flex items-center gap-3 p-2 rounded-lg ${
                      achievement.unlocked
                        ? 'border border-yellow-500/30 bg-yellow-500/10 text-yellow-300'
                        : 'border border-gray-500/20 bg-gray-500/5 text-gray-400'
                    }`}
                  >
                    {achievement.icon}
                    <span className='text-sm'>{achievement.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Token Shop */}
          <div className='flex-1 p-6 overflow-y-auto'>
            <div className='mb-6'>
              <h3 className='text-2xl font-bold text-cyan-300 mb-2'>
                Neural Token Shop
              </h3>
              <p className='text-cyan-300/70'>
                Choose the perfect token package for your creative needs
              </p>
            </div>

            {/* Package Grid */}
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
              {tokenPackages.map(pkg => (
                <div
                  key={pkg.id}
                  className={`seraphine-holo-panel p-6 cursor-pointer transition-all duration-300 relative ${
                    selectedPackage === pkg.id
                      ? 'border-cyan-400 shadow-cyan-400/20'
                      : 'hover:border-cyan-400/50'
                  } ${pkg.popular ? 'ring-2 ring-yellow-400/30' : ''}`}
                  onClick={() => setSelectedPackage(pkg.id)}
                >
                  {pkg.popular && (
                    <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
                      <div className='bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold'>
                        POPULAR
                      </div>
                    </div>
                  )}

                  <div className='text-center'>
                    <div className='flex justify-center mb-4 text-cyan-400'>
                      {pkg.icon}
                    </div>

                    <h4 className='text-lg font-bold text-cyan-300 mb-2'>
                      {pkg.name}
                    </h4>
                    <p className='text-sm text-cyan-300/70 mb-4'>
                      {pkg.description}
                    </p>

                    <div className='space-y-2 mb-4'>
                      <div className='flex items-center justify-center gap-2'>
                        <Coins className='w-4 h-4 text-cyan-400' />
                        <span className='text-xl font-bold text-cyan-300'>
                          {pkg.tokens.toLocaleString()}
                        </span>
                      </div>

                      {pkg.bonus > 0 && (
                        <div className='flex items-center justify-center gap-2 text-yellow-400'>
                          <Plus className='w-3 h-3' />
                          <span className='text-sm font-medium'>
                            {pkg.bonus} Bonus
                          </span>
                        </div>
                      )}
                    </div>

                    <div className='text-2xl font-bold text-cyan-300 mb-4'>
                      ${pkg.price}
                    </div>

                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handlePurchase(pkg.id);
                      }}
                      className={`seraphine-neural-btn w-full ${
                        selectedPackage === pkg.id ? '' : 'ghost'
                      }`}
                    >
                      <ShoppingBag className='w-4 h-4 mr-2' />
                      {selectedPackage === pkg.id ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Purchase Summary */}
            {selectedPackage && (
              <div className='seraphine-holo-panel p-6 border-cyan-400/50'>
                <h4 className='text-lg font-bold text-cyan-300 mb-4'>
                  Purchase Summary
                </h4>

                {(() => {
                  const pkg = tokenPackages.find(p => p.id === selectedPackage);
                  if (!pkg) return null;

                  return (
                    <div className='space-y-4'>
                      <div className='flex justify-between items-center'>
                        <span className='text-cyan-300'>{pkg.name}</span>
                        <span className='text-cyan-300'>${pkg.price}</span>
                      </div>

                      <div className='flex justify-between items-center'>
                        <span className='text-cyan-300/70'>Base Tokens</span>
                        <span className='text-cyan-300'>
                          {pkg.tokens.toLocaleString()}
                        </span>
                      </div>

                      {pkg.bonus > 0 && (
                        <div className='flex justify-between items-center'>
                          <span className='text-yellow-400'>Bonus Tokens</span>
                          <span className='text-yellow-400'>+{pkg.bonus}</span>
                        </div>
                      )}

                      <div className='border-t border-cyan-500/20 pt-4'>
                        <div className='flex justify-between items-center text-lg font-bold'>
                          <span className='text-cyan-300'>Total Tokens</span>
                          <span className='text-cyan-300'>
                            {(pkg.tokens + pkg.bonus).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div className='flex gap-3'>
                        <button className='seraphine-neural-btn flex-1'>
                          <CreditCard className='w-4 h-4 mr-2' />
                          Purchase Now
                        </button>
                        <button
                          onClick={() => setSelectedPackage(null)}
                          className='seraphine-neural-btn ghost flex-1'
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Token Usage Guide */}
            <div className='mt-8'>
              <h4 className='text-lg font-bold text-cyan-300 mb-4 flex items-center gap-2'>
                <Info className='w-5 h-5' />
                Token Usage Guide
              </h4>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5'>
                  <h5 className='font-semibold text-cyan-300 mb-2'>
                    AI Image Generation
                  </h5>
                  <p className='text-sm text-cyan-300/70 mb-2'>
                    10 tokens per image
                  </p>
                  <p className='text-xs text-cyan-300/50'>
                    High-quality AI artwork
                  </p>
                </div>

                <div className='p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5'>
                  <h5 className='font-semibold text-cyan-300 mb-2'>
                    Canvas AI Edit
                  </h5>
                  <p className='text-sm text-cyan-300/70 mb-2'>
                    15 tokens per edit
                  </p>
                  <p className='text-xs text-cyan-300/50'>
                    Advanced image manipulation
                  </p>
                </div>

                <div className='p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5'>
                  <h5 className='font-semibold text-cyan-300 mb-2'>
                    Voice Generation
                  </h5>
                  <p className='text-sm text-cyan-300/70 mb-2'>
                    8 tokens per minute
                  </p>
                  <p className='text-xs text-cyan-300/50'>AI voice synthesis</p>
                </div>

                <div className='p-4 rounded-lg border border-cyan-500/20 bg-cyan-500/5'>
                  <h5 className='font-semibold text-cyan-300 mb-2'>
                    Video Creation
                  </h5>
                  <p className='text-sm text-cyan-300/70 mb-2'>
                    25 tokens per video
                  </p>
                  <p className='text-xs text-cyan-300/50'>
                    AI-powered video clips
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NeuralTokenSystem;
