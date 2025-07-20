'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Undo,
  Redo,
  Move,
  Square,
  Circle,
  Type,
  Brush,
  Eraser,
  Layers,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  Zap,
  Wand2,
  Image,
  Crop,
  RotateCw,
  Palette,
  Settings,
  Save,
  Upload,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface CanvasLayer {
  id: string;
  name: string;
  visible: boolean;
  type: 'image' | 'shape' | 'text' | 'ai-generated';
  data: any;
  opacity: number;
  blendMode: string;
}

interface CanvasAIEditorProps {
  isVisible: boolean;
  onClose: () => void;
  onSave?: (canvas: HTMLCanvasElement) => void;
  initialImage?: string;
}

const CanvasAIEditor: React.FC<CanvasAIEditorProps> = ({
  isVisible,
  onClose,
  onSave,
  initialImage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedTool, setSelectedTool] = useState<string>('move');
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'background',
      name: 'Background',
      visible: true,
      type: 'image',
      data: null,
      opacity: 1,
      blendMode: 'normal',
    },
  ]);
  const [activeLayer, setActiveLayer] = useState<string>('background');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(10);
  const [brushColor, setBrushColor] = useState('#00ffff');
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const tools = [
    { id: 'move', icon: Move, label: 'Move' },
    { id: 'brush', icon: Brush, label: 'Brush' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
    { id: 'shape-rect', icon: Square, label: 'Rectangle' },
    { id: 'shape-circle', icon: Circle, label: 'Circle' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'ai-inpaint', icon: Wand2, label: 'AI Inpaint' },
    { id: 'ai-extend', icon: Maximize2, label: 'AI Extend' },
  ];

  const blendModes = [
    'normal',
    'multiply',
    'screen',
    'overlay',
    'soft-light',
    'hard-light',
    'color-dodge',
    'color-burn',
    'darken',
    'lighten',
    'difference',
    'exclusion',
  ];

  useEffect(() => {
    if (isVisible && canvasRef.current) {
      initializeCanvas();
    }
  }, [isVisible]);

  const initializeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Initialize with cyberpunk grid background
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw neural grid
    drawNeuralGrid(ctx);

    // Load initial image if provided
    if (initialImage) {
      loadImageToCanvas(initialImage);
    }

    saveCanvasState();
  };

  const drawNeuralGrid = (ctx: CanvasRenderingContext2D) => {
    const gridSize = 50;
    ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
    ctx.lineWidth = 1;

    // Vertical lines
    for (let x = 0; x <= canvasSize.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasSize.height);
      ctx.stroke();
    }

    // Horizontal lines
    for (let y = 0; y <= canvasSize.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasSize.width, y);
      ctx.stroke();
    }
  };

  const loadImageToCanvas = (imageSrc: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new window.Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      saveCanvasState();
    };
    img.src = imageSrc;
  };

  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const imageData = canvas.toDataURL();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const img = new window.Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex - 1] || '';
      setHistoryIndex(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const img = new window.Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = history[historyIndex + 1] || '';
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) return;

    setIsGenerating(true);

    // Simulate AI generation delay
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Create AI-generated overlay effect
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        0,
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2
      );
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0.3)');
      gradient.addColorStop(0.5, 'rgba(255, 0, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(139, 92, 246, 0.1)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add some neural pattern
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3 + 1;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${Math.random() * 0.5})`;
        ctx.fill();
      }

      saveCanvasState();
      setIsGenerating(false);
      setAiPrompt('');
    }, 2000);
  };

  const addLayer = (type: CanvasLayer['type']) => {
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      name: `${type} Layer`,
      visible: true,
      type,
      data: null,
      opacity: 1,
      blendMode: 'normal',
    };

    setLayers([...layers, newLayer]);
    setActiveLayer(newLayer.id);
  };

  const deleteLayer = (layerId: string) => {
    if (layerId === 'background') return; // Can't delete background

    const newLayers = layers.filter(layer => layer.id !== layerId);
    setLayers(newLayers);

    if (activeLayer === layerId) {
      setActiveLayer(newLayers[0]?.id || 'background');
    }
  };

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(
      layers.map(layer =>
        layer.id === layerId ? { ...layer, visible: !layer.visible } : layer
      )
    );
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = 'seraphine-canvas.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas && onSave) {
      onSave(canvas);
    }
  };

  if (!isVisible) return null;

  return (
    <div className='fixed inset-0 z-50 bg-black/90 backdrop-blur-sm'>
      <div
        className={`seraphine-holo-panel h-full mx-4 my-4 flex flex-col ${isFullscreen ? 'mx-0 my-0 rounded-none' : ''}`}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-cyan-500/20'>
          <div className='flex items-center gap-3'>
            <div className='seraphine-plasma-orb w-8 h-8'></div>
            <div>
              <h2
                className='text-xl font-bold text-cyan-400 seraphine-glitch'
                data-text='Neural Canvas Editor'
              >
                Neural Canvas Editor
              </h2>
              <p className='text-sm text-cyan-300/70'>
                AI-Powered Creative Studio
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2'>
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className='seraphine-neural-btn ghost p-2'
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
            <button
              onClick={downloadCanvas}
              className='seraphine-neural-btn ghost p-2'
              title='Download Canvas'
            >
              <Download size={16} />
            </button>
            <button
              onClick={handleSave}
              className='seraphine-neural-btn p-2'
              title='Save to Library'
            >
              <Save size={16} />
            </button>
            <button
              onClick={onClose}
              className='seraphine-neural-btn ghost p-2'
              title='Close Editor'
            >
              <X size={16} />
            </button>
          </div>
        </div>

        <div className='flex flex-1 overflow-hidden'>
          {/* Left Sidebar - Tools */}
          <div className='w-64 border-r border-cyan-500/20 p-4 space-y-4 overflow-y-auto'>
            {/* Tools */}
            <div>
              <h3 className='text-sm font-semibold text-cyan-300 mb-3'>
                Tools
              </h3>
              <div className='grid grid-cols-2 gap-2'>
                {tools.map(tool => (
                  <button
                    key={tool.id}
                    onClick={() => setSelectedTool(tool.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      selectedTool === tool.id
                        ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300'
                        : 'border-cyan-500/20 text-cyan-400/70 hover:border-cyan-400/50'
                    }`}
                    title={tool.label}
                  >
                    <tool.icon size={16} className='mx-auto' />
                    <span className='text-xs block mt-1'>{tool.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* History Controls */}
            <div>
              <h3 className='text-sm font-semibold text-cyan-300 mb-3'>
                History
              </h3>
              <div className='flex gap-2'>
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className='seraphine-neural-btn ghost flex-1 p-2 disabled:opacity-50'
                  title='Undo'
                >
                  <Undo size={16} />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                  className='seraphine-neural-btn ghost flex-1 p-2 disabled:opacity-50'
                  title='Redo'
                >
                  <Redo size={16} />
                </button>
              </div>
            </div>

            {/* Brush Settings */}
            {(selectedTool === 'brush' || selectedTool === 'eraser') && (
              <div>
                <h3 className='text-sm font-semibold text-cyan-300 mb-3'>
                  Brush
                </h3>
                <div className='space-y-3'>
                  <div>
                    <label className='text-xs text-cyan-300/70 block mb-1'>
                      Size
                    </label>
                    <input
                      type='range'
                      min='1'
                      max='50'
                      value={brushSize}
                      onChange={e => setBrushSize(Number(e.target.value))}
                      className='w-full accent-cyan-400'
                      title={`Brush size: ${brushSize}px`}
                      aria-label='Brush size'
                    />
                    <span className='text-xs text-cyan-300'>{brushSize}px</span>
                  </div>
                  {selectedTool === 'brush' && (
                    <div>
                      <label className='text-xs text-cyan-300/70 block mb-1'>
                        Color
                      </label>
                      <input
                        type='color'
                        value={brushColor}
                        onChange={e => setBrushColor(e.target.value)}
                        className='w-full h-8 rounded border border-cyan-500/20'
                        title='Select brush color'
                        aria-label='Brush color'
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AI Generation */}
            <div>
              <h3 className='text-sm font-semibold text-cyan-300 mb-3'>
                AI Generation
              </h3>
              <div className='space-y-3'>
                <div>
                  <label className='text-xs text-cyan-300/70 block mb-1'>
                    Prompt
                  </label>
                  <textarea
                    value={aiPrompt}
                    onChange={e => setAiPrompt(e.target.value)}
                    placeholder='Describe what you want to generate...'
                    className='w-full p-2 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 text-sm resize-none'
                    rows={3}
                  />
                </div>
                <button
                  onClick={handleAIGenerate}
                  disabled={isGenerating || !aiPrompt.trim()}
                  className='seraphine-neural-btn w-full p-2 disabled:opacity-50'
                >
                  {isGenerating ? (
                    <div className='flex items-center gap-2'>
                      <div className='seraphine-plasma-orb w-4 h-4'></div>
                      <span>Generating...</span>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <Zap size={16} />
                      <span>Generate</span>
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className='flex-1 flex flex-col'>
            <div className='flex-1 p-4 bg-gradient-to-br from-purple-900/20 to-blue-900/20 relative overflow-hidden'>
              {/* Neural Grid Background */}
              <div className='absolute inset-0 opacity-10'>
                <div className='seraphine-neural-grid' />
              </div>

              {/* Canvas Container */}
              <div className='flex items-center justify-center h-full'>
                <div className='border border-cyan-400/30 rounded-lg overflow-hidden shadow-2xl'>
                  <canvas
                    ref={canvasRef}
                    className='block bg-gray-900 cursor-crosshair'
                    width={canvasSize.width}
                    height={canvasSize.height}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Layers */}
          <div className='w-64 border-l border-cyan-500/20 p-4 space-y-4 overflow-y-auto'>
            {/* Canvas Settings */}
            <div>
              <h3 className='text-sm font-semibold text-cyan-300 mb-3'>
                Canvas
              </h3>
              <div className='grid grid-cols-2 gap-2'>
                <div>
                  <label className='text-xs text-cyan-300/70 block mb-1'>
                    Width
                  </label>
                  <input
                    type='number'
                    value={canvasSize.width}
                    onChange={e =>
                      setCanvasSize(prev => ({
                        ...prev,
                        width: Number(e.target.value),
                      }))
                    }
                    className='w-full p-1 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 text-xs'
                    title='Canvas width in pixels'
                    aria-label='Canvas width'
                  />
                </div>
                <div>
                  <label className='text-xs text-cyan-300/70 block mb-1'>
                    Height
                  </label>
                  <input
                    type='number'
                    value={canvasSize.height}
                    onChange={e =>
                      setCanvasSize(prev => ({
                        ...prev,
                        height: Number(e.target.value),
                      }))
                    }
                    className='w-full p-1 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 text-xs'
                    title='Canvas height in pixels'
                    aria-label='Canvas height'
                  />
                </div>
              </div>
            </div>

            {/* Layers */}
            <div>
              <div className='flex items-center justify-between mb-3'>
                <h3 className='text-sm font-semibold text-cyan-300'>Layers</h3>
                <button
                  onClick={() => addLayer('image')}
                  className='seraphine-neural-btn ghost p-1'
                  title='Add Layer'
                >
                  <Layers size={14} />
                </button>
              </div>

              <div className='space-y-2'>
                {layers
                  .slice()
                  .reverse()
                  .map(layer => (
                    <div
                      key={layer.id}
                      className={`p-2 rounded border transition-all ${
                        activeLayer === layer.id
                          ? 'border-cyan-400 bg-cyan-400/10'
                          : 'border-cyan-500/20 hover:border-cyan-400/50'
                      }`}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <button
                            onClick={() => toggleLayerVisibility(layer.id)}
                            className='text-cyan-400/70 hover:text-cyan-300'
                          >
                            {layer.visible ? (
                              <Eye size={14} />
                            ) : (
                              <EyeOff size={14} />
                            )}
                          </button>
                          <span className='text-xs text-cyan-300'>
                            {layer.name}
                          </span>
                        </div>

                        <div className='flex items-center gap-1'>
                          <button
                            onClick={() => setActiveLayer(layer.id)}
                            className='text-cyan-400/70 hover:text-cyan-300'
                            title='Select Layer'
                          >
                            <Copy size={12} />
                          </button>
                          {layer.id !== 'background' && (
                            <button
                              onClick={() => deleteLayer(layer.id)}
                              className='text-red-400/70 hover:text-red-300'
                              title='Delete Layer'
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className='mt-2 space-y-1'>
                        <div>
                          <label className='text-xs text-cyan-300/50 block'>
                            Opacity
                          </label>
                          <input
                            type='range'
                            min='0'
                            max='1'
                            step='0.1'
                            value={layer.opacity}
                            onChange={e => {
                              const newLayers = layers.map(l =>
                                l.id === layer.id
                                  ? { ...l, opacity: Number(e.target.value) }
                                  : l
                              );
                              setLayers(newLayers);
                            }}
                            className='w-full accent-cyan-400'
                            title={`Layer opacity: ${Math.round(layer.opacity * 100)}%`}
                            aria-label={`${layer.name} opacity`}
                          />
                        </div>

                        <div>
                          <label className='text-xs text-cyan-300/50 block'>
                            Blend
                          </label>
                          <select
                            value={layer.blendMode}
                            onChange={e => {
                              const newLayers = layers.map(l =>
                                l.id === layer.id
                                  ? { ...l, blendMode: e.target.value }
                                  : l
                              );
                              setLayers(newLayers);
                            }}
                            className='w-full p-1 bg-black/50 border border-cyan-500/20 rounded text-cyan-300 text-xs'
                            title={`Blend mode for ${layer.name}`}
                            aria-label={`${layer.name} blend mode`}
                          >
                            {blendModes.map(mode => (
                              <option key={mode} value={mode}>
                                {mode}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasAIEditor;
