'use client';

import { motion } from 'framer-motion';
import SafetyMetricsRow from '@/components/safety/SafetyMetricsRow';
import SafetyIndexCard from '@/components/safety/SafetyIndexCard';
import WorkerFatigueMonitor from '@/components/safety/WorkerFatigueMonitor';
import ComplianceLog from '@/components/safety/ComplianceLog';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: 'easeOut' as const },
  },
};

export default function SafetyHubPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6"
    >
      {/* Page Header */}
      <motion.div variants={itemVariants} className="mb-2">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">Safety & K3 Hub</h1>
            <p className="text-slate-400 text-xs lg:text-sm">Real-time mining safety telemetry and compliance monitoring</p>
          </div>
        </div>
      </motion.div>

      {/* Top Row: Safety Metrics */}
      <SafetyMetricsRow variants={itemVariants} />

      {/* Main Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (45%) — Safety Index + Fatigue Monitor */}
        <div className="lg:col-span-5 space-y-6">
          <SafetyIndexCard />
          <WorkerFatigueMonitor />
        </div>

        {/* Right Column (55%) — Compliance Log */}
        <div className="lg:col-span-7">
          <ComplianceLog />
        </div>
      </div>
    </motion.div>
  );
}
