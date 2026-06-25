'use client';

export default function BottomBar() {
  return (
    <div className="absolute bottom-6 left-6 right-6 md:right-32 z-10">
      <div className="flex flex-col md:flex-row gap-3 max-w-4xl mx-auto md:ml-0 md:mr-auto">
        {/* Card 1 — Rating */}
        <div className="flex-1 glass glass-hover rounded-2xl p-5 cursor-pointer shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar stack */}
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-[10px] font-bold ring-2 ring-charcoal">
                BS
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-500/80 flex items-center justify-center text-[10px] font-bold ring-2 ring-charcoal">
                SR
              </div>
              <div className="w-8 h-8 rounded-full bg-emerald-500/80 flex items-center justify-center text-[10px] font-bold ring-2 ring-charcoal">
                AP
              </div>
            </div>
            <div>
              <span className="font-heading font-bold text-sm">2.5k+</span>
              <span className="text-cream/50 text-xs ml-1">(4.8)</span>
            </div>
            {/* Stars */}
            <div className="flex gap-0.5 ml-auto">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill={i < 4 ? '#1B3A6B' : 'none'}
                  stroke="#1B3A6B"
                  strokeWidth="2"
                >
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
              ))}
            </div>
          </div>
          <p className="text-cream/40 text-xs leading-relaxed">
            Personalized corporate AI recommendations powered by advanced language models.
          </p>
        </div>

        {/* Card 2 — Quote */}

        {/* Card 3 — Safety Briefing */}
      </div>
    </div>
  );
}
