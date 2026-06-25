'use client';

import Spline from '@splinetool/react-spline/next';
import { Suspense } from 'react';

// A simple loading fallback in the navy theme
const SplineLoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center">
    <div className="w-16 h-16 border-4 border-navy border-t-cream rounded-full animate-spin" />
  </div>
);

export default function ThreeScene() {
  return (
    <div
      className="absolute right-0 top-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] lg:w-[700px] lg:h-[700px] overflow-hidden pointer-events-none"
      style={{ 
        zIndex: 1, 
        filter: 'drop-shadow(0 0 40px rgba(74, 127, 212, 0.3))'
      }}
    >
      <Suspense fallback={<SplineLoadingFallback />}>
        <div className="w-full h-full">
          <Spline scene="https://prod.spline.design/Q29jMtokYa8RwvNN/scene.splinecode" />
        </div>
      </Suspense>
    </div>
  );
}
