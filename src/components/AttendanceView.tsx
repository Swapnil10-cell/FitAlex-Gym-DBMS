import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { AttendanceLog, Member } from '../types/gym';
import {
  Clock,
  Zap,
  Search,
  CheckCircle2,
  Calendar,
  Users,
  LogOut,
} from 'lucide-react';
import { formatFullTimestamp, formatFriendlyCheckIn, formatTimeAgo } from '../utils/dateUtils';

interface AttendanceViewProps {
  onSelectMember: (member: Member) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({ onSelectMember }) => {
  const { attendanceLogs, members, tiers, logVisit } = useGym();

  const [search, setSearch] = useState('');
  const [quickMemberId, setQuickMemberId] = useState('');
  const [quickZone, setQuickZone] = useState<AttendanceLog['zone']>('Main Gym Floor');
  const [quickAction, setQuickAction] = useState<'auto' | 'check-in' | 'check-out'>('auto');

  const filteredLogs = attendanceLogs.filter((log) => {
    return (
      !search ||
      log.memberName.toLowerCase().includes(search.toLowerCase()) ||
      log.memberId.toLowerCase().includes(search.toLowerCase())
    );
  });

  const selectedMember = members.find((m) => m.id === quickMemberId);

  const handleConsoleCheckIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMemberId) return;
    const type = quickAction === 'auto' ? undefined : quickAction;
    logVisit(quickMemberId, quickZone, type);
    setQuickMemberId('');
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
            Daily Attendance
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time gym attendance and check-out records captured with local system timestamps.
          </p>
        </div>

        <div className="px-4 py-2 bg-[#181C24] rounded-xl border border-[#252B38] text-xs font-semibold text-slate-300 flex items-center gap-2">
          <span>Total Logs:</span>
          <strong className="text-[#D4FF00] font-mono-tabular">{attendanceLogs.length}</strong>
        </div>
      </div>

      {/* Quick Attendance / Check-Out Bar */}
      <div className="bg-[#181C24] rounded-2xl p-6 border border-[#252B38]/60 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Record Member Attendance / Departure</h3>
          {selectedMember && (
            <span
              className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                selectedMember.isCurrentlyInGym
                  ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                  : 'bg-slate-800 text-slate-400 border border-[#252B38]'
              }`}
            >
              Current Status: {selectedMember.isCurrentlyInGym ? 'Inside Gym' : 'Outside Gym'}
            </span>
          )}
        </div>

        <form onSubmit={handleConsoleCheckIn} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <select
              value={quickMemberId}
              onChange={(e) => setQuickMemberId(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="">-- Select Member to Record Attendance / Departure --</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.id}) {m.isCurrentlyInGym ? '• [CURRENTLY IN GYM]' : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:w-36">
            <select
              value={quickAction}
              onChange={(e) => setQuickAction(e.target.value as 'auto' | 'check-in' | 'check-out')}
              className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none"
            >
              <option value="auto">Auto Detect</option>
              <option value="check-in">Check In</option>
              <option value="check-out">Check Out</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!quickMemberId}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95 shrink-0 ${
              !quickMemberId
                ? 'bg-[#252B38] text-slate-500 cursor-not-allowed'
                : selectedMember?.isCurrentlyInGym && quickAction !== 'check-in'
                ? 'bg-rose-600 hover:bg-rose-500 text-white cursor-pointer'
                : 'bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] cursor-pointer'
            }`}
          >
            {selectedMember?.isCurrentlyInGym && quickAction !== 'check-in' ? (
              <>
                <LogOut className="w-4 h-4 stroke-[2.5]" />
                <span>Log Check-Out</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                <span>Log Check-In</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Attendance History List */}
      <div className="bg-[#181C24] rounded-2xl border border-[#252B38]/60 overflow-hidden shadow-sm">
        {/* Search */}
        <div className="p-4 border-b border-[#252B38]">
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search attendance by member name or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl pl-11 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Clean Visits Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#12151C] border-b border-[#252B38] text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-3.5 sm:px-6">Member</th>
                <th className="py-3.5 px-3.5 sm:px-6">Event</th>
                <th className="py-3.5 px-3.5 sm:px-6">Plan</th>
                <th className="py-3.5 px-3.5 sm:px-6">Timestamp</th>
                <th className="py-3.5 px-3.5 sm:px-6 text-right">Elapsed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#252B38]/60">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => {
                  const member = members.find((m) => m.id === log.memberId);
                  const isCheckOut = log.type === 'check-out';

                  return (
                    <tr key={log.id} className="hover:bg-[#1E232E]/40 transition-colors">
                      <td className="py-3.5 px-3.5 sm:px-6">
                        <div
                          className="cursor-pointer group flex items-center gap-2.5"
                          onClick={() => member && onSelectMember(member)}
                        >
                          <span className="font-semibold text-xs sm:text-sm text-white group-hover:text-[#D4FF00] transition-colors">
                            {log.memberName}
                          </span>
                          <span className="font-mono-tabular text-slate-400 text-[10px] sm:text-xs">
                            {log.memberId}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3.5 sm:px-6">
                        {isCheckOut ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950/70 text-rose-300 border border-rose-500/40 font-mono-tabular">
                            <LogOut className="w-3 h-3 stroke-[2.5]" />
                            <span>Check-Out</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 font-mono-tabular">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Check-In</span>
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-3.5 sm:px-6 text-slate-300 font-medium text-xs">
                        {log.tierName}
                      </td>

                      <td className="py-3.5 px-3.5 sm:px-6 font-mono-tabular text-slate-200 text-xs">
                        {formatFriendlyCheckIn(log.timestamp)}
                      </td>

                      <td className="py-3.5 px-3.5 sm:px-6 text-right text-[#D4FF00] font-semibold font-mono-tabular text-xs">
                        {formatTimeAgo(log.timestamp)}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
