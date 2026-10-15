import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types/gym';
import { X, RefreshCw, Check } from 'lucide-react';
import { formatFullTimestamp, extendExpirationDate } from '../../utils/dateUtils';

interface RenewModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export const RenewModal: React.FC<RenewModalProps> = ({ isOpen, onClose, member }) => {
  const { tiers, renewPlan } = useGym();
  const [selectedDays, setSelectedDays] = useState<number>(30);

  if (!isOpen || !member) return null;

  const currentTier = tiers.find((t) => t.id === member.tierId);
  const projectedExpiration = extendExpirationDate(member.planExpiresAt, selectedDays);

  const durationOptions = [
    { days: 30, label: '+30 Days', desc: '1 Month' },
    { days: 90, label: '+90 Days', desc: '3 Months' },
    { days: 365, label: '+1 Year', desc: '12 Months' },
  ];

  const handleRenew = () => {
    renewPlan(member.id, selectedDays);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4FF00] flex items-center justify-center text-[#0F1115]">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Renew Membership</h2>
              <p className="text-xs text-slate-400">{member.name} ({member.id})</p>
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
        <div className="p-6 space-y-5">
          {/* Current Expiration */}
          <div className="p-4 bg-[#0F1115] border border-[#252B38] rounded-xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Plan:</span>
              <span className="font-semibold text-white">{currentTier?.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Current Expiration:</span>
              <span className="font-mono-tabular text-slate-300">{formatFullTimestamp(member.planExpiresAt)}</span>
            </div>
          </div>

          {/* Select Term */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Choose Renewal Period
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {durationOptions.map((opt) => (
                <button
                  key={opt.days}
                  type="button"
                  onClick={() => setSelectedDays(opt.days)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedDays === opt.days
                      ? 'bg-[#D4FF00] text-[#0F1115] border-[#D4FF00] font-bold shadow-sm'
                      : 'bg-[#0F1115] border-[#252B38] text-slate-300 hover:text-white hover:border-slate-500'
                  }`}
                >
                  <p className="text-sm font-bold">{opt.label}</p>
                  <p className={`text-[11px] mt-0.5 ${selectedDays === opt.days ? 'text-[#0F1115]/80 font-medium' : 'text-slate-400'}`}>
                    {opt.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* New Expiration Preview */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs space-y-1">
            <span className="text-emerald-300 font-semibold block">New Expiration Date</span>
            <p className="font-mono-tabular text-sm text-white font-medium">
              {formatFullTimestamp(projectedExpiration)}
            </p>
            <p className="text-[11px] text-slate-400">
              Account status will be set to Active automatically.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleRenew}
              className="px-5 py-2.5 text-xs font-bold text-[#0F1115] bg-[#D4FF00] hover:bg-[#BFEC00] rounded-xl shadow-md transition-all active:scale-95 flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Confirm Renewal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
