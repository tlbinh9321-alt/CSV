import React, { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  intensity?: 'normal' | 'high' | 'cosmic';
  accentColor?: string;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  intensity = 'normal',
  accentColor = '#00F0FF',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle count based on intensity
    const count = intensity === 'cosmic' ? 90 : intensity === 'high' ? 65 : 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
      pulse: number;
      pulseSpeed: number;
      color: string;
    }> = [];

    const colors = [
      '#00F0FF', // Cyan
      '#00A8FF', // Electric blue
      '#7B61FF', // Violet
      '#F5F7FF', // Starlight white
      accentColor,
    ];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45 - 0.2, // slight upward float
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.7 + 0.2,
        pulse: Math.random() * Math.PI,
        pulseSpeed: 0.02 + Math.random() * 0.03,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render subtle cosmic grid
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.035)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw light beams from center-bottom
      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.85,
        50,
        width / 2,
        height * 0.85,
        width * 0.6
      );
      gradient.addColorStop(0, 'rgba(123, 97, 255, 0.09)');
      gradient.addColorStop(0.5, 'rgba(0, 240, 255, 0.04)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulse) * 0.25);

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.radius * 4;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [intensity, accentColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};
