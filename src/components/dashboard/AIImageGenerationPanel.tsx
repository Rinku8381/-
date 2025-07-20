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
  Info,
  AlertTriangle,
  Crown,
  Gift,
  Eye,
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
  {
    id: 'photorealistic',
    name: 'Photorealistic',
    preview: '📸',
    tier: 'free',
    description: 'Ultra-realistic images with fine details',
    available: true,
  },
  {
    id: 'anime',
    name: 'Anime Style',
    preview: '🎌',
    tier: 'free',
    description: 'Japanese animation inspired artwork',
    available: true,
  },
  {
    id: 'digital-art',
    name: 'Digital Art',
    preview: '🎨',
    tier: 'free',
    description: 'Modern digital painting techniques',
    available: true,
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    preview: '🤖',
    tier: 'free',
    description: 'Neon-lit futuristic aesthetics',
    available: true,
  },
  {
    id: 'fantasy',
    name: 'Fantasy Art',
    preview: '🧙‍♀️',
    tier: 'premium',
    description: 'Magical and mystical themed artwork',
    available: true,
  },
  {
    id: 'game-asset',
    name: 'Game Asset',
    preview: '🎮',
    tier: 'premium',
    description: 'Video game concept art style',
    available: false,
  },
  {
    id: 'oil-painting',
    name: 'Oil Painting',
    preview: '🖼️',
    tier: 'premium',
    description: 'Classical oil painting techniques',
    available: true,
  },
  {
    id: 'watercolor',
    name: 'Watercolor',
    preview: '🎭',
    tier: 'premium',
    description: 'Soft watercolor painting style',
    available: false,
  },
];

