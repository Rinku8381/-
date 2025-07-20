'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  Send,
  Sparkles,
  Lightbulb,
  X,
  Minimize2,
  Maximize2,
  Bot,
  User,
  Wand2,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  isTyping?: boolean;
}

interface AssistantChatBubbleProps {
  isVisible: boolean;
  onToggle: () => void;
  currentPrompt: string;
  onPromptSuggestion: (prompt: string) => void;
  generationType: 'image' | 'video' | 'faceswap';
}

const PROMPT_SUGGESTIONS = {
  image: [
    'Create a cyberpunk cityscape with neon lights',
    'Generate a fantasy portrait with magical elements',
    'Design a futuristic robot in anime style',
    'Make a surreal landscape with floating islands',
    'Create a detailed character design for a video game',
  ],
  video: [
    'Animate a serene ocean sunset with gentle waves',
    'Create a flowing waterfall in a mystical forest',
    'Generate dancing flames with particle effects',
    'Animate clouds moving across a starry sky',
    'Create a rotating crystal with light reflections',
  ],
  faceswap: [
    'Swap face with a medieval knight',
    'Transform into a cyberpunk character',
    'Change appearance to fantasy elf',
    'Become a retro 80s style character',
    'Transform into futuristic space explorer',
  ],
};

const QUICK_TIPS = [
  "Add specific art styles like 'oil painting' or 'digital art' for better results",
  "Include lighting descriptions: 'soft lighting', 'dramatic shadows', 'golden hour'",
  "Specify camera angles: 'close-up portrait', 'wide shot', 'bird's eye view'",
  "Use quality keywords: 'highly detailed', 'masterpiece', 'professional photography'",
  'Describe emotions and expressions for character portraits',
];

