import React, { useState, useMemo } from 'react';
import { 
  HelpCircle, 
  ChevronDown, 
  Send, 
  MessageSquare, 
  Sparkles, 
  Code, 
  FileText, 
  Laptop, 
  Clock, 
  CheckCircle2, 
  Plus, 
  Award,
  ExternalLink
} from 'lucide-react';
import { NavTab } from '../../components/common/Header';
import { useConfig } from '../../context/ConfigContext';
import { useCustomProjectForm } from '../../utils/customProject';
import { AnimatedHeading, AnimatedBadge } from '../../components/common/AnimatedText';

export interface QAItem {
  id: string;
  category: 'deliverables' | 'viva' | 'setup' | 'delivery' | 'general';
  categoryLabel: string;
  question: string;
  answer: string;
  highlights?: string[];
  icon: React.ComponentType<{ className?: string }>;
}

const QA_ITEMS: QAItem[] = [
  {
    id: 'qa-package-contents',
    category: 'deliverables',
    categoryLabel: 'Code & Deliverables',
    question: 'What is included in a complete project package?',
    answer: 'Every project deliverable on Project Wallah is an end-to-end, submission-ready engineering package. You do not just get a zip file — you receive a complete academic and technical package verified to run without bugs.',
    highlights: [
      '100% bug-free source code with clean architecture & zero runtime errors',
      'Full database schema, SQL dump scripts, and seed test data',
      'IEEE / University format documentation (Synopsis, SRS, Design & Final Report)',
      'High-impact Presentation (PPT) with architecture, DFD & ER diagrams',
      'Comprehensive Viva Voce guide with anticipated defense questions & answers',
      'Step-by-step video installation guide & environment setup instructions'
    ],
    icon: Code
  },
  {
    id: 'qa-delivery-time',
    category: 'delivery',
    categoryLabel: 'Pricing & Delivery',
    question: 'How fast will I receive my project files after ordering?',
    answer: 'We offer instant turnaround options for tight submission deadlines. Turnaround depends on whether you select an Instant Service, ready blueprint, or bespoke engineering sprint.',
    highlights: [
      'Instant Services (PPT, Report, Poster): Delivered in 2 to 12 hours',
      'Ready-Made Blueprints & Mini Projects: Delivered in 4 to 24 hours',
      'Custom Full-Scale Projects: Delivered in 3 to 7 days with milestone staging previews'
    ],
    icon: Clock
  },
  {
    id: 'qa-setup-issues',
    category: 'setup',
    categoryLabel: 'Setup & Support',
    question: 'What if I face issues running or setting up the code on my computer?',
    answer: 'You will never be left stranded. We provide 24/7 dedicated engineering support. If you run into dependency conflicts, environment path errors, or database connection problems, our technical leads will assist you directly.',
    highlights: [
      'Direct 1-on-1 remote assistance via AnyDesk, Google Meet, or TeamViewer',
      'Pre-configured Docker / virtualenv setups for zero-friction runs',
      'Continuous Telegram chat assistance for instant troubleshooting'
    ],
    icon: Laptop
  },
  {
    id: 'qa-revisions',
    category: 'setup',
    categoryLabel: 'Setup & Support',
    question: 'Can I request revisions if my college mentor or guide asks for modifications?',
    answer: 'Yes! College project guides frequently ask for small adjustments or extra diagrams after reviewing synopsis submissions. We provide complimentary revision support windows to ensure every suggestion from your mentor is addressed until your guide approves.',
    highlights: [
      'Complimentary revision window included with every delivery',
      'Fast modifications for guide feedback, UI tweaks, or report updates',
      'Direct line of communication with our lead developer for rapid turnarounds'
    ],
    icon: FileText
  },
  {
    id: 'qa-tech-stacks',
    category: 'general',
    categoryLabel: 'Code & Deliverables',
    question: 'What technologies, domains, and frameworks do you support?',
    answer: 'We cover an exhaustive range of engineering and management disciplines for B.Tech, B.E., M.Tech, MCA, BCA, and MBA curricula.',
    highlights: [
      'AI / ML & Data Science: Python, PyTorch, TensorFlow, OpenCV, NLP, LLMs',
      'Full-Stack Web: MERN (React/Node), Next.js, Django, Spring Boot, FastAPI',
      'Mobile Apps: Flutter, React Native, Android Studio / Kotlin',
      'Emerging Tech: Blockchain (Solidity), IoT (Arduino / Raspberry Pi), Cloud & DevOps'
    ],
    icon: Sparkles
  },
  {
    id: 'qa-payment-security',
    category: 'delivery',
    categoryLabel: 'Pricing & Delivery',
    question: 'How do payments work and is the transaction secure?',
    answer: 'Payments are handled through encrypted Indian payment gateways supporting UPI, Google Pay, PhonePe, Paytm, Debit/Credit Cards, and Net Banking. For custom projects, we follow milestone-based payments (Advance, Demo Staging Verification, and Final Handover).',
    highlights: [
      'Instant GST-compliant tax invoices provided',
      'Transparent pricing with zero hidden fees',
      'Clear refund and revision guarantees backed by milestone verification'
    ],
    icon: CheckCircle2
  },
  {
    id: 'qa-viva-preparation',
    category: 'viva',
    categoryLabel: 'Viva & Presentation',
    question: 'What happens post-purchase? Will I receive Viva Voce defense guidance?',
    answer: 'Yes, absolutely. We know that code alone does not guarantee a top grade; your viva presentation is critical. Every project includes a dedicated Viva Defense Handbook tailored to the exact algorithms, design patterns, and database decisions used in your build.',
    highlights: [
      '50+ curated Viva Voce questions with model answers',
      'Deep explanation of internal logic, algorithms, and libraries',
      'Database normalization, query execution, and API explanation notes',
      'Ready-to-speak pitch script for your project demonstration'
    ],
    icon: Award
  }
];

