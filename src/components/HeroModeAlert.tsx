"use client";

import React, { useState, useEffect } from "react";
import "./HeroModeAlert.css";

interface EmergencyAction {
  id: string;
  name: string;
  icon: string;
  description: string;
  notificationCount: number;
  executed: boolean;
}

interface AlertActivity {
  id: string;
  timestamp: string;
  action: string;
  status: "critical" | "warning" | "info";
  description: string;
}

interface HeroModeAlertProps {
  isOpen: boolean;
  onClose: () => void;
  onDeactivateHeroMode: () => void;
}

const emergencyActions: EmergencyAction[] = [
  {
    id: "lock-doors",
    name: "Lock All Doors",
    icon: "🔒",
    description: "Secure all entry points",
    notificationCount: 3,
    executed: false,
  },
  {
    id: "activate-cameras",
    name: "Activate All Cameras",
    icon: "📹",
    description: "Enable full surveillance",
    notificationCount: 8,
    executed: true,
  },
  {
    id: "call-emergency",
    name: "Call Emergency",
    icon: "🚨",
    description: "Contact authorities",
    notificationCount: 1,
    executed: false,
  },
  {
    id: "sound-siren",
    name: "Sound Siren",
    icon: "📢",
    description: "Activate alarm system",
    notificationCount: 2,
    executed: false,
  },
  {
    id: "notify-family",
    name: "Notify Family",
    icon: "👨‍👩‍👧‍👦",
    description: "Send alerts to contacts",
    notificationCount: 5,
    executed: true,
  },
  {
    id: "stealth-mode",
    name: "Stealth Mode",
    icon: "👤",
    description: "Minimize detection",
    notificationCount: 1,
    executed: false,
  },
];

const alertActivities: AlertActivity[] = [
  {
    id: "1",
    timestamp: "20:15:45",
    action: "HERO MODE ACTIVATED",
    status: "critical",
    description: "Motion detected in restricted area",
  },
  {
    id: "2",
    timestamp: "20:15:42",
    action: "Security Breach Detected",
    status: "critical",
    description: "Unauthorized access attempt at main entrance",
  },
  {
    id: "3",
    timestamp: "20:15:40",
    action: "Camera Network Online",
    status: "info",
    description: "All surveillance systems activated",
  },
  {
    id: "4",
    timestamp: "20:15:38",
    action: "Family Notified",
    status: "info",
    description: "Emergency alerts sent to registered contacts",
  },
  {
    id: "5",
    timestamp: "20:15:35",
    action: "Threat Assessment",
    status: "warning",
    description: "Analyzing security threat level",
  },
  {
    id: "6",
    timestamp: "20:15:30",
    action: "System Alert",
    status: "warning",
    description: "Perimeter sensors triggered",
  },
];

