'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import ChatOverlay from '@/components/ChatOverlay';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialInput, setChatInitialInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Close sidebar & dropdown on route change
  useEffect(() => {
    setIsSidebarOpen(false);
    setIsProfileDropdownOpen(false);
  }, [pathname]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Lock body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSidebarOpen]);

  const handleSearchSubmit = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setChatInitialInput(searchQuery);
      setIsChatOpen(true);
      setSearchQuery('');
    }
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-midnight flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-navy border-t-white animate-spin"></div>
      </div>
    );
  }

  // Get user initials
  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Safety/K3 Hub', href: '/dashboard/safety' },
    { name: 'Profile', href: '/dashboard/profile' },
  ];

  // Sidebar content shared between desktop and mobile drawer
  const sidebarContent = (
    <>
      <div className="p-6 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-navy/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-light">
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg tracking-tight">
            PT ITM
          </span>
        </div>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-sm font-heading font-medium ${
              pathname === item.href
                ? 'bg-violet-accent/15 text-white shadow-[inset_4px_0_0_#8B5CF6]'
                : 'text-slate-400 hover:bg-white/[0.04] hover:text-white'
            }`}
          >
            {item.name}
          </Link>
        ))}

        {/* AI Assistant Button */}
        <button
          onClick={() => {
            setChatInitialInput('');
            setIsChatOpen(true);
            setIsSidebarOpen(false);
          }}
          className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-sm font-heading font-medium text-slate-400 hover:bg-white/[0.04] hover:text-white text-left"
        >
          AI Assistant
        </button>
      </div>

      <div className="p-4 border-t border-white/[0.06]">
        <button
          onClick={() => {
            logout();
            router.replace('/');
          }}
          className="w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-sm font-heading font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300"
        >
          Log Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-midnight text-white flex">
      {/* Desktop Sidebar — hidden below lg */}
      <aside className="hidden lg:flex w-64 flex-shrink-0 flex-col bg-midnight-card border-r border-white/[0.06]">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Drawer — visible only below lg */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.25, ease: 'easeOut' }}
              className="fixed inset-y-0 left-0 z-50 w-72 flex flex-col bg-midnight-card border-r border-white/[0.06] shadow-2xl shadow-black/50 lg:hidden"
            >
              {/* Close button inside drawer */}
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-5 right-4 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors z-10"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Header — visible only below lg */}
        <header className="lg:hidden h-14 px-4 flex items-center justify-between border-b border-white/[0.06] bg-midnight/90 backdrop-blur-lg sticky top-0 z-30">
          {/* Hamburger */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="w-9 h-9 rounded-lg bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors"
            aria-label="Open menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-navy/20 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-navy-light">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-heading font-bold text-base tracking-tight">PT ITM</span>
          </div>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-accent to-violet-glow flex items-center justify-center text-xs font-heading font-bold shadow-[0_0_12px_rgba(139,92,246,0.3)] ring-2 ring-white/10 overflow-hidden">
            {user?.avatarUrl ? (
              <img
                src={`${API_BASE}${user.avatarUrl}`}
                alt={user.name}
                className="w-full h-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
        </header>

        {/* Desktop Top Header Row — hidden below lg */}
        <header className="hidden lg:flex h-20 px-8 items-center justify-between border-b border-white/[0.06] bg-midnight/80 backdrop-blur-lg sticky top-0 z-20">
          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search AI tools, models, or data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchSubmit}
              className="w-full bg-white/[0.03] border border-white/[0.08] rounded-full pl-11 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-accent/50 focus:bg-white/[0.05] transition-all shadow-inner"
            />
          </div>

          {/* Right Side: User Profile with Dropdown */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen((prev) => !prev)}
              className="flex items-center gap-4 cursor-pointer group"
              aria-haspopup="true"
              aria-expanded={isProfileDropdownOpen}
              id="profile-menu-button"
            >
              <div className="flex flex-col items-end">
                <span className="text-sm font-heading font-medium text-white group-hover:text-white/90 transition-colors">{user?.name}</span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-navy/30 text-navy-glow border border-navy/50 mt-0.5 font-heading">
                  {user?.department}
                </span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-accent to-violet-glow flex items-center justify-center text-sm font-heading font-bold shadow-[0_0_15px_rgba(139,92,246,0.35)] ring-2 ring-white/10 overflow-hidden transition-all duration-200 group-hover:ring-violet-accent/40 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                {user?.avatarUrl ? (
                  <img
                    src={`${API_BASE}${user.avatarUrl}`}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  initials
                )}
              </div>
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 top-full mt-3 w-56 rounded-xl bg-midnight-card border border-white/[0.08] shadow-[0_16px_48px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-xl overflow-hidden z-50"
                  role="menu"
                  aria-labelledby="profile-menu-button"
                >
                  {/* User Info Header */}
                  <div className="px-4 py-3 border-b border-white/[0.06]">
                    <p className="text-sm font-heading font-medium text-white truncate">{user?.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{user?.department}</p>
                  </div>

                  {/* Menu Items */}
                  <div className="py-1.5">
                    {/* Edit Profile */}
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-heading text-slate-300 hover:text-white hover:bg-white/[0.06] transition-all duration-200 group/item"
                      role="menuitem"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-slate-400 group-hover/item:text-violet-accent transition-colors"
                      >
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      Edit Profile
                    </Link>

                    {/* Divider */}
                    <div className="my-1.5 border-t border-white/[0.06]" />

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        logout();
                        router.replace('/');
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-heading text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200 group/item"
                      role="menuitem"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-400 group-hover/item:text-red-300 transition-colors"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      Log Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>

      {/* Full-Screen Chat Overlay */}
      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialInput={chatInitialInput}
      />
    </div>
  );
}
