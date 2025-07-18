'use client';

import React, { useState } from 'react';
import styles from '../styles/DeviceCards.module.css';

export interface Device {
  id: string;
  name: string;
  type: string;
  brand: string;
  model?: string;
  status: 'ON' | 'OFF';
  connectionStatus: 'Auto' | 'Manual' | 'Disconnected';
  wifiStrength: number; // 1-4 scale
  room: string;
}

interface DeviceCardsProps {
  roomName: string;
  devices?: Device[];
  onDeviceToggle?: (deviceId: string, newStatus: 'ON' | 'OFF') => void;
  onDeviceSettings?: (deviceId: string) => void;
  onBack?: () => void;
}

const DeviceCards: React.FC<DeviceCardsProps> = ({
  roomName,
  devices = [],
  onDeviceToggle,
  onDeviceSettings,
  onBack,
}) => {
  const [deviceStates, setDeviceStates] = useState<
    Record<string, 'ON' | 'OFF'>
  >({});

  // Default devices data for demo
  const defaultDevices: Device[] = [
    {
      id: '1',
      name: 'Smart TV',
      type: 'Entertainment',
      brand: 'Samsung',
      model: '55"',
      status: 'ON',
      connectionStatus: 'Auto',
      wifiStrength: 4,
      room: roomName,
    },
    {
      id: '2',
      name: 'Lampu Kamar',
      type: 'Light',
      brand: 'Philips',
      model: 'Hue',
      status: 'ON',
      connectionStatus: 'Auto',
      wifiStrength: 3,
      room: roomName,
    },
    {
      id: '3',
      name: 'AC Kamar',
      type: 'Climate',
      brand: 'Daikin',
      model: '1.5PK',
      status: 'OFF',
      connectionStatus: 'Manual',
      wifiStrength: 2,
      room: roomName,
    },
    {
      id: '4',
      name: 'Thermostat',
      type: 'Climate',
      brand: 'Nest',
      model: 'Pro',
      status: 'ON',
      connectionStatus: 'Auto',
      wifiStrength: 4,
      room: roomName,
    },
    {
      id: '5',
      name: 'CCTV',
      type: 'Security',
      brand: 'Hikvision',
      model: '4K',
      status: 'ON',
      connectionStatus: 'Auto',
      wifiStrength: 3,
      room: roomName,
    },
    {
      id: '6',
      name: 'Smart Plug',
      type: 'Outlet',
      brand: 'TP-Link',
      model: 'Kasa',
      status: 'OFF',
      connectionStatus: 'Disconnected',
      wifiStrength: 1,
      room: roomName,
    },
  ];

  const deviceList = devices.length > 0 ? devices : defaultDevices;

  const getDeviceStatus = (device: Device) => {
    return deviceStates[device.id] || device.status;
  };

  const handleDeviceToggle = (device: Device) => {
    const currentStatus = getDeviceStatus(device);
    const newStatus = currentStatus === 'ON' ? 'OFF' : 'ON';

    setDeviceStates(prev => ({
      ...prev,
      [device.id]: newStatus,
    }));

    onDeviceToggle?.(device.id, newStatus);
  };

  const handleDeviceSettings = (deviceId: string) => {
    onDeviceSettings?.(deviceId);
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'Entertainment':
        return '📺';
      case 'Light':
        return '💡';
      case 'Climate':
        return '🌡️';
      case 'Security':
        return '📹';
      case 'Outlet':
        return '🔌';
      case 'Audio':
        return '🔊';
      case 'Appliance':
        return '🏠';
      default:
        return '📱';
    }
  };

  const getConnectionStatusColor = (status: string) => {
    switch (status) {
      case 'Auto':
        return '#22C55E';
      case 'Manual':
        return '#F59E0B';
      case 'Disconnected':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  const renderWifiStrength = (strength: number) => {
    const bars = [];
    for (let i = 1; i <= 4; i++) {
      bars.push(
        <div key={i} className={`wifi-bar ${i <= strength ? 'active' : ''}`} />
      );
    }
    return <div className='wifi-strength-indicator'>{bars}</div>;
  };

  return (
    <div className='device-cards-container'>
      <div className='device-cards-header'>
        <div className='breadcrumb'>
          <button
            className='back-button'
            onClick={onBack}
            title='Go back'
            aria-label='Go back'
          >
            <span className='visually-hidden'>Go back</span>
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
              <path
                d='M19 12H5M12 19l-7-7 7-7'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
          <span className='breadcrumb-text'>Rooms</span>
          <span className='breadcrumb-separator'>/</span>
          <span className='current-room'>{roomName}</span>
        </div>
        <h1 className='room-title'>{roomName}</h1>
        <p className='device-count'>{deviceList.length} devices connected</p>
      </div>

      <div className='devices-grid'>
        {deviceList.map(device => {
          const currentStatus = getDeviceStatus(device);
          const isOn = currentStatus === 'ON';

          return (
            <div
              key={device.id}
              className={`device-card ${isOn ? 'active' : 'inactive'}`}
            >
              <div className='device-card-header'>
                <div className='device-icon'>{getDeviceIcon(device.type)}</div>
                <button
                  className='device-settings'
                  onClick={() => handleDeviceSettings(device.id)}
                  title='Device settings'
                  aria-label='Device settings'
                >
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <circle
                      cx='12'
                      cy='12'
                      r='3'
                      stroke='currentColor'
                      strokeWidth='2'
                    />
                    <path
                      d='M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z'
                      stroke='currentColor'
                      strokeWidth='2'
                    />
                  </svg>
                </button>
              </div>

              <div className='device-info'>
                <h3 className='device-name'>{device.name}</h3>
                <div className='device-details'>
                  <span className='device-brand'>{device.brand}</span>
                  {device.model && (
                    <>
                      <span className='detail-separator'>•</span>
                      <span className='device-model'>{device.model}</span>
                    </>
                  )}
                </div>
              </div>

              <div className='device-controls'>
                <div className='device-status-row'>
                  <div className='connection-status'>
                    <div
                      className={`connection-dot ${device.connectionStatus.toLowerCase()}`}
                    />
                    <span className='connection-text'>
                      {device.connectionStatus}
                    </span>
                  </div>
                  {renderWifiStrength(device.wifiStrength)}
                </div>

                <div className='toggle-switch-container'>
                  <span className={`status-label ${isOn ? 'on' : 'off'}`}>
                    {currentStatus}
                  </span>
                  <button
                    className={`toggle-switch ${isOn ? 'on' : 'off'}`}
                    onClick={() => handleDeviceToggle(device)}
                    title={`Turn ${isOn ? 'off' : 'on'} ${device.name}`}
                    aria-label={`Turn ${isOn ? 'off' : 'on'} ${device.name}`}
                  >
                    <div className='toggle-slider'>
                      <div className='toggle-thumb' />
                    </div>
                  </button>
                </div>
              </div>

              {isOn && <div className='device-glow' />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DeviceCards;

