'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Sparkles, Copy, RotateCcw } from 'lucide-react';

interface PromptInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const PROMPT_SUGGESTIONS = [
  'cyberpunk neon cityscape at night',
  'ethereal anime character with glowing eyes',
  'futuristic robot in chrome armor',
  'abstract digital art with flowing particles',
  'steampunk mechanical dragon',
  'holographic butterfly in space',
];

export default function PromptInput({
  value,
  onChange,
  placeholder = 'Describe your creation...',
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + 'px';
    }
  }, [value]);

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
  };

  const generateRandomSuggestion = () => {
    const randomSuggestion =
      PROMPT_SUGGESTIONS[Math.floor(Math.random() * PROMPT_SUGGESTIONS.length)];
    if (randomSuggestion) {
      onChange(randomSuggestion);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <h3 className='text-lg font-semibold text-cyan-400 flex items-center gap-2'>
          <Wand2 className='w-5 h-5' />
          Prompt
        </h3>
        <div className='flex gap-2'>
          <motion.button
            onClick={() => setShowSuggestions(!showSuggestions)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='p-2 rounded-lg border border-purple-500/30 hover:border-purple-400/50 bg-purple-500/10 hover:bg-purple-500/20 transition-all duration-300 group'
            title='Show suggestions'
          >
            <Sparkles className='w-4 h-4 text-purple-400 group-hover:text-purple-300' />
          </motion.button>
          <motion.button
            onClick={generateRandomSuggestion}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className='p-2 rounded-lg border border-cyan-500/30 hover:border-cyan-400/50 bg-cyan-500/10 hover:bg-cyan-500/20 transition-all duration-300 group'
            title='Random suggestion'
          >
            <RotateCcw className='w-4 h-4 text-cyan-400 group-hover:text-cyan-300' />
          </motion.button>
        </div>
      </div>

      {/* Prompt Textarea */}
      <div className='relative'>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={`w-full min-h-[120px] max-h-[200px] bg-black/30 border-2 rounded-xl px-4 py-3 text-white placeholder-gray-400 resize-none transition-all duration-300 ${
            isFocused
              ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
              : 'border-cyan-500/30 hover:border-cyan-400/50'
          }`}
          rows={4}
        />

        {/* Character counter */}
        <div className='absolute bottom-3 right-3 text-xs text-gray-400'>
          {value.length}/500
        </div>

        {/* Glow effect when focused */}
        {isFocused && (
          <div className='absolute inset-0 border-2 border-cyan-400 rounded-xl opacity-20 animate-pulse pointer-events-none' />
        )}
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className='bg-black/80 border border-purple-500/30 rounded-xl p-4 backdrop-blur-sm'
        >
          <div className='text-sm text-purple-400 mb-3 flex items-center gap-2'>
            <Sparkles className='w-4 h-4' />
            Prompt Suggestions
          </div>
          <div className='grid grid-cols-1 gap-2'>
            {PROMPT_SUGGESTIONS.map((suggestion, index) => (
              <motion.button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                whileHover={{ scale: 1.02 }}
                className='text-left p-3 rounded-lg border border-purple-500/20 hover:border-purple-400/40 bg-purple-500/5 hover:bg-purple-500/10 text-gray-300 hover:text-white transition-all duration-300 group'
              >
                <div className='flex items-center justify-between'>
                  <span className='text-sm'>{suggestion}</span>
                  <Copy className='w-3 h-3 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Enhanced prompt tips */}
      {value.length === 0 && (
        <div className='text-xs text-gray-500 space-y-1'>
          <div>
            💡 <strong>Pro tip:</strong> Be specific about style, mood, and
            details
          </div>
          <div>
            ✨ <strong>Example:</strong> "cyberpunk girl with neon hair, city
            background, dramatic lighting"
          </div>
        </div>
      )}
    </div>
  );
}
