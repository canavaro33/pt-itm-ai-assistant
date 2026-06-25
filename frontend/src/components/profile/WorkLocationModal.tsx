'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/storage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface WorkLocation {
  siteName: string | null;
  department: string | null;
  shiftSchedule: string | null;
}

interface WorkLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WorkLocationModal({ isOpen, onClose }: WorkLocationModalProps) {
  const [workLocation, setWorkLocation] = useState<WorkLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchWorkLocation();
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

  const fetchWorkLocation = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/user/work-location`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setWorkLocation(data.workLocation);
      }
    } catch (error) {
      console.error('Failed to fetch work location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const hasData = workLocation && (workLocation.siteName || workLocation.department || workLocation.shiftSchedule);

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
            <div className="w-10 h-10 rounded-xl bg-cyan-accent/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-accent">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white">Work Location</h2>
              <p className="text-sm text-slate-400">Your current site assignment</p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-violet-accent/30 border-t-violet-accent animate-spin" />
            </div>
          ) : !hasData ? (
            <div className="text-center py-12">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 mx-auto mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              <p className="text-sm text-slate-400">No site assignment found</p>
              <p className="text-xs text-slate-500 mt-1">Contact HR for site allocation</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Site Name</p>
                <p className="text-sm font-heading font-medium text-white">
                  {workLocation.siteName || '—'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Department</p>
                <p className="text-sm font-heading font-medium text-white">
                  {workLocation.department || '—'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Shift Schedule</p>
                <p className="text-sm font-heading font-medium text-white">
                  {workLocation.shiftSchedule || '—'}
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
