'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/storage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface NotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState<string | null>(null); // which toggle tried to save

  useEffect(() => {
    if (isOpen) {
      fetchPreferences();
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

  const fetchPreferences = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/user/notification-preferences`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setEmailAlerts(data.emailAlerts);
        setPushNotifications(data.pushNotifications);
      }
    } catch (error) {
      console.error('Failed to fetch notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (field: 'emailAlerts' | 'pushNotifications', value: boolean) => {
    if (field === 'emailAlerts') setEmailAlerts(value);
    else setPushNotifications(value);

    setIsSaving(field);
    try {
      const token = getToken();
      await fetch(`${API_BASE}/api/user/notification-preferences`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ [field]: value }),
      });
    } catch (error) {
      console.error('Failed to save notification preference:', error);
      // Revert on failure
      if (field === 'emailAlerts') setEmailAlerts(!value);
      else setPushNotifications(!value);
    } finally {
      setIsSaving(null);
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
            <div className="w-10 h-10 rounded-xl bg-rose-400/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white">Notification Preferences</h2>
              <p className="text-sm text-slate-400">Manage your notification settings</p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-violet-accent/30 border-t-violet-accent animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {/* Email Alerts Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <p className="text-sm font-heading font-medium text-white">Email Alerts</p>
                  <p className="text-xs text-slate-500 mt-0.5">Receive important updates via email</p>
                </div>
                <button
                  onClick={() => handleToggle('emailAlerts', !emailAlerts)}
                  disabled={isSaving === 'emailAlerts'}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    emailAlerts ? 'bg-violet-accent' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      emailAlerts ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Push Notifications Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <div>
                  <p className="text-sm font-heading font-medium text-white">Push Notifications</p>
                  <p className="text-xs text-slate-500 mt-0.5">Get real-time push notifications</p>
                </div>
                <button
                  onClick={() => handleToggle('pushNotifications', !pushNotifications)}
                  disabled={isSaving === 'pushNotifications'}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    pushNotifications ? 'bg-violet-accent' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                      pushNotifications ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Info text */}
              <p className="text-[10px] text-slate-500 px-1 pt-1">
                Changes are saved automatically
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
