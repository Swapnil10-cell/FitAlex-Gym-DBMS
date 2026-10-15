import React, { useState, useEffect, useRef } from 'react';
import { useGym } from '../context/GymContext';
import {
  Search,
  Clock,
  Plus,
  Zap,
  Menu,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut,
} from 'lucide-react';
import { formatTimeWithSeconds } from '../utils/dateUtils';
import { Member } from '../types/gym';

interface HeaderProps {
  onOpenAddMember: () => void;
  onOpenQuickCheckIn: () => void;
  onSelectMember: (member: Member) => void;
  onToggleMobileSidebar: () => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddMember,
  onOpenQuickCheckIn,
  onSelectMember,
  onToggleMobileSidebar,
  isDesktopCollapsed = false,
  onToggleDesktopCollapse,
}) => {
  const { members, logVisit, managerProfile, userRole, activeMemberUser, logout } = useGym();

  // Live ticking clock
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Quick Search
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchResults = searchQuery.trim()
    ? members
        .filter(
          (m) =>
            m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.phone.includes(searchQuery)
        )
        .slice(0, 4)
    : [];

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-[#0F1115]/95 backdrop-blur-md border-b border-[#252B38]/50 px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-6">
      {/* Left: Sidebar Toggles (for Phones AND Laptops) + Brand Badge */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Mobile Hamburger Drawer Trigger (Phones & Tablets < lg) */}
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl bg-[#181C24] border border-[#252B38] text-slate-300 hover:text-white hover:border-[#D4FF00] transition-colors shrink-0 cursor-pointer"
          aria-label="Open Navigation Menu"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5 text-slate-200" />
        </button>

        {/* Laptop / Desktop Sidebar Toggle Button: "Go Inside" / Collapse & Expand */}
        {onToggleDesktopCollapse && (
          <button
            onClick={onToggleDesktopCollapse}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-[#181C24] border border-[#252B38] text-slate-300 hover:text-white hover:border-[#D4FF00]/40 transition-colors cursor-pointer text-xs font-semibold"
            aria-label={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar inside'}
            title={isDesktopCollapsed ? 'Expand sidebar' : 'Collapse sidebar (Go inside view)'}
          >
            {isDesktopCollapsed ? (
              <>
                <PanelLeftOpen className="w-4 h-4 text-[#D4FF00]" />
                <span className="text-slate-300">Expand</span>
              </>
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-400" />
                <span className="text-slate-400 hover:text-slate-200">Collapse</span>
              </>
            )}
          </button>
        )}

        {/* Brand name on mobile (clean text, no F yellow box) */}
        <div className="lg:hidden flex items-center">
          <span className="font-display font-extrabold text-base text-white tracking-tight">
            Fit<span className="text-[#D4FF00]">Alex</span>
          </span>
        </div>
      </div>

      {/* Middle: Member Pill or Search Input */}
      {userRole === 'member' ? (
        <div className="flex-1 max-w-xs sm:max-w-md hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#181C24] border border-[#252B38] rounded-xl text-xs">
          <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
          <span className="text-slate-400 font-medium truncate">Member Pass:</span>
          <span className="text-white font-bold truncate">{activeMemberUser?.name}</span>
          <span className="font-mono text-[#D4FF00] font-bold shrink-0">({activeMemberUser?.id})</span>
        </div>
      ) : (
        <div ref={searchContainerRef} className="relative flex-1 max-w-xs sm:max-w-md">
          <div className="relative flex items-center">
            <Search className="absolute left-3 sm:left-3.5 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search member..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-[#181C24] border border-[#252B38] focus:border-[#D4FF00] rounded-xl pl-8 sm:pl-10 pr-7 sm:pr-8 py-1.5 sm:py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 text-slate-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Popup */}
          {isSearchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-[#181C24] border border-[#252B38] rounded-xl shadow-2xl overflow-hidden z-50 p-1.5 max-h-80 overflow-y-auto">
              {searchResults.length > 0 ? (
                <div className="space-y-1">
                  {searchResults.map((member) => (
                    <div
                      key={member.id}
                      className="p-2 sm:p-2.5 hover:bg-[#212631] rounded-lg transition-colors flex items-center justify-between gap-2.5 group cursor-pointer"
                      onClick={() => {
                        onSelectMember(member);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#D4FF00] transition-colors truncate">
                            {member.name}
                          </span>
                          <span className="font-mono-tabular text-[10px] sm:text-xs text-slate-400 shrink-0">
                            {member.id}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{member.phone}</p>
                      </div>

                      {member.isCurrentlyInGym ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            logVisit(member.id, undefined, 'check-out');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-rose-950/70 hover:bg-rose-900/90 text-rose-300 border border-rose-500/40 font-bold text-xs rounded-lg transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                          title="Check Out from Gym"
                        >
                          <LogOut className="w-3 h-3" />
                          <span className="hidden sm:inline">Check Out</span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            logVisit(member.id, undefined, 'check-in');
                            setIsSearchOpen(false);
                            setSearchQuery('');
                          }}
                          className="px-2 sm:px-2.5 py-1 sm:py-1.5 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-xs rounded-lg transition-all flex items-center gap-1 shrink-0 active:scale-95 cursor-pointer"
                          title="Check In (Attendance)"
                        >
                          <Zap className="w-3 h-3 fill-[#0F1115]" />
                          <span className="hidden sm:inline">Check In</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-center text-xs text-slate-400">
                  No members found for "{searchQuery}"
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Right Controls: Clock & Fast Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Simple Clock (Visible on md+) */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-[#181C24] rounded-xl border border-[#252B38]/60">
          <Clock className="w-4 h-4 text-[#D4FF00]" />
          <span className="font-mono-tabular text-xs sm:text-sm font-semibold text-white tracking-wide">
            {formatTimeWithSeconds(currentTime)}
          </span>
        </div>

        {userRole === 'member' ? (
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-[#181C24] border border-[#252B38] flex items-center gap-2 text-xs">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeMemberUser?.isCurrentlyInGym ? 'bg-[#D4FF00] animate-pulse' : 'bg-slate-500'
                }`}
              />
              <span className="hidden sm:inline font-bold text-white">
                {activeMemberUser?.isCurrentlyInGym ? 'INSIDE ARENA' : 'OUTSIDE COMPLEX'}
              </span>
              <span className="sm:hidden font-bold text-white">
                {activeMemberUser?.isCurrentlyInGym ? 'IN' : 'OUT'}
              </span>
            </div>

            <button
              onClick={logout}
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#181C24] hover:bg-rose-950/40 border border-[#252B38] hover:border-rose-500/50 text-slate-300 hover:text-rose-400 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
              title="Sign Out of Member Pass"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </div>
        ) : (
          <>
            {/* Primary CTA: + New Member */}
            <button
              onClick={onOpenAddMember}
              className="px-2.5 sm:px-4 py-2 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold rounded-xl text-xs sm:text-sm transition-all shadow-[0_0_20px_rgba(212,255,0,0.2)] active:scale-95 flex items-center gap-1 sm:gap-1.5 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden xs:inline">New Member</span>
              <span className="xs:hidden">New</span>
            </button>

            {/* Manager Avatar Badge (Laptops/desktops) */}
            <div className="hidden xl:flex items-center gap-2.5 pl-3 border-l border-[#252B38]/60">
              <div className="w-8 h-8 rounded-full bg-[#181C24] border border-[#252B38] flex items-center justify-center font-bold text-xs text-[#D4FF00]">
                AM
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white leading-tight">{managerProfile.name}</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  {managerProfile.operationalState}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
};
