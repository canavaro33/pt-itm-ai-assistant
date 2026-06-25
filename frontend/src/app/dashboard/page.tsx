'use client';

import { useAuth } from '@/lib/auth-context';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from 'recharts';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.25, ease: "easeOut" as const } 
  }
};

// --- Mock Data ---
const volumeData = [
  { name: 'W1', queries: 120 },
  { name: 'W2', queries: 150 },
  { name: 'W3', queries: 180 },
  { name: 'W4', queries: 170 },
  { name: 'W5', queries: 210 },
  { name: 'W6', queries: 250 },
  { name: 'W7', queries: 280 },
  { name: 'W8', queries: 340 },
];

const safetyData = [
  { name: 'PTW', value: 45 },
  { name: 'APD Regs', value: 30 },
  { name: 'Machinery', value: 25 },
];
const COLORS = ['#8B5CF6', '#06B6D4', '#10B981'];

const deptData = [
  { name: 'Ops', value: 68 },
  { name: 'HSE', value: 92 },
  { name: 'HR', value: 54 },
];

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold mb-2">Welcome back, {user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-slate-400 text-sm lg:text-base">Here&apos;s what&apos;s happening with your AI today</p>
      </div>

      {/* Safety Notification Banner */}
      <div className="flex items-center gap-3 p-4 rounded-r-xl bg-gradient-to-r from-amber-500/10 to-transparent border-l-4 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-500">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <span className="text-amber-500 text-xs lg:text-sm font-heading font-medium">Active Weather Alert: Site A Pit Operations Paused</span>
      </div>

      {/* Widgets Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        
        {/* Widget 1: Chat History & Volume */}
        <motion.div variants={itemVariants} className="col-span-1 lg:col-span-2 dashboard-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-violet-accent/8 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover:bg-violet-accent/15 transition-colors duration-700" />
          <h2 className="text-sm font-heading font-medium text-slate-400 mb-6">Chat Volume (Last 8 Weeks)</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorQueries" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="50%" stopColor="#06B6D4" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#131127', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="queries" stroke="#8B5CF6" strokeWidth={3} fillOpacity={1} fill="url(#colorQueries)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Widget 2: Total Activity Indicator */}
        <motion.div variants={itemVariants} className="dashboard-card rounded-2xl p-6 flex flex-col relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-violet-soft/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4 group-hover:bg-violet-accent/20 transition-colors duration-700" />
          <h2 className="text-sm font-heading font-medium text-slate-400 mb-2 relative z-10">Total Activity</h2>
          <div className="flex-1 flex flex-col justify-center relative z-10">
            <div className="text-5xl font-heading font-black text-white tracking-tight mb-2">1,847</div>
            <div className="text-sm text-slate-400">queries resolved</div>
            <div className="mt-4 flex items-center gap-2 text-emerald-400 text-sm font-medium">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              +8.2% this month
            </div>
          </div>
        </motion.div>

        {/* Widget 3: K3 Safety Query Trends */}
        <motion.div variants={itemVariants} className="dashboard-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 left-1/2 w-48 h-48 bg-cyan-accent/8 rounded-full blur-3xl -translate-y-1/2 -translate-x-1/2 group-hover:bg-cyan-accent/15 transition-colors duration-700" />
          <h2 className="text-sm font-heading font-medium text-slate-400 mb-2 relative z-10">Safety Query Trends</h2>
          <div className="h-48 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={safetyData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {safetyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#131127', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs text-slate-400 mt-2 relative z-10">
            {safetyData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Widget 4: Department Engagement */}
        <motion.div variants={itemVariants} className="dashboard-card rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-accent/8 rounded-full blur-3xl translate-y-1/2 translate-x-1/4 group-hover:bg-violet-accent/15 transition-colors duration-700" />
          <h2 className="text-sm font-heading font-medium text-slate-400 mb-6 relative z-10">Department Engagement</h2>
          <div className="h-48 relative z-10">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff30" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  cursor={{ fill: 'rgba(139,92,246,0.06)' }}
                  contentStyle={{ backgroundColor: '#131127', border: '1px solid rgba(139,92,246,0.2)', borderRadius: '8px' }}
                />
                <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Widget 5: AI Accuracy & Feedback + Widget 6: Knowledge Base Sync Status */}
        <motion.div variants={itemVariants} className="dashboard-card rounded-2xl p-6 flex flex-col gap-8">
          
          {/* AI Accuracy */}
          <div>
            <div className="flex justify-between items-end mb-3">
              <h2 className="text-sm font-heading font-medium text-slate-400">AI Accuracy & Feedback</h2>
              <span className="text-xs font-heading font-bold text-white">94%</span>
            </div>
            <div className="h-2 w-full bg-white/[0.06] rounded-full overflow-hidden flex">
              <div className="h-full bg-emerald-400" style={{ width: '94%' }} />
              <div className="h-full bg-red-400/80" style={{ width: '6%' }} />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 mt-2">
              <span>Helpful</span>
              <span>Needs Improvement</span>
            </div>
          </div>

          {/* Knowledge Base Status */}
          <div className="flex-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-gradient-to-br from-violet-accent/10 to-cyan-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="relative z-10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-accent/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-violet-glow">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-heading font-medium text-white mb-1">SOP Database: Updated 2 hours ago</p>
                  <p className="text-xs text-slate-500">Total Corporate Documents Indexed: 1,240 files</p>
                </div>
             </div>
          </div>

        </motion.div>

      </motion.div>
    </div>
  );
}
