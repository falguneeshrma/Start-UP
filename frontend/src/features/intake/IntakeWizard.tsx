import React, { useState, useMemo, useEffect } from 'react';
import { ServiceTier } from '../../types';
import { calculateGST, formatINR } from '../../utils/gst';
import { screenRequirementUGC } from '../../utils/ugcFilter';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Headphones, 
  FileText, 
  Clock, 
  ChevronDown 
} from 'lucide-react';
import { NavTab } from '../../components/common/Header';
import { useToast } from '../../components/common/Toast';
import { ProjectItem } from '../browse/BrowseProjects';

interface IntakeWizardProps {
  onNavigate?: (tab: NavTab) => void;
  onOpenSupport?: () => void;
  selectedTemplate?: ProjectItem | null;
}

export const IntakeWizard: React.FC<IntakeWizardProps> = ({ 
  onNavigate, 
  onOpenSupport,
  selectedTemplate
}) => {
  const { showToast } = useToast();

  const [formStep, setFormStep] = useState<1 | 2 | 3>(1);
  const [projectTitle, setProjectTitle] = useState('');
  const [category, setCategory] = useState('engineering');
  const [techPreference, setTechPreference] = useState('');
  const [description, setDescription] = useState('');
  const [university, setUniversity] = useState('');
  const [semester, setSemester] = useState('senior');
  const [budgetTier, setBudgetTier] = useState<ServiceTier>('mvp_development');
  const [budgetAmount, setBudgetAmount] = useState(45000);
  const [deadline, setDeadline] = useState('');
  const [isMaharashtra, setIsMaharashtra] = useState(true);
  const [ugcConfirmed, setUgcConfirmed] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Sync wizard steps with browser history
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && typeof e.state.formStep === 'number') {
        setFormStep(e.state.formStep as 1 | 2 | 3);
      } else {
        setFormStep(1);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const goToStep = (nextStep: 1 | 2 | 3) => {
    if (nextStep > formStep) {
      window.history.pushState({ ...window.history.state, formStep: nextStep }, '', window.location.href);
    } else if (window.history.state?.formStep) {
      window.history.back();
      return;
    }
    setFormStep(nextStep);
  };

  useEffect(() => {
    if (selectedTemplate) {
      setProjectTitle(selectedTemplate.title);
      setDescription(selectedTemplate.description);
      setTechPreference(selectedTemplate.tags.join(', '));
      setBudgetAmount(selectedTemplate.budget);
      if (selectedTemplate.budget >= 60000) {
        setBudgetTier('enterprise_ai');
      } else if (selectedTemplate.budget >= 25000) {
        setBudgetTier('mvp_development');
      } else if (selectedTemplate.budget >= 10000) {
        setBudgetTier('research_support');
      } else {
        setBudgetTier('micro_debug');
      }
    }
  }, [selectedTemplate]);

  const ugcScreening = useMemo(() => {
    return screenRequirementUGC(description + ' ' + projectTitle);
  }, [description, projectTitle]);

  const gstBreakdown = useMemo(() => {
    return calculateGST(budgetAmount, isMaharashtra, '998314');
  }, [budgetAmount, isMaharashtra]);

  const handleBudgetOption = (tier: ServiceTier, amount: number) => {
    setBudgetTier(tier);
    setBudgetAmount(amount);
  };

  const handleSaveDraft = () => {
    try {
      const draft = {
        projectTitle,
        category,
        techPreference,
        description,
        university,
        semester,
        budgetTier,
        budgetAmount,
        deadline,
        isMaharashtra,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('projectbridge_draft_requirement', JSON.stringify(draft));
      showToast('Draft requirement saved successfully to local storage!', 'success');
    } catch {
      showToast('Draft saved in memory', 'info');
    }
  };

  const handleSubmitRequirement = () => {
    setIsSubmitted(true);
    showToast('Requirement submitted! Status tracker activated.', 'success');
  };

  return (
    <main className="flex-grow w-full max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12">
      {isSubmitted ? (
        /* Requirement Confirmation View */
        <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-300">
          {/* Header & Success Hero */}
          <div className="text-center space-y-2.5 sm:space-y-3">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-zinc-900 flex items-center justify-center mx-auto shadow-md">
              <Check className="w-7 h-7 sm:w-8 sm:h-8 text-white stroke-[3]" />
            </div>
            <h2 className="font-headline text-2xl sm:text-3xl font-bold text-zinc-900">Success!</h2>
            <p className="text-xs sm:text-sm text-zinc-600">Your requirement has been securely submitted and verified.</p>
            <div className="inline-block bg-zinc-100 px-3.5 py-1.5 rounded-xl border border-zinc-200 shadow-sm mt-2">
              <span className="text-xs text-zinc-500 font-medium">Request ID:</span>
              <span className="text-xs font-mono font-bold text-zinc-900 ml-2">REQ-8492-X</span>
            </div>
          </div>

          {/* Status Tracker Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 p-5 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-200 pb-4 gap-2">
              <h3 className="font-headline font-bold text-base sm:text-lg text-zinc-900">Status Tracker</h3>
              <span className="text-[10px] sm:text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200 self-start sm:self-auto">
                Scope Feasibility Verified
              </span>
            </div>

            <div className="relative pl-6 space-y-8">
              {/* Connecting vertical Line */}
              <div className="absolute left-[27px] top-[14px] bottom-[14px] w-[2px] bg-zinc-200"></div>
              <div className="absolute left-[27px] top-[14px] h-[35%] w-[2px] bg-zinc-900"></div>

              {/* Step 1 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-sm">
                  <Check className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Submitted &amp; Verified</p>
                  <p className="text-[11px] text-zinc-500 font-mono">Today, 10:42 AM</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-zinc-900 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 animate-pulse"></div>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Pending Admin Approval</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Awaiting technical feasibility review from Om &amp; Somnath (24h SLA).</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 relative z-10 opacity-60">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200">
                  <Clock className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Sprint Planning &amp; SOW Generation</p>
                  <p className="text-xs text-zinc-500">Formal GST invoice &amp; milestone schedule issuance.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-4 relative z-10 opacity-60">
                <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center shrink-0 mt-0.5 border border-zinc-200">
                  <FileText className="w-4 h-4 text-zinc-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-900">Project Kickoff &amp; Staging Deployment</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {onNavigate && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-8 py-3 rounded-xl bg-zinc-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all"
              >
                Open in User Dashboard
              </button>
            )}
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormStep(1);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-bold hover:bg-zinc-200 transition-colors"
            >
              Submit Another Project
            </button>
          </div>

          {/* Support button */}
          <div className="text-center pt-4">
            <button 
              onClick={onOpenSupport}
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-600 hover:text-zinc-900 py-2 px-4 rounded-full bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition-colors cursor-pointer"
            >
              <Headphones className="w-4 h-4 text-zinc-800" />
              <span>Need help? Chat with Support Team</span>
            </button>
          </div>
        </div>
      ) : (
        /* Multi-Step Submit Requirement Form */
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center mb-6 sm:mb-8 space-y-2 max-w-xl mx-auto">
            <h1 className="font-headline text-2xl sm:text-4xl font-bold text-zinc-900 dark:text-white">
              Submit New Requirement
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
              Provide the details below to help our architecture team scope, benchmark, and match you with the right engineering squad.
            </p>
          </div>

          {/* Multi-step Form Container */}
          <div className="bg-white dark:bg-[#080d1a] rounded-2xl sm:rounded-[24px] shadow-sm border border-zinc-200 dark:border-white/10 overflow-hidden hover-lift transition-all max-w-3xl mx-auto">
            {/* Progress Bar Header */}
            <div className="p-4 sm:p-8 pb-4 sm:pb-5 bg-white dark:bg-white/5 border-b border-zinc-200 dark:border-white/10">
              <div className="flex flex-wrap justify-between items-center gap-2 mb-2.5 text-xs font-mono font-medium text-zinc-600 dark:text-zinc-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 animate-radar-ping shrink-0"></span>
                  <span>
                    {formStep === 1 && 'Step 1 of 3: Project Basics'}
                    {formStep === 2 && 'Step 2 of 3: Academic & Logistics'}
                    {formStep === 3 && 'Step 3 of 3: Compliance & Review'}
                  </span>
                </span>
                <span className="text-zinc-900 dark:text-white font-bold ml-auto sm:ml-0">
                  {formStep === 1 && '33%'}
                  {formStep === 2 && '66%'}
                  {formStep === 3 && '100%'}
                </span>
              </div>

              <div className="w-full bg-zinc-100 dark:bg-white/10 h-2 rounded-full overflow-hidden border border-zinc-200 dark:border-white/10">
                <div 
                  className="bg-zinc-900 dark:bg-zinc-100 h-full transition-all duration-500 ease-out rounded-full" 
                  style={{ width: `${formStep === 1 ? 33 : formStep === 2 ? 66 : 100}%` }}
                ></div>
              </div>

              {/* Visual Step Indicators */}
              <div className="flex justify-between items-center mt-4 sm:mt-6 relative max-w-xs sm:max-w-sm mx-auto">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-zinc-200 dark:bg-zinc-700 -z-10 -translate-y-1/2"></div>
                
                {/* Step 1 Pill */}
                <button 
                  type="button"
                  onClick={() => setFormStep(1)}
                  className="flex flex-col items-center gap-1 sm:gap-1.5 z-10 bg-white dark:bg-zinc-900/90 px-2 sm:px-3 rounded-lg cursor-pointer group"
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    formStep >= 1 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-600 group-hover:bg-zinc-200'
                  }`}>
                    1
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold text-zinc-900 dark:text-white uppercase tracking-wider">BASICS</span>
                </button>

                {/* Step 2 Pill */}
                <button 
                  type="button"
                  onClick={() => setFormStep(2)}
                  className="flex flex-col items-center gap-1 sm:gap-1.5 z-10 bg-white dark:bg-zinc-900/90 px-2 sm:px-3 rounded-lg cursor-pointer group"
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    formStep >= 2 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-600 group-hover:bg-zinc-200'
                  }`}>
                    2
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                    formStep >= 2 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    DETAILS
                  </span>
                </button>

                {/* Step 3 Pill */}
                <button 
                  type="button"
                  onClick={() => setFormStep(3)}
                  className="flex flex-col items-center gap-1 sm:gap-1.5 z-10 bg-white dark:bg-zinc-900/90 px-2 sm:px-3 rounded-lg cursor-pointer group"
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                    formStep === 3 ? 'bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100 shadow-sm' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border-zinc-300 dark:border-zinc-600 group-hover:bg-zinc-200'
                  }`}>
                    3
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-wider ${
                    formStep === 3 ? 'text-zinc-900 dark:text-white' : 'text-zinc-400 dark:text-zinc-500'
                  }`}>
                    REVIEW
                  </span>
                </button>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
              {formStep === 1 && (
                /* Step 1: Project Basics */
                <div className="space-y-6 animate-fade-in-up">
                  <div>
                    <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-white mb-1">Project Basics</h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Provide the high-level overview of what you want to build.</p>
                  </div>

                  <div className="space-y-4 text-xs">
                    <div>
                      <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5" htmlFor="project-title">
                        Requirement Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="project-title"
                        type="text"
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. AI Vision Segmentation Pipeline"
                        className="w-full h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 px-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5">
                          Category <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 px-4 text-sm text-zinc-900 dark:text-zinc-100 appearance-none focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all cursor-pointer"
                          >
                            <option value="engineering">Engineering projects</option>
                            <option value="pharmacy">Pharmacy thesis &amp; projects</option>
                            <option value="business">Business related project</option>
                            <option value="research">Research paper publish</option>
                            <option value="ui_design">UI designing</option>
                            <option value="deployment">Deployment Services</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>

                      <div>
                        <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5">Tech Preferences</label>
                        <input
                          type="text"
                          value={techPreference}
                          onChange={(e) => setTechPreference(e.target.value)}
                          placeholder="e.g. React, Node.js, PyTorch, AWS"
                          className="w-full h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 px-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5">Detailed Scope Description</label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe the core objective, expected APIs, and deliverables..."
                        className="w-full rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 p-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formStep === 2 && (
                /* Step 2: Academic & Logistics */
                <div className="space-y-6 animate-fade-in-up">
                  <div>
                    <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-white mb-1">Academic Context &amp; Logistics</h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Specify timeline, institution, and budget range.</p>
                  </div>

                  <div className="space-y-5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5">University / Institution</label>
                        <input
                          type="text"
                          value={university}
                          onChange={(e) => setUniversity(e.target.value)}
                          placeholder="e.g. VJTI Mumbai / IIT Bombay"
                          className="w-full h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 px-4 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5">Year Level / Category</label>
                        <div className="relative">
                          <select
                            value={semester}
                            onChange={(e) => setSemester(e.target.value)}
                            className="w-full h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 px-4 text-sm text-zinc-900 dark:text-zinc-100 appearance-none focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all cursor-pointer"
                          >
                            <option value="senior">Year 4 (Senior Project)</option>
                            <option value="grad">Graduate / Masters</option>
                            <option value="phd">PhD Researcher</option>
                            <option value="sme">Startup Founder / SME</option>
                          </select>
                          <ChevronDown className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {/* Budget Radio Pills */}
                    <div>
                      <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-2">Estimated Budget Range (INR)</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { tier: 'micro_debug', label: '₹2k – ₹10k', amount: 5000, name: 'Micro' },
                          { tier: 'research_support', label: '₹10k – ₹30k', amount: 20000, name: 'Research' },
                          { tier: 'mvp_development', label: '₹25k – ₹60k', amount: 45000, name: 'MVP' },
                          { tier: 'enterprise_ai', label: '₹60k+', amount: 85000, name: 'Enterprise' },
                        ].map((b) => (
                          <div
                            key={b.tier}
                            onClick={() => handleBudgetOption(b.tier as ServiceTier, b.amount)}
                            className={`h-16 flex flex-col items-center justify-center rounded-xl border cursor-pointer transition-all hover-lift active:scale-95 ${
                              budgetTier === b.tier
                                ? 'border-zinc-900 dark:border-white bg-zinc-900 dark:bg-white font-bold text-white dark:text-zinc-900 shadow-sm'
                                : 'border-zinc-200 dark:border-white/10 bg-zinc-50 dark:bg-white/5 text-zinc-800 dark:text-zinc-200 hover:border-zinc-300 dark:hover:border-white/25 hover:bg-zinc-100 dark:hover:bg-white/10'
                            }`}
                          >
                            <span className="text-xs">{b.label}</span>
                            <span className={`text-[10px] font-mono font-normal ${budgetTier === b.tier ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500 dark:text-zinc-400'}`}>
                              Tier: {b.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-zinc-800 dark:text-zinc-200 font-semibold mb-1.5">Target Delivery Deadline</label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full h-12 rounded-xl bg-white dark:bg-[#0c1322] border border-zinc-300 dark:border-white/10 px-4 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-zinc-900 dark:focus:border-white/30 focus:ring-2 focus:ring-zinc-900/10 dark:focus:ring-white/10 transition-all cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formStep === 3 && (
                /* Step 3: Review, Scope Verification & GST Summary */
                <div className="space-y-6 animate-fade-in-up">
                  <div>
                    <h2 className="font-headline text-lg font-bold text-zinc-900 dark:text-white mb-1">Scope &amp; Quotation Review</h2>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">Verify requirement specifications and review the GST calculation.</p>
                  </div>

                  {/* Scope Feasibility check */}
                  {!ugcScreening.passed ? (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3 text-xs">
                      <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-amber-900 dark:text-amber-200">Technical Scope Notice</p>
                        <p className="text-amber-800 dark:text-amber-300 mt-0.5">{ugcScreening.notes}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-3 text-xs text-emerald-800 dark:text-emerald-300">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Technical Scope Feasibility: <strong className="text-zinc-900 dark:text-white font-bold">Verified (Passed Standards)</strong></span>
                    </div>
                  )}

                  {/* Live Cost & GST Breakdown Card */}
                  <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 space-y-3 text-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1.5 border-b border-zinc-200 dark:border-white/10 pb-2">
                      <span className="font-bold text-zinc-900 dark:text-white uppercase font-mono">Invoice Summary</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsMaharashtra(!isMaharashtra);
                          showToast(
                            isMaharashtra ? 'Switched to Interstate IGST (18%)' : 'Switched to Maharashtra CGST+SGST (18%)',
                            'info'
                          );
                        }}
                        className="text-[11px] font-mono text-zinc-700 dark:text-zinc-300 font-semibold underline hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer text-left sm:text-right"
                      >
                        {isMaharashtra ? 'Maharashtra (CGST+SGST 18%)' : 'Interstate (IGST 18%)'}
                      </button>
                    </div>

                    <div className="space-y-1.5 text-zinc-700 dark:text-zinc-300">
                      <div className="flex justify-between">
                        <span>Scope Base Amount:</span>
                        <span className="font-mono font-bold text-zinc-900 dark:text-white">{formatINR(gstBreakdown.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>GST (SAC 998314 - 18%):</span>
                        <span className="font-mono text-zinc-900 dark:text-white">{formatINR(gstBreakdown.totalTax)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-extrabold text-zinc-900 dark:text-white pt-2 border-t border-zinc-200 dark:border-white/10">
                        <span>Total Due (incl. GST):</span>
                        <span className="font-mono text-zinc-900 dark:text-white">{formatINR(gstBreakdown.grandTotal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mandatory Scope Declaration Checkbox */}
                  <div className="p-4 rounded-xl bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/10 shadow-sm">
                    <label className="flex items-start gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={ugcConfirmed}
                        onChange={(e) => setUgcConfirmed(e.target.checked)}
                        className="mt-0.5 w-4 h-4 rounded border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 focus:ring-zinc-900 accent-zinc-900 dark:accent-zinc-100 cursor-pointer"
                      />
                      <span className="text-xs text-zinc-700 dark:text-zinc-300 leading-relaxed">
                        <strong className="text-zinc-900 dark:text-white">Mandatory Project Declaration:</strong> I confirm deliverables consist strictly of custom engineering, proof-of-concept software, architecture designs, or academic thesis research assistance. I retain full IP ownership.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Action Buttons Footer */}
              <div className="flex flex-col sm:flex-row justify-between items-center pt-6 border-t border-zinc-200 dark:border-white/10 gap-3 w-full">
                {formStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => goToStep((formStep - 1) as 1 | 2 | 3)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-200 dark:border-white/10 flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSaveDraft}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-bold text-xs text-zinc-700 dark:text-zinc-200 bg-zinc-100 dark:bg-white/10 hover:bg-zinc-200 dark:hover:bg-white/20 border border-zinc-200 dark:border-white/10 shadow-sm transition-colors active:scale-95 cursor-pointer justify-center"
                  >
                    Save Draft
                  </button>
                )}

                {formStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (!projectTitle.trim()) {
                        showToast('Please enter a requirement title', 'error');
                        return;
                      }
                      goToStep((formStep + 1) as 1 | 2 | 3);
                    }}
                    className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs text-white dark:text-zinc-900 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white shadow-sm flex items-center justify-center gap-2 transition-transform active:scale-95 sm:ml-auto cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!ugcConfirmed || !ugcScreening.passed}
                    onClick={handleSubmitRequirement}
                    className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-transform sm:ml-auto ${
                      ugcConfirmed && ugcScreening.passed
                        ? 'bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 shadow-sm active:scale-95 cursor-pointer'
                        : 'bg-zinc-100 dark:bg-white/5 text-zinc-400 dark:text-zinc-500 border border-zinc-200 dark:border-white/10 cursor-not-allowed'
                    }`}
                  >
                    <span>Submit Requirement</span>
                    <Check className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
