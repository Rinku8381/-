"use client";

import { useState } from "react";
import styles from "./AddDeviceModal.module.css";

interface AddDeviceModalProps {
  onClose: () => void;
  onAddDevice: (deviceData: {
    name: string;
    type: string;
    room: string;
    brand: string;
    pairingStatus: string;
  }) => void;
  rooms: string[];
}

export default function AddDeviceModal({
  onClose,
  onAddDevice,
  rooms,
}: AddDeviceModalProps) {
  const [deviceName, setDeviceName] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [deviceBrand, setDeviceBrand] = useState("");
  const [pairingStatus, setPairingStatus] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const deviceTypes = [
    "Air Conditioner",
    "Light",
    "Climate",
    "Audio",
    "Entertainment",
    "Appliance",
    "Security",
    "Sensor",
    "Switch",
  ];

  const pairingStatuses = ["Auto", "Manual", "Bluetooth", "WiFi", "Zigbee"];

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!deviceName.trim()) {
      newErrors.deviceName = "Device name is required";
    }

    if (!deviceType) {
      newErrors.deviceType = "Device type is required";
    }

    if (!selectedRoom) {
      newErrors.selectedRoom = "Room selection is required";
    }

    if (!deviceBrand.trim()) {
      newErrors.deviceBrand = "Device brand is required";
    }

    if (!pairingStatus) {
      newErrors.pairingStatus = "Pairing status is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onAddDevice({
        name: deviceName.trim(),
        type: deviceType,
        room: selectedRoom,
        brand: deviceBrand.trim(),
        pairingStatus: pairingStatus,
      });

      // Reset form
      setDeviceName("");
      setDeviceType("");
      setSelectedRoom("");
      setDeviceBrand("");
      setPairingStatus("");
      setErrors({});
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleOverlayClick}>
      <div className={styles.modalContainer}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Tambah Perangkat Baru</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            title="Tutup"
            aria-label="Tutup"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label htmlFor="deviceName" className={styles.formLabel}>
              Nama Perangkat
            </label>
            <input
              type="text"
              id="deviceName"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              className={`${styles.formInput} ${
                errors.deviceName ? styles.error : ""
              }`}
              placeholder="AC Ruang Tamu"
            />
            {errors.deviceName && (
              <span className={styles.errorMessage}>{errors.deviceName}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deviceType" className={styles.formLabel}>
              Jenis Perangkat
            </label>
            <select
              id="deviceType"
              value={deviceType}
              onChange={(e) => setDeviceType(e.target.value)}
              className={`${styles.formSelect} ${
                errors.deviceType ? styles.error : ""
              }`}
            >
              <option value="">Pilih jenis perangkat</option>
              {deviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.deviceType && (
              <span className={styles.errorMessage}>{errors.deviceType}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deviceBrand" className={styles.formLabel}>
              Merek
            </label>
            <input
              type="text"
              id="deviceBrand"
              value={deviceBrand}
              onChange={(e) => setDeviceBrand(e.target.value)}
              className={`${styles.formInput} ${
                errors.deviceBrand ? styles.error : ""
              }`}
              placeholder="TCL AI Inverter"
            />
            {errors.deviceBrand && (
              <span className={styles.errorMessage}>{errors.deviceBrand}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="pairingStatus" className={styles.formLabel}>
              Status Pairing
            </label>
            <select
              id="pairingStatus"
              value={pairingStatus}
              onChange={(e) => setPairingStatus(e.target.value)}
              className={`${styles.formSelect} ${
                errors.pairingStatus ? styles.error : ""
              }`}
            >
              <option value="">Pilih status pairing</option>
              {pairingStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            {errors.pairingStatus && (
              <span className={styles.errorMessage}>{errors.pairingStatus}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="selectedRoom" className={styles.formLabel}>
              Ruangan
            </label>
            <select
              id="selectedRoom"
              value={selectedRoom}
              onChange={(e) => setSelectedRoom(e.target.value)}
              className={`${styles.formSelect} ${
                errors.selectedRoom ? styles.error : ""
              }`}
            >
              <option value="">Pilih ruangan</option>
              {rooms.map((room) => (
                <option key={room} value={room}>
                  {room}
                </option>
              ))}
            </select>
            {errors.selectedRoom && (
              <span className={styles.errorMessage}>{errors.selectedRoom}</span>
            )}
          </div>

          <div className={styles.formActions}>
            <button type="button" onClick={onClose} className={styles.cancelBtn}>
              Batal
            </button>
            <button type="submit" className={styles.submitBtn}>
              Tambah Perangkat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
