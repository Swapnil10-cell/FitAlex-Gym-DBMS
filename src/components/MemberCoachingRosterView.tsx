import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import {
  Dumbbell,
  Star,
  Clock,
  Phone,
  Mail,
  CheckCircle2,
  Calendar,
  Sparkles,
  MessageSquare,
  Search,
} from 'lucide-react';

export const MemberCoachingRosterView: React.FC = () => {
  const { trainers, showToast } = useGym();
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const specialties = [
    'All',
    'Bodybuilding',
    'CrossFit',
    'Powerlifting',
    'Strength & Conditioning',
    'Yoga & Mobility',
  ];

  const filteredTrainers = trainers.filter((t) => {
    const matchesSpecialty =
      selectedSpecialty === 'All' || t.specialization === selectedSpecialty;
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.specialization.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesSearch;
  });

  const handleBookSession = (coachName: string) => {
    showToast(
      'success',
      'Coaching Inquiry Transmitted',
      `Your training request has been routed to Coach ${coachName}. They will connect via phone/app.`
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-[#181C24] border border-[#252B38] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/30 inline-flex items-center gap-1.5">
                <Dumbbell className="w-3.5 h-3.5" />
                <span>ELITE COACHING STAFF</span>
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {trainers.length} Certified Master Coaches
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              FITALEX <span className="text-[#D4FF00]">COACHING ROSTER</span>
            </h1>

            <p className="text-sm text-slate-400 max-w-2xl">
              Meet our world-class trainers, review live floor shift hours, specialization disciplines, and request personalized 1-on-1 performance programming.
            </p>
          </div>

          <div className="p-4 bg-[#12151C] rounded-2xl border border-[#252B38] text-right shrink-0">
            <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Coaches on Floor Right Now
            </p>
            <p className="text-xl font-black text-[#D4FF00]">
              {trainers.filter((t) => t.isOnDuty).length} Active On-Duty
            </p>
            <p className="text-xs text-slate-400">Ready for spotters & form checks</p>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {specialties.map((spec) => {
            const isSelected = selectedSpecialty === spec;
            return (
              <button
                key={spec}
                type="button"
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 whitespace-nowrap active:scale-95 cursor-pointer ${
                  isSelected
                    ? 'bg-[#D4FF00] text-[#0F1115] shadow-[0_0_15px_rgba(212,255,0,0.25)]'
                    : 'bg-[#181C24] text-slate-400 hover:text-white border border-[#252B38]'
                }`}
              >
                {spec}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search coach or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#181C24] border border-[#252B38] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-400 focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Coaching Roster Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrainers.map((coach) => (
          <div
            key={coach.id}
            className="bg-[#181C24] border border-[#252B38] hover:border-slate-600 rounded-3xl p-6 transition-all duration-200 flex flex-col justify-between space-y-5"
          >
            <div>
              {/* Top Row: Photo + Duty Status + Rating */}
              <div className="flex items-start justify-between gap-4">
                <div className="relative">
                  <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-[#252B38]"
                  />
                  {coach.isOnDuty && (
                    <span
                      className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#D4FF00] rounded-full border-2 border-[#181C24]"
                      title="On Duty Floor Right Now"
                    />
                  )}
                </div>

                <div className="flex flex-col items-end gap-1.5">
                  {coach.isOnDuty ? (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      ON DUTY
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#12151C] text-slate-400 border border-[#252B38]">
                      Off Shift
                    </span>
                  )}

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#12151C] text-xs font-bold text-amber-300 border border-[#252B38]">
                    <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                    <span>{coach.rating}</span>
                  </div>
                </div>
              </div>

              {/* Name & Specialization */}
              <div className="mt-4">
                <h3 className="text-lg font-black text-white">{coach.name}</h3>
                <span className="text-xs font-bold text-[#D4FF00] uppercase tracking-wide">
                  {coach.specialization}
                </span>
              </div>

              {/* Shift Hours */}
              <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 bg-[#12151C] p-2.5 rounded-xl border border-[#252B38]/60">
                <Clock className="w-3.5 h-3.5 text-[#D4FF00] shrink-0" />
                <span>Floor Shift: {coach.shiftHours}</span>
              </div>

              {/* Bio */}
              <p className="mt-3 text-xs text-slate-300 leading-relaxed line-clamp-3">
                "{coach.bio}"
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-2 border-t border-[#252B38]/80 space-y-2">
              <button
                type="button"
                onClick={() => handleBookSession(coach.name)}
                className="w-full py-2.5 rounded-xl bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-black text-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Calendar className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Book 1-on-1 Consultation</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-1 pt-1">
                <span className="flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-500" />
                  <span className="truncate max-w-[140px]">{coach.email}</span>
                </span>
                <span className="font-mono">{coach.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
