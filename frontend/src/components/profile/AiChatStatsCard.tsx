'use client';

import { useState, useEffect } from 'react';
import { getToken } from '@/lib/storage';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

interface ChatStats {
  totalQuestions: number;
  lastActiveSession: string | null;
  topTopic: string;
}

function formatRelativeTime(dateString: string | null): string {
  if (!dateString) return 'Never';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHour = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function AiChatStatsCard() {
  const [stats, setStats] = useState<ChatStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchChatStats();
  }, []);

  const fetchChatStats = async () => {
    try {
      const token = getToken();
      const res = await fetch(`${API_BASE}/api/user/chat-stats`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch chat stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-accent/5 via-transparent to-cyan-accent/5 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Header */}
      <div className="relative z-10 flex items-start gap-4 mb-5">
        <div className="w-12 h-12 rounded-xl bg-violet-accent/15 flex items-center justify-center flex-shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-glow">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
          </svg>
        </div>
        <div>
          <h3 className="font-heading font-bold text-white text-sm mb-1">
            AI Chat Stats
          </h3>
          <p className="text-slate-400 text-xs leading-relaxed">
            Your AI assistant usage overview
          </p>
        </div>
      </div>

      {/* Metrics */}
      {isLoading ? (
        <div className="relative z-10 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl bg-white/[0.03] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="relative z-10 grid grid-cols-3 gap-3">
          {/* Total Questions */}
          <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Questions</p>
            <p className="text-xl font-heading font-bold text-violet-accent">
              {stats?.totalQuestions ?? 0}
            </p>
          </div>

          {/* Last Active */}
          <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Last Active</p>
            <p className="text-sm font-heading font-bold text-cyan-accent">
              {formatRelativeTime(stats?.lastActiveSession ?? null)}
            </p>
          </div>

          {/* Top Topic */}
          <div className="bg-white/[0.03] rounded-xl p-3 text-center border border-white/[0.04]">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Top Topic</p>
            <p className="text-sm font-heading font-bold text-emerald-400 truncate">
              {stats?.topTopic ?? 'N/A'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
