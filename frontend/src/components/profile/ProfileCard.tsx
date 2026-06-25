'use client';

import { User } from '@/lib/auth-context';
import AiChatStatsCard from './AiChatStatsCard';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ProfileCardProps {
  user: User;
  onEditClick: () => void;
}

export default function ProfileCard({ user, onEditClick }: ProfileCardProps) {
  // Generate initials from user name
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : 'U';

  const avatarSrc = user.avatarUrl ? `${API_BASE}${user.avatarUrl}` : null;

  return (
    <div className="space-y-6">
      {/* Profile Identity Card */}
      <div className="dashboard-card rounded-2xl p-8 text-center relative overflow-hidden group">
        {/* Ambient glow */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-accent/10 rounded-full blur-3xl group-hover:bg-violet-accent/20 transition-colors duration-700" />
        
        {/* Avatar with neon gradient ring */}
        <div className="relative inline-block mb-6">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-violet-accent via-violet-glow to-cyan-accent p-[3px] shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            <div className="w-full h-full rounded-full bg-midnight-card flex items-center justify-center overflow-hidden">
              {avatarSrc ? (
                <img
                  src={avatarSrc}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-heading font-bold text-white">
                  {initials}
                </span>
              )}
            </div>
          </div>
          {/* Online indicator */}
          <div className="absolute bottom-2 right-2 w-5 h-5 bg-emerald-400 rounded-full border-4 border-midnight-card" />
        </div>

        {/* Name & Email */}
        <h2 className="text-2xl font-heading font-bold text-white mb-1 relative z-10">
          {user.name}
        </h2>
        <p className="text-slate-400 text-sm mb-4 relative z-10">
          {user.employee_id} • {user.department}
        </p>
        <p className="text-slate-500 text-xs relative z-10">
          {user.role}
        </p>

        {/* Edit Profile Button */}
        <button
          onClick={onEditClick}
          className="mt-6 px-6 py-2.5 rounded-full bg-white/[0.06] border border-white/10 text-sm font-heading font-medium text-white hover:bg-white/10 hover:border-white/20 transition-all relative z-10"
        >
          Edit Profile
        </button>
      </div>

      {/* AI Chat Stats Card — replaces Corporate Clearance */}
      <AiChatStatsCard />
    </div>
  );
}
