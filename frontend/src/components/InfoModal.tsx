'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

type KnowledgeEntry = {
  topic: string;
  content: string;
};

export default function InfoModal({
  isOpen,
  onClose,
  category,
  headerTitle,
}: {
  isOpen: boolean;
  onClose: () => void;
  category: string;
  headerTitle: string;
}) {
  const [entries, setEntries] = useState<KnowledgeEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && category) {
      setIsLoading(true);
      fetch(`${API_BASE}/api/knowledge?category=${category}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.entries) {
            setEntries(data.entries);
          }
        })
        .catch((err) => console.error('Failed to fetch knowledge:', err))
        .finally(() => setIsLoading(false));
    }
  }, [isOpen, category]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 backdrop-blur-xl bg-charcoal/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[80vh] flex flex-col bg-white/5 backdrop-blur-xl border border-white/15 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            
            {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-heading font-bold mb-6 text-center shrink-0">
          {headerTitle}
        </h2>

        <div className="overflow-y-auto pr-2 space-y-8">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 rounded-full border-2 border-navy border-t-white animate-spin"></div>
            </div>
          ) : entries.length > 0 ? (
            entries.map((entry, idx) => (
              <div key={idx} className="border-b border-white/5 pb-6 last:border-0 last:pb-0">
                <h3 className="text-lg font-heading font-extrabold text-modal-accent tracking-wide mb-3">{entry.topic}</h3>
                <p className="text-white/60 text-sm leading-[1.75] whitespace-pre-wrap">{entry.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-white/50 text-sm">No information available for this category.</p>
          )}
        </div>
      </motion.div>
    </div>
    )}
    </AnimatePresence>
  );
}