export default function HeroModeAlert({
  isOpen,
  onClose,
  onDeactivateHeroMode,
}: HeroModeAlertProps) {
  const [countdown, setCountdown] = useState<number>(30);
  const [threatLevel, setThreatLevel] = useState<number>(85);
  const [actions, setActions] = useState<EmergencyAction[]>(emergencyActions);
  const [shieldActive, setShieldActive] = useState<boolean>(false);
  const [alertPulse, setAlertPulse] = useState<boolean>(true);

  useEffect(() => {
    if (!isOpen) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const pulseInterval = setInterval(() => {
      setAlertPulse((prev) => !prev);
    }, 500);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(pulseInterval);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleEmergencyAction = (actionId: string) => {
    setActions((prev) =>
      prev.map((action) =>
        action.id === actionId
          ? { ...action, executed: !action.executed }
          : action,
      ),
    );
  };

  const handleShieldUp = () => {
    setShieldActive(true);
    setThreatLevel(25);
    setTimeout(() => {
      setShieldActive(false);
    }, 5000);
  };

  const handleDeactivateHeroMode = () => {
    setThreatLevel(15);
    onDeactivateHeroMode();
    onClose();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="hero-alert-overlay">
      <div className="hero-alert-container">
        <div className="hero-alert-header">
          <div className="alert-status-indicator">
            <span className={`hero-mode-badge ${alertPulse ? "pulsing" : ""}`}>
              HERO MODE AKTIF
            </span>
            <div className="threat-level-display">
              <span className="threat-label">THREAT LEVEL</span>
              <span className="threat-percentage">{threatLevel}%</span>
            </div>
          </div>
          <button
            className="deactivate-button"
            onClick={handleDeactivateHeroMode}
          >
            DEACTIVATE
          </button>
        </div>

        <div className="alert-banner">
          <div
            className={`alert-banner-content ${alertPulse ? "pulsing" : ""}`}
          >
            <h1 className="alert-title">
              HERO MODE AKTIF: ANOMALI KEAMANAN TERDETEKSI
            </h1>
            <p className="alert-subtitle">
              Sistem keamanan dalam mode siaga tinggi
            </p>
          </div>
        </div>

        <div className="alert-main-content">
          <div className="countdown-section">
            <div className="countdown-container">
              <div className="countdown-display">
                <span className="countdown-timer">{formatTime(countdown)}</span>
                <span className="countdown-label">WAKTU RESPONS</span>
              </div>
              <button
                className={`shield-button ${shieldActive ? "active" : ""}`}
                onClick={handleShieldUp}
                disabled={shieldActive}
              >
                <span className="shield-icon">🛡️</span>
                <span className="shield-text">
                  {shieldActive ? "SHIELD ACTIVE" : "SHIELD UP"}
                </span>
              </button>
            </div>
          </div>

          <div className="threat-level-section">
            <h3 className="section-title">Security Threat Level</h3>
            <div className="threat-level-container">
              <div className="threat-level-bar">
                <div
                  className={`threatLevelFill critical width${threatLevel}`}

                ></div>
              </div>
              <div className="threat-level-info">
                <span className="threat-percentage-large">{threatLevel}%</span>
                <span className="threat-status">
                  {threatLevel >= 80
                    ? "CRITICAL THREAT"
                    : threatLevel >= 60
                      ? "HIGH THREAT"
                      : threatLevel >= 40
                        ? "MEDIUM THREAT"
                        : "LOW THREAT"}
                </span>
              </div>
            </div>
          </div>

          <div className="emergency-actions-section">
            <h3 className="section-title">Emergency Actions</h3>
            <div className="emergency-actions-grid">
              {actions.map((action) => (
                <button
                  key={action.id}
                  className={`emergency-action-btn ${action.executed ? "executed" : ""}`}
                  onClick={() => handleEmergencyAction(action.id)}
                >
                  <div className="action-header">
                    <span className="action-icon">{action.icon}</span>
                    {action.notificationCount > 0 && (
                      <span className="notification-badge">
                        {action.notificationCount}
                      </span>
                    )}
                  </div>
                  <span className="action-name">{action.name}</span>
                  <span className="action-description">
                    {action.description}
                  </span>
                  {action.executed && (
                    <div className="executed-indicator">
                      <span className="checkmark">✓</span>
                      <span className="executed-text">EXECUTED</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="alert-activity-section">
            <h3 className="section-title">Hero Mode Activity Log</h3>
            <div className="alert-activity-log">
              {alertActivities.map((activity) => (
                <div
                  key={activity.id}
                  className={`alert-activity-item ${activity.status}`}
                >
                  <div className="activity-timestamp">{activity.timestamp}</div>
                  <div className="activity-content">
                    <div className="activity-action">{activity.action}</div>
                    <div className="activity-description">
                      {activity.description}
                    </div>
                  </div>
                  <div
                    className={`activity-status-indicator ${activity.status}`}
                  >
                    {activity.status === "critical" && "🚨"}
                    {activity.status === "warning" && "⚠️"}
                    {activity.status === "info" && "ℹ️"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
