'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getToken } from '@/lib/storage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface Certification {
  name: string;
  issueDate: string;
  expiryDate: string;
  status: 'Active' | 'Expired';
}

interface CertificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CertificationsModal({ isOpen, onClose }: CertificationsModalProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchCertifications();
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

  const fetchCertifications = async () => {
    setIsLoading(true);
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/user/certifications`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setCertifications(data.certifications || []);
      }
    } catch (error) {
      console.error('Failed to fetch certifications:', error);
    } finally {
      setIsLoading(false);
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
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/10 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-heading font-bold text-white">HSE/K3 Certifications</h2>
              <p className="text-sm text-slate-400">Your safety training certificates</p>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 rounded-full border-2 border-violet-accent/30 border-t-violet-accent animate-spin" />
            </div>
          ) : certifications.length === 0 ? (
            <div className="text-center py-12">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-slate-600 mx-auto mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9.75m0 0l2.25-2.25M9.75 14.25l2.25 2.25M3.375 7.5h7.5c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-7.5a1.125 1.125 0 01-1.125-1.125V8.625c0-.621.504-1.125 1.125-1.125z" />
              </svg>
              <p className="text-sm text-slate-400">No certifications on record</p>
              <p className="text-xs text-slate-500 mt-1">Contact HSE department for training</p>
            </div>
          ) : (
            <div className="space-y-3">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-heading font-medium text-white truncate">
                        {cert.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-1">
                        Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-slate-500">
                        Expires: {new Date(cert.expiryDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-heading font-medium px-2.5 py-1 rounded-full border flex-shrink-0 ${
                        cert.status === 'Active'
                          ? 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20'
                          : 'text-red-400 bg-red-400/10 border-red-400/20'
                      }`}
                    >
                      {cert.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
