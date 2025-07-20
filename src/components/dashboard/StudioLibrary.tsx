'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Video,
  Mic,
  Download,
  Share2,
  Play,
  Pause,
  Star,
  StarOff,
  Eye,
  Trash2,
  Filter,
  Search,
  Grid,
  List,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface StudioLibraryProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'voice' | 'avatar';
  title: string;
  thumbnail: string;
  createdAt: string;
  duration?: number;
  isPinned: boolean;
  url: string;
}

export default function StudioLibrary({
  isVisible,
  onClose,
}: StudioLibraryProps): JSX.Element | null {
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingId, setPlayingId] = useState<string | null>(null);

  // Mock data - replace with actual API data
  const [mediaItems] = useState<MediaItem[]>([
    {
      id: '1',
      type: 'image',
      title: 'Cyberpunk City Night',
      thumbnail: '/assets/splash/SplashBg.png',
      createdAt: '2025-07-19',
      isPinned: true,
      url: '/generated/image1.jpg',
    },
    {
      id: '2',
      type: 'video',
      title: 'AI Avatar Demo',
      thumbnail: '/assets/splash/SeraphineAvatar.png',
      createdAt: '2025-07-18',
      duration: 1,
      isPinned: false,
      url: '/generated/video1.mp4',
    },
    {
      id: '3',
      type: 'voice',
      title: 'Seraphine Voice Sample',
      thumbnail: '/assets/splash/LoadingOrb.gif',
      createdAt: '2025-07-17',
      duration: 5,
      isPinned: true,
      url: '/generated/voice1.mp3',
    },
    {
      id: '4',
      type: 'avatar',
      title: 'Neural Avatar Preview',
      thumbnail: '/assets/splash/GradientBackAvatar.png',
      createdAt: '2025-07-16',
      isPinned: false,
      url: '/generated/avatar1.jpg',
    },
  ]);

  if (!isVisible) return null;

  const filteredItems = mediaItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pinnedItems = filteredItems.filter(item => item.isPinned);
  const regularItems = filteredItems.filter(item => !item.isPinned);

  const handlePlay = (id: string) => {
    setPlayingId(playingId === id ? null : id);
  };

  const togglePin = (id: string) => {
    // Handle pin toggle logic
  };

  const handleDownload = (item: MediaItem) => {
    // Handle download logic
  };

  const handleShare = (item: MediaItem) => {
    // Handle share logic
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return ImageIcon;
      case 'video':
        return Video;
      case 'voice':
        return Mic;
      case 'avatar':
        return Eye;
      default:
        return ImageIcon;
    }
  };

  const renderMediaItem = (item: MediaItem) => {
    const TypeIcon = getTypeIcon(item.type);
    const isPlaying = playingId === item.id;

    return (
      <div
        key={item.id}
        className={`${styles.mediaItem} ${viewMode === 'list' ? styles.listView : ''}`}
      >
        <div className={styles.mediaThumbnail}>
          <img src={item.thumbnail} alt={item.title} />
          <div className={styles.mediaOverlay}>
            {(item.type === 'video' || item.type === 'voice') && (
              <button
                className={styles.playButton}
                onClick={() => handlePlay(item.id)}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>
            )}
            <div className={styles.mediaType}>
              <TypeIcon size={16} />
            </div>
          </div>
          {item.duration && (
            <div className={styles.duration}>{item.duration}s</div>
          )}
        </div>

        <div className={styles.mediaInfo}>
          <h4 className={styles.mediaTitle}>{item.title}</h4>
          <p className={styles.mediaDate}>{item.createdAt}</p>

          <div className={styles.mediaActions}>
            <button
              className={`${styles.actionButton} ${item.isPinned ? styles.pinned : ''}`}
              onClick={() => togglePin(item.id)}
              title={item.isPinned ? 'Unpin' : 'Pin'}
              aria-label={item.isPinned ? 'Unpin item' : 'Pin item'}
            >
              {item.isPinned ? <Star size={16} /> : <StarOff size={16} />}
            </button>

            <button
              className={styles.actionButton}
              onClick={() => handleDownload(item)}
              title='Download'
              aria-label='Download item'
            >
              <Download size={16} />
            </button>

            <button
              className={styles.actionButton}
              onClick={() => handleShare(item)}
              title='Share'
              aria-label='Share item'
            >
              <Share2 size={16} />
            </button>

            {item.type === 'video' && (
              <span className={styles.freeLabel}>Preview Only</span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.libraryModal}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Studio Library</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close studio library'
            title='Close'
          >
            ×
          </button>
        </div>

        <div className={styles.libraryControls}>
          <div className={styles.searchBar}>
            <Search size={20} />
            <input
              type='text'
              placeholder='Search your creations...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div className={styles.filterButtons}>
            {['all', 'image', 'video', 'voice', 'avatar'].map(filter => (
              <button
                key={filter}
                className={`${styles.filterButton} ${activeFilter === filter ? styles.active : ''}`}
                onClick={() => setActiveFilter(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>

          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label='Grid view'
              title='Grid view'
            >
              <Grid size={18} />
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
              aria-label='List view'
              title='List view'
            >
              <List size={18} />
            </button>
          </div>
        </div>

        <div className={styles.libraryContent}>
          {pinnedItems.length > 0 && (
            <div className={styles.pinnedSection}>
              <h3 className={styles.sectionTitle}>
                <Star size={20} />
                Pinned Creations
              </h3>
              <div
                className={`${styles.mediaGrid} ${viewMode === 'list' ? styles.listGrid : ''}`}
              >
                {pinnedItems.map(renderMediaItem)}
              </div>
            </div>
          )}

          <div className={styles.regularSection}>
            <h3 className={styles.sectionTitle}>
              Recent Creations ({regularItems.length})
            </h3>
            <div
              className={`${styles.mediaGrid} ${viewMode === 'list' ? styles.listGrid : ''}`}
            >
              {regularItems.map(renderMediaItem)}
            </div>
          </div>

          {filteredItems.length === 0 && (
            <div className={styles.emptyState}>
              <ImageIcon size={48} />
              <h3>No creations found</h3>
              <p>Start creating with our AI tools to build your library!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
