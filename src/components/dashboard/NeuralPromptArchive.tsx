'use client';

import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Save,
  Play,
  Edit3,
  Copy,
  Trash2,
  Search,
  Filter,
  Clock,
  Star,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface NeuralPromptArchiveProps {
  isVisible: boolean;
  onClose: () => void;
  onRunPrompt: (prompt: PromptEntry) => void;
}

interface PromptEntry {
  id: string;
  prompt: string;
  negativePrompt?: string;
  style: string;
  parameters: {
    aspectRatio: string;
    guidanceScale: number;
    steps: number;
    seed: number;
  };
  timestamp: Date;
  isFavorite: boolean;
  tags: string[];
  resultImageUrl?: string;
  notes?: string;
}

const MOCK_PROMPTS: PromptEntry[] = [
  {
    id: 'prompt_1',
    prompt:
      'A cyberpunk warrior with neon-lit armor standing in a futuristic city, digital art, highly detailed, glowing circuits',
    negativePrompt: 'blurry, low quality, bad anatomy',
    style: 'cyberpunk',
    parameters: {
      aspectRatio: '16:9',
      guidanceScale: 7.5,
      steps: 20,
      seed: 123456,
    },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isFavorite: true,
    tags: ['cyberpunk', 'warrior', 'city', 'armor'],
    resultImageUrl: 'https://picsum.photos/400/300?random=1',
    notes: 'Great results with high detail',
  },
  {
    id: 'prompt_2',
    prompt:
      'Beautiful anime girl with long purple hair, magical aura, fantasy background, studio lighting',
    style: 'anime',
    parameters: {
      aspectRatio: '9:16',
      guidanceScale: 8.0,
      steps: 25,
      seed: 789012,
    },
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    isFavorite: false,
    tags: ['anime', 'girl', 'purple hair', 'fantasy'],
    resultImageUrl: 'https://picsum.photos/300/400?random=2',
  },
  {
    id: 'prompt_3',
    prompt:
      'Photorealistic portrait of a person with cybernetic implants, dramatic lighting, professional photography',
    negativePrompt: 'cartoon, anime, painting',
    style: 'photorealistic',
    parameters: {
      aspectRatio: '3:4',
      guidanceScale: 6.5,
      steps: 30,
      seed: 345678,
    },
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    isFavorite: true,
    tags: ['photorealistic', 'portrait', 'cybernetic', 'dramatic'],
    resultImageUrl: 'https://picsum.photos/300/400?random=3',
    notes: 'Perfect lighting settings',
  },
];

