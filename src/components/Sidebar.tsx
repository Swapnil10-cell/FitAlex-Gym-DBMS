import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Dumbbell,
  CheckCircle,
  RotateCcw,
  Building,
  LogOut,
  X,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Menu,
  QrCode,
  Radio,
  Sparkles,
} from 'lucide-react';
import { useGym } from '../context/GymContext';

export type NavigationTab =
  | 'dashboard'
  | 'members'
  | 'memberships'
  | 'trainers'
  | 'attendance'
  | 'facility'
  | 'member-pass'
  | 'member-hud'
  | 'member-coaches';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isDesktopCollapsed?: boolean;
  onToggleDesktopCollapse?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  isOpenMobile = false,
  onCloseMobile,
  isDesktopCollapsed = false,
  onToggleDesktopCollapse,
}) => {
  const { stats, resetAllData, logout, userRole, activeMemberUser } = useGym();
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);

  // Tab definitions: strictly filtered based on RBAC userRole
  const managerNavItems = [
    {
      id: 'dashboard' as NavigationTab,
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      count: stats.urgentExpirations > 0 ? stats.urgentExpirations : undefined,
      highlight: stats.urgentExpirations > 0,
      description: 'KPIs & live floor stream',
    },
    {
      id: 'members' as NavigationTab,
      label: 'Members',
      icon: <Users className="w-5 h-5 shrink-0" />,
      count: stats.totalMembers,
      description: 'Directory & subscriptions',
    },
    {
      id: 'trainers' as NavigationTab,
      label: 'Trainers',
      icon: <Dumbbell className="w-5 h-5 shrink-0" />,
      count: stats.trainersOnDuty,
      description: 'Floor coaches & client rosters',
    },
    {
      id: 'memberships' as NavigationTab,
      label: 'Plans & Pricing',
      icon: <CreditCard className="w-5 h-5 shrink-0" />,
      description: 'Tiers & membership packages',
    },
    {
      id: 'attendance' as NavigationTab,
      label: 'Daily Attendance',
      icon: <CheckCircle className="w-5 h-5 shrink-0" />,
      count: stats.todayVisits,
      description: 'Mark attendance & logs',
    },
    {
      id: 'facility' as NavigationTab,
      label: 'Facility & Staff',
      icon: <Building className="w-5 h-5 shrink-0" />,
      description: 'Manager & operational personnel',
    },
  ];

  const memberNavItems = [
    {
      id: 'member-pass' as NavigationTab,
      label: 'My Membership Pass',
      icon: <QrCode className="w-5 h-5 shrink-0" />,
      highlight: true,
      description: 'Biometric QR & pass specs',
    },
    {
      id: 'member-hud' as NavigationTab,
      label: 'Interactive Gym HUD Radar',
      icon: <Radio className="w-5 h-5 shrink-0" />,
      description: 'Sector Alpha/Beta/Gamma radar',
    },
    {
      id: 'member-coaches' as NavigationTab,
      label: 'Coaching Roster',
      icon: <Dumbbell className="w-5 h-5 shrink-0" />,
      count: stats.trainersOnDuty,
      description: 'Trainer directory & booking',
    },
  ];

  const navItems = userRole === 'member' ? memberNavItems : managerNavItems;

  const handleSelectTab = (tab: NavigationTab) => {
    onTabChange(tab);
    if (onCloseMobile) {
      onCloseMobile();
    }
  };

  /* ---------------------------------------------------- */
  /* 1. EXPANDED DESKTOP / MOBILE CONTENT (Full width)   */
  /* ---------------------------------------------------- */
  const fullContent = (
    <div className="h-full flex flex-col justify-between overflow-y-auto">
      {/* Brand Header */}
      <div>
        <div className="h-20 px-5 flex items-center justify-between border-b border-[#252B38]/60">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white truncate">
                Fit<span className="text-[#D4FF00]">Alex</span>
              </span>
            </div>
            <span className="text-xs text-slate-400 font-medium truncate block">
              {userRole === 'member' ? 'Member Pass Hub' : 'Gym DBMS'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Desktop Collapse Button: "Go Inside" / Collapse */}
            {onToggleDesktopCollapse && (
              <button
                onClick={onToggleDesktopCollapse}
                className="hidden lg:flex p-2 rounded-xl bg-[#181C24] text-slate-400 hover:text-white hover:border-[#D4FF00]/40 border border-[#252B38] transition-colors"
                title="Collapse sidebar to go inside view (Compact mode)"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300" />
              </button>
            )}

            {/* Mobile Close Button */}
            {onCloseMobile && (
              <button
                onClick={onCloseMobile}
                className="lg:hidden p-2 rounded-xl bg-[#181C24] text-slate-400 hover:text-white border border-[#252B38] transition-colors"
                title="Close menu & go back inside app"
                aria-label="Close Navigation"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="px-3 py-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-[#181C24] text-white shadow-sm border border-[#252B38]'
                    : 'text-slate-400 hover:text-white hover:bg-[#181C24]/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={isActive ? 'text-[#D4FF00]' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <div className="text-left min-w-0">
                    <span className="truncate block">{item.label}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {item.count !== undefined && (
                    <span
                      className={`font-mono-tabular text-xs px-2.5 py-0.5 rounded-full font-bold ${
                        isActive
                          ? item.highlight
                            ? 'bg-amber-400 text-[#0F1115]'
                            : 'bg-[#D4FF00] text-[#0F1115]'
                          : item.highlight
                          ? 'bg-amber-500/20 text-amber-300'
                          : 'bg-[#252B38] text-slate-300'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                  {/* Subtle arrow indicator showing option to go inside this module */}
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isActive ? 'text-[#D4FF00] translate-x-0.5' : 'text-slate-600'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Session Controls */}
      <div className="p-4 border-t border-[#252B38]/50 space-y-2">
        {userRole === 'member' ? (
          <div className="px-3 py-2.5 rounded-xl bg-[#181C24] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeMemberUser?.isCurrentlyInGym
                    ? 'bg-[#D4FF00] animate-pulse'
                    : 'bg-slate-500'
                }`}
              />
              <span className="text-slate-300 font-medium">
                {activeMemberUser?.isCurrentlyInGym ? 'Inside Arena' : 'Outside Complex'}
              </span>
            </div>
            <span className="font-mono text-[#D4FF00] font-bold">
              {activeMemberUser?.id}
            </span>
          </div>
        ) : (
          <div className="px-3 py-2.5 rounded-xl bg-[#181C24] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
              <span className="text-slate-300 font-medium">Gym Open</span>
            </div>
            <span className="font-mono-tabular text-slate-400 font-medium">
              {stats.trainersOnDuty} Coaches On Duty
            </span>
          </div>
        )}

        {/* Desktop Collapse Shortcut button */}
        {onToggleDesktopCollapse && (
          <button
            onClick={onToggleDesktopCollapse}
            className="hidden lg:flex w-full items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-slate-400 hover:text-slate-200 bg-[#181C24]/60 hover:bg-[#181C24] rounded-xl border border-[#252B38]/40 transition-colors cursor-pointer"
            title="Collapse sidebar inside"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Collapse Sidebar</span>
          </button>
        )}

        {userRole !== 'member' && (
          <>
            {isConfirmingReset ? (
              <div className="p-2 bg-rose-950/40 border border-rose-500/30 rounded-xl space-y-1.5 text-center">
                <p className="text-[11px] text-rose-300 font-medium">Reset sample records?</p>
                <div className="flex items-center justify-center gap-1.5">
                  <button
                    onClick={() => {
                      resetAllData();
                      setIsConfirmingReset(false);
                    }}
                    className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] rounded-lg transition-colors cursor-pointer"
                  >
                    Yes, Reset
                  </button>
                  <button
                    onClick={() => setIsConfirmingReset(false)}
                    className="px-2.5 py-1 bg-[#181C24] hover:bg-[#252B38] text-slate-300 text-[10px] rounded-lg border border-[#252B38] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsConfirmingReset(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Sample Data</span>
              </button>
            )}
          </>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 rounded-xl transition-colors cursor-pointer"
          title="Return to Gatekeeper Login Screen"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Lock Session (Sign Out)</span>
        </button>
      </div>
    </div>
  );

  /* ---------------------------------------------------- */
  /* 2. COLLAPSED DESKTOP RAIL (w-20 compact icon mode)   */
  /* ---------------------------------------------------- */
  const collapsedDesktopContent = (
    <div className="h-full flex flex-col justify-between items-center py-4 select-none">
      {/* Top: Expand Button */}
      <div className="flex flex-col items-center gap-3 w-full pt-1">
        {/* Expand Sidebar Button */}
        {onToggleDesktopCollapse && (
          <button
            onClick={onToggleDesktopCollapse}
            className="p-2.5 rounded-xl bg-[#181C24] border border-[#252B38] text-slate-400 hover:text-[#D4FF00] hover:border-[#D4FF00]/40 transition-all cursor-pointer"
            title="Expand sidebar navigation"
            aria-label="Expand sidebar navigation"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Nav item icons with tooltip titles */}
        <div className="flex flex-col items-center gap-2 mt-3 w-full px-2">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all cursor-pointer group ${
                  isActive
                    ? 'bg-[#181C24] text-[#D4FF00] border border-[#252B38] shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-[#181C24]/60'
                }`}
                title={item.label}
              >
                {item.icon}

                {/* Badge indicator */}
                {item.count !== undefined && (
                  <span
                    className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ${
                      item.highlight
                        ? 'bg-amber-400 text-black'
                        : 'bg-[#D4FF00] text-black'
                    }`}
                  >
                    {item.count > 9 ? '9+' : item.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Actions for Collapsed Mode */}
      <div className="flex flex-col items-center gap-2 w-full px-2">
        {userRole !== 'member' && (
          <button
            onClick={() => {
              if (window.confirm('Reset data back to clean sample state?')) {
                resetAllData();
              }
            }}
            className="w-10 h-10 rounded-xl bg-[#181C24] border border-[#252B38]/60 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Sample Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={logout}
          className="w-10 h-10 rounded-xl bg-[#181C24] border border-[#252B38]/60 flex items-center justify-center text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors cursor-pointer"
          title="Lock Session (Sign Out)"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* 1. Desktop Sticky Sidebar (Visible on laptops & desktops >= lg) */}
      <aside
        className={`hidden lg:flex h-screen sticky top-0 bg-[#0F1115] border-r border-[#252B38]/60 select-none z-30 shrink-0 transition-all duration-200 ${
          isDesktopCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {isDesktopCollapsed ? collapsedDesktopContent : fullContent}
      </aside>

      {/* 2. Mobile Responsive Off-Canvas Drawer (Phones & Tablets < lg) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Dark Backdrop Overlay */}
          <div
            onClick={onCloseMobile}
            className="fixed inset-0 bg-black/80 backdrop-blur-xs transition-opacity animate-in fade-in duration-200 cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed top-0 bottom-0 left-0 w-80 max-w-[85vw] bg-[#0F1115] border-r border-[#252B38] shadow-2xl z-50 select-none animate-in slide-in-from-left duration-200">
            {fullContent}
          </div>
        </div>
      )}
    </>
  );
};
