import React, { useEffect, useRef, useMemo } from 'react';
import { CHAPTERS, CHAPTER_COUNT } from './chapters';
import './BackgroundSystem.css';

const lerp = (a, b, t) => a + (b - a) * t;
const lerpInt = (a, b, t) => Math.round(a + (b - a) * t);

/* ── Pre-compute all chapter formations as flat Float64Array ──────
   Layout per particle per chapter:
     [x, y, size, opacity, r, g, b]
   Total: CHAPTER_COUNT × numParticles × 7 floats
   This eliminates ALL per-frame function calls and hex parsing. */
function buildFormationTable(particles) {
  const nc = CHAPTER_COUNT;
  const np = particles.length;
  const stride = 7;
  const buf = new Float64Array(nc * np * stride);

  for (let c = 0; c < nc; c++) {
    const ch = CHAPTERS[c];
    const offset = c * np * stride;
    for (let i = 0; i < np; i++) {
      const tgt = ch.formation(particles[i].seed);
      const o = offset + i * stride;
      buf[o] = tgt.x;
      buf[o + 1] = tgt.y;
      buf[o + 2] = tgt.size;
      buf[o + 3] = tgt.opacity;
      buf[o + 4] = tgt.r;
      buf[o + 5] = tgt.g;
      buf[o + 6] = tgt.b;
    }
  }
  return buf;
}

/* ── Particle descriptors (init once, read-only at runtime) ─────── */
function buildParticles() {
  const total = 280;
  const desc = new Array(total);
  for (let i = 0; i < total; i++) {
    const isHero = i >= 250;
    desc[i] = {
      seed: (i + 0.001) / total,
      isHero,
      depth: isHero ? 0.8 + Math.random() * 1.2 : 0.5 + Math.random() * 2.5,
      mouseInf: isHero ? 1.2 + Math.random() * 0.8 : 0.2 + Math.random() * 0.8,
      floatAmp: isHero ? 20 + Math.random() * 30 : 5 + Math.random() * 15,
      floatFreq: isHero ? 0.3 + Math.random() * 0.4 : 0.4 + Math.random() * 0.6,
      floatPhase: Math.random() * 10,
    };
  }
  return desc;
}

const NP = 280;
const STRIDE = 7;

