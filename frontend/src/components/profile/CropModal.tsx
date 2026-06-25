'use client';

import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';

interface CropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCancel: () => void;
  onApply: (croppedBlob: Blob) => void;
}

/**
 * Generate a circular-cropped image blob from the source image + crop area.
 */
async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area
): Promise<Blob> {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;
  const size = Math.min(pixelCrop.width, pixelCrop.height);
  canvas.width = size;
  canvas.height = size;

  // Draw circular clip
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    size,
    size
  );

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Canvas is empty'));
      },
      'image/jpeg',
      0.9
    );
  });
}

export default function CropModal({ isOpen, imageSrc, onCancel, onApply }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    setIsProcessing(true);
    try {
      const blob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onApply(blob);
    } catch (error) {
      console.error('Crop error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      >
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          onClick={onCancel}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative w-full max-w-md dashboard-card rounded-2xl p-6 lg:p-8"
        >
          {/* Close button */}
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center hover:bg-white/10 transition-colors z-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-heading font-bold text-white">Sesuaikan Foto Profil</h2>
            <p className="text-sm text-slate-400 mt-1">Geser dan zoom untuk menyesuaikan foto Anda</p>
          </div>

          {/* Crop Area */}
          <div className="relative w-full aspect-square max-w-[300px] mx-auto rounded-2xl overflow-hidden bg-midnight-card mb-6">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          {/* Zoom Slider */}
          <div className="mb-6 px-2">
            <div className="flex items-center gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="range"
                min={1}
                max={3}
                step={0.01}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-accent [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-violet-accent [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.4)]"
              />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 flex-shrink-0">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
                <path d="M11 8v6M8 11h6" />
              </svg>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 rounded-xl bg-white/[0.06] border border-white/10 text-sm font-heading font-medium text-white hover:bg-white/10 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleApply}
              disabled={isProcessing}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-violet-accent to-violet-glow text-sm font-heading font-medium text-white shadow-[0_4px_20px_rgba(139,92,246,0.3)] hover:shadow-[0_4px_30px_rgba(139,92,246,0.5)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Memproses...
                </>
              ) : (
                'Terapkan Foto'
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
