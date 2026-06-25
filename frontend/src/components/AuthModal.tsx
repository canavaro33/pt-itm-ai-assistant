'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuthModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [isLoginView, setIsLoginView] = useState(true);
  const { login, signup } = useAuth();
  const router = useRouter();

  // Form State
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('Operations');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (isLoginView) {
      const { success, error } = await login(employeeId, password);
      if (success) {
        onClose();
        router.push('/dashboard');
      } else {
        setError(error || 'Invalid employee ID or password');
      }
    } else {
      if (password !== confirmPassword) {
        return setError('Passwords do not match');
      }
      if (password.length < 6) {
        return setError('Password must be at least 6 characters');
      }

      const { success, error } = await signup(name, employeeId, department, password);
      if (success) {
        setMessage('Account created — please log in');
        setIsLoginView(true);
        setPassword('');
        setConfirmPassword('');
      } else {
        setError(error || 'Signup failed');
      }
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setMessage('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 backdrop-blur-xl bg-charcoal/40"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            
            {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-heading font-bold mb-6 text-center">
          {isLoginView ? 'Welcome Back' : 'Create Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-200 text-sm text-center">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/50 rounded-lg text-emerald-200 text-sm text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLoginView && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-charcoal/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-navy-light transition-colors text-sm"
            />
          )}

          <input
            type="text"
            placeholder="ITM-0001"
            required
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-charcoal/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-navy-light transition-colors text-sm"
          />

          {!isLoginView && (
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-charcoal/50 border border-white/10 text-white focus:outline-none focus:border-navy-light transition-colors text-sm appearance-none"
            >
              <option value="Operations">Operations</option>
              <option value="EHS">EHS</option>
              <option value="HR">HR</option>
              <option value="Corporate">Corporate</option>
            </select>
          )}

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-charcoal/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-navy-light transition-colors text-sm"
          />

          {!isLoginView && (
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-charcoal/50 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-navy-light transition-colors text-sm"
            />
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            type="submit"
            className="w-full mt-2 py-3.5 rounded-xl bg-navy hover:bg-navy-light text-white font-heading font-medium shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] text-sm transition-colors"
          >
            {isLoginView ? 'Log In' : 'Sign Up'}
          </motion.button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={toggleView}
            className="text-white/60 hover:text-white text-sm transition-colors"
          >
            {isLoginView
              ? "Don't have an account? Sign up"
              : 'Already have an account? Log in'}
          </button>
        </div>
      </motion.div>
    </div>
    )}
    </AnimatePresence>
  );
}
