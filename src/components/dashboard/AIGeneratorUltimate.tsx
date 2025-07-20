'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Crown, Lock, ChevronDown } from 'lucide-react';

// Import modular components
import PromptInput from '@/components/dashboard/PromptInput';
import ImageGenerator from '@/components/dashboard/ImageGenerator';
import VideoGenerator from '@/components/dashboard/VideoGenerator';
import FaceSwapPanel from '@/components/dashboard/FaceSwapPanel';
import ModelSelector from '@/components/dashboard/ModelSelector';
import TokenPanel from '@/components/dashboard/TokenPanel';
import GalleryOutput from '@/components/dashboard/GalleryOutput';
import ModeSelector from '@/components/dashboard/ModeSelector';
import AssistantChatBubble from '@/components/dashboard/AssistantChatBubble';

interface AIGeneratorUltimateProps {
  isVisible: boolean;
  onClose: () => void;
  userTier: 'free' | 'premium';
}

interface GenerationSettings {
  mode: 'standard' | 'professional';
  model: string;
  style: string;
  resolution: string;
  aspectRatio: string;
  steps: number;
  cfgScale: number;
  motionPreset?: string;
}

interface GeneratedItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  prompt: string;
  settings: GenerationSettings;
  timestamp: Date;
  tokenCost: number;
  isFavorite: boolean;
  isPrivate: boolean;
  tags: string[];
  hasWatermark: boolean;
}

const AI_GENERATION_TYPES = [
  {
    id: 'image',
    label: 'Image Generator',
    icon: '🎨',
    description: 'Create stunning AI images',
  },
  {
    id: 'video',
    label: 'Video Generator',
    icon: '🎬',
    description: 'Generate short videos',
  },
  {
    id: 'faceswap',
    label: 'Face Swap',
    icon: '👤',
    description: 'AI face replacement',
  },
];

