'use client';

import React from 'react';
import styles from '../styles/LoadingComponents.module.css';

// Cyberpunk Spinner Component
interface CyberpunkSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  text?: string;
}

export function CyberpunkSpinner({
  size = 'medium',
  color = 'primary',
  text,
}: CyberpunkSpinnerProps) {
  return (
    <div className={`cyberpunk-spinner-container ${size}`}>
      <div className={`cyberpunk-spinner ${color}`}>
        <div className='spinner-ring ring-1'></div>
        <div className='spinner-ring ring-2'></div>
        <div className='spinner-ring ring-3'></div>
        <div className='spinner-core'></div>
      </div>
      {text && <span className='spinner-text'>{text}</span>}
    </div>
  );
}

// Matrix Loading Animation
interface MatrixLoaderProps {
  text?: string;
  duration?: number;
}

export function MatrixLoader({
  text = 'LOADING...',
  duration = 3000,
}: MatrixLoaderProps) {
  return (
    <div className='matrix-loader'>
      <div className='matrix-rain'>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} className={`matrix-column delay-${i}`}>
            {Array.from({ length: 10 }, (_, j) => (
              <span key={j} className='matrix-char'>
                {Math.random() > 0.5 ? '1' : '0'}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className='matrix-text'>
        <span className='matrix-loading-text'>{text}</span>
        <div className='matrix-cursor'>_</div>
      </div>
    </div>
  );
}

// Cyberpunk Progress Bar
interface CyberpunkProgressProps {
  progress: number; // 0-100
  label?: string;
  showPercentage?: boolean;
  variant?: 'default' | 'gradient' | 'pulse' | 'data-stream';
}

export function CyberpunkProgress({
  progress,
  label,
  showPercentage = true,
  variant = 'default',
}: CyberpunkProgressProps) {
  return (
    <div className='cyberpunk-progress-container'>
      {label && <div className='progress-label'>{label}</div>}
      <div className={`cyberpunk-progress ${variant}`}>
        <div className='progress-track'>
          <div
            className={`progress-fill progress-width-${Math.round(Math.min(100, Math.max(0, progress)))}`}
          >
            <div className='progress-glow'></div>
          </div>
        </div>
        <div className='progress-indicators'>
          {Array.from({ length: 10 }, (_, i) => (
            <div
              key={i}
              className={`progress-dot ${progress > (i + 1) * 10 ? 'active' : ''}`}
            ></div>
          ))}
        </div>
      </div>
      {showPercentage && (
        <div className='progress-percentage'>{Math.round(progress)}%</div>
      )}
    </div>
  );
}

// Neural Network Loading Animation
export function NeuralNetworkLoader() {
  return (
    <div className='neural-network-loader'>
      <div className='neural-nodes'>
        {Array.from({ length: 12 }, (_, i) => (
          <div key={i} className={`neural-node node-${i}`}></div>
        ))}
      </div>
      <div className='neural-connections'>
        {Array.from({ length: 6 }, (_, i) => (
          <div
            key={i}
            className={`neural-connection delay-${i} rotation-${i}`}
          ></div>
        ))}
      </div>
      <div className='neural-core'>
        <span>AI</span>
      </div>
    </div>
  );
}

// Holographic Loading Effect
interface HolographicLoaderProps {
  text?: string;
}

export function HolographicLoader({
  text = 'INITIALIZING...',
}: HolographicLoaderProps) {
  return (
    <div className='holographic-loader'>
      <div className='holographic-grid'>
        {Array.from({ length: 25 }, (_, i) => (
          <div key={i} className={`grid-cell delay-${i}`}></div>
        ))}
      </div>
      <div className='holographic-text'>
        <span className='holographic-char'>&gt;</span>
        <span className='holographic-content'>{text}</span>
        <span className='holographic-cursor'>|</span>
      </div>
    </div>
  );
}

// Data Transfer Animation
interface DataTransferProps {
  from?: string;
  to?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export function DataTransfer({
  from = 'CLIENT',
  to = 'SERVER',
  speed = 'normal',
}: DataTransferProps) {
  return (
    <div className='data-transfer'>
      <div className='transfer-endpoints'>
        <div className='endpoint source'>
          <div className='endpoint-icon'>📱</div>
          <span className='endpoint-label'>{from}</span>
        </div>
        <div className='endpoint destination'>
          <div className='endpoint-icon'>🖥️</div>
          <span className='endpoint-label'>{to}</span>
        </div>
      </div>
      <div className='transfer-line'>
        <div className={`data-packet ${speed}`}>
          <div className='packet-core'></div>
          <div className='packet-trail'></div>
        </div>
      </div>
      <div className='transfer-status'>
        <span className='status-text'>TRANSFERRING DATA...</span>
        <div className='status-dots'>
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </div>
      </div>
    </div>
  );
}

// System Boot Animation
export function SystemBootLoader() {
  const bootSequence = [
    'INITIALIZING SERAPHINE HYBRID V1...',
    'LOADING NEURAL CORE...',
    'CONNECTING TO SMART DEVICES...',
    'ESTABLISHING SECURE CHANNELS...',
    'SYSTEM READY.',
  ];

  return (
    <div className='system-boot-loader'>
      <div className='boot-header'>
        <div className='boot-logo'>
          <span className='logo-bracket'>[</span>
          <span className='logo-text'>SERAPHINE</span>
          <span className='logo-bracket'>]</span>
        </div>
        <div className='boot-version'>v1.0.0</div>
      </div>
      <div className='boot-sequence'>
        {bootSequence.map((line, index) => (
          <div key={index} className={`boot-line delay-${index}`}>
            <span className='boot-prompt'>&gt;</span>
            <span className='boot-text'>{line}</span>
            <span className='boot-cursor'>_</span>
          </div>
        ))}
      </div>
      <div className='boot-progress'>
        <div className='boot-bar'></div>
      </div>
    </div>
  );
}

// Export all components
export default {
  CyberpunkSpinner,
  MatrixLoader,
  CyberpunkProgress,
  NeuralNetworkLoader,
  HolographicLoader,
  DataTransfer,
  SystemBootLoader,
};

