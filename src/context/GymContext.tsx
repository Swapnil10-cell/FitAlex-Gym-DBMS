import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  Member,
  Trainer,
  MembershipTier,
  AttendanceLog,
  ActivityFeedItem,
  GymStats,
  StaffMember,
  ManagerProfile,
  GymCorporateProfile,
  ManagerAccount,
  UserRole,
} from '../types/gym';
import {
  initialMembers,
  initialTrainers,
  initialTiers,
  initialAttendanceLogs,
  initialActivityFeed,
  initialManagerProfile,
  initialGymCorporateProfile,
  initialStaffMembers,
} from '../data/mockData';
import {
  isUrgentExpiration,
  extendExpirationDate,
  addDaysToCurrentDate,
  formatFullTimestamp,
} from '../utils/dateUtils';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  description?: string;
  timestamp: string;
}

interface GymContextType {
  members: Member[];
  trainers: Trainer[];
  tiers: MembershipTier[];
  attendanceLogs: AttendanceLog[];
  activityFeed: ActivityFeedItem[];
  stats: GymStats;
  managerProfile: ManagerProfile;
  gymProfile: GymCorporateProfile;
  staffMembers: StaffMember[];
  managersList: ManagerAccount[];
  toasts: ToastMessage[];
  isAuthenticated: boolean;
  userRole: UserRole | null;
  activeMemberUser: Member | null;
  login: (username: string, pass: string) => boolean;
  signup: (username: string, name: string, email: string, phone: string, pass: string) => boolean;
  logout: () => void;
  dismissToast: (id: string) => void;
  showToast: (type: ToastMessage['type'], title: string, description?: string) => void;
  
  // Member CRUD
  addMember: (data: Omit<Member, 'id' | 'joinedAt' | 'planExpiresAt' | 'lastVisitAt' | 'isCurrentlyInGym'> & { customDurationDays?: number }) => Member;
  updateMember: (id: string, updates: Partial<Member>) => void;
  deleteMember: (id: string) => void;
  
  // Direct Quick Actions (Zero-Training 1-2 click philosophy)
  logVisit: (memberId: string, zone?: AttendanceLog['zone'], type?: 'check-in' | 'check-out') => boolean;
  renewPlan: (memberId: string, days?: number) => void;
  switchTier: (memberId: string, newTierId: string) => void;
  toggleMemberStatus: (memberId: string) => void;
  
  // Trainer Operations
  toggleTrainerDuty: (trainerId: string) => void;
  addTrainer: (data: Omit<Trainer, 'id'>) => Trainer;
  updateTrainer: (id: string, updates: Partial<Trainer>) => void;
  
  // Tier Operations
  addTier: (data: Omit<MembershipTier, 'id'>) => MembershipTier;
  updateTier: (id: string, updates: Partial<MembershipTier>) => void;

  // Manager & Staff Operations
  updateManagerProfile: (updates: Partial<ManagerProfile>) => void;
  updateGymProfile: (updates: Partial<GymCorporateProfile>) => void;
  toggleStaffDuty: (staffId: string) => void;
  updateStaffMember: (staffId: string, updates: Partial<StaffMember>) => void;
  addStaffMember: (data: Omit<StaffMember, 'id'>) => StaffMember;
  
  // Helper Lookups
  getTrainerById: (trainerId: string | null) => Trainer | undefined;
  getTierById: (tierId: string) => MembershipTier | undefined;
  getTrainerClientCount: (trainerId: string) => number;
  getTierMemberCount: (tierId: string) => number;
  resetAllData: () => void;
}

const GymContext = createContext<GymContextType | null>(null);

const STORAGE_KEYS = {
  MEMBERS: 'fitalex_members_v4',
  TRAINERS: 'fitalex_trainers_v4',
  TIERS: 'fitalex_tiers_v4',
  LOGS: 'fitalex_attendance_logs_v4',
  FEED: 'fitalex_activity_feed_v4',
  MANAGER: 'fitalex_manager_v4',
  GYM_PROFILE: 'fitalex_gym_profile_v4',
  STAFF: 'fitalex_staff_v4',
  MANAGERS: 'fitalex_managers_v4',
};

