'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
  type: 'rising' | 'floating' | 'pulse';
}

interface RisingParticlesBackgroundProps {
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
  animated?: boolean;
  musicSync?: boolean;
  beatData?: number[];
}

const RisingParticlesBackground: React.FC<RisingParticlesBackgroundProps> = ({
  intensity = 'medium',
  colors = ['#00ffff', '#ff00ff', '#8b5cf6', '#0066ff'],
  animated = true,
  musicSync = false,
  beatData = [],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const particleCount = {
    low: 30,
    medium: 60,
    high: 100,
  }[intensity];

  const createParticle = (canvas: HTMLCanvasElement): Particle => {
    const types: Particle['type'][] = ['rising', 'floating', 'pulse'];
    const type = types[Math.floor(Math.random() * types.length)] || 'rising';

    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -Math.random() * 2 - 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      color: colors[Math.floor(Math.random() * colors.length)] || '#00ffff',
      life: 0,
      maxLife: Math.random() * 300 + 200,
      type,
    };
  };

  const createFloatingParticle = (canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.4 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)] || '#00ffff',
      life: 0,
      maxLife: Math.random() * 500 + 300,
      type: 'floating',
    };
  };

  const updateParticle = (
    particle: Particle,
    canvas: HTMLCanvasElement,
    beatIntensity = 1
  ) => {
    particle.life += 1;

    if (particle.type === 'rising') {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Apply beat sync effect
      if (musicSync && beatIntensity > 1.2) {
        particle.vy *= beatIntensity * 0.5;
        particle.size *= 1 + (beatIntensity - 1) * 0.3;
      }

      // Fade out as particle rises
      const lifeRatio = particle.life / particle.maxLife;
      particle.opacity = Math.max(0, 1 - lifeRatio * 0.7);

      // Remove if off screen or life ended
      return particle.y > -10 && particle.life < particle.maxLife;
    }

    if (particle.type === 'floating') {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
      if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

      // Ensure particles stay within bounds
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));

      return particle.life < particle.maxLife;
    }

    if (particle.type === 'pulse') {
      // Pulsing effect
      const pulse = Math.sin(particle.life * 0.1) * 0.5 + 0.5;
      particle.opacity = pulse * 0.6 + 0.2;
      particle.size = (pulse * 0.5 + 0.5) * 2;

      if (musicSync && beatIntensity > 1.1) {
        particle.opacity *= beatIntensity;
        particle.size *= beatIntensity;
      }

      return particle.life < particle.maxLife;
    }

    return false;
  };

  const drawParticle = (ctx: CanvasRenderingContext2D, particle: Particle) => {
    ctx.save();

    // Create glow effect
    const gradient = ctx.createRadialGradient(
      particle.x,
      particle.y,
      0,
      particle.x,
      particle.y,
      particle.size * 3
    );

    const color = particle.color;
    gradient.addColorStop(
      0,
      `${color}${Math.floor(particle.opacity * 255)
        .toString(16)
        .padStart(2, '0')}`
    );
    gradient.addColorStop(
      0.5,
      `${color}${Math.floor(particle.opacity * 128)
        .toString(16)
        .padStart(2, '0')}`
    );
    gradient.addColorStop(1, `${color}00`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size * 3, 0, Math.PI * 2);
    ctx.fill();

    // Draw core particle
    ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255)
      .toString(16)
      .padStart(2, '0')}`;
    ctx.beginPath();
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with slight fade for trail effect
    ctx.fillStyle = 'rgba(10, 10, 15, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Get beat intensity from music sync
    const currentBeat =
      beatData.length > 0 ? beatData[beatData.length - 1] || 1 : 1;
    const beatIntensity = musicSync ? Math.max(1, currentBeat) : 1;

    // Update existing particles
    particlesRef.current = particlesRef.current.filter(particle =>
      updateParticle(particle, canvas, beatIntensity)
    );

    // Add new particles
    const targetCount =
      particleCount +
      (beatIntensity > 1.2 ? Math.floor(beatIntensity * 10) : 0);

    while (particlesRef.current.length < targetCount) {
      if (Math.random() < 0.7) {
        particlesRef.current.push(createParticle(canvas));
      } else {
        particlesRef.current.push(createFloatingParticle(canvas));
      }
    }

    // Draw particles
    particlesRef.current.forEach(particle => {
      drawParticle(ctx, particle);
    });

    if (animated) {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (animated) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animated, intensity, colors, musicSync]);

  useEffect(() => {
    // Initialize particles
    const canvas = canvasRef.current;
    if (!canvas) return;

    particlesRef.current = [];

    // Create initial floating particles
    for (let i = 0; i < Math.floor(particleCount * 0.3); i++) {
      particlesRef.current.push(createFloatingParticle(canvas));
    }
  }, [particleCount]);

  return (
    <canvas
      ref={canvasRef}
      className='seraphine-particle-canvas'
      width={dimensions.width}
      height={dimensions.height}
    />
  );
};

export default RisingParticlesBackground;
