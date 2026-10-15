import React, { useState } from 'react';
import { GymProvider, useGym } from './context/GymContext';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { MembersView } from './components/MembersView';
import { MembershipsView } from './components/MembershipsView';
import { TrainersView } from './components/TrainersView';
import { AttendanceView } from './components/AttendanceView';
import { FacilityStaffView } from './components/FacilityStaffView';
import { MemberPassView } from './components/MemberPassView';
import { MemberRadarView } from './components/MemberRadarView';
import { MemberCoachingRosterView } from './components/MemberCoachingRosterView';
import { LoginScreen } from './components/LoginScreen';
import { MobileBottomNav } from './components/MobileBottomNav';
import { MemberModal } from './components/Modals/MemberModal';
import { RenewModal } from './components/Modals/RenewModal';
import { SwitchTierModal } from './components/Modals/SwitchTierModal';
import { QuickCheckInModal } from './components/Modals/QuickCheckInModal';
import { TrainerModal } from './components/Modals/TrainerModal';
import { MemberDetailModal } from './components/Modals/MemberDetailModal';
import { ToastContainer } from './components/Toast';
import { Member, Trainer } from './types/gym';

function FitAlexApp() {
  const { isAuthenticated, userRole } = useGym();
  const [currentTab, setCurrentTab] = useState<NavigationTab>(() => {
    return userRole === 'member' ? 'member-pass' : 'dashboard';
  });

  // Ensure active tab aligns with current RBAC user role
  React.useEffect(() => {
    if (userRole === 'member') {
      if (currentTab !== 'member-pass' && currentTab !== 'member-hud' && currentTab !== 'member-coaches') {
        setCurrentTab('member-pass');
      }
    } else if (userRole === 'manager') {
      if (currentTab === 'member-pass' || currentTab === 'member-hud' || currentTab === 'member-coaches') {
        setCurrentTab('dashboard');
      }
    }
  }, [userRole, currentTab]);

  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(() => {
    return localStorage.getItem('fitalex_sidebar_collapsed') === 'true';
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleDesktopCollapse = () => {
    setIsDesktopCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('fitalex_sidebar_collapsed', String(next));
      return next;
    });
  };

  // Modals state
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<Member | null>(null);

  const [renewMemberTarget, setRenewMemberTarget] = useState<Member | null>(null);
  const [switchTierMemberTarget, setSwitchTierMemberTarget] = useState<Member | null>(null);
  const [selectedMemberDetail, setSelectedMemberDetail] = useState<Member | null>(null);

  const [isQuickCheckInOpen, setIsQuickCheckInOpen] = useState(false);
  const [isTrainerModalOpen, setIsTrainerModalOpen] = useState(false);
  const [trainerToEdit, setTrainerToEdit] = useState<Trainer | null>(null);

  // Gatekeeper: if not authenticated, block internal dashboard and show LoginScreen
  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        <ToastContainer />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-[#E2E8F0] flex flex-col lg:flex-row">
      {/* Sticky Left Sidebar for Desktop + Responsive Drawer for Mobile */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        isOpenMobile={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isDesktopCollapsed={isDesktopCollapsed}
        onToggleDesktopCollapse={toggleDesktopCollapse}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Global Header */}
        <Header
          onOpenAddMember={() => {
            setMemberToEdit(null);
            setIsAddMemberOpen(true);
          }}
          onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
          onSelectMember={(member) => setSelectedMemberDetail(member)}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
          isDesktopCollapsed={isDesktopCollapsed}
          onToggleDesktopCollapse={toggleDesktopCollapse}
        />

        {/* Central Dynamic Content Dashboard */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {/* CONSUMER MEMBER VIEWS */}
          {userRole === 'member' ? (
            <>
              {currentTab === 'member-pass' && <MemberPassView />}
              {currentTab === 'member-hud' && <MemberRadarView />}
              {currentTab === 'member-coaches' && <MemberCoachingRosterView />}
            </>
          ) : (
            /* MANAGER DATABASE CONSOLE VIEWS */
            <>
              {currentTab === 'dashboard' && (
                <DashboardView
                  onNavigateToMembers={() => setCurrentTab('members')}
                  onNavigateToAttendance={() => setCurrentTab('attendance')}
                  onNavigateToTrainers={() => setCurrentTab('trainers')}
                  onOpenQuickCheckIn={() => setIsQuickCheckInOpen(true)}
                  onRenewMember={(member) => setRenewMemberTarget(member)}
                  onSelectMember={(member) => setSelectedMemberDetail(member)}
                />
              )}

              {currentTab === 'members' && (
                <MembersView
                  onOpenAddMember={() => {
                    setMemberToEdit(null);
                    setIsAddMemberOpen(true);
                  }}
                  onEditMember={(member) => {
                    setMemberToEdit(member);
                    setIsAddMemberOpen(true);
                  }}
                  onRenewMember={(member) => setRenewMemberTarget(member)}
                  onSwitchTier={(member) => setSwitchTierMemberTarget(member)}
                />
              )}

              {currentTab === 'memberships' && (
                <MembershipsView
                  onSwitchTierForMember={(member) => setSwitchTierMemberTarget(member)}
                  onNavigateToMembers={() => setCurrentTab('members')}
                />
              )}

              {currentTab === 'trainers' && (
                <TrainersView
                  onOpenAddTrainer={() => {
                    setTrainerToEdit(null);
                    setIsTrainerModalOpen(true);
                  }}
                  onEditTrainer={(trainer) => {
                    setTrainerToEdit(trainer);
                    setIsTrainerModalOpen(true);
                  }}
                  onSelectMember={(member) => setSelectedMemberDetail(member)}
                />
              )}

              {currentTab === 'attendance' && (
                <AttendanceView
                  onSelectMember={(member) => setSelectedMemberDetail(member)}
                />
              )}

              {currentTab === 'facility' && (
                <FacilityStaffView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Management Modals & Overlays (Protected from regular members) */}
      {userRole !== 'member' && (
        <>
          <MemberModal
            isOpen={isAddMemberOpen}
            onClose={() => {
              setIsAddMemberOpen(false);
              setMemberToEdit(null);
            }}
            memberToEdit={memberToEdit}
          />

          <RenewModal
            isOpen={!!renewMemberTarget}
            onClose={() => setRenewMemberTarget(null)}
            member={renewMemberTarget}
          />

          <SwitchTierModal
            isOpen={!!switchTierMemberTarget}
            onClose={() => setSwitchTierMemberTarget(null)}
            member={switchTierMemberTarget}
          />

          <QuickCheckInModal
            isOpen={isQuickCheckInOpen}
            onClose={() => setIsQuickCheckInOpen(false)}
          />

          <TrainerModal
            isOpen={isTrainerModalOpen}
            onClose={() => {
              setIsTrainerModalOpen(false);
              setTrainerToEdit(null);
            }}
            trainerToEdit={trainerToEdit}
          />

          <MemberDetailModal
            member={selectedMemberDetail}
            onClose={() => setSelectedMemberDetail(null)}
            onEdit={(member) => {
              setMemberToEdit(member);
              setIsAddMemberOpen(true);
            }}
            onRenew={(member) => setRenewMemberTarget(member)}
            onSwitchTier={(member) => setSwitchTierMemberTarget(member)}
          />
        </>
      )}

      {/* Mobile Bottom Navigation Bar (Phone thumb access) */}
      <MobileBottomNav
        currentTab={currentTab}
        onTabChange={(tab) => {
          setCurrentTab(tab);
          setIsMobileSidebarOpen(false);
        }}
        onOpenMobileMenu={() => setIsMobileSidebarOpen(true)}
      />

      {/* Floating Cyber Toast Container */}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <GymProvider>
      <FitAlexApp />
    </GymProvider>
  );
}
