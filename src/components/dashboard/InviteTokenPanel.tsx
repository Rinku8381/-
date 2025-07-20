'use client';

import React, { useState } from 'react';
import {
  Users,
  Copy,
  Share2,
  MessageCircle,
  Send,
  Gift,
  Coins,
  ExternalLink,
  Check,
  Trophy,
  Target,
  Zap,
  Crown,
  UserPlus,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface InviteTokenPanelProps {
  isVisible: boolean;
  onClose: () => void;
  userTokens: number;
}

interface ReferralStats {
  totalReferrals: number;
  activeReferrals: number;
  totalTokensEarned: number;
  pendingTokens: number;
  thisMonthReferrals: number;
}

interface RecentReferral {
  id: string;
  username: string;
  joinDate: string;
  status: 'joined' | 'subscribed';
  tokensEarned: number;
}

export default function InviteTokenPanel({
  isVisible,
  onClose,
  userTokens,
}: InviteTokenPanelProps): JSX.Element | null {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [shareMethod, setShareMethod] = useState<'link' | 'code'>('link');

  // Mock user data
  const userId = 'neural_user_2025';
  const referralLink = `https://seraphine.app/invite/${userId}`;
  const referralCode = userId.toUpperCase();

  const [referralStats] = useState<ReferralStats>({
    totalReferrals: 12,
    activeReferrals: 8,
    totalTokensEarned: 240,
    pendingTokens: 60,
    thisMonthReferrals: 3,
  });

  const [recentReferrals] = useState<RecentReferral[]>([
    {
      id: '1',
      username: 'CyberFriend01',
      joinDate: '2025-07-18',
      status: 'subscribed',
      tokensEarned: 120,
    },
    {
      id: '2',
      username: 'AIEnthusiast',
      joinDate: '2025-07-16',
      status: 'joined',
      tokensEarned: 20,
    },
    {
      id: '3',
      username: 'TechUser99',
      joinDate: '2025-07-15',
      status: 'joined',
      tokensEarned: 20,
    },
  ]);

  if (!isVisible) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const shareToWhatsApp = () => {
    const message = `Join me on Seraphine AI! Use my referral link: ${referralLink} - We both get 20 free tokens!`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const shareToTelegram = () => {
    const message = `Join me on Seraphine AI! Use my referral link: ${referralLink} - We both get 20 free tokens!`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
    window.open(telegramUrl, '_blank');
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={`${styles.modalContent} ${styles.inviteModal}`}
        onClick={e => e.stopPropagation()}
      >
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            <Users size={24} />
            Invite & Earn Tokens
          </h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            title='Close'
          >
            ×
          </button>
        </div>

        {/* Stats Overview */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Users size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {referralStats.totalReferrals}
              </span>
              <span className={styles.statLabel}>Total Referrals</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Coins size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {referralStats.totalTokensEarned}
              </span>
              <span className={styles.statLabel}>Tokens Earned</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Trophy size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {referralStats.thisMonthReferrals}
              </span>
              <span className={styles.statLabel}>This Month</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <Gift size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statValue}>
                {referralStats.pendingTokens}
              </span>
              <span className={styles.statLabel}>Pending</span>
            </div>
          </div>
        </div>

        {/* Referral Methods */}
        <div className={styles.referralMethods}>
          <div className={styles.methodTabs}>
            <button
              className={`${styles.methodTab} ${shareMethod === 'link' ? styles.active : ''}`}
              onClick={() => setShareMethod('link')}
            >
              <ExternalLink size={16} />
              Share Link
            </button>
            <button
              className={`${styles.methodTab} ${shareMethod === 'code' ? styles.active : ''}`}
              onClick={() => setShareMethod('code')}
            >
              <Target size={16} />
              Referral Code
            </button>
          </div>

          {shareMethod === 'link' && (
            <div className={styles.shareSection}>
              <div className={styles.shareInput}>
                <input
                  type='text'
                  value={referralLink}
                  readOnly
                  className={styles.linkInput}
                  title='Referral link'
                />
                <button
                  className={`${styles.copyButton} ${copiedLink ? styles.copied : ''}`}
                  onClick={handleCopyLink}
                  title='Copy link'
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  {copiedLink ? 'Copied!' : 'Copy'}
                </button>
              </div>

              <div className={styles.socialShare}>
                <button
                  className={styles.whatsappButton}
                  onClick={shareToWhatsApp}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
                <button
                  className={styles.telegramButton}
                  onClick={shareToTelegram}
                >
                  <Send size={16} />
                  Telegram
                </button>
                <button className={styles.shareButton} onClick={handleCopyLink}>
                  <Share2 size={16} />
                  More Options
                </button>
              </div>
            </div>
          )}

          {shareMethod === 'code' && (
            <div className={styles.codeSection}>
              <div className={styles.referralCode}>
                <span className={styles.codeDisplay}>{referralCode}</span>
                <button
                  className={`${styles.copyButton} ${copiedCode ? styles.copied : ''}`}
                  onClick={handleCopyCode}
                  title='Copy code'
                >
                  {copiedCode ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              <p className={styles.codeInstructions}>
                Share this code with friends. They can enter it during signup.
              </p>
            </div>
          )}
        </div>

        {/* Reward Structure */}
        <div className={styles.rewardStructure}>
          <h3>Reward Structure</h3>
          <div className={styles.rewardTiers}>
            <div className={styles.rewardTier}>
              <div className={styles.tierIcon}>
                <UserPlus size={20} />
              </div>
              <div className={styles.tierInfo}>
                <span className={styles.tierTitle}>Friend Joins</span>
                <span className={styles.tierReward}>+20 tokens each</span>
              </div>
            </div>

            <div className={styles.rewardTier}>
              <div className={styles.tierIcon}>
                <Crown size={20} />
              </div>
              <div className={styles.tierInfo}>
                <span className={styles.tierTitle}>Friend Subscribes</span>
                <span className={styles.tierReward}>+100 bonus tokens</span>
              </div>
            </div>

            <div className={styles.rewardTier}>
              <div className={styles.tierIcon}>
                <Zap size={20} />
              </div>
              <div className={styles.tierInfo}>
                <span className={styles.tierTitle}>Monthly Active</span>
                <span className={styles.tierReward}>+50 bonus tokens</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Referrals */}
        <div className={styles.recentReferrals}>
          <h3>Recent Referrals</h3>
          <div className={styles.referralList}>
            {recentReferrals.map(referral => (
              <div key={referral.id} className={styles.referralItem}>
                <div className={styles.referralUser}>
                  <div className={styles.userAvatar}>
                    <Users size={16} />
                  </div>
                  <div className={styles.userInfo}>
                    <span className={styles.username}>{referral.username}</span>
                    <span className={styles.joinDate}>{referral.joinDate}</span>
                  </div>
                </div>
                <div className={styles.referralStatus}>
                  <span
                    className={`${styles.statusBadge} ${styles[referral.status]}`}
                  >
                    {referral.status === 'subscribed' ? (
                      <Crown size={12} />
                    ) : (
                      <UserPlus size={12} />
                    )}
                    {referral.status}
                  </span>
                  <span className={styles.tokensEarned}>
                    +{referral.tokensEarned} tokens
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <Gift size={32} />
            <h3>Start Earning Today!</h3>
            <p>
              Share your referral link and earn tokens for every friend who
              joins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
