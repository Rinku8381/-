'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Lock, Zap, Settings, Info } from 'lucide-react';

interface ModeSelectorProps {
  selectedMode: 'standard' | 'professional';
  onModeChange: (mode: 'standard' | 'professional') => void;
  userTier: 'free' | 'premium';
  onUpgradeClick: () => void;
}

const GENERATION_MODES = [
  {
    id: 'standard' as const,
    name: 'Standard Mode',
    description: 'Quick generation with good quality',
    features: [
      'Fast processing',
      'Standard quality',
      'Basic settings',
      'Community styles',
    ],
    icon: <Zap className='w-5 h-5' />,
    isPremium: false,
    processingTime: '10-30 seconds',
    tokensMultiplier: 1,
    color: 'cyan',
  },
  {
    id: 'professional' as const,
    name: 'Professional Mode',
    description: 'Advanced generation with premium quality',
    features: [
      'Enhanced processing',
      'Premium quality',
      'Advanced controls',
      'Exclusive styles',
      'Higher resolution',
      'Better consistency',
    ],
    icon: <Settings className='w-5 h-5' />,
    isPremium: true,
    processingTime: '30-60 seconds',
    tokensMultiplier: 2,
    color: 'purple',
  },
];

const ModeSelector: React.FC<ModeSelectorProps> = ({
  selectedMode,
  onModeChange,
  userTier,
  onUpgradeClick,
}) => {
  const handleModeSelect = (mode: 'standard' | 'professional') => {
    const modeData = GENERATION_MODES.find(m => m.id === mode);
    if (modeData?.isPremium && userTier === 'free') {
      onUpgradeClick();
      return;
    }
    onModeChange(mode);
  };

  const getColorClasses = (
    color: string,
    isSelected: boolean,
    isPremium: boolean,
    userTier: string
  ) => {
    const isLocked = isPremium && userTier === 'free';

    if (isLocked) {
      return {
        border: 'border-gray-600/50',
        bg: 'bg-gray-800/30',
        text: 'text-gray-500',
        glow: '',
      };
    }

    if (color === 'cyan') {
      return {
        border: isSelected ? 'border-cyan-500' : 'border-cyan-500/30',
        bg: isSelected ? 'bg-cyan-500/20' : 'bg-black/40',
        text: 'text-white',
        glow: isSelected ? 'cyber-glow' : '',
      };
    } else {
      return {
        border: isSelected ? 'border-purple-500' : 'border-purple-500/30',
        bg: isSelected ? 'bg-purple-500/20' : 'bg-black/40',
        text: 'text-white',
        glow: isSelected ? 'cyber-glow-purple' : '',
      };
    }
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center gap-2 mb-3'>
        <Settings className='w-5 h-5 text-cyan-400' />
        <h3 className='text-lg font-semibold text-white'>Generation Mode</h3>
      </div>

      {/* Mode Cards */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {GENERATION_MODES.map(mode => {
          const isSelected = selectedMode === mode.id;
          const isLocked = mode.isPremium && userTier === 'free';
          const colors = getColorClasses(
            mode.color,
            isSelected,
            mode.isPremium,
            userTier
          );

          return (
            <motion.button
              key={mode.id}
              onClick={() => handleModeSelect(mode.id)}
              className={`relative p-6 rounded-lg border ${colors.border} ${colors.bg} ${colors.glow} cyber-glass transition-all duration-300 text-left ${
                isLocked
                  ? 'cursor-not-allowed opacity-60'
                  : 'hover:scale-105 cursor-pointer'
              }`}
              whileHover={!isLocked ? { scale: 1.02 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              disabled={isLocked}
              aria-label={`Select ${mode.name}`}
              aria-pressed={isSelected}
            >
              {/* Premium Badge */}
              {mode.isPremium && (
                <div className='absolute top-3 right-3 flex items-center gap-1'>
                  {isLocked && <Lock className='w-4 h-4 text-yellow-400' />}
                  <Crown className='w-4 h-4 text-yellow-400' />
                </div>
              )}

              {/* Mode Icon & Title */}
              <div className='flex items-center gap-3 mb-3'>
                <div
                  className={`p-2 rounded-lg ${mode.color === 'cyan' ? 'bg-cyan-500/20' : 'bg-purple-500/20'}`}
                >
                  {mode.icon}
                </div>
                <div>
                  <h4 className={`font-semibold ${colors.text}`}>
                    {mode.name}
                  </h4>
                  <p className='text-gray-400 text-sm'>{mode.description}</p>
                </div>
              </div>

              {/* Features */}
              <div className='space-y-2 mb-4'>
                {mode.features.map((feature, index) => (
                  <div key={index} className='flex items-center gap-2 text-sm'>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${
                        mode.color === 'cyan' ? 'bg-cyan-400' : 'bg-purple-400'
                      }`}
                    />
                    <span className='text-gray-300'>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className='grid grid-cols-2 gap-4 pt-4 border-t border-white/10'>
                <div>
                  <span className='text-gray-400 text-xs block'>
                    Processing Time
                  </span>
                  <span className='text-white text-sm font-medium'>
                    {mode.processingTime}
                  </span>
                </div>
                <div>
                  <span className='text-gray-400 text-xs block'>
                    Token Cost
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      mode.color === 'cyan'
                        ? 'text-cyan-400'
                        : 'text-purple-400'
                    }`}
                  >
                    {mode.tokensMultiplier}x base cost
                  </span>
                </div>
              </div>

              {/* Selection Indicator */}
              {isSelected && !isLocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className='absolute inset-0 rounded-lg border-2 border-white/20 pointer-events-none'
                />
              )}

              {/* Locked Overlay */}
              {isLocked && (
                <div className='absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center'>
                  <div className='text-center'>
                    <Lock className='w-8 h-8 text-yellow-400 mx-auto mb-2' />
                    <span className='text-yellow-400 font-medium text-sm'>
                      Premium Required
                    </span>
                  </div>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Current Mode Info */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-black/30 border border-cyan-500/20 rounded-lg p-4 cyber-glass'
      >
        <div className='flex items-center gap-2 mb-3'>
          <Info className='w-4 h-4 text-cyan-400' />
          <h4 className='text-white font-medium'>Current Mode</h4>
        </div>

        {(() => {
          const currentMode = GENERATION_MODES.find(m => m.id === selectedMode);
          return (
            <div className='grid grid-cols-2 gap-4 text-sm'>
              <div>
                <span className='text-gray-400'>Mode:</span>
                <span className='ml-2 text-white font-medium'>
                  {currentMode?.name}
                </span>
              </div>
              <div>
                <span className='text-gray-400'>Type:</span>
                <span
                  className={`ml-2 ${currentMode?.isPremium ? 'text-purple-400' : 'text-cyan-400'}`}
                >
                  {currentMode?.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
              <div>
                <span className='text-gray-400'>Processing:</span>
                <span className='ml-2 text-green-400'>
                  {currentMode?.processingTime}
                </span>
              </div>
              <div>
                <span className='text-gray-400'>Cost multiplier:</span>
                <span className='ml-2 text-yellow-400'>
                  {currentMode?.tokensMultiplier}x
                </span>
              </div>
            </div>
          );
        })()}
      </motion.div>

      {/* Upgrade Tip for Free Users */}
      {userTier === 'free' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-4 cyber-glass'
        >
          <div className='flex items-start gap-3'>
            <Crown className='w-5 h-5 text-yellow-400 mt-0.5' />
            <div>
              <h4 className='text-white font-medium mb-1'>
                Unlock Professional Mode
              </h4>
              <p className='text-gray-300 text-sm mb-3'>
                Get access to advanced controls, higher quality generation, and
                exclusive features with Seraphine Premium.
              </p>
              <motion.button
                onClick={onUpgradeClick}
                className='px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Upgrade to Premium
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ModeSelector;
