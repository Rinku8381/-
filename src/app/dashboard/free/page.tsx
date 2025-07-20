'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  Lock,
  Zap,
  Coins,
  Crown,
  Gift,
  Bell,
  Palette,
  Image as ImageIcon,
  Video,
  Mic,
  ShoppingBag,
  X,
  Layers,
  Sparkles,
  Brain,
  Wand2,
  Library,
  Archive,
  LogIn,
  ChevronRight,
  BarChart3,
  Star,
  Rocket,
  Shield,
  Headphones,
  Eye,
  Activity,
} from 'lucide-react';

// Import dashboard components
import UserSettingsPanel from '@/components/dashboard/UserSettingsPanel';
import StudioLibrary from '@/components/dashboard/StudioLibrary';
import InviteTokenPanel from '@/components/dashboard/InviteTokenPanel';
import ShopPanel from '@/components/dashboard/ShopPanel';
import SubscriptionPopup from '@/components/dashboard/SubscriptionPopup';
import CanvasAIEditor from '@/components/dashboard/CanvasAIEditor';
import AIImageGenerationPanel from '@/components/dashboard/AIImageGenerationPanel';
import VoiceCommandSystem from '@/components/dashboard/VoiceCommandSystem';
import MyLibraryPanel from '@/components/dashboard/MyLibraryPanel';

// Types
interface UserData {
  name: string;
  avatar: string;
  tokens: number;
  referrals: number;
  dailyLimits: {
    images: number;
    voices: number;
    videos: number;
  };
  usedLimits: {
    images: number;
    voices: number;
    videos: number;
  };
}

interface DashboardFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isLocked?: boolean;
  isPremium?: boolean;
  isNew?: boolean;
  category: 'ai-tools' | 'library' | 'social' | 'premium';
  onClick: () => void;
}

interface QuickAccessItem {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  glow?: string;
  isActive?: boolean;
  hasNotification?: boolean;
}

