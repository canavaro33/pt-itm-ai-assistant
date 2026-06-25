'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Navbar({
  onOpenAuth,
  onOpenInfo,
}: {
  onOpenAuth: () => void;
  onOpenInfo: (category: string, title: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-500 ${
        scrolled
          ? 'glass-strong shadow-lg shadow-black/20 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-navy/20 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-navy-light"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <span className="font-heading font-bold text-lg tracking-tight">
               ITM
              </span>
              <span className="hidden sm:inline text-white/40 text-xs ml-2 font-light">
                Indo Tambang Megah
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-10">
            {[
              { label: 'Operations', category: 'corporate', header: 'Company Operations' },
              { label: 'Safety', category: 'safety', header: 'Safety & K3 Standards' },
              { label: 'Wellness', category: 'wellness', header: 'Employee Wellness' },
              { label: 'About', category: 'corporate', header: 'About PT ITM' },
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => onOpenInfo(item.category, item.header)}
                className="text-lg text-white/60 hover:text-white transition-colors duration-300 relative group font-heading"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-navy transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* Portal Button */}
          {isAuthenticated ? (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={() => router.push('/dashboard')}
              className="px-5 py-2 rounded-full bg-navy hover:bg-navy-light text-white text-sm font-heading font-medium shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors"
            >
              Dashboard
            </motion.button>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              onClick={onOpenAuth}
              className="px-5 py-2 rounded-full bg-navy hover:bg-navy-light text-white text-sm font-heading font-medium shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors"
            >
              Sign Up / Login
            </motion.button>
          )}
        </div>
      </div>
    </nav>
  );
}
