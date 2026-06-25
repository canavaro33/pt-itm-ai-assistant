'use client';

import { User } from '@/lib/auth-context';

interface SettingsPanelProps {
  user: User;
  onEditClick: () => void;
  onCertificationsClick: () => void;
  onWorkLocationClick: () => void;
  onSecurityClick: () => void;
  onNotificationsClick: () => void;
}

interface MenuItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  onClick?: () => void;
}

export default function SettingsPanel({
  user,
  onEditClick,
  onCertificationsClick,
  onWorkLocationClick,
  onSecurityClick,
  onNotificationsClick,
}: SettingsPanelProps) {
  const menuItems: MenuItem[] = [
    {
      id: 'edit-profile',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-glow">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
        </svg>
      ),
      label: 'Edit Profile',
      description: 'Update your personal information and photo',
      onClick: onEditClick,
    },
    {
      id: 'hse-certifications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        </svg>
      ),
      label: 'HSE/K3 Certifications',
      description: 'View your safety training certificates',
      onClick: onCertificationsClick,
    },
    {
      id: 'work-location',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-accent">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
        </svg>
      ),
      label: 'Work Location (Site)',
      description: 'View your current site assignment',
      onClick: onWorkLocationClick,
    },
    {
      id: 'security',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
        </svg>
      ),
      label: 'Security Settings',
      description: 'Change your password',
      onClick: onSecurityClick,
    },
    {
      id: 'notifications',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-rose-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
      ),
      label: 'Notification Preferences',
      description: 'Email alerts and push notifications',
      onClick: onNotificationsClick,
    },
  ];

  return (
    <div className="dashboard-card rounded-2xl p-6 lg:p-8">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-bold text-white">User Information</h2>
        <span className="text-xs text-slate-500 font-heading">{menuItems.length} options</span>
      </div>

      {/* Menu Items */}
      <div className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={item.onClick}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-transparent hover:bg-white/[0.03] hover:border-white/[0.06] transition-all duration-200 group"
          >
            {/* Icon */}
            <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] transition-colors">
              {item.icon}
            </div>

            {/* Label & Description */}
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-heading font-medium text-white group-hover:text-violet-glow transition-colors">
                {item.label}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {item.description}
              </p>
            </div>

            {/* Chevron */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="text-slate-600 group-hover:text-violet-glow transition-colors flex-shrink-0"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        ))}
      </div>

      {/* Account Info Footer */}
      <div className="mt-8 pt-6 border-t border-white/[0.06]">
        <h3 className="text-sm font-heading font-bold text-white mb-4">My Account</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.03] rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Employee ID</p>
            <p className="text-sm font-heading font-medium text-white">{user.employee_id}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Department</p>
            <p className="text-sm font-heading font-medium text-white">{user.department}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Role</p>
            <p className="text-sm font-heading font-medium text-white">{user.role}</p>
          </div>
          <div className="bg-white/[0.03] rounded-lg p-3">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Status</p>
            <p className="text-sm font-heading font-medium text-emerald-400">Active</p>
          </div>
        </div>
      </div>
    </div>
  );
}
