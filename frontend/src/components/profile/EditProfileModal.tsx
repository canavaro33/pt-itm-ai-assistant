'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/storage';
import CropModal from './CropModal';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    name: string;
    employee_id: string;
    department: string;
    role: string;
    avatarUrl?: string | null;
  };
}

export default function EditProfileModal({ isOpen, onClose, user }: EditProfileModalProps) {
  const { refreshUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name || '',
    employee_id: user.employee_id || '',
    department: user.department || '',
    role: user.role || '',
  });

  // Crop flow state
  const [rawImageSrc, setRawImageSrc] = useState<string | null>(null);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [avatarBlob, setAvatarBlob] = useState<Blob | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || '',
        employee_id: user.employee_id || '',
        department: user.department || '',
        role: user.role || '',
      });
      setAvatarBlob(null);
      setRawImageSrc(null);
      setIsCropOpen(false);
      setAvatarPreview(user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null);
      setSaveSuccess(false);
      setSaveError('');
    }
  }, [isOpen, user]);

  // Clean up object URL on unmount
  useEffect(() => {
    return () => {
      if (avatarPreview && avatarBlob) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview, avatarBlob]);

  // Close on escape key (only when crop modal is not open)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isCropOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose, isCropOpen]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSaveError('Only JPEG, PNG, and WebP images are allowed');
      return;
    }

    // Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Image must be smaller than 2MB');
      return;
    }

    // Open crop modal with the raw image
    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result as string);
      setIsCropOpen(true);
      setSaveError('');
    };
    reader.readAsDataURL(file);

    // Reset file input so same file can be re-selected
    e.target.value = '';
  };

  const handleCropApply = (blob: Blob) => {
    // Revoke previous object URL if exists
    if (avatarPreview && avatarBlob) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarBlob(blob);
    setAvatarPreview(URL.createObjectURL(blob));
    setIsCropOpen(false);
    setRawImageSrc(null);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
    setRawImageSrc(null);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setSaveError('Name is required');
      return;
    }

    setIsSaving(true);
    setSaveError('');

    try {
      const token = getToken();

      // Build FormData
      const fd = new FormData();
      fd.append('fullName', formData.name);
      fd.append('employeeId', formData.employee_id);
      fd.append('department', formData.department);
      fd.append('role', formData.role);
      if (avatarBlob) {
        const filename = `avatar-${user.id}-${Date.now()}.jpg`;
        fd.append('avatar', avatarBlob, filename);
      }

      const res = await fetch(`${API_BASE}/api/user/profile`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: fd,
      });

      const data = await res.json();

      if (res.ok) {
        setSaveSuccess(true);
        await refreshUser();
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setSaveError(data.error || 'Failed to update profile');
      }
    } catch {
      setSaveError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const initials = formData.name
    ? formData.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg dashboard-card rounded-2xl p-6 lg:p-8 overflow-y-auto max-h-[90vh]"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-heading font-bold text-white">Edit Profile</h2>
            <p className="text-sm text-slate-400 mt-1">Update your personal information</p>
          </div>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <div
                onClick={handleAvatarClick}
                className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-accent via-violet-glow to-cyan-accent p-[3px] shadow-[0_0_30px_rgba(139,92,246,0.3)] cursor-pointer"
              >
                <div className="w-full h-full rounded-full bg-midnight-card flex items-center justify-center overflow-hidden">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-heading font-bold text-white">
                      {initials}
                    </span>
                  )}
                </div>
              </div>
              {/* Camera overlay on hover */}
              <div
                onClick={handleAvatarClick}
                className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
              </div>
              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            {/* Add Photo button */}
            <button
              onClick={handleAvatarClick}
              className="mt-3 flex items-center gap-1.5 text-xs font-heading font-medium text-slate-400 hover:text-violet-accent transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              Add Photo
            </button>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
                placeholder="Enter your full name"
              />
            </div>

            {/* Employee ID */}
            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Employee ID
              </label>
              <input
                type="text"
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Department
              </label>
              <input
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Role
              </label>
              <input
                type="text"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
              />
            </div>

            {/* Admin approval warning */}
            <p className="text-[10px] text-slate-500 px-1">
              Changes to Employee ID, Department, and Role require admin approval
            </p>
          </div>

          {/* Inline messages */}
          {saveError && (
            <div className="mt-4 p-3 rounded-lg bg-red-400/10 border border-red-400/20">
              <p className="text-xs text-red-400">{saveError}</p>
            </div>
          )}
          {saveSuccess && (
            <div className="mt-4 p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
              <p className="text-xs text-emerald-400">Profile updated successfully</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-heading font-medium text-white hover:bg-white/10 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || saveSuccess}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-accent to-violet-glow text-sm font-heading font-medium text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Saving...
                </>
              ) : saveSuccess ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Saved!
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Crop Modal — renders on top of Edit Profile modal */}
      {rawImageSrc && (
        <CropModal
          isOpen={isCropOpen}
          imageSrc={rawImageSrc}
          onCancel={handleCropCancel}
          onApply={handleCropApply}
        />
      )}
    </AnimatePresence>
  );
}
