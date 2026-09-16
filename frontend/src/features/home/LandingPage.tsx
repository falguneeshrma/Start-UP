import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight, 
  Code, 
  Zap, 
  Check, 
  Compass, 
  Bookmark, 
  Sparkles, 
  Plus, 
  Database, 
  Monitor, 
  Briefcase, 
  Layers, 
  Cpu, 
  Search,
  ExternalLink
} from 'lucide-react';
import { NavTab } from '../../components/common/Header';
import { InstantServiceModal, InstantServiceItem } from '../../components/common/InstantServiceModal';
import { QASection } from './QASection';
import { Hero3DTitle } from './Hero3DTitle';
import { useCustomProjectForm } from '../../utils/customProject';
import { AnimatedHeading, AnimatedBadge, AnimatedShimmerText } from '../../components/common/AnimatedText';

const INSTANT_SERVICES: InstantServiceItem[] = [
  {
    tier: 'Tier 1',
    name: 'Instant PPT',
    price: '₹200',
    numericPrice: 200,
    delivery: '4–12 Hours',
    features: [
      '12–15 structured presentation slides',
      'Project architecture & flow diagrams',
      'Speaker notes & viva Q&A guidance'
    ],
    iconType: 'zap'
  },
  {
    tier: 'Tier 2',
    name: 'Instant Mini Project',
    price: '₹1,000',
    numericPrice: 1000,
    delivery: '24–48 Hours',
    features: [
      'Working source code & database scripts',
      'Step-by-step video setup instructions',
      'Complete project synopsis & viva guide'
    ],
    iconType: 'cpu'
  },
  {
    tier: 'Tier 3',
    name: 'Instant Report',
    price: '₹100',
    numericPrice: 100,
    delivery: '2–6 Hours',
    features: [
      'IEEE / university format document',
      'Abstract, methodology & system design',
      'Plagiarism-checked citations & bibliography'
    ],
    iconType: 'code'
  },
  {
    tier: 'Tier 4',
    name: 'Instant Poster',
    price: '₹400',
    numericPrice: 400,
    delivery: '6–12 Hours',
    features: [
      'High-resolution print-ready flex / PDF poster',
      'Modern infographic visual layout',
      'Custom college emblem & team details'
    ],
    iconType: 'layers'
  }
];

