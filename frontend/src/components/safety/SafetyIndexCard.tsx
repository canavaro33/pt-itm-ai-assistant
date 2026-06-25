'use client';

import { motion } from 'framer-motion';

export default function SafetyIndexCard() {
  const score = 98.5;
  // SVG circle params: r=90, circumference = 2 * PI * 90 ≈ 565.49
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
      }}
      className="dashboard-card rounded-2xl p-6 lg:p-8 relative overflow-hidden group animate-safety-pulse"
    >
      {/* Large ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-accent/8 rounded-full blur-3xl group-hover:bg-violet-accent/15 transition-colors duration-1000" />
      <div className="absolute bottom-0 right-0 w-48 h-48 bg-cyan-accent/5 rounded-full blur-3xl" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-heading font-bold text-white">Site Safety Index</h2>
          <p className="text-xs text-slate-500 mt-0.5">Real-time composite safety score</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-heading font-medium text-emerald-400 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* Central Score Display */}
      <div className="relative z-10 flex items-center justify-center py-4">
        <div className="relative w-52 h-52">
          {/* SVG Progress Ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
            {/* Background ring */}
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="8"
            />
            {/* Progress ring */}
            <circle
              cx="100" cy="100" r="90"
              fill="none"
              stroke="url(#safetyGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
            />
            {/* Gradient definition */}
            <defs>
              <linearGradient id="safetyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8B5CF6" />
                <stop offset="50%" stopColor="#06B6D4" />
                <stop offset="100%" stopColor="#10B981" />
              </linearGradient>
            </defs>
          </svg>

          {/* Score Text (LED-style) */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="led-digit text-5xl font-black tracking-tight">
              98.5
            </span>
            <span className="text-lg font-heading font-bold text-slate-400 mt-1">%</span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mt-2 font-heading">
              Composite Score
            </span>
          </div>
        </div>
      </div>

      {/* Sub-metrics */}
      <div className="relative z-10 grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-white">0</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Fatalities</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-emerald-400">142</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Safe Days</p>
        </div>
        <div className="text-center">
          <p className="text-xl font-heading font-bold text-cyan-accent">A+</p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Rating</p>
        </div>
      </div>
    </motion.div>
  );
}