type CategoryFilter = 'all' | 'deliverables' | 'viva' | 'setup' | 'delivery' | 'general';

interface QASectionProps {
  onOpenSupport?: () => void;
  onNavigate?: (tab: NavTab) => void;
}

export const QASection: React.FC<QASectionProps> = ({ onOpenSupport, onNavigate: _onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [openItemIds, setOpenItemIds] = useState<string[]>(['qa-package-contents']);
  const { telegramBotUsername } = useConfig();
  const { openCustomProject } = useCustomProjectForm();

  const toggleItem = (id: string) => {
    setOpenItemIds(prev => (prev.includes(id) ? [] : [id]));
  };

  const filteredItems = useMemo(() => {
    return QA_ITEMS.filter(item => {
      return selectedCategory === 'all' || item.category === selectedCategory;
    });
  }, [selectedCategory]);

  const handleTelegramContact = () => {
    window.open(`https://t.me/${telegramBotUsername}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <section 
      id="qa-section" 
      aria-label="Frequently Asked Questions and Answers"
      className="w-full bg-white dark:bg-[#080d1a] rounded-3xl border border-zinc-200/90 dark:border-white/10 p-5 sm:p-10 lg:p-12 shadow-sm dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all text-left"
    >
      <div className="relative z-10 max-w-5xl mx-auto space-y-8 sm:space-y-10">
        
        {/* Header Block */}
        <div className="text-center space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          <AnimatedBadge 
            icon={<HelpCircle className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />} 
            text="Q&A • FREQUENTLY ASKED QUESTIONS" 
          />

          <AnimatedHeading 
            text="Have Questions? We Have Answers." 
            highlightWords={["Questions?", "Answers."]}
            className="font-headline font-black text-2xl sm:text-4xl lg:text-5xl text-zinc-950 dark:text-white tracking-tight" 
          />

          <p className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about our project handovers, source code quality, viva defense preparation, and post-delivery assistance.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="space-y-4 max-w-3xl mx-auto">
          {/* Category Chips & Expand/Collapse Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'deliverables', label: 'Code & Reports' },
                { id: 'viva', label: 'Viva & Defense' },
                { id: 'setup', label: 'Setup & Support' },
                { id: 'delivery', label: 'Pricing & Timelines' }
              ].map((cat) => {
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id as CategoryFilter)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-zinc-900 dark:bg-cyan-500 text-white dark:text-zinc-950 shadow-xs'
                        : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 border border-zinc-200 dark:border-white/10'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

          </div>
        </div>

        {/* Q&A Accordion Items */}
        <div className="space-y-3 max-w-3xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="p-8 sm:p-12 text-center rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 bg-zinc-50/60 dark:bg-zinc-800/40 space-y-3">
              <HelpCircle className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mx-auto" />
              <p className="text-sm font-bold text-zinc-900 dark:text-white">
                No matching questions found
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto">
                We could not find any FAQ matching this category. You can ask our team directly on Telegram or Live Chat.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 cursor-pointer shadow-2xs"
                >
                  Clear filter
                </button>
                <button
                  onClick={handleTelegramContact}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Ask on Telegram</span>
                </button>
              </div>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isOpen = openItemIds.includes(item.id);
              const ItemIcon = item.icon;

              return (
                <div
                  key={item.id}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'bg-white dark:bg-zinc-800/75 border-zinc-300 dark:border-cyan-500/40 shadow-md dark:shadow-xl ring-1 ring-zinc-200 dark:ring-cyan-500/20'
                      : 'bg-white dark:bg-zinc-800/50 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 shadow-2xs'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    className="w-full px-4 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-3 text-left cursor-pointer transition-colors"
                  >
                    <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 flex-1 min-w-0">
                      <div className={`p-2 rounded-xl shrink-0 transition-colors ${
                        isOpen 
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400' 
                          : 'bg-slate-100 dark:bg-zinc-700/60 text-slate-600 dark:text-zinc-400'
                      }`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-700/60 px-2 py-0.5 rounded-md">
                            {item.categoryLabel}
                          </span>
                        </div>
                        <h3 className="font-headline font-bold text-sm sm:text-base text-zinc-900 dark:text-white leading-snug">
                          {item.question}
                        </h3>
                      </div>
                    </div>

                    <div className={`p-1.5 rounded-lg shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-cyan-600 dark:text-cyan-400' : 'text-zinc-400 dark:text-zinc-500'
                    }`}>
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-4 sm:px-6 pb-5 sm:pb-6 pt-1 text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed border-t border-zinc-100 dark:border-white/10 space-y-3.5 animate-in fade-in duration-200">
                      <p>{item.answer}</p>

                      {item.highlights && item.highlights.length > 0 && (
                        <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-white/10 space-y-2">
                          <p className="text-[11px] font-mono font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                            Key Deliverables &amp; Highlights:
                          </p>
                          <ul className="space-y-1.5">
                            {item.highlights.map((point, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2 text-xs">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                                <span className="text-zinc-700 dark:text-zinc-300">{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="text-center pt-2 pb-6">
          <button
            onClick={() => setSelectedCategory('all')}
            className="text-cyan-700 dark:text-cyan-400 hover:text-cyan-800 dark:hover:text-cyan-300 text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            View All FAQs
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>

        {/* ── Help / Contact Callout Card ── */}
        <div className="max-w-3xl mx-auto rounded-2xl bg-zinc-900 dark:bg-zinc-800/80 text-white p-5 sm:p-7 border border-zinc-800 dark:border-white/10 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-5 text-center sm:text-left">
          <div className="space-y-1 max-w-md">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <h4 className="font-headline font-bold text-sm sm:text-base text-white">
                Still have unanswered questions?
              </h4>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Our academic consultants and engineering leads are available to review your college guidelines, syllabus, and custom deadlines.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0 w-full sm:w-auto">
            <button
              onClick={handleTelegramContact}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-blue-500 hover:bg-blue-600 text-white transition-all hover:scale-105 active:scale-95 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Chat on Telegram</span>
            </button>

            {onOpenSupport && (
              <button
                onClick={onOpenSupport}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Live Support</span>
              </button>
            )}

            <button
              onClick={openCustomProject}
              aria-label="Request Custom Project (opens Google Form in a new tab)"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-zinc-950 hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-white"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Request Custom Project</span>
              <ExternalLink className="w-3 h-3 opacity-70 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
