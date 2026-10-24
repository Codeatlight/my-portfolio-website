import { useEffect, useRef } from 'react';
import { useMotionValueEvent, type MotionValue } from 'framer-motion';
import { SUN_X, SUN_X_T, SUN_Y, SUN_Y_T, envelope, interp } from './skyTimeline';

/*
 * All particle work for the sky runs in ONE requestAnimationFrame loop over two
 * 2D canvases, so night and morning effects add no DOM nodes, no CSS filters
 * and no extra compositing layers:
 *   back  (behind the mountains): stars, milky way, constellations, meteors, cursor links
 *   front (over the mountains):   fireflies at night, drifting light motes at sunrise
 * A layer that has nothing to show is cleared once and then skipped entirely.
 */

type Point = [number, number];

// Positions are fractions of the viewport so they scale with any screen.
// They avoid the moon's midnight position (50%, 16%).
const CONSTELLATIONS: { name: string; stars: Point[]; lines: [number, number][] }[] = [
  {
    name: 'Ursa Major',
    stars: [[0.1, 0.2], [0.145, 0.175], [0.19, 0.185], [0.235, 0.215], [0.25, 0.29], [0.315, 0.3], [0.33, 0.225]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]],
  },
  {
    name: 'Cassiopeia',
    stars: [[0.575, 0.05], [0.605, 0.105], [0.635, 0.065], [0.665, 0.12], [0.7, 0.075]],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Orion',
    stars: [[0.76, 0.17], [0.86, 0.16], [0.795, 0.265], [0.812, 0.272], [0.829, 0.279], [0.77, 0.38], [0.87, 0.365]],
    lines: [[0, 1], [0, 2], [1, 4], [2, 3], [3, 4], [2, 5], [4, 6]],
  },
];

const STAR_TINTS = ['255,255,255', '210,225,255', '255,236,210', '200,210,255'];
const LINK_RADIUS = 110;

type Star = { x: number; y: number; r: number; phase: number; speed: number; tint: string; glint: boolean };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };
type Firefly = { hx: number; hy: number; ax: number; ay: number; fx: number; fy: number; ph: number; blink: number; bp: number; size: number };
type Mote = { x: number; y: number; r: number; vy: number; sway: number; sf: number; ph: number };

/** Soft glow drawn once to an offscreen canvas, then stamped with drawImage. */
function makeSprite(inner: string, mid: string, outer: string) {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, inner);
  grad.addColorStop(0.18, mid);
  grad.addColorStop(0.45, outer);
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return c;
}

