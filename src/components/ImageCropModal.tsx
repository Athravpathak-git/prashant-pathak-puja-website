'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  RotateCw,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Check,
  X,
  Move,
  RefreshCw,
  Loader2,
  Sparkles,
} from 'lucide-react';

export interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onClose: () => void;
  onSave: (croppedBlob: Blob, filename: string) => void;
  aspectRatio?: number; // width / height, e.g. 1 for square, 4/3, 16/9, 4/5
  title?: string;
  isSaving?: boolean;
}

export function ImageCropModal({
  isOpen,
  imageSrc,
  onClose,
  onSave,
  aspectRatio = 1,
  title = 'छायाचित्र संपादन / Crop & Rotate Photograph',
  isSaving = false,
}: ImageCropModalProps) {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const [currentAspect, setCurrentAspect] = useState<number>(aspectRatio);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize and load image
  useEffect(() => {
    if (!isOpen || !imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imgRef.current = img;
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setCurrentAspect(aspectRatio);
    };
  }, [isOpen, imageSrc, aspectRatio]);

  // Redraw canvas whenever zoom, rotation, pan, or aspect changes
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fixed high-resolution canvas dimension for crisp rendering
    const baseWidth = 800;
    const baseHeight = Math.round(800 / currentAspect);
    canvas.width = baseWidth;
    canvas.height = baseHeight;

    ctx.clearRect(0, 0, baseWidth, baseHeight);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    ctx.save();

    // Center point translation + pan
    // Pan offset is scaled relative to canvas width
    ctx.translate(baseWidth / 2 + pan.x, baseHeight / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // Calculate dimensions to cover canvas bounds
    // Note: If rotated by 90 or 270 deg, aspect switches
    const isRotatedQuarter = rotation % 180 !== 0;
    const effectiveImgWidth = isRotatedQuarter ? img.height : img.width;
    const effectiveImgHeight = isRotatedQuarter ? img.width : img.height;

    const scale = Math.max(baseWidth / effectiveImgWidth, baseHeight / effectiveImgHeight);
    const drawWidth = img.width * scale;
    const drawHeight = img.height * scale;

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();
  }, [currentAspect, pan, rotation, zoom]);

  useEffect(() => {
    if (imgRef.current) {
      drawCanvas();
    }
  }, [drawCanvas]);

  // Pointer Drag Handlers (works for mouse and touch on mobile)
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y,
    };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      setIsDragging(false);
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    }
  };

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (blob) {
          onSave(blob, `photo_${Date.now()}.jpg`);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  if (!isOpen) return null;

  const aspectOptions = [
    { label: '1:1 (चौरस / Square)', val: 1 },
    { label: '4:3 (मानक / Standard)', val: 4 / 3 },
    { label: '16:9 (वाइड / Landscape)', val: 16 / 9 },
  ];

  // If a custom aspect was passed (like 4/5 for Guruji profile photo), add it to options
  if (aspectRatio && !aspectOptions.some((opt) => Math.abs(opt.val - aspectRatio) < 0.02)) {
    aspectOptions.unshift({ label: '४:५ (प्रोफाईल / Portrait)', val: aspectRatio });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4 backdrop-blur-sm overflow-y-auto">
      <div className="bg-ivory-50 border-2 border-gold-400 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col my-auto overflow-hidden">
        {/* Fixed Header */}
        <div className="bg-maroon-900 text-gold-100 px-4 sm:px-6 py-3.5 flex items-center justify-between border-b border-gold-500/40 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg font-bold text-gold-300">ॐ</span>
            <h3 className="font-serif font-bold text-sm sm:text-base text-gold-100 truncate">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gold-200 hover:text-white p-1 rounded-lg hover:bg-maroon-800/60 transition-colors"
            title="बंद करा (Close)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Middle Content */}
        <div className="overflow-y-auto flex-1 p-3 sm:p-5 space-y-4">
          {/* Canvas Preview Container */}
          <div className="relative">
            <div
              ref={containerRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
              className="w-full bg-charcoal-950 rounded-xl border border-gold-500/30 flex items-center justify-center relative select-none touch-none overflow-hidden cursor-grab active:cursor-grabbing p-2 min-h-[220px] sm:min-h-[280px]"
            >
              <canvas
                ref={canvasRef}
                className="max-h-[220px] sm:max-h-[270px] max-w-full object-contain shadow-2xl border border-gold-400/40 rounded-lg"
              />

              {/* Floating Helper Tag */}
              <div className="absolute bottom-2 left-2 bg-black/75 text-gold-200 text-[10px] sm:text-[11px] px-2.5 py-1 rounded-md flex items-center gap-1.5 pointer-events-none backdrop-blur-xs border border-gold-500/20">
                <Move className="w-3 h-3 text-saffron-400" />
                <span>ड्रॅग करून स्थान बदला (Drag to Pan)</span>
              </div>
            </div>
          </div>

          {/* Aspect Ratio Selector */}
          <div className="bg-white p-3 rounded-xl border border-gold-300/80 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-maroon-950">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
                आकार गुणोत्तर (Aspect Ratio):
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {aspectOptions.map((asp) => {
                const isActive = Math.abs(currentAspect - asp.val) < 0.02;
                return (
                  <button
                    key={asp.label}
                    type="button"
                    onClick={() => setCurrentAspect(asp.val)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold border transition-all text-center truncate ${
                      isActive
                        ? 'bg-maroon-800 text-gold-100 border-gold-500 shadow-sm'
                        : 'bg-ivory-50 text-charcoal-800 border-gold-300 hover:bg-gold-50'
                    }`}
                  >
                    {asp.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Zoom & Rotation Controls */}
          <div className="bg-white p-3 rounded-xl border border-gold-300/80 shadow-xs space-y-3">
            {/* Zoom Slider */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-maroon-950 flex items-center gap-1">
                  <ZoomIn className="w-3.5 h-3.5 text-saffron-600" />
                  झूम (Zoom):
                </span>
                <span className="font-mono text-xs font-bold text-saffron-700">
                  {zoom.toFixed(1)}x
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.max(1, +(z - 0.1).toFixed(1)))}
                  className="p-1 rounded bg-ivory-100 hover:bg-gold-100 text-charcoal-700 border border-gold-200"
                  title="झूम कमी"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <input
                  type="range"
                  min="1"
                  max="3.5"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="flex-1 accent-maroon-800 cursor-pointer h-1.5 bg-gold-200 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setZoom((z) => Math.min(3.5, +(z + 0.1).toFixed(1)))}
                  className="p-1 rounded bg-ivory-100 hover:bg-gold-100 text-charcoal-700 border border-gold-200"
                  title="झूम वाढवा"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Rotate & Reset */}
            <div className="pt-2 border-t border-gold-200/60 flex items-center justify-between flex-wrap gap-2 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-maroon-950">फिरवा (Rotate):</span>
                <span className="font-mono font-bold text-xs text-charcoal-700">{rotation}°</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                  className="px-2.5 py-1.5 bg-ivory-50 border border-gold-300 rounded-lg hover:bg-gold-100 text-maroon-950 font-medium flex items-center gap-1 transition"
                  title="९० अंश डावीकडे"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-saffron-600" />
                  <span>९०° डावीकडे</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  className="px-2.5 py-1.5 bg-ivory-50 border border-gold-300 rounded-lg hover:bg-gold-100 text-maroon-950 font-medium flex items-center gap-1 transition"
                  title="९० अंश उजवीकडे"
                >
                  <RotateCw className="w-3.5 h-3.5 text-saffron-600" />
                  <span>९०° उजवीकडे</span>
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-2.5 py-1.5 bg-ivory-50 border border-gold-300 rounded-lg hover:bg-gold-100 text-charcoal-700 font-medium flex items-center gap-1 transition"
                  title="पुन्हा सेट करा"
                >
                  <RefreshCw className="w-3 h-3 text-charcoal-500" />
                  <span>रीसेट</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Fixed Footer Buttons */}
        <div className="px-4 sm:px-6 py-3 bg-ivory-200 border-t border-gold-300 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 text-xs font-semibold text-charcoal-700 bg-white border border-gold-300 rounded-xl hover:bg-ivory-50 transition"
          >
            रद्द करा (Cancel)
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 text-xs font-bold text-gold-100 bg-maroon-800 hover:bg-maroon-900 rounded-xl shadow-md flex items-center gap-2 border border-gold-400 transition disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-gold-300" />
                <span>अपलोड होत आहे...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-gold-300" />
                <span>फोटो जतन करा (Save & Apply)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
