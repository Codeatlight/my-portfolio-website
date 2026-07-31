import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionTemplate, useMotionValueEvent } from 'framer-motion';

export function useSkyPhase(): 'dusk' | 'night' | 'dawn' {
  const { scrollYProgress } = useScroll();
  const [phase, setPhase] = useState<'dusk' | 'night' | 'dawn'>('dusk');

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.25) setPhase('dusk');
    else if (latest < 0.75) setPhase('night');
    else setPhase('dawn');
  });

  return phase;
}

export function SkyBackground() {
  const { scrollYProgress } = useScroll();

  // --------------------------------------------------------
  // SKY GRADIENT
  // --------------------------------------------------------
  const skyInput = [0, 0.05, 0.15, 0.25, 0.30, 0.50, 0.70, 0.75, 0.85, 0.95, 1.0];
  const topColors = [
    '#FF8C42', '#C84B6B', '#7B2D8E', '#1a1040', '#0A0E27', '#030510', '#0A0E27', '#1a1a3e', '#4A1942', '#FF9A76', '#87CEEB'
  ];
  const bottomColors = [
    '#FF6B35', '#FF6B35', '#E8567F', '#2D3561', '#0F1535', '#0A0E27', '#0F1535', '#2D3561', '#E8567F', '#FFD700', '#FF9A76'
  ];
  // Approximated mid colors for a smoother blend
  const midColors = [
    '#FF7A3C', '#E35A50', '#B24287', '#242351', '#0D122F', '#070A1C', '#0D122F', '#242850', '#9A3861', '#FFB63B', '#C3B5B1'
  ];

  const colorTop = useTransform(scrollYProgress, skyInput, topColors);
  const colorBottom = useTransform(scrollYProgress, skyInput, bottomColors);
  const colorMid = useTransform(scrollYProgress, skyInput, midColors);
  const bg = useMotionTemplate`linear-gradient(180deg, ${colorTop} 0%, ${colorMid} 50%, ${colorBottom} 100%)`;

  // --------------------------------------------------------
  // MOUNTAINS
  // --------------------------------------------------------
  const mountInput = [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1.0];
  const backMountColors = ['#5C3D6E', '#4C305C', '#0D1225', '#0A0D1A', '#0D1225', '#5C405C', '#8B6B7F'];
  const midMountColors = ['#3D2352', '#301840', '#080E1F', '#050A14', '#080E1F', '#462E40', '#6B4D5F'];
  const frontMountColors = ['#2A1538', '#1F0F2A', '#050810', '#02050A', '#050810', '#301F2A', '#4A3040'];

  const backMountFill = useTransform(scrollYProgress, mountInput, backMountColors);
  const midMountFill = useTransform(scrollYProgress, mountInput, midMountColors);
  const frontMountFill = useTransform(scrollYProgress, mountInput, frontMountColors);

  // --------------------------------------------------------
  // CELESTIAL BODIES (Sun, Moon, Dawn Sun)
  // --------------------------------------------------------
  // DUSK SUN: visible 0→0.15, fully gone by 0.20 — MUST stay hidden after
  const duskSunX = useTransform(scrollYProgress, [0, 0.20], ['70%', '78%']);
  const duskSunY = useTransform(scrollYProgress, [0, 0.20], ['55%', '82%']);
  const duskSunOpacity = useTransform(scrollYProgress, [0, 0.12, 0.20, 0.25, 1.0], [1, 0.7, 0, 0, 0]);

  // MOON: appears 0.28→0.35, visible until 0.65, fully gone by 0.72 (before dawn sun)
  const moonX = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.38, 0.50, 0.62, 0.68, 0.72],
    ['5%', '18%', '25%', '50%', '75%', '82%', '95%']
  );
  const moonY = useTransform(
    scrollYProgress,
    [0.28, 0.33, 0.38, 0.50, 0.62, 0.68, 0.72],
    ['82%', '45%', '22%', '12%', '22%', '45%', '82%']
  );
  const moonOpacity = useTransform(
    scrollYProgress,
    [0.25, 0.28, 0.35, 0.65, 0.72],
    [0, 0, 1, 1, 0]
  );

  // DAWN SUN: rises from LEFT side (like moon), arcs right-upward
  const dawnSunX = useTransform(
    scrollYProgress,
    [0.76, 0.80, 0.85, 0.92, 1.0],
    ['15%', '18%', '25%', '35%', '40%']
  );
  const dawnSunY = useTransform(
    scrollYProgress,
    [0.76, 0.80, 0.85, 0.92, 1.0],
    ['82%', '60%', '42%', '30%', '25%']
  );
  const dawnSunOpacity = useTransform(scrollYProgress, [0.74, 0.76, 0.82, 1.0], [0, 0, 0.8, 1]);
  const godRaysOpacity = useTransform(scrollYProgress, [0.82, 0.90, 1.0], [0, 0.25, 0.45]);

  // --------------------------------------------------------
  // STARS CANVAS
  // --------------------------------------------------------
  const starsOpacity = useTransform(
    scrollYProgress,
    [0.2, 0.25, 0.35, 0.65, 0.75, 0.8],
    [0, 0, 1, 1, 0, 0]
  );
  
  const starsOpacityRef = useRef(0);
  useMotionValueEvent(starsOpacity, "change", (val) => {
    starsOpacityRef.current = val;
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      initStars();
    };
    window.addEventListener('resize', handleResize);

    interface Star {
      x: number;
      y: number;
      size: number;
      speed: number;
      opacity: number;
      twinkleDir: number;
    }

    interface ShootingStar {
      x: number;
      y: number;
      length: number;
      speedX: number;
      speedY: number;
      opacity: number;
      active: boolean;
    }

    let stars: Star[] = [];
    let shootingStar: ShootingStar = {
      x: 0, y: 0, length: 0, speedX: 0, speedY: 0, opacity: 0, active: false
    };

    const initStars = () => {
      stars = [];
      for (let i = 0; i < 150; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height * 0.7,
          size: Math.random() * 2 + 0.5,
          speed: Math.random() * 0.02 + 0.005,
          opacity: Math.random(),
          twinkleDir: Math.random() > 0.5 ? 1 : -1
        });
      }
    };
    initStars();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      
      const currentOpacity = starsOpacityRef.current;
      if (currentOpacity <= 0) return; // Skip logic/rendering if invisible
      
      ctx.clearRect(0, 0, width, height);
      ctx.globalAlpha = currentOpacity;

      // Draw Milky Way
      const grad = ctx.createLinearGradient(0, 0, width, height * 0.7);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.03)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height * 0.7);

      // Draw Stars
      stars.forEach(star => {
        star.opacity += star.speed * star.twinkleDir;
        if (star.opacity >= 1) {
          star.opacity = 1;
          star.twinkleDir = -1;
        } else if (star.opacity <= 0.1) {
          star.opacity = 0.1;
          star.twinkleDir = 1;
        }

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
        ctx.fill();
      });

      // Shooting Star Logic
      if (!shootingStar.active && Math.random() < 0.005) {
        shootingStar = {
          x: Math.random() * width * 0.8 + width * 0.2,
          y: Math.random() * height * 0.3,
          length: Math.random() * 100 + 50,
          speedX: -(Math.random() * 10 + 15),
          speedY: Math.random() * 5 + 5,
          opacity: 1,
          active: true
        };
      }

      if (shootingStar.active) {
        shootingStar.x += shootingStar.speedX;
        shootingStar.y += shootingStar.speedY;
        shootingStar.opacity -= 0.02;

        if (shootingStar.opacity <= 0) {
          shootingStar.active = false;
        } else {
          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(shootingStar.x - shootingStar.speedX * 5, shootingStar.y - shootingStar.speedY * 5);
          ctx.strokeStyle = `rgba(255, 255, 255, ${shootingStar.opacity})`;
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // --------------------------------------------------------
  // CLOUDS & FOG
  // --------------------------------------------------------
  const cloudInput = [0, 0.25, 0.5, 0.75, 1.0];
  const cloudOpacity = useTransform(scrollYProgress, cloudInput, [0.5, 0.1, 0.05, 0.1, 0.5]);
  const cloudColor = useTransform(scrollYProgress, cloudInput, [
    'rgba(255, 200, 180, 1)',
    'rgba(100, 100, 120, 1)',
    'rgba(50, 50, 60, 1)',
    'rgba(100, 100, 120, 1)',
    'rgba(255, 220, 200, 1)'
  ]);
  const fogOpacity = useTransform(scrollYProgress, cloudInput, [0.2, 0.1, 0.05, 0.1, 0.2]);

  // --------------------------------------------------------
  // BIRDS (Dawn only)
  // --------------------------------------------------------
  const birdsOpacity = useTransform(scrollYProgress, [0.75, 0.8, 0.9, 1.0], [0, 0, 1, 1]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Sky Gradient Background */}
      <motion.div className="absolute inset-0" style={{ background: bg }} />

      {/* Stars Canvas */}
      <motion.canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: starsOpacity }}
      />

      {/* Clouds Layer */}
      <motion.div 
        className="absolute top-[10%] w-[200%] h-32 flex justify-around animate-[drift_60s_linear_infinite]"
        style={{ opacity: cloudOpacity }}
      >
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={`cloud-${i}`}
            className="w-48 h-12 rounded-full blur-xl"
            style={{ backgroundColor: cloudColor, marginTop: i % 2 === 0 ? '20px' : '0px' }}
          />
        ))}
      </motion.div>
      <style>{`
        @keyframes drift {
          from { transform: translateX(0%); }
          to { transform: translateX(-50%); }
        }
        @keyframes fly {
          from { transform: translateX(100vw) translateY(20vh); }
          to { transform: translateX(-20vw) translateY(10vh); }
        }
      `}</style>

      {/* Dusk Sun */}
      <motion.div
        className="absolute w-20 h-20 rounded-full"
        style={{
          left: duskSunX,
          top: duskSunY,
          opacity: duskSunOpacity,
          background: 'radial-gradient(circle, #FFE484 0%, #FF8C42 100%)',
          boxShadow: '0 0 60px 30px rgba(255,140,66,0.4)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Moon */}
      <motion.div
        className="absolute w-16 h-16 rounded-full bg-gradient-to-br from-gray-100 to-gray-400 overflow-hidden"
        style={{
          left: moonX,
          top: moonY,
          opacity: moonOpacity,
          boxShadow: '0 0 40px 15px rgba(200, 220, 255, 0.3)',
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Moon Craters */}
        <div className="absolute w-3 h-3 rounded-full bg-black/10 top-3 left-4" />
        <div className="absolute w-4 h-4 rounded-full bg-black/10 top-8 left-8" />
        <div className="absolute w-2 h-2 rounded-full bg-black/10 top-6 left-2" />
      </motion.div>

      {/* Dawn Sun */}
      <motion.div
        className="absolute w-24 h-24 rounded-full"
        style={{
          left: dawnSunX,
          top: dawnSunY,
          opacity: dawnSunOpacity,
          background: 'radial-gradient(circle, #FFFDE4 0%, #FFD700 50%, #FF9A40 100%)',
          boxShadow: '0 0 100px 50px rgba(255, 200, 50, 0.4), 0 0 200px 100px rgba(255, 150, 50, 0.2)',
          transform: 'translate(-50%, -50%)'
        }}
      />

      {/* Dawn God Rays — fan-shaped light beams radiating upward */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          left: dawnSunX,
          top: dawnSunY,
          opacity: godRaysOpacity,
          transform: 'translate(-50%, -50%)'
        }}
      >
        {/* Individual light beams fanning upward */}
        {[-40, -25, -10, 5, 20, 35].map((angle, i) => (
          <div
            key={`ray-${i}`}
            className="absolute bottom-1/2 left-1/2"
            style={{
              width: '3px',
              height: `${180 + i * 25}px`,
              background: `linear-gradient(to top, rgba(255,220,100,0.6), rgba(255,200,80,0.2), transparent)`,
              transformOrigin: 'bottom center',
              transform: `translateX(-50%) rotate(${angle}deg)`,
              filter: 'blur(3px)',
            }}
          />
        ))}
        {/* Warm atmospheric halo */}
        <div
          className="absolute rounded-full"
          style={{
            width: '500px',
            height: '300px',
            left: '-250px',
            top: '-200px',
            background: 'radial-gradient(ellipse, rgba(255,200,100,0.15) 0%, rgba(255,150,50,0.05) 50%, transparent 70%)',
          }}
        />
      </motion.div>

      {/* Birds */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ opacity: birdsOpacity }}
      >
        <div className="absolute w-full h-full animate-[fly_40s_linear_infinite]">
          {/* Bird formation */}
          <div className="relative top-[20%] left-[50%]">
            {[
              { x: 0, y: 0 },
              { x: 30, y: 20 },
              { x: -30, y: 20 },
              { x: 60, y: 40 },
              { x: -60, y: 40 },
              { x: 90, y: 60 },
              { x: -90, y: 60 }
            ].map((pos, i) => (
              <div 
                key={`bird-${i}`} 
                className="absolute w-4 h-4 border-t-2 border-l-2 border-black/60 rotate-45"
                style={{ left: pos.x, top: pos.y }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Mountains Container */}
      <div className="absolute bottom-0 w-full h-[30vh] min-h-[300px]">
        {/* Back Mountains */}
        <motion.svg
          className="absolute bottom-0 w-full h-full"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          style={{ fill: backMountFill }}
        >
          <path d="M0,320 L0,200 C120,160,240,220,360,180 C480,140,560,190,720,150 C880,110,960,170,1080,140 C1200,110,1320,180,1440,160 L1440,320 Z" />
        </motion.svg>

        {/* Mid Mountains */}
        <motion.svg
          className="absolute bottom-0 w-full h-[85%]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          style={{ fill: midMountFill }}
        >
          <path d="M0,320 L0,230 C100,200,200,260,350,190 C500,120,600,210,720,170 C840,130,900,100,1050,160 C1200,220,1300,170,1440,200 L1440,320 Z" />
        </motion.svg>

        {/* Front Mountains */}
        <motion.svg
          className="absolute bottom-0 w-full h-[70%]"
          preserveAspectRatio="none"
          viewBox="0 0 1440 320"
          style={{ fill: frontMountFill }}
        >
          <path d="M0,320 L0,260 C80,240,160,280,300,230 C440,180,520,250,680,200 C840,150,920,220,1100,190 C1280,160,1360,240,1440,220 L1440,320 Z" />
        </motion.svg>
        
        {/* Atmospheric Fog at mountain base */}
        <motion.div 
          className="absolute bottom-0 w-full h-[30%] bg-gradient-to-t from-white/30 to-transparent"
          style={{ opacity: fogOpacity }}
        />
      </div>
    </div>
  );
}

export default SkyBackground;
