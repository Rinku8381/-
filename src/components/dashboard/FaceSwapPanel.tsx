'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Upload,
  X,
  AlertTriangle,
  Shield,
  Crown,
  Lock,
} from 'lucide-react';

interface GenerationSettings {
  mode: 'standard' | 'professional';
  model: string;
  style: string;
  resolution: string;
  aspectRatio: string;
  steps: number;
  cfgScale: number;
}

interface FaceSwapPanelProps {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
  userTier: 'free' | 'premium';
  onUpgradeClick: () => void;
}

const FACE_SWAP_MODES = [
  {
    id: 'single',
    label: 'Single Face',
    description: 'Replace one face in the image',
    tier: 'free',
  },
  {
    id: 'multiple',
    label: 'Multiple Faces',
    description: 'Replace multiple faces',
    tier: 'premium',
  },
  {
    id: 'video',
    label: 'Video Face Swap',
    description: 'Apply to video content',
    tier: 'premium',
  },
];

const BLENDING_OPTIONS = [
  {
    id: 'natural',
    label: 'Natural Blend',
    description: 'Smooth, realistic integration',
  },
  {
    id: 'precise',
    label: 'Precise Match',
    description: 'Exact facial features',
  },
  {
    id: 'artistic',
    label: 'Artistic Style',
    description: 'Creative interpretation',
  },
];

