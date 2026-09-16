import React, { useRef, useEffect } from 'react';
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
  const springConfig = { stiffness: 120, damping: 20, mass: 0.5 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  // 3D rotations based on cursor position
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-12, 12]);
  const translateZ = useTransform(smoothY, [-0.5, 0, 0.5], [8, 20, 8]);

  // Throttled mouse move without synchronous layout reflows
  useEffect(() => {
    if (shouldReduceMotion) return;
    const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
    if (!isFinePointer) return;

    const container = containerRef.current;
    if (!container) return;

    let rect: DOMRect | null = null;
    let rafId: number | null = null;

    const updateRect = () => {
      if (container) rect = container.getBoundingClientRect();
    };
    updateRect();
    window.addEventListener('resize', updateRect, { passive: true });

    const handleMouseMove = (e: MouseEvent) => {
      if (!rect) return;
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        if (rect) {
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          rawX.set(Math.max(-0.5, Math.min(0.5, x)));
          rawY.set(Math.max(-0.5, Math.min(0.5, y)));
        }
        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener('resize', updateRect);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion, rawX, rawY]);

  // Headline words for "Get Your Projects"
  const words = [
    { text: 'Get', isGradient: false },
    { text: 'Your', isGradient: false },
    { text: 'Projects', isGradient: true },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative perspective-1200 py-2 sm:py-4 px-1 sm:px-2 select-none cursor-default max-w-full overflow-visible ${className}`}
      style={{ perspective: '1200px' }}
    >
      {/* Dynamic 3D Neon Backlight Aura (Desktop Only) */}
      {!shouldReduceMotion && (
        <div className="hidden sm:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-24 sm:h-32 rounded-full bg-gradient-to-r from-cyan-500/15 via-sky-400/20 to-blue-600/15 blur-2xl pointer-events-none -z-10" />
      )}

      {/* Floating Sparkles Accents */}
      {!shouldReduceMotion && (
        <>
          <div className="absolute top-0 right-[15%] pointer-events-none text-cyan-500/70 dark:text-cyan-400/80 z-20 hidden md:block">
            <Sparkles className="w-4 h-4 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
          </div>
          <div className="absolute bottom-2 left-[12%] pointer-events-none text-cyan-500/70 dark:text-cyan-400/80 z-20 hidden md:block">
            <Sparkles className="w-3.5 h-3.5 drop-shadow-[0_0_6px_rgba(6,182,212,0.6)]" />
          </div>
        </>
      )}

      {/* 3D Stage with smooth entrance */}
      <motion.div
        style={{
          rotateX: shouldReduceMotion ? 0 : rotateX,
          rotateY: shouldReduceMotion ? 0 : rotateY,
          z: shouldReduceMotion ? 0 : translateZ,
          transformStyle: 'preserve-3d',
        }}
        className="transform-style-3d will-change-transform"
      >
        <h1
          className="font-headline font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl tracking-tight text-center max-w-4xl mx-auto leading-[1.2] sm:leading-[1.12] flex flex-wrap items-center justify-center gap-x-2.5 sm:gap-x-4 md:gap-x-5 gap-y-1 sm:gap-y-2"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {words.map((item, wordIdx) => (
            <motion.span
              key={item.text}
              custom={wordIdx}
              initial={{ opacity: 0, y: 25, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: 0.05 + wordIdx * 0.12,
                duration: 0.6,
                type: 'spring',
                stiffness: 160,
                damping: 16,
              }}
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { scale: 1.05, transition: { duration: 0.2 } }
              }
              className="inline-block transform-style-3d cursor-default select-none"
              style={{
                transform: 'translateZ(20px)',
              }}
            >
              {item.isGradient ? (
                <span className="relative inline-block">
                  {/* Subtle 3D Depth Extrusion behind text */}
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 select-none pointer-events-none font-black text-cyan-600/30 dark:text-cyan-400/30 blur-[2px] translate-y-1 translate-x-0.5 hidden sm:inline-block"
                  >
                    {item.text}
                  </span>
                  {/* Main Iridescent Gradient */}
                  <span className="relative text-gradient-animated drop-shadow-[0_2px_12px_rgba(6,182,212,0.35)] dark:drop-shadow-[0_2px_16px_rgba(56,189,248,0.45)]">
                    {item.text}
                  </span>
                </span>
              ) : (
                <span className="relative inline-block text-zinc-950 dark:text-white transition-colors duration-300">
                  <span className="relative text-zinc-900 dark:text-zinc-50 drop-shadow-[0_1px_6px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_1px_12px_rgba(255,255,255,0.12)]">
                    {item.text}
                  </span>
                </span>
              )}
            </motion.span>
          ))}
        </h1>

        {/* 3D Floating Floor Reflection (Desktop Only) */}
        {!shouldReduceMotion && (
          <div
            style={{ transform: 'translateZ(-20px) scaleY(0.35)' }}
            className="w-48 sm:w-80 h-4 mx-auto mt-2 rounded-full bg-gradient-to-r from-transparent via-cyan-500/25 dark:via-cyan-400/30 to-transparent blur-md pointer-events-none hidden sm:block"
          />
        )}
      </motion.div>
    </div>
  );
};

export default Hero3DTitle;
