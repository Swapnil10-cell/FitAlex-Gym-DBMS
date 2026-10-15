import React, { useState } from 'react';
import { Member } from '../../types/gym';
import { useGym } from '../../context/GymContext';
import {
  X,
  Mail,
  Phone,
  Zap,
  RefreshCw,
  Repeat,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  LogOut,
} from 'lucide-react';
import {
  formatFullTimestamp,
  formatFriendlyCheckIn,
  formatTimeAgo,
  getDaysRemaining,
} from '../../utils/dateUtils';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';

interface MemberDetailModalProps {
  member: Member | null;
  onClose: () => void;
  onEdit: (member: Member) => void;
  onRenew: (member: Member) => void;
  onSwitchTier: (member: Member) => void;
}

export const MemberDetailModal: React.FC<MemberDetailModalProps> = ({
  member,
  onClose,
  onEdit,
  onRenew,
  onSwitchTier,
}) => {
  const { tiers, trainers, logVisit, deleteMember } = useGym();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!member) return null;

  const tier = tiers.find((t) => t.id === member.tierId);
  const trainer = trainers.find((t) => t.id === member.trainerId);
  const daysLeft = getDaysRemaining(member.planExpiresAt);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-full bg-[#0F1115] border border-[#252B38] flex items-center justify-center font-bold text-base text-[#D4FF00]">
              {member.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">{member.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="font-mono-tabular text-xs text-slate-400">{member.id}</span>
                <span className="text-slate-400 text-xs">·</span>
                <span
                  className={`text-xs font-semibold capitalize ${
                    member.status === 'active'
                      ? 'text-[#D4FF00]'
                      : member.status === 'expired'
                      ? 'text-rose-400'
                      : 'text-amber-400'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-3">
            {member.isCurrentlyInGym ? (
              <button
                onClick={() => {
                  logVisit(member.id, undefined, 'check-out');
                  onClose();
                }}
                className="p-3 bg-rose-950/70 hover:bg-rose-900/90 border border-rose-500/50 text-rose-300 hover:text-white rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <LogOut className="w-4 h-4 stroke-[2.5]" />
                <span>Check Out Now</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  logVisit(member.id, undefined, 'check-in');
                  onClose();
                }}
                className="p-3 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-[#0F1115]" />
                <span>Log Visit Now</span>
              </button>
            )}

            <button
              onClick={() => {
                onRenew(member);
                onClose();
              }}
              className="p-3 bg-[#0F1115] hover:bg-[#212631] border border-[#252B38] text-white rounded-xl font-medium text-xs flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-[#D4FF00]" />
              <span>Renew Plan</span>
            </button>

            <button
              onClick={() => {
                onSwitchTier(member);
                onClose();
              }}
              className="p-3 bg-[#0F1115] hover:bg-[#212631] border border-[#252B38] text-white rounded-xl font-medium text-xs flex flex-col items-center justify-center gap-1 transition-colors"
            >
              <Repeat className="w-4 h-4 text-slate-300" />
              <span>Switch Plan</span>
            </button>
          </div>

          {/* Membership Info */}
          <div className="p-4 bg-[#0F1115] border border-[#252B38] rounded-xl space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Membership Tier:</span>
              <span className="font-semibold text-white">{tier?.name} (${tier?.monthlyPrice}/mo)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Plan Expiration:</span>
              <span className="font-mono-tabular text-slate-200">{formatFullTimestamp(member.planExpiresAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Remaining Term:</span>
              <span className={`font-semibold ${daysLeft <= 0 ? 'text-rose-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-slate-200'}`}>
                {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)}d ago` : `${daysLeft} days`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Demographics:</span>
              <span className="font-semibold text-white">{member.age} yrs · {member.gender}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Personal Trainer:</span>
              <span className="text-white font-medium">{trainer ? trainer.name : 'None assigned'}</span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-[#0F1115] border border-[#252B38] rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{member.email}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300 font-mono-tabular">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{member.phone}</span>
            </div>
            {member.emergencyContact && (
              <div className="text-slate-400 pt-1 border-t border-[#252B38]/60">
                Emergency: <span className="text-white">{member.emergencyContact}</span>
              </div>
            )}
          </div>

          {/* Timestamps */}
          <div className="p-4 bg-[#0F1115] border border-[#252B38] rounded-xl space-y-1.5 text-xs text-slate-400">
            <div className="flex items-center justify-between">
              <span>Joined Gym:</span>
              <span className="text-slate-200 font-mono-tabular">{formatFullTimestamp(member.joinedAt)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Last Check-In:</span>
              <span className="text-[#D4FF00] font-medium">{formatFriendlyCheckIn(member.lastVisitAt)}</span>
            </div>
          </div>

          {member.notes && (
            <div className="p-3.5 bg-[#0F1115] border border-[#252B38] rounded-xl text-xs">
              <span className="text-slate-400 block mb-1">Notes:</span>
              <p className="text-slate-300 italic">{member.notes}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#252B38] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(member);
                onClose();
              }}
              className="px-4 py-2 bg-[#0F1115] hover:bg-[#212631] border border-[#252B38] text-xs font-semibold text-white rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-3.5 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-xl text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Delete member record"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteMember(member.id);
          setShowDeleteConfirm(false);
          onClose();
        }}
        title="Delete Member Record"
        description="Are you sure you want to permanently delete this member from the database?"
        itemName={member.name}
        itemId={member.id}
        confirmLabel="Yes, Delete Member"
      />
    </div>
  );
};
