'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Wand2,
  Settings,
  Download,
  Heart,
  Copy,
  Shuffle,
  Play,
  Pause,
  Zap,
  Sparkles,
  Image as ImageIcon,
  Loader,
  X,
} from 'lucide-react';
import { CyberpunkLoader, LoadingOverlay } from '@/components/CyberpunkLoader';

interface AIImageGenerationPanelProps {
  isVisible: boolean;
  onClose: () => void;
  userTokens: number;
  userTier: 'free' | 'premium';
  onTokensUpdate: (newTokens: number) => void;
}

interface GenerationParams {
  prompt: string;
  negativePrompt: string;
  style: string;
  aspectRatio: string;
  seed: number;
  guidanceScale: number;
  steps: number;
  model: string;
}

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  params: GenerationParams;
  timestamp: Date;
  isLiked: boolean;
}

const STYLE_PRESETS = [
  { id: 'photorealistic', name: 'Photorealistic', preview: '📸' },
  { id: 'anime', name: 'Anime', preview: '🎌' },
  { id: 'digital-art', name: 'Digital Art', preview: '🎨' },
  { id: 'cyberpunk', name: 'Cyberpunk', preview: '🤖' },
  { id: 'fantasy', name: 'Fantasy', preview: '🧙‍♀️' },
  { id: 'game-asset', name: 'Game Asset', preview: '🎮' },
];

const ASPECT_RATIOS = [
  { id: '1:1', name: 'Square', ratio: '1:1' },
  { id: '16:9', name: 'Landscape', ratio: '16:9' },
  { id: '9:16', name: 'Portrait', ratio: '9:16' },
  { id: '3:4', name: 'Photo', ratio: '3:4' },
];

