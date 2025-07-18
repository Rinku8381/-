'use client';

import React, { useState } from 'react';
import styles from '../styles/RoomSelector.module.css'; // Use CSS module

interface Room {
  id: string;
  name: string;
  deviceCount: number;
  isSelected?: boolean;
}

interface RoomSelectorProps {
  rooms?: Room[];
  selectedRoomId?: string;
  onRoomSelect?: (roomId: string) => void;
  onAddNewRoom?: () => void;
  onClose?: () => void;
}

const RoomSelector: React.FC<RoomSelectorProps> = ({
  rooms = [],
  selectedRoomId,
  onRoomSelect,
  onAddNewRoom,
  onClose,
}) => {
  const [activeRoomId, setActiveRoomId] = useState(selectedRoomId || '');

  // Default rooms data for demo
  const defaultRooms: Room[] = [
    { id: '1', name: 'Bedroom', deviceCount: 5 },
    { id: '2', name: 'Living Room', deviceCount: 8 },
    { id: '3', name: 'Kitchen', deviceCount: 4 },
    { id: '4', name: 'Office', deviceCount: 6 },
    { id: '5', name: 'Bathroom', deviceCount: 2 },
    { id: '6', name: 'Study', deviceCount: 3 },
  ];

  const roomList = rooms.length > 0 ? rooms : defaultRooms;

  const handleRoomSelect = (roomId: string) => {
    setActiveRoomId(roomId);
    onRoomSelect?.(roomId);
  };

  const handleAddNewRoom = () => {
    onAddNewRoom?.();
  };

  const getRoomIcon = (roomName: string) => {
    switch (roomName.toLowerCase()) {
      case 'bedroom':
        return '🛏️';
      case 'living room':
        return '🛋️';
      case 'kitchen':
        return '🍳';
      case 'office':
        return '💼';
      case 'bathroom':
        return '🚿';
      case 'study':
        return '📚';
      case 'dining room':
        return '🍽️';
      case 'garage':
        return '🚗';
      case 'basement':
        return '🏠';
      case 'attic':
        return '🏚️';
      default:
        return '🏠';
    }
  };

  return (
    <div className={styles.roomSelectorOverlay}>
      <div className={styles.roomSelectorContainer}>
        <div className={styles.roomSelectorHeader}>
          <div className={styles.appTitle}>
            <h1>Seraphine Hybrid V1</h1>
            <div className={styles.selectedRoomsIndicator}>
              {roomList
                .filter(room => room.id === activeRoomId)
                .map(room => (
                  <span key={room.id} className={styles.selectedRoomTag}>
                    {room.name}
                  </span>
                ))}
            </div>
          </div>
          <button
            className={styles.roomSelectorClose}
            onClick={onClose}
            title='Close'
            aria-label='Close'
          >
            <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
              <path
                d='M18 6L6 18M6 6L18 18'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
              />
            </svg>
          </button>
        </div>

        <div className={styles.roomSelectorContent}>
          <h2 className={styles.sectionTitle}>Pilih Ruangan</h2>

          <div className={styles.roomsGrid}>
            {roomList.map(room => (
              <div
                key={room.id}
                className={`${styles.roomCard} ${activeRoomId === room.id ? styles.selected : ''}`}
                onClick={() => handleRoomSelect(room.id)}
              >
                <div className={styles.roomCardInner}>
                  <div className={styles.roomIcon}>
                    {getRoomIcon(room.name)}
                  </div>
                  <div className={styles.roomInfo}>
                    <h3 className={styles.roomName}>{room.name}</h3>
                    <p className={styles.roomDeviceCount}>
                      {room.deviceCount}{' '}
                      {room.deviceCount === 1 ? 'device' : 'devices'}
                    </p>
                  </div>
                  <div className={styles.roomStatusIndicator}>
                    <div className={styles.statusDot}></div>
                  </div>
                </div>
                {activeRoomId === room.id && (
                  <div className={styles.selectionGlow}></div>
                )}
              </div>
            ))}

            <div className={styles.addRoomCard} onClick={handleAddNewRoom}>
              <div className={styles.addRoomInner}>
                <div className={styles.addRoomIcon}>
                  <svg width='32' height='32' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M12 5v14M5 12h14'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                    />
                  </svg>
                </div>
                <div className={styles.addRoomText}>
                  <h3>Tambah Ruangan Baru</h3>
                  <p>Buat ruangan baru</p>
                </div>
              </div>
            </div>
          </div>

          {activeRoomId && (
            <div className={styles.selectedRoomPanel}>
              <div className={styles.panelHeader}>
                <h3>
                  {roomList.find(r => r.id === activeRoomId)?.name} - Device
                  Management
                </h3>
                <button className={styles.manageDevicesBtn}>
                  Manage Devices
                  <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                    <path
                      d='M9 18l6-6-6-6'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'
                    />
                  </svg>
                </button>
              </div>
              <div className={styles.panelContent}>
                <p>
                  {roomList.find(r => r.id === activeRoomId)?.deviceCount}{' '}
                  devices connected
                </p>
                <div className={styles.quickActions}>
                  <button className={styles.quickActionBtn}>Add Device</button>
                  <button className={styles.quickActionBtn}>
                    Room Settings
                  </button>
                  <button className={styles.quickActionBtn}>Automation</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomSelector;

