'use client';

import ThreeScene from './ThreeScene';
import BottomBar from './BottomBar';
import { motion } from 'framer-motion';

export default function HeroSection({
  onOpenAuth,
  onOpenInfo,
}: {
  onOpenAuth: () => void;
  onOpenInfo: (category: string, title: string) => void;
}) {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-charcoal via-charcoal-light to-charcoal-medium" />

      {/* Radial navy glow - center right */}
      <div
        className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.07]"
        style={{
          background:
            'radial-gradient(circle, rgba(27, 58, 107, 0.8) 0%, rgba(27, 58, 107, 0) 70%)',
        }}
      />

      {/* Secondary subtle blue glow - top left */}
      <div
        className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
        style={{
          background:
            'radial-gradient(circle, rgba(74, 159, 212, 0.8) 0%, transparent 70%)',
        }}
      />

      {/* Noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 3D Scene */}
      <ThreeScene />

      {/* Hero Content - Left Side */}
      <div className="relative z-10 flex flex-col justify-center h-full px-8 lg:px-16 max-w-3xl pb-32 lg:pb-40">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-8">

        </div>

        {/* Headline */}
        <h1 className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.95] tracking-[-0.02em] mb-6">
          AI Wellness
          <br />
          <span className="text-gradient">Made Simple</span>
          <br />
          and Personal.
        </h1>

        {/* Subtitle */}
        <p className="text-cream/50 text-base lg:text-lg max-w-md leading-relaxed">
          Empowering PT ITM employees with intelligent wellness guidance, safety
          knowledge, and corporate insights — powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4 mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={onOpenAuth}
            className="px-7 py-3.5 rounded-full bg-navy hover:bg-navy-light text-white font-heading font-medium shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] text-sm transition-colors"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenInfo('corporate', 'About PT ITM')}
            className="px-7 py-3.5 rounded-full glass glass-hover text-cream/80 font-heading font-medium text-sm shadow-[0_8px_32px_0_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)] transition-colors"
          >
            Learn More
          </motion.button>
        </div>
      </div>

      {/* Bottom Bar */}
      <BottomBar />
    </section>
  );
}
