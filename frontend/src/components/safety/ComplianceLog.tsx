'use client';

import { motion } from 'framer-motion';

const logEntries = [
  {
    time: '14:32',
    title: 'PTW-2024-0892 Approved',
    description: 'Hot work permit for Pit A welding station approved by HSE Manager.',
    badge: 'Inspected',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    time: '13:58',
    title: 'Hazard Report: Chemical Spill Risk',
    description: 'Minor diesel leak detected near fuel depot. Containment crew dispatched.',
    badge: 'Alert',
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-amber-400/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    time: '12:45',
    title: 'PPE Inspection — Processing Plant',
    description: 'All 24 workers verified with complete PPE. No violations found.',
    badge: 'Safe',
    badgeColor: 'text-cyan-accent',
    badgeBg: 'bg-cyan-accent/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    time: '11:20',
    title: 'Emergency Drill Completed',
    description: 'Quarterly evacuation drill — Pit B. Response time: 3m 42s (target: 5m).',
    badge: 'Inspected',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    time: '10:05',
    title: 'Air Quality Index — Normal',
    description: 'PM2.5: 18 µg/m³, PM10: 34 µg/m³. All within safe thresholds.',
    badge: 'Safe',
    badgeColor: 'text-cyan-accent',
    badgeBg: 'bg-cyan-accent/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    time: '09:30',
    title: 'Shift Handover — Morning Crew',
    description: '48 workers checked in. Toolbox talk completed. Zero incidents overnight.',
    badge: 'Inspected',
    badgeColor: 'text-emerald-400',
    badgeBg: 'bg-emerald-400/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    time: '08:15',
    title: 'Heavy Equipment Pre-Check',
    description: 'CAT 785D haul truck #14 — brake inspection flagged. Grounded for repair.',
    badge: 'Alert',
    badgeColor: 'text-amber-400',
    badgeBg: 'bg-amber-400/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    time: '07:00',
    title: 'Weather Advisory Cleared',
    description: 'Rain warning from previous shift expired. Operations resumed at Pit C.',
    badge: 'Safe',
    badgeColor: 'text-cyan-accent',
    badgeBg: 'bg-cyan-accent/10',
    icon: (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-cyan-accent">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
];

export default function ComplianceLog() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      className="dashboard-card rounded-2xl p-6 h-full flex flex-col relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 bg-violet-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h2 className="text-base font-heading font-bold text-white">Live Safety Compliance Log</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Today&apos;s site activity feed</p>
        </div>
        <span className="text-[10px] font-heading font-medium text-slate-500 bg-white/[0.04] px-3 py-1 rounded-full">
          {logEntries.length} entries
        </span>
      </div>

      {/* Scrollable Log Feed */}
      <div className="relative z-10 flex-1 overflow-y-auto pr-1 space-y-0 min-h-0">
        {logEntries.map((entry, idx) => (
          <div
            key={idx}
            className={`flex gap-3 py-3.5 ${
              idx < logEntries.length - 1 ? 'border-b border-white/[0.04]' : ''
            } group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors`}
          >
            {/* Timeline + Icon */}
            <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
              <div className="w-7 h-7 rounded-lg bg-white/[0.04] flex items-center justify-center">
                {entry.icon}
              </div>
              <span className="text-[10px] text-slate-600 mt-1.5 font-mono">{entry.time}</span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-heading font-medium text-white truncate">
                  {entry.title}
                </p>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {entry.description}
              </p>
            </div>

            {/* Badge */}
            <span className={`text-[9px] font-heading font-medium ${entry.badgeColor} ${entry.badgeBg} px-2.5 py-1 rounded-full flex-shrink-0 self-start mt-0.5`}>
              {entry.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Fade gradient at bottom for scroll hint */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-midnight-card/80 to-transparent pointer-events-none z-20" />
    </motion.div>
  );
}
