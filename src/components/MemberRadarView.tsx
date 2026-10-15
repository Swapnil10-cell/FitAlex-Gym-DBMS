import React, { useState } from 'react';
import {
  Compass,
  Radio,
  Dumbbell,
  Activity,
  Users,
  Flame,
  Zap,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  TrendingUp,
} from 'lucide-react';

type SectorId = 'alpha' | 'beta' | 'gamma';

interface SectorSpec {
  id: SectorId;
  name: string;
  tagline: string;
  loadPercent: number;
  activeCount: number;
  totalCapacity: number;
  waitEstimate: string;
  status: 'Open Flow' | 'Moderate Density' | 'Peak Waves';
  statusColor: string;
  equipment: {
    name: string;
    total: number;
    inUse: number;
    status: string;
    details: string;
  }[];
}

export const MemberRadarView: React.FC = () => {
  const [activeSector, setActiveSector] = useState<SectorId>('alpha');

  const sectors: Record<SectorId, SectorSpec> = {
    alpha: {
      id: 'alpha',
      name: 'SECTOR ALPHA · STRENGTH & POWER DECK',
      tagline: 'Heavy Duty Structural Power Racks & Olympic Platforms',
      loadPercent: 67,
      activeCount: 16,
      totalCapacity: 24,
      waitEstimate: '~3 min queue',
      status: 'Moderate Density',
      statusColor: 'text-[#D4FF00]',
      equipment: [
        {
          name: 'Heavy Duty Power Cage Array',
          total: 6,
          inUse: 4,
          status: '2 Cages Free',
          details: 'FitAlex Custom Spec · Olympic safety bars & calibrated plates',
        },
        {
          name: 'Olympic Weightlifting Platforms',
          total: 4,
          inUse: 2,
          status: '2 Platforms Free',
          details: 'Hardwood competition center · Eleiko bumper plates',
        },
        {
          name: 'Heavy Dumbbell & Flat Bench Deck',
          total: 10,
          inUse: 7,
          status: '3 Benches Free',
          details: 'Urethane dumbbells 5 lbs to 150 lbs · Commercial adjustable benches',
        },
        {
          name: 'Incline & Decline Press Stations',
          total: 4,
          inUse: 3,
          status: '1 Station Free',
          details: 'Olympic multi-angle press benches with spotter decks',
        },
      ],
    },
    beta: {
      id: 'beta',
      name: 'SECTOR BETA · TACTICAL CARDIO & CABLE HUB',
      tagline: 'Biometric Treadmills, Ergometers & Dual Adjustable Pulleys',
      loadPercent: 42,
      activeCount: 14,
      totalCapacity: 32,
      waitEstimate: 'Immediate Access',
      status: 'Open Flow',
      statusColor: 'text-emerald-400',
      equipment: [
        {
          name: 'Hi-Performance Treadmill Theater',
          total: 12,
          inUse: 5,
          status: '7 Units Free',
          details: 'Bio-Athletic V2 motorized runners with biometric telemetry',
        },
        {
          name: 'Functional Cable Cross Array',
          total: 4,
          inUse: 3,
          status: '1 Deck Free',
          details: 'Dual adjustable pulleys · Full handle & attachment rack',
        },
        {
          name: 'High-Wattage AirBike & Rower Deck',
          total: 8,
          inUse: 3,
          status: '5 Units Free',
          details: 'Concept2 Rowers + Rogue Echo AirBikes for HIIT conditioning',
        },
        {
          name: 'StairMaster Climber Matrix',
          total: 6,
          inUse: 3,
          status: '3 Units Free',
          details: 'Revolving stair cardio machines with heart-rate pairing',
        },
      ],
    },
    gamma: {
      id: 'gamma',
      name: 'SECTOR GAMMA · RECOVERY SPA & MOBILITY ARENA',
      tagline: 'Infrared Saunas, Cold Plunge Cryo & Functional Turf',
      loadPercent: 25,
      activeCount: 6,
      totalCapacity: 24,
      waitEstimate: 'Walk-In Open',
      status: 'Open Flow',
      statusColor: 'text-cyan-400',
      equipment: [
        {
          name: 'Infrared Thermal Saunas',
          total: 4,
          inUse: 1,
          status: '3 Suites Free',
          details: 'Full spectrum infrared heat cabins with chromotherapy lights',
        },
        {
          name: 'Sub-Zero Cold Plunge Tubs',
          total: 2,
          inUse: 1,
          status: '1 Tub Ready',
          details: 'Continuous filtration chilled at 45°F (7°C) for rapid recovery',
        },
        {
          name: 'Percussion & Compression Lounge',
          total: 6,
          inUse: 2,
          status: '4 Boots Free',
          details: 'Normatec pneumatic compression boots & Hyperice guns',
        },
        {
          name: 'Dynamic Mobility & Foam Rolling Turf',
          total: 12,
          inUse: 2,
          status: '10 Spots Open',
          details: 'Shock-absorbent high density turf with bands and trigger rollers',
        },
      ],
    },
  };

  const currentSector = sectors[activeSector];

  const peakWindows = [
    {
      time: '05:00 - 08:30',
      label: 'Early Morning Surge',
      density: 'Moderate',
      pct: 65,
      tip: 'Great focus. Minor queue for power racks between 06:30 and 07:15.',
      color: 'bg-amber-400',
    },
    {
      time: '11:00 - 15:30',
      label: 'Prime Lifter Window (Sweet Spot)',
      density: 'Low / Optimal',
      pct: 28,
      tip: 'Recommended! Lowest floor traffic. All cages & cable decks wide open.',
      color: 'bg-[#D4FF00]',
    },
    {
      time: '17:30 - 20:30',
      label: 'Evening Peak Waves',
      density: 'High Density',
      pct: 88,
      tip: 'High floor energy. High turnover on compound lifting racks.',
      color: 'bg-rose-500',
    },
    {
      time: '21:00 - 02:00',
      label: 'Late Night Focus',
      density: 'Ultra Low',
      pct: 18,
      tip: 'Pure empty floor. Ideal for undisturbed solo training sessions.',
      color: 'bg-cyan-400',
    },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner with Real-Time Floor Radar Header */}
      <div className="relative overflow-hidden rounded-3xl bg-[#181C24] border border-[#252B38] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/30 inline-flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>LIVE TELEMETRY RADAR</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                COMPLEX OCCUPANCY: 48% (52 / 120)
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              INTERACTIVE GYM <span className="text-[#D4FF00]">HUD RADAR</span>
            </h1>

            <p className="text-sm text-slate-400 max-w-2xl">
              Inspect real-time floor capacity, equipment availability, and historical crowd waves across Sector Alpha, Beta, and Gamma before arriving at the facility.
            </p>
          </div>

          {/* Quick HUD Overall Dial */}
          <div className="flex items-center gap-4 bg-[#12151C] p-4 rounded-2xl border border-[#252B38] shrink-0">
            {/* Visual Radar Pulse Mini Dial */}
            <div className="relative w-14 h-14 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#D4FF00]/30 animate-ping opacity-25" />
              <div className="absolute inset-1 rounded-full border border-[#D4FF00]/50" />
              <div className="w-8 h-8 rounded-full bg-[#D4FF00] text-[#0F1115] font-black text-xs flex items-center justify-center">
                48%
              </div>
            </div>

            <div>
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                TOTAL GYM CAPACITY
              </p>
              <p className="text-sm font-extrabold text-white">OPTIMAL FLOW</p>
              <p className="text-[11px] text-emerald-400 font-medium">68 Lockers & Stations Free</p>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Sector Switcher Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {(['alpha', 'beta', 'gamma'] as SectorId[]).map((sId) => {
          const s = sectors[sId];
          const isSelected = activeSector === sId;
          return (
            <button
              key={sId}
              type="button"
              onClick={() => setActiveSector(sId)}
              className={`p-4 rounded-2xl border text-left transition-all duration-150 active:scale-98 cursor-pointer relative overflow-hidden ${
                isSelected
                  ? 'bg-[#181C24] border-[#D4FF00] shadow-[0_0_25px_rgba(212,255,0,0.2)] ring-1 ring-[#D4FF00]/50'
                  : 'bg-[#181C24]/60 border-[#252B38] hover:border-slate-500 hover:bg-[#181C24]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className={`text-[11px] font-mono font-bold uppercase tracking-wider ${
                    isSelected ? 'text-[#D4FF00]' : 'text-slate-400'
                  }`}
                >
                  SECTOR {sId.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isSelected
                      ? 'bg-[#D4FF00] text-[#0F1115]'
                      : 'bg-[#12151C] text-slate-400'
                  }`}
                >
                  {s.loadPercent}% LOAD
                </span>
              </div>

              <h3 className="font-extrabold text-sm sm:text-base text-white truncate">
                {sId === 'alpha'
                  ? 'Strength & Power Deck'
                  : sId === 'beta'
                  ? 'Cardio & Cable Hub'
                  : 'Recovery Spa & Turf'}
              </h3>

              <div className="mt-2.5 flex items-center justify-between text-xs text-slate-400">
                <span>{s.activeCount} / {s.totalCapacity} in use</span>
                <span className={`font-semibold ${s.statusColor}`}>{s.waitEstimate}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Sector Detailed Equipment Deck */}
      <div className="bg-[#181C24] border border-[#252B38] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#252B38]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-white">{currentSector.name}</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#12151C] ${currentSector.statusColor} border border-[#252B38]`}>
                {currentSector.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentSector.tagline}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-mono">
              Live Sensor Check: 100% Operational
            </span>
          </div>
        </div>

        {/* Equipment Asset Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentSector.equipment.map((eq, idx) => {
            const availCount = eq.total - eq.inUse;
            const pct = Math.round((eq.inUse / eq.total) * 100);
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[#12151C] border border-[#252B38] hover:border-slate-600 transition-colors space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-white">{eq.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{eq.details}</p>
                  </div>
                  <span
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-mono font-bold shrink-0 ${
                      availCount > 0
                        ? 'bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/30'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {eq.status}
                  </span>
                </div>

                {/* Progress bar of station usage */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span>
                      {eq.inUse} of {eq.total} Stations Active
                    </span>
                    <span>{pct}% Load</span>
                  </div>

                  <div className="w-full bg-[#181C24] h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct > 80 ? 'bg-rose-500' : pct > 50 ? 'bg-amber-400' : 'bg-[#D4FF00]'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Historical Peak Training Windows Radar */}
      <div className="bg-[#181C24] border border-[#252B38] rounded-3xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#252B38]">
          <div className="flex items-center gap-2.5">
            <Clock className="w-5 h-5 text-[#D4FF00]" />
            <div>
              <h3 className="text-base font-extrabold text-white">
                PEAK TRAINING WINDOWS & HOURLY CROWD FORECAST
              </h3>
              <p className="text-xs text-slate-400">
                Plan your optimal workout hour for zero equipment waiting times.
              </p>
            </div>
          </div>
          <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
            TODAY'S PROJECTION
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {peakWindows.map((pw, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-[#12151C] border border-[#252B38] space-y-3 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono font-bold text-white">{pw.time}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {pw.density}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-[#E2E8F0]">{pw.label}</h4>

                <div className="mt-2 w-full bg-[#181C24] h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pw.color}`}
                    style={{ width: `${pw.pct}%` }}
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed bg-[#181C24]/60 p-2.5 rounded-xl border border-[#252B38]/40">
                {pw.tip}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
