'use client';

import React, { useState } from 'react';
import {
  User,
  Settings,
  Bell,
  Globe,
  Palette,
  Volume2,
  Shield,
  Save,
  RefreshCw,
  Moon,
  Sun,
  Eye,
  EyeOff,
} from 'lucide-react';
import styles from '@/styles/dashboard.module.css';

interface UserSettingsPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

interface UserSettings {
  username: string;
  email: string;
  notifications: {
    email: boolean;
    push: boolean;
    voice: boolean;
  };
  preferences: {
    theme: 'dark' | 'cyberpunk' | 'neon';
    language: string;
    volume: number;
    privacy: 'public' | 'friends' | 'private';
  };
  security: {
    twoFactor: boolean;
    loginAlerts: boolean;
  };
}

export default function UserSettingsPanel({
  isVisible,
  onClose,
}: UserSettingsPanelProps): JSX.Element | null {
  const [settings, setSettings] = useState<UserSettings>({
    username: 'NeuralUser',
    email: 'user@seraphine.ai',
    notifications: {
      email: true,
      push: true,
      voice: false,
    },
    preferences: {
      theme: 'cyberpunk',
      language: 'en',
      volume: 75,
      privacy: 'friends',
    },
    security: {
      twoFactor: false,
      loginAlerts: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  if (!isVisible) return null;

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    // Show success message or handle save
  };

  const updateSetting = (path: string, value: any) => {
    setSettings(prev => {
      const keys = path.split('.');
      const newSettings = { ...prev };
      let current: any = newSettings;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (key) {
          current[key] = { ...current[key] };
          current = current[key];
        }
      }

      const lastKey = keys[keys.length - 1];
      if (lastKey) {
        current[lastKey] = value;
      }
      return newSettings;
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'preferences', label: 'Preferences', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>User Settings</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label='Close settings'
            title='Close settings'
          >
            <Settings size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className={styles.tabNavigation}>
          {tabs.map(tab => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.activeTab : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComponent size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className={styles.tabContent}>
          {activeTab === 'profile' && (
            <div className={styles.settingsSection}>
              <h3>Profile Information</h3>
              <div className={styles.formGroup}>
                <label htmlFor='username'>Username</label>
                <input
                  id='username'
                  type='text'
                  value={settings.username}
                  onChange={e => updateSetting('username', e.target.value)}
                  className={styles.input}
                  placeholder='Enter your username'
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='email'>Email</label>
                <input
                  id='email'
                  type='email'
                  value={settings.email}
                  onChange={e => updateSetting('email', e.target.value)}
                  className={styles.input}
                  placeholder='Enter your email'
                />
              </div>
              <div className={styles.formGroup}>
                <label>Avatar</label>
                <div className={styles.avatarSelector}>
                  <div className={styles.currentAvatar}>
                    <User size={48} />
                  </div>
                  <button className={styles.changeAvatarBtn}>
                    <RefreshCw size={16} />
                    Change Avatar
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className={styles.settingsSection}>
              <h3>Notification Settings</h3>
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <span>Email Notifications</span>
                  <input
                    type='checkbox'
                    checked={settings.notifications.email}
                    onChange={e =>
                      updateSetting('notifications.email', e.target.checked)
                    }
                    className={styles.toggle}
                  />
                </label>
                <label className={styles.toggleLabel}>
                  <span>Push Notifications</span>
                  <input
                    type='checkbox'
                    checked={settings.notifications.push}
                    onChange={e =>
                      updateSetting('notifications.push', e.target.checked)
                    }
                    className={styles.toggle}
                  />
                </label>
                <label className={styles.toggleLabel}>
                  <span>Voice Notifications</span>
                  <input
                    type='checkbox'
                    checked={settings.notifications.voice}
                    onChange={e =>
                      updateSetting('notifications.voice', e.target.checked)
                    }
                    className={styles.toggle}
                  />
                </label>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className={styles.settingsSection}>
              <h3>Preferences</h3>
              <div className={styles.formGroup}>
                <label htmlFor='theme-select'>Theme</label>
                <select
                  id='theme-select'
                  value={settings.preferences.theme}
                  onChange={e =>
                    updateSetting('preferences.theme', e.target.value)
                  }
                  className={styles.select}
                  aria-label='Select theme'
                >
                  <option value='dark'>Dark</option>
                  <option value='cyberpunk'>Cyberpunk</option>
                  <option value='neon'>Neon</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='language-select'>Language</label>
                <select
                  id='language-select'
                  value={settings.preferences.language}
                  onChange={e =>
                    updateSetting('preferences.language', e.target.value)
                  }
                  className={styles.select}
                  aria-label='Select language'
                >
                  <option value='en'>English</option>
                  <option value='es'>Español</option>
                  <option value='fr'>Français</option>
                  <option value='de'>Deutsch</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='volume-slider'>
                  Volume: {settings.preferences.volume}%
                </label>
                <input
                  id='volume-slider'
                  type='range'
                  min='0'
                  max='100'
                  value={settings.preferences.volume}
                  onChange={e =>
                    updateSetting(
                      'preferences.volume',
                      parseInt(e.target.value)
                    )
                  }
                  className={styles.slider}
                  aria-label={`Volume: ${settings.preferences.volume}%`}
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor='privacy-select'>Privacy</label>
                <select
                  id='privacy-select'
                  value={settings.preferences.privacy}
                  onChange={e =>
                    updateSetting('preferences.privacy', e.target.value)
                  }
                  className={styles.select}
                  aria-label='Select privacy setting'
                >
                  <option value='public'>Public</option>
                  <option value='friends'>Friends Only</option>
                  <option value='private'>Private</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className={styles.settingsSection}>
              <h3>Security Settings</h3>
              <div className={styles.toggleGroup}>
                <label className={styles.toggleLabel}>
                  <span>Two-Factor Authentication</span>
                  <input
                    type='checkbox'
                    checked={settings.security.twoFactor}
                    onChange={e =>
                      updateSetting('security.twoFactor', e.target.checked)
                    }
                    className={styles.toggle}
                  />
                </label>
                <label className={styles.toggleLabel}>
                  <span>Login Alerts</span>
                  <input
                    type='checkbox'
                    checked={settings.security.loginAlerts}
                    onChange={e =>
                      updateSetting('security.loginAlerts', e.target.checked)
                    }
                    className={styles.toggle}
                  />
                </label>
              </div>
              <div className={styles.formGroup}>
                <button className={styles.securityButton}>
                  <Shield size={16} />
                  Change Password
                </button>
                <button className={styles.securityButton}>
                  <Eye size={16} />
                  View Login History
                </button>
              </div>
            </div>
          )}
        </div>

        <div className={styles.modalActions}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button
            className={styles.saveButton}
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <RefreshCw size={16} className={styles.spinning} />
            ) : (
              <Save size={16} />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
