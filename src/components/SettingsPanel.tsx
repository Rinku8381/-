'use client';

import { useState } from 'react';
import styles from '../styles/SettingsPanel.module.css';

interface SettingsPanelProps {
  onClose?: () => void;
}

export default function SettingsPanel({ onClose }: SettingsPanelProps) {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    // General Settings
    language: 'en',
    theme: 'auto',
    notifications: true,
    soundEffects: true,

    // Security Settings
    biometricAuth: false,
    autoLock: true,
    lockTimeout: 5, // minutes
    twoFactor: false,

    // Privacy Settings
    dataCollection: false,
    analytics: false,
    crashReports: true,

    // Smart Home Settings
    autoDiscovery: true,
    cloudSync: true,
    energyMonitoring: true,
    guestAccess: false,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'security', name: 'Security', icon: '🔒' },
    { id: 'privacy', name: 'Privacy', icon: '🛡️' },
    { id: 'smart-home', name: 'Smart Home', icon: '🏠' },
    { id: 'about', name: 'About', icon: 'ℹ️' },
  ];

  const renderGeneralSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>General Settings</h3>

      <div className={styles.settingItem}>
        <label className={styles.settingLabel} htmlFor='language-select'>
          Language
        </label>
        <select
          id='language-select'
          value={settings.language}
          onChange={e => updateSetting('language', e.target.value)}
          className={styles.settingSelect}
          title='Select language'
        >
          <option value='en'>English</option>
          <option value='id'>Bahasa Indonesia</option>
          <option value='es'>Español</option>
          <option value='fr'>Français</option>
        </select>
      </div>

      <div className={styles.settingItem}>
        <label className={styles.settingLabel} htmlFor='theme-select'>
          Theme
        </label>
        <select
          id='theme-select'
          value={settings.theme}
          onChange={e => updateSetting('theme', e.target.value)}
          className={styles.settingSelect}
          title='Select theme'
        >
          <option value='light'>Light</option>
          <option value='dark'>Dark</option>
          <option value='auto'>Auto</option>
        </select>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Push Notifications</label>
          <button
            className={`${styles.toggleSwitch} ${settings.notifications ? styles.active : ''}`}
            onClick={() =>
              updateSetting('notifications', !settings.notifications)
            }
            aria-label={`Toggle notifications ${settings.notifications ? 'off' : 'on'}`}
            title={`Turn notifications ${settings.notifications ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Sound Effects</label>
          <button
            className={`${styles.toggleSwitch} ${settings.soundEffects ? styles.active : ''}`}
            onClick={() =>
              updateSetting('soundEffects', !settings.soundEffects)
            }
            aria-label={`Toggle sound effects ${settings.soundEffects ? 'off' : 'on'}`}
            title={`Turn sound effects ${settings.soundEffects ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Security Settings</h3>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>
            Biometric Authentication
          </label>
          <button
            className={`${styles.toggleSwitch} ${settings.biometricAuth ? styles.active : ''}`}
            onClick={() =>
              updateSetting('biometricAuth', !settings.biometricAuth)
            }
            aria-label={`Toggle biometric authentication ${settings.biometricAuth ? 'off' : 'on'}`}
            title={`Turn biometric authentication ${settings.biometricAuth ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
        <p className={styles.settingDescription}>
          Use fingerprint or face recognition to unlock the app
        </p>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Auto Lock</label>
          <button
            className={`${styles.toggleSwitch} ${settings.autoLock ? styles.active : ''}`}
            onClick={() => updateSetting('autoLock', !settings.autoLock)}
            aria-label={`Toggle auto lock ${settings.autoLock ? 'off' : 'on'}`}
            title={`Turn auto lock ${settings.autoLock ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>

      {settings.autoLock && (
        <div className={styles.settingItem}>
          <label className={styles.settingLabel} htmlFor='lock-timeout-select'>
            Lock Timeout
          </label>
          <select
            id='lock-timeout-select'
            value={settings.lockTimeout}
            onChange={e =>
              updateSetting('lockTimeout', parseInt(e.target.value))
            }
            className={styles.settingSelect}
            title='Select lock timeout duration'
          >
            <option value={1}>1 minute</option>
            <option value={5}>5 minutes</option>
            <option value={10}>10 minutes</option>
            <option value={30}>30 minutes</option>
          </select>
        </div>
      )}

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>
            Two-Factor Authentication
          </label>
          <button
            className={`${styles.toggleSwitch} ${settings.twoFactor ? styles.active : ''}`}
            onClick={() => updateSetting('twoFactor', !settings.twoFactor)}
            aria-label={`Toggle two-factor authentication ${settings.twoFactor ? 'off' : 'on'}`}
            title={`Turn two-factor authentication ${settings.twoFactor ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Privacy Settings</h3>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Data Collection</label>
          <button
            className={`${styles.toggleSwitch} ${settings.dataCollection ? styles.active : ''}`}
            onClick={() =>
              updateSetting('dataCollection', !settings.dataCollection)
            }
            aria-label={`Toggle data collection ${settings.dataCollection ? 'off' : 'on'}`}
            title={`Turn data collection ${settings.dataCollection ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
        <p className={styles.settingDescription}>
          Allow collection of usage data to improve the app
        </p>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Analytics</label>
          <button
            className={`${styles.toggleSwitch} ${settings.analytics ? styles.active : ''}`}
            onClick={() => updateSetting('analytics', !settings.analytics)}
            aria-label={`Toggle analytics ${settings.analytics ? 'off' : 'on'}`}
            title={`Turn analytics ${settings.analytics ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Crash Reports</label>
          <button
            className={`${styles.toggleSwitch} ${settings.crashReports ? styles.active : ''}`}
            onClick={() =>
              updateSetting('crashReports', !settings.crashReports)
            }
            aria-label={`Toggle crash reports ${settings.crashReports ? 'off' : 'on'}`}
            title={`Turn crash reports ${settings.crashReports ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
        <p className={styles.settingDescription}>
          Automatically send crash reports to help fix issues
        </p>
      </div>
    </div>
  );

  const renderSmartHomeSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>Smart Home Settings</h3>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Auto Discovery</label>
          <button
            className={`${styles.toggleSwitch} ${settings.autoDiscovery ? styles.active : ''}`}
            onClick={() =>
              updateSetting('autoDiscovery', !settings.autoDiscovery)
            }
            aria-label={`Toggle auto discovery ${settings.autoDiscovery ? 'off' : 'on'}`}
            title={`Turn auto discovery ${settings.autoDiscovery ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
        <p className={styles.settingDescription}>
          Automatically discover new smart devices on your network
        </p>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Cloud Sync</label>
          <button
            className={`${styles.toggleSwitch} ${settings.cloudSync ? styles.active : ''}`}
            onClick={() => updateSetting('cloudSync', !settings.cloudSync)}
            aria-label={`Toggle cloud sync ${settings.cloudSync ? 'off' : 'on'}`}
            title={`Turn cloud sync ${settings.cloudSync ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Energy Monitoring</label>
          <button
            className={`${styles.toggleSwitch} ${settings.energyMonitoring ? styles.active : ''}`}
            onClick={() =>
              updateSetting('energyMonitoring', !settings.energyMonitoring)
            }
            aria-label={`Toggle energy monitoring ${settings.energyMonitoring ? 'off' : 'on'}`}
            title={`Turn energy monitoring ${settings.energyMonitoring ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
      </div>

      <div className={styles.settingItem}>
        <div className={styles.settingToggle}>
          <label className={styles.settingLabel}>Guest Access</label>
          <button
            className={`${styles.toggleSwitch} ${settings.guestAccess ? styles.active : ''}`}
            onClick={() => updateSetting('guestAccess', !settings.guestAccess)}
            aria-label={`Toggle guest access ${settings.guestAccess ? 'off' : 'on'}`}
            title={`Turn guest access ${settings.guestAccess ? 'off' : 'on'}`}
          >
            <div className={styles.toggleSlider}>
              <div className={styles.toggleThumb} />
            </div>
          </button>
        </div>
        <p className={styles.settingDescription}>
          Allow guests to control basic devices
        </p>
      </div>
    </div>
  );

  const renderAboutSettings = () => (
    <div className={styles.settingsSection}>
      <h3 className={styles.sectionTitle}>About Seraphine</h3>

      <div className={styles.aboutInfo}>
        <div className={styles.appIcon}>🤖</div>
        <h4 className={styles.appName}>Seraphine Hybrid V1.5</h4>
        <p className={styles.appVersion}>Version 1.5.0</p>
        <p className={styles.appDescription}>
          Your intelligent smart home assistant powered by AI
        </p>
      </div>

      <div className={styles.aboutActions}>
        <button
          className={styles.aboutButton}
          title='View privacy policy'
          aria-label='View privacy policy'
        >
          Privacy Policy
        </button>
        <button
          className={styles.aboutButton}
          title='View terms of service'
          aria-label='View terms of service'
        >
          Terms of Service
        </button>
        <button
          className={styles.aboutButton}
          title='Check for application updates'
          aria-label='Check for application updates'
        >
          Check for Updates
        </button>
        <button
          className={styles.aboutButton}
          title='Contact customer support'
          aria-label='Contact customer support'
        >
          Contact Support
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'security':
        return renderSecuritySettings();
      case 'privacy':
        return renderPrivacySettings();
      case 'smart-home':
        return renderSmartHomeSettings();
      case 'about':
        return renderAboutSettings();
      default:
        return renderGeneralSettings();
    }
  };

  return (
    <div className={styles.settingsOverlay}>
      <div className={styles.settingsPanel}>
        <div className={styles.settingsHeader}>
          <h2 className={styles.settingsTitle}>Settings</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            title='Close settings'
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M18 6L6 18M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>

        <div className={styles.settingsContent}>
          <div className={styles.settingsSidebar}>
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`${styles.tabButton} ${activeTab === tab.id ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.id)}
                title={`Switch to ${tab.name} settings`}
                aria-label={`Switch to ${tab.name} settings`}
              >
                <span className={styles.tabIcon}>{tab.icon}</span>
                <span className={styles.tabName}>{tab.name}</span>
              </button>
            ))}
          </div>

          <div className={styles.settingsMain}>{renderTabContent()}</div>
        </div>
      </div>
    </div>
  );
}
