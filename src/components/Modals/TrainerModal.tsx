import React, { useState, useEffect } from 'react';
import { useGym } from '../../context/GymContext';
import { Trainer } from '../../types/gym';
import { X, AlertCircle } from 'lucide-react';

interface TrainerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trainerToEdit?: Trainer | null;
}

export const TrainerModal: React.FC<TrainerModalProps> = ({
  isOpen,
  onClose,
  trainerToEdit,
}) => {
  const { addTrainer, updateTrainer } = useGym();

  const [formData, setFormData] = useState({
    name: '',
    specialization: 'Bodybuilding' as Trainer['specialization'],
    email: '',
    phone: '',
    age: '' as number | string,
    gender: 'Male' as Trainer['gender'],
    shiftHours: '06:00 AM - 02:00 PM',
    isOnDuty: true,
    rating: 4.9,
    bio: '',
    avatar: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (trainerToEdit) {
      setFormData({
        name: trainerToEdit.name,
        specialization: trainerToEdit.specialization,
        email: trainerToEdit.email,
        phone: trainerToEdit.phone,
        age: trainerToEdit.age ?? '',
        gender: trainerToEdit.gender || 'Male',
        shiftHours: trainerToEdit.shiftHours,
        isOnDuty: trainerToEdit.isOnDuty,
        rating: trainerToEdit.rating,
        bio: trainerToEdit.bio,
        avatar: trainerToEdit.avatar,
      });
      setErrors({});
      setTouched({});
    } else {
      setFormData({
        name: '',
        specialization: 'Strength & Conditioning',
        email: '',
        phone: '',
        age: '',
        gender: 'Male',
        shiftHours: '08:00 AM - 04:00 PM',
        isOnDuty: true,
        rating: 5.0,
        bio: '',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      });
      setErrors({});
      setTouched({});
    }
  }, [trainerToEdit, isOpen]);

  if (!isOpen) return null;

  const validateField = (field: string, value: any): string => {
    let error = '';

    if (field === 'name') {
      const trimmed = String(value || '').trim();
      if (!trimmed) {
        error = 'Trainer name is required';
      } else if (!/^[A-Za-z\s]+$/.test(trimmed)) {
        error = 'Name must only contain alphabets and spaces';
      }
    }

    if (field === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const trimmed = String(value || '').trim();
      if (!trimmed) {
        error = 'Contact email is required';
      } else if (!emailRegex.test(trimmed)) {
        error = 'Enter a valid email';
      }
    }

    if (field === 'phone') {
      const trimmed = String(value || '').trim();
      if (!trimmed) {
        error = 'Phone is required';
      } else {
        // Strip out non-digits and common prefixes like +91, 91, or leading 0
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

    // Normalize phone number
    let cleanPhone = formData.phone.trim().replace(/\D/g, '');
    if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) cleanPhone = cleanPhone.slice(2);
    if (cleanPhone.length === 11 && cleanPhone.startsWith('0')) cleanPhone = cleanPhone.slice(1);

    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: cleanPhone || formData.phone.trim(),
      age: Number(formData.age),
      gender: formData.gender,
      avatar:
        formData.avatar ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    };

    if (trainerToEdit) {
      updateTrainer(trainerToEdit.id, payload);
    } else {
      addTrainer(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-[#181C24] border border-[#252B38] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-5 border-b border-[#252B38] flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-wide">
            {trainerToEdit ? 'Edit Trainer' : 'Add New Trainer'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-[#212631] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Trainer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Trainer Name <span className="text-[#D4FF00]">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Jaxson Miller"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full bg-[#0F1115] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                touched.name && errors.name
                  ? 'border-rose-500'
                  : 'border-[#252B38] focus:border-[#D4FF00]'
              }`}
            />
            {touched.name && errors.name && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errors.name}
              </p>
            )}
          </div>

          {/* Age & Gender Dual Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Age (15–99) <span className="text-[#D4FF00]">*</span>
              </label>
              <input
                type="number"
                min={15}
                max={99}
                placeholder="e.g. 28"
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
                onChange={(e) => handleInputChange('gender', e.target.value as Trainer['gender'])}
                className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors cursor-pointer"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Specialization & Shift Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Specialization
              </label>
              <select
                value={formData.specialization}
                onChange={(e) =>
                  handleInputChange('specialization', e.target.value as Trainer['specialization'])
                }
                className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none cursor-pointer"
              >
                <option value="Bodybuilding">Bodybuilding</option>
                <option value="CrossFit">CrossFit</option>
                <option value="Strength & Conditioning">Strength & Conditioning</option>
                <option value="Yoga & Mobility">Yoga & Mobility</option>
                <option value="Powerlifting">Powerlifting</option>
                <option value="HIIT & Cardio">HIIT & Cardio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Shift Schedule
              </label>
              <input
                type="text"
                placeholder="e.g. 08:00 AM - 04:00 PM"
                value={formData.shiftHours}
                onChange={(e) => handleInputChange('shiftHours', e.target.value)}
                className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Email & Phone Dual Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Email Address <span className="text-[#D4FF00]">*</span>
              </label>
              <input
                type="email"
                placeholder="trainer@fitalex.internal"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full bg-[#0F1115] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  touched.email && errors.email
                    ? 'border-rose-500'
                    : 'border-[#252B38] focus:border-[#D4FF00]'
                }`}
              />
              {touched.email && errors.email && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Phone (10 Digits) <span className="text-[#D4FF00]">*</span>
              </label>
              <input
                type="tel"
                placeholder="9820148201"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className={`w-full bg-[#0F1115] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none transition-colors ${
                  touched.phone && errors.phone
                    ? 'border-rose-500'
                    : 'border-[#252B38] focus:border-[#D4FF00]'
                }`}
              />
              {touched.phone && errors.phone && (
                <p className="text-xs text-rose-400 mt-1 flex items-center gap-1 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errors.phone}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Trainer Bio
            </label>
            <textarea
              rows={2}
              placeholder="Background, style, credentials..."
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              className="w-full bg-[#0F1115] border border-[#252B38] focus:border-[#D4FF00] rounded-xl p-3 text-sm text-white focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              id="isOnDutyModalCheck"
              checked={formData.isOnDuty}
              onChange={(e) => handleInputChange('isOnDuty', e.target.checked)}
              className="w-4 h-4 accent-[#D4FF00] rounded cursor-pointer"
            />
            <label htmlFor="isOnDutyModalCheck" className="text-xs text-slate-300 cursor-pointer">
              Mark as <strong>Available on Floor Now</strong>
            </label>
          </div>

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
              className="px-5 py-2.5 text-xs font-bold text-[#0F1115] bg-[#D4FF00] hover:bg-[#BFEC00] rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              {trainerToEdit ? 'Save Changes' : 'Add Trainer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
