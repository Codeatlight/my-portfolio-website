import { useEffect, useRef } from 'react';
import { SUN_X, SUN_X_T, SUN_Y, SUN_Y_T, interp } from './skyTimeline';
import { useSkyCanvas } from './useSkyCanvas';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/*
 * The whole page is one evening: scroll progress is the clock.
 *   0.00 – 0.22  dusk: the sun sinks behind the ridges
 *   0.22 – 0.32  blue hour
 *   0.32 – 0.68  night: stars, milky way, the moon arcs overhead
 *   0.68 – 0.78  pre-dawn
 *   0.78 – 1.00  dawn: the sun rises on the left
 */

// --------------------------------------------------------
// PALETTE
// --------------------------------------------------------
const SKY_T = [0, 0.08, 0.18, 0.28, 0.4, 0.5, 0.6, 0.72, 0.82, 0.92, 1];
const SKY_TOP = ['#21173f', '#24153f', '#1a1439', '#11112e', '#080a20', '#05061a', '#080a20', '#131735', '#262855', '#34437c', '#3f5895'];
const SKY_MID = ['#9c3a6a', '#86305f', '#46224f', '#1e1b42', '#0d112c', '#090b22', '#0d112c', '#28234e', '#71396a', '#b8667f', '#d68a86'];
const SKY_LOW = ['#ff8a3d', '#f06d40', '#b2455c', '#392b58', '#141938', '#0d112c', '#141938', '#3c315c', '#cc5c76', '#fa9d68', '#ffc07e'];

const MOUNT_T = [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1];
const RANGES = [
  {
    // distant, hazy
    colors: ['#8a4670', '#5e3262', '#1b1a3b', '#10132b', '#1b1a3b', '#6b4677', '#a8768c'],
    height: 'h-full',
    depth: 4,
    path: 'M0,320 L0,190 L70,170 L130,182 L210,140 L260,152 L330,118 L400,150 L470,136 L540,160 L610,124 L700,96 L770,130 L840,118 L920,146 L990,110 L1060,128 L1130,100 L1210,140 L1290,122 L1370,150 L1440,132 L1440,320 Z',
  },
  {
    colors: ['#5b2c5c', '#47244e', '#14152f', '#0b0e21', '#14152f', '#4b2f5d', '#73496a'],
    height: 'h-[86%]',
    depth: 9,
    path: 'M0,320 L0,214 C60,196 110,170 170,178 C230,186 260,150 320,140 C380,130 420,176 490,180 C560,184 600,138 660,126 C720,114 770,160 840,168 C910,176 960,128 1030,120 C1100,112 1150,158 1220,162 C1290,166 1350,140 1440,150 L1440,320 Z',
  },
  {
    colors: ['#391b43', '#2f1737', '#0c0c21', '#070917', '#0c0c21', '#321f3e', '#4d3350'],
    height: 'h-[66%]',
    depth: 15,
    path: 'M0,320 L0,236 C80,226 120,196 200,190 C280,184 320,220 400,222 C480,224 540,176 620,168 C700,160 740,206 820,214 C900,222 960,186 1040,176 C1120,166 1180,206 1260,212 C1340,218 1390,196 1440,190 L1440,320 Z',
  },
  {
    // closest ridge, nearly black
    colors: ['#1b0e25', '#160b1f', '#060611', '#04040b', '#060611', '#1a1125', '#28192e'],
    height: 'h-[44%]',
    depth: 24,
    path: 'M0,320 L0,250 C70,246 120,226 190,232 C260,238 300,262 380,256 C460,250 500,222 580,226 C660,230 700,258 790,256 C880,254 920,226 1000,224 C1080,222 1130,252 1210,254 C1290,256 1360,236 1440,232 L1440,320 Z',
  },
];

// Accent colours exposed to the rest of the UI as CSS variables
const ACCENT_T = [0, 0.2, 0.3, 0.7, 0.8, 1];
const ACCENT_1 = ['#ffb15c', '#ffa25c', '#a9bcff', '#a9bcff', '#ffc56b', '#ffd27a'];
const ACCENT_2 = ['#f0567a', '#e5567f', '#c7a6ff', '#c7a6ff', '#ff8f70', '#ff8f70'];

