'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Video,
  Music,
  Heart,
  Share2,
  Download,
  Trash2,
  Search,
  Filter,
  Check,
  X,
  Edit3,
  Zap,
  Clock,
  Type,
  Eye,
  Shuffle,
  Star,
  Sparkles,
} from 'lucide-react';

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'audio';
  url: string;
  thumbnail: string;
  title: string;
  style: string;
  aspectRatio?: string;
  duration?: string;
  size: string;
  tokenCost: number;
  dateCreated: Date;
  isFavorite: boolean;
  tags: string[];
}

interface MyLibraryPanelProps {
  isVisible: boolean;
  onClose: () => void;
  userTier: 'free' | 'premium';
}

const FILTER_TABS = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'images', label: 'Images', icon: ImageIcon },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'audios', label: 'Audios', icon: Music },
  { id: 'favorites', label: 'Favorites', icon: Heart },
];

const SORT_OPTIONS = [
  { id: 'date', label: 'Date Created', icon: Clock },
  { id: 'type', label: 'Type', icon: Type },
  { id: 'tokens', label: 'Token Spent', icon: Zap },
  { id: 'alphabetical', label: 'Alphabetical', icon: Type },
];

// Mock data for demonstration
const MOCK_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'img_001',
    type: 'image',
    url: 'https://picsum.photos/800/800?random=1',
    thumbnail: 'https://picsum.photos/300/300?random=1',
    title: 'Cyberpunk Cityscape',
    style: 'Cyberpunk',
    aspectRatio: '1:1',
    size: '1024x1024',
    tokenCost: 10,
    dateCreated: new Date('2025-01-15'),
    isFavorite: true,
    tags: ['cyberpunk', 'city', 'neon'],
  },
  {
    id: 'img_002',
    type: 'image',
    url: 'https://picsum.photos/800/1200?random=2',
    thumbnail: 'https://picsum.photos/300/400?random=2',
    title: 'Anime Character Portrait',
    style: 'Anime Style',
    aspectRatio: '9:16',
    size: '768x1024',
    tokenCost: 10,
    dateCreated: new Date('2025-01-14'),
    isFavorite: false,
    tags: ['anime', 'character', 'portrait'],
  },
  {
    id: 'vid_001',
    type: 'video',
    url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
    thumbnail: 'https://picsum.photos/300/200?random=3',
    title: 'AI Generated Animation',
    style: 'Motion Graphics',
    duration: '00:30',
    size: '1280x720',
    tokenCost: 50,
    dateCreated: new Date('2025-01-13'),
    isFavorite: true,
    tags: ['animation', 'motion', 'ai'],
  },
  {
    id: 'aud_001',
    type: 'audio',
    url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
    thumbnail: '/api/placeholder/300/300',
    title: 'AI Music Composition',
    style: 'Synthwave',
    duration: '02:45',
    size: '320kbps',
    tokenCost: 25,
    dateCreated: new Date('2025-01-12'),
    isFavorite: false,
    tags: ['music', 'synthwave', 'ai'],
  },
];

