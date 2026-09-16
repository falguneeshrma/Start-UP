import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ConfigProvider, useConfig } from './context/ConfigContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Header, NavTab } from './components/common/Header';
import { LandingPage } from './features/home/LandingPage';
import { BrowseProjects, ProjectItem } from './features/browse/BrowseProjects';
import { IntakeWizard } from './features/intake/IntakeWizard';
import { ClientProjectHub } from './features/dashboard/ClientProjectHub';
import { OperationsDashboard } from './features/operations/OperationsDashboard';
import { EngineeringPipeline } from './features/engineering/EngineeringPipeline';
import { ToastProvider } from './components/common/Toast';
import { ClientAuthModal } from './components/auth/ClientAuthModal';
import { AdminGuard } from './components/auth/AdminGuard';
import { ScrollMotionBackground } from './components/common/ScrollMotionBackground';
import { WorkInProgress } from './features/download/WorkInProgress';
import { CustomerReviews } from './features/reviews/CustomerReviews';
import { BestSellingProjects } from './features/bestseller/BestSellingProjects';
import { Home, Compass, ClipboardList, Lock, User, LayoutDashboard, LogIn, Layers, Zap } from 'lucide-react';
import { parseLocation, pushNavigation, replaceNavigation } from './utils/navigation';

export const AppContent: React.FC = () => {
  // Initialize state directly from the current URL / session
  const [activeTab, setActiveTab] = useState<NavTab>(() => parseLocation().tab);
  const [searchQuery, setSearchQuery] = useState(() => parseLocation().query || '');
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectItem | null>(null);
  const { isAuthenticated, isAdmin, openAuthModal } = useAuth();
  const { telegramBotUsername } = useConfig();

  // Establish initial state in browser history so entry 0 has complete state
  useEffect(() => {
    const loc = parseLocation();

    // If attempting to access protected client route without auth, redirect to home with replaceState
    if (!isAuthenticated && loc.tab === 'dashboard') {
      replaceNavigation('home', { modal: null });
      setActiveTab('home');
      return;
    }

    replaceNavigation(loc.tab, {
      query: loc.query,
      templateId: loc.templateId,
      modal: loc.modal,
    });
  }, []);

  // Listen for browser Back and Forward button events (popstate)
  useEffect(() => {
    const handlePopState = () => {
      const loc = parseLocation();

      // Update current active tab
      setActiveTab(loc.tab);

      // Restore search query if provided in URL or cleared
      setSearchQuery(loc.query || '');


      // Smoothly scroll to top on back/forward
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // If user logs out while on a protected client tab, reset back to public landing page
  useEffect(() => {
    if (!isAuthenticated && activeTab === 'dashboard') {
      handleTabChange('home', { replace: true });
    }
  }, [isAuthenticated, activeTab]);

  const handleTabChange = (
    tab: NavTab, 
    options?: { replace?: boolean; query?: string; template?: ProjectItem | null }
  ) => {
    // Gate user-access routing behind OAuth authentication
    if (tab === 'dashboard' && !isAuthenticated) {
      openAuthModal({
        message: 'Please sign in to access your Project Wallah Client Dashboard.',
        onSuccessRedirectTab: 'dashboard'
      });
      return;
    }

    if (tab === 'admin' && !isAuthenticated) {
      // Allow them to reach the AdminGuard which will handle the admin login
    }

    const currentQuery = options?.query !== undefined ? options.query : (tab === 'browse' ? searchQuery : '');
    const currentTemplate = options?.template !== undefined ? options.template : selectedTemplate;

    if (options?.replace) {
      replaceNavigation(tab, {
        query: currentQuery,
        templateId: currentTemplate?.id,
        modal: null,
      });
    } else {
      pushNavigation(tab, {
        query: currentQuery,
        templateId: currentTemplate?.id,
        modal: null,
      });
    }

    setActiveTab(tab);
    if (options?.query !== undefined) {
      setSearchQuery(options.query);
    }
    if (options?.template !== undefined) {
      setSelectedTemplate(options.template);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    handleTabChange('browse', { query });
  };

  const handleSelectTemplate = (template: ProjectItem) => {
    setSelectedTemplate(template);
    handleTabChange('submit', { template });
  };

  const handleOpenSupport = () => {
    window.open(`https://t.me/${telegramBotUsername}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 flex flex-col font-body selection:bg-cyan-500 selection:text-white pb-20 sm:pb-24 md:pb-0 relative transition-colors duration-300">
      {/* High-Tech Animated Circuit Background */}
      <ScrollMotionBackground />

      {/* Top Project Wallah Navigation Header */}
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onOpenSupport={handleOpenSupport}
        onSearchSubmit={handleSearchSubmit}
      />

      {/* Main Content View Switcher */}
      <main className="flex-1 relative w-full overflow-x-hidden">
        {activeTab === 'home' && (
          <LandingPage 
            onNavigate={handleTabChange}
            onOpenSupport={handleOpenSupport}
          />
        )}

        {activeTab === 'dashboard' && isAuthenticated && (
          <ClientProjectHub 
            onNavigate={handleTabChange} 
            onOpenSupport={handleOpenSupport}
            onSelectTemplate={handleSelectTemplate}
          />
        )}

        {activeTab === 'dashboard' && !isAuthenticated && (
          <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
            <div className="max-w-md w-full text-center space-y-6 bg-white/80 dark:bg-zinc-900/70 backdrop-blur-xl border border-zinc-200 dark:border-white/10 rounded-3xl p-8 shadow-xl">
              <div className="w-14 h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center mx-auto shadow-sm">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h2 className="font-headline font-bold text-2xl text-zinc-900 dark:text-white">
                  Client Workspace Sign In
                </h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Please sign in with Google to access your Project Wallah dashboard, track active milestones, and manage project deliverables.
                </p>
              </div>
              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => openAuthModal({
                    message: 'Sign in to access your Project Wallah Client Dashboard.',
                    onSuccessRedirectTab: 'dashboard'
                  })}
                  className="w-full py-3 px-4 rounded-xl bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                  Sign In with Google
                </button>
                <button
                  type="button"
                  onClick={() => handleTabChange('browse')}
                  className="w-full py-2.5 px-4 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs transition-all cursor-pointer"
                >
                  Explore Projects Instead
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'browse' && (
          <BrowseProjects 
            onNavigate={handleTabChange} 
            initialSearch={searchQuery}
            onSelectProject={handleSelectTemplate}
          />
        )}

        {activeTab === 'submit' && (
          <IntakeWizard 
            onNavigate={handleTabChange} 
            onOpenSupport={handleOpenSupport}
            selectedTemplate={selectedTemplate}
          />
        )}

        {activeTab === 'admin' && (
          <AdminGuard onNavigateToDashboard={() => handleTabChange('dashboard')}>
            <div className="space-y-8 sm:space-y-12 max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
              <OperationsDashboard />
              <div className="border-t border-zinc-200 dark:border-zinc-800 pt-8">
                <EngineeringPipeline />
              </div>
            </div>
          </AdminGuard>
        )}

        {activeTab === 'download' && (
          <WorkInProgress onNavigate={handleTabChange} />
        )}

        {activeTab === 'reviews' && (
          <CustomerReviews onNavigate={handleTabChange} />
        )}

        {activeTab === 'bestseller' && (
          <BestSellingProjects 
            onNavigate={handleTabChange} 
            onOpenSupport={handleOpenSupport}
          />
        )}
      </main>

      {/* Client Authentication Modal */}
      <ClientAuthModal onNavigate={handleTabChange} />

      {/* Modern Clean Centrally Aligned Footer */}
      <footer className="border-t border-zinc-200/80 dark:border-white/10 bg-white/85 dark:bg-zinc-950/40 dark:backdrop-blur-xl py-8 sm:py-10 px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 text-xs text-zinc-500 dark:text-zinc-400 relative z-10 transition-colors">
        <div className="max-w-[1440px] mx-auto flex flex-col items-center justify-center gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
            <div className="flex items-center justify-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shadow-xs">
                P
              </div>
              <span className="font-headline font-bold text-zinc-900 dark:text-white text-base">Project Wallah</span>
            </div>
            <button onClick={() => handleTabChange('home')} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Home</button>
            <button onClick={() => handleTabChange('browse')} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Projects</button>
            <button 
              onClick={() => {
                if (activeTab !== 'home') handleTabChange('home');
                setTimeout(() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Categories
            </button>
            <button 
              onClick={() => {
                if (activeTab !== 'home') handleTabChange('home');
                setTimeout(() => document.getElementById('services-tiers-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Services
            </button>
            <button 
              onClick={() => {
                if (activeTab !== 'home') handleTabChange('home');
                setTimeout(() => document.getElementById('protocol-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button 
              onClick={() => {
                if (activeTab !== 'home') handleTabChange('home');
                setTimeout(() => document.getElementById('qa-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }} 
              className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </button>
            <button onClick={() => handleTabChange('reviews')} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Reviews</button>
            {isAuthenticated ? (
              <>
                <button onClick={() => handleTabChange('dashboard')} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Dashboard Hub</button>
                <button onClick={() => handleTabChange('submit')} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Submit Requirement</button>
                <button onClick={() => handleTabChange('admin')} className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer">Admin Control</button>
              </>
            ) : (
              <button 
                onClick={() => openAuthModal({ message: 'Sign in to access your Project Wallah client workspace.' })} 
                className="hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Sign In / Client Portal
              </button>
            )}
          </div>

          <p className="font-mono text-[11px] text-zinc-400 dark:text-zinc-500 text-center">
            © 2026 Project Wallah. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Bottom Navigation Bar (Mobile View: High performance, fluid width across small screens) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 w-full flex justify-around items-center px-1 sm:px-2 pt-1 pb-1.5 safe-area-bottom md:hidden bg-white dark:bg-[#080d1a] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_24px_rgba(0,0,0,0.4)] z-40 border-t border-zinc-200 dark:border-white/10 transition-colors will-change-transform"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* Home Tab */}
        <button
          type="button"
          onClick={() => handleTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'home'
              ? 'text-zinc-900 dark:text-white font-bold bg-zinc-100 dark:bg-zinc-800/90 shadow-xs'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Home className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 ${activeTab === 'home' ? 'text-zinc-900 dark:text-white' : ''}`} />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Home</span>
        </button>

        {/* Browse Projects Tab */}
        <button
          type="button"
          onClick={() => handleTabChange('browse')}
          className={`flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
            activeTab === 'browse'
              ? 'text-zinc-900 dark:text-white font-bold bg-zinc-100 dark:bg-zinc-800/90 shadow-xs'
              : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          <Compass className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 ${activeTab === 'browse' ? 'text-zinc-900 dark:text-white' : ''}`} />
          <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Browse</span>
        </button>

        {isAuthenticated ? (
          /* Authenticated User Mobile Tabs */
          <>
            <button
              type="button"
              onClick={() => handleTabChange('dashboard')}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'text-zinc-900 dark:text-white font-bold bg-zinc-100 dark:bg-zinc-800/90 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 ${activeTab === 'dashboard' ? 'text-zinc-900 dark:text-white' : ''}`} />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('submit')}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all cursor-pointer ${
                activeTab === 'submit'
                  ? 'text-zinc-900 dark:text-white font-bold bg-zinc-100 dark:bg-zinc-800/90 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              <ClipboardList className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 ${activeTab === 'submit' ? 'text-zinc-900 dark:text-white' : ''}`} />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Submit</span>
            </button>

            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all relative cursor-pointer ${
                activeTab === 'admin'
                  ? 'text-zinc-900 dark:text-white font-bold bg-zinc-100 dark:bg-zinc-800/90 shadow-xs'
                  : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              {isAdmin ? (
                <User className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 ${activeTab === 'admin' ? 'text-zinc-900 dark:text-white' : ''}`} />
              ) : (
                <Lock className={`w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 ${activeTab === 'admin' ? 'text-zinc-900 dark:text-white' : 'text-amber-500'}`} />
              )}
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Admin</span>
            </button>
          </>
        ) : (
          /* Public Visitor Mobile Tabs */
          <>
            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'home') handleTabChange('home');
                setTimeout(() => document.getElementById('categories-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Layers className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Categories</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (activeTab !== 'home') handleTabChange('home');
                setTimeout(() => document.getElementById('services-tiers-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
              }}
              className="flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <Zap className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0 text-amber-500" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Services</span>
            </button>

            <button
              type="button"
              onClick={() => openAuthModal({ message: 'Sign in to access your student project dashboard.' })}
              className="flex flex-col items-center justify-center flex-1 min-w-0 min-h-[44px] py-1 px-0.5 rounded-xl transition-all text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 cursor-pointer"
            >
              <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mb-0.5 shrink-0" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-tight truncate max-w-full">Sign In</span>
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

/**
 * AppWithOAuth: Inner app that reads googleClientId from ConfigContext.
 * ConfigProvider must be an ancestor of this component.
 */
const AppWithOAuth: React.FC = () => {
  const { config } = useConfig();
  // Use empty string until config loads — GoogleOAuthProvider handles empty clientId gracefully
  const googleClientId = config?.googleClientId || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
};

export const App: React.FC = () => {
  return (
    <ConfigProvider>
      <ThemeProvider>
        <ToastProvider>
          <AppWithOAuth />
        </ToastProvider>
      </ThemeProvider>
    </ConfigProvider>
  );
};

export default App;
