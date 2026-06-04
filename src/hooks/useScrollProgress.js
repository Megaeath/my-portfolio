import { useState, useEffect, useRef } from 'react';
import { CHAPTER_CENTERS, CHAPTER_COUNT } from '../components/BackgroundSystem/chapters';

const lerp = (a, b, t) => a + (b - a) * t;

/**
 * Tracks smooth scroll position and maps it to chapter transitions.
 *
 * Returns:
 *  - scrollY: smoothed scroll position
 *  - progress: normalized scroll progress (0–1)
 *  - chapterIndex: the "from" chapter index (0-based)
 *  - intraProgress: blend factor (0–1) between chapterIndex and chapterIndex+1
 */
export function useScrollProgress() {
  const [state, setState] = useState({
    scrollY: 0,
    progress: 0,
    chapterIndex: 0,
    intraProgress: 0,
  });

  const stateRef = useRef(state);
  const frameRef = useRef(null);
  const targetScrollY = useRef(0);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const getChapterBlend = (progress) => {
    // Before first chapter center
    if (progress <= CHAPTER_CENTERS[0]) {
      return { from: 0, to: 0, t: 0 };
    }
    // After last chapter center
    if (progress >= CHAPTER_CENTERS[CHAPTER_COUNT - 1]) {
      return { from: CHAPTER_COUNT - 1, to: CHAPTER_COUNT - 1, t: 0 };
    }
    // Between two chapter centers
    for (let i = 0; i < CHAPTER_COUNT - 1; i++) {
      if (progress >= CHAPTER_CENTERS[i] && progress < CHAPTER_CENTERS[i + 1]) {
        const range = CHAPTER_CENTERS[i + 1] - CHAPTER_CENTERS[i];
        const t = range > 0 ? (progress - CHAPTER_CENTERS[i]) / range : 0;
        return { from: i, to: i + 1, t: Math.min(t, 1) };
      }
    }
    return { from: 0, to: 0, t: 0 };
  };

  useEffect(() => {
    targetScrollY.current = window.scrollY;

    const handleScroll = () => {
      targetScrollY.current = window.scrollY;
    };

    const animate = () => {
      const current = stateRef.current.scrollY;
      const target = targetScrollY.current;

      // Smooth lerp for scroll
      const smoothY = lerp(current, target, 0.08);

      // Compute normalized progress
      const scrollMax = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      const progress = Math.min(Math.max(smoothY / scrollMax, 0), 1);
      const { from: chapterIndex, t: intraProgress } = getChapterBlend(progress);

      setState({ scrollY: smoothY, progress, chapterIndex, intraProgress });
      frameRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return state;
}