const initialDefaultManager: ManagerAccount = {
  username: 'manager',
  name: 'Vikram Malhotra',
  email: 'manager@fitalex.internal',
  phone: '9820194820',
  password: 'admin',
};

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or fallback to mockData
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MEMBERS);
    if (!saved) return initialMembers;
    try {
      const parsed: Member[] = JSON.parse(saved);
      return parsed.map((m, idx) => ({
        ...m,
        age: typeof m.age === 'number' && m.age >= 15 && m.age < 100 ? m.age : (initialMembers[idx]?.age || 25),
        gender: m.gender && ['Male', 'Female', 'Other'].includes(m.gender) ? m.gender : (initialMembers[idx]?.gender || 'Male'),
        isCurrentlyInGym: typeof m.isCurrentlyInGym === 'boolean' ? m.isCurrentlyInGym : (initialMembers[idx]?.isCurrentlyInGym ?? false),
      }));
    } catch {
      return initialMembers;
    }
  });

  const [trainers, setTrainers] = useState<Trainer[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRAINERS);
    if (!saved) return initialTrainers;
    try {
      const parsed: Trainer[] = JSON.parse(saved);
      return parsed.map((t, idx) => ({
        ...t,
        age: typeof t.age === 'number' && t.age >= 15 && t.age < 100 ? t.age : (initialTrainers[idx]?.age || 30),
        gender: t.gender && ['Male', 'Female', 'Other'].includes(t.gender) ? t.gender : (initialTrainers[idx]?.gender || 'Male'),
      }));
    } catch {
      return initialTrainers;
    }
  });

  const [tiers, setTiers] = useState<MembershipTier[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TIERS);
    return saved ? JSON.parse(saved) : initialTiers;
  });

  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LOGS);
    return saved ? JSON.parse(saved) : initialAttendanceLogs;
  });

  const [activityFeed, setActivityFeed] = useState<ActivityFeedItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FEED);
    return saved ? JSON.parse(saved) : initialActivityFeed;
  });

  const [managerProfile, setManagerProfile] = useState<ManagerProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MANAGER);
    return saved ? JSON.parse(saved) : initialManagerProfile;
  });

  const [gymProfile, setGymProfile] = useState<GymCorporateProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.GYM_PROFILE);
    return saved ? JSON.parse(saved) : initialGymCorporateProfile;
  });

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF);
    return saved ? JSON.parse(saved) : initialStaffMembers;
  });

  const [managersList, setManagersList] = useState<ManagerAccount[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MANAGERS);
    if (!saved) return [initialDefaultManager];
    try {
      const parsed: ManagerAccount[] = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [initialDefaultManager];
    } catch {
      return [initialDefaultManager];
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('fitalex_is_auth') === 'true';
  });
  const [userRole, setUserRole] = useState<UserRole | null>(() => {
    const saved = localStorage.getItem('fitalex_auth_role');
    return (saved === 'manager' || saved === 'member') ? (saved as UserRole) : null;
  });
  const [activeMemberId, setActiveMemberId] = useState<string | null>(() => {
    return localStorage.getItem('fitalex_auth_member_id');
  });

  // Dynamically resolve active member record from members array
  const activeMemberUser = useMemo(() => {
    if (!activeMemberId) return null;
    return members.find((m) => m.id === activeMemberId) || null;
  }, [members, activeMemberId]);

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync auth state to localStorage
  useEffect(() => {
    localStorage.setItem('fitalex_is_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    if (userRole) {
      localStorage.setItem('fitalex_auth_role', userRole);
    } else {
      localStorage.removeItem('fitalex_auth_role');
    }
  }, [userRole]);

  useEffect(() => {
    if (activeMemberId) {
      localStorage.setItem('fitalex_auth_member_id', activeMemberId);
    } else {
      localStorage.removeItem('fitalex_auth_member_id');
    }
  }, [activeMemberId]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAINERS, JSON.stringify(trainers));
  }, [trainers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TIERS, JSON.stringify(tiers));
  }, [tiers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(attendanceLogs));
  }, [attendanceLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FEED, JSON.stringify(activityFeed));
  }, [activityFeed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANAGER, JSON.stringify(managerProfile));
  }, [managerProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GYM_PROFILE, JSON.stringify(gymProfile));
  }, [gymProfile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF, JSON.stringify(staffMembers));
  }, [staffMembers]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MANAGERS, JSON.stringify(managersList));
  }, [managersList]);

  // Toast System
  const showToast = useCallback((type: ToastMessage['type'], title: string, description?: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = {
      id,
      type,
      title,
      description,
      timestamp: new Date().toISOString(),
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto-dismiss after 4.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Helper Lookups
  const getTrainerById = useCallback((trainerId: string | null): Trainer | undefined => {
    if (!trainerId) return undefined;
    return trainers.find((t) => t.id === trainerId);
  }, [trainers]);

  const getTierById = useCallback((tierId: string): MembershipTier | undefined => {
    return tiers.find((t) => t.id === tierId);
  }, [tiers]);

  const getTrainerClientCount = useCallback((trainerId: string): number => {
    return members.filter((m) => m.trainerId === trainerId).length;
  }, [members]);

  const getTierMemberCount = useCallback((tierId: string): number => {
    return members.filter((m) => m.tierId === tierId).length;
  }, [members]);

  // Compute real-time KPIs dynamically
  const stats = useMemo<GymStats>(() => {
    const active = members.filter((m) => m.status === 'active');
    
    // Calculate total monthly revenue based on active member plans
    const revenue = active.reduce((acc, m) => {
      const tier = tiers.find((t) => t.id === m.tierId);
      return acc + (tier ? tier.monthlyPrice : 0);
    }, 0);

    const onDutyCount = trainers.filter((t) => t.isOnDuty).length;
    
    // Urgent expirations: active plans expiring in <= 7 days
    const urgentCount = active.filter((m) => isUrgentExpiration(m.planExpiresAt)).length;

    // Today's visits
    const today = new Date().toDateString();
    const todayVisits = attendanceLogs.filter(
      (log) => new Date(log.timestamp).toDateString() === today
    ).length;

    return {
      activeMembers: active.length,
      totalMembers: members.length,
      monthlyRevenue: revenue,
      trainersOnDuty: onDutyCount,
      totalTrainers: trainers.length,
      urgentExpirations: urgentCount,
      todayVisits: todayVisits || attendanceLogs.length,
    };
  }, [members, tiers, trainers, attendanceLogs]);

  // Member CRUD Operations
  const addMember = useCallback((data: Omit<Member, 'id' | 'joinedAt' | 'planExpiresAt' | 'lastVisitAt' | 'isCurrentlyInGym'> & { customDurationDays?: number }) => {
    const nowISO = new Date().toISOString();
    const tier = tiers.find((t) => t.id === data.tierId);
    const duration = data.customDurationDays || tier?.durationDays || 30;
    const expiresISO = addDaysToCurrentDate(duration);

    // Compute next unique ID
    const existingNums = members
      .map((m) => parseInt(m.id.replace('MEM-', ''), 10))
      .filter((n) => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1001;
    const memberId = `MEM-${nextNum}`;

    const newMember: Member = {
      ...data,
      id: memberId,
      joinedAt: nowISO,
      planExpiresAt: expiresISO,
      lastVisitAt: null,
      isCurrentlyInGym: false,
    };

    setMembers((prev) => [newMember, ...prev]);

    // Relational automated Activity Feed item
    const feedItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      type: 'member_registered',
      title: 'New Member Registered',
      description: `${newMember.name} joined on ${tier?.name || 'Standard'} plan`,
      timestamp: nowISO,
      meta: { memberId: newMember.id, tierId: newMember.tierId },
    };
    setActivityFeed((prev) => [feedItem, ...prev]);

    showToast('success', 'Member Registered', `${newMember.name} (${memberId}) registered on ${tier?.name}`);
    return newMember;
  }, [members, tiers, showToast]);

  const updateMember = useCallback((id: string, updates: Partial<Member>) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
    showToast('info', 'Member Updated', `Profile records for ${id} have been updated.`);
  }, [showToast]);

  const deleteMember = useCallback((id: string) => {
    const target = members.find((m) => m.id === id);
    if (!target) return;

    setMembers((prev) => prev.filter((m) => m.id !== id));
    
    // Log removal in activity feed
    const nowISO = new Date().toISOString();
    setActivityFeed((prev) => [
      {
        id: `ACT-${Date.now()}`,
        type: 'status_changed',
        title: 'Member Removed',
        description: `Member ${target.name} (${target.id}) was archived from the registry`,
        timestamp: nowISO,
      },
      ...prev,
    ]);

    showToast('warning', 'Member Removed', `${target.name} has been deleted.`);
  }, [members, showToast]);

  // 1-Click "Log Visit" Check-In / Check-Out
  const logVisit = useCallback(
    (memberId: string, customZone?: AttendanceLog['zone'], type?: 'check-in' | 'check-out'): boolean => {
      const member = members.find((m) => m.id === memberId);
      if (!member) {
        showToast('error', 'Action Failed', `Member ${memberId} not found.`);
        return false;
      }

      const nowISO = new Date().toISOString();
      const tier = tiers.find((t) => t.id === member.tierId);
      const zone: AttendanceLog['zone'] = customZone || 'Main Gym Floor';

      // If type not specified, toggle between check-in and check-out based on current state
      const resolvedType: 'check-in' | 'check-out' =
        type ?? (member.isCurrentlyInGym ? 'check-out' : 'check-in');
      const isCheckingOut = resolvedType === 'check-out';

      // Update member's isCurrentlyInGym and lastVisitAt
      setMembers((prev) =>
        prev.map((m) =>
          m.id === memberId
            ? {
                ...m,
                isCurrentlyInGym: !isCheckingOut,
                lastVisitAt: isCheckingOut ? m.lastVisitAt : nowISO,
              }
            : m
        )
      );

      // Create attendance log
      const logItem: AttendanceLog = {
        id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
        memberId: member.id,
        memberName: member.name,
        tierName: tier?.name || 'Standard Fit',
        timestamp: nowISO,
        zone,
        type: resolvedType,
      };
      setAttendanceLogs((prev) => [logItem, ...prev]);

      // Create Activity feed item
      if (isCheckingOut) {
        const feedItem: ActivityFeedItem = {
          id: `ACT-${Date.now()}`,
          type: 'check_out',
          title: `Departure Logged: ${member.name}`,
          description: `Checked out from ${zone}. Session completed.`,
          timestamp: nowISO,
          meta: { memberId: member.id },
        };
        setActivityFeed((prev) => [feedItem, ...prev]);
        showToast('info', 'Departure Logged', `${member.name} checked out from ${zone}.`);
      } else {
        const feedItem: ActivityFeedItem = {
          id: `ACT-${Date.now()}`,
          type: 'check_in',
          title: `Visit Logged: ${member.name}`,
          description: `Scanned entry at ${zone} (${tier?.name || 'Standard'})`,
          timestamp: nowISO,
          meta: { memberId: member.id },
        };
        setActivityFeed((prev) => [feedItem, ...prev]);

        if (member.status === 'expired') {
          showToast('warning', 'Check-In Logged (Plan Expired)', `${member.name} checked in, but their plan has expired.`);
        } else {
          showToast('success', 'Visit Logged', `${member.name} checked in at ${zone}.`);
        }
      }

      return true;
    },
    [members, tiers, showToast]
  );

  // Fast Renew Plan Action
  const renewPlan = useCallback((memberId: string, days: number = 30) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const nowISO = new Date().toISOString();
    const newExpiresISO = extendExpirationDate(member.planExpiresAt, days);
    const tier = tiers.find((t) => t.id === member.tierId);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, status: 'active', planExpiresAt: newExpiresISO }
          : m
      )
    );

    const feedItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      type: 'plan_renewed',
      title: 'Plan Renewed',
      description: `${member.name} extended ${tier?.name || 'membership'} for +${days} days`,
      timestamp: nowISO,
      meta: { memberId },
    };
    setActivityFeed((prev) => [feedItem, ...prev]);

    showToast('success', 'Membership Renewed', `${member.name}'s plan was extended by ${days} days.`);
  }, [members, tiers, showToast]);

  // Switch Member Tier
  const switchTier = useCallback((memberId: string, newTierId: string) => {
    const member = members.find((m) => m.id === memberId);
    const newTier = tiers.find((t) => t.id === newTierId);
    if (!member || !newTier) return;

    const nowISO = new Date().toISOString();
    // Reset expiration to new duration from now
    const newExpiresISO = addDaysToCurrentDate(newTier.durationDays);

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? { ...m, tierId: newTierId, planExpiresAt: newExpiresISO, status: 'active' }
          : m
      )
    );

    const feedItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      type: 'tier_switched',
      title: 'Tier Changed',
      description: `${member.name} switched to ${newTier.name} ($${newTier.monthlyPrice}/mo)`,
      timestamp: nowISO,
      meta: { memberId, tierId: newTierId },
    };
    setActivityFeed((prev) => [feedItem, ...prev]);

    showToast('success', 'Tier Updated', `${member.name} is now on ${newTier.name}.`);
  }, [members, tiers, showToast]);

  // Quick toggle status (active <-> paused)
  const toggleMemberStatus = useCallback((memberId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;

    const nextStatus = member.status === 'active' ? 'paused' : 'active';
    const nowISO = new Date().toISOString();

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, status: nextStatus } : m))
    );

    const feedItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      type: 'status_changed',
      title: `Status: ${nextStatus.toUpperCase()}`,
      description: `${member.name}'s account status set to ${nextStatus}`,
      timestamp: nowISO,
      meta: { memberId },
    };
    setActivityFeed((prev) => [feedItem, ...prev]);

    showToast('info', 'Status Changed', `${member.name} is now ${nextStatus}.`);
  }, [members, showToast]);

  // Trainer Duty Live Toggle
  const toggleTrainerDuty = useCallback((trainerId: string) => {
    const trainer = trainers.find((t) => t.id === trainerId);
    if (!trainer) return;

    const nextState = !trainer.isOnDuty;
    const nowISO = new Date().toISOString();

    setTrainers((prev) =>
      prev.map((t) => (t.id === trainerId ? { ...t, isOnDuty: nextState } : t))
    );

    const feedItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      type: 'trainer_duty',
      title: nextState ? `Trainer On Duty: ${trainer.name}` : `Departure Logged: ${trainer.name} (Trainer)`,
      description: nextState
        ? `${trainer.name} (${trainer.specialization}) clocked in for shift coaching`
        : `${trainer.name} (${trainer.specialization}) completed shift and clocked out`,
      timestamp: nowISO,
      meta: { trainerId },
    };
    setActivityFeed((prev) => [feedItem, ...prev]);

    showToast(
      nextState ? 'success' : 'info',
      `Trainer ${nextState ? 'Clocked In' : 'Clocked Out'}`,
      `${trainer.name} is now ${nextState ? 'On-Duty' : 'Off-Duty'}.`
    );
  }, [trainers, showToast]);

  const addTrainer = useCallback((data: Omit<Trainer, 'id'>) => {
    const nextNum = trainers.length + 1;
    const trainerId = `TRN-0${nextNum}`;
    const newTrainer: Trainer = {
      ...data,
      id: trainerId,
    };
    setTrainers((prev) => [...prev, newTrainer]);
    showToast('success', 'Trainer Added', `${newTrainer.name} joined the trainer directory.`);
    return newTrainer;
  }, [trainers, showToast]);

  const updateTrainer = useCallback((id: string, updates: Partial<Trainer>) => {
    setTrainers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('info', 'Trainer Updated', `Trainer records updated.`);
  }, [showToast]);

  const addTier = useCallback((data: Omit<MembershipTier, 'id'>) => {
    const tierId = `tier-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
    const newTier: MembershipTier = {
      ...data,
      id: tierId,
    };
    setTiers((prev) => [...prev, newTier]);
    showToast('success', 'Tier Created', `${newTier.name} tier is now active.`);
    return newTier;
  }, [showToast]);

  const updateTier = useCallback((id: string, updates: Partial<MembershipTier>) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    showToast('info', 'Tier Updated', `Membership tier specifications updated.`);
  }, [showToast]);

  // Manager & Corporate Profile Updates
  const updateManagerProfile = useCallback((updates: Partial<ManagerProfile>) => {
    setManagerProfile((prev) => ({
      ...prev,
      ...updates,
      lastStatusUpdate: new Date().toISOString(),
    }));
    showToast('success', 'Manager Status Updated', 'Your active profile status has been broadcasted.');
  }, [showToast]);

  const updateGymProfile = useCallback((updates: Partial<GymCorporateProfile>) => {
    setGymProfile((prev) => ({
      ...prev,
      ...updates,
    }));
    showToast('info', 'Facility Specifications Updated', 'Corporate facility profile updated.');
  }, [showToast]);

  // Staff Operations
  const toggleStaffDuty = useCallback((staffId: string) => {
    const staff = staffMembers.find((s) => s.id === staffId);
    if (!staff) return;

    const nextState = !staff.isOnDuty;
    const nowISO = new Date().toISOString();

    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, isOnDuty: nextState } : s))
    );

    const feedItem: ActivityFeedItem = {
      id: `ACT-${Date.now()}`,
      type: 'staff_duty',
      title: nextState ? `Staff On Duty: ${staff.name}` : `Departure Logged: ${staff.name} (Staff)`,
      description: nextState
        ? `${staff.name} (${staff.role}) clocked in for duty (${staff.shift})`
        : `${staff.name} (${staff.role}) completed shift and clocked out`,
      timestamp: nowISO,
    };
    setActivityFeed((prev) => [feedItem, ...prev]);

    showToast(
      nextState ? 'success' : 'info',
      `Staff ${nextState ? 'Clocked In' : 'Clocked Out'}`,
      `${staff.name} is now ${nextState ? 'On-Duty' : 'Off-Duty'}.`
    );
  }, [staffMembers, showToast]);

  const updateStaffMember = useCallback((staffId: string, updates: Partial<StaffMember>) => {
    setStaffMembers((prev) =>
      prev.map((s) => (s.id === staffId ? { ...s, ...updates } : s))
    );
    showToast('info', 'Staff Record Updated', 'Staff roster updated.');
  }, [showToast]);

  const addStaffMember = useCallback((data: Omit<StaffMember, 'id'>) => {
    const nextNum = staffMembers.length + 1;
    const staffId = `STF-0${nextNum}`;
    const newStaff: StaffMember = {
      ...data,
      id: staffId,
    };
    setStaffMembers((prev) => [...prev, newStaff]);
    showToast('success', 'Staff Member Added', `${newStaff.name} joined the facility operations team.`);
    return newStaff;
  }, [staffMembers, showToast]);

  // Manager Registration (Signup)
  const signup = useCallback(
    (username: string, name: string, email: string, phone: string, pass: string): boolean => {
      const u = username.trim().toLowerCase();
      const em = email.trim().toLowerCase();

      // Verify username or email doesn't already exist
      const existing = managersList.find(
        (m) => m.username.toLowerCase() === u || m.email.toLowerCase() === em
      );

      if (existing) {
        showToast('error', 'Registration Failed', `Username "${username}" or email is already registered.`);
        return false;
      }

      const newManager: ManagerAccount = {
        username: username.trim(),
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password: pass.trim(),
      };

      setManagersList((prev) => [...prev, newManager]);

      const nowISO = new Date().toISOString();
      setActivityFeed((prev) => [
        {
          id: `ACT-${Date.now()}`,
          type: 'status_changed',
          title: 'Manager Profile Created',
          description: `New manager account created for ${newManager.name} (${newManager.username})`,
          timestamp: nowISO,
        },
        ...prev,
      ]);

      showToast('success', 'Manager Registered', `Account created for ${newManager.name}. You can now sign in.`);
      return true;
    },
    [managersList, showToast]
  );

  // Authentication Logic
  const login = useCallback(
    (username: string, pass: string): boolean => {
      const u = username.trim().toLowerCase();
      const p = pass.trim();

      // 1. Check if username matches a registered member (e.g., "MEM-1042" or member email)
      const matchedMember = members.find(
        (m) => m.id.toLowerCase() === u || m.email.toLowerCase() === u
      );

      if (matchedMember) {
        setIsAuthenticated(true);
        setUserRole('member');
        setActiveMemberId(matchedMember.id);

        showToast(
          'success',
          'Member Gateway Authorized',
          `Welcome back, ${matchedMember.name}! Live member pass and radar unlocked.`
        );

        const nowISO = new Date().toISOString();
        setActivityFeed((prev) => [
          {
            id: `ACT-${Date.now()}`,
            type: 'status_changed',
            title: 'Member Authenticated',
            description: `${matchedMember.name} (${matchedMember.id}) signed into Member Hub`,
            timestamp: nowISO,
            meta: { memberId: matchedMember.id },
          },
          ...prev,
        ]);
        return true;
      }

      // 2. Look up inside managersList array
      const matchedManager = managersList.find(
        (m) =>
          (m.username.toLowerCase() === u || m.email.toLowerCase() === u) &&
          m.password === p
      );

      if (matchedManager) {
        setIsAuthenticated(true);
        setUserRole('manager');
        setActiveMemberId(null);
        const now = new Date();

        // Dynamically populate active managerProfile state
        setManagerProfile((prev) => ({
          ...prev,
          name: matchedManager.name,
          email: matchedManager.email,
          phone: matchedManager.phone || prev.phone,
          lastStatusUpdate: now.toISOString(),
        }));

        showToast(
          'success',
          'Secure Login Authorized',
          `Authenticated as ${matchedManager.name} on ${formatFullTimestamp(now)}. Welcome back.`
        );

        setActivityFeed((prev) => [
          {
            id: `ACT-${Date.now()}`,
            type: 'status_changed',
            title: 'Manager Session Authenticated',
            description: `${matchedManager.name} signed into FitAlex DBMS dashboard`,
            timestamp: now.toISOString(),
          },
          ...prev,
        ]);
        return true;
      }

      // 3. Default fallback for initial master credentials
      if (
        (u === 'manager' || u === 'manager@fitalex.internal') &&
        (p === 'admin' || p === 'admin123')
      ) {
        setIsAuthenticated(true);
        setUserRole('manager');
        setActiveMemberId(null);
        const now = new Date();
        setManagerProfile((prev) => ({
          ...prev,
          name: 'Vikram Malhotra',
          email: 'manager@fitalex.internal',
          phone: '9820194820',
          lastStatusUpdate: now.toISOString(),
        }));
        showToast(
          'success',
          'Secure Login Authorized',
          `Authenticated as Vikram Malhotra on ${formatFullTimestamp(now)}. Welcome back.`
        );
        return true;
      }

      return false;
    },
    [members, managersList, showToast]
  );

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveMemberId(null);
    localStorage.removeItem('fitalex_is_auth');
    localStorage.removeItem('fitalex_auth_role');
    localStorage.removeItem('fitalex_auth_member_id');
    showToast('info', 'Session Terminated', 'Logged out of FitAlex Gateway.');
  }, [showToast]);

  // Reset demo data helper
  const resetAllData = useCallback(() => {
    setMembers(initialMembers);
    setTrainers(initialTrainers);
    setTiers(initialTiers);
    setAttendanceLogs(initialAttendanceLogs);
    setActivityFeed(initialActivityFeed);
    setManagerProfile(initialManagerProfile);
    setGymProfile(initialGymCorporateProfile);
    setStaffMembers(initialStaffMembers);
    setManagersList([initialDefaultManager]);
    localStorage.removeItem(STORAGE_KEYS.MEMBERS);
    localStorage.removeItem(STORAGE_KEYS.TRAINERS);
    localStorage.removeItem(STORAGE_KEYS.TIERS);
    localStorage.removeItem(STORAGE_KEYS.LOGS);
    localStorage.removeItem(STORAGE_KEYS.FEED);
    localStorage.removeItem(STORAGE_KEYS.MANAGER);
    localStorage.removeItem(STORAGE_KEYS.GYM_PROFILE);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    localStorage.removeItem(STORAGE_KEYS.MANAGERS);
    localStorage.removeItem('fitalex_is_auth');
    localStorage.removeItem('fitalex_auth_role');
    localStorage.removeItem('fitalex_auth_member_id');
    setIsAuthenticated(false);
    setUserRole(null);
    setActiveMemberId(null);
    showToast('info', 'Database Reset', 'FitAlex data restored to pristine initial state.');
  }, [showToast]);

  const value = {
    members,
    trainers,
    tiers,
    attendanceLogs,
    activityFeed,
    stats,
    managerProfile,
    gymProfile,
    staffMembers,
    managersList,
    toasts,
    isAuthenticated,
    userRole,
    activeMemberUser,
    login,
    signup,
    logout,
    dismissToast,
    showToast,
    addMember,
    updateMember,
    deleteMember,
    logVisit,
    renewPlan,
    switchTier,
    toggleMemberStatus,
    toggleTrainerDuty,
    addTrainer,
    updateTrainer,
    addTier,
    updateTier,
    updateManagerProfile,
    updateGymProfile,
    toggleStaffDuty,
    updateStaffMember,
    addStaffMember,
    getTrainerById,
    getTierById,
    getTrainerClientCount,
    getTierMemberCount,
    resetAllData,
  };

  return <GymContext.Provider value={value}>{children}</GymContext.Provider>;
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
