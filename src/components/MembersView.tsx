import React, { useState, useMemo } from 'react';
import { useGym } from '../context/GymContext';
import { Member } from '../types/gym';
import {
  Search,
  Plus,
  Zap,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Edit2,
  Trash2,
  Repeat,
  Mail,
  Phone,
  User,
  Clock,
  Calendar,
  AlertTriangle,
  Pause,
  Play,
  LogOut,
} from 'lucide-react';
import {
  formatFullTimestamp,
  formatFriendlyCheckIn,
  formatTimeAgo,
  getDaysRemaining,
} from '../utils/dateUtils';
import { ConfirmDeleteModal } from './Modals/ConfirmDeleteModal';

interface MembersViewProps {
  onOpenAddMember: () => void;
  onEditMember: (member: Member) => void;
  onRenewMember: (member: Member) => void;
  onSwitchTier: (member: Member) => void;
}

export const MembersView: React.FC<MembersViewProps> = ({
  onOpenAddMember,
  onEditMember,
  onRenewMember,
  onSwitchTier,
}) => {
  const { members, tiers, trainers, attendanceLogs, logVisit, deleteMember, toggleMemberStatus } = useGym();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | Member['status']>('all');
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(null);

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

  // Filter members
  const filteredMembers = useMemo(() => {
    return members.filter((m) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.includes(search);

      const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [members, search, statusFilter]);

  const [memberToDelete, setMemberToDelete] = useState<{ id: string; name: string } | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedMemberId((prev) => (prev === id ? null : id));
  };

  const handleDelete = (id: string, name: string) => {
    setMemberToDelete({ id, name });
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
            Members
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Streamlined directory with instant 1-click check-in and quick profile view.
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="px-5 py-3 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(212,255,0,0.2)] active:scale-95 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Member</span>
        </button>
      </div>

      {/* Clean Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-3 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, ID or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181C24] border border-[#252B38] focus:border-[#D4FF00] rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>

        {/* Clean Status Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#181C24] rounded-xl border border-[#252B38]/60">
          {(['all', 'active', 'expired', 'paused'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-[#0F1115] text-[#D4FF00] shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* STREAMLINED 3-COLUMN RECORDS LIST */}
      <div className="bg-[#181C24] rounded-2xl border border-[#252B38]/60 overflow-hidden shadow-sm">
        {/* Table Header: 3 Columns (Responsive for phones and laptops) */}
        <div className="grid grid-cols-12 px-4 sm:px-6 py-3.5 sm:py-4 border-b border-[#252B38] text-xs font-bold text-slate-400 uppercase tracking-wider">
          <div className="col-span-6 sm:col-span-5 md:col-span-4">Member</div>
          <div className="col-span-4 sm:col-span-4 md:col-span-4">Status & Plan</div>
          <div className="hidden sm:block sm:col-span-3 md:col-span-3">Registration Date</div>
          <div className="col-span-2 sm:col-span-1 text-right">Action</div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-[#252B38]/60">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member) => {
              const tier = tiers.find((t) => t.id === member.tierId);
              const trainer = trainers.find((t) => t.id === member.trainerId);
              const isExpanded = expandedMemberId === member.id;
              const daysLeft = getDaysRemaining(member.planExpiresAt);
              const todayLog = getMemberTodayLog(member.id);

              return (
                <div key={member.id} className="transition-colors hover:bg-[#1E232E]/40">
                  {/* Primary 3-Column Bar */}
                  <div
                    onClick={() => toggleExpand(member.id)}
                    className="grid grid-cols-12 px-4 sm:px-6 py-3.5 sm:py-4 items-center cursor-pointer select-none gap-2"
                  >
                    {/* Column 1: Member Name & ID Badge + Age/Gender */}
                    <div className="col-span-6 sm:col-span-5 md:col-span-4 flex items-center gap-2.5 sm:gap-3 min-w-0">
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#0F1115] border border-[#252B38] flex items-center justify-center font-bold text-xs sm:text-sm text-[#D4FF00] shrink-0">
                        {member.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-xs sm:text-sm text-white truncate hover:text-[#D4FF00] transition-colors">
                          {member.name}
                        </p>
                        <span className="font-mono-tabular text-[10px] sm:text-xs text-slate-400">
                          {member.id} · {member.age} yrs, {member.gender}
                        </span>
                      </div>
                    </div>

                    {/* Column 2: Status & Plan (e.g., "Active — VIP Elite" on one clean line) */}
                    <div className="col-span-4 sm:col-span-4 md:col-span-4 flex items-center gap-1.5 sm:gap-2 min-w-0">
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${
                          member.status === 'active'
                            ? 'bg-[#D4FF00]'
                            : member.status === 'expired'
                            ? 'bg-rose-400'
                            : 'bg-amber-400'
                        }`}
                      />
                      <span className="text-xs sm:text-sm font-medium text-slate-200 truncate">
                        <strong className="capitalize text-white">{member.status}</strong> —{' '}
                        {tier?.name || 'Standard'}
                      </span>
                    </div>

                    {/* Column 3: Exact Registration Date & Time (Captured automatically, visible on sm+) */}
                    <div className="hidden sm:block sm:col-span-3 md:col-span-3">
                      <p className="text-xs font-mono-tabular text-slate-300">
                        {formatFullTimestamp(member.joinedAt)}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {formatTimeAgo(member.joinedAt)}
                      </p>
                    </div>

                    {/* Column 4: 1-Click Fast Attendance / Check-Out & Expand Toggle */}
                    <div className="col-span-2 sm:col-span-1 flex items-center justify-end gap-1 sm:gap-1.5">
                      {member.isCurrentlyInGym ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            logVisit(member.id, undefined, 'check-out');
                          }}
                          className="px-2 py-1.5 sm:px-2.5 sm:py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 hover:text-white text-xs font-bold rounded-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1 shrink-0"
                          title="Check Out from Gym"
                        >
                          <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span className="hidden xl:inline text-[11px]">Check Out</span>
                        </button>
                      ) : todayLog ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            logVisit(member.id, undefined, 'check-in');
                          }}
                          className="px-2 py-1.5 bg-emerald-950/70 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-300 rounded-lg flex items-center gap-1 text-[11px] font-bold cursor-pointer"
                          title={`Marked today at ${new Date(todayLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Click to check in again.`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="hidden xl:inline text-[10px] font-mono-tabular">
                            {new Date(todayLog.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </button>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            logVisit(member.id, undefined, 'check-in');
                          }}
                          className="p-1.5 sm:p-2 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
                          title="Mark Attendance (Check In)"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(member.id);
                        }}
                        className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-lg hover:bg-[#252B38] transition-colors cursor-pointer"
                        title="View details"
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* COLLAPSIBLE EXTENDED ATTRIBUTES BLOCK */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-[#12151C] border-t border-[#252B38]/50 space-y-4 animate-in fade-in duration-150">
                      {/* Grid of Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-[#181C24] rounded-xl border border-[#252B38]/50">
                        {/* Demographics */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Demographics
                          </span>
                          <p className="text-xs font-semibold text-white mt-1">
                            {member.age} Years Old
                          </p>
                          <p className="text-[11px] text-[#D4FF00] font-medium">
                            Gender: {member.gender}
                          </p>
                        </div>

                        {/* Contact */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Contact
                          </span>
                          <p className="text-xs text-white mt-1 flex items-center gap-1.5 truncate">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.email}</span>
                          </p>
                          <p className="text-xs font-mono-tabular text-slate-300 mt-1 flex items-center gap-1.5">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{member.phone}</span>
                          </p>
                        </div>

                        {/* Coach */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Assigned Coach
                          </span>
                          <p className="text-xs font-medium text-white mt-1">
                            {trainer ? `${trainer.name}` : 'Self-Directed'}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {trainer ? trainer.specialization : 'No dedicated trainer'}
                          </p>
                        </div>

                        {/* Last Visit */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Last Visit
                          </span>
                          <p className="text-xs text-[#D4FF00] font-medium mt-1">
                            {formatFriendlyCheckIn(member.lastVisitAt)}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {member.lastVisitAt ? formatTimeAgo(member.lastVisitAt) : 'No visits'}
                          </p>
                        </div>

                        {/* Plan Expiration */}
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                            Plan Expiration
                          </span>
                          <p className="text-xs font-mono-tabular text-white mt-1">
                            {formatFullTimestamp(member.planExpiresAt)}
                          </p>
                          <p
                            className={`text-[11px] font-medium ${
                              daysLeft <= 0
                                ? 'text-rose-400'
                                : daysLeft <= 7
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {daysLeft < 0
                              ? `Expired ${Math.abs(daysLeft)}d ago`
                              : `${daysLeft} days remaining`}
                          </p>
                        </div>
                      </div>

                      {/* Notes / Emergency if present */}
                      {(member.emergencyContact || member.notes) && (
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                          {member.emergencyContact && (
                            <div>
                              <strong className="text-slate-300">Emergency: </strong>
                              {member.emergencyContact}
                            </div>
                          )}
                          {member.notes && (
                            <div>
                              <strong className="text-slate-300">Notes: </strong>
                              {member.notes}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Action Buttons Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Live Presence Check-In / Check-Out Action */}
                          {member.isCurrentlyInGym ? (
                            <button
                              onClick={() => logVisit(member.id, undefined, 'check-out')}
                              className="px-4 py-2 bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/50 text-rose-300 hover:text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              <span>Check Out</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => logVisit(member.id, undefined, 'check-in')}
                              className="px-4 py-2 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Check In</span>
                            </button>
                          )}

                          <button
                            onClick={() => onRenewMember(member)}
                            className="px-4 py-2 bg-[#181C24] hover:bg-[#252B38] border border-[#252B38] text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5 text-[#D4FF00]" />
                            <span>Renew Plan</span>
                          </button>

                          <button
                            onClick={() => onSwitchTier(member)}
                            className="px-4 py-2 bg-[#181C24] hover:bg-[#252B38] border border-[#252B38] text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Repeat className="w-3.5 h-3.5 text-[#D4FF00]" />
                            <span>Switch Plan</span>
                          </button>

                          <button
                            onClick={() => onEditMember(member)}
                            className="px-4 py-2 bg-[#181C24] hover:bg-[#252B38] border border-[#252B38] text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                            <span>Edit Details</span>
                          </button>

                          <button
                            onClick={() => toggleMemberStatus(member.id)}
                            className="px-4 py-2 bg-[#181C24] hover:bg-[#252B38] border border-[#252B38] text-slate-300 hover:text-white text-xs font-medium rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                          >
                            {member.status === 'active' ? (
                              <>
                                <Pause className="w-3.5 h-3.5 text-amber-400" />
                                <span>Pause Membership</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 text-emerald-400" />
                                <span>Resume Membership</span>
                              </>
                            )}
                          </button>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(member.id, member.name);
                          }}
                          className="px-3.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Member</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-slate-400 text-sm">
              No members found matching "{search}".
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3.5 bg-[#12151C] border-t border-[#252B38] flex items-center justify-between text-xs text-slate-400">
          <span>
            Total Members: <strong className="text-white">{members.length}</strong> (
            {members.filter((m) => m.status === 'active').length} Active)
          </span>
          <span>Click any member row to expand full details</span>
        </div>
      </div>

      {/* Delete Confirmation Modal (Zero window.confirm, 100% iframe and mobile safe) */}
      <ConfirmDeleteModal
        isOpen={!!memberToDelete}
        onClose={() => setMemberToDelete(null)}
        onConfirm={() => {
          if (memberToDelete) {
            deleteMember(memberToDelete.id);
            if (expandedMemberId === memberToDelete.id) {
              setExpandedMemberId(null);
            }
            setMemberToDelete(null);
          }
        }}
        title="Delete Member Record"
        description="Are you sure you want to permanently delete this member from the database?"
        itemName={memberToDelete?.name}
        itemId={memberToDelete?.id}
        confirmLabel="Yes, Delete Member"
      />
    </div>
  );
};
