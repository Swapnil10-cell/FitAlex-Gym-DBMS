import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { StaffMember } from '../types/gym';
import neonGymBg from '../assets/images/neon_gym_ambience.jpg';
import {
  Building,
  User,
  Mail,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Edit2,
  Check,
  MapPin,
  Flame,
  Users,
  CheckCircle2,
  Plus,
  Power,
  X,
  AlertCircle,
  LogOut,
  Dumbbell,
  Activity,
  Layers,
  ChevronRight,
  Shield,
  Gauge,
  Sliders,
  CheckCircle,
} from 'lucide-react';
import { formatTimeAgo } from '../utils/dateUtils';

interface EquipmentAsset {
  id: string;
  name: string;
  category: 'strength' | 'cardio';
  categoryLabel: string;
  stations: string;
  brand: string;
  status: string;
  operationalPercent: number;
  imageUrl: string;
  zone: string;
  specDetails: string;
}

const EQUIPMENT_ASSETS: EquipmentAsset[] = [
  {
    id: 'EQ-01',
    name: 'Heavy Duty Power Cage Array',
    category: 'strength',
    categoryLabel: 'STRENGTH & POWER DECK',
    stations: '6 Stations',
    brand: 'FitAlex Custom Spec',
    status: '100% Operational',
    operationalPercent: 100,
    imageUrl: '/power_rack_cage.jpg',
    zone: 'Sector Alpha · Heavy Platform',
    specDetails: '3x3" 11-Gauge structural steel, integrated multi-grip pullup bars, band pegs & spotter arms.',
  },
  {
    id: 'EQ-02',
    name: 'Functional Cable Cross Deck',
    category: 'strength',
    categoryLabel: 'STRENGTH & POWER DECK',
    stations: '4 Stations',
    brand: 'FitAlex Pro Spec',
    status: '100% Operational',
    operationalPercent: 100,
    imageUrl: '/cable_cross_machine.jpg',
    zone: 'Sector Beta · Functional Core',
    specDetails: 'Dual 200lb calibrated selectorized weight stacks with 2:1 aircraft-grade cable pulleys.',
  },
  {
    id: 'EQ-03',
    name: 'Hi-Performance Treadmill Theater',
    category: 'cardio',
    categoryLabel: 'TACTICAL CARDIO AREA',
    stations: '12 Units',
    brand: 'Bio-Athletic V2',
    status: '100% Operational',
    operationalPercent: 100,
    imageUrl: '/commercial_treadmill.jpg',
    zone: 'Sector Gamma · Cardio Overlook',
    specDetails: '5.0 HP AC dynamic drive motors, orthopedic suspension belt decks & active heart-rate telemetry.',
  },
  {
    id: 'EQ-04',
    name: 'Olympic Free-Weight Platform Grid',
    category: 'strength',
    categoryLabel: 'STRENGTH & POWER DECK',
    stations: '5 Platforms',
    brand: 'FitAlex Custom Spec',
    status: '100% Operational',
    operationalPercent: 100,
    imageUrl: '/olympic_platform.jpg',
    zone: 'Sector Alpha · Competition Deck',
    specDetails: 'Solid hardwood center insert, impact acoustic rubber sound-dampeners, IWF bumper sets.',
  },
  {
    id: 'EQ-05',
    name: 'Tactical Ergometer & AirBike Bay',
    category: 'cardio',
    categoryLabel: 'TACTICAL CARDIO AREA',
    stations: '8 Units',
    brand: 'Bio-Athletic V2',
    status: '100% Operational',
    operationalPercent: 100,
    imageUrl: '/ergometer_airbike.jpg',
    zone: 'Sector Gamma · HIIT Arena',
    specDetails: 'Dual-stage belt turbine resistance, PM5 performance metrics, Bluetooth heart sync.',
  },
];

// Curated high-resolution avatar photos for staff members
const STAFF_AVATAR_MAP: Record<string, string> = {
  'STF-01': 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80', // Female (Ananya)
  'STF-02': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80', // Male (Rohan)
  'STF-03': 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80', // Female (Pooja)
  'STF-04': 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=80', // Male (Suresh)
  'STF-05': 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&h=300&q=80', // Female (Kavita)
  'STF-06': 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80', // Male (Rajesh)
};

