'use client';

import { motion, Variants } from 'framer-motion';

const metrics = [
  {
    label: 'Active Permits (PTW)',
    value: '24',
    trend: '+2 this week',
    trendUp: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-glow">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    accent: 'violet',
    bgColor: 'bg-violet-accent/10',
    textColor: 'text-violet-glow',
  },
  {
    label: 'Open Hazard Reports',
    value: '3',
    trend: '-1 from yesterday',
    trendUp: false,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
    accent: 'amber',
    bgColor: 'bg-amber-400/10',
    textColor: 'text-amber-400',
  },
  {
    label: 'Emergency Readiness',
    value: '98%',
    trend: 'All systems nominal',
    trendUp: true,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-emerald-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
    accent: 'emerald',
    bgColor: 'bg-emerald-400/10',
    textColor: 'text-emerald-400',
  },
];

interface SafetyMetricsRowProps {
  variants?: Variants;
}

export default function SafetyMetricsRow({ variants }: SafetyMetricsRowProps) {
  const content = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
      {metrics.map((metric, idx) => (
        <motion.div
          key={metric.label}
          variants={variants}
          className="dashboard-card rounded-2xl p-5 relative overflow-hidden group"
        >
          {/* Ambient glow */}
          <div className={`absolute -top-10 -right-10 w-32 h-32 ${metric.bgColor} rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700`} />
          
          <div className="relative z-10">
            {/* Icon + Value Row */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${metric.bgColor} flex items-center justify-center`}>
                {metric.icon}
              </div>
              <span className={`text-3xl font-heading font-black ${metric.textColor}`}>
                {metric.value}
              </span>
            </div>

            {/* Label */}
            <p className="text-sm font-heading font-medium text-white mb-1">
              {metric.label}
            </p>

            {/* Trend */}
            <div className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                className={metric.trendUp ? 'text-emerald-400' : 'text-amber-400'}
              >
                <path strokeLinecap="round" strokeLinejoin="round"
                  d={metric.trendUp ? 'M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25' : 'M4.5 4.5l15 15m0 0V8.25m0 11.25H8.25'}
                />
              </svg>
              <span className="text-[11px] text-slate-500">{metric.trend}</span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return content;
}
