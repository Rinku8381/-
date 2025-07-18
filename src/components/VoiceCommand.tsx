'use client';

import { useState, useEffect } from 'react';
import styles from '../styles/VoiceCommand.module.css';

// TypeScript declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult:
    | ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any)
    | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  onerror:
    | ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any)
    | null;
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface VoiceCommandProps {
  onCommand?: (command: string) => void;
  isListening?: boolean;
}

export default function VoiceCommand({
  onCommand,
  isListening = false,
}: VoiceCommandProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(
    null
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionClass =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognitionClass) {
        const recognitionInstance =
          new SpeechRecognitionClass() as SpeechRecognition;

        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'id-ID'; // Indonesian

        recognitionInstance.onstart = () => {
          setIsRecording(true);
        };

        recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
          const current = event.resultIndex;
          const result = event.results[current];

          if (result && result[0]) {
            const transcriptResult = result[0].transcript;
            setTranscript(transcriptResult);

            if (result.isFinal) {
              onCommand?.(transcriptResult);
            }
          }
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
        };

        recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, [onCommand]);

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  return (
    <div className={styles.voiceCommand}>
      <button
        className={`${styles.voiceButton} ${isRecording ? styles.recording : ''}`}
        onClick={isRecording ? stopListening : startListening}
        title={isRecording ? 'Stop listening' : 'Start voice command'}
      >
        <svg width='24' height='24' viewBox='0 0 24 24' fill='none'>
          <path
            d='M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z'
            fill='currentColor'
          />
          <path
            d='M19 10v2a7 7 0 0 1-14 0v-2'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
          <path
            d='M12 19v4M8 23h8'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      </button>

      {isRecording && (
        <div className={styles.recordingIndicator}>
          <div className={styles.pulse}></div>
          <span>Listening...</span>
        </div>
      )}

      {transcript && (
        <div className={styles.transcript}>
          <p>"{transcript}"</p>
        </div>
      )}
    </div>
  );
}
