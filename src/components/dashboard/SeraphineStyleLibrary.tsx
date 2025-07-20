'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Star,
  Download,
  Eye,
  Upload,
  Sparkles,
  Zap,
  Crown,
  Lock,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface SeraphineStyleLibraryProps {
  isVisible: boolean;
  onClose: () => void;
  userTier: 'free' | 'premium';
  onSelectStyle: (style: AIModel) => void;
}

interface AIModel {
  id: string;
  name: string;
  preview: string;
  description: string;
  style: string;
  isPremium: boolean;
  isCustom?: boolean;
  author: string;
  downloads: number;
  rating: number;
  tags: string[];
  samples: string[];
}

const AI_MODELS: AIModel[] = [
  {
    id: 'seraphine-realistic',
    name: 'Seraphine Photorealistic',
    preview: 'https://picsum.photos/300/400?random=1',
    description: 'Ultra-realistic human portraits with cyberpunk aesthetics',
    style: 'photorealistic',
    isPremium: false,
    author: 'Seraphine AI',
    downloads: 15420,
    rating: 4.9,
    tags: ['realistic', 'portrait', 'human', 'cyberpunk'],
    samples: [
      'https://picsum.photos/300/400?random=1',
      'https://picsum.photos/300/400?random=2',
    ],
  },
  {
    id: 'neural-anime',
    name: 'Neural Anime Genesis',
    preview: 'https://picsum.photos/300/400?random=3',
    description: 'High-quality anime character generation',
    style: 'anime',
    isPremium: false,
    author: 'Seraphine AI',
    downloads: 23100,
    rating: 4.8,
    tags: ['anime', 'character', 'manga', 'stylized'],
    samples: [
      'https://picsum.photos/300/400?random=3',
      'https://picsum.photos/300/400?random=4',
    ],
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Neon Dreams',
    preview: 'https://picsum.photos/300/400?random=5',
    description: 'Futuristic cityscapes and neon-lit environments',
    style: 'cyberpunk',
    isPremium: true,
    author: 'Neural Labs',
    downloads: 8900,
    rating: 4.7,
    tags: ['cyberpunk', 'neon', 'city', 'futuristic'],
    samples: [
      'https://picsum.photos/300/400?random=5',
      'https://picsum.photos/300/400?random=6',
    ],
  },
  {
    id: 'fantasy-realm',
    name: 'Fantasy Realm Master',
    preview: 'https://picsum.photos/300/400?random=7',
    description: 'Magical creatures and fantasy landscapes',
    style: 'fantasy',
    isPremium: true,
    author: 'Dream Forge',
    downloads: 12300,
    rating: 4.6,
    tags: ['fantasy', 'magic', 'creatures', 'landscape'],
    samples: [
      'https://picsum.photos/300/400?random=7',
      'https://picsum.photos/300/400?random=8',
    ],
  },
  {
    id: 'game-asset-pro',
    name: 'Game Asset Pro',
    preview: 'https://picsum.photos/300/400?random=9',
    description: 'Professional game asset generation',
    style: 'game-asset',
    isPremium: true,
    author: 'GameDev AI',
    downloads: 5600,
    rating: 4.5,
    tags: ['game', 'asset', 'texture', 'object'],
    samples: [
      'https://picsum.photos/300/400?random=9',
      'https://picsum.photos/300/400?random=10',
    ],
  },
];

const STYLE_CATEGORIES = [
  { id: 'all', name: 'All Styles', icon: Sparkles },
  { id: 'photorealistic', name: 'Photorealistic', icon: Eye },
  { id: 'anime', name: 'Anime', icon: Star },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: Zap },
  { id: 'fantasy', name: 'Fantasy', icon: Sparkles },
  { id: 'game-asset', name: 'Game Assets', icon: Download },
];

