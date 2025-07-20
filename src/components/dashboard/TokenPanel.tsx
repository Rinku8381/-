'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Plus,
  Gift,
  ShoppingCart,
  Zap,
  TrendingUp,
  Calendar,
  Info,
  Crown,
  Star,
  Target,
} from 'lucide-react';

interface TokenPanelProps {
  currentTokens: number;
  estimatedCost: number;
  userTier: 'free' | 'premium';
  onBuyTokens: () => void;
  onEarnTokens: () => void;
}

interface TokenPackage {
  id: string;
  tokens: number;
  price: number;
  bonus: number;
  popular?: boolean;
  value: string;
}

interface EarnMethod {
  id: string;
  title: string;
  description: string;
  reward: number;
  icon: React.ReactNode;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRequired: string;
  isAvailable: boolean;
}

const TOKEN_PACKAGES: TokenPackage[] = [
  {
    id: 'starter',
    tokens: 100,
    price: 4.99,
    bonus: 0,
    value: 'Good',
  },
  {
    id: 'standard',
    tokens: 250,
    price: 9.99,
    bonus: 25,
    popular: true,
    value: 'Best Value',
  },
  {
    id: 'premium',
    tokens: 500,
    price: 19.99,
    bonus: 75,
    value: 'Premium',
  },
  {
    id: 'ultimate',
    tokens: 1000,
    price: 34.99,
    bonus: 200,
    value: 'Ultimate',
  },
];

const EARN_METHODS: EarnMethod[] = [
  {
    id: 'daily-login',
    title: 'Daily Login',
    description: 'Login every day to earn tokens',
    reward: 10,
    icon: <Calendar className='w-4 h-4' />,
    difficulty: 'easy',
    timeRequired: '1 min',
    isAvailable: true,
  },
  {
    id: 'share-creation',
    title: 'Share Your Creation',
    description: 'Share AI-generated content on social media',
    reward: 25,
    icon: <Star className='w-4 h-4' />,
    difficulty: 'easy',
    timeRequired: '2 min',
    isAvailable: true,
  },
  {
    id: 'complete-tutorial',
    title: 'Complete Tutorial',
    description: 'Finish the AI generation tutorial',
    reward: 50,
    icon: <Target className='w-4 h-4' />,
    difficulty: 'medium',
    timeRequired: '10 min',
    isAvailable: false,
  },
  {
    id: 'invite-friend',
    title: 'Invite Friends',
    description: 'Invite friends to join Seraphine',
    reward: 100,
    icon: <Gift className='w-4 h-4' />,
    difficulty: 'medium',
    timeRequired: '5 min',
    isAvailable: true,
  },
];

