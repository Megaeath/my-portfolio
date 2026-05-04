import React, { useEffect, useRef, useMemo } from 'react';
import './BackgroundSystem.css';

const lerp = (start, end, factor) => start + (end - start) * factor;

const BackgroundSystem = () => {
  const canvasRef = useRef(null);
  const motionRef = useRef({
    mx: 0, my: 0, targetMx: 0, targetMy: 0,
    sy: 0, targetSy: 0,
    time: 0
  });

  // 1. Generate particles once (matching your preferred distribution)
  const particles = useMemo(() => {
    const bgDots = [...Array(250)].map(() => ({
      type: 'bg',
      depth: 0.5 + Math.random() * 2.5,
      mouseInf: 0.2 + Math.random() * 0.8,
      float: {
        amp: 5 + Math.random() * 15,
        freq: 0.4 + Math.random() * 0.6,
        phase: Math.random() * 10
      },
      pos: { x: (Math.random() - 0.5) * 1.8, y: (Math.random() - 0.5) * 1.8 },
      size: 1 + Math.random() * 2,
      opacity: 0.1 + Math.random() * 0.2,
      color: Math.random() > 0.5 ? '#3B82F6' : '#8B5CF6'
    }));

    const heroDots = [...Array(30)].map(() => ({
      type: 'hero',
      depth: 0.8 + Math.random() * 1.2,
      mouseInf: 1.2 + Math.random() * 0.8,
      float: {
        amp: 20 + Math.random() * 30,
        freq: 0.3 + Math.random() * 0.4,
        phase: Math.random() * 10
      },
      pos: { x: (Math.random() - 0.5) * 1.2, y: (Math.random() - 0.5) * 1.2 },
      size: 4 + Math.random() * 3,
      opacity: 0.4 + Math.random() * 0.3,
      color: Math.random() > 0.5 ? '#3B82F6' : '#8B5CF6'
    }));

    return [...bgDots, ...heroDots];
  }, []);

  // 2. High Performance Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frame;

    const resize = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const handleMouseMove = (e) => {
      motionRef.current.targetMx = (e.clientX / window.innerWidth) - 0.5;
      motionRef.current.targetMy = (e.clientY / window.innerHeight) - 0.5;
    };

    const handleScroll = () => {
      motionRef.current.targetSy = window.scrollY;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    resize();

    const draw = (t) => {
      const m = motionRef.current;
      m.mx = lerp(m.mx, m.targetMx, 0.08);
      m.my = lerp(m.my, m.targetMy, 0.08);
      m.sy = lerp(m.sy, m.targetSy, 0.06);
      m.time = t * 0.001;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {
        // Calculate Motion
        // We use modulo to wrap the vertical position, creating an "infinite" starfield effect
        const scrollEffect = m.sy * (p.depth - 1);
        const mouseX = m.mx * 100 * p.mouseInf * p.depth;
        const mouseY = m.my * 100 * p.mouseInf * p.depth;

        // Floating effect
        const fx = Math.cos(m.time * p.float.freq * 0.8 + p.float.phase) * p.float.amp * 0.5;
        const fy = Math.sin(m.time * p.float.freq + p.float.phase) * p.float.amp;

        // Base positions with wrapping logic
        const baseX = (window.innerWidth / 2) + (p.pos.x * window.innerWidth);
        const baseY = (window.innerHeight / 2) + (p.pos.y * window.innerHeight);

        const x = baseX + mouseX + fx;

        // Vertical wrapping logic:
        // We calculate the raw Y, then use modulo to keep it within the viewport + a margin
        const margin = 100;
        const viewHeight = window.innerHeight + margin * 2;
        let y = (baseY - (scrollEffect - mouseY - fy) + margin) % viewHeight;
        if (y < 0) y += viewHeight;
        y -= margin;

        // Draw Dot
        ctx.beginPath();
        ctx.arc(x, y, p.size / 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;

        // Blur distant dots
        if (p.depth > 2) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        } else {
          ctx.shadowBlur = p.type === 'hero' ? 15 : 0;
          ctx.shadowColor = p.color;
        }

        ctx.fill();
      });

      frame = requestAnimationFrame(draw);
    };

    frame = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(frame);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="background-canvas-container"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        pointerEvents: 'none',
        backgroundColor: '#F9FAFB'
      }}
    />
  );
};

export default BackgroundSystem;
