import React, { useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue, useReducedMotion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';

interface ScrollMotionBackgroundProps {
  className?: string;
  enableInteractiveGlow?: boolean;
}

export const ScrollMotionBackground: React.FC<ScrollMotionBackgroundProps> = ({
  className = '',
  enableInteractiveGlow = true,
}) => {
  const { isDark } = useTheme();
  const shouldReduceMotion = useReducedMotion();

  // Pure motion values (no React re-renders on mousemove!)
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  // Mouse tracking with zero React state overhead, disabled on touch screens
  useEffect(() => {
    if (shouldReduceMotion) return;
    const isTouch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let rafId: number | null = null;
    const handleMouseMove = (e: MouseEvent) => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        const { innerWidth, innerHeight } = window;
        rawX.set((e.clientX / innerWidth - 0.5) * 16);
        rawY.set((e.clientY / innerHeight - 0.5) * 16);
        rafId = null;
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [shouldReduceMotion, rawX, rawY]);

  // Spring smoothed mouse offset
  const springX = useSpring(rawX, { stiffness: 45, damping: 25 });
  const springY = useSpring(rawY, { stiffness: 45, damping: 25 });

  // Parallax with scroll
  const { scrollY } = useScroll();
  const scrollYTransform = useTransform(scrollY, [0, 3000], [0, -120]);
  const smoothScrollY = useSpring(scrollYTransform, { stiffness: 80, damping: 28 });

  // Combined vertical translation (mouse drift + scroll parallax)
  const combinedY = useTransform(
    [smoothScrollY, springY],
    ([scrollVal, mouseVal]: number[]) => (scrollVal || 0) + (mouseVal || 0)
  );

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500 will-change-transform ${
        isDark ? 'bg-[#040814]' : 'bg-[#f4f7fb]'
      } ${className}`}
      style={{ transform: 'translateZ(0)' }}
    >
      {/* 
        ═══════════════════════════════════════════════════════════
        1. MAIN CIRCUIT BOARD IMAGE LAYER
        ═══════════════════════════════════════════════════════════
      */}
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : springX,
          y: shouldReduceMotion ? 0 : combinedY,
        }}
        className="absolute -inset-[5%] w-[110%] h-[110%] will-change-transform"
      >
        <div className="w-full h-full relative">
          <img
            src="/circuit-bg.jpg"
            alt=""
            decoding="async"
            className={`w-full h-full object-cover object-center transition-opacity duration-700 ${
              isDark
                ? 'opacity-80 brightness-105 contrast-125'
                : 'opacity-25 brightness-110 contrast-110 saturate-150 mix-blend-multiply'
            }`}
            draggable={false}
          />
        </div>
      </motion.div>

      {/* 
        ═══════════════════════════════════════════════════════════
        2. GLOWING ENERGY NODES (GPU-friendly, desktop only for 60fps)
        ═══════════════════════════════════════════════════════════
      */}
      {enableInteractiveGlow && !shouldReduceMotion && (
        <div className="hidden sm:block absolute inset-0 pointer-events-none">
          {/* Cyan Node: Top Left Cluster */}
          <div
            className={`absolute top-[18%] left-[24%] w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl pointer-events-none transition-opacity duration-700 ${
              isDark ? 'bg-cyan-400/20 opacity-75' : 'bg-cyan-400/15 opacity-40'
            }`}
          />

          {/* Cyan Node: Upper Center Track */}
          <div
            className={`absolute top-[28%] left-[34%] w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg pointer-events-none transition-opacity duration-700 ${
              isDark ? 'bg-cyan-400/25 opacity-70' : 'bg-cyan-400/15 opacity-35'
            }`}
          />

          {/* Electric Blue Node: Upper Right Track */}
          <div
            className={`absolute top-[20%] right-[30%] w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl pointer-events-none transition-opacity duration-700 ${
              isDark ? 'bg-blue-500/20 opacity-70' : 'bg-blue-500/10 opacity-30'
            }`}
          />

          {/* Cyan Node: Bottom Left Bus */}
          <div
            className={`absolute bottom-[28%] left-[25%] w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full blur-xl pointer-events-none transition-opacity duration-700 ${
              isDark ? 'bg-cyan-400/20 opacity-70' : 'bg-cyan-400/15 opacity-35'
            }`}
          />

          {/* Bottom Center Node */}
          <div
            className={`absolute bottom-[21%] left-[48%] w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full blur-lg pointer-events-none transition-opacity duration-700 ${
              isDark ? 'bg-blue-400/20 opacity-60' : 'bg-blue-400/10 opacity-30'
            }`}
          />
        </div>
      )}

      {/* 
        ═══════════════════════════════════════════════════════════
        3. THEME-AWARE CONTRAST VEIL & VIGNETTE (Zero backdrop-blur lag!)
        ═══════════════════════════════════════════════════════════
      */}
      {/* Dark mode: deep edge vignette to focus content */}
      {isDark && (
        <div className="absolute inset-0 bg-radial from-transparent via-[#040814]/40 to-[#030611]/85 pointer-events-none" />
      )}

      {/* Light mode: crisp translucent wash without expensive backdrop-filter */}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-white/70 to-white/90 pointer-events-none" />
      )}
    </div>
  );
};

export default ScrollMotionBackground;

