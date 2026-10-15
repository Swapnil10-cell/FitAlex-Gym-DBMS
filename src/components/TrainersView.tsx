import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { Trainer, Member } from '../types/gym';
import {
  Users,
  Plus,
  Edit2,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle2,
  LogOut,
} from 'lucide-react';

interface TrainersViewProps {
  onOpenAddTrainer: () => void;
  onEditTrainer: (trainer: Trainer) => void;
  onSelectMember: (member: Member) => void;
}

export const TrainersView: React.FC<TrainersViewProps> = ({
  onOpenAddTrainer,
  onEditTrainer,
  onSelectMember,
}) => {
  const { trainers, members, attendanceLogs, toggleTrainerDuty, getTrainerClientCount, logVisit } = useGym();
  // Allow expanding trainer cards inline to immediately see assigned members
  const [expandedTrainerId, setExpandedTrainerId] = useState<string | null>(trainers[0]?.id || null);

  const getMemberTodayLog = (memberId: string) => {
    const today = new Date();
    return attendanceLogs.find((log) => {
      if (log.memberId !== memberId) return false;
      const d = new Date(log.timestamp);
      return (
        d.getDate() === today.getDate() &&
        d.getMonth() === today.getMonth() &&
        d.getFullYear() === today.getFullYear()
      );
    });
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
            Trainers & Coaches
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Floor coach availability, demographics, and assigned gym members.
          </p>
        </div>

        <button
          onClick={onOpenAddTrainer}
          className="px-5 py-3 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.2)] active:scale-95 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Add Trainer</span>
        </button>
      </div>

      {/* Trainer Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        {trainers.map((trainer) => {
          const clientCount = getTrainerClientCount(trainer.id);
          const isExpanded = expandedTrainerId === trainer.id;
          const assignedMembers = members.filter((m) => m.trainerId === trainer.id);

          return (
            <div
              key={trainer.id}
              className={`bg-[#181C24] rounded-2xl p-6 border transition-all flex flex-col justify-between shadow-sm relative ${
                isExpanded
                  ? 'border-[#D4FF00] shadow-[0_0_25px_rgba(212,255,0,0.12)]'
                  : 'border-[#252B38]/60 hover:border-slate-500'
              }`}
            >
              <div>
                {/* Top Section: Photo, Name, Demographics & Duty Toggle */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="relative">
                      <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-full object-cover border-2 border-[#252B38]"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-[#181C24] ${
                          trainer.isOnDuty ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'
                        }`}
                        title={trainer.isOnDuty ? 'On Duty' : 'Off Duty'}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold text-base text-white">{trainer.name}</h3>
                      <p className="text-xs text-[#D4FF00] font-medium mt-0.5">
                        {trainer.specialization} · {trainer.age} yrs, {trainer.gender}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => onEditTrainer(trainer)}
                    className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
                    title="Edit Trainer Details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Duty Toggle Button (Floor Status) */}
                <div className="mt-5 p-3.5 bg-[#0F1115] rounded-xl border border-[#252B38] flex items-center justify-between">
                  <div className="text-xs">
                    <span className="text-slate-400 block text-[11px]">Floor Status</span>
                    <span
                      className={`font-semibold ${
                        trainer.isOnDuty ? 'text-emerald-400' : 'text-slate-400'
                      }`}
                    >
                      {trainer.isOnDuty ? 'Available on floor' : 'Clocked out'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {trainer.isOnDuty ? (
                      <button
                        onClick={() => toggleTrainerDuty(trainer.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer bg-rose-950/60 text-rose-300 border border-rose-500/40 hover:bg-rose-900/80 hover:text-white flex items-center gap-1.5"
                        title="Clock out / Check out from duty"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Check Out</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => toggleTrainerDuty(trainer.id)}
                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 flex items-center gap-1.5"
                        title="Clock in / Check in to duty"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Check In</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-300 mt-4 leading-relaxed line-clamp-2">
                  {trainer.bio}
                </p>

                {/* Shift Hours */}
                <div className="mt-4 pt-3 border-t border-[#252B38]/50 text-xs text-slate-400 flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span>Shift: {trainer.shiftHours}</span>
                </div>
              </div>

              {/* Card Footer: Active Members Count & Inline Accordion Toggle */}
              <div className="mt-5 pt-3 border-t border-[#252B38]/50 flex items-center justify-between gap-2">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 min-w-0 truncate">
                  <Users className="w-3.5 h-3.5 text-[#D4FF00] shrink-0" />
                  <strong className="text-white font-mono-tabular">{clientCount}</strong> Members
                </span>

                <button
                  onClick={() => setExpandedTrainerId(isExpanded ? null : trainer.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                    isExpanded
                      ? 'bg-[#D4FF00] text-[#0F1115] font-bold shadow-sm'
                      : 'bg-[#0F1115] text-[#D4FF00] hover:bg-[#212631] border border-[#252B38]'
                  }`}
                  title={isExpanded ? 'Hide members list' : 'View members trained by this coach'}
                >
                  <span>{isExpanded ? 'Hide Members' : `View Members (${clientCount})`}</span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* INLINE ASSIGNED MEMBERS LIST */}
              {isExpanded && (
                <div className="mt-4 pt-3 border-t border-[#252B38] space-y-2.5 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
                      Assigned Members ({assignedMembers.length})
                    </span>
                    <span className="text-[10px] text-slate-400">Click to view profile</span>
                  </div>

                  {assignedMembers.length > 0 ? (
                    <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                      {assignedMembers.map((client) => {
                        const clientTodayLog = getMemberTodayLog(client.id);

                        return (
                          <div
                            key={client.id}
                            className="p-2.5 bg-[#0F1115] border border-[#252B38] hover:border-[#D4FF00]/40 rounded-xl transition-all flex items-center justify-between gap-2.5 group"
                          >
                            <div
                              onClick={() => onSelectMember(client)}
                              className="cursor-pointer min-w-0 flex items-center gap-2 flex-1"
                              title="Click to view member details"
                            >
                              <div className="w-7 h-7 rounded-full bg-[#181C24] border border-[#252B38] flex items-center justify-center font-bold text-xs text-[#D4FF00] shrink-0">
                                {client.name.charAt(0)}
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-xs text-white truncate group-hover:text-[#D4FF00] transition-colors">
                                  {client.name}
                                </p>
                                <p className="text-[10px] text-slate-400 font-mono-tabular">
                                  {client.id} · {client.age}y, {client.gender}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className={`text-[9px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                                  client.status === 'active'
                                    ? 'bg-emerald-950/60 text-emerald-300'
                                    : 'bg-amber-950/60 text-amber-300'
                                }`}
                              >
                                {client.status}
                              </span>

                              {client.isCurrentlyInGym ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    logVisit(client.id, undefined, 'check-out');
                                  }}
                                  className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 text-rose-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                                  title="Check Out from Gym"
                                >
                                  <LogOut className="w-3 h-3 stroke-[2.5]" />
                                  <span>Check Out</span>
                                </button>
                              ) : clientTodayLog ? (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    logVisit(client.id, undefined, 'check-in');
                                  }}
                                  className="px-2 py-1 bg-emerald-950/80 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-300 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                                  title={`Marked today at ${new Date(clientTodayLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Click to check in again.`}
                                >
                                  <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                                  <span className="font-mono-tabular">
                                    {new Date(clientTodayLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </button>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    logVisit(client.id, undefined, 'check-in');
                                  }}
                                  className="p-1.5 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] rounded-lg transition-transform active:scale-95 cursor-pointer"
                                  title="Check In (Mark Attendance)"
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400 bg-[#0F1115] rounded-xl border border-dashed border-[#252B38]">
                      No members are currently assigned to {trainer.name}.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
