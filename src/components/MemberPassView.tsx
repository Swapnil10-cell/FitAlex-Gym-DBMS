import React, { useState, useEffect } from 'react';
import { useGym } from '../context/GymContext';
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Calendar,
  User,
  Phone,
  Mail,
  Dumbbell,
  AlertTriangle,
  Flame,
  ArrowRight,
  ExternalLink,
  Award,
  BadgeCheck,
  Compass,
  Radio,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { getDaysRemaining, formatDateOnly } from '../utils/dateUtils';

export const MemberPassView: React.FC = () => {
  const { activeMemberUser, getTierById, getTrainerById, attendanceLogs, logVisit } = useGym();

  // If somehow null (fallback safety), show placeholder
  if (!activeMemberUser) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>No active member profile linked. Please sign in with your Member ID.</p>
      </div>
    );
  }

  const tier = getTierById(activeMemberUser.tierId);
  const trainer = getTrainerById(activeMemberUser.trainerId);
  const daysRemaining = getDaysRemaining(activeMemberUser.planExpiresAt);
  const isExpiringSoon = daysRemaining <= 7;

  // Filter attendance logs for this member
  const myAttendance = attendanceLogs
    .filter((log) => log.memberId === activeMemberUser.id)
    .slice(0, 6);

  /* ---------------------------------------------------- */
  /* KILLER FEATURE: ROTATING BIOMETRIC TOKEN SIMULATOR   */
  /* ---------------------------------------------------- */
  const [tokenTimeLeft, setTokenTimeLeft] = useState<number>(15.0);
  const [tokenString, setTokenString] = useState<string>('SEC-BIO-8924-F8A');
  const [isScanning, setIsScanning] = useState<boolean>(false);

  const generateNewToken = () => {
    const chars = '0123456789ABCDEF';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    const randNum = Math.floor(1000 + Math.random() * 9000);
    return `SEC-BIO-${randNum}-${code}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTokenTimeLeft((prev) => {
        if (prev <= 0.1) {
          setTokenString(generateNewToken());
          return 15.0;
        }
        return parseFloat((prev - 0.1).toFixed(1));
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleTurnstileScan = () => {
    setIsScanning(true);
    // Micro-delay simulation of turnstile laser beep
    setTimeout(() => {
      const nextType = activeMemberUser.isCurrentlyInGym ? 'check-out' : 'check-in';
      logVisit(activeMemberUser.id, 'Main Gym Floor', nextType);
      setIsScanning(false);
    }, 400);
  };

  const progressPercent = Math.max(0, Math.min(100, (tokenTimeLeft / 15.0) * 100));

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
      {/* Top Welcome & Digital Pass Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181C24] via-[#151922] to-[#12151C] border border-[#252B38] p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4FF00]/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-[#D4FF00]/10 text-[#D4FF00] border border-[#D4FF00]/30 inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Member Pass</span>
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#12151C] text-slate-300 border border-[#252B38]">
                {activeMemberUser.id}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-black text-white tracking-tight">
              Welcome back, <span className="text-[#D4FF00]">{activeMemberUser.name}</span>
            </h1>

            <p className="text-sm text-slate-400 max-w-xl">
              Your biometric gym pass is synchronized with the FitAlex Turnstile Network. Scan your live token below for immediate RFID turnstile entry.
            </p>
          </div>

          {/* Current Arena Presence Quick Pill */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 bg-[#0F1115]/80 p-3.5 rounded-2xl border border-[#252B38]">
            <div className="flex items-center gap-2.5">
              <span
                className={`w-3.5 h-3.5 rounded-full shrink-0 ${
                  activeMemberUser.isCurrentlyInGym
                    ? 'bg-[#D4FF00] animate-ping'
                    : 'bg-slate-500'
                }`}
              />
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Floor Radar Status
                </p>
                <p className="text-sm font-bold text-white">
                  {activeMemberUser.isCurrentlyInGym ? (
                    <span className="text-[#D4FF00]">INSIDE ARENA (TRAINING)</span>
                  ) : (
                    <span className="text-slate-300">OUTSIDE COMPLEX</span>
                  )}
                </p>
              </div>
            </div>

            <div className="hidden sm:block w-px h-8 bg-[#252B38]" />

            <div className="text-left sm:text-right">
              <p className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Plan Expiration
              </p>
              <p className={`text-sm font-bold ${isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
                {daysRemaining > 0 ? `${daysRemaining} Days Left` : 'Expired'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Killer Feature Turnstile Satellite + Membership Specifications */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        {/* ========================================================= */}
        {/* KILLER FEATURE: LIVE BIOMETRIC TURNSTILE QR CHECK-IN SATELLITE */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6">
          <div
            className={`relative rounded-3xl p-6 sm:p-8 border transition-all duration-300 ${
              activeMemberUser.isCurrentlyInGym
                ? 'bg-[#12151C]/95 border-[#D4FF00] shadow-[0_0_40px_rgba(212,255,0,0.25)]'
                : 'bg-[#181C24]/90 border-slate-700/80 shadow-[0_0_25px_rgba(255,255,255,0.06)]'
            }`}
          >
            {/* Satellite Title Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#252B38]/80 mb-6">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                    activeMemberUser.isCurrentlyInGym
                      ? 'bg-[#D4FF00] text-[#0F1115]'
                      : 'bg-[#252B38] text-white'
                  }`}
                >
                  <Radio className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-white tracking-wide">
                    DYNAMIC BIOMETRIC CHECK-IN PASS
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Live Biometric Turnstile Satellite · NFC / QR Sync
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider bg-[#0F1115] text-[#D4FF00] border border-[#252B38]">
                v4.8 ACTIVE
              </span>
            </div>

            {/* Glowing Biometric Frame Container */}
            <div
              className={`relative mx-auto max-w-sm rounded-2xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center ${
                activeMemberUser.isCurrentlyInGym
                  ? 'bg-[#0F1115] border-2 border-[#D4FF00] shadow-[inset_0_0_30px_rgba(212,255,0,0.15)]'
                  : 'bg-[#0F1115] border-2 border-slate-400/60 shadow-[inset_0_0_20px_rgba(255,255,255,0.04)]'
              }`}
            >
              {/* Corner Biometric HUD Brackets */}
              <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-[#D4FF00]" />
              <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-[#D4FF00]" />
              <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-[#D4FF00]" />
              <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-[#D4FF00]" />

              {/* Live Laser Scanline Overlay */}
              <div className="absolute inset-x-4 top-0 h-1 bg-gradient-to-r from-transparent via-[#D4FF00] to-transparent animate-pulse opacity-75" />

              {/* QR Matrix SVG Placeholder with Custom Cyber Glow */}
              <div className="relative p-4 bg-white rounded-xl shadow-inner mb-4">
                <svg
                  className="w-40 h-40 text-black"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top-Left Position Square */}
                  <rect x="5" y="5" width="26" height="26" rx="2" />
                  <rect x="10" y="10" width="16" height="16" fill="white" />
                  <rect x="13" y="13" width="10" height="10" />

                  {/* Top-Right Position Square */}
                  <rect x="69" y="5" width="26" height="26" rx="2" />
                  <rect x="74" y="10" width="16" height="16" fill="white" />
                  <rect x="77" y="13" width="10" height="10" />

                  {/* Bottom-Left Position Square */}
                  <rect x="5" y="69" width="26" height="26" rx="2" />
                  <rect x="10" y="74" width="16" height="16" fill="white" />
                  <rect x="13" y="77" width="10" height="10" />

                  {/* High Density Barcode/Matrix Dots */}
                  <rect x="36" y="8" width="6" height="6" />
                  <rect x="46" y="8" width="6" height="6" />
                  <rect x="56" y="12" width="6" height="6" />
                  <rect x="36" y="20" width="8" height="6" />
                  <rect x="48" y="22" width="6" height="8" />
                  <rect x="12" y="38" width="6" height="6" />
                  <rect x="24" y="38" width="8" height="6" />
                  <rect x="36" y="36" width="6" height="6" />
                  <rect x="46" y="36" width="6" height="8" />
                  <rect x="58" y="36" width="8" height="6" />
                  <rect x="70" y="38" width="6" height="6" />
                  <rect x="82" y="38" width="8" height="6" />

                  <rect x="8" y="50" width="8" height="6" />
                  <rect x="22" y="50" width="6" height="6" />
                  <rect x="34" y="48" width="12" height="6" />
                  <rect x="52" y="50" width="6" height="8" />
                  <rect x="64" y="48" width="8" height="6" />
                  <rect x="78" y="50" width="14" height="6" />

                  <rect x="38" y="62" width="6" height="8" />
                  <rect x="48" y="62" width="8" height="6" />
                  <rect x="62" y="64" width="6" height="6" />
                  <rect x="74" y="62" width="8" height="8" />
                  <rect x="86" y="64" width="6" height="6" />

                  <rect x="36" y="76" width="8" height="6" />
                  <rect x="48" y="78" width="6" height="8" />
                  <rect x="60" y="76" width="10" height="6" />
                  <rect x="76" y="78" width="6" height="6" />
                  <rect x="86" y="76" width="8" height="8" />
                </svg>

                {/* Center FitAlex Volt Badge on QR */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-[#0F1115] border-2 border-[#D4FF00] px-2 py-0.5 rounded shadow text-[9px] font-black text-[#D4FF00] tracking-wider">
                    FITALEX
                  </div>
                </div>
              </div>

              {/* Dynamic Rotating Token Display */}
              <div className="space-y-1.5 w-full">
                <div className="flex items-center justify-center gap-2">
                  <Lock className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span className="font-mono font-black text-sm text-white tracking-widest">
                    {tokenString}
                  </span>
                </div>

                {/* Millisecond Countdown Progress Bar */}
                <div className="w-full bg-[#181C24] h-1.5 rounded-full overflow-hidden border border-[#252B38]">
                  <div
                    className="h-full bg-[#D4FF00] transition-all duration-100 ease-linear"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-1">
                  <span>AUTO-RENEWAL 15s</span>
                  <span className="text-[#D4FF00] font-bold">
                    RELOADS IN {tokenTimeLeft.toFixed(1)}s
                  </span>
                </div>
              </div>
            </div>

            {/* Responsive State Subtext (Prompt Requirement) */}
            <div className="mt-5 text-center px-4">
              {activeMemberUser.isCurrentlyInGym ? (
                <div className="p-3 rounded-xl bg-[#D4FF00]/10 border border-[#D4FF00]/40 text-[#D4FF00] text-xs font-semibold">
                  <p className="flex items-center justify-center gap-1.5 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-[#D4FF00]" />
                    Presence Status: INSIDE ARENA
                  </p>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Tap below to scan your departure check-out token at the turnstile gate.
                  </p>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-[#0F1115] border border-slate-700 text-slate-300 text-xs font-semibold">
                  <p className="flex items-center justify-center gap-1.5 font-bold text-white">
                    <Radio className="w-4 h-4 text-slate-400" />
                    Presence Status: OUTSIDE COMPLEX
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Scan turnstile barcode or tap button to begin your workout session.
                  </p>
                </div>
              )}
            </div>

            {/* Interactive Turnstile Action Button */}
            <div className="mt-5">
              <button
                type="button"
                onClick={handleTurnstileScan}
                disabled={isScanning}
                className={`w-full py-4 rounded-2xl font-black text-sm tracking-wide transition-all duration-150 active:scale-95 cursor-pointer flex items-center justify-center gap-2.5 shadow-lg ${
                  activeMemberUser.isCurrentlyInGym
                    ? 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-900/40'
                    : 'bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] shadow-[0_0_25px_rgba(212,255,0,0.3)]'
                }`}
              >
                {isScanning ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Engaging Turnstile Sensor...</span>
                  </>
                ) : activeMemberUser.isCurrentlyInGym ? (
                  <>
                    <Zap className="w-5 h-5 fill-white" />
                    <span>Scan Departure Token to Exit Floor</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-[#0F1115]" />
                    <span>Scan Phone to Enter Gym Floor</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Barcode Strip */}
          <div className="bg-[#181C24] border border-[#252B38] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              HARDWARE SCANNER BACKUP BARCODE
            </span>
            <div className="bg-white p-2 rounded-lg w-full max-w-xs flex justify-center">
              {/* Simulated Code128 Barcode */}
              <div className="flex items-center justify-center h-10 w-full gap-[2px]">
                {[3, 1, 4, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 4, 2, 1, 2, 4, 1, 3, 1, 2, 4, 2, 1, 3, 4].map((w, idx) => (
                  <div
                    key={idx}
                    className="bg-black h-full"
                    style={{ width: `${w * 2}px` }}
                  />
                ))}
              </div>
            </div>
            <span className="font-mono text-xs font-bold text-slate-300 tracking-widest">
              *{activeMemberUser.id}*
            </span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MEMBERSHIP PROFILE SHOWCASE & METRICS                      */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-6">
          {/* Membership Plan Tier Card */}
          <div className="bg-[#181C24] border border-[#252B38] rounded-3xl p-6 sm:p-7 space-y-5">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4FF00]">
                  ACTIVE SUBSCRIPTION PLAN
                </span>
                <h3 className="text-2xl font-black text-white mt-0.5">
                  {tier?.name || 'Standard Fit'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {tier?.badgeTitle} · ${tier?.monthlyPrice}/month
                </p>
              </div>

              <span className="px-3 py-1.5 rounded-xl font-black text-xs bg-[#D4FF00] text-[#0F1115] shadow-sm uppercase">
                {activeMemberUser.status}
              </span>
            </div>

            {/* Plan Duration & Expiry Meter */}
            <div className="p-4 bg-[#12151C] rounded-2xl border border-[#252B38] space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1.5 font-medium">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Days Remaining
                </span>
                <span className={`font-mono font-bold ${isExpiringSoon ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {daysRemaining} Days
                </span>
              </div>

              <div className="w-full bg-[#181C24] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isExpiringSoon ? 'bg-amber-400' : 'bg-[#D4FF00]'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(10, (daysRemaining / 30) * 100))}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>Renews: {formatDateOnly(activeMemberUser.planExpiresAt)}</span>
                <span>Tier Duration: {tier?.durationDays || 30} Days</span>
              </div>
            </div>

            {/* Included Tier Features */}
            {tier?.features && (
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Included Privileges & Floor Access
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {tier.features.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2 rounded-xl bg-[#12151C]/60 border border-[#252B38]/50 text-xs text-slate-300"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#D4FF00] shrink-0" />
                      <span className="truncate">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Assigned Dedicated Coach Card */}
          {trainer ? (
            <div className="bg-[#181C24] border border-[#252B38] rounded-3xl p-6 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4FF00]">
                  DEDICATED FLOOR COACH
                </span>
                {trainer.isOnDuty ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    ON DUTY NOW
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#12151C] text-slate-400 border border-[#252B38]">
                    Off Duty
                  </span>
                )}
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={trainer.avatar}
                  alt={trainer.name}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#252B38]"
                />
                <div className="min-w-0">
                  <h4 className="text-base font-extrabold text-white truncate">{trainer.name}</h4>
                  <p className="text-xs text-[#D4FF00] font-semibold">{trainer.specialization}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Shift: {trainer.shiftHours} · ★ {trainer.rating}
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed bg-[#12151C] p-3 rounded-xl border border-[#252B38]/60">
                "{trainer.bio}"
              </p>
            </div>
          ) : (
            <div className="bg-[#181C24] border border-[#252B38] rounded-3xl p-6 text-center text-xs text-slate-400">
              <p>No coach currently assigned. Visit the Coaching Roster tab to request 1-on-1 programming.</p>
            </div>
          )}

          {/* Member Personal Attendance History */}
          <div className="bg-[#181C24] border border-[#252B38] rounded-3xl p-6 sm:p-7 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                YOUR RECENT ARENA VISITS
              </span>
              <span className="text-xs text-[#D4FF00] font-mono font-bold">
                {myAttendance.length} Logged Sessions
              </span>
            </div>

            {myAttendance.length > 0 ? (
              <div className="space-y-2">
                {myAttendance.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-[#12151C] border border-[#252B38] flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          log.type === 'check-in' ? 'bg-[#D4FF00]' : 'bg-rose-400'
                        }`}
                      />
                      <div>
                        <p className="font-semibold text-white">
                          {log.type === 'check-in' ? 'Turnstile Check-In' : 'Turnstile Check-Out'}
                        </p>
                        <p className="text-[10px] text-slate-400">{log.zone}</p>
                      </div>
                    </div>

                    <span className="font-mono text-[11px] text-slate-400">
                      {new Date(log.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-3">
                No previous visits logged on this pass yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