const TokenPanel: React.FC<TokenPanelProps> = ({
  currentTokens,
  estimatedCost,
  userTier,
  onBuyTokens,
  onEarnTokens,
}) => {
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showEarnModal, setShowEarnModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string>('standard');
  const [dailyProgress, setDailyProgress] = useState(65); // Daily token earning progress

  // Calculate if user has enough tokens
  const hasEnoughTokens = currentTokens >= estimatedCost;
  const tokenDeficit = estimatedCost - currentTokens;

  // Animation variants
  const tokenCountVariants = {
    sufficient: { color: '#10b981', scale: 1 },
    insufficient: { color: '#ef4444', scale: 1.05 },
    warning: { color: '#f59e0b', scale: 1.02 },
  };

  const getTokenStatus = () => {
    if (hasEnoughTokens) return 'sufficient';
    if (tokenDeficit <= 50) return 'warning';
    return 'insufficient';
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-3'>
        <div className='flex items-center gap-2'>
          <Coins className='w-5 h-5 text-yellow-400' />
          <h3 className='text-lg font-semibold text-white'>Neural Tokens</h3>
        </div>
        {userTier === 'premium' && (
          <div className='flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full'>
            <Crown className='w-3 h-3 text-yellow-400' />
            <span className='text-yellow-400 text-xs font-medium'>Premium</span>
          </div>
        )}
      </div>

      {/* Token Balance */}
      <motion.div
        className='bg-black/40 border border-yellow-500/30 rounded-lg p-6 cyber-glass'
        animate={tokenCountVariants[getTokenStatus()]}
        transition={{ duration: 0.3 }}
      >
        <div className='text-center'>
          <motion.div
            className='text-4xl font-bold mb-2'
            animate={{
              color:
                getTokenStatus() === 'sufficient'
                  ? '#10b981'
                  : getTokenStatus() === 'warning'
                    ? '#f59e0b'
                    : '#ef4444',
            }}
          >
            {currentTokens.toLocaleString()}
          </motion.div>
          <div className='text-gray-300 text-sm mb-4'>Available Tokens</div>

          {/* Quick Action Buttons */}
          <div className='flex gap-3 justify-center'>
            <motion.button
              onClick={() => setShowBuyModal(true)}
              className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg font-medium text-sm hover:from-green-600 hover:to-emerald-600 transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ShoppingCart className='w-4 h-4' />
              Buy Tokens
            </motion.button>
            <motion.button
              onClick={() => setShowEarnModal(true)}
              className='flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-medium text-sm hover:from-blue-600 hover:to-purple-600 transition-all duration-300'
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Gift className='w-4 h-4' />
              Earn Free
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Generation Cost */}
      <div className='bg-black/30 border border-cyan-500/20 rounded-lg p-4 cyber-glass'>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='text-white font-medium'>Generation Cost</h4>
          <Info className='w-4 h-4 text-gray-400' />
        </div>

        <div className='flex items-center justify-between'>
          <div>
            <span className='text-gray-400 text-sm'>Estimated cost:</span>
            <span className='ml-2 text-cyan-400 font-semibold'>
              {estimatedCost} tokens
            </span>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
              hasEnoughTokens
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            <Zap className='w-3 h-3' />
            {hasEnoughTokens ? 'Ready' : `Need ${tokenDeficit} more`}
          </div>
        </div>

        {/* Token Balance Progress */}
        <div className='mt-3'>
          <div className='flex justify-between text-xs text-gray-400 mb-1'>
            <span>Token Balance</span>
            <span>
              {Math.min(100, (currentTokens / estimatedCost) * 100).toFixed(0)}%
            </span>
          </div>
          <div className='w-full bg-gray-700 rounded-full h-2'>
            <motion.div
              className={`h-2 rounded-full ${
                hasEnoughTokens ? 'bg-green-500' : 'bg-red-500'
              }`}
              initial={{ width: 0 }}
              animate={{
                width: `${Math.min(100, (currentTokens / estimatedCost) * 100)}%`,
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Daily Earning Progress */}
      <div className='bg-black/30 border border-purple-500/20 rounded-lg p-4 cyber-glass'>
        <div className='flex items-center justify-between mb-3'>
          <h4 className='text-white font-medium'>Daily Earning Progress</h4>
          <TrendingUp className='w-4 h-4 text-purple-400' />
        </div>

        <div className='space-y-2'>
          <div className='flex justify-between text-sm'>
            <span className='text-gray-400'>Today's earnings</span>
            <span className='text-purple-400 font-medium'>
              {Math.floor(dailyProgress * 0.5)} / 50 tokens
            </span>
          </div>
          <div className='w-full bg-gray-700 rounded-full h-2'>
            <motion.div
              className='h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500'
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
          <div className='text-xs text-gray-500'>Resets in 8h 42m</div>
        </div>
      </div>

      {/* Buy Tokens Modal */}
      <AnimatePresence>
        {showBuyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
            onClick={() => setShowBuyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-black/90 border border-cyan-500/30 rounded-lg p-6 max-w-md w-full cyber-glass'
              onClick={e => e.stopPropagation()}
            >
              <h3 className='text-xl font-bold text-white mb-4'>
                Buy Neural Tokens
              </h3>

              <div className='space-y-3 mb-6'>
                {TOKEN_PACKAGES.map(pkg => (
                  <motion.button
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id)}
                    className={`w-full p-4 rounded-lg border transition-all duration-300 ${
                      selectedPackage === pkg.id
                        ? 'border-cyan-500 bg-cyan-500/20'
                        : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className='flex items-center justify-between'>
                      <div className='text-left'>
                        <div className='flex items-center gap-2'>
                          <span className='text-white font-medium'>
                            {pkg.tokens} tokens
                          </span>
                          {pkg.bonus > 0 && (
                            <span className='text-green-400 text-sm'>
                              +{pkg.bonus} bonus
                            </span>
                          )}
                          {pkg.popular && (
                            <span className='px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full'>
                              Popular
                            </span>
                          )}
                        </div>
                        <span className='text-gray-400 text-sm'>
                          {pkg.value}
                        </span>
                      </div>
                      <span className='text-cyan-400 font-bold'>
                        ${pkg.price}
                      </span>
                    </div>
                  </motion.button>
                ))}
              </div>

              <div className='flex gap-3'>
                <motion.button
                  onClick={() => setShowBuyModal(false)}
                  className='flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  onClick={() => {
                    onBuyTokens();
                    setShowBuyModal(false);
                  }}
                  className='flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-300'
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Purchase
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Earn Tokens Modal */}
      <AnimatePresence>
        {showEarnModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'
            onClick={() => setShowEarnModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-black/90 border border-purple-500/30 rounded-lg p-6 max-w-md w-full cyber-glass max-h-[80vh] overflow-y-auto'
              onClick={e => e.stopPropagation()}
            >
              <h3 className='text-xl font-bold text-white mb-4'>
                Earn Free Tokens
              </h3>

              <div className='space-y-3 mb-6'>
                {EARN_METHODS.map(method => (
                  <motion.div
                    key={method.id}
                    className={`p-4 rounded-lg border ${
                      method.isAvailable
                        ? 'border-purple-500/30 bg-purple-500/10'
                        : 'border-gray-600 bg-gray-800/30 opacity-60'
                    }`}
                  >
                    <div className='flex items-start justify-between mb-2'>
                      <div className='flex items-center gap-2'>
                        {method.icon}
                        <span className='text-white font-medium'>
                          {method.title}
                        </span>
                      </div>
                      <div className='flex items-center gap-1'>
                        <Coins className='w-3 h-3 text-yellow-400' />
                        <span className='text-yellow-400 font-medium'>
                          +{method.reward}
                        </span>
                      </div>
                    </div>
                    <p className='text-gray-300 text-sm mb-2'>
                      {method.description}
                    </p>
                    <div className='flex items-center justify-between text-xs'>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          method.difficulty === 'easy'
                            ? 'bg-green-500/20 text-green-400'
                            : method.difficulty === 'medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {method.difficulty}
                      </span>
                      <span className='text-gray-400'>
                        {method.timeRequired}
                      </span>
                    </div>
                    {method.isAvailable && (
                      <motion.button
                        onClick={() => {
                          onEarnTokens();
                          setShowEarnModal(false);
                        }}
                        className='w-full mt-3 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300'
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Start Task
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.button
                onClick={() => setShowEarnModal(false)}
                className='w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors'
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TokenPanel;
