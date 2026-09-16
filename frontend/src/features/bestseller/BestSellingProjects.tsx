import React from 'react';
import { motion } from 'framer-motion';
import { Award, ArrowRight, ShieldCheck, FolderKanban, Send, FileText } from 'lucide-react';
import type { NavTab } from '../../components/common/Header';
import { useConfig } from '../../context/ConfigContext';
import { AnimatedHeading, AnimatedBadge } from '../../components/common/AnimatedText';

interface BestSellingProjectsProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSupport?: () => void;
}

export const BestSellingProjects: React.FC<BestSellingProjectsProps> = ({ 
  onNavigate 
}) => {
  const { telegramBotUsername } = useConfig();

  const handleOpenTelegram = () => {
    window.open(`https://t.me/${telegramBotUsername}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full min-h-[75vh] flex flex-col items-center justify-center max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-3xl space-y-8 text-center"
      >
        {/* Header Badge */}
        <AnimatedBadge 
          icon={<Award className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400" />} 
          text="Top-Ranked Academic Blueprints" 
        />

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <AnimatedHeading 
            text="Best Selling Projects" 
            highlightWords={["Best", "Selling"]}
            as="h1"
            className="font-headline font-black text-3xl sm:text-5xl text-slate-900 dark:text-white tracking-tight" 
          />
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
            Curated, highly rated project architectures with verified submission track records across top universities.
          </p>
        </div>

        {/* Blank / Clean Empty State Card (Zero Dummy Code) */}
        <div className="bg-white/50 dark:bg-[#080d1a] rounded-3xl p-8 sm:p-14 border border-white/60 dark:border-white/10 shadow-xl dark:shadow-2xl space-y-6 text-center transition-all">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-white/10 text-amber-500 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner border border-slate-200/60 dark:border-white/10">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-slate-900 dark:text-white">
              No Best Selling Projects Listed Yet
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
              Live bestseller rankings and verified project blueprints will be automatically featured here as student adoptions and verified submissions are processed.
            </p>
          </div>

          {/* Verification Protocol Notice */}
          <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-white/10 max-w-lg mx-auto text-center flex flex-col items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <div className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed text-center">
              <span className="font-bold text-slate-900 dark:text-white block mb-0.5">Automated Bestseller Verification</span>
              All bestseller rankings are dynamically generated based on verified milestone completions, code quality reviews, and student feedback.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => onNavigate('browse')}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white dark:text-zinc-950 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Explore Projects Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('submit')}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-slate-800 dark:text-white bg-white/70 hover:bg-white/90 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/20  transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-slate-600 dark:text-zinc-300" />
              <span>Submit Custom Requirement</span>
            </button>

            <button
              onClick={handleOpenTelegram}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-blue-700 dark:text-blue-300 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800/40 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Chat on Telegram</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
