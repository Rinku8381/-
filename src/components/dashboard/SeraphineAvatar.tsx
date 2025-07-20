'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageCircle,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Heart,
  Star,
  Settings,
  X,
  Mic,
  Send,
} from 'lucide-react';

interface SeraphineAvatarProps {
  isVisible?: boolean;
  mood?: 'idle' | 'active' | 'thinking' | 'happy' | 'excited' | 'helping';
  voiceEnabled?: boolean;
  interactionMode?: 'assistant' | 'companion' | 'guide';
  onCommand?: (command: string) => void;
  onToggleChat?: () => void;
  beatSync?: boolean;
  beatData?: number[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'seraphine';
  message: string;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'system';
}

const SeraphineAvatar: React.FC<SeraphineAvatarProps> = ({
  isVisible = true,
  mood = 'idle',
  voiceEnabled = true,
  interactionMode = 'assistant',
  onCommand,
  onToggleChat,
  beatSync = false,
  beatData = [],
}) => {
  const [isPortalAnimating, setIsPortalAnimating] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(voiceEnabled);
  const [currentExpression, setCurrentExpression] = useState('neutral');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const seraphineResponses = {
    greeting: [
      "Hello! I'm Seraphine, your AI companion. How can I assist you today?",
      'Welcome to the neural network! Ready to create something amazing?',
      'Greetings, creator. What shall we bring to life today?',
    ],
    help: [
      'I can help you with AI image generation, voice commands, and navigating the platform.',
      "Try asking me to 'generate an image', 'open canvas editor', or 'show my library'.",
      "I'm here to guide you through your creative journey. What would you like to explore?",
    ],
    encouragement: [
      'Your creativity is limitless! Keep experimenting with new ideas.',
      'Every great creation starts with a spark of imagination.',
      "I believe in your artistic vision. Let's make it reality!",
    ],
    commands: [
      "Voice commands I understand: 'Generate image', 'Open canvas', 'Show library', 'Open settings'",
      'You can also type commands or questions to me directly.',
      "Try saying 'Seraphine, help me' to get started with voice control.",
    ],
  };

  const expressions = {
    neutral: '😊',
    happy: '😄',
    excited: '🤩',
    thinking: '🤔',
    helpful: '😇',
    playful: '😉',
  };

  const suggestions = [
    'Generate a cyberpunk cityscape',
    'Show me my token balance',
    'Open the style library',
    'Help with voice commands',
    'Upgrade to premium',
    'Create a neural portrait',
  ];

  useEffect(() => {
    if (isVisible && !isPortalAnimating) {
      setIsPortalAnimating(true);
      setTimeout(() => setIsPortalAnimating(false), 2000);
    }
  }, [isVisible]);

  useEffect(() => {
    // Update expression based on mood
    const expressionMap = {
      idle: 'neutral',
      active: 'happy',
      thinking: 'thinking',
      happy: 'happy',
      excited: 'excited',
      helping: 'helpful',
    };
    setCurrentExpression(expressionMap[mood] || 'neutral');
  }, [mood]);

  useEffect(() => {
    // Beat sync animation
    if (beatSync && beatData.length > 0) {
      const currentBeat = beatData[beatData.length - 1];
      if (currentBeat && currentBeat > 1.2) {
        setCurrentExpression('excited');
        setTimeout(() => setCurrentExpression('happy'), 200);
      }
    }
  }, [beatSync, beatData]);

  useEffect(() => {
    // Auto-scroll chat to bottom
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const addMessage = (
    sender: 'user' | 'seraphine',
    message: string,
    type: 'text' | 'suggestion' | 'system' = 'text'
  ) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      sender,
      message,
      timestamp: new Date(),
      type,
    };
    setChatMessages(prev => [...prev, newMessage]);
  };

  const getSeraphineResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();

    if (
      lowerInput.includes('hello') ||
      lowerInput.includes('hi') ||
      lowerInput.includes('hey')
    ) {
      return (
        seraphineResponses.greeting[
          Math.floor(Math.random() * seraphineResponses.greeting.length)
        ] || 'Hello there!'
      );
    }

    if (
      lowerInput.includes('help') ||
      lowerInput.includes('how') ||
      lowerInput.includes('what')
    ) {
      return (
        seraphineResponses.help[
          Math.floor(Math.random() * seraphineResponses.help.length)
        ] || "I'm here to help!"
      );
    }

    if (
      lowerInput.includes('command') ||
      lowerInput.includes('voice') ||
      lowerInput.includes('say')
    ) {
      return (
        seraphineResponses.commands[
          Math.floor(Math.random() * seraphineResponses.commands.length)
        ] || 'Try voice commands!'
      );
    }

    if (
      lowerInput.includes('generate') ||
      lowerInput.includes('create') ||
      lowerInput.includes('image')
    ) {
      if (onCommand) onCommand('generate_image');
      return 'Opening AI image generation for you! Let your creativity flow.';
    }

    if (lowerInput.includes('canvas') || lowerInput.includes('edit')) {
      if (onCommand) onCommand('open_canvas');
      return "I'd love to help with the canvas editor, but that's a premium feature. Would you like to upgrade?";
    }

    if (lowerInput.includes('library') || lowerInput.includes('gallery')) {
      if (onCommand) onCommand('show_library');
      return "Here's your creative library! All your amazing works in one place.";
    }

    if (lowerInput.includes('settings') || lowerInput.includes('profile')) {
      if (onCommand) onCommand('open_settings');
      return 'Opening your settings panel. Customize your experience!';
    }

    if (lowerInput.includes('upgrade') || lowerInput.includes('premium')) {
      if (onCommand) onCommand('upgrade_account');
      return 'Premium unlocks unlimited creativity! Shall I show you the upgrade options?';
    }

    return (
      seraphineResponses.encouragement[
        Math.floor(Math.random() * seraphineResponses.encouragement.length)
      ] || "Let's create something amazing together!"
    );
  };

  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    addMessage('user', userInput);
    const response = getSeraphineResponse(userInput);