export default function SeraphineStyleLibrary({
  isVisible,
  onClose,
  userTier,
  onSelectStyle,
}: SeraphineStyleLibraryProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedModel, setSelectedModel] = useState<AIModel | null>(null);
  const [currentSampleIndex, setCurrentSampleIndex] = useState(0);
  const [glitchEffect, setGlitchEffect] = useState(false);

  // Filter models based on category and search
  const filteredModels = AI_MODELS.filter(model => {
    const matchesCategory =
      selectedCategory === 'all' || model.style === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    return matchesCategory && matchesSearch;
  });

  // Glitch effect on category change
  useEffect(() => {
    setGlitchEffect(true);
    const timer = setTimeout(() => setGlitchEffect(false), 300);
    return () => clearTimeout(timer);
  }, [selectedCategory]);

  const handleModelSelect = (model: AIModel) => {
    if (model.isPremium && userTier === 'free') {
      // Show premium required popup
      alert('Premium subscription required for this model');
      return;
    }
    setSelectedModel(model);
    setCurrentSampleIndex(0);
  };

  const handleConfirmSelection = () => {
    if (selectedModel) {
      onSelectStyle(selectedModel);
      onClose();
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='seraphine-holo-panel w-full max-w-7xl h-[90vh] flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-cyan-500/20'>
          <div className='flex items-center gap-4'>
            <div className='seraphine-plasma-orb w-12 h-12'></div>
            <div>
              <h2 className='text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent'>
                Seraphine Style Library
              </h2>
              <p className='text-sm text-cyan-400/70'>
                Neural Style Networks & AI Models
              </p>
            </div>
          </div>

          <div className='flex items-center gap-4'>
            {userTier === 'premium' && (
              <button className='seraphine-neural-btn secondary flex items-center gap-2'>
                <Upload className='w-4 h-4' />
                Upload Custom Model
              </button>
            )}

            <button
              onClick={onClose}
              className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
              aria-label='Close Style Library'
              title='Close'
            >
              <X className='w-5 h-5 text-red-400' />
            </button>
          </div>
        </div>

        <div className='flex-1 flex overflow-hidden'>
          {/* Left Sidebar - Categories */}
          <div className='w-64 p-6 border-r border-cyan-500/20 overflow-y-auto'>
            <div className='mb-6'>
              <label className='block text-cyan-400 font-semibold mb-3'>
                Search Models
              </label>
              <div className='relative'>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search by name or tag...'
                  className='w-full bg-black/30 border border-cyan-500/30 rounded-lg p-3 pl-10 text-white placeholder-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-colors'
                />
                <Search className='absolute left-3 top-3.5 w-4 h-4 text-cyan-400/50' />
              </div>
            </div>

            <div>
              <label className='block text-cyan-400 font-semibold mb-3'>
                Categories
              </label>
              <div className='space-y-2'>
                {STYLE_CATEGORIES.map(category => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full p-3 rounded-lg border text-left transition-all flex items-center gap-3 ${
                        selectedCategory === category.id
                          ? 'border-cyan-400 bg-cyan-400/10 text-cyan-400'
                          : 'border-cyan-500/30 bg-black/20 text-cyan-400/70 hover:border-cyan-400/50'
                      }`}
                    >
                      <IconComponent className='w-4 h-4' />
                      <span className='text-sm font-medium'>
                        {category.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content - Models Grid */}
          <div className='flex-1 p-6 overflow-y-auto'>
            {selectedModel ? (
              // Model Detail View
              <div className='h-full flex flex-col'>
                <div className='flex items-center justify-between mb-6'>
                  <button
                    onClick={() => setSelectedModel(null)}
                    className='flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors'
                  >
                    <ChevronLeft className='w-4 h-4' />
                    Back to Library
                  </button>

                  <button
                    onClick={handleConfirmSelection}
                    className='seraphine-neural-btn flex items-center gap-2'
                  >
                    <Sparkles className='w-4 h-4' />
                    Use This Style
                  </button>
                </div>

                <div className='flex gap-8 flex-1'>
                  {/* Model Preview */}
                  <div className='w-1/2'>
                    <div className='relative aspect-[3/4] mb-4 overflow-hidden rounded-lg'>
                      <img
                        src={selectedModel.samples[currentSampleIndex]}
                        alt={`${selectedModel.name} sample`}
                        className='w-full h-full object-cover'
                      />

                      {/* Sample Navigation */}
                      {selectedModel.samples.length > 1 && (
                        <div className='absolute inset-x-0 bottom-4 flex justify-center gap-2'>
                          {selectedModel.samples.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSampleIndex(index)}
                              className={`w-2 h-2 rounded-full transition-colors ${
                                index === currentSampleIndex
                                  ? 'bg-cyan-400'
                                  : 'bg-white/30'
                              }`}
                              aria-label={`View sample ${index + 1}`}
                              title={`Sample ${index + 1}`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Model Info */}
                  <div className='w-1/2'>
                    <div className='flex items-start justify-between mb-4'>
                      <div>
                        <h3 className='text-2xl font-bold text-cyan-400 mb-2'>
                          {selectedModel.name}
                        </h3>
                        <p className='text-cyan-400/70 mb-4'>
                          {selectedModel.description}
                        </p>
                      </div>

                      {selectedModel.isPremium && (
                        <div className='flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-black text-xs font-bold'>
                          <Crown className='w-3 h-3' />
                          PREMIUM
                        </div>
                      )}
                    </div>

                    <div className='grid grid-cols-2 gap-4 mb-6'>
                      <div className='bg-black/20 rounded-lg p-4'>
                        <div className='text-cyan-400/70 text-sm mb-1'>
                          Author
                        </div>
                        <div className='text-cyan-400 font-semibold'>
                          {selectedModel.author}
                        </div>
                      </div>

                      <div className='bg-black/20 rounded-lg p-4'>
                        <div className='text-cyan-400/70 text-sm mb-1'>
                          Downloads
                        </div>
                        <div className='text-cyan-400 font-semibold'>
                          {selectedModel.downloads.toLocaleString()}
                        </div>
                      </div>

                      <div className='bg-black/20 rounded-lg p-4'>
                        <div className='text-cyan-400/70 text-sm mb-1'>
                          Rating
                        </div>
                        <div className='flex items-center gap-2'>
                          <div className='text-cyan-400 font-semibold'>
                            {selectedModel.rating}
                          </div>
                          <div className='flex'>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(selectedModel.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className='bg-black/20 rounded-lg p-4'>
                        <div className='text-cyan-400/70 text-sm mb-1'>
                          Style
                        </div>
                        <div className='text-cyan-400 font-semibold capitalize'>
                          {selectedModel.style}
                        </div>
                      </div>
                    </div>

                    <div className='mb-6'>
                      <div className='text-cyan-400/70 text-sm mb-2'>Tags</div>
                      <div className='flex flex-wrap gap-2'>
                        {selectedModel.tags.map(tag => (
                          <span
                            key={tag}
                            className='px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 text-xs'
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Models Grid View
              <div>
                <div className='flex items-center justify-between mb-6'>
                  <h3 className='text-lg font-bold text-cyan-400'>
                    {selectedCategory === 'all'
                      ? 'All Models'
                      : STYLE_CATEGORIES.find(c => c.id === selectedCategory)
                          ?.name}
                    <span className='text-cyan-400/50 text-sm ml-2'>
                      ({filteredModels.length} models)
                    </span>
                  </h3>
                </div>

                <div
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${glitchEffect ? 'seraphine-glitch' : ''}`}
                >
                  {filteredModels.map(model => (
                    <div
                      key={model.id}
                      className='seraphine-holo-panel p-4 group hover:scale-105 transition-transform cursor-pointer'
                      onClick={() => handleModelSelect(model)}
                    >
                      <div className='relative aspect-[3/4] mb-4 overflow-hidden rounded-lg'>
                        <img
                          src={model.preview}
                          alt={model.name}
                          className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-300'
                        />

                        {/* Premium Overlay */}
                        {model.isPremium && userTier === 'free' && (
                          <div className='absolute inset-0 bg-black/70 flex items-center justify-center'>
                            <div className='text-center'>
                              <Lock className='w-8 h-8 text-cyan-400 mx-auto mb-2' />
                              <div className='text-cyan-400 font-semibold text-sm'>
                                Premium Only
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Premium Badge */}
                        {model.isPremium && (
                          <div className='absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full text-black text-xs font-bold'>
                            <Crown className='w-3 h-3' />
                            PRO
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
                          <div className='text-center'>
                            <Eye className='w-6 h-6 text-white mx-auto mb-2' />
                            <div className='text-white font-semibold text-sm'>
                              View Details
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className='text-cyan-400 font-semibold mb-1 truncate'>
                          {model.name}
                        </h4>
                        <p className='text-cyan-400/60 text-xs mb-2 line-clamp-2'>
                          {model.description}
                        </p>

                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-1'>
                            <Star className='w-3 h-3 text-yellow-400 fill-current' />
                            <span className='text-cyan-400/70 text-xs'>
                              {model.rating}
                            </span>
                          </div>

                          <div className='flex items-center gap-1'>
                            <Download className='w-3 h-3 text-cyan-400/70' />
                            <span className='text-cyan-400/70 text-xs'>
                              {model.downloads > 1000
                                ? `${Math.floor(model.downloads / 1000)}k`
                                : model.downloads}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredModels.length === 0 && (
                  <div className='h-64 flex items-center justify-center'>
                    <div className='text-center'>
                      <Filter className='w-16 h-16 text-cyan-400/30 mx-auto mb-4' />
                      <h3 className='text-lg font-bold text-cyan-400/50 mb-2'>
                        No Models Found
                      </h3>
                      <p className='text-cyan-400/40'>
                        Try adjusting your search or category filter
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
