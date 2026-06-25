'use client';

import { motion } from 'framer-motion';

const workers = [
  { name: 'Ahmad Rizki', site: 'Pit A — Drill Operator', bpm: 72, fatigue: 15, status: 'normal' as const },
  { name: 'Budi Santoso', site: 'Pit B — Haul Truck', bpm: 88, fatigue: 42, status: 'moderate' as const },
  { name: 'Dedi Kurniawan', site: 'Processing Plant', bpm: 68, fatigue: 8, status: 'normal' as const },
  { name: 'Fajar Hidayat', site: 'Pit A — Blasting Crew', bpm: 102, fatigue: 78, status: 'alert' as const },
  { name: 'Hendra Wijaya', site: 'Workshop — Mechanic', bpm: 76, fatigue: 22, status: 'normal' as const },
  { name: 'Irfan Maulana', site: 'Pit C — Excavator', bpm: 94, fatigue: 55, status: 'moderate' as const },
];

const statusConfig = {
  normal: { color: 'text-emerald-400', bg: 'bg-emerald-400/10', label: 'Normal' },
  moderate: { color: 'text-amber-400', bg: 'bg-amber-400/10', label: 'Moderate' },
  alert: { color: 'text-red-400', bg: 'bg-red-400/10', label: 'Alert' },
};

function getBpmColor(bpm: number) {
  if (bpm >= 100) return 'text-red-400';
  if (bpm >= 85) return 'text-amber-400';
  return 'text-emerald-400';
}

function getFatigueBarColor(fatigue: number) {
  if (fatigue >= 70) return 'bg-red-400';
  if (fatigue >= 40) return 'bg-amber-400';
  return 'bg-emerald-400';
}

export default function WorkerFatigueMonitor() {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      className="dashboard-card rounded-2xl p-6 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-5">
        <div>
          <h2 className="text-base font-heading font-bold text-white">IoT Wearable Sync</h2>
          <p className="text-[11px] text-slate-500 mt-0.5">Live Worker Fatigue Monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cyan-accent animate-pulse" />
          <span className="text-[10px] font-heading font-medium text-cyan-accent uppercase tracking-wider">
            {workers.length} Active
          </span>
        </div>
      </div>

      {/* Worker List */}
      <div className="relative z-10 space-y-0">
        {workers.map((worker, idx) => {
          const config = statusConfig[worker.status];
          return (
            <div
              key={worker.name}
              className={`flex items-center gap-4 py-3 ${
                idx < workers.length - 1 ? 'border-b border-white/[0.04]' : ''
              } group hover:bg-white/[0.02] -mx-2 px-2 rounded-lg transition-colors`}
            >
              {/* Pulse Icon */}
              <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center flex-shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={getBpmColor(worker.bpm)}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              </div>

              {/* Name & Site */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-heading font-medium text-white truncate">{worker.name}</p>
                <p className="text-[11px] text-slate-500 truncate">{worker.site}</p>
              </div>

              {/* Heart Rate */}
              <div className="text-right flex-shrink-0">
                <div className="flex items-center gap-1">
                  <span className={`text-sm font-heading font-bold ${getBpmColor(worker.bpm)}`}>
                    {worker.bpm}
                  </span>
                  <span className="text-[9px] text-slate-500">bpm</span>
                </div>
              </div>

              {/* Fatigue Bar */}
              <div className="flex-shrink-0 w-20">
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${getFatigueBarColor(worker.fatigue)} transition-all duration-500`}
                      style={{ width: `${worker.fatigue}%` }}
                    />
                  </div>
                  <span className={`text-[10px] font-heading font-medium ${config.color} w-8 text-right`}>
                    {worker.fatigue}%
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`text-[9px] font-heading font-medium ${config.color} ${config.bg} px-2 py-0.5 rounded-full flex-shrink-0`}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
