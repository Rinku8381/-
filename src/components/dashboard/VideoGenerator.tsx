'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Video, Upload, X, Lock, Crown, Play } from 'lucide-react';

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

interface VideoGeneratorProps {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
  userTier: 'free' | 'premium';
  onUpgradeClick: () => void;
}

const MOTION_PRESETS = [
  {
    id: 'zoom-in',
    label: 'Zoom In',
    preview: '🔍',
    description: 'Slowly zoom into the scene',
  },
  {
    id: 'camera-orbit',
    label: 'Camera Orbit',
    preview: '🔄',
    description: 'Circular camera movement',
  },
  {
    id: 'neon-burst',
    label: 'Neon Burst',
    preview: '💥',
    description: 'Explosive neon effects',
  },
  {
    id: 'smooth-pan',
    label: 'Smooth Pan',
    preview: '➡️',
    description: 'Horizontal camera pan',
  },
  {
    id: 'particle-flow',
    label: 'Particle Flow',
    preview: '✨',
    description: 'Flowing particle animation',
    tier: 'premium',
  },
  {
    id: 'morphing',
    label: 'Morphing',
    preview: '🌀',
    description: 'Shape transformation',
    tier: 'premium',
  },
];

const VIDEO_DURATIONS = [
  { id: '3s', label: '3 seconds', cost: 20 },
  { id: '6s', label: '6 seconds', cost: 35 },
  { id: '9s', label: '9 seconds', cost: 50 },
];