    setUserInput('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(
      () => {
        addMessage('seraphine', response);
        setIsTyping(false);

        if (audioEnabled && 'speechSynthesis' in window) {
          const utterance = new SpeechSynthesisUtterance(response);
          utterance.rate = 0.9;
          utterance.pitch = 1.1;
          utterance.volume = 0.7;
          speechSynthesis.speak(utterance);
        }
      },
      Math.random() * 1000 + 500
    );
  };

  const handleSuggestionClick = (suggestion: string) => {
    addMessage('user', suggestion);
    const response = getSeraphineResponse(suggestion);

    setIsTyping(true);
    setTimeout(() => {
      addMessage('seraphine', response);
      setIsTyping(false);
    }, 800);
  };

  const toggleChat = () => {
    setShowChat(!showChat);
    if (onToggleChat) onToggleChat();

    if (!showChat && chatMessages.length === 0) {
      // Welcome message for first time
      setTimeout(() => {
        addMessage(
          'seraphine',
          seraphineResponses.greeting[0] ||
            "Hello! I'm Seraphine, your AI companion.",
          'system'
        );
      }, 500);
    }
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Portal Animation */}
      {isPortalAnimating && (
        <div className='fixed inset-0 z-50 pointer-events-none'>
          <div className='seraphine-portal-entry'></div>
        </div>
      )}

      {/* Avatar Container */}
      <div className='fixed bottom-4 left-4 z-40'>
        <div className='relative'>
          {/* Avatar Circle */}
          <button
            onClick={toggleChat}
            className={`w-16 h-16 rounded-full seraphine-holo-panel border-2 border-cyan-400 overflow-hidden transition-all duration-300 ${
              showChat ? 'scale-110 shadow-cyan-400/30' : 'hover:scale-105'
            } ${beatSync ? 'seraphine-beat-sync' : ''}`}
            title='Chat with Seraphine'
          >
            {/* Avatar Image/Animation */}
            <div className='w-full h-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center relative overflow-hidden'>
              {/* Lottie Avatar would go here - using emoji for now */}
              <span className='text-2xl transition-all duration-200'>
                {expressions[currentExpression as keyof typeof expressions]}
              </span>

              {/* Neural Pattern Overlay */}
              <div className='absolute inset-0 opacity-20'>
                <div className='seraphine-neural-grid small'></div>
              </div>

              {/* Mood Ring */}
              <div
                className={`absolute inset-0 border-2 rounded-full transition-all duration-500 ${
                  mood === 'excited'
                    ? 'border-yellow-400 shadow-yellow-400/50'
                    : mood === 'happy'
                      ? 'border-green-400 shadow-green-400/50'
                      : mood === 'thinking'
                        ? 'border-purple-400 shadow-purple-400/50'
                        : mood === 'helping'
                          ? 'border-blue-400 shadow-blue-400/50'
                          : 'border-cyan-400 shadow-cyan-400/50'
                }`}
              ></div>
            </div>

            {/* Status Indicator */}
            <div className='absolute -top-1 -right-1'>
              <div
                className={`w-4 h-4 rounded-full ${
                  mood === 'active' || mood === 'helping'
                    ? 'bg-green-400 animate-pulse'
                    : mood === 'thinking'
                      ? 'bg-yellow-400 animate-pulse'
                      : 'bg-cyan-400'
                } border-2 border-black`}
              ></div>
            </div>

            {/* Chat Notification */}
            {chatMessages.filter(m => m.sender === 'seraphine').length > 0 &&
              !showChat && (
                <div className='absolute -top-2 -left-2'>
                  <div className='w-6 h-6 bg-red-400 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce'>
                    !
                  </div>
                </div>
              )}
          </button>

          {/* Quick Actions */}
          {!showChat && (
            <div className='absolute left-20 bottom-0 flex gap-2'>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className='w-8 h-8 rounded-full seraphine-neural-btn ghost p-1'
                title={audioEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {audioEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              </button>

              <button
                onClick={() => onCommand && onCommand('show_help')}
                className='w-8 h-8 rounded-full seraphine-neural-btn ghost p-1'
                title='Get help'
              >
                <Sparkles size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Chat Panel */}
      {showChat && (
        <div className='fixed bottom-24 left-4 w-80 max-h-96 seraphine-holo-panel z-50'>
          {/* Chat Header */}
          <div className='flex items-center justify-between p-4 border-b border-cyan-500/20'>
            <div className='flex items-center gap-3'>
              <div className='seraphine-plasma-orb w-8 h-8'></div>
              <div>
                <h3 className='font-semibold text-cyan-300'>Seraphine</h3>
                <p className='text-xs text-cyan-300/70 capitalize'>
                  {interactionMode} mode
                </p>
              </div>
            </div>

            <div className='flex items-center gap-2'>
              <button
                onClick={() => setAudioEnabled(!audioEnabled)}
                className='text-cyan-400/70 hover:text-cyan-300'
                title={audioEnabled ? 'Disable voice' : 'Enable voice'}
              >
                {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={toggleChat}
                className='text-cyan-400/70 hover:text-cyan-300'
                title='Close chat'
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat Messages */}
          <div className='h-48 overflow-y-auto p-4 space-y-3'>
            {chatMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg text-sm ${
                    msg.sender === 'user'
                      ? 'bg-cyan-400 text-black ml-4'
                      : msg.type === 'system'
                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                        : 'bg-gray-700 text-cyan-300 mr-4'
                  }`}
                >
                  {msg.message}
                  <div className='text-xs opacity-70 mt-1'>
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className='flex justify-start'>
                <div className='bg-gray-700 text-cyan-300 p-3 rounded-lg mr-4'>
                  <div className='flex gap-1'>
                    <div className='seraphine-loading-dot delay-1'></div>
                    <div className='seraphine-loading-dot delay-2'></div>
                    <div className='seraphine-loading-dot delay-3'></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Suggestions */}
          {chatMessages.length <= 1 && (
            <div className='p-4 border-t border-cyan-500/20'>
              <p className='text-xs text-cyan-300/70 mb-2'>Try asking:</p>
              <div className='flex flex-wrap gap-2'>
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className='text-xs px-2 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded text-cyan-300 hover:bg-cyan-500/20 transition-colors'
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Chat Input */}
          <div className='p-4 border-t border-cyan-500/20'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={userInput}
                onChange={e => setUserInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder='Type a message...'
                className='flex-1 p-2 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none text-sm'
              />
              <button
                onClick={handleSendMessage}
                disabled={!userInput.trim()}
                className='seraphine-neural-btn p-2 disabled:opacity-50'
                title='Send message'
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SeraphineAvatar;