const BackgroundSystem = ({ chapterIndex = 0, intraProgress = 0 }) => {
  const canvasRef = useRef(null);

  // Mutable state (no React re-renders)
  const state = useRef({
    mx: 0, my: 0, targetMx: 0, targetMy: 0,
    sy: 0, targetSy: 0,
    time: 0,
    ci: 0, ip: 0,
    frameCount: 0,
  });

  // Pre-compute once
  const particles = useMemo(() => buildParticles(), []);
  const formTable = useMemo(() => buildFormationTable(particles), [particles]);

  // Connection subset indices (hero + every 6th bg → ~75 particles)
  const connIdx = useMemo(() => {
    const arr = [];
    for (let i = 0; i < NP; i++) {
      if (particles[i].isHero || i % 6 === 0) arr.push(i);
    }
    return arr;
  }, [particles]);

  // Reusable buffers (overwritten each frame, no GC)
  const pos = useMemo(() => new Float64Array(NP * 2), []);       // [x, y] per particle
  const prevPos = useMemo(() => new Float64Array(NP * 2), []);   // previous frame [x, y]
  const connPos = useMemo(() => new Float64Array(connIdx.length * 2), [connIdx]);

  // Sync chapter state from props without re-running the effect
  useEffect(() => {
    state.current.ci = chapterIndex;
    state.current.ip = intraProgress;
  }, [chapterIndex, intraProgress]);

  // ── Canvas engine ───────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frameId;
    let prevPosInitialized = false;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);
    };

    const onMouse = (e) => {
      state.current.targetMx = (e.clientX / window.innerWidth) - 0.5;
      state.current.targetMy = (e.clientY / window.innerHeight) - 0.5;
    };
    const onScroll = () => { state.current.targetSy = window.scrollY; };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    resize();

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const draw = (t) => {
      const s = state.current;
      s.mx = lerp(s.mx, s.targetMx, 0.08);
      s.my = lerp(s.my, s.targetMy, 0.08);
      s.sy = lerp(s.sy, s.targetSy, 0.06);
      s.time = t * 0.001;
      s.frameCount++;

      const ci = s.ci;
      const ip = s.ip;
      const clampedCi = Math.min(ci, CHAPTER_COUNT - 2);
      const co = clampedCi * NP * STRIDE;
      const no = Math.min(clampedCi + 1, CHAPTER_COUNT - 1) * NP * STRIDE;
      const tab = formTable;

      // Chapter trail/connection config (blended between chapters)
      const chA = CHAPTERS[clampedCi];
      const chB = CHAPTERS[Math.min(clampedCi + 1, CHAPTER_COUNT - 1)];
      const trailAlpha = lerp(chA.trailAlpha || 0, chB.trailAlpha || 0, ip);
      const trailWidth = lerp(chA.trailWidthMult || 0, chB.trailWidthMult || 0, ip);
      const connColorR = lerpInt(chA.connectionColor?.[0] || 180, chB.connectionColor?.[0] || 180, ip);
      const connColorG = lerpInt(chA.connectionColor?.[1] || 190, chB.connectionColor?.[1] || 190, ip);
      const connColorB = lerpInt(chA.connectionColor?.[2] || 210, chB.connectionColor?.[2] || 210, ip);

      // ── Compute positions (no allocations) ──────────────────────
      const ww = W();
      const wh = H();
      const halfW = ww / 2;
      const halfH = wh / 2;
      const margin = 200;

      // Clear canvas first
      ctx.clearRect(0, 0, ww, wh);

      for (let i = 0; i < NP; i++) {
        const po = co + i * STRIDE;
        const pn = no + i * STRIDE;
        const p = particles[i];

        // Blend formation targets
        const tx = lerp(tab[po], tab[pn], ip);
        const ty = lerp(tab[po + 1], tab[pn + 1], ip);
        const sz = lerp(tab[po + 2], tab[pn + 2], ip);
        const op = lerp(tab[po + 3], tab[pn + 3], ip);

        // Per-particle effects
        const fx = Math.cos(s.time * p.floatFreq * 0.8 + p.floatPhase) * p.floatAmp * 0.5;
        const fy = Math.sin(s.time * p.floatFreq + p.floatPhase) * p.floatAmp;
        const mx = s.mx * 80 * p.mouseInf;
        const my = s.my * 80 * p.mouseInf;
        const scrollOff = s.sy * (p.depth - 1) * 0.12;

        const baseX = halfW + tx * ww * 0.45;
        const baseY = halfH + ty * wh * 0.45;

        let x = baseX + mx + fx;
        let y = baseY - scrollOff + my + fy;

        // Keep in viewport
        if (y < -margin) y += wh + margin * 2;
        else if (y > wh + margin) y -= wh + margin * 2;

        const idx2 = i * 2;
        const prevX = prevPos[idx2];
        const prevY = prevPos[idx2 + 1];
        pos[idx2] = x;
        pos[idx2 + 1] = y;

        // Mixed color
        const r = lerpInt(tab[po + 4], tab[pn + 4], ip);
        const g = lerpInt(tab[po + 5], tab[pn + 5], ip);
        const b = lerpInt(tab[po + 6], tab[pn + 6], ip);

        // ── Draw trail line (prevPos → currentPos) ────────────────
        if (prevPosInitialized && trailAlpha > 0 && trailWidth > 0) {
          const dx = x - prevX;
          const dy = y - prevY;
          const dist = dx * dx + dy * dy;
          if (dist > 1.0) {   // only draw trail if particle moved enough
            ctx.beginPath();
            ctx.moveTo(prevX, prevY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = `rgba(${r},${g},${b},${(op * trailAlpha * 0.6).toFixed(3)})`;
            ctx.lineWidth = Math.max(sz * trailWidth, 0.5);
            ctx.lineCap = 'round';
            ctx.stroke();
          }
        }

        // ── Draw particle ─────────────────────────────────────────
        ctx.beginPath();
        ctx.arc(x, y, Math.max(sz / 2, 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.globalAlpha = op;
        ctx.fill();

        // Store current as previous for next frame
        prevPos[idx2] = x;
        prevPos[idx2 + 1] = y;
      }

      prevPosInitialized = true;

      // ── Glow / hero particles on separate pass ──────────────────
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      for (let i = 0; i < NP; i++) {
        if (!particles[i].isHero) continue;
        const idx2 = i * 2;
        const px = pos[idx2];
        const py = pos[idx2 + 1];
        const po = co + i * STRIDE;
        const pn = no + i * STRIDE;
        const r = lerpInt(tab[po + 4], tab[pn + 4], ip);
        const g = lerpInt(tab[po + 5], tab[pn + 5], ip);
        const b = lerpInt(tab[po + 6], tab[pn + 6], ip);

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgb(${r},${g},${b})`;
        ctx.globalAlpha = 0.25;
        ctx.shadowBlur = 12;
        ctx.shadowColor = ctx.fillStyle;
        ctx.fill();
      }

      // ── Connection lines (every 4th frame, squared distance) ────
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      if ((s.frameCount & 3) === 0) {  // every 4th frame
        const useConn = chA.connections || chB.connections;
        if (useConn) {
          const cd = lerp(chA.connectionDistance, chB.connectionDistance, ip);
          if (cd > 0.01) {
            const thresh2 = (cd * ww) ** 2;
            const n = connIdx.length;
            // Write positions of connectable particles
            for (let ci2 = 0; ci2 < n; ci2++) {
              const pi2 = connIdx[ci2] * 2;
              connPos[ci2 * 2] = pos[pi2];
              connPos[ci2 * 2 + 1] = pos[pi2 + 1];
            }
            for (let i2 = 0; i2 < n; i2++) {
              const ax = connPos[i2 * 2];
              const ay = connPos[i2 * 2 + 1];
              for (let j2 = i2 + 1; j2 < n; j2++) {
                const dx = ax - connPos[j2 * 2];
                const dy = ay - connPos[j2 * 2 + 1];
                const d2 = dx * dx + dy * dy;
                if (d2 < thresh2) {
                  const alpha = (1 - Math.sqrt(d2 / thresh2)) * 0.06;
                  ctx.beginPath();
                  ctx.moveTo(ax, ay);
                  ctx.lineTo(connPos[j2 * 2], connPos[j2 * 2 + 1]);
                  ctx.strokeStyle = `rgba(${connColorR},${connColorG},${connColorB},${alpha.toFixed(3)})`;
                  ctx.lineWidth = 0.6;
                  ctx.stroke();
                }
              }
            }
          }
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      frameId = requestAnimationFrame(draw);
    };

    frameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frameId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <canvas ref={canvasRef} className="background-canvas-container" />;
};

export default BackgroundSystem;
