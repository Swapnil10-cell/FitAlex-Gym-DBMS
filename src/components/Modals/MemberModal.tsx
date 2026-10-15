import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Member } from '../../types/gym';
import { X, User, Mail, Phone, Shield, ChevronDown, ChevronUp, AlertCircle, Calendar } from 'lucide-react';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: Member | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  memberToEdit,
}) => {
  const { tiers, trainers, addMember, updateMember } = useGym();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '' as number | string,
    gender: 'Male' as Member['gender'],
    tierId: tiers[0]?.id || 'tier-standard',
    trainerId: '' as string,
    status: 'active' as Member['status'],
    emergencyContact: '',
    notes: '',
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name,
        email: memberToEdit.email,
        phone: memberToEdit.phone,
        age: memberToEdit.age ?? '',
        gender: memberToEdit.gender || 'Male',
        tierId: memberToEdit.tierId,
        trainerId: memberToEdit.trainerId || '',
        status: memberToEdit.status,
        emergencyContact: memberToEdit.emergencyContact || '',
        notes: memberToEdit.notes || '',
      });
      setShowAdvanced(!!memberToEdit.trainerId || !!memberToEdit.emergencyContact || !!memberToEdit.notes);
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        tierId: tiers[0]?.id || 'tier-standard',
        trainerId: '',
        status: 'active',
        emergencyContact: '',
        notes: '',
      });
      setShowAdvanced(false);
      setErrors({});
      setTouched({});
    }
  }, [memberToEdit, isOpen, tiers]);

  const validateField = (field: string, value: any): string => {
    let error = '';

    if (field === 'name') {
      const trimmed = String(value || '').trim();
      if (!trimmed) {
        error = 'Name is required';
      } else if (!/^[A-Za-z\s]+$/.test(trimmed)) {
        error = 'Name must only contain alphabets and spaces';
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmed = String(value || '').trim();
      if (!trimmed) {
        error = 'Email is required';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Enter a valid email';
      }
    }

    if (field === 'phone') {
      const trimmed = String(value || '').trim();
      if (!trimmed) {
        error = 'Phone is required';
      } else {
        // Strip out non-digits and common country/prefix prefixes like +91, 91, or leading 0
        let clean = trimmed.replace(/\D/g, '');
        if (clean.length === 12 && clean.startsWith('91')) clean = clean.slice(2);
        if (clean.length === 11 && clean.startsWith('0')) clean = clean.slice(1);
        if (!/^[6-9]\d{9}$/.test(clean) && !/^\d{10}$/.test(clean)) {
          error = 'Enter a valid 10-digit Indian phone number';
        }
      }
    }

    if (field === 'age') {
      if (value === '' || value === undefined || value === null) {
        error = 'Age is required';
      } else {
        const num = Number(value);
        if (isNaN(num) || num < 15 || num >= 100) {
          error = 'Age must be between 15 and 99';
        }
      }
    }

    return error;
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const errorMsg = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateField('name', formData.name);
    const emailErr = validateField('email', formData.email);
    const phoneErr = validateField('phone', formData.phone);
    const ageErr = validateField('age', formData.age);

    setErrors({ name: nameErr, email: emailErr, phone: phoneErr, age: ageErr });
    setTouched({ name: true, email: true, phone: true, age: true });

    if (nameErr || emailErr || phoneErr || ageErr) return;

    // Normalize phone number to clean 10-digit Indian format
    let cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) cleanPhone = cleanPhone.slice(2);
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);

    if (memberToEdit) {
      updateMember(memberToEdit.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: cleanPhone || formData.phone.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        tierId: formData.tierId,
        trainerId: formData.trainerId || null,
        status: formData.status,
        emergencyContact: formData.emergencyContact.trim(),
        notes: formData.notes.trim(),
      });
    } else {
      addMember({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: cleanPhone || formData.phone.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        tierId: formData.tierId,
        trainerId: formData.trainerId || null,
        status: formData.status,
        emergencyContact: formData.emergencyContact.trim(),
        notes: formData.notes.trim(),
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-wide">
              {memberToEdit ? 'Edit Member' : 'Register New Member'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {memberToEdit
                ? `Updating profile for ${memberToEdit.name} (${memberToEdit.id})`
                : 'Registration time and date are logged automatically.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clean Baseline Input Fields */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* 1. Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Name <span className="text-[#D4FF00]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. Maya Rodriguez"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full bg-[#0F1115] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  touched.name && errors.name
                    ? 'border-rose-500'
                    : 'border-[#252B38] focus:border-[#D4FF00]'
                }`}
              />
            </div>
            {touched.name && errors.name && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* 2 & 3: Email and Phone Dual Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-[#D4FF00]">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="maya@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full bg-[#0F1115] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    touched.email && errors.email
                      ? 'border-rose-500'
                      : 'border-[#252B38] focus:border-[#D4FF00]'
                  }`}
                />
              </div>
              {touched.email && errors.email && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone Number (10 Digits) <span className="text-[#D4FF00]">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="tel"
                  placeholder="9820148201"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full bg-[#0F1115] border rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                    touched.phone && errors.phone
                      ? 'border-rose-500'
                      : 'border-[#252B38] focus:border-[#D4FF00]'
                  }`}
                />
              </div>
              {touched.phone && errors.phone && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          {/* New Fields: Age & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age (15–99 Years) <span className="text-[#D4FF00]">*</span>
              </label>
              <input
                type="number"
                min={15}
                max={99}
                placeholder="e.g. 24"
                value={formData.age}
                onChange={(e) => handleInputChange('age', e.target.value)}
                className={`w-full bg-[#0F1115] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  touched.age && errors.age
                    ? 'border-rose-500'
                    : 'border-[#252B38] focus:border-[#D4FF00]'
                }`}
              />
              {touched.age && errors.age && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Gender <span className="text-[#D4FF00]">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value as Member['gender'])}
                className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* 4. Plan Tier Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Membership Plan <span className="text-[#D4FF00]">*</span>
            </label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-3 w-4 h-4 text-slate-400 pointer-events-none" />
              <select
                value={formData.tierId}
                onChange={(e) => handleInputChange('tierId', e.target.value)}
                className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none appearance-none cursor-pointer"
              >
                {tiers.map((t) => (
                  <option key={t.id} value={t.id} className="bg-[#181C24] text-white">
                    {t.name} (${t.monthlyPrice}/month · {t.durationDays} days)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tiny Toggle Button for Advanced Details */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors font-medium py-1 cursor-pointer"
            >
              {showAdvanced ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>Hide Advanced Details</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>Show Advanced Details (Trainer, Emergency, Notes)</span>
                </>
              )}
            </button>
          </div>

          {/* Hidden Advanced Details Section */}
          {showAdvanced && (
            <div className="space-y-4 pt-3 border-t border-[#252B38]/60 animate-in fade-in duration-150">
              {/* Dedicated Trainer */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Assigned Personal Trainer
                </label>
                <select
                  value={formData.trainerId}
                  onChange={(e) => handleInputChange('trainerId', e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
                >
                  <option value="">No Dedicated Trainer (Self-Directed)</option>
                  {trainers.map((tr) => (
                    <option key={tr.id} value={tr.id}>
                      {tr.name} ({tr.specialization}) {tr.isOnDuty ? '· On-Duty' : ''}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status & Emergency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Account Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value as Member['status'])}
                    className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="paused">Paused</option>
                    <option value="expired">Expired</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Emergency Contact
                  </label>
                  <input
                    type="text"
                    placeholder="Name & Phone"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Internal Manager Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Goals, restrictions, or preferences..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none resize-none"
                />
              </div>
            </div>
          )}

          {/* Modal Actions */}
          <div className="pt-4 border-t border-[#252B38] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-[#0F1115] bg-[#D4FF00] hover:bg-[#BFEC00] rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              {memberToEdit ? 'Save Changes' : 'Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
