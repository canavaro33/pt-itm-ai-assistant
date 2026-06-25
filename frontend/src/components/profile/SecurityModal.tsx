'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/storage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SecurityModal({ isOpen, onClose }: SecurityModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isOpen) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      setSuccess('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setIsSaving(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/user/change-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess('Password changed successfully');
        setTimeout(() => onClose(), 1500);
      } else {
        setError(data.error || 'Failed to change password');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-lg dashboard-card rounded-2xl p-6 lg:p-8"
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white">Security Settings</h2>
              <p className="text-sm text-slate-400">Change your password</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block text-xs font-heading font-medium text-slate-400 mb-2 uppercase tracking-wider">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.06] transition-all"
                placeholder="Confirm new password"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/20">
                <p className="text-xs text-red-400">{error}</p>
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg bg-emerald-400/10 border border-emerald-400/20">
                <p className="text-xs text-emerald-400">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-heading font-medium text-white hover:bg-white/10 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving || !!success}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-accent to-violet-glow text-sm font-heading font-medium text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Saving...
                  </>
                ) : success ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Done!
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