/**
 * Mirrors a motion value into a document-level write, at most ~8 times a
 * second. Each write to a root CSS variable re-styles the whole page, so doing
 * it every scroll frame is expensive; colour drift this slow doesn't need it.
 */
function useThrottledWrite(value: MotionValue<string>, write: (v: string) => void, interval = 120) {
  const last = useRef(0);
  const pending = useRef<number | null>(null);

  useEffect(() => {
    write(value.get());
    return () => {
      if (pending.current) window.clearTimeout(pending.current);
    };
  }, [value, write]);

  useMotionValueEvent(value, 'change', () => {
    const now = performance.now();
    if (now - last.current >= interval) {
      last.current = now;
      write(value.get());
    } else if (!pending.current) {
      // Trailing write so the final colour is always applied
      pending.current = window.setTimeout(() => {
        pending.current = null;
        last.current = performance.now();
        write(value.get());
      }, interval);
    }
  });
}

const setAccent = (v: string) => document.documentElement.style.setProperty('--accent', v);
const setAccent2 = (v: string) => document.documentElement.style.setProperty('--accent-2', v);
const setThemeColor = (v: string) => document.querySelector('meta[name="theme-color"]')?.setAttribute('content', v);

export default function SkyBackground() {
  const { scrollYProgress: t } = useScroll();

  // --------------------------------------------------------
  // SKY
  // --------------------------------------------------------
  const top = useTransform(t, SKY_T, SKY_TOP);
  const mid = useTransform(t, SKY_T, SKY_MID);
  const low = useTransform(t, SKY_T, SKY_LOW);
  const sky = useMotionTemplate`linear-gradient(180deg, ${top} 0%, ${mid} 52%, ${low} 82%)`;

  // Darkens the reading column while the sky is bright
  const scrimOpacity = useTransform(t, [0, 0.18, 0.3, 0.7, 0.82, 1], [0.9, 0.55, 0, 0, 0.55, 1]);

  useThrottledWrite(useTransform(t, ACCENT_T, ACCENT_1), setAccent);
  useThrottledWrite(useTransform(t, ACCENT_T, ACCENT_2), setAccent2);
  // Mobile browser chrome follows the sky
  useThrottledWrite(top, setThemeColor, 400);

  // --------------------------------------------------------
  // POINTER PARALLAX
  // --------------------------------------------------------
  const pointer = useMotionValue(0);
  const px = useSpring(pointer, { stiffness: 40, damping: 18 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => pointer.set((e.clientX / window.innerWidth) * 2 - 1);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [pointer]);

  // --------------------------------------------------------
  // SUN — one body: sets on the right, rises again on the left
  // --------------------------------------------------------
  // Positions are driven through transforms (vw/vh) rather than left/top so moving them never triggers layout
  const sunLeft = useTransform(t, SUN_X_T, SUN_X.map((v) => `${v}%`));
  const sunVw = useTransform(t, SUN_X_T, SUN_X.map((v) => `${v}vw`));
  const sunVh = useTransform(t, SUN_Y_T, SUN_Y.map((v) => `${v}vh`));
  const sunCore = useTransform(t, [0, 0.15, 0.22, 0.78, 0.9, 1], ['#ff9f45', '#ff7840', '#ff5a3c', '#ff6a3c', '#ffb04f', '#ffd27a']);
  const sunGlow = useTransform(t, [0, 0.22, 0.78, 1], ['rgba(255,140,70,0.55)', 'rgba(255,90,60,0.45)', 'rgba(255,110,60,0.45)', 'rgba(255,200,110,0.55)']);
  const sunBg = useMotionTemplate`radial-gradient(circle at 50% 42%, #fff7dc 0%, #ffe3a3 22%, ${sunCore} 62%, ${sunCore} 100%)`;
  // The halo below carries the wide glow; one tight shadow keeps the repainted area small
  const sunShadow = useMotionTemplate`0 0 60px 20px ${sunGlow}`;
  const sunHalo = useMotionTemplate`radial-gradient(circle, ${sunGlow} 0%, transparent 62%)`;
  const sunX = useTransform(px, (v) => v * -6);
  const raysOpacity = useTransform(t, [0, 0.14, 0.24, 0.78, 0.9, 1], [0.55, 0.25, 0, 0, 0.4, 0.75]);

  // Warm band of light along the horizon, centred under the sun
  const horizonGlow = useMotionTemplate`radial-gradient(60% 100% at ${sunLeft} 100%, ${sunGlow}, transparent 70%)`;
  const horizonOpacity = useTransform(t, [0, 0.16, 0.28, 0.72, 0.84, 1], [1, 0.8, 0, 0, 0.8, 1]);

  // --------------------------------------------------------
  // MOON
  // --------------------------------------------------------
  const moonVw = useTransform(t, [0.26, 0.38, 0.5, 0.62, 0.74], ['8vw', '26vw', '50vw', '74vw', '92vw']);
  const moonVh = useTransform(t, [0.26, 0.38, 0.5, 0.62, 0.74], ['78vh', '30vh', '16vh', '30vh', '78vh']);
  const moonOpacity = useTransform(t, [0.24, 0.32, 0.66, 0.74], [0, 1, 1, 0]);
  const moonX = useTransform(px, (v) => v * -4);

  // --------------------------------------------------------
  // STARS, CONSTELLATIONS, FIREFLIES & MORNING MOTES (canvas)
  // --------------------------------------------------------
  const { backRef, frontRef } = useSkyCanvas(t);

  // --------------------------------------------------------
  // SUNRISE LENS FLARE — static discs strung between the sun and screen centre
  // --------------------------------------------------------
  const flareOpacity = useTransform(t, [0.84, 0.93, 1], [0, 0.75, 1]);

  // --------------------------------------------------------
  // CLOUDS, FOG & BIRDS
  // --------------------------------------------------------
  // Two cloud decks with fixed colours, cross-faded by opacity. Because neither
  // deck's paint ever changes, the blur is rasterized once and the drift is a
  // pure compositor transform.
  const warmCloudOpacity = useTransform(t, [0, 0.2, 0.32, 0.68, 0.8, 1], [0.8, 0.5, 0, 0, 0.5, 0.8]);
  const nightCloudOpacity = useTransform(t, [0.18, 0.32, 0.68, 0.82], [0, 0.35, 0.35, 0]);
  const fogColor = useTransform(t, MOUNT_T, ['rgba(255,150,110,0.35)', 'rgba(200,90,120,0.25)', 'rgba(60,60,110,0.15)', 'rgba(40,40,90,0.12)', 'rgba(60,60,110,0.15)', 'rgba(230,130,140,0.25)', 'rgba(255,200,160,0.35)']);
  const fog = useMotionTemplate`linear-gradient(to top, ${fogColor}, transparent)`;
  const birdsOpacity = useTransform(t, [0, 0.1, 0.18, 0.82, 0.9, 1], [0.8, 0.6, 0, 0, 0.6, 0.85]);
  const dawnFlockOpacity = useTransform(t, [0.84, 0.92, 1], [0, 0.7, 0.85]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div className="absolute inset-0" style={{ background: sky }} />

      <canvas ref={backRef} className="absolute inset-0 h-full w-full" />

      {/* Horizon glow */}
      <motion.div
        className="absolute inset-x-0 bottom-[14vh] h-[55vh]"
        style={{ background: horizonGlow, opacity: horizonOpacity }}
      />

      {/* Moon */}
      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x: moonVw, y: moonVh, opacity: moonOpacity }}>
        <motion.div className="-translate-x-1/2 -translate-y-1/2 relative" style={{ x: moonX }}>
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(190,205,255,0.22)_0%,transparent_65%)]" />
          <div
            className="relative h-16 w-16 sm:h-20 sm:w-20 overflow-hidden rounded-full"
            style={{
              background: 'radial-gradient(circle at 38% 35%, #fbfbff 0%, #dfe4f2 45%, #aab2c8 100%)',
              boxShadow: '0 0 40px 10px rgba(200,215,255,0.28), inset -8px -6px 18px rgba(60,70,110,0.35)',
            }}
          >
            <span className="absolute left-[22%] top-[24%] h-3 w-3 rounded-full bg-slate-500/20" />
            <span className="absolute left-[55%] top-[48%] h-4 w-4 rounded-full bg-slate-500/20" />
            <span className="absolute left-[30%] top-[62%] h-2 w-2 rounded-full bg-slate-500/25" />
            <span className="absolute left-[64%] top-[22%] h-2 w-2 rounded-full bg-slate-500/15" />
          </div>
        </motion.div>
      </motion.div>

      {/* Sun, rays & halo */}
      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x: sunVw, y: sunVh }}>
        <motion.div className="relative -translate-x-1/2 -translate-y-1/2" style={{ x: sunX }}>
          <motion.div
            className="absolute left-1/2 top-1/2 h-[56rem] w-[56rem] -translate-x-1/2 -translate-y-1/2"
            style={{
              opacity: raysOpacity,
              background: 'repeating-conic-gradient(from 0deg, rgba(255,222,170,0.09) 0deg 2.5deg, transparent 2.5deg 12deg)',
              maskImage: 'radial-gradient(circle, black 8%, transparent 55%)',
              WebkitMaskImage: 'radial-gradient(circle, black 8%, transparent 55%)',
            }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 h-[38rem] w-[38rem] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: sunHalo }}
          />
          <motion.div
            className="relative h-28 w-28 sm:h-36 sm:w-36 rounded-full"
            style={{ background: sunBg, boxShadow: sunShadow }}
          />
        </motion.div>
      </motion.div>

      {/* Reading scrim */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_45%,rgba(10,8,22,0.45),transparent_75%)]"
        style={{ opacity: scrimOpacity }}
      />

      {/* Clouds */}
      <CloudDeck opacity={warmCloudOpacity} lit="#ffb38a" shade="#7a3a6e" />
      <CloudDeck opacity={nightCloudOpacity} lit="#3a3a62" shade="#1a1a34" />

      {/* Birds: one flock at dusk and dawn, and a second, higher flock heading the other way at dawn */}
      <motion.div className="absolute inset-x-0 top-[22%]" style={{ opacity: birdsOpacity }}>
        <Flock animation="animate-[bird-flight_48s_linear_infinite]" birds={FLOCK_EVENING} />
      </motion.div>
      <motion.div className="absolute inset-x-0 top-[13%]" style={{ opacity: dawnFlockOpacity }}>
        <Flock animation="animate-[bird-flight-east_36s_linear_infinite] [animation-delay:-9s]" birds={FLOCK_DAWN} />
      </motion.div>

      {/* Mountain ranges */}
      <div className="absolute inset-x-0 bottom-0 h-[32vh] min-h-[260px]">
        {RANGES.map((range, i) => (
          <MountainRange key={i} t={t} px={px} {...range} />
        ))}
        <motion.div className="absolute inset-x-0 bottom-0 h-1/3" style={{ background: fog }} />
      </div>

      <canvas ref={frontRef} className="absolute inset-0 h-full w-full" />

      <motion.div className="absolute inset-0" style={{ opacity: flareOpacity }}>
        {FLARES.map((f, i) => (
          <FlarePiece key={i} t={t} px={px} {...f} />
        ))}
      </motion.div>
    </div>
  );
}

