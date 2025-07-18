'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/AutomationPanel.module.css';

interface Automation {
  id: string;
  name: string;
  type: 'schedule' | 'trigger' | 'scene';
  isActive: boolean;
  devices: string[];
  conditions: string[];
  actions: string[];
}

interface AutomationPanelProps {
  automations?: Automation[];
  onCreateAutomation?: () => void;
  onToggleAutomation?: (id: string, isActive: boolean) => void;
  onEditAutomation?: (id: string) => void;
}

export default function AutomationPanel({
  automations = [],
  onCreateAutomation,
  onToggleAutomation,
  onEditAutomation,
}: AutomationPanelProps) {
  const [selectedType, setSelectedType] = useState<
    'all' | 'schedule' | 'trigger' | 'scene'
  >('all');

  const defaultAutomations: Automation[] = [
    {
      id: '1',
      name: 'Good Night Scene',
      type: 'scene',
      isActive: true,
      devices: ['Smart Light', 'AC Kamar', 'Security Camera'],
      conditions: ['Time: 10:00 PM'],
      actions: ['Turn off lights', 'Set AC to 24°C', 'Activate security'],
    },
    {
      id: '2',
      name: 'Morning Routine',
      type: 'schedule',
      isActive: true,
      devices: ['Smart Light', 'Thermostat'],
      conditions: ['Monday-Friday 6:00 AM'],
      actions: ['Turn on lights', 'Set temperature to 22°C'],
    },
    {
      id: '3',
      name: 'Motion Security',
      type: 'trigger',
      isActive: false,
      devices: ['CCTV', 'Smart Light'],
      conditions: ['Motion detected'],
      actions: ['Turn on lights', 'Record video', 'Send notification'],
    },
  ];

  const automationList =
    automations.length > 0 ? automations : defaultAutomations;
  const filteredAutomations =
    selectedType === 'all'
      ? automationList
      : automationList.filter(auto => auto.type === selectedType);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'schedule':
        return '⏰';
      case 'trigger':
        return '🚨';
      case 'scene':
        return '🎬';
      default:
        return '⚙️';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'schedule':
        return '#3b82f6';
      case 'trigger':
        return '#ef4444';
      case 'scene':
        return '#10b981';
      default:
        return '#6b7280';
    }
  };

  return (
    <div className={styles.automationPanel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Automation</h2>
        <button
          className={styles.createButton}
          onClick={onCreateAutomation}
          title='Create new automation'
        >
          <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
            <path
              d='M12 5v14M5 12h14'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          New
        </button>
      </div>

      <div className={styles.filterTabs}>
        {['all', 'schedule', 'trigger', 'scene'].map(type => (
          <button
            key={type}
            className={`${styles.filterTab} ${selectedType === type ? styles.active : ''}`}
            onClick={() => setSelectedType(type as typeof selectedType)}
          >
            {type === 'all' ? '🔧' : getTypeIcon(type)}{' '}
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.automationList}>
        {filteredAutomations.map(automation => (
          <div key={automation.id} className={styles.automationCard}>
            <div className={styles.cardHeader}>
              <div className={styles.typeIndicator}>
                <span
                  className={`${styles.typeIcon} ${styles[automation.type]}`}
                >
                  {getTypeIcon(automation.type)}
                </span>
                <span className={styles.typeName}>{automation.type}</span>
              </div>

              <div className={styles.cardActions}>
                <button
                  className={styles.editButton}
                  onClick={() => onEditAutomation?.(automation.id)}
                  title='Edit automation'
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                    <path
                      d='M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>

                <button
                  className={`${styles.toggleSwitch} ${automation.isActive ? styles.active : ''}`}
                  onClick={() =>
                    onToggleAutomation?.(automation.id, !automation.isActive)
                  }
                  title={automation.isActive ? 'Deactivate' : 'Activate'}
                >
                  <div className={styles.toggleSlider}>
                    <div className={styles.toggleThumb} />
                  </div>
                </button>
              </div>
            </div>

            <h3 className={styles.automationName}>{automation.name}</h3>

            <div className={styles.automationDetails}>
              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Devices:</span>
                <span className={styles.detailValue}>
                  {automation.devices.join(', ')}
                </span>
              </div>

              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Conditions:</span>
                <span className={styles.detailValue}>
                  {automation.conditions.join(', ')}
                </span>
              </div>

              <div className={styles.detailSection}>
                <span className={styles.detailLabel}>Actions:</span>
                <span className={styles.detailValue}>
                  {automation.actions.join(', ')}
                </span>
              </div>
            </div>

            <div className={styles.statusIndicator}>
              <div
                className={`${styles.statusDot} ${automation.isActive ? styles.active : styles.inactive}`}
              />
              <span className={styles.statusText}>
                {automation.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredAutomations.length === 0 && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🤖</div>
          <p className={styles.emptyText}>No automations found</p>
          <button
            className={styles.createFirstButton}
            onClick={onCreateAutomation}
          >
            Create Your First Automation
          </button>
        </div>
      )}
    </div>
  );
}
