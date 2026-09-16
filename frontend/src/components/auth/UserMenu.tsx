import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { 
  LogOut, 
  ShieldCheck, 
  LayoutDashboard, 
  ChevronDown
} from 'lucide-react';

interface UserMenuProps {
  onNavigate: (tab: any) => void;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onNavigate }) => {
  const { 
    user, 
    isAuthenticated, 
    isAdmin, 
    openAuthModal, 
    logout 
  } = useAuth();
  
  const { showToast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    showToast('You have been signed out from your Google session.', 'info');
  };

  if (!isAuthenticated || !user) {
    return (
      <button
        type="button"
        onClick={() => openAuthModal({})}
        className="shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-zinc-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 rounded-full text-xs sm:text-sm font-semibold shadow-sm transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        title="Sign In"
        aria-label="Sign In"
      >
        <span className="min-[400px]:inline">Sign In</span>
      </button>
    );
  }

  const roleLabel = isAdmin ? 'Admin' : 'Client';
  const roleColor = isAdmin 
    ? 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800' 
    : 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700';

  return (
    <div className="relative shrink-0" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="shrink-0 flex items-center gap-1.5 sm:gap-2 p-1 pl-1.5 pr-2.5 sm:pr-3 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800/80 dark:hover:bg-zinc-700/80 border border-zinc-200 dark:border-zinc-700/80 rounded-full transition-all duration-200 active:scale-95 text-zinc-900 dark:text-zinc-100 text-xs font-semibold cursor-pointer"
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt={user.fullName}
            className="w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover border border-zinc-300 dark:border-zinc-600 shrink-0"
          />
        ) : (
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-xs shrink-0">
            {user.fullName.charAt(0)}
          </div>
        )}

        <span className="max-w-[70px] sm:max-w-[100px] xl:max-w-[130px] truncate hidden sm:inline">
          {user.fullName}
        </span>

        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${roleColor} hidden xl:inline`}>
          {roleLabel}
        </span>

        <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-950/85 dark:backdrop-blur-2xl border border-zinc-200 dark:border-white/15 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          {/* User Header */}
          <div className="p-4 border-b border-zinc-100 dark:border-white/10 bg-zinc-50 dark:bg-white/5">
            <div className="flex items-center gap-3">
              {user.picture ? (
                <img
                  src={user.picture}
                  alt={user.fullName}
                  className="w-10 h-10 rounded-full object-cover border border-zinc-200 dark:border-white/10 shadow-sm"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 flex items-center justify-center font-bold text-sm">
                  {user.fullName.charAt(0)}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                    {user.fullName}
                  </h4>
                  {isAdmin && (
                    <ShieldCheck className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-[11px] pt-2 border-t border-zinc-200 dark:border-white/10">
              <span className="text-zinc-500 dark:text-zinc-400">Account Type:</span>
              <span className={`font-mono font-semibold px-2 py-0.5 rounded border ${roleColor}`}>
                {user.role}
              </span>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1 text-xs">
            <button
              type="button"
              onClick={() => {
                onNavigate('dashboard');
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4 text-zinc-500" />
              <span>Client Dashboard Hub</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onNavigate('admin');
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between px-3 py-2 text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 rounded-xl transition-colors text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>Admin Operations & Pipeline</span>
              </div>
              {!isAdmin && (
                <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-mono border border-red-200">
                  Restricted
                </span>
              )}
            </button>


            {/* Sign Out */}
            <div className="pt-1 border-t border-zinc-100 dark:border-white/10">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors text-left font-medium cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
