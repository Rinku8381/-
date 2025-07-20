'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music, Pause, Play } from 'lucide-react';

interface CyberpunkAudioSystemProps {
  isEnabled?: boolean;
  volume?: number;
  onVolumeChange?: (volume: number) => void;
  onToggle?: (enabled: boolean) => void;
  beatSyncCallback?: (beatData: number[]) => void;
}

const CyberpunkAudioSystem: React.FC<CyberpunkAudioSystemProps> = ({
  isEnabled = false,
  volume = 0.3,
  onVolumeChange,
  onToggle,
  beatSyncCallback,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState('ambient');
  const [localVolume, setLocalVolume] = useState(volume);
  const [audioEnabled, setAudioEnabled] = useState(isEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Ambient tracks for cyberpunk atmosphere
  const tracks = {
    ambient: {
      name: 'Cyberpunk Ambient',
      url: '/assets/splash/SplashAmbientFantasy.mp3',
      loop: true,
    },
    scifi: {
      name: 'Sci-Fi Synthwave',
      url: '/assets/splash/SplashFuturisticScifi.mp3',
      loop: true,
    },
    synthwave: {
      name: 'Futuristic Synthwave',
      url: '/assets/splash/SplashFuturisticSynthwave.mp3',
      loop: true,
    },
  };

  // Initialize audio context and analyzer
  useEffect(() => {
    if (audioEnabled && typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        dataArrayRef.current = new Uint8Array(
          analyserRef.current.frequencyBinCount
        );
      } catch (error) {
        console.warn('Web Audio API not supported:', error);
      }
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [audioEnabled]);

  // Beat detection and sync
  const analyzeBeat = () => {
    if (!analyserRef.current || !dataArrayRef.current || !beatSyncCallback) {
      return;
    }

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Simple beat detection - analyze frequency ranges
    const bassRange = Array.from(dataArray.slice(0, 8));
    const midRange = Array.from(dataArray.slice(8, 32));
    const highRange = Array.from(dataArray.slice(32, 64));

    const bassAvg = bassRange.reduce((a, b) => a + b, 0) / bassRange.length;
    const midAvg = midRange.reduce((a, b) => a + b, 0) / midRange.length;
    const highAvg = highRange.reduce((a, b) => a + b, 0) / highRange.length;

    beatSyncCallback([bassAvg, midAvg, highAvg]);

    animationFrameRef.current = requestAnimationFrame(analyzeBeat);
  };

  // Start beat analysis when playing
  useEffect(() => {
    if (isPlaying && beatSyncCallback) {
      analyzeBeat();
    } else if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  }, [isPlaying, beatSyncCallback]);

  const toggleAudio = () => {
    const newState = !audioEnabled;
    setAudioEnabled(newState);
    onToggle?.(newState);

    if (!newState) {
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setLocalVolume(newVolume);
    onVolumeChange?.(newVolume);
  };

  const switchTrack = (trackId: string) => {
    setCurrentTrack(trackId);
    // In a real implementation, you would switch the audio source here
  };

  if (!audioEnabled) {
    return (
      <div className='cyberpunk-audio-mini'>
        <button
          onClick={toggleAudio}
          className='audio-toggle-btn disabled'
          aria-label='Enable cyberpunk audio'
          title='Enable atmospheric audio'
        >
          <VolumeX size={16} />
        </button>
      </div>
    );
  }

  return (
    <div className='cyberpunk-audio-system'>
      <div className='audio-controls'>
        <button
          onClick={toggleAudio}
          className='audio-toggle-btn enabled'
          aria-label='Disable cyberpunk audio'
          title='Disable atmospheric audio'
        >
          <Volume2 size={16} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className='play-pause-btn'
          aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
          title={isPlaying ? 'Pause ambient audio' : 'Play ambient audio'}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        <div className='volume-control'>
          <input
            type='range'
            min='0'
            max='1'
            step='0.1'
            value={localVolume}
            onChange={e => handleVolumeChange(parseFloat(e.target.value))}
            className='volume-slider'
            aria-label='Audio volume'
          />
        </div>
      </div>

      <div className='track-selector'>
        <select
          value={currentTrack}
          onChange={e => switchTrack(e.target.value)}
          className='track-select'
          aria-label='Select audio track'
        >
          {Object.entries(tracks).map(([id, track]) => (
            <option key={id} value={id}>
              {track.name}
            </option>
          ))}
        </select>
      </div>

      {isPlaying && (
        <div className='audio-visualizer'>
          <div className='beat-indicator'>
            <div className='beat-bar bass' />
            <div className='beat-bar mid' />
            <div className='beat-bar high' />
          </div>
        </div>
      )}

      <style jsx>{`
        .cyberpunk-audio-system {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
          background: rgba(15, 2, 37, 0.95);
          border: 1px solid var(--seraphine-cyan);
          border-radius: 12px;
          padding: 12px;
          backdrop-filter: blur(10px);
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 200px;
        }

        .cyberpunk-audio-mini {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 1000;
        }

        .audio-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .audio-toggle-btn,
        .play-pause-btn {
          background: transparent;
          border: 1px solid var(--seraphine-cyan);
          color: var(--seraphine-cyan);
          border-radius: 6px;
          padding: 6px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .audio-toggle-btn.disabled {
          border-color: rgba(255, 255, 255, 0.3);
          color: rgba(255, 255, 255, 0.3);
        }

        .audio-toggle-btn:hover,
        .play-pause-btn:hover {
          background: rgba(0, 255, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 255, 255, 0.3);
        }

        .volume-control {
          flex: 1;
          margin: 0 8px;
        }

        .volume-slider {
          width: 100%;
          height: 4px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 2px;
          outline: none;
          opacity: 0.8;
          transition: opacity 0.3s;
        }

        .volume-slider:hover {
          opacity: 1;
        }

        .volume-slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          background: var(--seraphine-cyan);
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 0 4px var(--seraphine-cyan);
        }

        .track-select {
          background: rgba(0, 0, 0, 0.5);
          border: 1px solid rgba(0, 255, 255, 0.3);
          color: var(--seraphine-cyan);
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 12px;
          width: 100%;
        }

        .track-select option {
          background: rgba(15, 2, 37, 0.95);
          color: var(--seraphine-cyan);
        }

        .audio-visualizer {
          margin-top: 8px;
        }

        .beat-indicator {
          display: flex;
          gap: 2px;
          height: 20px;
          align-items: flex-end;
        }

        .beat-bar {
          width: 4px;
          background: var(--seraphine-cyan);
          border-radius: 2px;
          transition: height 0.1s ease;
          animation: beatPulse 0.3s ease-in-out infinite alternate;
        }

        .beat-bar.bass {
          animation-delay: 0s;
        }

        .beat-bar.mid {
          animation-delay: 0.1s;
        }

        .beat-bar.high {
          animation-delay: 0.2s;
        }

        @keyframes beatPulse {
          from {
            height: 4px;
            opacity: 0.5;
          }
          to {
            height: 16px;
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .cyberpunk-audio-system {
            bottom: 10px;
            right: 10px;
            min-width: 160px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
};

export default CyberpunkAudioSystem;
