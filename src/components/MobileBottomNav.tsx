import React from 'react';
import {
  LayoutDashboard,
  Users,
  Dumbbell,
  CheckCircle,
  Menu,
  Zap,
  QrCode,
  Radio,
} from 'lucide-react';
import { NavigationTab } from './Sidebar';
import { useGym } from '../context/GymContext';

interface MobileBottomNavProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentTab,
  onTabChange,
  onOpenMobileMenu,
}) => {
  const { userRole } = useGym();

  const managerTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'dashboard',
      label: 'Overview',
      icon: <LayoutDashboard className="w-5 h-5" />,
    },
    {
      id: 'members',
      label: 'Members',
      icon: <Users className="w-5 h-5" />,
    },
    {
      id: 'trainers',
      label: 'Trainers',
      icon: <Dumbbell className="w-5 h-5" />,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: <CheckCircle className="w-5 h-5" />,
    },
  ];

  const memberTabs: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'member-pass',
      label: 'My Pass',
      icon: <QrCode className="w-5 h-5" />,
    },
    {
      id: 'member-hud',
      label: 'Gym Radar',
      icon: <Radio className="w-5 h-5" />,
    },
    {
      id: 'member-coaches',
      label: 'Coaches',
      icon: <Dumbbell className="w-5 h-5" />,
    },
  ];

  const tabs = userRole === 'member' ? memberTabs : managerTabs;

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#12151C]/95 backdrop-blur-md border-t border-[#252B38] px-2 py-1.5 flex items-center justify-around shadow-2xl select-none"
      aria-label="Mobile Navigation"
    >
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
              isActive
                ? 'text-[#D4FF00]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#D4FF00]/10' : ''}`}>
              {tab.icon}
            </div>
            <span className={`text-[10px] tracking-tight mt-0.5 ${isActive ? 'font-bold text-[#D4FF00]' : 'font-medium'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}

      {/* Menu button for More options (Facility & Staff, Plans, Logout) */}
      <button
        onClick={onOpenMobileMenu}
        className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-150 active:scale-95 ${
          currentTab === 'facility' || currentTab === 'memberships'
            ? 'text-[#D4FF00]'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <div className={`p-1 rounded-lg ${currentTab === 'facility' || currentTab === 'memberships' ? 'bg-[#D4FF00]/10' : ''}`}>
          <Menu className="w-5 h-5" />
        </div>
        <span className={`text-[10px] tracking-tight mt-0.5 ${currentTab === 'facility' || currentTab === 'memberships' ? 'font-bold text-[#D4FF00]' : 'font-medium'}`}>
          More
        </span>
      </button>
    </nav>
  );
};
