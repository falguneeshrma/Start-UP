import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Mouse tracking for subtle interactive depth
  useEffect(() => {
    if (shouldReduceMotion) return;
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      setMousePos({
        x: (e.clientX / innerWidth - 0.5) * 20,
        y: (e.clientY / innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [shouldReduceMotion]);

  // Spring smoothed mouse offset
  const springX = useSpring(mousePos.x, { stiffness: 45, damping: 25 });
  const springY = useSpring(mousePos.y, { stiffness: 45, damping: 25 });

  // Parallax with scroll
  const { scrollY } = useScroll();
  const scrollYTransform = useTransform(scrollY, [0, 3000], [0, -180]);
  const smoothScrollY = useSpring(scrollYTransform, { stiffness: 100, damping: 30 });

  // Combined vertical translation (mouse drift + scroll parallax)
  const combinedY = useTransform(
    [smoothScrollY, springY],
    ([scrollVal, mouseVal]: number[]) => (scrollVal || 0) + (mouseVal || 0)
  );

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden select-none transition-colors duration-500 ${
        isDark ? 'bg-[#040814]' : 'bg-[#f4f7fb]'
      } ${className}`}
    >
      {/* 
        ═══════════════════════════════════════════════════════════
        1. MAIN CIRCUIT BOARD IMAGE LAYER (Framer Motion Animated)
        ═══════════════════════════════════════════════════════════
      */}
      <motion.div
        style={{
          x: shouldReduceMotion ? 0 : springX,
          y: shouldReduceMotion ? 0 : combinedY,
        }}
        className="absolute -inset-[8%] w-[116%] h-[116%]"
      >
        <motion.div
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  scale: [1, 1.025, 1],
                  rotate: [0, 0.4, 0, -0.4, 0],
                }
          }
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-full h-full relative"
        >
          <img
            src="/circuit-bg.jpg"
            alt=""
            className={`w-full h-full object-cover object-center transition-all duration-700 ${
              isDark
                ? 'opacity-85 filter brightness-105 contrast-125'
                : 'opacity-25 filter brightness-110 contrast-110 saturate-150 mix-blend-multiply'
            }`}
            draggable={false}
          />
        </motion.div>
      </motion.div>

      {/* 
        ═══════════════════════════════════════════════════════════
        2. GLOWING ENERGY NODES (Positioned along circuit tracks)
        ═══════════════════════════════════════════════════════════
      */}
      {enableInteractiveGlow && !shouldReduceMotion && (
        <>
          {/* Cyan Node: Top Left Cluster */}
          <motion.div
            animate={{
              scale: [1, 1.35, 1],
              opacity: isDark ? [0.45, 0.9, 0.45] : [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute top-[18%] left-[24%] w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-2xl pointer-events-none"
          />

          {/* Cyan Node: Upper Center Track */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: isDark ? [0.5, 0.95, 0.5] : [0.25, 0.6, 0.25],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.2,
            }}
            className="absolute top-[28%] left-[34%] w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/30 blur-xl pointer-events-none"
          />

          {/* Electric Blue Node: Upper Right Track */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: isDark ? [0.4, 0.85, 0.4] : [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.8,
            }}
            className="absolute top-[20%] right-[30%] w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/25 blur-2xl pointer-events-none"
          />

          {/* Cyan Node: Mid Right Connection */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: isDark ? [0.35, 0.8, 0.35] : [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: 3.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.1,
            }}
            className="absolute top-[36%] right-[28%] w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-300/30 blur-lg pointer-events-none"
          />

          {/* Cyan Node: Bottom Left Bus */}
          <motion.div
            animate={{
              scale: [1.1, 1.45, 1.1],
              opacity: isDark ? [0.5, 0.9, 0.5] : [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1.6,
            }}
            className="absolute bottom-[28%] left-[25%] w-36 h-36 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/25 blur-2xl pointer-events-none"
          />

          {/* Bottom Center Node */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: isDark ? [0.4, 0.85, 0.4] : [0.15, 0.45, 0.15],
            }}
            transition={{
              duration: 5.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 2.7,
            }}
            className="absolute bottom-[21%] left-[48%] w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-400/25 blur-xl pointer-events-none"
          />

          {/* Bottom Right Connection */}
          <motion.div
            animate={{
              scale: [1.2, 1, 1.2],
              opacity: isDark ? [0.45, 0.9, 0.45] : [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 3.2,
            }}
            className="absolute bottom-[8%] right-[27%] w-28 h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/30 blur-xl pointer-events-none"
          />
        </>
      )}

      {/* 
        ═══════════════════════════════════════════════════════════
        3. CYBER SCANLINE / BEAM SWEEP
        ═══════════════════════════════════════════════════════════
      */}
      {!shouldReduceMotion && (
        <motion.div
          animate={{
            y: ['-10%', '115%'],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="absolute left-0 right-0 h-40 pointer-events-none"
          style={{
            background: isDark
              ? 'linear-gradient(to bottom, transparent, rgba(56, 189, 248, 0.07) 50%, transparent)'
              : 'linear-gradient(to bottom, transparent, rgba(14, 165, 233, 0.04) 50%, transparent)',
          }}
        />
      )}

      {/* 
        ═══════════════════════════════════════════════════════════
        4. THEME-AWARE CONTRAST VEIL & VIGNETTE
        ═══════════════════════════════════════════════════════════
      */}
      {/* Dark mode: deep edge vignette to focus content */}
      {isDark && (
        <div className="absolute inset-0 bg-radial from-transparent via-[#040814]/40 to-[#030611]/85 pointer-events-none" />
      )}

      {/* Light mode: delicate glass veil so text is 100% crisp while cyber grid shines through */}
      {!isDark && (
        <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/60 to-white/80 backdrop-blur-[1px] pointer-events-none" />
      )}
    </div>
  );
};

export default ScrollMotionBackground;

