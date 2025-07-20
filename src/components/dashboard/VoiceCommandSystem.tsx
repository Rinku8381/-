'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Zap,
  Star,
  Settings,
  Image,
  Palette,
  Layers,
  Crown,
  User,
  MessageCircle,
  X,
  RefreshCw,
} from 'lucide-react';

interface VoiceCommandProps {
  isActive: boolean;
  onToggle: () => void;
  onCommand?: (command: string, confidence: number) => void;
  userLevel?: 'free' | 'premium';
}

interface Command {
  phrase: string;
  action: string;
  description: string;
  icon: React.ReactNode;
  premium?: boolean;
}

const VoiceCommand: React.FC<VoiceCommandProps> = ({
  isActive,
  onToggle,
  onCommand,
  userLevel = 'free',
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSupported, setIsSupported] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const [seraphineResponse, setSeraphineResponse] = useState<string | null>(
    null
  );
  const [waveformData, setWaveformData] = useState<number[]>([]);

  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const commands: Command[] = [
    {
      phrase: 'seraphine activate',
      action: 'activate',
      description: 'Activate voice control',
      icon: <Zap className='w-4 h-4' />,
    },
    {
      phrase: 'generate image',
      action: 'generate_image',
      description: 'Open AI image generation',
      icon: <Image className='w-4 h-4' aria-label='Image generation' />,
    },
    {
      phrase: 'open canvas',
      action: 'open_canvas',
      description: 'Open canvas editor',
      icon: <Layers className='w-4 h-4' />,
      premium: true,
    },
    {
      phrase: 'show library',
      action: 'show_library',
      description: 'Open style library',
      icon: <Palette className='w-4 h-4' />,
    },
    {
      phrase: 'open settings',
      action: 'open_settings',
      description: 'Open user settings',
      icon: <Settings className='w-4 h-4' />,
    },
    {
      phrase: 'upgrade account',
      action: 'upgrade_account',
      description: 'Show premium upgrade',
      icon: <Crown className='w-4 h-4' />,
    },
    {
      phrase: 'show profile',
      action: 'show_profile',
      description: 'Open user profile',
      icon: <User className='w-4 h-4' />,
    },
    {
      phrase: 'help me',
      action: 'show_help',
      description: 'Show help information',
      icon: <MessageCircle className='w-4 h-4' />,
    },
  ];

  const seraphineResponses = {
    activate: 'Voice control activated. How may I assist you?',
    generate_image: 'Opening AI image generation studio.',
    open_canvas:
      userLevel === 'premium'
        ? 'Launching neural canvas editor.'
        : 'Canvas editor requires premium access.',
    show_library: 'Displaying your creative library.',
    open_settings: 'Accessing user configuration.',
    upgrade_account: 'Showing premium upgrade options.',
    show_profile: 'Loading user profile data.',
    show_help: 'Here are the commands I understand.',
    not_recognized:
      "I didn't understand that command. Try saying 'Seraphine activate' first.",
    premium_required:
      'That feature requires premium access. Would you like to upgrade?',
  };

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence || 0.8;

          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
            processCommand(transcript.toLowerCase().trim(), confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isActive && isSupported) {
      startListening();
    } else {
      stopListening();
    }
  }, [isActive, isSupported]);

  useEffect(() => {
    // Generate waveform animation
    if (isListening) {
      const interval = setInterval(() => {
        const newData = Array.from({ length: 20 }, () => Math.random() * 100);
        setWaveformData(newData);
      }, 100);

      return () => clearInterval(interval);
    } else {
      setWaveformData([]);
    }
    return undefined;
  }, [isListening]);

  const startListening = async () => {
    if (!recognitionRef.current || isListening) return;

    try {
      // Setup audio context for visualization
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);
      }

      recognitionRef.current.start();
      setIsListening(true);
      setTranscript('');

      // Play activation sound
      if (audioEnabled) {
        playActivationSound();
      }
    } catch (error) {
      console.error('Error starting voice recognition:', error);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setTranscript('');
    }
  };

  const processCommand = (text: string, confidence: number) => {
    const matchedCommand = commands.find(
      cmd =>
        text.includes(cmd.phrase) ||
        text.includes(cmd.phrase.replace('seraphine ', ''))
    );

    if (matchedCommand) {
      setLastCommand(matchedCommand.phrase);

      // Check premium requirements
      if (matchedCommand.premium && userLevel !== 'premium') {
        setSeraphineResponse(seraphineResponses.premium_required);
        if (audioEnabled) {
          speakResponse(seraphineResponses.premium_required);
        }
        return;
      }

      const response =
        seraphineResponses[
          matchedCommand.action as keyof typeof seraphineResponses
        ];
      setSeraphineResponse(response);

      if (audioEnabled) {
        speakResponse(response);
      }

      if (onCommand) {
        onCommand(matchedCommand.action, confidence);
      }
    } else if (text.includes('seraphine')) {
      const response = seraphineResponses.not_recognized;
      setSeraphineResponse(response);
      if (audioEnabled) {
        speakResponse(response);
      }
    }

    // Clear response after 5 seconds
    setTimeout(() => {
      setSeraphineResponse(null);
      setLastCommand(null);
    }, 5000);
  };

  const playActivationSound = () => {
    // Create a synthetic activation beep
    if (!audioContextRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    oscillator.frequency.setValueAtTime(
      800,
      audioContextRef.current.currentTime
    );
    oscillator.frequency.setValueAtTime(
      1200,
      audioContextRef.current.currentTime + 0.1
    );

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContextRef.current.currentTime + 0.2
    );

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.2);
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.7;
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className='fixed bottom-4 right-4 p-4 seraphine-holo-panel max-w-sm'>
        <div className='flex items-center gap-3 text-amber-400'>
          <MicOff className='w-5 h-5' />
          <span className='text-sm'>
            Voice commands not supported in this browser
          </span>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Voice Control Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full seraphine-neural-btn ${
          isActive ? 'bg-cyan-400' : 'ghost'
        } flex items-center justify-center transition-all duration-300 ${
          isListening ? 'animate-pulse' : ''
        }`}
        title={isActive ? 'Disable voice control' : 'Enable voice control'}
      >
        {isListening ? (
          <div className='flex flex-col items-center gap-1'>
            <Mic className='w-6 h-6' />
            <div className='flex gap-1'>
              {waveformData.slice(0, 3).map((height, i) => {
                const barHeight = 4 + Math.random() * 8;
                return (
                  <div
                    key={i}
                    className='seraphine-waveform-bar'
                    ref={el => {
                      if (el) {
                        el.style.setProperty('--bar-height', `${barHeight}px`);
                      }
                    }}
                  />
                );
              })}
            </div>
          </div>
        ) : (
          <Mic
            className={`w-6 h-6 ${isActive ? 'text-black' : 'text-cyan-400'}`}
          />
        )}
      </button>

      {/* Voice Status Panel */}
      {isActive && (
        <div className='fixed bottom-24 right-6 seraphine-holo-panel p-4 max-w-xs'>
          <div className='flex items-center justify-between mb-3'>
            <h3 className='text-sm font-semibold text-cyan-300'>
              Voice Control
            </h3>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className='text-cyan-400/70 hover:text-cyan-300'
                title={
                  audioEnabled
                    ? 'Disable audio feedback'
                    : 'Enable audio feedback'
                }
              >
                {audioEnabled ? (
                  <Volume2 className='w-4 h-4' />
                ) : (
                  <VolumeX className='w-4 h-4' />
                )}
              </button>
              <button
                onClick={onToggle}
                className='text-cyan-400/70 hover:text-cyan-300'
                title='Close voice control'
              >
                <X className='w-4 h-4' />
              </button>
            </div>
          </div>

          <div className='space-y-3'>
            {/* Status */}
            <div className='flex items-center gap-2'>
              <div
                className={`w-2 h-2 rounded-full ${
                  isListening ? 'bg-green-400 animate-pulse' : 'bg-gray-400'
                }`}
              />
              <span className='text-xs text-cyan-300/70'>
                {isListening ? 'Listening...' : 'Say "Seraphine activate"'}
              </span>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className='p-2 bg-cyan-500/10 rounded border border-cyan-500/20'>
                <p className='text-xs text-cyan-300'>{transcript}</p>
                {confidence > 0 && (
                  <div className='flex items-center gap-2 mt-1'>
                    <div className='seraphine-confidence-bar'>
                      <div
                        className='seraphine-confidence-fill'
                        ref={el => {
                          if (el) {
                            const width = Math.min(
                              100,
                              Math.max(0, confidence * 100)
                            );
                            el.style.setProperty(
                              '--confidence-width',
                              `${width}%`
                            );
                          }
                        }}
                      />
                    </div>
                    <span className='text-xs text-cyan-300/50'>
                      {Math.round(confidence * 100)}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Last Command */}
            {lastCommand && (
              <div className='p-2 bg-green-500/10 rounded border border-green-500/20'>
                <div className='flex items-center gap-2'>
                  <Star className='w-3 h-3 text-green-400' />
                  <span className='text-xs text-green-300'>
                    "{lastCommand}"
                  </span>
                </div>
              </div>
            )}

            {/* Seraphine Response */}
            {seraphineResponse && (
              <div className='p-2 bg-purple-500/10 rounded border border-purple-500/20'>
                <div className='flex items-center gap-2 mb-1'>
                  <div className='seraphine-plasma-orb w-3 h-3'></div>
                  <span className='text-xs font-semibold text-purple-300'>
                    Seraphine
                  </span>
                </div>
                <p className='text-xs text-purple-200'>{seraphineResponse}</p>
              </div>
            )}

            {/* Waveform Visualization */}
            {isListening && waveformData.length > 0 && (
              <div className='flex items-end justify-center gap-1 h-8'>
                {waveformData.map((height, i) => {
                  const barHeight = Math.max(2, Math.min(32, height / 4));
                  return (
                    <div
                      key={i}
                      className='seraphine-waveform-bar'
                      ref={el => {
                        if (el) {
                          el.style.setProperty(
                            '--bar-height',
                            `${barHeight}px`
                          );
                        }
                      }}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Available Commands Help */}
      {isActive && seraphineResponse === seraphineResponses.show_help && (
        <div className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 seraphine-holo-panel p-6 max-w-md z-50'>
          <div className='flex items-center justify-between mb-4'>
            <h3 className='text-lg font-semibold text-cyan-300'>
              Available Commands
            </h3>
            <button
              onClick={() => setSeraphineResponse(null)}
              className='text-cyan-400/70 hover:text-cyan-300'
              title='Close help panel'
              aria-label='Close help panel'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          <div className='space-y-2 max-h-60 overflow-y-auto'>
            {commands.map((command, index) => (
              <div
                key={index}
                className={`flex items-center gap-3 p-2 rounded border transition-all ${
                  command.premium && userLevel !== 'premium'
                    ? 'border-yellow-500/20 bg-yellow-500/5 opacity-50'
                    : 'border-cyan-500/20 bg-cyan-500/5'
                }`}
              >
                {command.icon}
                <div className='flex-1'>
                  <p className='text-sm text-cyan-300'>"{command.phrase}"</p>
                  <p className='text-xs text-cyan-300/50'>
                    {command.description}
                  </p>
                </div>
                {command.premium && userLevel !== 'premium' && (
                  <Crown className='w-4 h-4 text-yellow-400' />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default VoiceCommand;