interface LandingPageProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSupport?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onNavigate, 
  onOpenSupport 
}) => {
  const [selectedInstantService, setSelectedInstantService] = useState<InstantServiceItem | null>(null);
  const [isInstantModalOpen, setIsInstantModalOpen] = useState(false);
  const { openCustomProject } = useCustomProjectForm();

  const handleStartInstantService = (item: InstantServiceItem) => {
    setSelectedInstantService(item);
    setIsInstantModalOpen(true);
  };

  return (
    <>
      <div className="w-full bg-transparent flex flex-col space-y-12 sm:space-y-16 pb-0 sm:pb-2 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6">
      
      {/* ── 1. HERO SECTION ── */}
      <section className="w-full bg-white/85 dark:bg-zinc-900/60 backdrop-blur-xl rounded-3xl border border-zinc-200/80 dark:border-white/10 py-6 [@media(max-height:700px)]:py-4 px-4 sm:p-10 lg:p-12 shadow-sm dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden transition-all text-center">
        <div className="w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-5 [@media(max-height:700px)]:space-y-3 [@media(max-height:600px)]:space-y-2 sm:space-y-6">
          
          <AnimatedBadge 
            icon={<Sparkles className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />} 
            text="200+ Ready-to-Submit Academic Projects" 
          />

          {/* 3D Animated Main Headline */}
          <Hero3DTitle />

          {/* Subtitle with Animated Entrance */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-xs sm:text-base text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto text-center px-1"
          >
            Explore our curated marketplace of ready-to-submit college projects across Computer Science, Data Science, and more. Save time, eliminate stress, and focus on your grades.
          </motion.p>

          {/* Hero Search */}
          <div className="w-full max-w-xl mx-auto relative pt-4 [@media(max-height:700px)]:pt-1 pb-2 [@media(max-height:700px)]:pb-0">
            <Search className="w-5 h-5 text-zinc-400 dark:text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 z-10 mt-1 [@media(max-height:700px)]:mt-0 pointer-events-none" />
            <input
              type="text"
              placeholder="Search projects by keyword, tech stack, or category..."
              className="w-full pl-12 pr-4 py-3.5 bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-300 dark:border-white/10 rounded-2xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-800 dark:focus:ring-cyan-400 focus:bg-white dark:focus:bg-zinc-800 shadow-sm transition-all"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const val = (e.target as HTMLInputElement).value;
                  if (val.trim()) {
                     onNavigate('browse');
                  }
                }
              }}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-1 w-full max-w-md sm:max-w-xl mx-auto">
            <button
              onClick={() => onNavigate('browse')}
              className="w-full sm:w-auto px-6 sm:px-7 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-zinc-900 hover:bg-black dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-zinc-950 transition-all hover:scale-[1.02] active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Compass className="w-4 h-4 shrink-0" />
              <span>Browse Projects</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            <button
              onClick={openCustomProject}
              aria-label="Request Custom Project (opens Google Form in a new tab)"
              className="w-full sm:w-auto px-5 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 bg-white dark:bg-zinc-800/80 hover:bg-zinc-50 dark:hover:bg-zinc-700/80 border border-zinc-300 dark:border-white/10 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-xs focus:outline-hidden focus:ring-2 focus:ring-zinc-800 dark:focus:ring-cyan-400"
            >
              <Plus className="w-4 h-4 text-zinc-600 dark:text-zinc-400 shrink-0" />
              <span>Request Custom Project</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60 ml-0.5 shrink-0" aria-hidden="true" />
            </button>
          </div>

          {/* 3-Stat Metric Row with Animated Counters & Hover Physics */}
          <div className="pt-5 [@media(max-height:700px)]:pt-3 [@media(max-height:600px)]:pt-2 sm:pt-6 border-t border-zinc-200 dark:border-white/10 grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-6 w-full max-w-2xl mx-auto text-center">
            <motion.div 
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex flex-col items-center justify-center text-center cursor-default"
            >
              <p className="text-lg sm:text-2xl font-black font-headline text-zinc-950 dark:text-white group-hover:text-cyan-500 transition-colors">
                <span className="text-gradient-animated">200+</span>
              </p>
              <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium">Ready-Made Projects</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex flex-col items-center justify-center text-center cursor-default"
            >
              <p className="text-lg sm:text-2xl font-black font-headline text-zinc-950 dark:text-white">
                <span className="text-gradient-animated">1,000+</span>
              </p>
              <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium">Happy Students</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.06, y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="flex flex-col items-center justify-center text-center cursor-default"
            >
              <p className="text-lg sm:text-2xl font-black font-headline text-zinc-950 dark:text-white">
                <span className="text-gradient-animated">24/7</span>
              </p>
              <p className="text-[11px] sm:text-xs text-zinc-600 dark:text-zinc-400 font-medium">Expert Support</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Removed Best Selling Promo and Trust Banner */}

      {/* ── 3. CATEGORY CATALOG ── */}
      <section id="categories-section" className="scroll-mt-24 sm:scroll-mt-28 bg-white/85 dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-zinc-200/90 dark:border-white/10 shadow-sm space-y-8 text-center transition-all">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-xs font-bold font-mono tracking-widest text-zinc-500 dark:text-cyan-400 uppercase">
            EXPLORE CATEGORIES
          </p>
          <AnimatedHeading 
            text="Get Projects by Category" 
            highlightWords={["Projects", "Category"]}
            className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white" 
          />
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">
            Browse our curated collection across top engineering and academic disciplines
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigate('browse')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-cyan-400 hover:text-black dark:hover:text-cyan-300 hover:underline cursor-pointer"
            >
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: 'Data Science & AI',
              badge: '50+ Projects',
              desc: 'Machine learning, predictive models, NLP text classifiers, and dashboards.',
              icon: Database,
              tags: ['Python', 'ML', 'Data']
            },
            {
              title: 'Web Development',
              badge: '80+ Projects',
              desc: 'Production-ready MERN, Next.js, and TypeScript web applications.',
              icon: Monitor,
              tags: ['React', 'Node.js', 'Next.js']
            },
            {
              title: 'Core CS / IT',
              badge: '40+ Projects',
              desc: 'Core B.Tech and BCA syllabus projects with complete algorithms.',
              icon: Code,
              tags: ['Java', 'C++', 'Python']
            },
            {
              title: 'Pharmacy & Health',
              badge: '30+ Projects',
              desc: 'Formulation studies, pharmacology research protocols, and clinical review data.',
              icon: Briefcase,
              tags: ['B.Pharm', 'M.Pharm', 'Clinical']
            },
            {
              title: 'Business & Management',
              badge: '35+ Projects',
              desc: 'Market research, financial analysis, HR case studies, and business plans.',
              icon: Briefcase,
              tags: ['MBA', 'BBA', 'Finance']
            },
            {
              title: 'Research Papers',
              badge: '45+ Papers',
              desc: 'IEEE / UGC format research blueprints with complete methodologies and literature reviews.',
              icon: Layers,
              tags: ['IEEE', 'Scopus', 'Review']
            }
          ].map((c) => (
            <div
              key={c.title}
              onClick={() => onNavigate('browse')}
              className="rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between items-center text-center group bg-white dark:bg-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-cyan-500/40 shadow-xs hover:shadow-md"
            >
              <div className="w-full flex flex-col items-center text-center">
                <div className="flex flex-col items-center justify-center mb-4 gap-2">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-colors mx-auto bg-zinc-100 dark:bg-zinc-700/60 text-zinc-800 dark:text-zinc-200 group-hover:bg-zinc-900 dark:group-hover:bg-cyan-500 group-hover:text-white dark:group-hover:text-zinc-950">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 border border-zinc-200 dark:border-white/10">
                    {c.badge}
                  </span>
                </div>

                <h3 className="font-headline font-bold text-lg mb-1.5 transition-colors text-center text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400">
                  {c.title}
                </h3>
                <p className="text-xs leading-relaxed mb-4 text-center max-w-xs text-zinc-600 dark:text-zinc-400">
                  {c.desc}
                </p>
              </div>

              <div className="pt-3 border-t flex items-center justify-center text-xs font-bold w-full gap-1.5 border-zinc-100 dark:border-white/10 text-zinc-900 dark:text-zinc-300 group-hover:underline">
                <span>Browse projects</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8">
          <div className="rounded-2xl p-6 sm:p-8 border border-cyan-200 dark:border-cyan-500/30 bg-cyan-50/70 dark:bg-cyan-950/30 dark:backdrop-blur-md flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-6 shadow-xs">
            <div className="space-y-2 max-w-lg mx-auto sm:mx-0">
              <AnimatedHeading 
                as="h3" 
                text="Can't find your topic?" 
                highlightWords={["topic?"]} 
                className="!justify-start text-xl text-zinc-950 dark:text-white font-headline font-bold" 
              />
              <p className="text-sm text-zinc-700 dark:text-zinc-300">Request a bespoke project built from scratch according to your university syllabus and guidelines.</p>
            </div>
            <button
              onClick={openCustomProject}
              aria-label="Request Custom Project (opens Google Form in a new tab)"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-sm text-white bg-zinc-900 hover:bg-black dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-zinc-950 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0 focus:outline-hidden focus:ring-2 focus:ring-zinc-800 dark:focus:ring-cyan-400"
            >
              <Plus className="w-4 h-4 shrink-0" />
              <span>Request Custom Project</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5 shrink-0" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 4. FEATURED PROJECTS SHOWCASE ── */}
      <section className="bg-white/85 dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-zinc-200/90 dark:border-white/10 shadow-sm space-y-8 text-center transition-all">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-xs font-bold font-mono tracking-widest text-zinc-500 dark:text-cyan-400 uppercase">
            STUDENT FAVORITES
          </p>
          <AnimatedHeading 
            text="Featured Projects" 
            highlightWords={["Projects"]}
            className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white" 
          />
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">
            Explore our most popular student projects ready for submission.
          </p>
          <div className="pt-1">
            <button
              onClick={() => onNavigate('browse')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-900 dark:text-cyan-400 hover:text-black dark:hover:text-cyan-300 hover:underline cursor-pointer"
            >
              <span>View all 200+ Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-2xl border border-dashed border-zinc-300 dark:border-white/15 bg-zinc-50/60 dark:bg-zinc-800/40 max-w-4xl mx-auto w-full">
          <Bookmark className="w-8 h-8 text-zinc-400 dark:text-zinc-500 mb-3" />
          <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300">Featured projects will appear here soon.</p>
        </div>
      </section>

      {/* ── 5. GET OUR INSTANT SERVICES ── */}
      <section id="services-tiers-section" className="scroll-mt-24 sm:scroll-mt-28 bg-white/85 dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-zinc-200/90 dark:border-white/10 shadow-sm space-y-8 text-center transition-all">
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <p className="text-xs font-bold font-mono tracking-widest text-zinc-500 dark:text-cyan-400 uppercase">
            ACADEMIC SERVICES
          </p>
          <AnimatedHeading 
            text="Need Something Quickly?" 
            highlightWords={["Quickly?"]}
            className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-950 dark:text-white" 
          />
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 max-w-xl mx-auto">
            Quick and affordable academic deliverables to support your project submission.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Tier 1: Instant PPT */}
          <div className="bg-white dark:bg-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 rounded-2xl p-6 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 shadow-xs hover:shadow-md flex flex-col justify-between items-center text-center transition-all">
            <div className="w-full flex flex-col items-center">
              <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30 flex items-center justify-center mb-3 mx-auto">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <h4 className="text-base font-headline font-bold text-zinc-900 dark:text-white mt-1">Instant PPT</h4>
              <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2 font-headline">₹200</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Delivery: 4–12 Hours</p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 text-left w-full max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>12–15 structured presentation slides</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Project architecture &amp; flow diagrams</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Speaker notes &amp; viva Q&amp;A guidance</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleStartInstantService(INSTANT_SERVICES[0])}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white text-xs font-bold transition-all border border-zinc-300/80 dark:border-white/10 cursor-pointer shadow-2xs text-center justify-center"
            >
              Get Started
            </button>
          </div>

          {/* Tier 2: Instant Mini Project (Most Popular) */}
          <div className="rounded-2xl p-6 border-2 border-cyan-500 dark:border-cyan-400 bg-cyan-50/40 dark:bg-cyan-950/30 shadow-md hover:shadow-lg relative flex flex-col justify-between items-center text-center transition-all">
            <div className="w-full flex flex-col items-center">
              <div className="w-11 h-11 rounded-xl text-white flex items-center justify-center mb-3 shadow-sm bg-cyan-600 mx-auto">
                <Cpu className="w-5 h-5" />
              </div>
              <h4 className="text-base font-headline font-bold text-zinc-900 dark:text-white mt-1">Instant Mini Project</h4>
              <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2 font-headline">₹1,000</p>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">Delivery: 24–48 Hours</p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 text-left w-full max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Working source code &amp; DB scripts</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Step-by-step video setup instructions</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                  <span>Complete project synopsis &amp; viva guide</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleStartInstantService(INSTANT_SERVICES[1])}
              className="mt-6 w-full py-2.5 rounded-xl text-white dark:text-zinc-950 bg-zinc-900 hover:bg-black dark:bg-cyan-400 dark:hover:bg-cyan-300 text-xs font-bold transition-all shadow-md cursor-pointer text-center justify-center"
            >
              Get Started
            </button>
          </div>

          {/* Tier 3: Instant Report */}
          <div className="bg-white dark:bg-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 rounded-2xl p-6 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 shadow-xs hover:shadow-md flex flex-col justify-between items-center text-center transition-all">
            <div className="w-full flex flex-col items-center">
              <div className="w-11 h-11 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center mb-3 mx-auto">
                <Code className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h4 className="text-base font-headline font-bold text-zinc-900 dark:text-white mt-1">Instant Report</h4>
              <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2 font-headline">₹100</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Delivery: 2–6 Hours</p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 text-left w-full max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>IEEE / university format document</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Abstract, methodology &amp; system design</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Plagiarism-checked citations &amp; references</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleStartInstantService(INSTANT_SERVICES[2])}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white text-xs font-bold transition-all border border-zinc-300/80 dark:border-white/10 cursor-pointer shadow-2xs text-center justify-center"
            >
              Get Started
            </button>
          </div>

          {/* Tier 4: Instant Poster */}
          <div className="bg-white dark:bg-zinc-800/60 hover:bg-zinc-50 dark:hover:bg-zinc-800/90 rounded-2xl p-6 border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20 shadow-xs hover:shadow-md flex flex-col justify-between items-center text-center transition-all">
            <div className="w-full flex flex-col items-center">
              <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30 flex items-center justify-center mb-3 mx-auto">
                <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h4 className="text-base font-headline font-bold text-zinc-900 dark:text-white mt-1">Instant Poster</h4>
              <p className="text-2xl font-bold text-zinc-950 dark:text-white mt-2 font-headline">₹400</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">Delivery: 6–12 Hours</p>

              <ul className="mt-5 space-y-2.5 text-xs text-zinc-700 dark:text-zinc-300 text-left w-full max-w-xs mx-auto">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>High-res print-ready flex / PDF poster</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Modern infographic visual layout</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Custom college logo &amp; team details</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleStartInstantService(INSTANT_SERVICES[3])}
              className="mt-6 w-full py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-700/80 dark:hover:bg-zinc-600 text-zinc-900 dark:text-white text-xs font-bold transition-all border border-zinc-300/80 dark:border-white/10 cursor-pointer shadow-2xs text-center justify-center"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. HOW IT WORKS ── */}
      <section id="protocol-section" className="scroll-mt-24 sm:scroll-mt-28 bg-white/85 dark:bg-zinc-900/60 dark:backdrop-blur-xl rounded-2xl p-5 sm:p-8 border border-zinc-200/90 dark:border-white/10 shadow-sm space-y-8 text-center transition-all">
        <div className="max-w-3xl mx-auto text-center flex flex-col items-center space-y-3">
          <AnimatedHeading 
            text="How It Works" 
            highlightWords={["Works"]}
            className="font-headline text-2xl sm:text-3xl lg:text-4xl font-extrabold text-zinc-950 dark:text-white" 
          />
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xl mx-auto">
            Get your college project ready in four simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-left">
           {/* Step 1 */}
           <div className="p-6 bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-cyan-500/40 shadow-xs hover:shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold font-mono mb-4 text-lg">1</div>
              <h4 className="font-bold font-headline text-zinc-950 dark:text-white mb-2 text-base">Choose a Project</h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Browse our catalog or request a custom project tailored to your syllabus.</p>
           </div>
           {/* Step 2 */}
           <div className="p-6 bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-cyan-500/40 shadow-xs hover:shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold font-mono mb-4 text-lg">2</div>
              <h4 className="font-bold font-headline text-zinc-950 dark:text-white mb-2 text-base">Review Deliverables</h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Check the included source code, DB scripts, and reports before proceeding.</p>
           </div>
           {/* Step 3 */}
           <div className="p-6 bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-cyan-500/40 shadow-xs hover:shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold font-mono mb-4 text-lg">3</div>
              <h4 className="font-bold font-headline text-zinc-950 dark:text-white mb-2 text-base">Get Your Project</h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Instantly download the complete project files and setup instructions.</p>
           </div>
           {/* Step 4 */}
           <div className="p-6 bg-white dark:bg-zinc-800/60 rounded-2xl border border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-cyan-500/40 shadow-xs hover:shadow-sm transition-transform hover:-translate-y-1">
              <div className="w-10 h-10 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30 flex items-center justify-center font-bold font-mono mb-4 text-lg">4</div>
              <h4 className="font-bold font-headline text-zinc-950 dark:text-white mb-2 text-base">Receive Support</h4>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">Need help running it? Our expert team is available to guide you.</p>
           </div>
        </div>
      </section>



      {/* ── 8. BOTTOM CALL TO ACTION BANNER ── */}
      <section className="bg-zinc-900/90 dark:bg-zinc-950/45 dark:backdrop-blur-2xl text-white rounded-3xl p-6 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden border border-zinc-800 dark:border-white/15 transition-all">
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="inline-block">
            <AnimatedShimmerText>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Ready to Get Your Projects?
              </span>
            </AnimatedShimmerText>
          </div>
          <AnimatedHeading 
            text="Get Your Complete Project Today" 
            highlightWords={["Project", "Today"]}
            className="font-headline font-black text-2xl sm:text-4xl text-white" 
          />
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            Choose from 200+ ready projects or consult with our team for custom syllabus requirements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-2 w-full max-w-md mx-auto sm:max-w-none">
          <button
            onClick={() => onNavigate('browse')}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white text-zinc-950 hover:bg-zinc-100 transition-all hover:scale-105 active:scale-95 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-4 h-4" />
            <span>Browse Projects</span>
          </button>

          <button
            onClick={openCustomProject}
            aria-label="Request Custom Project (opens Google Form in a new tab)"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-white"
          >
            <Plus className="w-4 h-4 shrink-0" />
            <span>Request Custom Project</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-70 ml-0.5 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </section>

      {/* ── 9. Q&A / FREQUENTLY ASKED QUESTIONS (JUST ABOVE FOOTER) ── */}
      <QASection onOpenSupport={onOpenSupport} onNavigate={onNavigate} />
    </div>

      {/* Instant Service Project Details Modal */}
      <InstantServiceModal
        isOpen={isInstantModalOpen}
        onClose={() => setIsInstantModalOpen(false)}
        service={selectedInstantService}
        onNavigate={onNavigate}
      />

    </>
  );
};
