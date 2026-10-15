/**
 * FitAlex Gym DBMS - Core Data Types & Relational Models
 */

export type MemberStatus = 'active' | 'expired' | 'paused';
export type UserRole = 'manager' | 'member';

export interface Member {
  id: string; // e.g. "MEM-1042"
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  tierId: string; // Foreign Key to MembershipTier.id
  trainerId: string | null; // Foreign Key to Trainer.id
  status: MemberStatus;
  isCurrentlyInGym: boolean;
  joinedAt: string; // ISO string captured with new Date()
  planExpiresAt: string; // ISO string
  lastVisitAt: string | null; // ISO string
  emergencyContact?: string;
  notes?: string;
}

export interface Trainer {
  id: string; // e.g. "TRN-01"
  name: string;
  specialization: 'Bodybuilding' | 'CrossFit' | 'Yoga & Mobility' | 'HIIT & Cardio' | 'Powerlifting' | 'Strength & Conditioning';
  email: string;
  phone: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  avatar: string;
  isOnDuty: boolean;
  shiftHours: string;
  rating: number;
  bio: string;
}

export interface MembershipTier {
  id: string; // e.g. "tier-vip"
  name: string;
  badgeTitle: string;
  monthlyPrice: number;
  durationDays: number;
  targetAudience: string;
  features: string[];
  maxClassBookings: string;
  guestPassesPerMonth: number;
  isPopular?: boolean;
}

export interface AttendanceLog {
  id: string;
  memberId: string; // Foreign Key to Member.id
  memberName: string;
  tierName: string;
  timestamp: string; // ISO string captured with new Date()
  zone: 'Main Gym Floor' | 'CrossFit Box' | 'Recovery Spa' | 'Free Weights Deck' | 'Cardio Theater';
  type: 'check-in' | 'check-out';
}

export interface ActivityFeedItem {
  id: string;
  type: 'check_in' | 'check_out' | 'member_registered' | 'plan_renewed' | 'tier_switched' | 'status_changed' | 'trainer_duty' | 'staff_duty';
  title: string;
  description: string;
  timestamp: string; // ISO string captured with new Date()
  meta?: {
    memberId?: string;
    trainerId?: string;
    tierId?: string;
  };
}

export interface GymStats {
  activeMembers: number;
  totalMembers: number;
  monthlyRevenue: number;
  trainersOnDuty: number;
  totalTrainers: number;
  urgentExpirations: number; // Expiring within 7 days
  todayVisits: number;
}

export type StaffDepartment = 'front_desk' | 'maintenance';

export interface StaffMember {
  id: string; // e.g. "STF-01"
  name: string;
  role: string;
  department: StaffDepartment;
  email: string;
  phone: string;
  shift: string;
  isOnDuty: boolean;
  avatar?: string;
  specialtyOrCycle?: string;
}

export interface ManagerProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  shiftWindow: string;
  statusMessage: string;
  operationalState: 'On-Duty' | 'Managing Floor' | 'Executive Meeting' | 'Away';
  lastStatusUpdate: string;
  avatar?: string;
}

export interface GymCorporateProfile {
  registeredName: string;
  legalOwner: string;
  physicalAddress: string;
  operatingSchedule: string;
  facilityArea: string;
  maxOccupancy: number;
  fireCompliance: string;
  emergencyHotline: string;
}

export interface ManagerAccount {
  username: string;
  name: string;
  email: string;
  phone: string;
  password: string;
}
