'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from '@/styles/dashboard.module.css';
import {
  User,
  Settings,
  Music,
  Download,
  Share2,
  Play,
  Lock,
  Zap,
  Copy,
  MessageCircle,
  Send,
  Star,
  Coins,
  Crown,
  Gift,
  Users,
  Bell,
  Globe,
  Palette,
  Volume2,
  Image,
  Video,
  Mic,
  UserCircle,
  ShoppingBag,
  CreditCard,
  Calendar,
  X,
  Layers,
  Terminal,
  Sparkles,
  Brain,
} from 'lucide-react';

// Import dashboard components
import UserSettingsPanel from '@/components/dashboard/UserSettingsPanel';
import StudioLibrary from '@/components/dashboard/StudioLibrary';
import MiniAIFeatures from '@/components/dashboard/MiniAIFeatures';
import InviteTokenPanel from '@/components/dashboard/InviteTokenPanel';
import ShopPanel from '@/components/dashboard/ShopPanel';
import SubscriptionPopup from '@/components/dashboard/SubscriptionPopup';

// Import new dashboard components
import CanvasAIEditor from '@/components/dashboard/CanvasAIEditor';
import NeuralTokenSystem from '@/components/dashboard/NeuralTokenSystem';
import LoginSystem from '@/components/dashboard/LoginSystem';
import VoiceCommandSystem from '@/components/dashboard/VoiceCommandSystem';
import RisingParticlesBackground from '@/components/dashboard/RisingParticlesBackground';
import SeraphineAvatar from '@/components/dashboard/SeraphineAvatar';
import CyberpunkAudioSystem from '@/components/CyberpunkAudioSystem';
import AIImageGenerationPanel from '@/components/dashboard/AIImageGenerationPanel';
import SeraphineStyleLibrary from '@/components/dashboard/SeraphineStyleLibrary';
import NeuralPromptArchive from '@/components/dashboard/NeuralPromptArchive';

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
}

function SearchParamsHandler({
  onShowSubscription,
}: {
  onShowSubscription: (show: boolean) => void;
}) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams?.get('showSubscription') === 'true') {
      onShowSubscription(true);
    }
  }, [searchParams, onShowSubscription]);

  return null;
}