const FEMALE_FALLBACK = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&h=300&q=80';
const MALE_FALLBACK = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&h=300&q=80';

const getStaffAvatar = (staff: StaffMember, index: number): string => {
  if (staff.avatar && staff.avatar.trim()) return staff.avatar;
  if (STAFF_AVATAR_MAP[staff.id]) return STAFF_AVATAR_MAP[staff.id];
  // Deterministic fallback based on index/id
  return index % 2 === 0 ? FEMALE_FALLBACK : MALE_FALLBACK;
};

export const FacilityStaffView: React.FC = () => {
  const {
    managerProfile,
    updateManagerProfile,
    gymProfile,
    updateGymProfile,
    staffMembers,
    toggleStaffDuty,
    addStaffMember,
  } = useGym();

  // Equipment Category Filter State
  const [activeCategory, setActiveCategory] = useState<'all' | 'strength' | 'cardio'>('all');

  // Staff Department Filter State
  const [staffTab, setStaffTab] = useState<'ALL' | 'front_desk' | 'maintenance'>('ALL');

  // Manager interactive status message state
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [statusInput, setStatusInput] = useState(managerProfile.statusMessage);

  // Corporate Profile Edit modal state
  const [isEditingCorporate, setIsEditingCorporate] = useState(false);
  const [corpForm, setCorpForm] = useState(gymProfile);

  // New Staff Modal state
  const [isAddStaffOpen, setIsAddStaffOpen] = useState(false);
  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    role: '',
    department: 'front_desk' as StaffMember['department'],
    email: '',
    phone: '',
    shift: 'Morning Shift (06:00 AM - 02:00 PM)',
    isOnDuty: true,
    specialtyOrCycle: '',
  });

  const frontDeskStaff = staffMembers.filter((s) => s.department === 'front_desk');
  const maintenanceStaff = staffMembers.filter((s) => s.department === 'maintenance');
  const onDutyCount = staffMembers.filter((s) => s.isOnDuty).length;

  const filteredEquipment = activeCategory === 'all'
    ? EQUIPMENT_ASSETS
    : EQUIPMENT_ASSETS.filter((eq) => eq.category === activeCategory);

  const filteredStaff = staffTab === 'ALL'
    ? staffMembers
    : staffMembers.filter((s) => s.department === staffTab);

  const handleSaveStatus = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!statusInput.trim()) return;
    updateManagerProfile({ statusMessage: statusInput.trim() });
    setIsEditingStatus(false);
  };

  const handleQuickStatusPreset = (presetText: string) => {
    setStatusInput(presetText);
    updateManagerProfile({ statusMessage: presetText });
    setIsEditingStatus(false);
  };

  const handleSaveCorporate = (e: React.FormEvent) => {
    e.preventDefault();
    updateGymProfile(corpForm);
    setIsEditingCorporate(false);
  };

  const handleCreateStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaffForm.name.trim() || !newStaffForm.role.trim()) return;

    addStaffMember({
      name: newStaffForm.name.trim(),
      role: newStaffForm.role.trim(),
      department: newStaffForm.department,
      email: newStaffForm.email.trim() || `${newStaffForm.name.toLowerCase().replace(/\s+/g, '.')}@fitalex.internal`,
      phone: newStaffForm.phone.trim() || '+1 (555) 301-0000',
      shift: newStaffForm.shift.trim(),
      isOnDuty: newStaffForm.isOnDuty,
      specialtyOrCycle: newStaffForm.specialtyOrCycle.trim() || 'General Operations',
    });

    setIsAddStaffOpen(false);
    setNewStaffForm({
      name: '',
      role: '',
      department: 'front_desk',
      email: '',
      phone: '',
      shift: 'Morning Shift (06:00 AM - 02:00 PM)',
      isOnDuty: true,
      specialtyOrCycle: '',
    });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* =========================================================================
          1. CINEMATIC BG & OVERVIEW BANNER
      ========================================================================= */}
      <div className="relative rounded-3xl overflow-hidden border border-[#252B38]/80 shadow-2xl bg-[#0F1115]">
        {/* Full-bleed Neon Gym Ambience Asset */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <img
            src={neonGymBg || '/neon_gym_ambience.jpg'}
            alt="FitAlex Neon Gym Complex"
            className="w-full h-full object-cover object-center scale-105 transform filter brightness-90 contrast-110"
          />
          {/* Deep charcoal-to-matte-dark gradient filter overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115]/95 via-[#0F1115]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/30 to-transparent" />
        </div>

        {/* Banner Content Container */}
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col justify-between gap-6 min-h-[220px]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/30 backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
                <span className="text-[11px] font-bold text-[#D4FF00] tracking-widest uppercase">
                  ACTIVE MATRIX · ARCHITECTURE CORE
                </span>
              </div>

              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white uppercase drop-shadow-sm">
                  FITALEX CORE FACILITY
                </h1>
                <p className="text-sm sm:text-base text-slate-300 font-medium mt-1">
                  Active complex specifications and real-time floor assets.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 self-start md:self-auto shrink-0">
              <button
                onClick={() => setIsAddStaffOpen(true)}
                className="px-5 py-3 bg-[#D4FF00] hover:bg-[#c2ea00] text-[#0F1115] font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(212,255,0,0.3)] active:scale-95 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Add Operations Staff</span>
              </button>
            </div>
          </div>

          {/* Quick HUD Metrics Bar */}
          <div className="pt-4 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="bg-[#181C24]/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Operational Security</span>
              <span className="text-white font-extrabold text-sm sm:text-base mt-0.5 block font-mono-tabular">
                24/7 BIOMETRIC GATE
              </span>
            </div>

            <div className="bg-[#181C24]/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">On-Duty Operations</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 font-extrabold text-sm sm:text-base font-mono-tabular">
                  {onDutyCount} Active
                </span>
                <span className="text-slate-400 text-xs font-mono-tabular">/ {staffMembers.length}</span>
              </div>
            </div>

            <div className="bg-[#181C24]/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Facility Area</span>
              <span className="text-[#D4FF00] font-extrabold text-sm sm:text-base mt-0.5 block font-mono-tabular">
                {gymProfile.facilityArea}
              </span>
            </div>

            <div className="bg-[#181C24]/80 backdrop-blur-md rounded-xl p-3 border border-white/10">
              <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">Floor Equipment</span>
              <span className="text-white font-extrabold text-sm sm:text-base mt-0.5 block font-mono-tabular">
                35 Heavy Stations
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. MANAGER CONTROL ROOM
      ========================================================================= */}
      <div className="bg-[#181C24] rounded-2xl p-6 sm:p-7 border border-[#252B38]/80 shadow-md relative overflow-hidden">
        {/* Accent top gradient */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#D4FF00] via-emerald-400 to-[#D4FF00]" />

        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          {/* Manager Core Bio & Status Console */}
          <div className="flex flex-col sm:flex-row items-start gap-5 flex-1">
            {/* High-end Manager Avatar / Monogram */}
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#D4FF00] to-emerald-400 p-0.5 shadow-[0_0_25px_rgba(212,255,0,0.25)]">
                <div className="w-full h-full bg-[#12151C] rounded-[14px] flex items-center justify-center text-[#D4FF00] font-black text-2xl tracking-tight">
                  AM
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-2 border-[#181C24] flex items-center justify-center">
                <span className="w-2 h-2 rounded-full bg-emerald-950" />
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-2xl font-black text-white tracking-tight">
                  {managerProfile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00]/10 border border-[#D4FF00]/30 text-[#D4FF00] font-extrabold text-[11px] uppercase tracking-wider">
                  {managerProfile.title}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 font-semibold text-[11px] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {managerProfile.operationalState}
                </span>
              </div>

              {/* Minimal contact links */}
              <div className="mt-2.5 flex flex-wrap items-center gap-4 text-xs text-slate-300">
                <a
                  href={`mailto:${managerProfile.email}`}
                  className="flex items-center gap-1.5 hover:text-white transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{managerProfile.email}</span>
                </a>
                <span className="text-slate-600">·</span>
                <a
                  href={`tel:${managerProfile.phone}`}
                  className="flex items-center gap-1.5 font-mono-tabular hover:text-white transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{managerProfile.phone}</span>
                </a>
                <span className="text-slate-600">·</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Shift: {managerProfile.shiftWindow}</span>
                </div>
              </div>

              {/* Real-Time Live Status Console */}
              <div className="mt-4 p-4 bg-[#0F1115] rounded-xl border border-[#252B38] space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#D4FF00]" />
                    Live Floor Broadcast Message:
                  </span>
                  <span className="text-[11px] text-slate-500 font-mono-tabular">
                    Updated {formatTimeAgo(managerProfile.lastStatusUpdate)}
                  </span>
                </div>

                {isEditingStatus ? (
                  <form onSubmit={handleSaveStatus} className="flex gap-2 pt-1">
                    <input
                      type="text"
                      value={statusInput}
                      onChange={(e) => setStatusInput(e.target.value)}
                      placeholder="What are you currently managing?"
                      autoFocus
                      className="flex-1 bg-[#181C24] border border-[#D4FF00] rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#D4FF00]"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#D4FF00] hover:bg-[#c2ea00] text-[#0F1115] font-black text-xs uppercase tracking-wider rounded-lg transition-all active:scale-95 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingStatus(false)}
                      className="px-3.5 py-2 bg-[#252B38] text-slate-300 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-slate-200 italic font-medium">
                      "{managerProfile.statusMessage}"
                    </p>
                    <button
                      onClick={() => {
                        setStatusInput(managerProfile.statusMessage);
                        setIsEditingStatus(true);
                      }}
                      className="text-xs text-[#D4FF00] hover:underline flex items-center gap-1 shrink-0 font-bold cursor-pointer"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Update</span>
                    </button>
                  </div>
                )}

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
                  <span className="text-slate-500 font-medium">Presets:</span>
                  {[
                    'On floor overseeing workout wave',
                    'At Main Desk assisting new sign-ups',
                    'Conducting facility safety walk',
                    'In vendor equipment review',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleQuickStatusPreset(preset)}
                      className="px-2.5 py-1 rounded-md bg-[#181C24] hover:bg-[#252B38] border border-white/5 hover:border-[#D4FF00]/40 text-slate-300 hover:text-[#D4FF00] transition-colors cursor-pointer text-[11px]"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Operational State Switcher Pill Panel */}
          <div className="p-4 bg-[#0F1115] rounded-xl border border-[#252B38] lg:w-64 space-y-2.5 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Duty State
              </span>
              <span className="text-[10px] text-slate-400">Live Roster</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(['On-Duty', 'Managing Floor', 'Executive Meeting', 'Away'] as const).map(
                (state) => {
                  const isActive = managerProfile.operationalState === state;
                  return (
                    <button
                      key={state}
                      type="button"
                      onClick={() => updateManagerProfile({ operationalState: state })}
                      className={`px-2.5 py-2 text-[11px] font-bold rounded-lg transition-all text-center cursor-pointer active:scale-95 ${
                        isActive
                          ? 'bg-[#D4FF00] text-[#0F1115] shadow-[0_0_15px_rgba(212,255,0,0.25)]'
                          : 'bg-[#181C24] text-slate-400 hover:text-white hover:bg-[#252B38] border border-transparent'
                      }`}
                    >
                      {state}
                    </button>
                  );
                }
              )}
            </div>
            <p className="text-[10px] text-slate-500 text-center pt-1 font-medium">
              Synchronizes manager presence to entire team
            </p>
          </div>
        </div>

        {/* Corporate Specifications Subsection */}
        <div className="mt-6 pt-6 border-t border-[#252B38]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#252B38] flex items-center justify-center text-[#D4FF00]">
                <Building className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white uppercase tracking-wider">
                  Corporate Complex Blueprint
                </h3>
                <span className="text-xs text-slate-400">
                  Physical facility governance & compliance specs
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setCorpForm(gymProfile);
                setIsEditingCorporate(true);
              }}
              className="px-3.5 py-1.5 bg-[#0F1115] hover:bg-[#212631] border border-[#252B38] text-xs font-bold text-slate-200 hover:text-white rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Edit2 className="w-3 h-3 text-[#D4FF00]" />
              <span>Edit Blueprint</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Registered Complex
              </span>
              <p className="text-sm font-bold text-white mt-0.5">{gymProfile.registeredName}</p>
              <span className="text-[11px] text-[#D4FF00] font-mono-tabular mt-1 block">
                Facility ID #FA-001
              </span>
            </div>

            <div className="p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Legal Entity Owner
              </span>
              <p className="text-sm font-bold text-white mt-0.5">{gymProfile.legalOwner}</p>
              <span className="text-[11px] text-slate-400 mt-1 block">Proprietary Fitness Lab</span>
            </div>

            <div className="p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Physical Campus
              </span>
              <p className="text-sm font-bold text-white mt-0.5 truncate">{gymProfile.physicalAddress}</p>
              <span className="text-[11px] text-emerald-400 font-mono-tabular mt-1 block">
                Zone Alpha Ground Hub
              </span>
            </div>

            <div className="p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Compliance & Capacity
              </span>
              <p className="text-sm font-bold text-white mt-0.5">
                {gymProfile.maxOccupancy} Max Occupancy
              </p>
              <span className="text-[11px] text-emerald-400 mt-1 block truncate">
                {gymProfile.fireCompliance}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          3. INTERACTIVE GYM FACILITY & EQUIPMENT DECK
      ========================================================================= */}
      <div className="bg-[#181C24] rounded-2xl p-6 sm:p-7 border border-[#252B38]/80 shadow-md space-y-6">
        {/* Header & Segmented Tab Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#252B38]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#252B38] flex items-center justify-center text-[#D4FF00]">
                <Dumbbell className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                Facility Assets & Equipment Deck
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Hardware health status, station capacity specs, and live floor machinery telemetry.
            </p>
          </div>

          {/* Interactive Equipment Category Filter Controls */}
          <div className="flex items-center gap-2 self-start md:self-auto overflow-x-auto max-w-full pb-1 md:pb-0">
            {[
              { id: 'all' as const, label: 'All Equipment' },
              { id: 'strength' as const, label: 'Strength & Power Deck' },
              { id: 'cardio' as const, label: 'Tactical Cardio Area' },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs rounded-xl tracking-wider uppercase transition-all duration-150 cursor-pointer active:scale-95 shrink-0 ${
                    isActive
                      ? 'bg-[#D4FF00] text-[#0F1115] font-black shadow-[0_0_15px_rgba(212,255,0,0.25)]'
                      : 'bg-[#12151C] text-slate-400 hover:text-white hover:border-slate-500 border border-[#252B38]/60 font-semibold'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Asset Cards Grid / Fallback */}
        {filteredEquipment.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEquipment.map((asset) => (
              <div
                key={asset.id}
                className="group bg-[#0F1115] rounded-xl border border-[#252B38] hover:border-slate-500 overflow-hidden transition-all duration-300 flex flex-col justify-between shadow-sm"
              >
                <div>
                  {/* Image Anchored Top Banner - Clean Product Catalog Inventory Showcase */}
                  <div className="relative h-52 w-full overflow-hidden bg-[#12151C] flex items-center justify-center p-3 border-b border-[#252B38]/60">
                    <img
                      src={asset.imageUrl}
                      alt={asset.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 select-none"
                    />

                    {/* Badges on Image */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                      <span className="px-2.5 py-1 rounded-md bg-[#0F1115]/90 border border-[#252B38] text-[10px] font-extrabold text-slate-300 uppercase tracking-wider backdrop-blur-md">
                        {asset.zone}
                      </span>

                      {/* Subtle Volt Lime Dim Badge */}
                      <span className="px-2.5 py-1 rounded-md text-[#D4FF00] bg-[#D4FF00]/15 border border-[#D4FF00]/30 text-[10px] font-extrabold uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
                        {asset.status}
                      </span>
                    </div>

                    {/* Station Count Pill Floating Bottom */}
                    <div className="absolute bottom-3 left-3 pointer-events-none">
                      <span className="px-3 py-1 rounded-lg bg-[#D4FF00] text-[#0F1115] text-xs font-black uppercase tracking-wider shadow-md">
                        {asset.stations}
                      </span>
                    </div>
                  </div>

                  {/* Content Box */}
                  <div className="p-4 space-y-3">
                    <div>
                      <h3 className="font-extrabold text-base text-white tracking-tight group-hover:text-[#D4FF00] transition-colors">
                        {asset.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-slate-400 font-medium">{asset.brand}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-[#D4FF00] text-[11px] font-bold uppercase tracking-wider">
                          {asset.categoryLabel}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {asset.specDetails}
                    </p>
                  </div>
                </div>

                {/* Card Footer Telemetry */}
                <div className="p-4 pt-3 border-t border-[#252B38]/80 bg-[#12151C]/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Gauge className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-[11px] font-mono-tabular">Diagnostic: Optimal</span>
                  </div>

                  <span className="text-[10px] font-mono-tabular text-slate-500">
                    {asset.id}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-12 px-4 rounded-xl border border-dashed border-[#252B38] bg-[#0F1115]/50 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-[#181C24] border border-[#252B38] flex items-center justify-center text-slate-500">
              <Dumbbell className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-slate-300">
              No assets found in this sector.
            </p>
            <p className="text-xs text-slate-500 max-w-sm">
              Try switching your filter above or verify current floor maintenance schedules.
            </p>
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className="mt-2 px-3 py-1.5 rounded-lg bg-[#181C24] hover:bg-[#252B38] border border-[#252B38] text-xs font-bold text-[#D4FF00] transition-colors cursor-pointer"
            >
              Reset to All Equipment
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          4. PROFILE HUB: OPERATIONS & TEAM ROSTER
      ========================================================================= */}
      <div className="bg-[#181C24] rounded-2xl p-6 sm:p-7 border border-[#252B38]/80 shadow-md space-y-6">
        {/* Header & Department Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#252B38]">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0F1115] border border-[#252B38] flex items-center justify-center text-[#D4FF00]">
                <Users className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-black text-white tracking-tight uppercase">
                Operations & Team Roster
              </h2>
            </div>
            <p className="text-xs text-slate-400">
              Front-desk access facilitators, locker coordinators, and sanitation engineers.
            </p>
          </div>

          {/* Department Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0F1115] border border-[#252B38] rounded-xl self-start md:self-auto overflow-x-auto max-w-full">
            {[
              { id: 'ALL', label: `ALL CREW (${staffMembers.length})` },
              { id: 'front_desk', label: `FRONT-DESK (${frontDeskStaff.length})` },
              { id: 'maintenance', label: `MAINTENANCE (${maintenanceStaff.length})` },
            ].map((tab) => {
              const isActive = staffTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setStaffTab(tab.id as any)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 cursor-pointer ${
                    isActive
                      ? 'bg-[#D4FF00] text-[#0F1115] shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-[#181C24]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* High-End Profile Roster Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredStaff.map((staff, idx) => {
            const avatarUrl = getStaffAvatar(staff, idx);
            return (
              <div
                key={staff.id}
                className="p-5 bg-[#0F1115] rounded-xl border border-[#252B38] hover:border-slate-500 transition-all flex flex-col justify-between space-y-4 shadow-sm"
              >
                <div>
                  {/* Top: Avatar, Name, Unique Staff ID Badge & Check-in toggle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {/* Circular User Avatar with Status Beacon */}
                      <div className="relative shrink-0">
                        <img
                          src={avatarUrl}
                          alt={staff.name}
                          className="w-13 h-13 rounded-full object-cover border-2 border-[#252B38] shadow-md"
                        />
                        <span
                          className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#0F1115] ${
                            staff.isOnDuty ? 'bg-emerald-400' : 'bg-slate-600'
                          }`}
                          title={staff.isOnDuty ? 'On-Duty' : 'Off-Duty'}
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-base text-white truncate">
                            {staff.name}
                          </h3>
                        </div>
                        <p className="text-xs text-[#D4FF00] font-semibold truncate">
                          {staff.role}
                        </p>
                        <span className="font-mono-tabular text-[10px] text-slate-500 font-bold uppercase tracking-wider block mt-0.5">
                          {staff.id} · {staff.department === 'front_desk' ? 'FRONT-DESK' : 'MAINTENANCE'}
                        </span>
                      </div>
                    </div>

                    {/* Interactive "Check In" / "Check Out" active-duty toggle button with micro-interactions */}
                    {staff.isOnDuty ? (
                      <button
                        onClick={() => toggleStaffDuty(staff.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all active:scale-95 bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/80 hover:text-white flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                        title="Clock Out / Check Out from shift"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Check Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleStaffDuty(staff.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all active:scale-95 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center gap-1.5 cursor-pointer shrink-0 shadow-xs"
                        title="Clock In / Check In to shift"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Check In</span>
                      </button>
                    )}
                  </div>

                  {/* Shift Window Highlighted Pill Badge */}
                  <div className="mt-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#181C24] border border-[#252B38] text-[11px] text-slate-300">
                      <Clock className="w-3 h-3 text-[#D4FF00] shrink-0" />
                      <span className="font-medium">{staff.shift}</span>
                    </div>
                  </div>

                  {/* Contact Links Mapped with Minimal Lucide Icons */}
                  <div className="mt-3.5 space-y-1.5 text-xs text-slate-400">
                    <a
                      href={`mailto:${staff.email}`}
                      className="flex items-center gap-2 hover:text-white transition-colors truncate"
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{staff.email}</span>
                    </a>
                    <a
                      href={`tel:${staff.phone}`}
                      className="flex items-center gap-2 font-mono-tabular hover:text-white transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{staff.phone}</span>
                    </a>
                  </div>
                </div>

                {/* Focus Scope / Responsibility */}
                {staff.specialtyOrCycle && (
                  <div className="pt-3 border-t border-[#252B38] text-[11px]">
                    <span className="text-slate-500 block font-semibold text-[10px] uppercase tracking-wider">
                      Operational Responsibility
                    </span>
                    <span className="text-slate-300 font-medium block mt-0.5">
                      {staff.specialtyOrCycle}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          5. MODAL: EDIT CORPORATE SPECIFICATIONS
      ========================================================================= */}
      {isEditingCorporate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Edit Headquarters Specification
              </h2>
              <button
                onClick={() => setIsEditingCorporate(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCorporate} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Registered Gym Name
                </label>
                <input
                  type="text"
                  value={corpForm.registeredName}
                  onChange={(e) => setCorpForm({ ...corpForm, registeredName: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Legal Corporate Owner
                </label>
                <input
                  type="text"
                  value={corpForm.legalOwner}
                  onChange={(e) => setCorpForm({ ...corpForm, legalOwner: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Physical Corporate Address
                </label>
                <input
                  type="text"
                  value={corpForm.physicalAddress}
                  onChange={(e) => setCorpForm({ ...corpForm, physicalAddress: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Operating Schedule Status
                </label>
                <input
                  type="text"
                  value={corpForm.operatingSchedule}
                  onChange={(e) => setCorpForm({ ...corpForm, operatingSchedule: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="pt-4 border-t border-[#252B38] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingCorporate(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-[#0F1115] bg-[#D4FF00] hover:bg-[#c2ea00] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          6. MODAL: ONBOARD OPERATIONS STAFF
      ========================================================================= */}
      {isAddStaffOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-wide">
                Onboard Operations Staff
              </h2>
              <button
                onClick={() => setIsAddStaffOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Full Name <span className="text-[#D4FF00]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Jordan Hayes"
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Department
                  </label>
                  <select
                    value={newStaffForm.department}
                    onChange={(e) =>
                      setNewStaffForm({
                        ...newStaffForm,
                        department: e.target.value as StaffMember['department'],
                      })
                    }
                    className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="front_desk">Front-Desk & Support</option>
                    <option value="maintenance">Maintenance & Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Operational Role <span className="text-[#D4FF00]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Desk Specialist"
                    value={newStaffForm.role}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, role: e.target.value })}
                    className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Shift Window
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 06:00 AM - 02:00 PM"
                    value={newStaffForm.shift}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, shift: e.target.value })}
                    className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Focus Responsibility / Cleaning Scope
                </label>
                <input
                  type="text"
                  placeholder="e.g. Turnstile access, locker sanitization, smoothie bar..."
                  value={newStaffForm.specialtyOrCycle}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, specialtyOrCycle: e.target.value })
                  }
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="staffDutyCheck"
                  checked={newStaffForm.isOnDuty}
                  onChange={(e) =>
                    setNewStaffForm({ ...newStaffForm, isOnDuty: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#D4FF00] rounded cursor-pointer"
                />
                <label htmlFor="staffDutyCheck" className="text-xs text-slate-300 cursor-pointer">
                  Mark as currently <strong>On-Duty</strong> right now
                </label>
              </div>

              <div className="pt-4 border-t border-[#252B38] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddStaffOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-xs font-black text-[#0F1115] bg-[#D4FF00] hover:bg-[#c2ea00] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer uppercase tracking-wider"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
