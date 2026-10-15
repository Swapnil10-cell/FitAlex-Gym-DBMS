import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import { MembershipTier, Member } from '../types/gym';
import {
  CreditCard,
  Check,
  Users,
  Repeat,
  ArrowRight,
} from 'lucide-react';

interface MembershipsViewProps {
  onSwitchTierForMember: (member: Member) => void;
  onNavigateToMembers: () => void;
}

export const MembershipsView: React.FC<MembershipsViewProps> = ({
  onSwitchTierForMember,
  onNavigateToMembers,
}) => {
  const { tiers, members, getTierMemberCount } = useGym();
  const [selectedTierId, setSelectedTierId] = useState<string>(tiers[0]?.id || 'tier-vip');

  const selectedTier = tiers.find((t) => t.id === selectedTierId) || tiers[0];
  const membersInTier = members.filter((m) => m.tierId === selectedTier?.id);

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold font-display tracking-tight text-white">
            Plans & Pricing
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Membership options and active subscriber distribution.
          </p>
        </div>
      </div>

      {/* Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {tiers.map((tier) => {
          const count = getTierMemberCount(tier.id);
          const isSelected = selectedTierId === tier.id;

          return (
            <div
              key={tier.id}
              onClick={() => setSelectedTierId(tier.id)}
              className={`bg-[#181C24] rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between shadow-sm relative group ${
                isSelected
                  ? 'border-[#D4FF00] shadow-[0_0_20px_rgba(212,255,0,0.12)]'
                  : 'border-[#252B38]/60 hover:border-slate-500'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-lg text-white group-hover:text-[#D4FF00] transition-colors">
                    {tier.name}
                  </h3>
                  {tier.isPopular && (
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D4FF00] text-[#0F1115] font-extrabold text-[10px] uppercase">
                      Popular
                    </span>
                  )}
                </div>

                <div className="mt-4 pb-4 border-b border-[#252B38]">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-black font-mono-tabular text-white">
                      ${tier.monthlyPrice}
                    </span>
                    <span className="text-xs text-slate-400">/mo</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {tier.durationDays} days term
                  </p>
                </div>

                <p className="text-xs text-slate-300 mt-4 leading-relaxed">
                  {tier.targetAudience}
                </p>

                <div className="mt-4 space-y-2">
                  {tier.features.slice(0, 3).map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#D4FF00] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-[#252B38] flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <strong className="text-white">{count}</strong> Members
                </span>
                <span
                  className={`text-xs font-semibold ${
                    isSelected ? 'text-[#D4FF00]' : 'text-slate-400'
                  }`}
                >
                  {isSelected ? 'Selected' : 'View →'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrolled Members for Selected Tier */}
      {selectedTier && (
        <div className="bg-[#181C24] rounded-2xl p-6 border border-[#252B38]/60 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#252B38]">
            <div>
              <h3 className="text-base font-bold text-white">
                Members on {selectedTier.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {membersInTier.length} active subscribers
              </p>
            </div>

            <button
              onClick={onNavigateToMembers}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <span>Manage in Members list</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {membersInTier.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {membersInTier.map((member) => (
                <div
                  key={member.id}
                  className="p-3.5 bg-[#0F1115] border border-[#252B38] rounded-xl flex items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-semibold text-sm text-white">{member.name}</p>
                    <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                      {member.id} · {member.phone}
                    </p>
                  </div>

                  <button
                    onClick={() => onSwitchTierForMember(member)}
                    className="px-3 py-1.5 bg-[#181C24] hover:bg-[#252B38] border border-[#252B38] text-xs text-slate-300 hover:text-[#D4FF00] rounded-lg transition-colors flex items-center gap-1.5"
                    title="Switch Plan"
                  >
                    <Repeat className="w-3 h-3" />
                    <span>Switch</span>
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-6 text-center text-slate-400 text-xs">
              No members are currently enrolled in {selectedTier.name}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
