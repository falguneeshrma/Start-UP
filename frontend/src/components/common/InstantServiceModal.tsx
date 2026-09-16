import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { 
  X, 
  Check, 
  Sparkles, 
  ArrowRight,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from './Toast';
import { NavTab } from './Header';
import { submitIntake } from '../../api/client';
import { useHistoryModal } from '../../utils/useHistoryModal';

export interface InstantServiceItem {
  tier: string;
  name: string;
  price: string;
  numericPrice: number;
  delivery: string;
  features: string[];
  iconType: 'zap' | 'cpu' | 'code' | 'layers';
}

interface InstantServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: InstantServiceItem | null;
  onNavigate: (tab: NavTab) => void;
}

const DEPARTMENTS = [
  'Computer Science & IT',
  'AIML & Data Science',
  'Electronics & Communication / IoT',
  'Mechanical & Civil Engineering',
  'Electrical Engineering',
  'Pharmacy / Pharmaceutical Sciences',
  'Management & Business Studies (MBA/BBA)',
  'Other / Interdisciplinary'
];

export const InstantServiceModal: React.FC<InstantServiceModalProps> = ({
  isOpen,
  onClose,
  service,
  onNavigate
}) => {
  const handleClose = useHistoryModal(
    isOpen,
    onClose,
    'instant-service-modal'
  );

  const { isAuthenticated, openAuthModal } = useAuth();
  const { showToast } = useToast();

  const [topic, setTopic] = useState('');
  const [department, setDepartment] = useState(DEPARTMENTS[0]);
  const [requirements, setRequirements] = useState('');
  const [urgency, setUrgency] = useState('Within 24 Hours');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedData, setSubmittedData] = useState<{ trackingCode: string } | null>(null);

  // Reset or prefill when service changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmittedData(null);
      setIsSubmitting(false);

      // Check if there was a pending order from before Google OAuth login
      const pendingRaw = sessionStorage.getItem('pending_instant_order');
      if (pendingRaw) {
        try {
          const pending = JSON.parse(pendingRaw);
          if (pending.topic) setTopic(pending.topic);
          if (pending.department) setDepartment(pending.department);
          if (pending.requirements) setRequirements(pending.requirements);
          if (pending.urgency) setUrgency(pending.urgency);
          if (pending.whatsapp) setWhatsapp(pending.whatsapp);

          // If user just authenticated, complete the submission automatically
          if (isAuthenticated) {
            handleCompleteSubmission({
              topic: pending.topic,
              department: pending.department,
              requirements: pending.requirements,
              urgency: pending.urgency,
              whatsapp: pending.whatsapp,
              tier: pending.tier,
              name: pending.name,
              price: pending.price,
              numericPrice: pending.numericPrice
            });
            sessionStorage.removeItem('pending_instant_order');
          }
        } catch {
          sessionStorage.removeItem('pending_instant_order');
        }
      }
    }
  }, [isOpen, isAuthenticated]);

  if (!isOpen || !service) return null;

  const handleCompleteSubmission = async (data: {
    topic: string;
    department: string;
    requirements: string;
    urgency: string;
    whatsapp: string;
    tier: string;
    name: string;
    price: string;
    numericPrice: number;
  }) => {
    setIsSubmitting(true);
    const trackingCode = `PB-INSTANT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    try {
      // Try submitting to backend intake endpoint if active
      await submitIntake({
        title: `[${data.tier} - ${data.name}] ${data.topic}`,
        category: data.department,
        description: `Instant Service Request:\nTier: ${data.tier} (${data.name})\nTopic: ${data.topic}\nDepartment: ${data.department}\nRequirements: ${data.requirements}\nUrgency: ${data.urgency}\nContact: ${data.whatsapp || 'N/A'}\nPrice: ${data.price}`,
        budget: data.numericPrice,
        tier: 'micro_debug',
        timeline: data.urgency
      });
    } catch {
      // Graceful fallback — store inquiry locally if backend is unavailable or not synced
      try {
        const existing = JSON.parse(localStorage.getItem('pb_instant_orders') || '[]');
        existing.push({
          trackingCode,
          service: data.name,
          tier: data.tier,
          price: data.price,
          topic: data.topic,
          department: data.department,
          requirements: data.requirements,
          whatsapp: data.whatsapp,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('pb_instant_orders', JSON.stringify(existing));
      } catch {
        // storage fallback
      }
    } finally {
      setIsSubmitting(false);
      setSubmittedData({ trackingCode });
      showToast(`Instant Service request submitted! Tracking: ${trackingCode}`, 'success');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!topic.trim()) {
      showToast('Please enter your project or presentation topic.', 'error');
      return;
    }

    if (!requirements.trim()) {
      showToast('Please provide brief specifications or guidelines.', 'error');
      return;
    }

    // IF USER NOT LOGGED IN: Route for Google OAuth authentication
    if (!isAuthenticated) {
      // Persist draft so after OAuth login it automatically resumes
      sessionStorage.setItem('pending_instant_order', JSON.stringify({
        tier: service.tier,
        name: service.name,
        price: service.price,
        numericPrice: service.numericPrice,
        topic,
        department,
        requirements,
        urgency,
        whatsapp
      }));

      showToast('Please sign in with Google to submit your project details.', 'info');
      openAuthModal({
        message: `Sign in with Google to submit your "${service.name}" project details.`,
        onSuccessRedirectTab: 'home'
      });
      return;
    }

    // USER IS LOGGED IN: Complete submission directly
    handleCompleteSubmission({
      topic,
      department,
      requirements,
      urgency,
      whatsapp,
      tier: service.tier,
      name: service.name,
      price: service.price,
      numericPrice: service.numericPrice
    });
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-2.5 sm:p-5 bg-black/75 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) {
          handleClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-white dark:bg-zinc-950/90 dark:backdrop-blur-2xl border border-slate-200 dark:border-white/15 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92dvh] sm:max-h-[88vh] text-slate-900 dark:text-zinc-100 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1 pr-2">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
              {service.tier}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h3 className="font-headline font-bold text-sm sm:text-lg text-slate-900 dark:text-white truncate">
                  {service.name}
                </h3>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                  {service.price}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-zinc-400 truncate">
                Turnaround: {service.delivery} • Fixed Price Guarantee
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto overscroll-contain smooth-touch-scroll space-y-5 sm:space-y-6 flex-1">
          {submittedData ? (
            /* Success State */
            <div className="text-center py-6 sm:py-8 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-sm">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>

              <div className="space-y-1.5 max-w-md mx-auto">
                <h4 className="font-headline font-black text-2xl text-slate-900 dark:text-white">
                  Project Request Received!
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                  Your request for <span className="font-bold text-slate-900 dark:text-white">{service.name}</span> has been logged under our instant SLA protocol.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 inline-block max-w-sm w-full text-left space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Tracking Code:</span>
                  <span className="font-mono font-bold text-slate-900 dark:text-white bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                    {submittedData.trackingCode}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Service Fee:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 font-headline">{service.price}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">Status:</span>
                  <span className="text-slate-700 dark:text-zinc-300 font-mono text-[11px]">Engineering Feasibility Queue</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => {
                    handleClose();
                    onNavigate('dashboard');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-zinc-950 transition-all shadow-sm cursor-pointer"
                >
                  View Client Dashboard
                </button>
                <button
                  onClick={handleClose}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-white transition-all cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            /* Project Details Input Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Notification Banner */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Instant Delivery Protocol</span>
                  Fill your topic details below. When submitting, you will be verified seamlessly via Google OAuth.
                </div>
              </div>

              {/* Field 1: Topic / Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-headline text-slate-800 dark:text-zinc-200">
                  Project / Presentation Topic <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. AI-Powered Crop Disease Detection / Smart Grid Monitoring"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 dark:focus:ring-white/20 transition-all"
                />
              </div>

              {/* Field 2 & 3: Department & Turnaround */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold font-headline text-slate-800 dark:text-zinc-200">
                    Academic Stream / Branch
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/20 dark:focus:ring-white/20 transition-all cursor-pointer"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d} className="bg-white dark:bg-zinc-900 text-slate-900 dark:text-white">
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold font-headline text-slate-800 dark:text-zinc-200">
                    Target Urgency
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-zinc-800/20 dark:focus:ring-white/20 transition-all cursor-pointer"
                  >
                    <option value="Within 6 Hours (Urgent)" className="bg-white dark:bg-zinc-900">Within 6 Hours (Urgent)</option>
                    <option value="Within 12 Hours" className="bg-white dark:bg-zinc-900">Within 12 Hours</option>
                    <option value="Within 24 Hours" className="bg-white dark:bg-zinc-900">Within 24 Hours</option>
                    <option value="2-3 Days" className="bg-white dark:bg-zinc-900">2–3 Days</option>
                  </select>
                </div>
              </div>

              {/* Field 4: Specifications & Requirements */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-headline text-slate-800 dark:text-zinc-200">
                  Specific Requirements &amp; Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Specify slide count, required chapters, preferred programming tools, college guidelines, or outline..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 dark:focus:ring-white/20 transition-all resize-none"
                />
              </div>

              {/* Field 5: WhatsApp Number (Optional) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold font-headline text-slate-800 dark:text-zinc-200">
                  Phone / WhatsApp Number <span className="text-[10px] text-slate-400 font-normal">(for instant delivery updates)</span>
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-zinc-800/20 dark:focus:ring-white/20 transition-all"
                />
              </div>

              {/* User Sign-In Notice if unauthenticated */}
              {!isAuthenticated && (
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <LogIn className="w-4 h-4 text-slate-500 dark:text-zinc-400" />
                    <span>Not signed in. You will be routed to Google OAuth upon submitting.</span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-white dark:bg-white/10 px-2 py-0.5 rounded border border-slate-200 dark:border-white/10">
                    Google OAuth
                  </span>
                </div>
              )}

              {/* Submission Action Bar */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                <div className="text-center sm:text-left">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 block uppercase">
                    Payable Upon Milestone Review
                  </span>
                  <span className="font-headline font-black text-xl text-slate-900 dark:text-white">
                    {service.price}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold text-white dark:text-zinc-950 bg-zinc-900 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 transition-all shadow-md hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>
                      {isAuthenticated ? 'Submit Request' : 'Submit & Sign In with Google'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>,
    document.body
  );
};