export default function FreeDashboard(): JSX.Element {
  const router = useRouter();
  const [showSubscription, setShowSubscription] = useState(false);
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const [voiceControlActive, setVoiceControlActive] = useState(false);
  const [beatData, setBeatData] = useState<number[]>([]);
  const [seraphineVisible, setSeraphineVisible] = useState(true);
  const [seraphineMood, setSeraphineMood] = useState<
    'idle' | 'active' | 'thinking' | 'happy' | 'excited' | 'helping'
  >('idle');
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [audioVolume, setAudioVolume] = useState(0.3);
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
  });

  const handlePanelOpen = (panelName: string) => {
    setActivePanel(panelName);
  };

  const handlePanelClose = () => {
    setActivePanel(null);
  };

  const handleUpgrade = () => {
    setShowSubscription(true);
  };

  const handleVoiceCommand = (command: string, confidence: number) => {
    console.log('Voice command:', command, 'Confidence:', confidence);

    setSeraphineMood('helping');
    setTimeout(() => setSeraphineMood('active'), 2000);

    switch (command) {
      case 'activate':
        setSeraphineMood('excited');
        break;
      case 'generate_image':
        handlePanelOpen('ai-features');
        setSeraphineMood('happy');
        break;
      case 'open_canvas':
        handlePanelOpen('canvas');
        break;
      case 'show_library':
        handlePanelOpen('library');
        break;
      case 'open_settings':
        handlePanelOpen('settings');
        break;
      case 'upgrade_account':
        handleUpgrade();
        setSeraphineMood('excited');
        break;
      case 'show_profile':
        handlePanelOpen('settings');
        break;
      case 'show_help':
        // Help is handled by the voice component itself
        break;
      default:
        console.log('Unknown command:', command);
    }
  };

  const handleSeraphineCommand = (command: string) => {
    setSeraphineMood('thinking');
    setTimeout(() => handleVoiceCommand(command, 1.0), 500);
  };

  const handleTokenPurchase = (packageId: string) => {
    console.log('Token purchase:', packageId);
    // Implement token purchase logic
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Rising Particles Background */}
      <RisingParticlesBackground
        intensity='medium'
        animated={true}
        musicSync={true}
        beatData={beatData}
      />

      {/* Animated Background */}
      <div className={styles.animatedBackground}>
        <div className={styles.neuralGrid}></div>
        <div className={styles.particleField}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`${styles.particle} ${styles[`particle${(i % 4) + 1}`]}`}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className={styles.dashboardHeader}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <Zap className={styles.logoIcon} />
            <span className={styles.logoText}>Seraphine V1.5</span>
            <span className={styles.freeBadge}>FREE</span>
          </div>
        </div>

        <div className={styles.headerCenter}>
          <div className={styles.tokenDisplay}>
            <Coins className={styles.tokenIcon} />
            <span className={styles.tokenCount}>{userData.tokens}</span>
            <span className={styles.tokenLabel}>Tokens</span>
          </div>
        </div>

        <div className={styles.headerRight}>
          <button
            onClick={() => handlePanelOpen('settings')}
            className={styles.userButton}
          >
            <img
              src={userData.avatar}
              alt='Avatar'
              className={styles.userAvatar}
            />
            <span className={styles.userName}>{userData.name}</span>
            <Settings className={styles.settingsIcon} />
          </button>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <main className={styles.dashboardMain}>
        {/* Quick Actions */}
        <section className={styles.quickActions}>
          <h2 className={styles.sectionTitle}>
            <Zap className={styles.sectionIcon} />
            Quick Actions
          </h2>
          <div className={styles.actionGrid}>
            <button
              onClick={() => handlePanelOpen('ai-features')}
              className={`${styles.actionCard} ${styles.aiCard}`}
              aria-label='Open AI Studio to generate content'
            >
              <div className={styles.cardIcon} aria-hidden='true'>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image />
              </div>
              <span className={styles.cardTitle}>AI Studio</span>
              <span className={styles.cardDesc}>Generate content</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('library')}
              className={`${styles.actionCard} ${styles.libraryCard}`}
            >
              <UserCircle className={styles.cardIcon} />
              <span className={styles.cardTitle}>My Library</span>
              <span className={styles.cardDesc}>Saved creations</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('invite')}
              className={`${styles.actionCard} ${styles.inviteCard}`}
            >
              <Gift className={styles.cardIcon} />
              <span className={styles.cardTitle}>Earn Tokens</span>
              <span className={styles.cardDesc}>Invite friends</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('shop')}
              className={`${styles.actionCard} ${styles.shopCard}`}
            >
              <Crown className={styles.cardIcon} />
              <span className={styles.cardTitle}>Premium</span>
              <span className={styles.cardDesc}>Unlock features</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('canvas')}
              className={`${styles.actionCard} ${styles.canvasCard}`}
              aria-label='Open Neural Canvas Editor (Premium)'
            >
              <Layers className={styles.cardIcon} />
              <span className={styles.cardTitle}>Canvas Editor</span>
              <span className={styles.cardDesc}>AI image editing</span>
              <Lock className='absolute top-2 right-2 w-4 h-4 text-yellow-400' />
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('tokens')}
              className={`${styles.actionCard} ${styles.tokensCard}`}
              aria-label='Open Neural Token System'
            >
              <Coins className={styles.cardIcon} />
              <span className={styles.cardTitle}>Token Shop</span>
              <span className={styles.cardDesc}>Buy more tokens</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('ai-generator')}
              className={`${styles.actionCard} ${styles.aiGeneratorCard}`}
              aria-label='Open AI Image Generation Panel'
            >
              <Sparkles className={styles.cardIcon} />
              <span className={styles.cardTitle}>AI Generator</span>
              <span className={styles.cardDesc}>Create AI images</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('style-library')}
              className={`${styles.actionCard} ${styles.styleLibraryCard}`}
              aria-label='Open Seraphine Style Library'
            >
              <Palette className={styles.cardIcon} />
              <span className={styles.cardTitle}>Style Library</span>
              <span className={styles.cardDesc}>AI models & styles</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('prompt-archive')}
              className={`${styles.actionCard} ${styles.promptArchiveCard}`}
              aria-label='Open Neural Prompt Archive'
            >
              <Terminal className={styles.cardIcon} />
              <span className={styles.cardTitle}>Prompt Archive</span>
              <span className={styles.cardDesc}>Saved prompts</span>
              <div className={styles.cardGlow}></div>
            </button>

            <button
              onClick={() => handlePanelOpen('login')}
              className={`${styles.actionCard} ${styles.loginCard}`}
              aria-label='Open Login System'
            >
              <Brain className={styles.cardIcon} />
              <span className={styles.cardTitle}>Neural Login</span>
              <span className={styles.cardDesc}>Multi-tier access</span>
              <div className={styles.cardGlow}></div>
            </button>
          </div>
        </section>

        {/* Feature Overview */}
        <section className={styles.featureOverview}>
          <h2 className={styles.sectionTitle}>
            <Star className={styles.sectionIcon} />
            Daily Limits
          </h2>
          <div className={styles.limitsGrid}>
            <div className={styles.limitCard}>
              <div className={styles.limitIcon} aria-hidden='true'>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image />
              </div>
              <div className={styles.limitInfo}>
                <span className={styles.limitTitle}>AI Images</span>
                <div className={styles.limitBar}>
                  <div
                    className={`${styles.limitProgress} ${styles.imageProgress} ${styles.width66}`}
                  ></div>
                </div>
                <span className={styles.limitText}>2/3 used</span>
              </div>
            </div>

            <div className={styles.limitCard}>
              <Mic className={styles.limitIcon} />
              <div className={styles.limitInfo}>
                <span className={styles.limitTitle}>Voice Gen</span>
                <div className={styles.limitBar}>
                  <div
                    className={`${styles.limitProgress} ${styles.voiceProgress} ${styles.width40}`}
                  ></div>
                </div>
                <span className={styles.limitText}>2/5 used</span>
              </div>
            </div>

            <div className={styles.limitCard}>
              <Video className={styles.limitIcon} />
              <div className={styles.limitInfo}>
                <span className={styles.limitTitle}>Video Clips</span>
                <div className={styles.limitBar}>
                  <div
                    className={`${styles.limitProgress} ${styles.videoProgress} ${styles.width100}`}
                  ></div>
                </div>
                <span className={styles.limitText}>1/1 used</span>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Preview */}
        <section className={styles.premiumPreview}>
          <div className={styles.premiumCard}>
            <div className={styles.premiumHeader}>
              <Crown className={styles.premiumIcon} />
              <div className={styles.premiumText}>
                <h3 className={styles.premiumTitle}>Upgrade to Premium</h3>
                <p className={styles.premiumDesc}>
                  Unlock unlimited AI generation, advanced features, and
                  priority support
                </p>
              </div>
            </div>
            <button onClick={handleUpgrade} className={styles.upgradeButton}>
              <Zap className={styles.upgradeIcon} />
              Upgrade Now
              <div className={styles.upgradeGlow}></div>
            </button>
          </div>
        </section>
      </main>

      {/* Modals/Panels */}
      {activePanel === 'settings' && (
        <UserSettingsPanel isVisible={true} onClose={handlePanelClose} />
      )}

      {activePanel === 'library' && (
        <StudioLibrary isVisible={true} onClose={handlePanelClose} />
      )}

      {activePanel === 'ai-features' && (
        <MiniAIFeatures
          isVisible={true}
          onClose={handlePanelClose}
          onUpgrade={handleUpgrade}
        />
      )}

      {activePanel === 'invite' && (
        <InviteTokenPanel
          isVisible={true}
          onClose={handlePanelClose}
          userTokens={userData.tokens}
        />
      )}

      {activePanel === 'shop' && (
        <ShopPanel
          isVisible={true}
          onClose={handlePanelClose}
          userTokens={userData.tokens}
          onUpgrade={handleUpgrade}
        />
      )}

      {activePanel === 'canvas' && (
        <CanvasAIEditor
          isVisible={true}
          onClose={handlePanelClose}
          onSave={canvas => {
            console.log('Canvas saved:', canvas);
            // Implement save logic
          }}
        />
      )}

      {activePanel === 'tokens' && (
        <NeuralTokenSystem
          isVisible={true}
          onClose={handlePanelClose}
          currentTokens={userData.tokens}
          onPurchase={handleTokenPurchase}
          userLevel='free'
        />
      )}

      {activePanel === 'login' && (
        <LoginSystem
          isVisible={true}
          onClose={handlePanelClose}
          onLoginSuccess={userType => {
            console.log('Login success:', userType);
            handlePanelClose();
          }}
        />
      )}

      {activePanel === 'ai-generator' && (
        <AIImageGenerationPanel
          isVisible={true}
          onClose={handlePanelClose}
          userTokens={userData.tokens}
          onTokensUpdate={(newTokens: number) => {
            setUserData(prev => ({ ...prev, tokens: newTokens }));
          }}
          userTier='free'
        />
      )}

      {activePanel === 'style-library' && (
        <SeraphineStyleLibrary
          isVisible={true}
          onClose={handlePanelClose}
          userTier='free'
          onSelectStyle={style => {
            console.log('Selected style:', style);
            handlePanelClose();
          }}
        />
      )}

      {activePanel === 'prompt-archive' && (
        <NeuralPromptArchive
          isVisible={true}
          onClose={handlePanelClose}
          onRunPrompt={prompt => {
            console.log('Running prompt:', prompt);
            // Route to AI generator with pre-filled prompt
            handlePanelClose();
            setTimeout(() => setActivePanel('ai-generator'), 300);
          }}
        />
      )}

      {showSubscription && (
        <SubscriptionPopup
          isVisible={true}
          onClose={() => setShowSubscription(false)}
          onSubscribe={plan => {
            console.log('Subscribing to:', plan);
            router.push('/dashboard/premium');
          }}
        />
      )}

      <Suspense fallback={null}>
        <SearchParamsHandler onShowSubscription={setShowSubscription} />
      </Suspense>

      {/* Voice Command System */}
      <VoiceCommandSystem
        isActive={voiceControlActive}
        onToggle={() => setVoiceControlActive(!voiceControlActive)}
        onCommand={handleVoiceCommand}
        userLevel='free'
      />

      {/* Seraphine Avatar */}
      <SeraphineAvatar
        isVisible={seraphineVisible}
        mood={seraphineMood}
        voiceEnabled={true}
        interactionMode='assistant'
        onCommand={handleSeraphineCommand}
        onToggleChat={() =>
          setSeraphineMood(seraphineMood === 'idle' ? 'active' : 'idle')
        }
        beatSync={true}
        beatData={beatData}
      />

      {/* Cyberpunk Audio System */}
      <CyberpunkAudioSystem
        isEnabled={audioEnabled}
        volume={audioVolume}
        onVolumeChange={setAudioVolume}
        onToggle={setAudioEnabled}
        beatSyncCallback={setBeatData}
      />
    </div>
  );
}
