'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Download,
  Heart,
  RotateCcw,
  Share2,
  Trash2,
  ZoomIn,
  Copy,
  Star,
  Eye,
  Clock,
  Tag,
  Filter,
  Grid3X3,
  List,
  Search,
  MoreHorizontal,
  Crown,
  Sparkles,
} from 'lucide-react';

interface GeneratedItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail: string;
  prompt: string;
  settings: {
    model: string;
    style: string;
    resolution: string;
    steps: number;
  };
  timestamp: Date;
  tokenCost: number;
  isFavorite: boolean;
  isPrivate: boolean;
  tags: string[];
  hasWatermark: boolean;
}

interface GalleryOutputProps {
  items: GeneratedItem[];
  isLoading: boolean;
  onRegenerateImage: (id: string) => void;
  onDownload: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onShare: (id: string) => void;
  userTier: 'free' | 'premium';
  onUpgradeClick: () => void;
}

type ViewMode = 'grid' | 'list';
type SortBy = 'newest' | 'oldest' | 'favorites' | 'cost';
type FilterBy = 'all' | 'images' | 'videos' | 'favorites';

const GalleryOutput: React.FC<GalleryOutputProps> = ({
  items,
  isLoading,
  onRegenerateImage,
  onDownload,
  onToggleFavorite,
  onDelete,
  onShare,
  userTier,
  onUpgradeClick,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('newest');
  const [filterBy, setFilterBy] = useState<FilterBy>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<GeneratedItem | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  // Filter and sort items
  const filteredAndSortedItems = React.useMemo(() => {
    let filtered = items;

    // Apply filters
    if (filterBy === 'images') {
      filtered = filtered.filter(item => item.type === 'image');
    } else if (filterBy === 'videos') {
      filtered = filtered.filter(item => item.type === 'video');
    } else if (filterBy === 'favorites') {
      filtered = filtered.filter(item => item.isFavorite);
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.timestamp.getTime() - a.timestamp.getTime();
        case 'oldest':
          return a.timestamp.getTime() - b.timestamp.getTime();
        case 'favorites':
          return (b.isFavorite ? 1 : 0) - (a.isFavorite ? 1 : 0);
        case 'cost':
          return b.tokenCost - a.tokenCost;
        default:
          return 0;
      }
    });

    return filtered;
  }, [items, filterBy, sortBy, searchQuery]);

  const handleItemAction = (action: string, item: GeneratedItem) => {
    switch (action) {
      case 'favorite':
        onToggleFavorite(item.id);
        break;
      case 'download':
        if (item.hasWatermark && userTier === 'free') {
          onUpgradeClick();
        } else {
          onDownload(item.id);
        }
        break;
      case 'regenerate':
        onRegenerateImage(item.id);
        break;
      case 'share':
        onShare(item.id);
        break;
      case 'delete':
        onDelete(item.id);
        break;
      case 'preview':
        setSelectedItem(item);
        setShowPreview(true);
        break;
    }
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className='space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <div className='flex items-center gap-2'>
          <Sparkles className='w-5 h-5 text-cyan-400' />
          <h3 className='text-lg font-semibold text-white'>Gallery</h3>
          <span className='px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm'>
            {filteredAndSortedItems.length}
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className='flex items-center gap-2'>
          <motion.button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'grid'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label='Grid view'
          >
            <Grid3X3 className='w-4 h-4' />
          </motion.button>
          <motion.button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-cyan-500/20 text-cyan-400'
                : 'text-gray-400 hover:text-white'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label='List view'
          >
            <List className='w-4 h-4' />
          </motion.button>
        </div>
      </div>

      {/* Controls */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        {/* Search */}
        <div className='relative'>
          <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
          <input
            type='text'
            placeholder='Search prompts and tags...'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full pl-10 pr-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-cyan-500 focus:outline-none transition-colors'
          />
        </div>

        {/* Filter */}
        <select
          value={filterBy}
          onChange={e => setFilterBy(e.target.value as FilterBy)}
          className='px-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors'
          aria-label='Filter items'
        >
          <option value='all'>All Items</option>
          <option value='images'>Images Only</option>
          <option value='videos'>Videos Only</option>
          <option value='favorites'>Favorites</option>
        </select>

        {/* Sort */}
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value as SortBy)}
          className='px-4 py-2 bg-black/40 border border-gray-600 rounded-lg text-white focus:border-cyan-500 focus:outline-none transition-colors'
          aria-label='Sort items'
        >
          <option value='newest'>Newest First</option>
          <option value='oldest'>Oldest First</option>
          <option value='favorites'>Favorites First</option>
          <option value='cost'>Highest Cost</option>
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className='flex items-center justify-center py-12'
        >
          <div className='text-center'>
            <motion.div
              className='w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto mb-4'
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <span className='text-gray-400'>Generating your creation...</span>
          </div>
        </motion.div>
      )}

      {/* Gallery Grid/List */}
      {filteredAndSortedItems.length > 0 ? (
        <motion.div
          layout
          className={`${
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }`}
        >
          <AnimatePresence>
            {filteredAndSortedItems.map(item => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className={`bg-black/40 border border-gray-600 rounded-lg overflow-hidden cyber-glass group hover:border-cyan-500/50 transition-all duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
              >
                {/* Image/Video Preview */}
                <div
                  className={`relative ${viewMode === 'list' ? 'w-32 h-32' : 'aspect-square'}`}
                >
                  <img
                    src={item.thumbnail}
                    alt={item.prompt}
                    className='w-full h-full object-cover'
                  />

                  {/* Type indicator */}
                  <div className='absolute top-2 left-2'>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'video'
                          ? 'bg-purple-500/80 text-white'
                          : 'bg-blue-500/80 text-white'
                      }`}
                    >
                      {item.type}
                    </span>
                  </div>

                  {/* Premium watermark indicator */}
                  {item.hasWatermark && userTier === 'free' && (
                    <div className='absolute top-2 right-2'>
                      <Crown className='w-4 h-4 text-yellow-400' />
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className='absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <div className='flex gap-2'>
                      <motion.button
                        onClick={() => handleItemAction('preview', item)}
                        className='p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label='Preview'
                      >
                        <ZoomIn className='w-4 h-4 text-white' />
                      </motion.button>
                      <motion.button
                        onClick={() => handleItemAction('favorite', item)}
                        className='p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors'
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        aria-label='Toggle favorite'
                      >
                        <Heart
                          className={`w-4 h-4 ${item.isFavorite ? 'text-red-400 fill-current' : 'text-white'}`}
                        />
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <div className='flex items-start justify-between mb-2'>
                    <h4 className='text-white font-medium text-sm line-clamp-2'>
                      {item.prompt}
                    </h4>
                    {item.isFavorite && (
                      <Star className='w-4 h-4 text-yellow-400 fill-current ml-2 flex-shrink-0' />
                    )}
                  </div>

                  {/* Metadata */}
                  <div className='space-y-2 mb-3'>
                    <div className='flex items-center gap-2 text-xs text-gray-400'>
                      <Clock className='w-3 h-3' />
                      <span>{formatTimeAgo(item.timestamp)}</span>
                      <span>•</span>
                      <span>{item.tokenCost} tokens</span>
                    </div>

                    {viewMode === 'list' && (
                      <div className='text-xs text-gray-400'>
                        <span>{item.settings.model}</span> •
                        <span>{item.settings.style}</span> •
                        <span>{item.settings.resolution}</span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className='flex flex-wrap gap-1 mb-3'>
                      {item.tags.slice(0, 3).map(tag => (
                        <span
                          key={tag}
                          className='px-2 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-full'
                        >
                          #{tag}
                        </span>
                      ))}
                      {item.tags.length > 3 && (
                        <span className='text-gray-400 text-xs'>
                          +{item.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Actions */}
                  <div className='flex items-center gap-1'>
                    <motion.button
                      onClick={() => handleItemAction('download', item)}
                      className='p-1.5 text-gray-400 hover:text-cyan-400 transition-colors'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label='Download'
                    >
                      <Download className='w-4 h-4' />
                    </motion.button>
                    <motion.button
                      onClick={() => handleItemAction('regenerate', item)}
                      className='p-1.5 text-gray-400 hover:text-green-400 transition-colors'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label='Regenerate'
                    >
                      <RotateCcw className='w-4 h-4' />
                    </motion.button>
                    <motion.button
                      onClick={() => handleItemAction('share', item)}
                      className='p-1.5 text-gray-400 hover:text-blue-400 transition-colors'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label='Share'
                    >
                      <Share2 className='w-4 h-4' />
                    </motion.button>
                    <motion.button
                      onClick={() => handleItemAction('delete', item)}
                      className='p-1.5 text-gray-400 hover:text-red-400 transition-colors'
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      aria-label='Delete'
                    >
                      <Trash2 className='w-4 h-4' />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center py-12'
          >
            <Sparkles className='w-16 h-16 text-gray-600 mx-auto mb-4' />
            <h4 className='text-white font-medium mb-2'>No creations yet</h4>
            <p className='text-gray-400 text-sm'>
              Start generating to see your AI creations here
            </p>
          </motion.div>
        )
      )}

      {/* Preview Modal */}
      <AnimatePresence>
        {showPreview && selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-black/90 border border-cyan-500/30 rounded-lg max-w-4xl max-h-[90vh] overflow-hidden cyber-glass'
              onClick={e => e.stopPropagation()}
            >
              <div className='p-4 border-b border-gray-700'>
                <div className='flex items-center justify-between'>
                  <h3 className='text-white font-medium'>Preview</h3>
                  <motion.button
                    onClick={() => setShowPreview(false)}
                    className='p-1 text-gray-400 hover:text-white transition-colors'
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <MoreHorizontal className='w-5 h-5' />
                  </motion.button>
                </div>
              </div>

              <div className='p-4'>
                <img
                  src={selectedItem.url}
                  alt={selectedItem.prompt}
                  className='w-full h-auto max-h-96 object-contain rounded-lg mb-4'
                />

                <div className='space-y-2'>
                  <h4 className='text-white font-medium'>
                    {selectedItem.prompt}
                  </h4>
                  <div className='flex items-center gap-4 text-sm text-gray-400'>
                    <span>{formatTimeAgo(selectedItem.timestamp)}</span>
                    <span>{selectedItem.tokenCost} tokens</span>
                    <span>{selectedItem.settings.model}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GalleryOutput;