function MountainRange({
  t,
  px,
  colors,
  height,
  depth,
  path,
}: {
  t: MotionValue<number>;
  px: MotionValue<number>;
  colors: string[];
  height: string;
  depth: number;
  path: string;
}) {
  const fill = useTransform(t, MOUNT_T, colors);
  const x = useTransform(px, (v) => v * -depth);
  return (
    <motion.svg
      className={`absolute bottom-0 -left-[3%] w-[106%] ${height}`}
      preserveAspectRatio="none"
      viewBox="0 0 1440 320"
      style={{ fill, x }}
    >
      <path d={path} />
    </motion.svg>
  );
}

const CLOUDS = [
  { l: '4%', t: '10%', w: '26rem', h: '4.5rem' },
  { l: '30%', t: '48%', w: '34rem', h: '5rem' },
  { l: '62%', t: '18%', w: '22rem', h: '3.5rem' },
  { l: '80%', t: '60%', w: '28rem', h: '4rem' },
];

function CloudDeck({ opacity, lit, shade }: { opacity: MotionValue<number>; lit: string; shade: string }) {
  const background = `radial-gradient(60% 70% at 50% 70%, ${lit} 0%, ${shade} 55%, transparent 72%)`;
  return (
    <motion.div className="absolute inset-x-0 top-[12%] h-[30vh]" style={{ opacity }}>
      <div className="absolute inset-y-0 left-0 flex w-[200%] animate-[cloud-drift_140s_linear_infinite] will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="relative h-full w-1/2">
            {CLOUDS.map((c, i) => (
              <div
                key={i}
                className="absolute rounded-[50%] blur-2xl"
                style={{ left: c.l, top: c.t, width: c.w, height: c.h, background }}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/** k: position along the sun → centre axis (1 = centre, >1 = past it). */
const FLARES = [
  { k: 0.32, size: '3.5rem', background: 'radial-gradient(circle, transparent 58%, rgba(255,220,170,0.28) 64%, transparent 72%)' },
  { k: 0.55, size: '1.1rem', background: 'radial-gradient(circle, rgba(255,214,150,0.55), transparent 70%)' },
  { k: 0.78, size: '5.5rem', background: 'radial-gradient(circle, rgba(255,170,120,0.16), transparent 70%)' },
  { k: 1.05, size: '2.2rem', background: 'rgba(170,215,255,0.12)', hex: true },
  { k: 1.35, size: '8rem', background: 'radial-gradient(circle, transparent 55%, rgba(255,205,160,0.12) 62%, transparent 70%)' },
  { k: 1.6, size: '1.4rem', background: 'radial-gradient(circle, rgba(200,230,255,0.4), transparent 70%)' },
];

function FlarePiece({
  t,
  px,
  k,
  size,
  background,
  hex,
}: {
  t: MotionValue<number>;
  px: MotionValue<number>;
  k: number;
  size: string;
  background: string;
  hex?: boolean;
}) {
  // The axis bends toward the cursor a little, like a real lens catching light
  const x = useTransform([t, px], ([p, m]: number[]) => {
    const sx = interp(p, SUN_X_T, SUN_X);
    return `${sx + (50 + m * 10 - sx) * k}vw`;
  });
  const y = useTransform(t, (p) => {
    const sy = interp(p, SUN_Y_T, SUN_Y);
    return `${sy + (42 - sy) * k}vh`;
  });
  return (
    <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x, y }}>
      <div
        className="-translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: size,
          height: size,
          background,
          clipPath: hex ? 'polygon(25% 5%, 75% 5%, 100% 50%, 75% 95%, 25% 95%, 0 50%)' : undefined,
        }}
      />
    </motion.div>
  );
}

const FLOCK_EVENING = [
  { x: 0, y: 0, s: 1 },
  { x: 34, y: 16, s: 0.85 },
  { x: -30, y: 20, s: 0.8 },
  { x: 66, y: 34, s: 0.7 },
  { x: 110, y: 8, s: 0.6 },
];

const FLOCK_DAWN = [
  { x: 0, y: 10, s: 0.8 },
  { x: -36, y: 0, s: 0.7 },
  { x: -70, y: 18, s: 0.65 },
  { x: -104, y: 6, s: 0.6 },
  { x: -140, y: 26, s: 0.55 },
  { x: -176, y: 12, s: 0.5 },
  { x: -212, y: 30, s: 0.5 },
];

function Flock({ animation, birds }: { animation: string; birds: { x: number; y: number; s: number }[] }) {
  return (
    <div className={animation}>
      {birds.map((b, i) => (
        <svg key={i} viewBox="0 0 24 10" className="absolute h-3 w-7" style={{ left: b.x, top: b.y, scale: b.s }}>
          <path
            d="M0 6 Q6 0 12 6 Q18 0 24 6"
            fill="none"
            stroke="rgba(20,12,30,0.75)"
            strokeWidth="1.6"
            strokeLinecap="round"
            className="origin-center animate-[wing-flap_0.9s_ease-in-out_infinite]"
            style={{ animationDelay: `${i * 0.13}s` }}
          />
        </svg>
      ))}
    </div>
  );
}
