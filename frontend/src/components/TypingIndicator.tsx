'use client';

export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 message-in">
      <div className="w-8 h-8 rounded-full bg-terracotta/20 flex items-center justify-center text-[10px] font-bold text-terracotta-light flex-shrink-0">
        AI
      </div>
      <div className="glass rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-2">
        <span
          className="w-2 h-2 bg-cream/50 rounded-full animate-bounce-dot"
          style={{ animationDelay: '0s' }}
        />
        <span
          className="w-2 h-2 bg-cream/50 rounded-full animate-bounce-dot"
          style={{ animationDelay: '0.16s' }}
        />
        <span
          className="w-2 h-2 bg-cream/50 rounded-full animate-bounce-dot"
          style={{ animationDelay: '0.32s' }}
        />
      </div>
    </div>
  );
}
