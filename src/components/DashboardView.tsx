import React from 'react';
import { useGym } from '../context/GymContext';
import { Member } from '../types/gym';
import {
  Users,
  Dumbbell,
  AlertTriangle,
  Zap,
  ArrowRight,
  RefreshCw,
  CheckCircle2,
  Clock,
  Plus,
  LogOut,
} from 'lucide-react';
import { formatTimeAgo, formatFriendlyCheckIn, getDaysRemaining } from '../utils/dateUtils';

interface DashboardViewProps {
  onNavigateToMembers: () => void;
  onNavigateToAttendance: () => void;
  onNavigateToTrainers: () => void;
  onOpenQuickCheckIn: () => void;
  onRenewMember: (member: Member) => void;
  onSelectMember: (member: Member) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToMembers,
  onNavigateToAttendance,
  onNavigateToTrainers,
  onOpenQuickCheckIn,
  onRenewMember,
  onSelectMember,
}) => {
  const { stats, members, tiers, trainers, activityFeed, logVisit, managerProfile } = useGym();

  // Urgent expiring members (<= 7 days)
  const expiringMembers = members
    .filter((m) => {
      if (m.status !== 'active') return false;
      const days = getDaysRemaining(m.planExpiresAt);
      return days >= 0 && days <= 7;
    })
    .sort((a, b) => new Date(a.planExpiresAt).getTime() - new Date(b.planExpiresAt).getTime());

  // Members currently in the gym (filtered strictly where isCurrentlyInGym === true)
  const membersInGym = members
    .filter((m) => m.isCurrentlyInGym)
    .sort((a, b) => new Date(b.lastVisitAt || 0).getTime() - new Date(a.lastVisitAt || 0).getTime());

  return (
    <div className="space-y-8">
      {/* Friendly Welcome & Header with Quick Attendance Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
            Good day, {managerProfile.name.split(' ')[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Here is your gym's live status today. Everything is running smoothly.
          </p>
        </div>

        {/* Quick Attendance Button at the top in the home page */}
        <button
          onClick={onOpenQuickCheckIn}
          className="px-5 py-3 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.22)] active:scale-95 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
          title="Mark Member Attendance"
        >
          <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
          <span>Quick Attendance</span>
        </button>
      </div>

      {/* 1. THREE GIANT BOLD METRIC NUMBERS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Metric 1: Active Members */}
        <div
          onClick={onNavigateToMembers}
          className="bg-[#181C24] hover:bg-[#212631] rounded-2xl p-7 border border-[#252B38]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Active Members</span>
            <Users className="w-5 h-5 text-[#D4FF00] group-hover:scale-110 transition-transform" />
          </div>

          <div className="my-5">
            <span className="font-mono-tabular text-5xl md:text-6xl font-black text-white tracking-tight">
              {stats.activeMembers}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{stats.totalMembers} total registered</span>
            <span className="text-[#D4FF00] font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Go inside <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Metric 2: Trainers Available Today */}
        <div
          onClick={onNavigateToTrainers}
          className="bg-[#181C24] hover:bg-[#212631] rounded-2xl p-7 border border-[#252B38]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">
              Trainers Available Today
            </span>
            <Dumbbell className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>

          <div className="my-5">
            <span className="font-mono-tabular text-5xl md:text-6xl font-black text-emerald-400 tracking-tight">
              {stats.trainersOnDuty}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Ready on gym floor</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Go inside <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>

        {/* Metric 3: Plans Expiring Soon */}
        <div
          onClick={onNavigateToMembers}
          className="bg-[#181C24] hover:bg-[#212631] rounded-2xl p-7 border border-[#252B38]/60 transition-all cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-300">Plans Expiring Soon</span>
            <AlertTriangle
              className={`w-5 h-5 ${
                stats.urgentExpirations > 0 ? 'text-amber-400' : 'text-slate-500'
              } group-hover:scale-110 transition-transform`}
            />
          </div>

          <div className="my-5">
            <span
              className={`font-mono-tabular text-5xl md:text-6xl font-black tracking-tight ${
                stats.urgentExpirations > 0 ? 'text-amber-400' : 'text-white'
              }`}
            >
              {stats.urgentExpirations}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Expiring within 7 days</span>
            <span className="text-amber-400 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              Go inside <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      </div>

      {/* 2. WHO'S IN THE GYM RIGHT NOW (Horizontal Profile Chips) */}
      <div className="bg-[#181C24] rounded-2xl p-6 border border-[#252B38]/60 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">
              Who's in the Gym Right Now
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Recent attendance and members active on the gym floor
            </p>
          </div>
          <button
            onClick={onNavigateToAttendance}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>See attendance log</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Profile Chips */}
        {membersInGym.length > 0 ? (
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
            {membersInGym.map((m) => {
              const tier = tiers.find((t) => t.id === m.tierId);
              return (
                <div
                  key={m.id}
                  onClick={() => onSelectMember(m)}
                  className="px-4 py-3 bg-[#0F1115] hover:bg-[#212631] border border-[#252B38] hover:border-[#D4FF00]/50 rounded-xl flex items-center gap-3 shrink-0 cursor-pointer transition-all group"
                >
                  <div className="w-9 h-9 rounded-full bg-[#181C24] border border-[#252B38] flex items-center justify-center font-bold text-sm text-[#D4FF00]">
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-white leading-tight group-hover:text-[#D4FF00] transition-colors">
                      {m.name}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {m.lastVisitAt ? formatTimeAgo(m.lastVisitAt) : 'Active'} · {tier?.name || 'Member'}
                    </p>
                  </div>

                  {/* 1-Click Check Out Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      logVisit(m.id, undefined, 'check-out');
                    }}
                    className="ml-2 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 hover:text-white border border-rose-500/40 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                    title={`Check out ${m.name} from gym`}
                  >
                    <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span className="text-[11px]">Check Out</span>
                  </button>
                </div>
              );
            })}

            {/* Quick attendance chip */}
            <button
              onClick={onOpenQuickCheckIn}
              className="px-4 py-3 border border-dashed border-[#252B38] hover:border-[#D4FF00] hover:bg-[#212631] rounded-xl flex items-center gap-2 text-slate-400 hover:text-white text-xs font-semibold shrink-0 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
              <span>Mark Attendance</span>
            </button>
          </div>
        ) : (
          <div className="py-6 text-center text-slate-400 text-xs">
            No members are currently checked into the gym floor right now. Click "Mark Attendance" above to log a check-in!
          </div>
        )}
      </div>

      {/* 3. SIMPLIFIED TWO-COLUMN SECTION: Plans Expiring & Live Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Plans Expiring Soon */}
        <div className="bg-[#181C24] rounded-2xl p-6 border border-[#252B38]/60 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Plans Expiring Soon</h3>
              <span className="text-xs font-mono-tabular text-amber-400 font-semibold">
                {expiringMembers.length} to review
              </span>
            </div>

            {expiringMembers.length > 0 ? (
              <div className="space-y-3">
                {expiringMembers.map((m) => {
                  const daysLeft = getDaysRemaining(m.planExpiresAt);
                  const tier = tiers.find((t) => t.id === m.tierId);

                  return (
                    <div
                      key={m.id}
                      className="p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38] flex items-center justify-between gap-3"
                    >
                      <div
                        className="cursor-pointer min-w-0"
                        onClick={() => onSelectMember(m)}
                      >
                        <p className="font-semibold text-sm text-white truncate hover:text-[#D4FF00] transition-colors">
                          {m.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {tier?.name} ·{' '}
                          <span className="text-amber-400 font-medium">
                            {daysLeft === 0 ? 'Expires today' : `Expires in ${daysLeft} days`}
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={() => onRenewMember(m)}
                        className="px-3.5 py-1.5 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-xs rounded-lg transition-all shrink-0 flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Renew</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-80" />
                <p className="font-semibold text-white">All subscriptions are up to date!</p>
                <p className="text-slate-400 mt-1">No plans expiring in the next 7 days.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Live Activity Stream */}
        <div className="bg-[#181C24] rounded-2xl p-6 border border-[#252B38]/60 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">Live Activity</h3>
            <span className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-[#D4FF00] animate-pulse" />
              Real-time
            </span>
          </div>

          <div className="space-y-3">
            {activityFeed.slice(0, 5).map((act) => (
              <div
                key={act.id}
                className="p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38]/50 flex items-start gap-3"
              >
                <div className="w-2 h-2 rounded-full bg-[#D4FF00] mt-1.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-white truncate">{act.title}</p>
                    <span className="text-[11px] font-mono-tabular text-slate-400 shrink-0">
                      {formatTimeAgo(act.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