export default function MyLibraryPanel({
  isVisible,
  onClose,
  userTier,
}: MyLibraryPanelProps) {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(MOCK_MEDIA_ITEMS);
  const [filteredItems, setFilteredItems] =
    useState<MediaItem[]>(MOCK_MEDIA_ITEMS);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true);
  const [welcomeText, setWelcomeText] = useState('');
  const [showParticles, setShowParticles] = useState(false);

  const welcomeMessage =
    "Here's all your wonderful creations, Master. Want to relive the magic?";
  const containerRef = useRef<HTMLDivElement>(null);

  // Typewriter effect for welcome message
  useEffect(() => {
    if (!showWelcomeMessage) return;

    let index = 0;
    const timer = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (index <= welcomeMessage.length) {
          setWelcomeText(welcomeMessage.slice(0, index));
          index++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setShowWelcomeMessage(false), 2000);
        }
      }, 50);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Show particles after component mounts
  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setShowParticles(true), 500);
    }
  }, [isVisible]);

  // Filter and sort items
  useEffect(() => {
    let filtered = [...mediaItems];

    // Apply filter
    if (activeFilter !== 'all') {
      if (activeFilter === 'favorites') {
        filtered = filtered.filter(item => item.isFavorite);
      } else {
        filtered = filtered.filter(
          item => item.type === activeFilter.slice(0, -1)
        );
      }
    }

    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.style.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.tags.some(tag =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return b.dateCreated.getTime() - a.dateCreated.getTime();
        case 'type':
          return a.type.localeCompare(b.type);
        case 'tokens':
          return b.tokenCost - a.tokenCost;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    setFilteredItems(filtered);
  }, [mediaItems, activeFilter, sortBy, searchQuery]);

  const toggleFavorite = (itemId: string) => {
    setMediaItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getStats = () => {
    const images = mediaItems.filter(item => item.type === 'image').length;
    const videos = mediaItems.filter(item => item.type === 'video').length;
    const audios = mediaItems.filter(item => item.type === 'audio').length;
    const totalTokens = mediaItems.reduce(
      (sum, item) => sum + item.tokenCost,
      0
    );

    return { images, videos, audios, totalTokens };
  };

  const stats = getStats();

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'audio':
        return Music;
      default:
        return Sparkles;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'text-cyan-400 border-cyan-400';
      case 'video':
        return 'text-purple-400 border-purple-400';
      case 'audio':
        return 'text-pink-400 border-pink-400';
      default:
        return 'text-gray-400 border-gray-400';
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Background Particles */}
      {showParticles && (
        <div className='fixed inset-0 pointer-events-none z-40'>
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className='absolute w-1 h-1 bg-cyan-400 rounded-full'
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 10,
                opacity: 0,
              }}
              animate={{
                y: -10,
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Panel */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4'
      >
        <motion.div
          ref={containerRef}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className='w-full max-w-7xl h-[95vh] bg-black/95 border-2 border-cyan-500/50 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,255,255,0.3)] relative'
        >
          {/* Welcome Message Overlay */}
          <AnimatePresence>
            {showWelcomeMessage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center'
              >
                <div className='text-center'>
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className='w-20 h-20 rounded-full border-2 border-cyan-400 mx-auto mb-6 p-2'
                  >
                    <img
                      src='/assets/splash/SeraphineAvatar.gif'
                      alt='Seraphine'
                      className='w-full h-full rounded-full object-cover'
                    />
                  </motion.div>
                  <div className='text-2xl text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text font-bold mb-4'>
                    Seraphine AI Assistant
                  </div>
                  <div className='text-lg text-cyan-300 font-mono min-h-[2rem]'>
                    {welcomeText}
                    <span className='animate-pulse text-cyan-400'>|</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <div className='flex items-center justify-between p-6 border-b border-cyan-500/20'>
            <div className='flex items-center gap-4'>
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className='w-12 h-12 rounded-full bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 p-0.5'
              >
                <div className='w-full h-full rounded-full bg-black flex items-center justify-center'>
                  <Sparkles className='w-6 h-6 text-cyan-400' />
                </div>
              </motion.div>
              <div>
                <h2 className='text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text'>
                  My Neural Library
                </h2>
                <p className='text-sm text-cyan-400/70'>
                  Your creative masterpieces await
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className='flex items-center gap-6'>
              <div className='flex items-center gap-4 bg-black/30 rounded-lg p-3 border border-cyan-500/30'>
                <div className='text-center'>
                  <div className='text-lg font-bold text-cyan-400'>
                    {stats.images}
                  </div>
                  <div className='text-xs text-cyan-400/70'>Images</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-purple-400'>
                    {stats.videos}
                  </div>
                  <div className='text-xs text-purple-400/70'>Videos</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-pink-400'>
                    {stats.audios}
                  </div>
                  <div className='text-xs text-pink-400/70'>Audios</div>
                </div>
                <div className='text-center'>
                  <div className='text-lg font-bold text-yellow-400'>
                    {stats.totalTokens}
                  </div>
                  <div className='text-xs text-yellow-400/70'>Tokens</div>
                </div>
              </div>

              <button
                onClick={onClose}
                className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
                aria-label='Close Library'
              >
                <X className='w-5 h-5 text-red-400' />
              </button>
            </div>
          </div>

          {/* Controls */}
          <div className='p-6 border-b border-cyan-500/20 space-y-4'>
            {/* Filter Tabs */}
            <div className='flex items-center gap-2 overflow-x-auto'>
              {FILTER_TABS.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveFilter(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 whitespace-nowrap ${
                      activeFilter === tab.id
                        ? 'border-cyan-400 bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                        : 'border-cyan-500/30 bg-black/20 text-cyan-400/70 hover:border-cyan-400/50'
                    }`}
                  >
                    <Icon className='w-4 h-4' />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Search and Sort */}
            <div className='flex items-center gap-4'>
              <div className='flex-1 relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-cyan-400/50' />
                <input
                  type='text'
                  placeholder='Search your creations...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='w-full bg-black/30 border border-cyan-500/30 rounded-xl pl-10 pr-4 py-3 text-white placeholder-cyan-400/50 focus:border-cyan-400 focus:outline-none transition-all duration-300'
                />
              </div>

              <div className='relative'>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className='bg-black/30 border border-purple-500/30 rounded-xl px-4 py-3 text-white focus:border-purple-400 focus:outline-none transition-all duration-300 appearance-none min-w-[150px]'
                  aria-label='Sort by'
                >
                  {SORT_OPTIONS.map(option => (
                    <option
                      key={option.id}
                      value={option.id}
                      className='bg-black'
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
                <Filter className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-purple-400 pointer-events-none' />
              </div>
            </div>

            {/* Action Bar */}
            {selectedItems.size > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center gap-4 p-4 bg-purple-500/20 border border-purple-500/50 rounded-xl'
              >
                <span className='text-purple-400 font-semibold'>
                  {selectedItems.size} item{selectedItems.size > 1 ? 's' : ''}{' '}
                  selected
                </span>
                <div className='flex items-center gap-2'>
                  <button className='flex items-center gap-2 bg-cyan-500/80 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-colors'>
                    <Download className='w-4 h-4' />
                    Download All
                  </button>
                  <button className='flex items-center gap-2 bg-purple-500/80 hover:bg-purple-500 text-white px-4 py-2 rounded-lg transition-colors'>
                    <Share2 className='w-4 h-4' />
                    Share Selected
                  </button>
                  <button className='flex items-center gap-2 bg-red-500/80 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors'>
                    <Trash2 className='w-4 h-4' />
                    Delete Selected
                  </button>
                </div>
                <button
                  onClick={() => setSelectedItems(new Set())}
                  className='ml-auto text-gray-400 hover:text-white'
                  aria-label='Clear selection'
                >
                  <X className='w-4 h-4' />
                </button>
              </motion.div>
            )}
          </div>

          {/* Media Grid */}
          <div className='flex-1 overflow-y-auto p-6'>
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 library-grid-reveal'
            >
              <AnimatePresence>
                {filteredItems.map((item, index) => {
                  const MediaIcon = getMediaIcon(item.type);
                  const typeColors = getTypeColor(item.type);

                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                        transition: { delay: index * 0.1 },
                      }}
                      exit={{ opacity: 0, scale: 0.8, y: 20 }}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        transition: { duration: 0.2 },
                      }}
                      className='group relative bg-black/40 border-2 border-cyan-500/20 rounded-xl overflow-hidden hover:border-cyan-400/60 transition-all duration-300 cursor-pointer media-card-hover hologram-swipe glitch-border'
                    >
                      {/* Selection Checkbox */}
                      <div className='absolute top-3 left-3 z-10'>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={e => {
                            e.stopPropagation();
                            toggleItemSelection(item.id);
                          }}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-all selection-checkbox ${
                            selectedItems.has(item.id)
                              ? 'bg-cyan-500 border-cyan-500'
                              : 'bg-black/50 border-cyan-500/50 hover:border-cyan-400'
                          }`}
                        >
                          {selectedItems.has(item.id) && (
                            <Check className='w-3 h-3 text-white' />
                          )}
                        </motion.button>
                      </div>

                      {/* Favorite Heart */}
                      <div className='absolute top-3 right-3 z-10'>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          onClick={e => {
                            e.stopPropagation();
                            toggleFavorite(item.id);
                          }}
                          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                            item.isFavorite
                              ? 'bg-red-500/80 text-white'
                              : 'bg-black/50 text-gray-400 hover:text-red-400'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`}
                          />
                        </motion.button>
                      </div>

                      {/* Media Thumbnail */}
                      <div
                        className='relative aspect-square overflow-hidden'
                        onClick={() => setSelectedItem(item)}
                      >
                        <img
                          src={item.thumbnail}
                          alt={item.title}
                          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110'
                        />

                        {/* Hologram Overlay Effect */}
                        <div className='absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/20 to-cyan-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 group-hover:animate-pulse' />

                        {/* Type Icon */}
                        <div className='absolute bottom-3 left-3'>
                          <div
                            className={`flex items-center gap-1 bg-black/80 px-2 py-1 rounded-full border ${typeColors}`}
                          >
                            <MediaIcon className='w-3 h-3' />
                            <span className='text-xs font-semibold capitalize'>
                              {item.type}
                            </span>
                          </div>
                        </div>

                        {/* Duration for video/audio */}
                        {(item.type === 'video' || item.type === 'audio') &&
                          item.duration && (
                            <div className='absolute bottom-3 right-3'>
                              <div className='bg-black/80 px-2 py-1 rounded text-xs text-white font-mono'>
                                {item.duration}
                              </div>
                            </div>
                          )}

                        {/* Hover Actions */}
                        <div className='absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                          <div className='flex gap-3'>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={e => {
                                e.stopPropagation();
                                setSelectedItem(item);
                              }}
                              className='w-10 h-10 bg-cyan-500/80 hover:bg-cyan-500 rounded-full flex items-center justify-center text-white transition-colors'
                            >
                              <Eye className='w-4 h-4' />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={e => {
                                e.stopPropagation();
                                // Download logic
                              }}
                              className='w-10 h-10 bg-purple-500/80 hover:bg-purple-500 rounded-full flex items-center justify-center text-white transition-colors'
                            >
                              <Download className='w-4 h-4' />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              onClick={e => {
                                e.stopPropagation();
                                // Share logic
                              }}
                              className='w-10 h-10 bg-pink-500/80 hover:bg-pink-500 rounded-full flex items-center justify-center text-white transition-colors'
                            >
                              <Share2 className='w-4 h-4' />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {/* Item Info */}
                      <div className='p-4'>
                        <h3 className='text-white font-semibold text-sm mb-2 line-clamp-1'>
                          {item.title}
                        </h3>

                        {/* Tags */}
                        <div className='flex items-center gap-1 mb-3 text-xs'>
                          <span
                            className={`px-2 py-1 rounded-full border ${typeColors} bg-black/30`}
                          >
                            {item.type === 'image'
                              ? `${item.style} · ${item.aspectRatio}`
                              : `${item.style} · ${item.size}`}
                          </span>
                        </div>

                        {/* Meta Info */}
                        <div className='flex items-center justify-between text-xs text-gray-400'>
                          <span>{item.dateCreated.toLocaleDateString()}</span>
                          <div className='flex items-center gap-1'>
                            <Zap className='w-3 h-3 text-yellow-400' />
                            <span>{item.tokenCost}</span>
                          </div>
                        </div>
                      </div>

                      {/* Glitch Border Effect */}
                      <div className='absolute inset-0 border-2 border-transparent group-hover:border-cyan-400 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none animate-pulse' />
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredItems.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex flex-col items-center justify-center h-64 text-center'
              >
                <div className='w-16 h-16 rounded-full border-2 border-cyan-500/30 border-dashed flex items-center justify-center mb-4'>
                  <Sparkles className='w-8 h-8 text-cyan-400/50' />
                </div>
                <h3 className='text-xl font-bold text-cyan-400/50 mb-2'>
                  No creations found
                </h3>
                <p className='text-cyan-400/40'>
                  {searchQuery
                    ? 'Try a different search term'
                    : 'Start creating to see your masterpieces here'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='fixed inset-0 bg-black/95 backdrop-blur-sm z-[60] flex items-center justify-center p-4'
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className='bg-black/90 border-2 border-cyan-500/50 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto'
            >
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-2xl font-bold text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text'>
                  {selectedItem.title}
                </h3>
                <button
                  onClick={() => setSelectedItem(null)}
                  className='w-10 h-10 flex items-center justify-center rounded-lg border border-red-500/30 hover:bg-red-500/10 transition-colors'
                  aria-label='Close detail view'
                >
                  <X className='w-5 h-5 text-red-400' />
                </button>
              </div>

              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Media Preview */}
                <div className='relative'>
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.title}
                    className='w-full rounded-xl border border-cyan-500/30'
                  />
                </div>

                {/* Details */}
                <div className='space-y-6'>
                  <div>
                    <h4 className='text-cyan-400 font-semibold mb-2'>
                      Details
                    </h4>
                    <div className='space-y-2 text-sm'>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Type:</span>
                        <span className='text-white capitalize'>
                          {selectedItem.type}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Style:</span>
                        <span className='text-white'>{selectedItem.style}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Size:</span>
                        <span className='text-white'>{selectedItem.size}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Created:</span>
                        <span className='text-white'>
                          {selectedItem.dateCreated.toLocaleDateString()}
                        </span>
                      </div>
                      <div className='flex justify-between'>
                        <span className='text-gray-400'>Token Cost:</span>
                        <span className='text-yellow-400'>
                          {selectedItem.tokenCost}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='space-y-3'>
                    <button className='w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2'>
                      <Download className='w-5 h-5' />
                      Download Original
                    </button>

                    <button className='w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-400 hover:to-pink-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2'>
                      <Share2 className='w-5 h-5' />
                      Share Creation
                    </button>

                    <button className='w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2'>
                      <Shuffle className='w-5 h-5' />
                      Generate Similar
                    </button>

                    <button className='w-full border-2 border-gray-500/50 hover:border-gray-400/70 text-gray-300 hover:text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2'>
                      <Edit3 className='w-5 h-5' />
                      Rename
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
