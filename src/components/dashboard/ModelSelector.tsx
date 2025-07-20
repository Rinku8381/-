'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Crown, Lock, Cpu, Zap, Brain, Star } from 'lucide-react';

interface AIModel {
  id: string;
  name: string;
  version: string;
  description: string;
  capabilities: string[];
  speed: 'fast' | 'medium' | 'slow';
  quality: 'good' | 'excellent' | 'outstanding';
  tokensPerImage: number;
  isPremium: boolean;
  isNew?: boolean;
  icon: React.ReactNode;
}

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (modelId: string) => void;
  userTier: 'free' | 'premium';
  onUpgradeClick: () => void;
}

const AI_MODELS: AIModel[] = [
  {
    id: 'stable-diffusion-xl',
    name: 'Stable Diffusion XL',
    version: 'v1.0',
    description: 'High-quality image generation with excellent detail',
    capabilities: ['General Purpose', 'High Resolution', 'Fast Generation'],
    speed: 'fast',
    quality: 'excellent',
    tokensPerImage: 5,
    isPremium: false,
    icon: <Cpu className='w-4 h-4' />,
  },
  {
    id: 'midjourney-v6',
    name: 'Midjourney V6',
    version: 'Pro',
    description: 'Premium artistic generation with stunning realism',
    capabilities: ['Artistic', 'Photorealistic', 'Style Transfer'],
    speed: 'medium',
    quality: 'outstanding',
    tokensPerImage: 15,
    isPremium: true,
    isNew: true,
    icon: <Star className='w-4 h-4' />,
  },
  {
    id: 'dalle-3',
    name: 'DALL-E 3',
    version: 'HD',
    description: 'Advanced AI with superior text understanding',
    capabilities: ['Text Integration', 'Complex Scenes', 'High Detail'],
    speed: 'slow',
    quality: 'outstanding',
    tokensPerImage: 20,
    isPremium: true,
    icon: <Brain className='w-4 h-4' />,
  },
  {
    id: 'flux-pro',
    name: 'Flux Pro',
    version: 'Ultra',
    description: 'Lightning-fast generation with premium quality',
    capabilities: ['Ultra Fast', 'Batch Processing', 'Style Consistency'],
    speed: 'fast',
    quality: 'excellent',
    tokensPerImage: 12,
    isPremium: true,
    isNew: true,
    icon: <Zap className='w-4 h-4' />,
  },
];

