import { useState, useEffect, useRef, useCallback } from 'react';

const lerp = (start, end, factor) => start + (end - start) * factor;

export const useMotionEngine = () => {
  const [motion, setMotion] = useState({
    mouse: { x: 0, y: 0, targetX: 0, targetY: 0 },
    scroll: { y: 0, targetY: 0, progress: 0 },
    time: 0
  });

  const requestRef = useRef();
  const stateRef = useRef(motion);

  useEffect(() => {
    stateRef.current = motion;
  }, [motion]);

  const update = useCallback((time) => {
    const { mouse, scroll } = stateRef.current;
    
    const nextMouseX = lerp(mouse.x, mouse.targetX, 0.08);
    const nextMouseY = lerp(mouse.y, mouse.targetY, 0.08);
    const nextScrollY = lerp(scroll.y, scroll.targetY, 0.06);
    
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollMax > 0 ? Math.min(Math.max(nextScrollY / scrollMax, 0), 1) : 0;

    setMotion({
      mouse: { ...mouse, x: nextMouseX, y: nextMouseY },
      scroll: { ...scroll, y: nextScrollY, progress: scrollProgress },
      time: time * 0.001
    });

    requestRef.current = requestAnimationFrame(update);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const targetX = (e.clientX / window.innerWidth) - 0.5;
      const targetY = (e.clientY / window.innerHeight) - 0.5;
      setMotion(prev => ({
        ...prev,
        mouse: { ...prev.mouse, targetX, targetY }
      }));
    };

    const handleScroll = () => {
      setMotion(prev => ({
        ...prev,
        scroll: { ...prev.scroll, targetY: window.scrollY }
      }));
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    requestRef.current = requestAnimationFrame(update);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(requestRef.current);
    };
  }, [update]);

  return motion;
};
