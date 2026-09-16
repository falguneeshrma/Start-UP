import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface Hero3DTitleProps {
  className?: string;
}

export const Hero3DTitle: React.FC<Hero3DTitleProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Mouse coordinate values (-0.5 to 0.5)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Smooth springs for cinematic tactile 3D movement
  const springConfig = { stiffness: 160, damping: 18, mass: 0.6 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // 3D rotations based on cursor position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [14, -14]); // Tilt up/down
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-16, 16]); // Tilt left/right
  const translateZ = useTransform(smoothY, [-0.5, 0, 0.5], [10, 26, 10]);

  // Dynamic light aura parallax in the background
  const auraX = useTransform(smoothX, [-0.5, 0.5], [-45, 45]);
  const auraY = useTransform(smoothY, [-0.5, 0.5], [-35, 35]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(x);
    rawY.set(y);
  };

  const handleMouseLeave = () => {
    rawX.set(0);
    rawY.set(0);
  };

  // Headline words for "Get Your Projects"
  const words = [
    { text: 'Get', isGradient: false },
    { text: 'Your', isGradient: false },
    { text: 'Projects', isGradient: true },
  ];

  // Floating ambient sparkles around the headline
  const ambientSparkles = [
    { top: '-10%', left: '8%', delay: 0, scale: 0.8 },
    { top: '15%', right: '6%', delay: 1.2, scale: 1 },
    { bottom: '-5%', left: '18%', delay: 0.6, scale: 0.7 },
    { top: '-15%', right: '22%', delay: 1.8, scale: 0.9 },
  ];

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative perspective-1200 py-4 sm:py-6 px-2 select-none cursor-default ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* 
        ═══════════════════════════════════════════════════════════
        DEPTH LAYER 1: Dynamic 3D Neon Backlight Aura & Radial Glow
        ═══════════════════════════════════════════════════════════
      */}
      {!shouldReduceMotion && (
        <>
          <motion.div
            style={{
              x: auraX,
              y: auraY,
            }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4/5 h-28 sm:h-36 rounded-full bg-gradient-to-r from-cyan-500/25 via-sky-400/30 to-blue-600/25 blur-3xl pointer-events-none -z-10"
          />
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent blur-2xl pointer-events-none" />
        </>
      )}

      {/* Floating Sparkles Accents */}
      {!shouldReduceMotion &&
        ambientSparkles.map((sparkle, idx) => (
          <motion.div
            key={idx}
            style={{
              top: sparkle.top,
              left: sparkle.left,
              right: sparkle.right,
              bottom: sparkle.bottom,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.9, 0.3],
              scale: [sparkle.scale * 0.9, sparkle.scale * 1.15, sparkle.scale * 0.9],
              rotate: [0, 45, 90],
            }}
            transition={{
              duration: 3 + idx * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: sparkle.delay,
            }}
            className="absolute pointer-events-none text-cyan-500/80 dark:text-cyan-400/90 z-20 hidden sm:block"
          >
            <Sparkles className="w-4 h-4 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
        ))}

      {/* 
        ═══════════════════════════════════════════════════════════
        DEPTH LAYER 2: 3D Tilting Stage with Kinetic Floating Wave
        ═══════════════════════════════════════════════════════════
      */}
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          z: shouldReduceMotion ? 0 : translateZ,
          transformStyle: 'preserve-3d',
        }}
        animate={
          shouldReduceMotion
            ? undefined
            : {
                y: [0, -6, 0],
              }
        }
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="transform-style-3d will-change-transform"
      >
        <h1
          className="font-headline font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight text-center max-w-4xl mx-auto leading-[1.15] sm:leading-[1.1] flex flex-wrap items-center justify-center gap-x-4 sm:gap-x-6 gap-y-2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {words.map((item, wordIdx) => (
            <motion.span
              key={item.text}
              custom={wordIdx}
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {
                  opacity: 0,
                  y: 40,
                  rotateX: 70,
                  scale: 0.82,
                },
                visible: (i: number) => ({
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                  transition: {
                    delay: 0.05 + i * 0.14,
                    duration: 0.85,
                    type: 'spring',
                    stiffness: 140,
                    damping: 14,
                  },
                }),
              }}
              className="inline-flex items-center transform-style-3d cursor-pointer select-none"
              style={{
                transform: 'translateZ(30px)',
              }}
            >
              {/* Individual letter bounce physics on hover */}
              {item.text.split('').map((char, charIdx) => {
                const globalCharIdx = wordIdx * 10 + charIdx;
                return (
                  <motion.span
                    key={`${char}-${charIdx}`}
                    whileHover={
                      shouldReduceMotion
                        ? undefined
                        : {
                            scale: 1.18,
                            y: -8,
                            z: 55,
                            rotateZ: (charIdx % 2 === 0 ? 3 : -3),
                            transition: { 
                              type: 'spring', 
                              stiffness: 400, 
                              damping: 10 
                            },
                          }
                    }
                    animate={
                      shouldReduceMotion
                        ? undefined
                        : {
                            y: [0, -3, 0],
                          }
                    }
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: globalCharIdx * 0.12,
                    }}
                    className="inline-block transform-style-3d will-change-transform"
                    style={{ transform: 'translateZ(20px)' }}
                  >
                    {item.isGradient ? (
                      <span className="relative inline-block">
                        {/* 3D Glowing Extrusion Behind the Letters */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 select-none pointer-events-none font-black text-cyan-600/35 dark:text-cyan-400/40 blur-[3px] translate-y-1.5 translate-x-0.5"
                          style={{ transform: 'translateZ(-15px)' }}
                        >
                          {char}
                        </span>
                        {/* Main High-Tech Animated Iridescent Gradient Letter */}
                        <span className="relative text-gradient-animated drop-shadow-[0_4px_16px_rgba(6,182,212,0.45)] dark:drop-shadow-[0_4px_24px_rgba(56,189,248,0.55)]">
                          {char}
                        </span>
                      </span>
                    ) : (
                      <span className="relative inline-block text-zinc-950 dark:text-white transition-colors duration-300">
                        {/* Subtle 3D Edge Bevel */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 select-none pointer-events-none font-black text-zinc-400/25 dark:text-black/70 translate-y-1"
                          style={{ transform: 'translateZ(-10px)' }}
                        >
                          {char}
                        </span>
                        <span className="relative text-zinc-900 dark:text-zinc-50 drop-shadow-[0_2px_10px_rgba(0,0,0,0.12)] dark:drop-shadow-[0_2px_18px_rgba(255,255,255,0.15)]">
                          {char}
                        </span>
                      </span>
                    )}
                  </motion.span>
                );
              })}
            </motion.span>
          ))}
        </h1>

        {/* 3D Floating Floor Shadow & Light Reflection underneath headline */}
        {!shouldReduceMotion && (
          <motion.div
            animate={{
              scaleX: [0.95, 1.08, 0.95],
              opacity: [0.35, 0.6, 0.35],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            style={{
              transform: 'translateZ(-25px) scaleY(0.35)',
            }}
            className="w-56 sm:w-96 h-5 mx-auto mt-2 rounded-full bg-gradient-to-r from-transparent via-cyan-500/30 dark:via-cyan-400/40 to-transparent blur-md pointer-events-none"
          />
        )}
      </motion.div>
    </div>
  );
};

export default Hero3DTitle;