export function useSkyCanvas(progress: MotionValue<number>) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const frontRef = useRef<HTMLCanvasElement>(null);
  const p = useRef(progress.get());

  useMotionValueEvent(progress, 'change', (v) => {
    p.current = v;
  });

  useEffect(() => {
    const back = backRef.current;
    const front = frontRef.current;
    const bctx = back?.getContext('2d');
    const fctx = front?.getContext('2d');
    if (!back || !front || !bctx || !fctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lowPower = (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4;

    const fireflySprite = makeSprite('rgba(240,255,190,1)', 'rgba(205,255,130,0.6)', 'rgba(150,230,90,0.12)');
    const moteSprite = makeSprite('rgba(255,248,225,1)', 'rgba(255,225,170,0.5)', 'rgba(255,200,140,0.08)');

    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let fireflies: Firefly[] = [];
    let motes: Mote[] = [];
    let meteor: Meteor | null = null;
    let frame = 0;
    let last = performance.now();
    let backDirty = true;
    let frontDirty = true;
    const pointer = { x: 0, y: 0, active: false };

    const seed = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      for (const [c, ctx] of [[back, bctx], [front, fctx]] as const) {
        c.width = w * dpr;
        c.height = h * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      backDirty = frontDirty = true;

      const starCount = Math.round(Math.min(lowPower ? 180 : 320, (w * h) / 5200));
      stars = Array.from({ length: starCount }, (_, i) => {
        // ~40% of stars cluster along the milky way diagonal
        const onBand = i % 5 < 2;
        const u = Math.random();
        const big = Math.random() < 0.04;
        return {
          x: onBand ? u * w : Math.random() * w,
          y: onBand ? u * h * 0.55 + (Math.random() - 0.5) * h * 0.18 : Math.random() * h * 0.78,
          r: big ? 1.3 + Math.random() * 0.7 : 0.3 + Math.random() * 0.9,
          phase: Math.random() * Math.PI * 2,
          speed: 0.6 + Math.random() * 1.8,
          tint: STAR_TINTS[Math.floor(Math.random() * STAR_TINTS.length)],
          glint: big,
        };
      });

      fireflies = Array.from({ length: lowPower ? 12 : 24 }, () => ({
        hx: Math.random() * w,
        hy: h * (0.66 + Math.random() * 0.3),
        ax: 20 + Math.random() * 50,
        ay: 10 + Math.random() * 26,
        fx: 0.15 + Math.random() * 0.3,
        fy: 0.2 + Math.random() * 0.35,
        ph: Math.random() * Math.PI * 2,
        blink: 0.6 + Math.random() * 1.1,
        bp: Math.random() * Math.PI * 2,
        size: 12 + Math.random() * 12,
      }));

      motes = Array.from({ length: lowPower ? 22 : 44 }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 4 + Math.random() * 7,
        vy: 6 + Math.random() * 14,
        sway: 8 + Math.random() * 24,
        sf: 0.2 + Math.random() * 0.4,
        ph: Math.random() * Math.PI * 2,
      }));
    };

    // ---------------------------------------------------------------
    // BACK LAYER
    // ---------------------------------------------------------------
    const drawBack = (s: number, dt: number, prog: number) => {
      const starsA = envelope(prog, 0.18, 0.32, 0.68, 0.82);
      if (starsA <= 0.001) {
        if (backDirty) {
          bctx.clearRect(0, 0, w, h);
          backDirty = false;
        }
        return;
      }
      backDirty = true;
      bctx.clearRect(0, 0, w, h);

      // Milky way haze
      bctx.save();
      bctx.globalAlpha = starsA * 0.9;
      bctx.translate(w / 2, h * 0.28);
      bctx.rotate(Math.atan2(h * 0.55, w));
      const band = bctx.createLinearGradient(0, -h * 0.14, 0, h * 0.14);
      band.addColorStop(0, 'rgba(180,170,255,0)');
      band.addColorStop(0.5, 'rgba(200,190,255,0.07)');
      band.addColorStop(1, 'rgba(180,170,255,0)');
      bctx.fillStyle = band;
      bctx.fillRect(-w, -h * 0.14, w * 2, h * 0.28);
      bctx.restore();

      const linking = finePointer && pointer.active && starsA > 0.3;

      for (const star of stars) {
        const twinkle = reduceMotion ? 0.8 : 0.55 + 0.45 * Math.sin(s * star.speed + star.phase);
        let a = starsA * twinkle;
        let r = star.r;

        // Stars near the cursor brighten and tether to it
        if (linking) {
          const dx = star.x - pointer.x;
          const dy = star.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_RADIUS * LINK_RADIUS) {
            const k = 1 - Math.sqrt(d2) / LINK_RADIUS;
            a = Math.min(1, a + k * 0.6 * starsA);
            r += k * 0.8;
            bctx.strokeStyle = `rgba(200,215,255,${k * 0.3 * starsA})`;
            bctx.lineWidth = 0.6;
            bctx.beginPath();
            bctx.moveTo(pointer.x, pointer.y);
            bctx.lineTo(star.x, star.y);
            bctx.stroke();
          }
        }

        bctx.fillStyle = `rgba(${star.tint},${a})`;
        bctx.beginPath();
        bctx.arc(star.x, star.y, r, 0, Math.PI * 2);
        bctx.fill();

        if (star.glint) {
          bctx.strokeStyle = `rgba(${star.tint},${a * 0.45})`;
          bctx.lineWidth = 0.6;
          bctx.beginPath();
          bctx.moveTo(star.x - r * 4, star.y);
          bctx.lineTo(star.x + r * 4, star.y);
          bctx.moveTo(star.x, star.y - r * 4);
          bctx.lineTo(star.x, star.y + r * 4);
          bctx.stroke();
        }
      }

      // Constellations trace themselves in around midnight, then retract
      const constA = envelope(prog, 0.36, 0.45, 0.58, 0.66);
      if (constA > 0) {
        const draw = reduceMotion ? 1 : constA;
        bctx.font = '500 10px "JetBrains Mono", ui-monospace, monospace';
        for (const c of CONSTELLATIONS) {
          const pts = c.stars.map(([x, y]) => [x * w, y * h] as Point);
          const n = c.lines.length;

          bctx.strokeStyle = `rgba(190,205,255,${0.32 * constA})`;
          bctx.lineWidth = 0.8;
          bctx.beginPath();
          c.lines.forEach(([i, j], idx) => {
            const seg = Math.min(1, Math.max(0, draw * n - idx));
            if (seg <= 0) return;
            const [x1, y1] = pts[i];
            const [x2, y2] = pts[j];
            bctx.moveTo(x1, y1);
            bctx.lineTo(x1 + (x2 - x1) * seg, y1 + (y2 - y1) * seg);
          });
          bctx.stroke();

          for (const [x, y] of pts) {
            const pulse = reduceMotion ? 1 : 0.8 + 0.2 * Math.sin(s * 1.6 + x);
            bctx.globalAlpha = constA * pulse;
            bctx.drawImage(moteSprite, x - 7, y - 7, 14, 14);
            bctx.globalAlpha = 1;
            bctx.fillStyle = `rgba(255,255,255,${0.95 * constA})`;
            bctx.beginPath();
            bctx.arc(x, y, 1.6, 0, Math.PI * 2);
            bctx.fill();
          }

          const [lx, ly] = pts[pts.length - 1];
          bctx.fillStyle = `rgba(200,212,255,${0.45 * constA})`;
          bctx.fillText(c.name.toUpperCase(), lx + 10, ly + 4);
        }
      }

      if (reduceMotion) return;

      // Occasional shooting star
      if (!meteor && starsA > 0.6 && Math.random() < 0.25 * dt) {
        meteor = {
          x: w * (0.3 + Math.random() * 0.7),
          y: h * Math.random() * 0.3,
          vx: -(540 + Math.random() * 360),
          vy: 240 + Math.random() * 180,
          life: 1,
        };
      }
      if (meteor) {
        meteor.x += meteor.vx * dt;
        meteor.y += meteor.vy * dt;
        meteor.life -= 1.1 * dt;
        if (meteor.life <= 0) {
          meteor = null;
        } else {
          const tx = meteor.x - meteor.vx * 0.16;
          const ty = meteor.y - meteor.vy * 0.16;
          const tail = bctx.createLinearGradient(meteor.x, meteor.y, tx, ty);
          tail.addColorStop(0, `rgba(255,255,255,${meteor.life * starsA})`);
          tail.addColorStop(1, 'rgba(255,255,255,0)');
          bctx.strokeStyle = tail;
          bctx.lineWidth = 1.6;
          bctx.beginPath();
          bctx.moveTo(meteor.x, meteor.y);
          bctx.lineTo(tx, ty);
          bctx.stroke();
        }
      }
    };

    // ---------------------------------------------------------------
    // FRONT LAYER
    // ---------------------------------------------------------------
    const drawFront = (s: number, dt: number, prog: number) => {
      const fireA = reduceMotion ? 0 : envelope(prog, 0.3, 0.4, 0.62, 0.72);
      const moteA = reduceMotion ? 0 : envelope(prog, 0.8, 0.9, 1.5, 2);
      if (fireA <= 0.001 && moteA <= 0.001) {
        if (frontDirty) {
          fctx.clearRect(0, 0, w, h);
          frontDirty = false;
        }
        return;
      }
      frontDirty = true;
      fctx.clearRect(0, 0, w, h);

      // Fireflies wander over the ridges and blink out of phase
      if (fireA > 0.001) {
        for (const f of fireflies) {
          const x = f.hx + Math.sin(s * f.fx + f.ph) * f.ax + Math.sin(s * f.fx * 0.37 + f.bp) * f.ax * 0.5;
          const y = f.hy + Math.cos(s * f.fy + f.ph) * f.ay;
          const b = Math.max(0, Math.sin(s * f.blink + f.bp));
          const a = fireA * (0.08 + 0.92 * b * b * b);
          if (a < 0.02) continue;
          fctx.globalAlpha = a;
          fctx.drawImage(fireflySprite, x - f.size / 2, y - f.size / 2, f.size, f.size);
        }
        fctx.globalAlpha = 1;
      }

      // Dust motes rise through the morning light, brightest near the sun
      if (moteA > 0.001) {
        const sx = (interp(prog, SUN_X_T, SUN_X) / 100) * w;
        const sy = (interp(prog, SUN_Y_T, SUN_Y) / 100) * h;
        const reach = Math.max(w, h) * 0.55;
        for (const m of motes) {
          m.y -= m.vy * dt;
          if (m.y < -20) {
            m.y = h + 20;
            m.x = Math.random() * w;
          }
          const x = m.x + Math.sin(s * m.sf + m.ph) * m.sway;
          const d = Math.hypot(x - sx, m.y - sy);
          const lit = Math.max(0, 1 - d / reach);
          const a = moteA * (0.12 + 0.88 * lit) * (0.7 + 0.3 * Math.sin(s * 2 + m.ph));
          if (a < 0.02) continue;
          fctx.globalAlpha = a;
          fctx.drawImage(moteSprite, x - m.r / 2, m.y - m.r / 2, m.r, m.r);
        }
        fctx.globalAlpha = 1;
      }
    };

    const tick = (time: number) => {
      frame = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (time - last) / 1000);
      last = time;
      const s = time / 1000;
      const prog = p.current;
      drawBack(s, dt, prog);
      drawFront(s, dt, prog);
    };

    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };

    seed();
    frame = requestAnimationFrame(tick);
    window.addEventListener('resize', seed);
    if (finePointer) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.documentElement.addEventListener('pointerleave', onLeave);
    }
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', seed);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return { backRef, frontRef };
}
