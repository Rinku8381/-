'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Lock, Crown, Sliders } from 'lucide-react';

interface GenerationSettings {
  mode: 'standard' | 'professional';
  model: string;
  style: string;
  resolution: string;
  aspectRatio: string;
  steps: number;
  cfgScale: number;
}

interface ImageGeneratorProps {
  settings: GenerationSettings;
  onChange: (settings: GenerationSettings) => void;
  userTier: 'free' | 'premium';
  onUpgradeClick: () => void;
}

const STYLE_PRESETS = [
  { id: 'realistic', label: 'Realistic', preview: '📸' },
  { id: 'anime', label: 'Anime', preview: '🎌' },
  { id: 'cyberpunk', label: 'Cyberpunk', preview: '🌃' },
  { id: 'fantasy', label: 'Fantasy', preview: '🧙‍♂️' },
  { id: 'abstract', label: 'Abstract', preview: '🎨' },
  { id: 'watercolor', label: 'Watercolor', preview: '🖌️' },
];

const RESOLUTION_OPTIONS = [
  { id: '512x512', label: '512×512', tier: 'free' },
  { id: '768x768', label: '768×768', tier: 'free' },
  { id: '1024x1024', label: '1024×1024', tier: 'free' },
  { id: '1536x1536', label: '1536×1536', tier: 'premium' },
  { id: '2048x2048', label: '2048×2048 (4K)', tier: 'premium' },
];

const ASPECT_RATIOS = [
  { id: '1:1', label: 'Square (1:1)', value: '1:1' },
  { id: '16:9', label: 'Landscape (16:9)', value: '16:9' },
  { id: '9:16', label: 'Portrait (9:16)', value: '9:16' },
  { id: '4:3', label: 'Classic (4:3)', value: '4:3' },
  { id: '3:2', label: 'Photo (3:2)', value: '3:2' },
];

export default function ImageGenerator({
  settings,
  onChange,
  userTier,
  onUpgradeClick,
}: ImageGeneratorProps) {
  const handleSettingChange = (key: keyof GenerationSettings, value: any) => {
    onChange({ ...settings, [key]: value });
  };

  const isLocked = (tier: string) => tier === 'premium' && userTier === 'free';

  return (
    <div className='space-y-6'>
      <h3 className='text-lg font-semibold text-cyan-400 flex items-center gap-2'>
        <ImageIcon className='w-5 h-5' />
        Image Settings
      </h3>

      {/* Style Presets */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Style Preset
        </label>
        <div className='grid grid-cols-2 gap-2'>
          {STYLE_PRESETS.map(style => (
            <motion.button
              key={style.id}
              onClick={() => handleSettingChange('style', style.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                settings.style === style.id
                  ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                  : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
              }`}
            >
              <div className='flex items-center gap-2'>
                <span className='text-lg'>{style.preview}</span>
                <span className='text-sm font-medium text-white'>
                  {style.label}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Resolution */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>Resolution</label>
        <div className='grid grid-cols-1 gap-2'>
          {RESOLUTION_OPTIONS.map(resolution => {
            const locked = isLocked(resolution.tier);
            return (
              <motion.button
                key={resolution.id}
                onClick={() => {
                  if (locked) {
                    onUpgradeClick();
                  } else {
                    handleSettingChange('resolution', resolution.id);
                  }
                }}
                whileHover={{ scale: locked ? 1 : 1.02 }}
                whileTap={{ scale: locked ? 1 : 0.98 }}
                className={`p-3 rounded-lg border-2 transition-all duration-300 relative ${
                  settings.resolution === resolution.id && !locked
                    ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_10px_rgba(0,255,255,0.3)]'
                    : locked
                      ? 'border-gray-600/50 bg-gray-800/20 cursor-not-allowed'
                      : 'border-cyan-500/30 bg-black/20 hover:border-cyan-400/50'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <span
                    className={`text-sm font-medium ${locked ? 'text-gray-500' : 'text-white'}`}
                  >
                    {resolution.label}
                  </span>
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

      {/* Aspect Ratio */}
      <div className='space-y-3'>
        <label className='text-sm font-medium text-gray-300'>
          Aspect Ratio
        </label>
        <select
          value={settings.aspectRatio}
          onChange={e => handleSettingChange('aspectRatio', e.target.value)}
          className='w-full bg-black/30 border border-cyan-500/30 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none transition-all duration-300'
          aria-label='Select aspect ratio'
        >
          {ASPECT_RATIOS.map(ratio => (
            <option key={ratio.id} value={ratio.value} className='bg-black'>
              {ratio.label}
            </option>
          ))}
        </select>
      </div>

      {/* Advanced Settings */}
      {settings.mode === 'professional' && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className='space-y-4 p-4 border border-purple-500/30 rounded-lg bg-purple-500/10'
        >
          <div className='flex items-center gap-2 text-purple-400'>
            <Sliders className='w-4 h-4' />
            <span className='text-sm font-medium'>Professional Settings</span>
          </div>

          {/* Steps */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <label className='text-sm font-medium text-gray-300'>Steps</label>
              <span className='text-sm text-cyan-400'>{settings.steps}</span>
            </div>
            <input
              type='range'
              min='10'
              max='100'
              value={settings.steps}
              onChange={e =>
                handleSettingChange('steps', parseInt(e.target.value))
              }
              className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
              aria-label='Generation steps'
            />
            <div className='flex justify-between text-xs text-gray-500'>
              <span>Fast (10)</span>
              <span>Quality (100)</span>
            </div>
          </div>

          {/* CFG Scale */}
          <div className='space-y-2'>
            <div className='flex justify-between'>
              <label className='text-sm font-medium text-gray-300'>
                CFG Scale
              </label>
              <span className='text-sm text-cyan-400'>{settings.cfgScale}</span>
            </div>
            <input
              type='range'
              min='1'
              max='20'
              step='0.5'
              value={settings.cfgScale}
              onChange={e =>
                handleSettingChange('cfgScale', parseFloat(e.target.value))
              }
              className='w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider'
              aria-label='CFG Scale'
            />
            <div className='flex justify-between text-xs text-gray-500'>
              <span>Creative (1)</span>
              <span>Precise (20)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tips */}
      <div className='p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-lg'>
        <div className='text-sm text-cyan-300'>
          <div className='font-medium mb-1'>💡 Image Generation Tips:</div>
          <ul className='text-xs space-y-1 text-cyan-300/80'>
            <li>• Higher resolutions cost more tokens</li>
            <li>• Professional mode provides better quality</li>
            <li>• Try different styles for varied results</li>
            <li>• Square ratios work best for portraits</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