const AssistantChatBubble: React.FC<AssistantChatBubbleProps> = ({
  isVisible,
  onToggle,
  currentPrompt,
  onPromptSuggestion,
  generationType,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize with welcome message
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeMessage: ChatMessage = {
        id: '1',
        type: 'assistant',
        content: `Hi! I'm Seraphine, your AI assistant. I'm here to help you create amazing ${generationType}s! What would you like to generate today?`,
        timestamp: new Date(),
        suggestions: PROMPT_SUGGESTIONS[generationType].slice(0, 3),
      };
      setMessages([welcomeMessage]);
    }
  }, [generationType]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputValue, generationType),
        timestamp: new Date(),
        suggestions: generateSuggestions(inputValue, generationType),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const getAIResponse = (input: string, type: string): string => {
    const responses = {
      image: [
        "Great idea! I've enhanced your prompt with style and lighting details. Try the suggestion below!",
        "That sounds creative! I've added some technical parameters to improve the quality.",
        "Excellent concept! Here's a refined version with better artistic direction.",
        "I love that idea! I've optimized the prompt for better AI understanding.",
      ],
      video: [
        "Perfect for video generation! I've added motion and timing elements to your prompt.",
        "That would make a stunning video! I've included cinematic elements for better results.",
        "Great video concept! I've enhanced it with professional filming techniques.",
        "Wonderful idea for animation! I've added visual flow descriptions.",
      ],
      faceswap: [
        "Interesting character choice! I've refined the prompt for better facial feature matching.",
        "That's a creative transformation! I've added details for more realistic results.",
        "Nice selection! I've optimized the prompt for better face swap accuracy.",
        "Cool concept! I've enhanced the description for better character consistency.",
      ],
    };

    // Ensure type is a valid key, default to 'image' if not
    const validType = type as keyof typeof responses;
    const responseArray = responses[validType] || responses.image;

    return (
      responseArray[Math.floor(Math.random() * responseArray.length)] ||
      'Great idea! Let me help you enhance that prompt.'
    );
  };

  const generateSuggestions = (input: string, type: string): string[] => {
    // Simple logic to generate contextual suggestions
    const validType = type as keyof typeof PROMPT_SUGGESTIONS;
    const baseSuggestions =
      PROMPT_SUGGESTIONS[validType] || PROMPT_SUGGESTIONS.image;
    return baseSuggestions.slice(0, 2);
  };

  const handleSuggestionClick = (suggestion: string) => {
    onPromptSuggestion(suggestion);
    setShowSuggestions(false);
  };

  const handleCopyPrompt = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const getRandomTip = (): string => {
    const tip = QUICK_TIPS[Math.floor(Math.random() * QUICK_TIPS.length)];
    return (
      tip || 'Try being more specific with your prompts for better results!'
    );
  };

  if (!isVisible) {
    return (
      <motion.button
        onClick={onToggle}
        className='fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white shadow-lg cyber-glow-purple z-40'
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        aria-label='Open AI assistant'
      >
        <MessageCircle className='w-6 h-6' />
        <motion.div
          className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full'
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className={`fixed bottom-6 right-6 bg-black/90 border border-purple-500/30 rounded-lg cyber-glass shadow-2xl z-50 ${
        isMinimized ? 'w-80 h-16' : 'w-96 h-[500px]'
      }`}
    >
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-gray-700'>
        <div className='flex items-center gap-3'>
          <div className='relative'>
            <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center'>
              <Bot className='w-4 h-4 text-white' />
            </div>
            <motion.div
              className='absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black'
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div>
            <h3 className='text-white font-medium'>Seraphine AI</h3>
            <span className='text-green-400 text-xs'>Online</span>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <motion.button
            onClick={() => setIsMinimized(!isMinimized)}
            className='p-1 text-gray-400 hover:text-white transition-colors'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? (
              <Maximize2 className='w-4 h-4' />
            ) : (
              <Minimize2 className='w-4 h-4' />
            )}
          </motion.button>
          <motion.button
            onClick={onToggle}
            className='p-1 text-gray-400 hover:text-white transition-colors'
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label='Close'
          >
            <X className='w-4 h-4' />
          </motion.button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className='flex-1 overflow-y-auto p-4 space-y-4 h-80'>
            <AnimatePresence>
              {messages.map(message => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}
                  >
                    {message.type === 'assistant' && (
                      <div className='flex items-center gap-2 mb-1'>
                        <Bot className='w-3 h-3 text-purple-400' />
                        <span className='text-purple-400 text-xs font-medium'>
                          Seraphine
                        </span>
                      </div>
                    )}

                    <div
                      className={`p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : 'bg-gray-800/50 text-gray-100 border border-gray-700'
                      }`}
                    >
                      <p className='text-sm'>{message.content}</p>

                      {/* Message actions */}
                      {message.type === 'assistant' && (
                        <div className='flex items-center gap-2 mt-2 pt-2 border-t border-gray-600'>
                          <motion.button
                            onClick={() => handleCopyPrompt(message.content)}
                            className='p-1 text-gray-400 hover:text-white transition-colors'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label='Copy message'
                          >
                            <Copy className='w-3 h-3' />
                          </motion.button>
                          <motion.button
                            className='p-1 text-gray-400 hover:text-green-400 transition-colors'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label='Like message'
                          >
                            <ThumbsUp className='w-3 h-3' />
                          </motion.button>
                          <motion.button
                            className='p-1 text-gray-400 hover:text-red-400 transition-colors'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            aria-label='Dislike message'
                          >
                            <ThumbsDown className='w-3 h-3' />
                          </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Suggestions */}
                    {message.suggestions && message.suggestions.length > 0 && (
                      <div className='mt-2 space-y-1'>
                        {message.suggestions.map((suggestion, index) => (
                          <motion.button
                            key={index}
                            onClick={() => handleSuggestionClick(suggestion)}
                            className='block w-full text-left p-2 bg-gray-800/30 border border-gray-600 rounded text-sm text-gray-300 hover:bg-gray-700/50 hover:border-purple-500/50 transition-all duration-300'
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Wand2 className='w-3 h-3 inline mr-2 text-purple-400' />
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className='flex justify-start'
              >
                <div className='bg-gray-800/50 border border-gray-700 rounded-lg p-3'>
                  <div className='flex items-center gap-2'>
                    <Bot className='w-3 h-3 text-purple-400' />
                    <div className='flex space-x-1'>
                      <motion.div
                        className='w-2 h-2 bg-purple-400 rounded-full'
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0,
                        }}
                      />
                      <motion.div
                        className='w-2 h-2 bg-purple-400 rounded-full'
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                      />
                      <motion.div
                        className='w-2 h-2 bg-purple-400 rounded-full'
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className='px-4 py-2 border-t border-gray-700'>
            <div className='flex items-center gap-2 mb-2'>
              <Lightbulb className='w-3 h-3 text-yellow-400' />
              <span className='text-yellow-400 text-xs font-medium'>
                Quick Actions
              </span>
            </div>
            <div className='flex gap-2'>
              <motion.button
                onClick={() => handleSuggestionClick(getRandomTip())}
                className='px-3 py-1 bg-gray-800/50 border border-gray-600 rounded text-xs text-gray-300 hover:border-yellow-500/50 transition-colors'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                💡 Random Tip
              </motion.button>
              <motion.button
                onClick={() => setMessages(messages.slice(0, 1))}
                className='px-3 py-1 bg-gray-800/50 border border-gray-600 rounded text-xs text-gray-300 hover:border-cyan-500/50 transition-colors'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className='w-3 h-3 inline mr-1' />
                Clear Chat
              </motion.button>
            </div>
          </div>

          {/* Input */}
          <div className='p-4 border-t border-gray-700'>
            <div className='flex gap-2'>
              <input
                type='text'
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                placeholder='Ask me about prompts, tips, or anything...'
                className='flex-1 px-3 py-2 bg-gray-800/50 border border-gray-600 rounded text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none transition-colors text-sm'
              />
              <motion.button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className='px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed'
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                aria-label='Send message'
              >
                <Send className='w-4 h-4' />
              </motion.button>
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AssistantChatBubble;