const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModel,
  onModelChange,
  userTier,
  onUpgradeClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedModelData = AI_MODELS.find(model => model.id === selectedModel);

  const getSpeedColor = (speed: string) => {
    switch (speed) {
      case 'fast':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'slow':
        return 'text-orange-400';
      default:
        return 'text-gray-400';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case 'outstanding':
        return 'text-purple-400';
      case 'excellent':
        return 'text-blue-400';
      case 'good':
        return 'text-green-400';
      default:
        return 'text-gray-400';
    }
  };

  const handleModelSelect = (modelId: string) => {
    const model = AI_MODELS.find(m => m.id === modelId);
    if (model?.isPremium && userTier === 'free') {
      onUpgradeClick();
      return;
    }
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center gap-2 mb-3'>
        <Cpu className='w-5 h-5 text-cyan-400' />
        <h3 className='text-lg font-semibold text-white'>AI Model</h3>
      </div>

      {/* Model Selector Dropdown */}
      <div className='relative'>
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className='w-full bg-black/40 border border-cyan-500/30 rounded-lg p-4 flex items-center justify-between hover:border-cyan-500/50 transition-all duration-300 cyber-glass'
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          aria-label='Select AI model'
          aria-expanded={isOpen}
        >
          <div className='flex items-center gap-3'>
            {selectedModelData?.icon}
            <div className='text-left'>
              <div className='flex items-center gap-2'>
                <span className='text-white font-medium'>
                  {selectedModelData?.name}
                </span>
                {selectedModelData?.isNew && (
                  <span className='px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-bold'>
                    NEW
                  </span>
                )}
                {selectedModelData?.isPremium && userTier === 'free' && (
                  <Crown className='w-4 h-4 text-yellow-400' />
                )}
              </div>
              <span className='text-gray-400 text-sm'>
                {selectedModelData?.version}
              </span>
            </div>
          </div>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronDown className='w-5 h-5 text-gray-400' />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className='absolute top-full left-0 right-0 mt-2 bg-black/90 border border-cyan-500/30 rounded-lg backdrop-blur-xl z-50 cyber-glass'
            >
              <div className='p-2 max-h-80 overflow-y-auto'>
                {AI_MODELS.map(model => (
                  <motion.button
                    key={model.id}
                    onClick={() => handleModelSelect(model.id)}
                    className={`w-full p-4 rounded-lg text-left transition-all duration-300 ${
                      selectedModel === model.id
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'hover:bg-white/5 border border-transparent'
                    } ${
                      model.isPremium && userTier === 'free'
                        ? 'opacity-60 cursor-not-allowed'
                        : 'cursor-pointer'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={model.isPremium && userTier === 'free'}
                    aria-label={`Select ${model.name} model`}
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex items-center gap-3 flex-1'>
                        {model.icon}
                        <div className='flex-1'>
                          <div className='flex items-center gap-2 mb-1'>
                            <span className='text-white font-medium'>
                              {model.name}
                            </span>
                            <span className='text-gray-400 text-sm'>
                              {model.version}
                            </span>
                            {model.isNew && (
                              <span className='px-2 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs rounded-full font-bold'>
                                NEW
                              </span>
                            )}
                          </div>
                          <p className='text-gray-300 text-sm mb-2'>
                            {model.description}
                          </p>

                          {/* Capabilities */}
                          <div className='flex flex-wrap gap-1 mb-2'>
                            {model.capabilities.map(capability => (
                              <span
                                key={capability}
                                className='px-2 py-1 bg-white/10 text-gray-300 text-xs rounded-full'
                              >
                                {capability}
                              </span>
                            ))}
                          </div>

                          {/* Stats */}
                          <div className='flex items-center gap-4 text-xs'>
                            <div className='flex items-center gap-1'>
                              <span className='text-gray-400'>Speed:</span>
                              <span className={getSpeedColor(model.speed)}>
                                {model.speed}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='text-gray-400'>Quality:</span>
                              <span className={getQualityColor(model.quality)}>
                                {model.quality}
                              </span>
                            </div>
                            <div className='flex items-center gap-1'>
                              <span className='text-gray-400'>Cost:</span>
                              <span className='text-cyan-400'>
                                {model.tokensPerImage} tokens
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Premium Lock */}
                      {model.isPremium && userTier === 'free' && (
                        <div className='flex items-center gap-1 ml-2'>
                          <Lock className='w-4 h-4 text-yellow-400' />
                          <Crown className='w-4 h-4 text-yellow-400' />
                        </div>
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Model Info Panel */}
      {selectedModelData && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className='bg-black/30 border border-cyan-500/20 rounded-lg p-4 cyber-glass'
        >
          <h4 className='text-white font-medium mb-2'>Current Model</h4>
          <div className='grid grid-cols-2 gap-4 text-sm'>
            <div>
              <span className='text-gray-400'>Speed:</span>
              <span
                className={`ml-2 ${getSpeedColor(selectedModelData.speed)}`}
              >
                {selectedModelData.speed}
              </span>
            </div>
            <div>
              <span className='text-gray-400'>Quality:</span>
              <span
                className={`ml-2 ${getQualityColor(selectedModelData.quality)}`}
              >
                {selectedModelData.quality}
              </span>
            </div>
            <div>
              <span className='text-gray-400'>Cost per image:</span>
              <span className='ml-2 text-cyan-400'>
                {selectedModelData.tokensPerImage} tokens
              </span>
            </div>
            <div>
              <span className='text-gray-400'>Type:</span>
              <span className='ml-2 text-purple-400'>
                {selectedModelData.isPremium ? 'Premium' : 'Free'}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ModelSelector;