export default function VideoGenerator({
  settings,
  onChange,
  userTier,
  onUpgradeClick,
}: VideoGeneratorProps) {
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [duration, setDuration] = useState('3s');
  const [inputMode, setInputMode] = useState<'text' | 'image'>('text');

  const handleSettingChange = (key: keyof GenerationSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedImage(file);
      setInputMode('image');
    }
  };

  const removeImage = () => {
    setUploadedImage(null);
    setInputMode('text');
  };

  const isLocked = (tier?: string) => tier === 'premium' && userTier === 'free';

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-cyan-400 flex items-center gap-2'>
        <Video className='w-5 h-5' />
        Video Settings
      </h3>

      {/* Input Mode Toggle */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Generation Mode
        </label>
        <div className='grid grid-cols-2 gap-3'>
          <motion.button
            onClick={() => setInputMode('text')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              inputMode === 'text'
                ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
            }`}
          >
            <div className='text-center'>
              <div className='text-2xl mb-2'>📝</div>
              <div className='text-sm font-medium text-white'>
                Text to Video
              </div>
              <div className='text-xs text-gray-400'>Generate from prompt</div>
            </div>
          </motion.button>

          <motion.button
            onClick={() => setInputMode('image')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`p-4 rounded-lg border-2 transition-all duration-300 ${
              inputMode === 'image'
                ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_10px_rgba(147,51,234,0.3)]'
                : 'border-purple-500/30 bg-black/20 hover:border-purple-400/50'
            }`}
          >
            <div className='text-center'>
              <div className='text-2xl mb-2'>🖼️</div>
              <div className='text-sm font-medium text-white'>
                Image to Video
              </div>
              <div className='text-xs text-gray-400'>
                Animate uploaded image
              </div>
            </div>
          </motion.button>
        </div>
      </div>

      {/* Image Upload (when image mode is selected) */}
      {inputMode === 'image' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-3'
        >
          <label className='text-sm font-medium text-gray-300'>
            Source Image
          </label>

          {!uploadedImage ? (
            <div className='relative'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                className='hidden'
                id='video-image-upload'
              />
              <label
                htmlFor='video-image-upload'
                className='block w-full p-8 border-2 border-dashed border-purple-500/30 hover:border-purple-400/50 rounded-lg bg-purple-500/5 hover:bg-purple-500/10 transition-all duration-300 cursor-pointer group'
              >
                <div className='text-center'>
                  <Upload className='w-8 h-8 text-purple-400 mx-auto mb-3 group-hover:text-purple-300' />
                  <div className='text-white font-medium mb-1'>
                    Upload Source Image
                  </div>
                  <div className='text-sm text-gray-400'>
                    Drag & drop or click to select
                  </div>
                  <div className='text-xs text-purple-400 mt-2'>
                    JPG, PNG up to 10MB
                  </div>
                </div>
              </label>
            </div>
          ) : (
            <div className='relative'>
              <div className='aspect-video bg-black/30 rounded-lg overflow-hidden border border-purple-500/30'>
                <img
                  src={URL.createObjectURL(uploadedImage)}
                  alt='Source'
                  className='w-full h-full object-cover'
                />
              </div>
              <button
                onClick={removeImage}
                className='absolute top-2 right-2 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center transition-colors'
                aria-label='Remove uploaded image'
              >
                <X className='w-4 h-4 text-white' />
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Motion Presets */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Motion Preset
        </label>
        <div className='grid grid-cols-1 gap-2'>
          {MOTION_PRESETS.map(preset => {
            const locked = isLocked(preset.tier);
            return (
              <motion.button
                key={preset.id}
                onClick={() => {
                  if (locked) {
                    onUpgradeClick();
                  } else {
                    handleSettingChange('motionPreset', preset.id);
                  }
                }}
                whileHover={{ scale: locked ? 1 : 1.02 }}
                whileTap={{ scale: locked ? 1 : 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all duration-300 relative ${
                  settings.motionPreset === preset.id && !locked
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                    : locked
                      ? 'border-gray-600/50 bg-gray-800/20 cursor-not-allowed'
                      : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
                }`}
              >
                <div className='flex items-center gap-3'>
                  <span className='text-xl'>{preset.preview}</span>
                  <div className='flex-1 text-left'>
                    <div
                      className={`font-medium ${locked ? 'text-gray-500' : 'text-white'}`}
                    >
                      {preset.label}
                    </div>
                    <div
                      className={`text-xs ${locked ? 'text-gray-600' : 'text-gray-400'}`}
                    >
                      {preset.description}
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

      {/* Duration Selection */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>Duration</label>
        <div className='grid grid-cols-3 gap-2'>
          {VIDEO_DURATIONS.map(dur => (
            <motion.button
              key={dur.id}
              onClick={() => setDuration(dur.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                duration === dur.id
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
              }`}
            >
              <div className='text-center'>
                <div className='text-sm font-medium text-white'>
                  {dur.label}
                </div>
                <div className='text-xs text-yellow-400'>{dur.cost} tokens</div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Video Quality (Professional Mode) */}
      {settings.mode === 'professional' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-4 p-4 border border-purple-500/30 rounded-lg bg-purple-500/10'
        >
          <div className='flex items-center gap-2 text-purple-400'>
            <Play className='w-4 h-4' />
            <span className='text-sm font-medium'>
              Professional Video Settings
            </span>
          </div>

          {/* Frame Rate */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-300'>
              Frame Rate
            </label>
            <select
              className='w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none transition-all duration-300'
              aria-label='Select frame rate'
            >
              <option value='24'>24 FPS (Cinematic)</option>
              <option value='30'>30 FPS (Standard)</option>
              <option value='60'>60 FPS (Smooth) - Premium</option>
            </select>
          </div>

          {/* Video Quality */}
          <div className='space-y-2'>
            <label className='text-sm font-medium text-gray-300'>Quality</label>
            <select
              className='w-full bg-black/30 border border-purple-500/30 rounded-lg px-3 py-2 text-white focus:border-purple-400 focus:outline-none transition-all duration-300'
              aria-label='Select video quality'
            >
              <option value='standard'>Standard (720p)</option>
              <option value='high'>High (1080p)</option>
              <option value='ultra'>Ultra (2K) - Premium</option>
            </select>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className='p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg'>
        <div className='text-sm text-cyan-300'>
          <div className='font-medium mb-1'>🎬 Video Generation Tips:</div>
          <ul className='text-xs space-y-1 text-cyan-300/80'>
            <li>• Longer videos consume more tokens</li>
            <li>• Motion presets add dynamic effects</li>
            <li>• Image-to-video works best with clear subjects</li>
            <li>• Professional mode adds smooth interpolation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
