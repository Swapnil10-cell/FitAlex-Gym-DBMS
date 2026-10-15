import React, { useState } from 'react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types/gym';
import { X, ArrowRight, Check } from 'lucide-react';
import { addDaysToCurrentDate, formatFullTimestamp } from '../../utils/dateUtils';

interface SwitchTierModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: Member | null;
}

export const SwitchTierModal: React.FC<SwitchTierModalProps> = ({ isOpen, onClose, member }) => {
  const { tiers, switchTier } = useGym();
  const [selectedTierId, setSelectedTierId] = useState<string>('');

  React.useEffect(() => {
    if (member) {
      setSelectedTierId(member.tierId);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  const currentTier = tiers.find((t) => t.id === member.tierId);
  const targetTier = tiers.find((t) => t.id === selectedTierId) || currentTier;

  const handleSwitch = () => {
    if (selectedTierId && selectedTierId !== member.tierId) {
      switchTier(member.id, selectedTierId);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">Switch Membership Plan</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Change plan for {member.name} ({member.id})
            </p>
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
          {/* Comparison summary */}
          <div className="flex items-center justify-between gap-3 p-4 bg-[#0F1115] border border-[#252B38] rounded-xl">
            <div>
              <span className="text-[11px] text-slate-400 block">Current Plan</span>
              <span className="font-bold text-sm text-white">{currentTier?.name}</span>
              <span className="text-xs text-slate-400 block mt-0.5">${currentTier?.monthlyPrice}/mo</span>
            </div>

            <ArrowRight className="w-4 h-4 text-slate-500 shrink-0" />

            <div>
              <span className="text-[11px] text-slate-400 block">Target Plan</span>
              <span className="font-bold text-sm text-[#D4FF00]">{targetTier?.name}</span>
              <span className="text-xs text-slate-300 block mt-0.5">${targetTier?.monthlyPrice}/mo</span>
            </div>
          </div>

          {/* Select New Tier */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              Select New Plan
            </label>
            <div className="space-y-2">
              {tiers.map((t) => {
                const isSelected = t.id === selectedTierId;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSelectedTierId(t.id)}
                    className={`w-full p-3.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#D4FF00]/10 border-[#D4FF00] text-white'
                        : 'bg-[#0F1115] border-[#252B38] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{t.name}</span>
                        <span className="text-xs text-[#D4FF00] font-mono-tabular">${t.monthlyPrice}/mo</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">{t.targetAudience}</p>
                    </div>

                    {isSelected && (
                      <div className="w-5 h-5 rounded-full bg-[#D4FF00] text-[#0F1115] flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
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
              onClick={handleSwitch}
              disabled={selectedTierId === member.tierId}
              className={`px-5 py-2.5 text-xs font-bold rounded-xl transition-all ${
                selectedTierId === member.tierId
                  ? 'bg-[#252B38] text-slate-500 cursor-not-allowed'
                  : 'bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] active:scale-95 shadow-md'
              }`}
            >
              Confirm Switch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