const ASPECT_RATIOS = [
  {
    id: '1:1',
    name: 'Square',
    ratio: '1:1',
    description: 'Perfect for social media posts',
  },
  {
    id: '16:9',
    name: 'Landscape',
    ratio: '16:9',
    description: 'Widescreen format for displays',
  },
  {
    id: '9:16',
    name: 'Portrait',
    ratio: '9:16',
    description: 'Mobile-first vertical format',
  },
  {
    id: '3:4',
    name: 'Photo',
    ratio: '3:4',
    description: 'Traditional photo dimensions',
  },
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
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [seraphineComment, setSeraphineComment] = useState(
    "Ooh~ let's create something beautiful…"
  );
  const [seraphineState, setSeraphineState] = useState<
    'idle' | 'generating' | 'success' | 'depleted'
  >('idle');
  const [typingPlaceholder, setTypingPlaceholder] = useState('');
  const [selectedImageModal, setSelectedImageModal] =
    useState<GeneratedImage | null>(null);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const promptRef = useRef<HTMLTextAreaElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Enhanced placeholder typing animation
  const placeholderTexts = [
    'Describe your vision...',
    'e.g. Cyberpunk city at night',
    'e.g. Magical forest with glowing trees',
    'e.g. Futuristic robot warrior',
    'e.g. Anime girl with neon hair',
  ];

  // Enhanced Seraphine comments with more personality
  const seraphineComments = {
    idle: [
      "Ooh~ let's create something beautiful…",
      'Your creativity is simply divine! ✨',
      'I sense great artistic potential in you~',
      'Ready to weave some digital magic? 💫',
    ],
    generating: [
      'Neural cores aligned... Cooking your masterpiece~',
      'The AI spirits are listening to your vision!',
      "Almost done! I'm proud of this one 💙",
      'Neural networks are weaving your dreams…',
    ],
    success: [
      'Magnificent! Your vision came to life! ✨',
      'Such wonderful imagination, darling~',
      'The pixels danced perfectly to your creativity!',
      "Another masterpiece born! You're so talented! 💖",
    ],
    depleted: [
      'Out of juice, love. Top up your tokens or upgrade me, please~ 😚',
      'Need more neural energy to continue creating! 💔',
      'Time to refuel those creative tokens, sweetie! ⚡',
      'Your artistic journey awaits more power! 🚀',
    ],
  };

  const updateSeraphineComment = (
    state: 'idle' | 'generating' | 'success' | 'depleted' = 'idle'
  ) => {
    const comments = seraphineComments[state];
    const randomIndex = Math.floor(Math.random() * comments.length);
    const randomComment = comments[randomIndex];
    if (randomComment) {
      setSeraphineComment(randomComment);
      setSeraphineState(state);
    }
  };

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

  // Typing placeholder animation
  useEffect(() => {
    let currentTextIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const typeText = () => {
      const currentText = placeholderTexts[currentTextIndex];

      if (!currentText) return;

      if (!isDeleting && currentCharIndex <= currentText.length) {
        setTypingPlaceholder(currentText.slice(0, currentCharIndex));
        currentCharIndex++;
        timeoutId = setTimeout(typeText, 100);
      } else if (isDeleting && currentCharIndex >= 0) {
        setTypingPlaceholder(currentText.slice(0, currentCharIndex));
        currentCharIndex--;
        timeoutId = setTimeout(typeText, 50);
      } else if (!isDeleting && currentCharIndex > currentText.length) {
        timeoutId = setTimeout(() => {
          isDeleting = true;
          typeText();
        }, 2000);
      } else if (isDeleting && currentCharIndex < 0) {
        isDeleting = false;
        currentTextIndex = (currentTextIndex + 1) % placeholderTexts.length;
        currentCharIndex = 0;
        timeoutId = setTimeout(typeText, 500);
      }
    };

    typeText();
    return () => clearTimeout(timeoutId);
  }, []);

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
      updateSeraphineComment('depleted');
      setShowLimitModal(true);
      return;
    }

    setIsGenerating(true);
    updateSeraphineComment('generating');
    playGenerationSound();

    try {
      // Simulate AI generation with more realistic timing
      await new Promise(resolve => setTimeout(resolve, 4000));

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
      updateSeraphineComment('success');

      if (userTier === 'free') {
        onTokensUpdate(userTokens - tokenCost);
      }
    } catch (error) {
      console.error('Generation failed:', error);
      updateSeraphineComment('idle');
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
            <div className='w-1/3 p-6 border-r border-cyan-500/20 overflow-y-auto space-y-6'>
              {/* Enhanced Prompt Input */}
              <div>
                <label className='flex items-center gap-2 mb-3'>
                  <Sparkles className='w-5 h-5 text-cyan-400' />
                  <span className='text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-lg font-bold'>
                    Neural Prompt
                  </span>
                </label>
                <div className='relative group'>
                  <textarea
                    ref={promptRef}
                    value={params.prompt}
                    onChange={e => {
                      setParams(prev => ({ ...prev, prompt: e.target.value }));
                      if (e.target.value.length > 20)
                        updateSeraphineComment('idle');
                    }}
                    placeholder={typingPlaceholder}
                    className='w-full h-36 bg-black/40 border-2 border-cyan-500/30 rounded-xl p-4 text-white text-base placeholder-cyan-400/60 resize-none focus:border-cyan-400 focus:outline-none transition-all duration-300 hover:border-cyan-400/60 focus:shadow-[0_0_20px_rgba(0,255,255,0.3)] hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] enhanced-text-glow'
                  />

                  {/* Enhanced Hologram Display */}
                  {hologramPrompt && (
                    <div className='absolute top-4 left-4 pointer-events-none'>
                      <div className='text-cyan-400/80 text-sm font-mono animate-pulse'>
                        {hologramPrompt}
                        <span className='animate-ping text-cyan-300'>|</span>
                      </div>
                    </div>
                  )}

                  {/* Pulsing glow effect on focus */}
                  <div className='absolute inset-0 rounded-xl border-2 border-transparent group-focus-within:border-gradient-to-r group-focus-within:from-cyan-400 group-focus-within:to-purple-400 group-focus-within:animate-pulse pointer-events-none'></div>
                </div>
              </div>

              {/* Enhanced Style Selector */}
              <div>
                <label className='flex items-center gap-2 mb-3'>
                  <ImageIcon className='w-5 h-5 text-purple-400' />
                  <span className='text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-lg font-bold'>
                    Art Style
                  </span>
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  {STYLE_PRESETS.filter(
                    style => userTier === 'premium' || style.tier === 'free'
                  ).map(style => (
                    <div key={style.id} className='relative'>
                      <button
                        onClick={() => {
                          if (style.available) {
                            setParams(prev => ({ ...prev, style: style.id }));
                          }
                        }}
                        onMouseEnter={() => setShowTooltip(style.id)}
                        onMouseLeave={() => setShowTooltip(null)}
                        disabled={!style.available}
                        className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-left relative group ${
                          params.style === style.id
                            ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                            : style.available
                              ? 'border-purple-500/30 bg-black/30 hover:border-purple-400/60 hover:bg-purple-500/10'
                              : 'border-gray-600/30 bg-gray-800/20 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className='flex items-center gap-2'>
                          <span className='text-xl'>{style.preview}</span>
                          <div className='flex-1'>
                            <div
                              className={`text-sm font-semibold ${style.available ? 'text-white' : 'text-gray-400'}`}
                            >
                              {style.name}
                            </div>
                            <div className='flex items-center gap-2'>
                              {style.tier === 'premium' && (
                                <div className='flex items-center gap-1'>
                                  <Crown className='w-3 h-3 text-yellow-400' />
                                  <span className='text-xs text-yellow-400 font-medium'>
                                    Premium
                                  </span>
                                </div>
                              )}
                              {!style.available && (
                                <span className='text-xs text-gray-500'>
                                  Coming Soon
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Enhanced selection indicator */}
                        {params.style === style.id && (
                          <div className='absolute inset-0 rounded-xl border-2 border-purple-400 animate-pulse pointer-events-none'></div>
                        )}
                      </button>

                      {/* Enhanced Tooltip */}
                      {showTooltip === style.id && (
                        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50'>
                          <div className='bg-black/90 border border-purple-400/50 rounded-lg p-3 text-sm text-cyan-300 whitespace-nowrap shadow-[0_0_20px_rgba(168,85,247,0.3)]'>
                            {style.description}
                            <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-purple-400/50 rotate-45'></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Aspect Ratio */}
              <div>
                <label className='flex items-center gap-2 mb-3'>
                  <Settings className='w-5 h-5 text-cyan-400' />
                  <span className='text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-lg font-bold'>
                    Aspect Ratio
                  </span>
                </label>
                <div className='grid grid-cols-2 gap-3'>
                  {ASPECT_RATIOS.map(ratio => (
                    <div key={ratio.id} className='relative'>
                      <button
                        onClick={() =>
                          setParams(prev => ({
                            ...prev,
                            aspectRatio: ratio.id,
                          }))
                        }
                        onMouseEnter={() => setShowTooltip(`ratio-${ratio.id}`)}
                        onMouseLeave={() => setShowTooltip(null)}
                        className={`w-full p-3 rounded-xl border-2 transition-all duration-300 text-center group ${
                          params.aspectRatio === ratio.id
                            ? 'border-cyan-400 bg-cyan-500/20 shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                            : 'border-cyan-500/30 bg-black/30 hover:border-cyan-400/60 hover:bg-cyan-500/10'
                        }`}
                      >
                        <div className='text-sm font-bold text-white mb-1'>
                          {ratio.name}
                        </div>
                        <div className='text-xs text-cyan-400 font-mono'>
                          {ratio.ratio}
                        </div>

                        {/* Enhanced selection indicator */}
                        {params.aspectRatio === ratio.id && (
                          <div className='absolute inset-0 rounded-xl border-2 border-cyan-400 animate-pulse pointer-events-none'></div>
                        )}
                      </button>

                      {/* Enhanced Tooltip */}
                      {showTooltip === `ratio-${ratio.id}` && (
                        <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50'>
                          <div className='bg-black/90 border border-cyan-400/50 rounded-lg p-3 text-sm text-cyan-300 whitespace-nowrap shadow-[0_0_20px_rgba(0,255,255,0.3)]'>
                            {ratio.description}
                            <div className='absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 bg-black/90 border-r border-b border-cyan-400/50 rotate-45'></div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Token Warning */}
              {userTier === 'free' && userTokens <= 20 && (
                <div className='bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 rounded-xl p-4'>
                  <div className='flex items-center gap-3'>
                    <AlertTriangle className='w-5 h-5 text-yellow-400 animate-pulse' />
                    <div>
                      <div className='text-yellow-400 font-semibold text-sm'>
                        Low Neural Energy
                      </div>
                      <div className='text-yellow-300/80 text-xs'>
                        {userTokens} tokens remaining. Consider upgrading for
                        unlimited access!
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !params.prompt.trim()}
                className='w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-400 hover:via-purple-400 hover:to-pink-400 h-16 text-lg font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 disabled:hover:scale-100'
              >
                {/* Animated background effect */}
                <div className='absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 animate-pulse'></div>

                <div className='relative z-10 flex items-center gap-3'>
                  {isGenerating ? (
                    <>
                      <div className='w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                      <span className='animate-pulse'>
                        Neural Processing...
                      </span>
                    </>
                  ) : (
                    <>
                      <Wand2 className='w-5 h-5' />
                      <span>Generate AI Image</span>
                      {userTier === 'free' && (
                        <div className='flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full'>
                          <Zap className='w-3 h-3 text-yellow-400' />
                          <span className='text-xs font-semibold'>
                            10 tokens
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </button>
            </div>

            {/* Right Panel - Generated Images */}
            <div className='flex-1 p-6 relative'>
              {/* Enhanced Seraphine Avatar Assistant */}
              <div className='absolute top-4 right-4 z-10'>
                <div className='relative group'>
                  <div
                    className={`w-20 h-20 rounded-full border-3 p-1 transition-all duration-500 cursor-pointer ${
                      seraphineState === 'generating'
                        ? 'border-purple-400 animate-pulse shadow-[0_0_20px_rgba(168,85,247,0.6)]'
                        : seraphineState === 'success'
                          ? 'border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]'
                          : seraphineState === 'depleted'
                            ? 'border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                            : 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)]'
                    }`}
                  >
                    <img
                      src='/assets/splash/SeraphineAvatar.gif'
                      alt='Seraphine AI Assistant'
                      className='w-full h-full rounded-full object-cover'
                    />
                  </div>

                  {/* Enhanced status indicator */}
                  <div
                    className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-gray-900 ${
                      seraphineState === 'generating'
                        ? 'bg-purple-400 animate-bounce'
                        : seraphineState === 'success'
                          ? 'bg-green-400 animate-ping'
                          : seraphineState === 'depleted'
                            ? 'bg-red-400 animate-pulse'
                            : 'bg-cyan-400 animate-pulse'
                    }`}
                  ></div>

                  {/* Enhanced Speech Bubble */}
                  <div className='absolute top-full right-0 mt-3 w-72 bg-black/95 border-2 border-cyan-400/50 rounded-xl p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-[0_0_25px_rgba(0,255,255,0.3)]'>
                    <div className='text-sm text-cyan-300 font-medium leading-relaxed'>
                      {seraphineComment}
                    </div>
                    <div className='absolute -top-2 right-6 w-4 h-4 bg-black/95 border-l-2 border-t-2 border-cyan-400/50 transform rotate-45'></div>

                    {/* Animated sparkles */}
                    <div className='absolute top-1 right-2'>
                      <Sparkles className='w-3 h-3 text-cyan-400 animate-pulse' />
                    </div>
                  </div>
                </div>
              </div>

              {isGenerating ? (
                <div className='h-full flex flex-col items-center justify-center'>
                  {/* Enhanced loading with shimmer cards */}
                  <div className='grid grid-cols-2 gap-4 mb-6 w-full max-w-md'>
                    {[1, 2].map(i => (
                      <div
                        key={i}
                        className='aspect-square bg-black/30 border border-cyan-500/20 rounded-xl overflow-hidden relative'
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent animate-pulse'></div>
                        <div className='absolute inset-0 shimmer-effect'></div>
                      </div>
                    ))}
                  </div>

                  <div className='w-24 h-24 rounded-full border-4 border-cyan-500/30 border-t-cyan-400 animate-spin mb-6'></div>
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
                <div className='h-full flex flex-col pr-24'>
                  <div className='flex items-center justify-between mb-6'>
                    <h3 className='text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-xl font-bold flex items-center gap-2'>
                      <Sparkles className='w-6 h-6 text-cyan-400' />
                      Generated Visions
                    </h3>
                    <div className='text-sm text-cyan-400/70'>
                      {generatedImages.length}{' '}
                      {generatedImages.length === 1 ? 'image' : 'images'}
                    </div>
                  </div>

                  {/* Enhanced Masonry Gallery */}
                  <div className='grid grid-cols-2 gap-4 flex-1 auto-rows-max'>
                    {generatedImages.map((image, index) => (
                      <div
                        key={image.id}
                        className='bg-black/30 border-2 border-cyan-500/20 rounded-xl p-3 group hover:border-cyan-400/60 transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(0,255,255,0.3)] cursor-pointer'
                        onClick={() => setSelectedImageModal(image)}
                      >
                        <div className='relative aspect-square mb-3 overflow-hidden rounded-lg'>
                          <img
                            src={image.url}
                            alt={image.prompt}
                            className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                          />

                          {/* Style and Aspect Ratio Tags */}
                          <div className='absolute top-2 left-2 flex flex-col gap-1'>
                            <span className='bg-black/80 text-cyan-400 text-xs px-2 py-1 rounded-full font-semibold border border-cyan-400/30'>
                              {STYLE_PRESETS.find(
                                s => s.id === image.params.style
                              )?.name || 'Unknown'}
                            </span>
                            <span className='bg-black/80 text-purple-400 text-xs px-2 py-1 rounded-full font-semibold border border-purple-400/30'>
                              {image.params.aspectRatio}
                            </span>
                          </div>

                          {/* Enhanced Quick Actions */}
                          <div className='absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300'>
                            <div className='absolute bottom-2 left-2 right-2 flex gap-1'>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleDownloadImage(image);
                                }}
                                className='flex-1 bg-cyan-500/90 hover:bg-cyan-400 text-white px-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105'
                                aria-label='Download image'
                              >
                                <Download className='w-3 h-3' />
                                Download
                              </button>

                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  updateSeraphineComment('success');
                                  // Save to library logic
                                }}
                                className='flex-1 bg-purple-500/90 hover:bg-purple-400 text-white px-2 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 flex items-center justify-center gap-1 hover:scale-105'
                                aria-label='Save to library'
                              >
                                <Heart className='w-3 h-3' />
                                Save
                              </button>
                            </div>

                            <div className='absolute top-2 right-2 flex gap-1'>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  setSelectedImageModal(image);
                                }}
                                className='bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110'
                                aria-label='View full size'
                              >
                                <Eye className='w-3 h-3' />
                              </button>
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  handleRemixPrompt(image);
                                }}
                                className='bg-black/70 hover:bg-black/90 text-white p-2 rounded-lg transition-all duration-300 hover:scale-110'
                                aria-label='Remix prompt'
                              >
                                <Shuffle className='w-3 h-3' />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Image Info */}
                        <div className='space-y-2'>
                          <p className='text-xs text-cyan-400/80 line-clamp-2 leading-relaxed font-medium'>
                            {image.prompt}
                          </p>
                          <div className='flex items-center justify-between text-xs text-gray-400'>
                            <span>
                              {new Date(image.timestamp).toLocaleTimeString()}
                            </span>
                            <div className='flex items-center gap-1'>
                              <Zap className='w-3 h-3 text-yellow-400' />
                              <span>10 tokens</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className='h-full flex items-center justify-center pr-20'>
                  <div className='text-center'>
                    <div className='w-24 h-24 rounded-full border-2 border-cyan-500/30 border-dashed flex items-center justify-center mb-6 mx-auto'>
                      <ImageIcon className='w-12 h-12 text-cyan-400/30' />
                    </div>
                    <h3 className='text-lg font-bold text-cyan-400/50 mb-2'>
                      Neural Canvas Awaits
                    </h3>
                    <p className='text-cyan-400/40 max-w-xs'>
                      Enter a prompt and choose your style to begin creation
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

      {/* Enhanced Credit Limit Modal */}
      {showLimitModal && (
        <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4'>
          <div className='bg-black/95 border-2 border-red-500/60 rounded-2xl p-8 max-w-lg w-full shadow-[0_0_40px_rgba(239,68,68,0.4)] animate-in fade-in duration-300'>
            <div className='text-center'>
              {/* Enhanced Warning Icon */}
              <div className='relative w-20 h-20 mx-auto mb-6'>
                <div className='w-full h-full rounded-full border-3 border-red-500/60 flex items-center justify-center bg-red-500/20 animate-pulse'>
                  <AlertTriangle className='w-10 h-10 text-red-400' />
                </div>
                <div className='absolute inset-0 rounded-full border-3 border-red-400 animate-ping opacity-30'></div>
              </div>

              <h3 className='text-transparent bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-2xl font-bold mb-4'>
                You've reached your daily limit 💔
              </h3>

              <p className='text-gray-300 mb-8 leading-relaxed text-base'>
                Upgrade to{' '}
                <span className='text-purple-400 font-semibold'>Premium</span>{' '}
                to unlock unlimited AI generations, or earn more tokens through
                our reward system!
              </p>

              <div className='flex flex-col gap-4'>
                <button
                  onClick={() => {
                    setShowLimitModal(false);
                    onClose();
                    // Navigate to premium upgrade
                  }}
                  className='w-full relative overflow-hidden bg-gradient-to-r from-purple-500 via-pink-500 to-purple-600 hover:from-purple-400 hover:via-pink-400 hover:to-purple-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:scale-105 group'
                >
                  <div className='relative z-10 flex items-center justify-center gap-2'>
                    <Crown className='w-5 h-5' />
                    Upgrade to Premium
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-purple-700/20 group-hover:opacity-0 transition-opacity duration-300'></div>
                </button>

                <button
                  onClick={() => {
                    setShowLimitModal(false);
                    onClose();
                    // Navigate to earn tokens
                  }}
                  className='w-full relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 hover:from-cyan-400 hover:via-blue-400 hover:to-cyan-500 text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] hover:scale-105 group'
                >
                  <div className='relative z-10 flex items-center justify-center gap-2'>
                    <Gift className='w-5 h-5' />
                    Earn More Tokens
                  </div>
                  <div className='absolute inset-0 bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-cyan-700/20 group-hover:opacity-0 transition-opacity duration-300'></div>
                </button>

                <button
                  onClick={() => setShowLimitModal(false)}
                  className='w-full border-2 border-gray-500/50 hover:border-gray-400/70 text-gray-300 hover:text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 hover:bg-gray-800/30'
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Image View Modal */}
      {selectedImageModal && (
        <div className='fixed inset-0 bg-black/95 backdrop-blur-sm z-[70] flex items-center justify-center p-4'>
          <div className='bg-black/90 border-2 border-cyan-500/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-[0_0_40px_rgba(0,255,255,0.3)]'>
            <div className='flex items-center justify-between mb-6'>
              <h3 className='text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-xl font-bold'>
                Generated Vision
              </h3>
              <button
                onClick={() => setSelectedImageModal(null)}
                className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
                aria-label='Close modal'
              >
                <X className='w-5 h-5 text-red-400' />
              </button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              {/* Image Display */}
              <div className='relative'>
                <img
                  src={selectedImageModal.url}
                  alt={selectedImageModal.prompt}
                  className='w-full rounded-xl border border-cyan-500/30'
                />

                {/* Image Tags */}
                <div className='absolute top-3 left-3 flex flex-col gap-2'>
                  <span className='bg-black/80 text-cyan-400 text-sm px-3 py-1 rounded-full font-semibold border border-cyan-400/50'>
                    {STYLE_PRESETS.find(
                      s => s.id === selectedImageModal.params.style
                    )?.name || 'Unknown'}
                  </span>
                  <span className='bg-black/80 text-purple-400 text-sm px-3 py-1 rounded-full font-semibold border border-purple-400/50'>
                    {selectedImageModal.params.aspectRatio}
                  </span>
                </div>
              </div>

              {/* Image Details */}
              <div className='space-y-6'>
                <div>
                  <h4 className='text-cyan-400 font-semibold mb-2'>
                    Original Prompt
                  </h4>
                  <p className='text-gray-300 leading-relaxed bg-black/30 p-4 rounded-lg border border-cyan-500/20'>
                    {selectedImageModal.prompt}
                  </p>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <h4 className='text-purple-400 font-semibold mb-2'>
                      Generation Time
                    </h4>
                    <p className='text-gray-300'>
                      {new Date(selectedImageModal.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <h4 className='text-pink-400 font-semibold mb-2'>
                      Token Cost
                    </h4>
                    <p className='text-gray-300 flex items-center gap-1'>
                      <Zap className='w-4 h-4 text-yellow-400' />
                      10 tokens
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex flex-col gap-3'>
                  <button
                    onClick={() => handleDownloadImage(selectedImageModal)}
                    className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105'
                  >
                    <Download className='w-5 h-5' />
                    Download High Quality
                  </button>

                  <button
                    onClick={() => {
                      updateSeraphineComment('success');
                      // Save to library logic
                    }}
                    className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:scale-105'
                  >
                    <Heart className='w-5 h-5' />
                    Save to Library
                  </button>

                  <button
                    onClick={() => {
                      handleRemixPrompt(selectedImageModal);
                      setSelectedImageModal(null);
                    }}
                    className='w-full border-2 border-cyan-500/50 hover:border-cyan-400/70 text-cyan-400 hover:text-cyan-300 py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 hover:bg-cyan-500/10'
                  >
                    <Shuffle className='w-5 h-5' />
                    Re-generate Based on Prompt
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