const FreeDashboard: React.FC = () => {
  const router = useRouter();
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    name: 'Neural User',
    avatar: '/assets/splash/SeraphineAvatar.gif',
    tokens: 150,
    referrals: 3,
    dailyLimits: {
      images: 3,
      voices: 5,
      videos: 1,
    },
    usedLimits: {
      images: 2,
      voices: 1,
      videos: 0,
    },
  });

  // Entry animation and premium modal trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
      // Show premium modal after a brief delay
      setTimeout(() => setShowPremiumModal(true), 1500);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handlePanelOpen = (panelName: string) => {
    setActivePanel(panelName);
  };

  const handlePanelClose = () => {
    setActivePanel(null);
  };

  const handleUpgrade = () => {
    setShowSubscription(true);
  };

  // Feature grid data with enhanced cyberpunk styling
  const dashboardFeatures: DashboardFeature[] = [
    {
      id: 'ai-studio',
      title: 'AI Studio',
      description: 'Create stunning AI images with neural networks',
      icon: <Brain className='w-6 h-6 cyber-icon' />,
      category: 'ai-tools',
      isNew: true,
      onClick: () => handlePanelOpen('ai-features'),
    },
    {
      id: 'ai-generator',
      title: 'AI Generator',
      description: 'Advanced multi-modal AI generation',
      icon: <Wand2 className='w-6 h-6 cyber-icon' />,
      category: 'ai-tools',
      onClick: () => handlePanelOpen('ai-features'),
    },
    {
      id: 'my-library',
      title: 'My Library',
      description: 'Your digital creation vault',
      icon: <Library className='w-6 h-6 cyber-icon' />,
      category: 'library',
      onClick: () => handlePanelOpen('library'),
    },
    {
      id: 'canvas-editor',
      title: 'Canvas Editor',
      description: 'Professional AI editing suite',
      icon: <Layers className='w-6 h-6 cyber-icon' />,
      category: 'ai-tools',
      isLocked: true,
      isPremium: true,
      onClick: () => handlePanelOpen('canvas'),
    },
    {
      id: 'style-library',
      title: 'Style Library',
      description: 'Curated art styles & neural presets',
      icon: <Palette className='w-6 h-6 cyber-icon' />,
      category: 'library',
      onClick: () => handlePanelOpen('library'),
    },
    {
      id: 'prompt-archive',
      title: 'Prompt Archive',
      description: 'Your command history database',
      icon: <Archive className='w-6 h-6 cyber-icon' />,
      category: 'library',
      onClick: () => handlePanelOpen('library'),
    },
    {
      id: 'token-shop',
      title: 'Token Shop',
      description: 'Acquire neural processing credits',
      icon: <ShoppingBag className='w-6 h-6 cyber-icon' />,
      category: 'premium',
      onClick: () => handlePanelOpen('shop'),
    },
    {
      id: 'earn-tokens',
      title: 'Earn Tokens',
      description: 'Expand your network & earn rewards',
      icon: <Gift className='w-6 h-6 cyber-icon' />,
      category: 'social',
      onClick: () => handlePanelOpen('invite'),
    },
    {
      id: 'neural-login',
      title: 'Neural Profile',
      description: 'Identity & system configuration',
      icon: <LogIn className='w-6 h-6 cyber-icon' />,
      category: 'social',
      onClick: () => handlePanelOpen('settings'),
    },
  ];

  const quickAccessItems = [
    {
      label: 'Recent Creations',
      icon: <Activity className='w-4 h-4' />,
      onClick: () => handlePanelOpen('library'),
      glow: 'cyber-glow',
    },
    {
      label: 'Voice Commands',
      icon: <Mic className='w-4 h-4' />,
      onClick: () => setVoiceEnabled(!voiceEnabled),
      glow: 'cyber-glow-purple',
      isActive: voiceEnabled,
    },
    {
      label: 'Neural Settings',
      icon: <Settings className='w-4 h-4' />,
      onClick: () => handlePanelOpen('settings'),
      glow: 'cyber-glow-cyan',
    },
    {
      label: 'System Alerts',
      icon: <Bell className='w-4 h-4' />,
      onClick: () => {},
      glow: 'cyber-glow-pink',
      hasNotification: true,
    },
  ];

  useEffect(() => {
    // Set progress bar widths using CSS custom properties
    const progressBars = document.querySelectorAll(
      '.seraphine-progress-bar[data-progress-width]'
    );

    progressBars.forEach(bar => {
      const element = bar as HTMLElement;
      const progressWidth = element.getAttribute('data-progress-width');
      if (progressWidth) {
        element.style.setProperty('--progress-width', progressWidth);
      }
    });
  }, [userData.usedLimits, userData.dailyLimits]);

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 text-white overflow-hidden'>
      {/* Enhanced Animated Background */}
      <div className='fixed inset-0 pointer-events-none'>
        <div className='absolute inset-0 opacity-40'>
          <div className='w-full h-full bg-gradient-to-br from-cyan-500/10 via-purple-500/10 to-pink-500/10 seraphine-grid-bg'></div>
        </div>
        <div className='absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-magenta-500/5'></div>
        {/* Ambient orbs */}
        <div className='absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-radial from-cyan-400/20 to-transparent rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-purple-400/15 to-transparent rounded-full blur-3xl animate-pulse seraphine-ambient-delay'></div>
      </div>

      {/* TopBar with enhanced styling */}
      <header
        className={`relative z-10 border-b border-cyan-500/30 cyber-glass-cyan ${isLoaded ? 'slide-in-up' : 'opacity-0'}`}
      >
        <div className='max-w-7xl mx-auto px-6 py-4'>
          <div className='flex items-center justify-between'>
            {/* Logo Section */}
            <div className='flex items-center space-x-4'>
              <div className='flex items-center space-x-3'>
                <div className='relative'>
                  <div className='w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center cyber-glow'>
                    <Zap className='w-6 h-6 text-white' />
                  </div>
                  <div className='absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse'></div>
                </div>
                <div>
                  <h1 className='text-2xl font-bold gradient-text-animate'>
                    Seraphine Hybrid V1.5
                  </h1>
                  <div className='flex items-center space-x-2'>
                    <span className='text-xs text-cyan-400 bg-cyan-500/20 px-3 py-1 rounded-full border border-cyan-500/40 cyber-glow'>
                      FREE ACCESS
                    </span>
                    <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Token Display */}
            <div className='flex items-center space-x-3 cyber-glass-purple px-6 py-3 rounded-2xl border border-purple-500/40 cyber-glow-purple hover:scale-105 transition-all duration-300'>
              <div className='relative'>
                <Coins className='w-6 h-6 text-yellow-400' />
                <div className='absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-ping'></div>
              </div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-yellow-400'>
                  {userData.tokens}
                </div>
                <div className='text-xs text-yellow-400/70'>Neural Credits</div>
              </div>
            </div>

            {/* Enhanced User Profile */}
            <div className='flex items-center space-x-4'>
              <button
                className='relative p-3 cyber-glass rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 notification-pulse'
                title='System Alerts'
                aria-label='View system notifications'
              >
                <Bell className='w-5 h-5 text-gray-400 hover:text-cyan-400' />
                <div className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center'>
                  <span className='text-xs text-white font-bold'>3</span>
                </div>
              </button>
              <div className='flex items-center space-x-3 cyber-glass px-4 py-2 rounded-xl border border-gray-700 hover:border-cyan-500/50 transition-all duration-300 hover:cyber-glow'>
                <div className='relative'>
                  <img
                    src={userData.avatar}
                    alt='Neural avatar'
                    className='w-8 h-8 rounded-full border-2 border-cyan-500/50'
                  />
                  <div className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900'></div>
                </div>
                <div>
                  <div className='text-sm font-medium text-gray-300'>
                    {userData.name}
                  </div>
                  <div className='text-xs text-cyan-400'>Neural Operative</div>
                </div>
                <ChevronRight className='w-4 h-4 text-gray-400 hover:text-cyan-400 transition-colors' />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='relative z-10 max-w-7xl mx-auto px-6 py-8'>
        <div className='grid grid-cols-1 lg:grid-cols-4 gap-8'>
          {/* Enhanced Left Sidebar */}
          <div
            className={`lg:col-span-1 space-y-6 ${isLoaded ? 'slide-in-left animate-delay-200' : 'opacity-0'}`}
          >
            {/* Quick Access Panel */}
            <div className='cyber-glass-cyan rounded-3xl p-6 border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-300 cyber-glow'>
              <h2 className='text-xl font-bold text-cyan-300 mb-6 flex items-center space-x-3'>
                <div className='p-2 bg-cyan-500/20 rounded-lg'>
                  <Rocket className='w-5 h-5' />
                </div>
                <span>Quick Access</span>
              </h2>
              <div className='space-y-3'>
                {quickAccessItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={item.onClick}
                    className={`
                      w-full flex items-center space-x-4 p-4 cyber-glass rounded-xl border border-transparent 
                      hover:border-cyan-500/40 transition-all duration-300 group relative overflow-hidden
                      ${item.isActive ? 'border-purple-500/50 cyber-glow-purple' : ''}
                    `}
                  >
                    <div
                      className={`relative p-2 rounded-lg ${item.glow} transition-all duration-300 group-hover:scale-110`}
                    >
                      <div
                        className={`text-cyan-400 group-hover:text-white transition-colors ${item.isActive ? 'text-purple-400' : ''}`}
                      >
                        {item.icon}
                      </div>
                      {item.hasNotification && (
                        <div className='absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse'></div>
                      )}
                    </div>
                    <span className='text-sm font-medium text-gray-300 group-hover:text-white transition-colors'>
                      {item.label}
                    </span>
                    <ChevronRight className='w-4 h-4 text-gray-500 group-hover:text-cyan-400 ml-auto transition-all duration-300 group-hover:translate-x-1' />
                  </button>
                ))}
              </div>
            </div>

            {/* Enhanced Daily Limits Panel */}
            <div className='cyber-glass-purple rounded-3xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 cyber-glow-purple'>
              <h2 className='text-xl font-bold text-purple-300 mb-6 flex items-center space-x-3'>
                <div className='p-2 bg-purple-500/20 rounded-lg'>
                  <BarChart3 className='w-5 h-5' />
                </div>
                <span>Neural Quotas</span>
              </h2>
              <div className='space-y-6'>
                {/* AI Images */}
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-cyan-500/20 rounded-lg'>
                        <ImageIcon className='w-4 h-4 text-cyan-400' />
                      </div>
                      <span className='text-sm font-medium text-gray-300'>
                        AI Images
                      </span>
                    </div>
                    <span className='text-sm font-bold text-cyan-400'>
                      {userData.usedLimits.images} /{' '}
                      {userData.dailyLimits.images}
                    </span>
                  </div>
                  <div className='relative w-full bg-gray-800/50 rounded-full h-3 overflow-hidden'>
                    <div
                      className='seraphine-progress-bar bg-gradient-to-r from-cyan-500 to-blue-500 h-3 rounded-full transition-all duration-500 cyber-glow'
                      data-progress-width={`${(userData.usedLimits.images / userData.dailyLimits.images) * 100}%`}
                    ></div>
                  </div>
                </div>

                {/* Voice Generation */}
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-purple-500/20 rounded-lg'>
                        <Mic className='w-4 h-4 text-purple-400' />
                      </div>
                      <span className='text-sm font-medium text-gray-300'>
                        Voice Synthesis
                      </span>
                    </div>
                    <span className='text-sm font-bold text-purple-400'>
                      {userData.usedLimits.voices} /{' '}
                      {userData.dailyLimits.voices}
                    </span>
                  </div>
                  <div className='relative w-full bg-gray-800/50 rounded-full h-3 overflow-hidden'>
                    <div
                      className='seraphine-progress-bar bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500 cyber-glow-purple'
                      data-progress-width={`${(userData.usedLimits.voices / userData.dailyLimits.voices) * 100}%`}
                    ></div>
                  </div>
                </div>

                {/* Video Clips */}
                <div>
                  <div className='flex items-center justify-between mb-2'>
                    <div className='flex items-center space-x-3'>
                      <div className='p-2 bg-orange-500/20 rounded-lg'>
                        <Video className='w-4 h-4 text-orange-400' />
                      </div>
                      <span className='text-sm font-medium text-gray-300'>
                        Video Clips
                      </span>
                    </div>
                    <span className='text-sm font-bold text-orange-400'>
                      {userData.usedLimits.videos} /{' '}
                      {userData.dailyLimits.videos}
                    </span>
                  </div>
                  <div className='relative w-full bg-gray-800/50 rounded-full h-3 overflow-hidden'>
                    <div
                      className='seraphine-progress-bar bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-500 cyber-glow-gold'
                      data-progress-width={`${(userData.usedLimits.videos / userData.dailyLimits.videos) * 100}%`}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Main Dashboard Grid */}
          <div
            className={`lg:col-span-3 ${isLoaded ? 'slide-in-right animate-delay-300' : 'opacity-0'}`}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'>
              {dashboardFeatures.map((feature, index) => (
                <button
                  key={feature.id}
                  onClick={feature.onClick}
                  className={`
                    cyber-card relative group p-8 rounded-3xl border backdrop-blur-xl transition-all duration-500
                    ${
                      feature.isPremium
                        ? 'cyber-glass-purple border-purple-500/40 hover:border-purple-400'
                        : 'cyber-glass-cyan border-cyan-500/30 hover:border-cyan-400'
                    }
                    ${feature.isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}
                    slide-in-up animate-delay-${(index + 1) * 100}
                  `}
                  disabled={feature.isLocked}
                >
                  {/* Enhanced New Badge */}
                  {feature.isNew && (
                    <div className='absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-black text-xs font-bold px-3 py-1 rounded-full cyber-glow shadow-lg'>
                      <Sparkles className='w-3 h-3 inline mr-1' />
                      NEW
                    </div>
                  )}

                  {/* Enhanced Lock Icon */}
                  {feature.isLocked && (
                    <div className='absolute top-6 right-6 p-2 bg-yellow-500/20 rounded-lg border border-yellow-500/40'>
                      <Lock className='w-5 h-5 text-yellow-400' />
                    </div>
                  )}

                  {/* Feature Content */}
                  <div className='flex flex-col items-center text-center space-y-6'>
                    <div
                      className={`
                      p-6 rounded-2xl border transition-all duration-500 cyber-icon
                      ${
                        feature.isPremium
                          ? 'cyber-glass-purple border-purple-500/40 text-purple-400'
                          : 'cyber-glass-cyan border-cyan-500/40 text-cyan-400'
                      }
                      group-hover:scale-110 group-hover:rotate-3
                    `}
                    >
                      {feature.icon}
                    </div>

                    <div>
                      <h3
                        className={`
                        text-xl font-bold mb-3 transition-all duration-300
                        ${feature.isPremium ? 'text-purple-300' : 'text-cyan-300'}
                        group-hover:text-white
                      `}
                      >
                        {feature.title}
                      </h3>
                      <p className='text-sm text-gray-400 group-hover:text-gray-300 transition-all duration-300 leading-relaxed'>
                        {feature.description}
                      </p>
                    </div>
                  </div>

                  {/* Enhanced Glow Effect */}
                  <div
                    className={`
                    absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none
                    ${
                      feature.isPremium
                        ? 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                        : 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20'
                    }
                  `}
                  ></div>
                </button>
              ))}

              {/* Enhanced Premium CTA Card */}
              <button
                onClick={handleUpgrade}
                className='cyber-card relative group p-8 rounded-3xl premium-card transition-all duration-500 hover:scale-105 cyber-glow-gold md:col-span-2 xl:col-span-3 slide-in-up animate-delay-600'
              >
                <div className='flex items-center justify-center space-x-8'>
                  <div className='relative'>
                    <div className='p-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-2xl border border-purple-400/50 cyber-glow-purple'>
                      <Crown className='w-12 h-12 text-yellow-400' />
                    </div>
                    <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'>
                      <Star className='w-3 h-3 text-black' />
                    </div>
                  </div>
                  <div className='text-center flex-1'>
                    <h3 className='text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-yellow-300 bg-clip-text text-transparent mb-4'>
                      Unlock Neural Supremacy
                    </h3>
                    <p className='text-gray-300 mb-6 text-lg'>
                      Ascend to unlimited AI generation, exclusive neural tools,
                      and premium system access
                    </p>
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-sm'>
                      <div className='flex items-center space-x-2 text-purple-300'>
                        <div className='w-2 h-2 bg-purple-400 rounded-full'></div>
                        <span>∞ Neural Credits</span>
                      </div>
                      <div className='flex items-center space-x-2 text-cyan-300'>
                        <div className='w-2 h-2 bg-cyan-400 rounded-full'></div>
                        <span>Canvas Editor</span>
                      </div>
                      <div className='flex items-center space-x-2 text-pink-300'>
                        <div className='w-2 h-2 bg-pink-400 rounded-full'></div>
                        <span>Premium Styles</span>
                      </div>
                      <div className='flex items-center space-x-2 text-yellow-300'>
                        <div className='w-2 h-2 bg-yellow-400 rounded-full'></div>
                        <span>Priority Matrix</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className='w-8 h-8 text-purple-300 group-hover:translate-x-2 group-hover:text-yellow-400 transition-all duration-300' />
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Seraphine Avatar */}
      <div className='fixed bottom-8 right-8 z-20'>
        <div className='seraphine-float'>
          <div className='relative group cursor-pointer'>
            <div className='w-20 h-20 rounded-full border-2 border-cyan-500/50 cyber-glow-cyan p-1 hover:border-purple-500/50 hover:cyber-glow-purple transition-all duration-300'>
              <img
                src='/assets/splash/SeraphineAvatar.gif'
                alt='Seraphine AI Companion'
                className='w-full h-full rounded-full object-cover'
              />
            </div>
            <div className='absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center cyber-glow'>
              <Eye className='w-3 h-3 text-black' />
            </div>
            {/* Tooltip */}
            <div className='absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/90 text-cyan-400 text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap'>
              Seraphine AI • Online
            </div>
          </div>
        </div>
      </div>

      {/* Premium Welcome Modal */}
      {showPremiumModal && (
        <div className='fixed inset-0 z-50 premium-modal flex items-center justify-center p-4'>
          <div className='relative w-full max-w-2xl'>
            <div className='premium-card rounded-3xl p-8 cyber-glow-purple'>
              {/* Close Button */}
              <button
                onClick={() => setShowPremiumModal(false)}
                className='absolute top-6 right-6 p-2 cyber-glass rounded-xl border border-gray-700 hover:border-red-500/50 transition-all duration-300 group'
                aria-label='Close premium modal'
                title='Close'
              >
                <X className='w-5 h-5 text-gray-400 group-hover:text-red-400' />
              </button>

              {/* Modal Content */}
              <div className='text-center space-y-8'>
                {/* Header */}
                <div className='space-y-4'>
                  <div className='flex justify-center'>
                    <div className='relative'>
                      <div className='p-6 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-3xl border border-purple-400/50 cyber-glow-purple'>
                        <Crown className='w-16 h-16 text-yellow-400' />
                      </div>
                      <div className='absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center cyber-glow-gold'>
                        <Sparkles className='w-4 h-4 text-black' />
                      </div>
                    </div>
                  </div>
                  <h2 className='text-4xl font-bold gradient-text-animate'>
                    Unlock the Full Power of Seraphine
                  </h2>
                  <p className='text-xl text-gray-300'>
                    Transcend limitations. Embrace neural supremacy.
                  </p>
                </div>

                {/* Features Grid */}
                <div className='grid grid-cols-2 gap-6'>
                  <div className='cyber-glass-cyan p-6 rounded-2xl border border-cyan-500/30'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-cyan-500/20 rounded-lg'>
                        <Zap className='w-5 h-5 text-cyan-400' />
                      </div>
                      <span className='font-bold text-cyan-300'>
                        Unlimited Neural Credits
                      </span>
                    </div>
                    <p className='text-sm text-gray-400'>
                      Infinite AI generation power
                    </p>
                  </div>

                  <div className='cyber-glass-purple p-6 rounded-2xl border border-purple-500/30'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-purple-500/20 rounded-lg'>
                        <Layers className='w-5 h-5 text-purple-400' />
                      </div>
                      <span className='font-bold text-purple-300'>
                        Canvas AI Editor
                      </span>
                    </div>
                    <p className='text-sm text-gray-400'>
                      Professional editing suite
                    </p>
                  </div>

                  <div className='cyber-glass p-6 rounded-2xl border border-pink-500/30'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-pink-500/20 rounded-lg'>
                        <Mic className='w-5 h-5 text-pink-400' />
                      </div>
                      <span className='font-bold text-pink-300'>
                        Advanced Voice Gen
                      </span>
                    </div>
                    <p className='text-sm text-gray-400'>
                      Premium voice synthesis
                    </p>
                  </div>

                  <div className='cyber-glass-cyan p-6 rounded-2xl border border-yellow-500/30'>
                    <div className='flex items-center space-x-3 mb-3'>
                      <div className='p-2 bg-yellow-500/20 rounded-lg'>
                        <Headphones className='w-5 h-5 text-yellow-400' />
                      </div>
                      <span className='font-bold text-yellow-300'>
                        Priority AI Support
                      </span>
                    </div>
                    <p className='text-sm text-gray-400'>
                      Dedicated neural assistance
                    </p>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className='flex flex-col sm:flex-row gap-4 justify-center'>
                  <button
                    onClick={() => {
                      setShowPremiumModal(false);
                      handleUpgrade();
                    }}
                    className='flex-1 cyber-glass-purple px-8 py-4 rounded-2xl border border-purple-500/50 hover:border-purple-400 transition-all duration-300 cyber-glow-purple hover:scale-105 group'
                  >
                    <div className='flex items-center justify-center space-x-3'>
                      <Crown className='w-5 h-5 text-yellow-400 group-hover:rotate-12 transition-transform duration-300' />
                      <span className='font-bold text-lg text-white'>
                        Upgrade Now
                      </span>
                      <ChevronRight className='w-5 h-5 text-purple-300 group-hover:translate-x-1 transition-transform duration-300' />
                    </div>
                  </button>
                  <button
                    onClick={() => setShowPremiumModal(false)}
                    className='flex-1 cyber-glass px-8 py-4 rounded-2xl border border-gray-600 hover:border-gray-500 transition-all duration-300'
                  >
                    <span className='font-medium text-gray-300 hover:text-white transition-colors'>
                      Continue with Free
                    </span>
                  </button>
                </div>

                {/* Disclaimer */}
                <p className='text-xs text-gray-500'>
                  Experience the future of AI-powered creativity
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Command System */}
      {voiceEnabled && (
        <VoiceCommandSystem
          isActive={voiceEnabled}
          onToggle={() => setVoiceEnabled(!voiceEnabled)}
          userLevel='free'
        />
      )}

      {/* Modal Panels */}
      {activePanel === 'ai-features' && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='relative w-full max-w-4xl max-h-[90vh] overflow-auto'>
            <AIImageGenerationPanel
              onClose={handlePanelClose}
              isVisible={true}
              userTokens={userData.tokens}
              userTier='free'
              onTokensUpdate={newTokens =>
                setUserData(prev => ({ ...prev, tokens: newTokens }))
              }
            />
          </div>
        </div>
      )}

      {activePanel === 'library' && (
        <MyLibraryPanel
          onClose={handlePanelClose}
          isVisible={true}
          userTier='free'
        />
      )}

      {activePanel === 'canvas' && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='relative w-full max-w-6xl max-h-[90vh] overflow-auto'>
            <CanvasAIEditor onClose={handlePanelClose} isVisible={true} />
          </div>
        </div>
      )}

      {activePanel === 'settings' && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='relative w-full max-w-2xl max-h-[90vh] overflow-auto'>
            <UserSettingsPanel onClose={handlePanelClose} isVisible={true} />
          </div>
        </div>
      )}

      {activePanel === 'invite' && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='relative w-full max-w-2xl max-h-[90vh] overflow-auto'>
            <InviteTokenPanel
              onClose={handlePanelClose}
              isVisible={true}
              userTokens={userData.tokens}
            />
          </div>
        </div>
      )}

      {activePanel === 'shop' && (
        <div className='fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4'>
          <div className='relative w-full max-w-4xl max-h-[90vh] overflow-auto'>
            <ShopPanel
              onClose={handlePanelClose}
              isVisible={true}
              userTokens={userData.tokens}
              onUpgrade={handleUpgrade}
            />
          </div>
        </div>
      )}

      {showSubscription && (
        <SubscriptionPopup
          onClose={() => setShowSubscription(false)}
          isVisible={true}
          onSubscribe={() => {
            setShowSubscription(false);
            router.push('/dashboard/premium');
          }}
        />
      )}
    </div>
  );
};

export default FreeDashboard;