export default function AIGeneratorUltimate({
  isVisible,
  onClose,
  userTier,
}: AIGeneratorUltimateProps) {
  const [activeTab, setActiveTab] = useState('image');
  const [prompt, setPrompt] = useState('');
  const [settings, setSettings] = useState<GenerationSettings>({
    mode: 'standard',
    model: 'stable-diffusion-xl',
    style: 'realistic',
    resolution: '1024x1024',
    aspectRatio: '1:1',
    steps: 20,
    cfgScale: 7,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedItems, setGeneratedItems] = useState<GeneratedItem[]>([]);
  const [userTokens, setUserTokens] = useState(userTier === 'free' ? 15 : 150);
  const [showAssistant, setShowAssistant] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  // Calculate token cost based on settings
  const calculateTokenCost = () => {
    let baseCost = 5;
    if (settings.mode === 'professional') baseCost += 10;
    if (activeTab === 'video') baseCost += 20;
    if (activeTab === 'faceswap') baseCost += 15;
    if (settings.resolution.includes('2048')) baseCost += 10;
    return baseCost;
  };

  const tokenCost = calculateTokenCost();

  // Handle generation
  const handleGenerate = async () => {
    if (userTokens < tokenCost) {
      setShowUpgradeModal(true);
      return;
    }

    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      const newItem: GeneratedItem = {
        id: Date.now().toString(),
        type: activeTab === 'video' ? 'video' : 'image',
        url: `https://picsum.photos/800/800?random=${Date.now()}`,
        thumbnail: `https://picsum.photos/300/300?random=${Date.now()}`,
        prompt,
        settings,
        timestamp: new Date(),
        tokenCost,
        isFavorite: false,
        isPrivate: false,
        tags: prompt.split(' ').slice(0, 3),
        hasWatermark: userTier === 'free',
      };

      setGeneratedItems(prev => [newItem, ...prev]);
      setUserTokens(prev => prev - tokenCost);
      setIsGenerating(false);
    }, 3000);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className='w-full max-w-7xl h-[95vh] bg-black/95 border-2 border-cyan-500/50 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.3)] relative'
        >
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-cyan-500/20 bg-gradient-to-r from-purple-900/20 via-cyan-900/20 to-pink-900/20'>
            <div className='flex items-center gap-4'>
              <div className='w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(0,255,255,0.4)]'>
                <Sparkles className='w-6 h-6 text-white' />
              </div>
              <div>
                <h1 className='text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text'>
                  AI Generator Ultimate
                </h1>
                <p className='text-cyan-300/70 text-sm'>
                  Advanced Multi-Modal AI Creation Suite
                </p>
              </div>
              {userTier === 'premium' && (
                <div className='flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-3 py-1'>
                  <Crown className='w-4 h-4 text-yellow-400' />
                  <span className='text-yellow-400 text-sm font-semibold'>
                    Premium
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={onClose}
              className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
              aria-label='Close AI Generator'
            >
              <X className='w-5 h-5 text-red-400' />
            </button>
          </div>

          {/* Main Content */}
          <div className='flex h-full'>
            {/* Left Panel - Controls */}
            <div className='w-1/3 border-r border-cyan-500/20 overflow-y-auto p-6 space-y-6'>
              {/* Generation Type Tabs */}
              <div className='space-y-4'>
                <h3 className='text-lg font-semibold text-cyan-400 flex items-center gap-2'>
                  <span className='text-xl'>⚡</span>
                  Generation Type
                </h3>
                <div className='grid grid-cols-1 gap-3'>
                  {AI_GENERATION_TYPES.map(type => (
                    <motion.button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        activeTab === type.id
                          ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                          : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className='flex items-center gap-3'>
                        <span className='text-2xl'>{type.icon}</span>
                        <div>
                          <div className='font-semibold text-white'>
                            {type.label}
                          </div>
                          <div className='text-sm text-cyan-300/70'>
                            {type.description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Mode Selector */}
              <ModeSelector
                selectedMode={settings.mode}
                onModeChange={(mode: 'standard' | 'professional') =>
                  setSettings(prev => ({ ...prev, mode }))
                }
                userTier={userTier}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />

              {/* Model Selector */}
              <ModelSelector
                selectedModel={settings.model}
                onModelChange={(model: string) =>
                  setSettings(prev => ({ ...prev, model }))
                }
                userTier={userTier}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />

              {/* Prompt Input */}
              <PromptInput
                value={prompt}
                onChange={setPrompt}
                placeholder={`Describe your ${activeTab} creation...`}
              />

              {/* Dynamic Generator Components */}
              {activeTab === 'image' && (
                <ImageGenerator
                  settings={settings}
                  onChange={setSettings}
                  userTier={userTier}
                  onUpgradeClick={() => setShowUpgradeModal(true)}
                />
              )}

              {activeTab === 'video' && (
                <VideoGenerator
                  settings={settings}
                  onChange={setSettings}
                  userTier={userTier}
                  onUpgradeClick={() => setShowUpgradeModal(true)}
                />
              )}

              {activeTab === 'faceswap' && (
                <FaceSwapPanel
                  settings={settings}
                  onChange={setSettings}
                  userTier={userTier}
                  onUpgradeClick={() => setShowUpgradeModal(true)}
                />
              )}

              {/* Token Panel */}
              <TokenPanel
                currentTokens={userTokens}
                estimatedCost={tokenCost}
                userTier={userTier}
                onBuyTokens={() => setShowUpgradeModal(true)}
                onEarnTokens={() => {
                  /* Open invite panel */
                }}
              />

              {/* Generate Button */}
              <motion.button
                onClick={handleGenerate}
                disabled={
                  isGenerating || !prompt.trim() || userTokens < tokenCost
                }
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className='w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(0,255,255,0.3)] disabled:shadow-none transition-all duration-300 flex items-center justify-center gap-3'
              >
                {isGenerating ? (
                  <>
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className='w-5 h-5' />
                    Generate AI{' '}
                    {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                  </>
                )}
              </motion.button>
            </div>

            {/* Right Panel - Gallery */}
            <div className='flex-1 flex flex-col'>
              {/* Gallery Output */}
              <GalleryOutput
                items={generatedItems}
                isLoading={isGenerating}
                onRegenerateImage={(id: string) => {
                  const item = generatedItems.find(item => item.id === id);
                  if (item) {
                    setPrompt(item.prompt);
                    setSettings(item.settings);
                  }
                }}
                onDownload={(id: string) => {
                  console.log('Download item:', id);
                }}
                onToggleFavorite={(id: string) => {
                  setGeneratedItems(prev =>
                    prev.map(item =>
                      item.id === id
                        ? { ...item, isFavorite: !item.isFavorite }
                        : item
                    )
                  );
                }}
                onDelete={(id: string) => {
                  setGeneratedItems(prev =>
                    prev.filter(item => item.id !== id)
                  );
                }}
                onShare={(id: string) => {
                  console.log('Share item:', id);
                }}
                userTier={userTier}
                onUpgradeClick={() => setShowUpgradeModal(true)}
              />
            </div>
          </div>
        </motion.div>

        {/* Assistant Chat Bubble - Floating */}
        <AssistantChatBubble
          isVisible={showAssistant}
          onToggle={() => setShowAssistant(!showAssistant)}
          currentPrompt={prompt}
          onPromptSuggestion={(newPrompt: string) => setPrompt(newPrompt)}
          generationType={activeTab as 'image' | 'video' | 'faceswap'}
        />
      </motion.div>

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-gradient-to-br from-purple-900/90 via-black/90 to-cyan-900/90 border-2 border-purple-500/50 rounded-2xl p-8 max-w-md w-full backdrop-blur-xl'
            >
              <div className='text-center space-y-6'>
                <div className='w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(251,191,36,0.5)]'>
                  <Crown className='w-8 h-8 text-white' />
                </div>
                <div>
                  <h3 className='text-2xl font-bold text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text mb-2'>
                    Upgrade to Premium
                  </h3>
                  <p className='text-gray-300'>
                    Unlock unlimited generations, professional mode, and
                    exclusive AI models.
                  </p>
                </div>
                <div className='flex gap-3'>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className='flex-1 border border-gray-500/50 hover:border-gray-400/70 text-gray-300 hover:text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300'
                  >
                    Maybe Later
                  </button>
                  <button
                    onClick={() => setShowUpgradeModal(false)}
                    className='flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-[0_0_20px_rgba(251,191,36,0.3)]'
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
