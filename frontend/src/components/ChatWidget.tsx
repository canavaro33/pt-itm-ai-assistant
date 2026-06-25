'use client';

import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';

interface ChatWidgetProps {
  onClick: () => void;
  onOpenAuth: () => void;
}

export default function ChatWidget({ onClick, onOpenAuth }: ChatWidgetProps) {
  const { isAuthenticated } = useAuth();

  const handleClick = () => {
    if (isAuthenticated) {
      onClick();
    } else {
      onOpenAuth();
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
      id="chat-widget-trigger"
      onClick={handleClick}
      className="fixed bottom-20 right-6 z-40 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 cursor-pointer hover:bg-white/10 hover:border-white/30 animate-pulse-glow group shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors"
    >
      {/* AI Icon */}
      <div className="w-9 h-9 rounded-xl bg-navy/20 flex items-center justify-center group-hover:bg-navy/30 transition-colors">
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-navy-light"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      </div>

      {/* Text */}
      <div className="text-left hidden sm:block">
        <div className="text-cream text-sm font-heading font-medium">
          Ask AI for Your Moment
        </div>
        <div className="text-white/30 text-[10px]">
          Safety • Wellness • Corporate
        </div>
      </div>

      {/* Arrow */}
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-white/40 group-hover:text-white/70 transition-colors group-hover:translate-x-0.5 transform duration-300 hidden sm:block"
      >
        <path d="M9 18l6-6-6-6" />
      </svg>
    </motion.button>
  );
}
