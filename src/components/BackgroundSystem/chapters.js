// Deterministic pseudo-random (all-float, no allocations)
const P = (s, o = 0) => {
  const x = Math.sin(s * 127.1 + 311.7 + o * 0.513) * 43758.5453;
  return x - Math.floor(x);
};
const R = (s, min, max, o = 0) => min + P(s, o) * (max - min);

/* ── Vibrant palette ──────────────────────────────────────────────
   Rich but professional — no neon, just deep saturated tones. */

/**
 * Each chapter stores byte [r,g,b] colors, NOT hex → zero parsing cost.
 */
export const CHAPTERS = [
  {
    id: 'hero', center: 0.075, label: 'Introduction',
    tint: [0, 0, 0, 0],
    connections: false, connectionDistance: 0,
    glowIntensity: 0,
    floatAmpScale: 1,
    trailAlpha: 0.35, trailWidthMult: 0.5,     // hero particles float around → nice trails
    connectionColor: [60, 100, 220],
    formation: (s) => ({
      x: R(s, -0.9, 0.9, 0),
      y: R(s, -0.9, 0.9, 1),
      size: R(s, 1.0, 2.8, 2),
      opacity: R(s, 0.10, 0.30, 3),
      // Deep blue → purple spectrum
      r: R(s, 45, 120, 4),
      g: R(s, 70, 100, 5),
      b: R(s, 170, 230, 6),
    }),
  },
  {
    id: 'about', center: 0.25, label: 'The Story',
    tint: [0, 0, 0, 0],
    connections: true, connectionDistance: 0.18,
    glowIntensity: 0,
    floatAmpScale: 0.7,
    trailAlpha: 0.40, trailWidthMult: 0.5,
    connectionColor: [20, 170, 180],
    formation: (s) => {
      const angle = P(s, 0) * Math.PI * 2;
      const radius = R(s, 0.05, 0.5, 1);
      return {
        x: Math.cos(angle) * radius * 0.8,
        y: Math.sin(angle) * radius * 0.8,
        size: R(s, 1.2, 2.8, 2),
        opacity: R(s, 0.20, 0.50, 3),
        // Vivid teal → cyan
        r: R(s, 10, 40, 4),
        g: R(s, 165, 200, 5),
        b: R(s, 175, 210, 6),
      };
    },
  },
  {
    id: 'experience', center: 0.45, label: 'Timeline',
    tint: [0, 0, 0, 0],
    connections: true, connectionDistance: 0.14,
    glowIntensity: 0,
    floatAmpScale: 0.5,
    trailAlpha: 0.45, trailWidthMult: 0.6,
    connectionColor: [220, 160, 50],
    formation: (s) => {
      const wave = Math.sin(s * 12 + 3.7) * 0.35;
      return {
        x: R(s, -0.95, 0.95, 0),
        y: wave,
        size: R(s, 1.0, 2.4, 1),
        opacity: R(s, 0.18, 0.45, 2),
        // Warm amber → gold
        r: R(s, 200, 240, 3),
        g: R(s, 140, 185, 4),
        b: R(s, 40, 90, 5),
      };
    },
  },
  {
    id: 'skills', center: 0.65, label: 'Expertise',
    tint: [0, 0, 0, 0],
    connections: true, connectionDistance: 0.1,
    glowIntensity: 0,
    floatAmpScale: 0.4,
    trailAlpha: 0.50, trailWidthMult: 0.5,
    connectionColor: [180, 100, 180],
    formation: (s) => {
      const clusterIdx = Math.floor(P(s, 0) * 4);
      const cx = clusterIdx % 2 === 0 ? -0.32 : 0.32;
      const cy = clusterIdx < 2 ? -0.32 : 0.32;
      const localAngle = P(s, 1) * Math.PI * 2;
      const localRadius = R(s, 0.04, 0.2, 2);
      // Distinct vibrant cluster colors
      const pal = [
        [50, 120, 220],   // blue
        [210, 80, 140],   // rose
        [40, 180, 160],   // mint
        [220, 160, 50],   // amber
      ];
      const c = pal[Math.floor(P(s, 5) * 4)];
      return {
        x: cx + Math.cos(localAngle) * localRadius,
        y: cy + Math.sin(localAngle) * localRadius,
        size: R(s, 1.2, 2.6, 3),
        opacity: R(s, 0.22, 0.50, 4),
        r: c[0], g: c[1], b: c[2],
      };
    },
  },
  {
    id: 'projects', center: 0.825, label: 'Projects',
    tint: [0, 0, 0, 0],
    connections: false, connectionDistance: 0,
    glowIntensity: 0,
    floatAmpScale: 0.6,
    trailAlpha: 0.38, trailWidthMult: 0.5,
    connectionColor: [200, 90, 150],
    formation: (s) => {
      const gridCols = 8;
      const idx = Math.floor(P(s, 0) * 16);
      const col = idx % gridCols;
      const row = Math.floor(idx / gridCols);
      return {
        x: (col / (gridCols - 1)) * 1.4 - 0.7 + R(s, -0.06, 0.06, 1),
        y: row * 1.0 - 0.5 + R(s, -0.06, 0.06, 2),
        size: R(s, 1.4, 3.0, 3),
        opacity: R(s, 0.18, 0.42, 4),
        // Magenta → rose
        r: R(s, 180, 220, 5),
        g: R(s, 70, 110, 6),
        b: R(s, 130, 170, 7),
      };
    },
  },
  {
    id: 'footer', center: 0.95, label: 'Connect',
    tint: [0, 0, 0, 0],
    connections: false, connectionDistance: 0,
    glowIntensity: 0,
    floatAmpScale: 1.2,
    trailAlpha: 0.30, trailWidthMult: 0.4,
    connectionColor: [100, 120, 200],
    formation: (s) => ({
      x: R(s, -1.0, 1.0, 0),
      y: R(s, -1.0, 1.0, 1),
      size: R(s, 0.6, 1.8, 2),
      opacity: R(s, 0.08, 0.20, 3),
      // Violet → blue
      r: R(s, 80, 140, 4),
      g: R(s, 90, 140, 5),
      b: R(s, 180, 220, 6),
    }),
  },
];

export const CHAPTER_CENTERS = CHAPTERS.map((ch) => ch.center);
export const CHAPTER_COUNT = CHAPTERS.length;
