import React, { useState } from 'react';
import { useGym } from '../context/GymContext';
import gymBackdrop from '../assets/images/neon_gym_ambience.jpg';
import {
  Lock,
  ShieldCheck,
  User,
  KeyRound,
  AlertCircle,
  ArrowRight,
  Eye,
  EyeOff,
  Mail,
  Phone,
  UserPlus,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login, signup } = useGym();

  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessBanner(null);

    if (!username.trim() || !password.trim()) {
      setErrorMessage('Access Denied: Invalid Security Credentials');
      return;
    }

    setIsSubmitting(true);
    // Micro-delay for smooth transition feel
    setTimeout(() => {
      const success = login(username, password);
      if (!success) {
        setErrorMessage('Access Denied: Invalid Security Credentials');
        setIsSubmitting(false);
      }
    }, 200);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const errors: Record<string, string> = {};

    const trimmedName = signupName.trim();
    const trimmedEmail = signupEmail.trim();
    const trimmedUsername = signupUsername.trim();
    const trimmedPhone = signupPhone.trim().replace(/\D/g, '');
    const trimmedPass = signupPassword.trim();

    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (!/^[A-Za-z\s]+$/.test(trimmedName)) {
      errors.name = 'Name must contain only alphabets and spaces';
    }

    if (!trimmedEmail) {
      errors.email = 'Active email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      errors.email = 'Please provide a valid email format';
    }

    if (!trimmedUsername) {
      errors.username = 'Username is required';
    } else if (trimmedUsername.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (trimmedPhone && trimmedPhone.length !== 10) {
      errors.phone = 'Phone number must be a 10-digit number';
    }

    if (!trimmedPass) {
      errors.password = 'Access password is required';
    } else if (trimmedPass.length < 4) {
      errors.password = 'Password must be at least 4 characters';
    }

    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    }

    setSignupErrors({});
    setIsSubmitting(true);

    setTimeout(() => {
      const success = signup(
        trimmedUsername,
        trimmedName,
        trimmedEmail,
        trimmedPhone || '9820194820',
        trimmedPass
      );

      setIsSubmitting(false);

      if (success) {
        // Autofill credentials into login form
        setUsername(trimmedUsername);
        setPassword(trimmedPass);
        setSuccessBanner(`Manager account "${trimmedUsername}" created successfully! Please log in.`);
        setMode('login');

        // Reset signup inputs
        setSignupName('');
        setSignupEmail('');
        setSignupUsername('');
        setSignupPhone('');
        setSignupPassword('');
      } else {
        setErrorMessage('A manager with this username or email already exists.');
      }
    }, 200);
  };

  const handleFillManagerDemo = () => {
    setUsername('manager');
    setPassword('admin');
    setErrorMessage(null);
    setSuccessBanner(null);
  };

  const handleFillMemberDemo = () => {
    setUsername('MEM-1042');
    setPassword('admin');
    setErrorMessage(null);
    setSuccessBanner(null);
  };

  const handleFillDemo = handleFillManagerDemo;

  return (
    <div className="relative min-h-screen w-full bg-[#0F1115] text-[#E2E8F0] flex items-center justify-center lg:justify-start lg:pl-16 xl:pl-28 p-4 sm:p-6 overflow-hidden select-none">
      {/* Dynamic Gym Floor Backdrop Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
        <img
          src={gymBackdrop || '/neon_gym_ambience.jpg'}
          alt="Neon Gym Ambience"
          className="w-full h-full object-cover select-none pointer-events-none transform scale-100 lg:scale-[1.02] transition-transform duration-1000 ease-out"
        />
        {/* Cinematic gradient mask: deep dark matte on left, exposed vibrant neon gym on right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F1115]/95 via-[#0F1115]/85 to-transparent" />
        {/* Atmospheric top and bottom vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-transparent to-[#0F1115]/60" />
      </div>

      {/* Main Gatekeeper Card */}
      <div className="w-full max-w-md bg-[#181C24]/95 backdrop-blur-md border border-[#252B38] rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.65)] p-7 sm:p-9 relative z-10 space-y-6 my-auto transition-all duration-300">
        {/* Brand Lockup & Gateway Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0F1115] border border-[#252B38] text-[#D4FF00] shadow-[0_0_25px_rgba(212,255,0,0.2)] mb-1">
            {mode === 'login' ? (
              <Lock className="w-6 h-6 text-[#D4FF00]" />
            ) : (
              <UserPlus className="w-6 h-6 text-[#D4FF00]" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-display font-extrabold text-2xl tracking-tight text-white">
                Fit<span className="text-[#D4FF00]">Alex</span>
              </span>
            </div>
            <h1 className="text-base font-extrabold tracking-wider uppercase text-white mt-1">
              {mode === 'login' ? 'FITALEX SECURE GATEWAY' : 'MANAGER PROFILE REGISTRATION'}
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center justify-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] animate-pulse" />
              <span>
                {mode === 'login'
                  ? 'Dual Console · Manager & Member Pass Gateway'
                  : 'Register Authorized Facility Manager Account'}
              </span>
            </p>
          </div>
        </div>

        {/* Success Banner */}
        {successBanner && (
          <div className="p-3.5 bg-emerald-950/50 border border-emerald-500/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-300 font-semibold animate-in fade-in zoom-in-95 duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* Error Alert Chip */}
        {errorMessage && (
          <div className="p-3.5 bg-rose-950/40 border border-rose-500/40 rounded-xl flex items-center gap-2.5 text-xs text-rose-300 font-semibold animate-in fade-in zoom-in-95 duration-150">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {mode === 'login' ? (
          /* LOGIN FORM */
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {/* Username / Member ID Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Username, Email, or Member ID
              </label>
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="manager or MEM-1042"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Access Password
                </label>
                <span className="text-[11px] text-slate-400 font-medium">Default: 'admin'</span>
              </div>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMessage) setErrorMessage(null);
                  }}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] focus:ring-1 focus:ring-[#D4FF00] rounded-xl pl-11 pr-11 py-3 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Helper Text Under Inputs (Prompt Requirement) */}
            <div className="p-3 bg-[#12151C] border border-[#252B38] rounded-xl text-left">
              <div className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4FF00] mt-1.5 shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <span className="font-bold text-[#D4FF00]">Gym Members:</span> Log in using your Member ID (e.g., <span className="font-mono text-white font-semibold">MEM-1042</span>) and password <span className="font-mono text-white font-semibold">'admin'</span> to view your live membership pass.
                </p>
              </div>
            </div>

            {/* Fast 1-Click Demo Fill Selector */}
            <div className="flex items-center justify-between gap-2 pt-0.5">
              <button
                type="button"
                onClick={handleFillManagerDemo}
                className="flex-1 py-1.5 px-2 bg-[#181C24] hover:bg-[#252B38] text-[11px] font-semibold text-slate-300 hover:text-white rounded-lg border border-[#252B38] transition-colors cursor-pointer truncate"
              >
                Autofill Manager
              </button>
              <button
                type="button"
                onClick={handleFillMemberDemo}
                className="flex-1 py-1.5 px-2 bg-[#181C24] hover:bg-[#252B38] text-[11px] font-semibold text-[#D4FF00] hover:text-[#BFEC00] rounded-lg border border-[#252B38] transition-colors cursor-pointer truncate"
              >
                Autofill Member (MEM-1042)
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(212,255,0,0.25)] active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>{isSubmitting ? 'Authenticating...' : 'Secure Gateway Access'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            {/* Switch to Signup */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setErrorMessage(null);
                  setSuccessBanner(null);
                }}
                className="text-xs text-slate-400 hover:text-[#D4FF00] transition-colors font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>New facility manager?</span>
                <span className="text-[#D4FF00] font-bold underline">Create New Account</span>
              </button>
            </div>
          </form>
        ) : (
          /* SIGNUP FORM */
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="e.g. Vikram Malhotra"
                  value={signupName}
                  onChange={(e) => {
                    setSignupName(e.target.value);
                    if (signupErrors.name) {
                      setSignupErrors((prev) => ({ ...prev, name: '' }));
                    }
                  }}
                  className={`w-full bg-[#0F1115] border ${
                    signupErrors.name ? 'border-rose-500' : 'border-[#252B38]'
                  } focus:border-[#D4FF00] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
                />
              </div>
              {signupErrors.name && (
                <p className="text-[11px] text-rose-400 mt-1">{signupErrors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Active Email <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="e.g. vikram.m@fitalex.internal"
                  value={signupEmail}
                  onChange={(e) => {
                    setSignupEmail(e.target.value);
                    if (signupErrors.email) {
                      setSignupErrors((prev) => ({ ...prev, email: '' }));
                    }
                  }}
                  className={`w-full bg-[#0F1115] border ${
                    signupErrors.email ? 'border-rose-500' : 'border-[#252B38]'
                  } focus:border-[#D4FF00] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
                />
              </div>
              {signupErrors.email && (
                <p className="text-[11px] text-rose-400 mt-1">{signupErrors.email}</p>
              )}
            </div>

            {/* Custom Username & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Custom Username <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. vikram"
                    value={signupUsername}
                    onChange={(e) => {
                      setSignupUsername(e.target.value);
                      if (signupErrors.username) {
                        setSignupErrors((prev) => ({ ...prev, username: '' }));
                      }
                    }}
                    className={`w-full bg-[#0F1115] border ${
                      signupErrors.username ? 'border-rose-500' : 'border-[#252B38]'
                    } focus:border-[#D4FF00] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
                  />
                </div>
                {signupErrors.username && (
                  <p className="text-[11px] text-rose-400 mt-1">{signupErrors.username}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Phone (10 Digits)
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="9820194820"
                    maxLength={10}
                    value={signupPhone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setSignupPhone(val);
                      if (signupErrors.phone) {
                        setSignupErrors((prev) => ({ ...prev, phone: '' }));
                      }
                    }}
                    className={`w-full bg-[#0F1115] border ${
                      signupErrors.phone ? 'border-rose-500' : 'border-[#252B38]'
                    } focus:border-[#D4FF00] rounded-xl pl-10 pr-3 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all font-mono-tabular`}
                  />
                </div>
                {signupErrors.phone && (
                  <p className="text-[11px] text-rose-400 mt-1">{signupErrors.phone}</p>
                )}
              </div>
            </div>

            {/* Access Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Access Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showSignupPassword ? 'text' : 'password'}
                  placeholder="Create access password"
                  value={signupPassword}
                  onChange={(e) => {
                    setSignupPassword(e.target.value);
                    if (signupErrors.password) {
                      setSignupErrors((prev) => ({ ...prev, password: '' }));
                    }
                  }}
                  className={`w-full bg-[#0F1115] border ${
                    signupErrors.password ? 'border-rose-500' : 'border-[#252B38]'
                  } focus:border-[#D4FF00] rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none transition-all`}
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  title={showSignupPassword ? 'Hide password' : 'Show password'}
                >
                  {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {signupErrors.password && (
                <p className="text-[11px] text-rose-400 mt-1">{signupErrors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-[#D4FF00] hover:bg-[#BFEC00] text-[#0F1115] font-black text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(212,255,0,0.25)] active:scale-98 flex items-center justify-center gap-2 cursor-pointer mt-3"
            >
              <span>{isSubmitting ? 'Registering...' : 'Register Manager Account'}</span>
              <Sparkles className="w-4 h-4" />
            </button>

            {/* Switch back to Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMessage(null);
                  setSuccessBanner(null);
                }}
                className="text-xs text-slate-400 hover:text-white transition-colors font-medium flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
              >
                <span>Already registered?</span>
                <span className="text-[#D4FF00] font-bold underline">Back to Login</span>
              </button>
            </div>
          </form>
        )}

        {/* Credentials Info Footer */}
        <div className="pt-4 border-t border-[#252B38]/60 text-center space-y-2">
          {mode === 'login' && (
            <p className="text-[11px] text-slate-400">
              Internal Master Credentials: <strong className="text-white">manager@fitalex.internal</strong> / <strong className="text-white">admin</strong>
            </p>
          )}
          <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono-tabular">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>FitAlex Security Engine · Multi-Manager RBAC Enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};