export default function AIImageGenerationPanel({
  isVisible,
  onClose,
  userTokens,
  userTier,
  onTokensUpdate,
}: AIImageGenerationPanelProps) {
  const [params, setParams] = useState<GenerationParams>({
    prompt: '',
    negativePrompt: '',
    style: 'photorealistic',
    aspectRatio: '1:1',
    seed: Math.floor(Math.random() * 1000000),
    guidanceScale: 7.5,
    steps: 20,
    model: 'seraphine-v1',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [hologramPrompt, setHologramPrompt] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const promptRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Hologram typing effect
  useEffect(() => {
    if (params.prompt) {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= params.prompt.length) {
          setHologramPrompt(params.prompt.slice(0, index));
          index++;
        } else {
          clearInterval(interval);
        }
      }, 50);
      return () => clearInterval(interval);
    } else {
      setHologramPrompt('');
    }
    return undefined;
  }, [params.prompt]);

  // Play synth audio on generation
  const playGenerationSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  };

  const handleGenerate = async () => {
    if (!params.prompt.trim()) return;

    const tokenCost = userTier === 'free' ? 10 : 0;
    if (userTier === 'free' && userTokens < tokenCost) {
      alert('Insufficient Neural Tokens!');
      return;
    }

    setIsGenerating(true);
    playGenerationSound();

    try {
      // Simulate AI generation
      await new Promise(resolve => setTimeout(resolve, 3000));

      const newImages: GeneratedImage[] = [];
      const imageCount = userTier === 'free' ? 2 : 4;

      for (let i = 0; i < imageCount; i++) {
        newImages.push({
          id: `img_${Date.now()}_${i}`,
          url: `https://picsum.photos/512/512?random=${Date.now() + i}`,
          prompt: params.prompt,
          params: { ...params },
          timestamp: new Date(),
          isLiked: false,
        });
      }

      setGeneratedImages(newImages);

      if (userTier === 'free') {
        onTokensUpdate(userTokens - tokenCost);
      }
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLikeImage = (imageId: string) => {
    setGeneratedImages(prev =>
      prev.map(img =>
        img.id === imageId ? { ...img, isLiked: !img.isLiked } : img
      )
    );
  };

  const handleDownloadImage = async (image: GeneratedImage) => {
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `seraphine_${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleRemixPrompt = (image: GeneratedImage) => {
    setParams(image.params);
    setParams(prev => ({ ...prev, seed: Math.floor(Math.random() * 1000000) }));
  };

  if (!isVisible) return null;

  return (
    <>
      <audio ref={audioRef} preload='auto'>
        <source
          src='/assets/splash/SplashFuturisticSynthwave.mp3'
          type='audio/mpeg'
        />
      </audio>

      <div className='fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
        <div className='seraphine-holo-panel w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden'>
          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-cyan-500/20'>
            <div className='flex items-center gap-4'>
              <div className='seraphine-plasma-orb w-12 h-12'></div>
              <div>
                <h2 className='text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent'>
                  Neural Image Genesis
                </h2>
                <p className='text-sm text-cyan-400/70'>
                  AI-Powered Visual Creation Engine
                </p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center gap-2 px-4 py-2 bg-black/30 rounded-lg border border-cyan-500/30'>
                <Zap className='w-4 h-4 text-cyan-400' />
                <span className='text-cyan-400 font-semibold'>
                  {userTokens}
                </span>
                <span className='text-cyan-400/70 text-sm'>Neural Tokens</span>
              </div>

              <button
                onClick={onClose}
                className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
                aria-label='Close AI Image Generation Panel'
                title='Close'
              >
                <X className='w-5 h-5 text-red-400' />
              </button>
            </div>
          </div>

          <div className='flex-1 flex overflow-hidden'>
            {/* Left Panel - Controls */}
            <div className='w-1/3 p-6 border-r border-cyan-500/20 overflow-y-auto'>
              {/* Prompt Input */}
              <div className='mb-6'>
                <label className='block text-cyan-400 font-semibold mb-3'>
                  Neural Prompt
                </label>
                <div className='relative'>
                  <textarea
                    ref={promptRef}
                    value={params.prompt}
                    onChange={e =>
                      setParams(prev => ({ ...prev, prompt: e.target.value }))
                    }
                    placeholder='Describe your vision in detail...'
                    className='w-full h-32 bg-black/30 border border-cyan-500/30 rounded-lg p-4 text-white placeholder-cyan-400/50 resize-none focus:border-cyan-400 focus:outline-none transition-colors'
                  />

                  {/* Hologram Display */}
                  {hologramPrompt && (
                    <div className='absolute top-4 left-4 pointer-events-none'>
                      <div className='text-cyan-400/80 text-sm font-mono'>
                        {hologramPrompt}
                        <span className='animate-pulse'>|</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !params.prompt.trim()}
                className='w-full seraphine-neural-btn h-14 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3'
              >
                {isGenerating ? (
                  <>
                    <Loader className='w-5 h-5 animate-spin' />
                    Manifesting Reality...
                  </>
                ) : (
                  <>
                    <Wand2 className='w-5 h-5' />
                    Generate Neural Vision
                    {userTier === 'free' && (
                      <span className='text-xs'>(10 tokens)</span>
                    )}
                  </>
                )}
              </button>
            </div>

            {/* Right Panel - Generated Images */}
            <div className='flex-1 p-6'>
              {isGenerating ? (
                <div className='h-full flex flex-col items-center justify-center'>
                  <div className='seraphine-plasma-orb w-24 h-24 mb-6'></div>
                  <div className='text-center'>
                    <h3 className='text-xl font-bold text-cyan-400 mb-2'>
                      Neural Processing...
                    </h3>
                    <p className='text-cyan-400/70'>
                      Seraphine is manifesting your vision
                    </p>
                  </div>
                </div>
              ) : generatedImages.length > 0 ? (
                <div className='h-full flex flex-col'>
                  <h3 className='text-lg font-bold text-cyan-400 mb-4'>
                    Generated Visions
                  </h3>

                  <div className='grid grid-cols-2 gap-4 flex-1'>
                    {generatedImages.map(image => (
                      <div
                        key={image.id}
                        className='seraphine-holo-panel p-4 group hover:scale-105 transition-transform'
                      >
                        <div className='relative aspect-square mb-4 overflow-hidden rounded-lg'>
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className='w-full h-full object-cover'
                          />

                          {/* Hover Overlay */}
                          <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2'>
                            <button
                              onClick={() => handleLikeImage(image.id)}
                              className={`p-2 rounded-full transition-colors ${
                                image.isLiked
                                  ? 'bg-red-500 text-white'
                                  : 'bg-white/20 text-white hover:bg-red-500'
                              }`}
                              aria-label={
                                image.isLiked ? 'Unlike image' : 'Like image'
                              }
                              title={image.isLiked ? 'Unlike' : 'Like'}
                            >
                              <Heart
                                className={`w-4 h-4 ${image.isLiked ? 'fill-current' : ''}`}
                              />
                            </button>

                            <button
                              onClick={() => handleDownloadImage(image)}
                              className='p-2 rounded-full bg-white/20 text-white hover:bg-cyan-500 transition-colors'
                              aria-label='Download image'
                              title='Download'
                            >
                              <Download className='w-4 h-4' />
                            </button>

                            <button
                              onClick={() => handleRemixPrompt(image)}
                              className='p-2 rounded-full bg-white/20 text-white hover:bg-magenta-500 transition-colors'
                              aria-label='Remix prompt'
                              title='Remix'
                            >
                              <Shuffle className='w-4 h-4' />
                            </button>
                          </div>
                        </div>

                        <p className='text-xs text-cyan-400/70 truncate'>
                          {image.prompt}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='h-full flex items-center justify-center'>
                  <div className='text-center'>
                    <ImageIcon className='w-16 h-16 text-cyan-400/30 mx-auto mb-4' />
                    <h3 className='text-lg font-bold text-cyan-400/50 mb-2'>
                      Neural Canvas Awaits
                    </h3>
                    <p className='text-cyan-400/40'>
                      Enter a prompt to begin creation
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Loading Overlay */}
      <LoadingOverlay
        isVisible={isGenerating}
        text='Generating AI masterpiece...'
        variant='neural'
        onCancel={() => setIsGenerating(false)}
      />
    </>
  );
}
