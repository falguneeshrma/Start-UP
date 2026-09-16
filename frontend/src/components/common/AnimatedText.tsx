import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface AnimatedHeadingProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  highlightWords?: string[];
  highlightClassName?: string;
  delay?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'div';
}

/**
 * AnimatedHeading:
 * Elegant staggered word entrance with spring physics and optional gradient highlight.
 */
export const AnimatedHeading: React.FC<AnimatedHeadingProps> = ({
  children,
  text,
  className = '',
  highlightWords = [],
  highlightClassName = 'text-gradient-animated font-black',
  delay = 0,
  as = 'h2'
}) => {
  const shouldReduceMotion = useReducedMotion();
  const content = text || (typeof children === 'string' ? children : '');

  if (!content || shouldReduceMotion) {
    const Component = as;
    return <Component className={className}>{children || text}</Component>;
  }

  const words = content.split(' ');
  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      className={`flex flex-wrap items-center justify-center gap-x-[0.3em] gap-y-1 ${className}`}
    >
      {words.map((word, idx) => {
        const isHighlighted = highlightWords.some(hw => 
          word.toLowerCase().replace(/[^a-z0-9]/gi, '') === hw.toLowerCase().replace(/[^a-z0-9]/gi, '')
        );

        return (
          <motion.span
            key={`${word}-${idx}`}
            variants={{
              hidden: { 
                opacity: 0, 
                y: 20,
                rotateX: 30,
              },
              visible: {
                opacity: 1, 
                y: 0,
                rotateX: 0,
                transition: {
                  delay: delay + idx * 0.07,
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 150,
                  damping: 15,
                }
              }
            }}
            className={`inline-block transition-transform hover:scale-105 duration-200 cursor-default ${
              isHighlighted ? highlightClassName : ''
            }`}
          >
            {word}
          </motion.span>
        );
      })}
    </Component>
  );
};

interface AnimatedShimmerTextProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * AnimatedShimmerText:
 * Subtly sweeping reflective shimmer over labels, badges, or headlines.
 */
export const AnimatedShimmerText: React.FC<AnimatedShimmerTextProps> = ({
  children,
  className = ''
}) => {
  return (
    <span className={`relative inline-block overflow-hidden ${className}`}>
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/30 dark:via-cyan-400/20 to-transparent -skew-x-12 animate-[shimmer_3.5s_infinite]"
        style={{ transform: 'translateZ(0)' }}
      />
    </span>
  );
};

interface AnimatedBadgeProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
}

/**
 * AnimatedBadge:
 * High-end floating badge with micro-pulsing icon and shimmer.
 */
export const AnimatedBadge: React.FC<AnimatedBadgeProps> = ({
  icon,
  text,
  className = ''
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ scale: 1.04 }}
      className={`inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100/90 dark:bg-zinc-800/80 border border-zinc-200 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-[11px] sm:text-xs font-mono font-semibold shadow-2xs backdrop-blur-md transition-shadow hover:shadow-md ${className}`}
    >
      {icon && (
        <span className="shrink-0 text-cyan-600 dark:text-cyan-400 animate-pulse">
          {icon}
        </span>
      )}
      <AnimatedShimmerText>
        <span>{text}</span>
      </AnimatedShimmerText>
    </motion.div>
  );
};
