import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { X, Search, CheckCircle2, LogOut } from 'lucide-react';
import { formatTimeAgo } from '../../utils/dateUtils';

interface QuickCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuickCheckInModal: React.FC<QuickCheckInModalProps> = ({ isOpen, onClose }) => {
  const { members, tiers, attendanceLogs, logVisit } = useGym();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.phone.includes(search)
  );

  // Check if member already has attendance recorded today
  const getMemberTodayAttendance = (memberId: string) => {
    const today = new Date();
    return attendanceLogs.find((log) => {
      if (log.memberId !== memberId) return false;
      const logDate = new Date(log.timestamp);
      return (
        logDate.getDate() === today.getDate() &&
        logDate.getMonth() === today.getMonth() &&
        logDate.getFullYear() === today.getFullYear()
      );
    });
  };

  const handleCheckIn = (memberId: string) => {
    logVisit(memberId, 'Main Gym Floor');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4FF00] flex items-center justify-center text-[#0F1115] shadow-[0_0_15px_rgba(212,255,0,0.2)]">
              <CheckCircle2 className="w-5 h-5 text-[#0F1115]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Mark Member Attendance</h2>
              <p className="text-xs text-slate-400">1-click gym attendance recording for members</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#252B38]">
          <div className="relative">
            <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              autoFocus
              placeholder="Search member by name, ID or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Member List */}
        <div className="max-h-[380px] overflow-y-auto divide-y divide-[#252B38]/60 p-2">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((m) => {
              const tier = tiers.find((t) => t.id === m.tierId);
              const todayLog = getMemberTodayAttendance(m.id);

              return (
                <div
                  key={m.id}
                  className="p-3.5 hover:bg-[#212631] rounded-xl transition-colors flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-[#0F1115] border border-[#252B38] flex items-center justify-center font-bold text-sm text-[#D4FF00] shrink-0">
                      {m.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-white truncate">{m.name}</span>
                        <span className="font-mono-tabular text-xs text-slate-400 shrink-0">{m.id}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {m.age} yrs · {m.gender} · {tier?.name || 'Member'}
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0">
                    {m.isCurrentlyInGym ? (
                      <button
                        onClick={() => logVisit(m.id, 'Main Gym Floor', 'check-out')}
                        className="px-3.5 py-2 bg-rose-950/70 hover:bg-rose-900/90 border border-rose-500/40 text-rose-300 hover:text-white font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                        title="Check out member from gym floor"
                      >
                        <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Check Out</span>
                      </button>
                    ) : todayLog ? (
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 rounded-xl">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <div className="text-left leading-tight">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-emerald-300">Marked Today</span>
                            <span className="text-[10px] text-emerald-400/90 font-mono-tabular">
                              {new Date(todayLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-400/80 block">
                            {formatTimeAgo(todayLog.timestamp)}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCheckIn(m.id)}
                        className="px-3.5 py-2 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-xs rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                        <span>Mark Attendance</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              No members found matching "{search}".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#252B38] flex items-center justify-between text-xs text-slate-400">
          <span>Recent attendance is saved with exact local timestamps</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#0F1115] hover:bg-[#212631] text-white rounded-xl font-medium border border-[#252B38] transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