export default function FaceSwapPanel({
  settings,
  onChange,
  userTier,
  onUpgradeClick,
}: FaceSwapPanelProps) {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [swapMode, setSwapMode] = useState('single');
  const [blendingMode, setBlendingMode] = useState('natural');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const handleSourceUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setSourceImage(file);
  };

  const handleTargetUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setTargetImage(file);
  };

  const removeSourceImage = () => setSourceImage(null);
  const removeTargetImage = () => setTargetImage(null);

  const isLocked = (tier?: string) => tier === 'premium' && userTier === 'free';

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-cyan-400 flex items-center gap-2'>
        <User className='w-5 h-5' />
        Face Swap Settings
      </h3>

      {/* Safety Warning */}
      <div className='p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg'>
        <div className='flex items-start gap-3'>
          <AlertTriangle className='w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0' />
          <div className='text-sm'>
            <div className='font-medium text-orange-400 mb-1'>
              Facial Safety Policy
            </div>
            <div className='text-orange-300/80 text-xs'>
              Face swap technology should be used responsibly. Do not create
              content to deceive, harm, or impersonate others without consent.
              Violating our policy may result in account suspension.
            </div>
          </div>
        </div>
        <div className='mt-3 flex items-center gap-2'>
          <input
            type='checkbox'
            id='policy-accept'
            checked={acceptedPolicy}
            onChange={e => setAcceptedPolicy(e.target.checked)}
            className='w-4 h-4 rounded border-orange-500/50 bg-orange-500/10 text-orange-500'
          />
          <label htmlFor='policy-accept' className='text-xs text-orange-300'>
            I agree to use this feature responsibly and ethically
          </label>
        </div>
      </div>

      {/* Face Swap Mode */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Face Swap Mode
        </label>
        <div className='grid grid-cols-1 gap-2'>
          {FACE_SWAP_MODES.map(mode => {
            const locked = isLocked(mode.tier);
            return (
              <motion.button
                key={mode.id}
                onClick={() => {
                  if (locked) {
                    onUpgradeClick();
                  } else {
                    setSwapMode(mode.id);
                  }
                }}
                whileHover={{ scale: locked ? 1 : 1.02 }}
                whileTap={{ scale: locked ? 1 : 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all duration-300 relative ${
                  swapMode === mode.id && !locked
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                    : locked
                      ? 'border-gray-600/50 bg-gray-800/20 cursor-not-allowed'
                      : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <div className='text-left'>
                    <div
                      className={`font-medium ${locked ? 'text-gray-500' : 'text-white'}`}
                    >
                      {mode.label}
                    </div>
                    <div
                      className={`text-xs ${locked ? 'text-gray-600' : 'text-gray-400'}`}
                    >
                      {mode.description}
                    </div>
                  </div>
                  {locked && (
                    <div className='flex items-center gap-1 text-yellow-400'>
                      <Lock className='w-3 h-3' />
                      <Crown className='w-3 h-3' />
                    </div>
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Source Face Upload */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Source Face (Face to Use)
        </label>

        {!sourceImage ? (
          <div className='relative'>
            <input
              type='file'
              accept='image/*'
              onChange={handleSourceUpload}
              className='hidden'
              id='source-face-upload'
            />
            <label
              htmlFor='source-face-upload'
              className='block w-full p-6 border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/50 rounded-lg bg-cyan-500/5 hover:bg-cyan-500/10 transition-all duration-300 cursor-pointer group'
            >
              <div className='text-center'>
                <Upload className='w-6 h-6 text-cyan-400 mx-auto mb-2 group-hover:text-cyan-300' />
                <div className='text-white font-medium mb-1'>
                  Upload Source Face
                </div>
                <div className='text-xs text-gray-400'>
                  Clear face photo works best
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className='relative'>
            <div className='aspect-square bg-black/30 rounded-lg overflow-hidden border border-cyan-500/30'>
              <img
                src={URL.createObjectURL(sourceImage)}
                alt='Source face'
                className='w-full h-full object-cover'
              />
            </div>
            <button
              onClick={removeSourceImage}
              className='absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors'
              aria-label='Remove source image'
            >
              <X className='w-3 h-3 text-white' />
            </button>
          </div>
        )}
      </div>

      {/* Target Image Upload */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Target Image (Face to Replace)
        </label>

        {!targetImage ? (
          <div className='relative'>
            <input
              type='file'
              accept='image/*'
              onChange={handleTargetUpload}
              className='hidden'
              id='target-face-upload'
            />
            <label
              htmlFor='target-face-upload'
              className='block w-full p-6 border-2 border-dashed border-purple-500/30 hover:border-purple-400/50 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group'
            >
              <div className='text-center'>
                <Upload className='w-6 h-6 text-purple-400 mx-auto mb-2 group-hover:text-purple-300' />
                <div className='text-white font-medium mb-1'>
                  Upload Target Image
                </div>
                <div className='text-xs text-gray-400'>
                  Image containing face to replace
                </div>
              </div>
            </label>
          </div>
        ) : (
          <div className='relative'>
            <div className='aspect-video bg-black/30 rounded-lg overflow-hidden border border-purple-500/30'>
              <img
                src={URL.createObjectURL(targetImage)}
                alt='Target image'
                className='w-full h-full object-cover'
              />
            </div>
            <button
              onClick={removeTargetImage}
              className='absolute top-2 right-2 w-6 h-6 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors'
              aria-label='Remove target image'
            >
              <X className='w-3 h-3 text-white' />
            </button>
          </div>
        )}
      </div>

      {/* Blending Options */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Blending Mode
        </label>
        <div className='grid grid-cols-1 gap-2'>
          {BLENDING_OPTIONS.map(option => (
            <motion.button
              key={option.id}
              onClick={() => setBlendingMode(option.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                blendingMode === option.id
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
              }`}
            >
              <div className='text-left'>
                <div className='font-medium text-white'>{option.label}</div>
                <div className='text-xs text-gray-400'>
                  {option.description}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Professional Settings */}
      {settings.mode === 'professional' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-4 p-4 border border-purple-500/30 rounded-lg bg-purple-500/10'
        >
          <div className='flex items-center gap-2 text-purple-400'>
            <Shield className='w-4 h-4' />
            <span className='text-sm font-medium'>Professional Face Swap</span>
          </div>

          {/* Face Detection Sensitivity */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <label className='text-sm font-medium text-gray-300'>
                Detection Sensitivity
              </label>
              <span className='text-sm text-cyan-400'>High</span>
            </div>
            <input
              type='range'
              min='1'
              max='10'
              defaultValue='8'
              className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
              aria-label='Face detection sensitivity'
            />
            <div className='flex justify-between text-xs text-gray-500'>
              <span>Loose (1)</span>
              <span>Precise (10)</span>
            </div>
          </div>

          {/* Blend Strength */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <label className='text-sm font-medium text-gray-300'>
                Blend Strength
              </label>
              <span className='text-sm text-cyan-400'>85%</span>
            </div>
            <input
              type='range'
              min='0'
              max='100'
              defaultValue='85'
              className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
              aria-label='Blend strength'
            />
            <div className='flex justify-between text-xs text-gray-500'>
              <span>Subtle (0%)</span>
              <span>Complete (100%)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className='p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg'>
        <div className='text-sm text-cyan-300'>
          <div className='font-medium mb-1'>👤 Face Swap Tips:</div>
          <ul className='text-xs space-y-1 text-cyan-300/80'>
            <li>• Use clear, well-lit face photos for best results</li>
            <li>• Similar face angles work better</li>
            <li>• Professional mode adds advanced blending</li>
            <li>• Always respect privacy and consent</li>
          </ul>
        </div>
      </div>

      {/* Validation */}
      {(!sourceImage || !targetImage || !acceptedPolicy) && (
        <div className='p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg'>
          <div className='text-sm text-orange-400'>
            ⚠️ Required: Upload both images and accept the safety policy
          </div>
        </div>
      )}
    </div>
  );
}
