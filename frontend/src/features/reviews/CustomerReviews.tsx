import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, ShieldCheck, Sparkles, FolderKanban } from 'lucide-react';
import type { NavTab } from '../../components/common/Header';
import { AnimatedHeading, AnimatedBadge } from '../../components/common/AnimatedText';

interface CustomerReviewsProps {
  onNavigate: (tab: NavTab) => void;
}

export const CustomerReviews: React.FC<CustomerReviewsProps> = ({ onNavigate }) => {
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
          icon={<ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />} 
          text="Verified Client Feedback System" 
        />

        {/* Title & Subtitle */}
        <div className="space-y-3">
          <AnimatedHeading 
            text="Customer Reviews" 
            highlightWords={["Reviews"]}
            as="h1"
            className="font-headline font-black text-3xl sm:text-5xl text-zinc-950 dark:text-white tracking-tight" 
          />
          <p className="text-sm sm:text-base text-zinc-600 max-w-xl mx-auto leading-relaxed">
            Authentic, transparent reviews from verified clients and students across all engineering and academic disciplines.
          </p>
        </div>

        {/* Blank / Clean Empty State Card (No Dummy Code) */}
        <div className="bg-white rounded-3xl p-8 sm:p-14 border border-zinc-200 shadow-sm space-y-6 text-center transition-all">
          <div className="w-16 h-16 rounded-2xl bg-zinc-100 text-zinc-700 flex items-center justify-center mx-auto border border-zinc-200">
            <MessageSquare className="w-7 h-7 text-zinc-500" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="font-headline font-bold text-xl sm:text-2xl text-zinc-950">
              No Customer Reviews Yet
            </h2>
            <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
              Reviews will appear here automatically once clients complete milestone approvals and submit feedback through their Project Hub.
            </p>
          </div>

          {/* Verification Protocol Notice */}
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 max-w-lg mx-auto text-center flex flex-col items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-cyan-600" />
            <div className="text-xs text-zinc-600 leading-relaxed text-center">
              <span className="font-bold text-zinc-900 block mb-0.5">Integrity Guaranteed</span>
              Only registered users with completed, signed-off milestones can post verified ratings and reviews.
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 w-full max-w-md mx-auto sm:max-w-none">
            <button
              onClick={() => onNavigate('browse')}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-white bg-zinc-900 hover:bg-black transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center gap-2 cursor-pointer"
            >
              <FolderKanban className="w-4 h-4" />
              <span>Explore Projects</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('submit')}
              className="w-full sm:w-auto justify-center px-6 py-3 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 bg-white hover:bg-zinc-50 border border-zinc-300 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Submit Custom Requirement</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