export default function NeuralPromptArchive({
  isVisible,
  onClose,
  onRunPrompt,
}: NeuralPromptArchiveProps) {
  const [prompts, setPrompts] = useState<PromptEntry[]>(MOCK_PROMPTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);
  const [terminalEffect, setTerminalEffect] = useState(true);

  // Terminal typing effect
  useEffect(() => {
    if (isVisible) {
      setTerminalEffect(true);
      const timer = setTimeout(() => setTerminalEffect(false), 1000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isVisible]);

  // Filter prompts
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch =
      searchQuery === '' ||
      prompt.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.tags.some(tag =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'favorites' && prompt.isFavorite) ||
      prompt.style === selectedFilter;

    return matchesSearch && matchesFilter;
  });

  const handleToggleFavorite = (id: string) => {
    setPrompts(prev =>
      prev.map(prompt =>
        prompt.id === id
          ? { ...prompt, isFavorite: !prompt.isFavorite }
          : prompt
      )
    );
  };

  const handleDeletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(prompt => prompt.id !== id));
  };

  const handleCopyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      // Show success feedback
    } catch (error) {
      console.error('Failed to copy prompt:', error);
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='seraphine-holo-panel w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden'>
        {/* Header */}
        <div className='flex items-center justify-between p-6 border-b border-cyan-500/20'>
          <div className='flex items-center gap-4'>
            <div className='relative'>
              <Terminal className='w-12 h-12 text-cyan-400' />
              {terminalEffect && (
                <div className='absolute inset-0 animate-pulse'>
                  <Terminal className='w-12 h-12 text-cyan-400' />
                </div>
              )}
            </div>
            <div>
              <h2 className='text-2xl font-bold bg-gradient-to-r from-cyan-400 to-magenta-400 bg-clip-text text-transparent'>
                Neural Prompt Archive
              </h2>
              <p className='text-sm text-cyan-400/70 font-mono'>
                {terminalEffect ? (
                  <>Initializing archive_system.exe...</>
                ) : (
                  <>Command history and prompt database</>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
            aria-label='Close Neural Prompt Archive'
            title='Close'
          >
            <X className='w-5 h-5 text-red-400' />
          </button>
        </div>

        {/* Controls */}
        <div className='p-6 border-b border-cyan-500/20 bg-black/20'>
          <div className='flex items-center gap-4 mb-4'>
            <div className='flex-1 relative'>
              <input
                type='text'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder='search_prompts --query'
                className='w-full bg-black/30 border border-cyan-500/30 rounded-lg p-3 pl-10 text-white placeholder-cyan-400/50 font-mono focus:border-cyan-400 focus:outline-none transition-colors'
              />
              <Search className='absolute left-3 top-3.5 w-4 h-4 text-cyan-400/50' />
            </div>

            <select
              value={selectedFilter}
              onChange={e => setSelectedFilter(e.target.value)}
              className='bg-black/30 border border-cyan-500/30 rounded-lg p-3 text-cyan-400 font-mono focus:border-cyan-400 focus:outline-none'
              aria-label='Filter prompts by category'
              title='Filter prompts by category'
            >
              <option value='all'>--filter all</option>
              <option value='favorites'>--filter favorites</option>
              <option value='photorealistic'>--filter realistic</option>
              <option value='anime'>--filter anime</option>
              <option value='cyberpunk'>--filter cyberpunk</option>
              <option value='fantasy'>--filter fantasy</option>
            </select>
          </div>

          <div className='text-cyan-400/70 font-mono text-sm'>
            {'>'} Found {filteredPrompts.length} entries in neural_archive.db
          </div>
        </div>

        {/* Prompt List */}
        <div className='flex-1 overflow-y-auto'>
          {filteredPrompts.length > 0 ? (
            <div className='space-y-1'>
              {filteredPrompts.map((prompt, index) => (
                <div
                  key={prompt.id}
                  className='border-b border-cyan-500/10 hover:bg-cyan-500/5 transition-colors'
                >
                  <div
                    className='p-4 cursor-pointer'
                    onClick={() =>
                      setExpandedPrompt(
                        expandedPrompt === prompt.id ? null : prompt.id
                      )
                    }
                  >
                    <div className='flex items-start gap-4'>
                      {/* Terminal Line Number */}
                      <div className='text-cyan-400/50 font-mono text-sm mt-1 w-8'>
                        {String(index + 1).padStart(2, '0')}
                      </div>

                      {/* Result Image Thumbnail */}
                      {prompt.resultImageUrl && (
                        <div className='w-16 h-16 rounded-lg overflow-hidden border border-cyan-500/30 flex-shrink-0'>
                          <img
                            src={prompt.resultImageUrl}
                            alt='Generated result'
                            className='w-full h-full object-cover'
                          />
                        </div>
                      )}

                      {/* Prompt Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between mb-2'>
                          <p className='text-cyan-400 font-mono text-sm leading-relaxed'>
                            {'>'} {prompt.prompt.substring(0, 80)}
                            {prompt.prompt.length > 80 && '...'}
                          </p>

                          <div className='flex items-center gap-2 ml-4'>
                            {expandedPrompt === prompt.id ? (
                              <ChevronUp className='w-4 h-4 text-cyan-400/70' />
                            ) : (
                              <ChevronDown className='w-4 h-4 text-cyan-400/70' />
                            )}
                          </div>
                        </div>

                        <div className='flex items-center gap-4 text-xs'>
                          <div className='flex items-center gap-1 text-cyan-400/60'>
                            <Clock className='w-3 h-3' />
                            {formatTimeAgo(prompt.timestamp)}
                          </div>

                          <div className='px-2 py-1 bg-cyan-400/10 rounded text-cyan-400 font-mono'>
                            {prompt.style}
                          </div>

                          <div className='text-cyan-400/60'>
                            {prompt.parameters.aspectRatio} •{' '}
                            {prompt.parameters.steps} steps
                          </div>

                          {prompt.isFavorite && (
                            <Star className='w-3 h-3 text-yellow-400 fill-current' />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedPrompt === prompt.id && (
                    <div className='px-4 pb-4 bg-black/20 border-t border-cyan-500/10'>
                      <div className='mt-4 space-y-4'>
                        {/* Full Prompt */}
                        <div>
                          <div className='text-cyan-400/70 text-xs font-mono mb-2'>
                            PROMPT_FULL:
                          </div>
                          <div className='bg-black/30 rounded p-3 font-mono text-sm text-cyan-400'>
                            {prompt.prompt}
                          </div>
                        </div>

                        {/* Negative Prompt */}
                        {prompt.negativePrompt && (
                          <div>
                            <div className='text-cyan-400/70 text-xs font-mono mb-2'>
                              NEGATIVE_PROMPT:
                            </div>
                            <div className='bg-black/30 rounded p-3 font-mono text-sm text-cyan-400/80'>
                              {prompt.negativePrompt}
                            </div>
                          </div>
                        )}

                        {/* Parameters */}
                        <div>
                          <div className='text-cyan-400/70 text-xs font-mono mb-2'>
                            PARAMETERS:
                          </div>
                          <div className='grid grid-cols-4 gap-4 text-sm'>
                            <div className='bg-black/30 rounded p-2'>
                              <div className='text-cyan-400/60 text-xs'>
                                ASPECT_RATIO
                              </div>
                              <div className='text-cyan-400 font-mono'>
                                {prompt.parameters.aspectRatio}
                              </div>
                            </div>
                            <div className='bg-black/30 rounded p-2'>
                              <div className='text-cyan-400/60 text-xs'>
                                GUIDANCE
                              </div>
                              <div className='text-cyan-400 font-mono'>
                                {prompt.parameters.guidanceScale}
                              </div>
                            </div>
                            <div className='bg-black/30 rounded p-2'>
                              <div className='text-cyan-400/60 text-xs'>
                                STEPS
                              </div>
                              <div className='text-cyan-400 font-mono'>
                                {prompt.parameters.steps}
                              </div>
                            </div>
                            <div className='bg-black/30 rounded p-2'>
                              <div className='text-cyan-400/60 text-xs'>
                                SEED
                              </div>
                              <div className='text-cyan-400 font-mono'>
                                {prompt.parameters.seed}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Tags */}
                        {prompt.tags.length > 0 && (
                          <div>
                            <div className='text-cyan-400/70 text-xs font-mono mb-2'>
                              TAGS:
                            </div>
                            <div className='flex flex-wrap gap-2'>
                              {prompt.tags.map(tag => (
                                <span
                                  key={tag}
                                  className='px-2 py-1 bg-cyan-400/10 border border-cyan-400/30 rounded text-cyan-400 text-xs font-mono'
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Notes */}
                        {prompt.notes && (
                          <div>
                            <div className='text-cyan-400/70 text-xs font-mono mb-2'>
                              NOTES:
                            </div>
                            <div className='bg-black/30 rounded p-3 font-mono text-sm text-cyan-400/80'>
                              {prompt.notes}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className='flex items-center gap-2 pt-2 border-t border-cyan-500/20'>
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              onRunPrompt(prompt);
                            }}
                            className='seraphine-neural-btn ghost flex items-center gap-2 text-xs px-3 py-2'
                          >
                            <Play className='w-3 h-3' />
                            RUN_AGAIN
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleCopyPrompt(prompt.prompt);
                            }}
                            className='seraphine-neural-btn ghost flex items-center gap-2 text-xs px-3 py-2'
                          >
                            <Copy className='w-3 h-3' />
                            COPY
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleToggleFavorite(prompt.id);
                            }}
                            className={`seraphine-neural-btn ghost flex items-center gap-2 text-xs px-3 py-2 ${
                              prompt.isFavorite ? 'text-yellow-400' : ''
                            }`}
                          >
                            <Star
                              className={`w-3 h-3 ${prompt.isFavorite ? 'fill-current' : ''}`}
                            />
                            {prompt.isFavorite ? 'UNFAV' : 'FAVORITE'}
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            className='seraphine-neural-btn ghost flex items-center gap-2 text-xs px-3 py-2'
                          >
                            <Edit3 className='w-3 h-3' />
                            EDIT
                          </button>

                          <button
                            onClick={e => {
                              e.stopPropagation();
                              handleDeletePrompt(prompt.id);
                            }}
                            className='seraphine-neural-btn ghost flex items-center gap-2 text-xs px-3 py-2 text-red-400 hover:text-red-300'
                          >
                            <Trash2 className='w-3 h-3' />
                            DELETE
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className='h-full flex items-center justify-center'>
              <div className='text-center'>
                <Terminal className='w-16 h-16 text-cyan-400/30 mx-auto mb-4' />
                <h3 className='text-lg font-bold text-cyan-400/50 mb-2 font-mono'>
                  archive_empty.status
                </h3>
                <p className='text-cyan-400/40 font-mono text-sm'>
                  No prompts found in neural archive
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
