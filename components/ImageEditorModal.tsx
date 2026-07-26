import React, { useState, useRef, useEffect } from 'react';
import { XMarkIcon } from './Icons';

interface ImageEditorModalProps {
  imageSrc: string;
  onSave: (customizedDataUrl: string) => void;
  onClose: () => void;
}

type FilterType = 'none' | 'vivid' | 'mono' | 'sepia' | 'cool' | 'warm';
type RingType = 'none' | 'gold' | 'blue' | 'emerald';

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ imageSrc, onSave, onClose }) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0); // in degrees
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filter, setFilter] = useState<FilterType>('none');
  const [brightness, setBrightness] = useState<number>(0); // -50 to 50
  const [contrast, setContrast] = useState<number>(0); // -50 to 50
  const [ring, setRing] = useState<RingType>('none');

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Load image
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imgRef.current = img;
      setImageLoaded(true);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Redraw canvas whenever parameters change
  useEffect(() => {
    if (!imageLoaded || !imgRef.current || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    ctx.clearRect(0, 0, size, size);

    // Apply background clipping circle or fill
    ctx.save();

    // Move to center for rotation & zoom transforms
    ctx.translate(size / 2 + pan.x, size / 2 + pan.y);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(zoom, zoom);

    // CSS-like filters on 2D context
    let filterStr = `brightness(${100 + brightness}%) contrast(${100 + contrast}%)`;
    if (filter === 'vivid') filterStr += ' saturate(160%) contrast(110%)';
    else if (filter === 'mono') filterStr += ' grayscale(100%)';
    else if (filter === 'sepia') filterStr += ' sepia(90%)';
    else if (filter === 'cool') filterStr += ' hue-rotate(180deg) saturate(120%)';
    else if (filter === 'warm') filterStr += ' sepia(30%) saturate(140%)';

    ctx.filter = filterStr;

    // Draw image centered
    const img = imgRef.current;
    const scaleFactor = Math.max(size / img.width, size / img.height);
    const drawW = img.width * scaleFactor;
    const drawH = img.height * scaleFactor;

    ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
    ctx.restore();

    // Reset filter
    ctx.filter = 'none';

    // Draw Ring Frame if selected
    if (ring !== 'none') {
      ctx.save();
      ctx.lineWidth = 12;
      if (ring === 'gold') {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#f59e0b');
        grad.addColorStop(1, '#d97706');
        ctx.strokeStyle = grad;
      } else if (ring === 'blue') {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#3b82f6');
        grad.addColorStop(1, '#1d4ed8');
        ctx.strokeStyle = grad;
      } else if (ring === 'emerald') {
        const grad = ctx.createLinearGradient(0, 0, size, size);
        grad.addColorStop(0, '#10b981');
        grad.addColorStop(1, '#047857');
        ctx.strokeStyle = grad;
      }
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [imageLoaded, zoom, rotation, pan, filter, brightness, contrast, ring]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleRotateLeft = () => setRotation((prev) => (prev - 90 + 360) % 360);
  const handleRotateRight = () => setRotation((prev) => (prev + 90) % 360);

  const handleReset = () => {
    setZoom(1);
    setRotation(0);
    setPan({ x: 0, y: 0 });
    setFilter('none');
    setBrightness(0);
    setContrast(0);
    setRing('none');
  };

  const handleApply = () => {
    if (!canvasRef.current) return;
    // Create final circular cropped output canvas
    const finalCanvas = document.createElement('canvas');
    const size = 300;
    finalCanvas.width = size;
    finalCanvas.height = size;
    const ctx = finalCanvas.getContext('2d');
    if (!ctx) return;

    // Clip to circle
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();

    // Draw contents from editing canvas
    ctx.drawImage(canvasRef.current, 0, 0);

    const dataUrl = finalCanvas.toDataURL('image/jpeg', 0.9);
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex justify-center items-center z-[60] p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#0f172a] rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-gray-200 dark:border-blue-900/30 overflow-hidden relative my-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100 dark:border-blue-900/20">
          <h3 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Customize Profile Image
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-blue-900/30 transition-all"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Canvas Preview Area with Circular Mask */}
          <div className="flex flex-col items-center">
            <div
              className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-blue-500/30 shadow-2xl cursor-grab active:cursor-grabbing bg-gray-900 flex items-center justify-center group"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <canvas ref={canvasRef} className="w-full h-full object-cover pointer-events-none" />
              <div className="absolute inset-0 rounded-full border-2 border-white/20 pointer-events-none group-hover:border-blue-400/50 transition-colors" />
              <div className="absolute bottom-2 text-[10px] font-bold text-white/70 bg-black/50 px-2 py-0.5 rounded-full pointer-events-none">
                Drag to Reposition
              </div>
            </div>

            {/* Quick Rotate & Reset Controls */}
            <div className="flex items-center gap-3 mt-4">
              <button
                type="button"
                onClick={handleRotateLeft}
                className="px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-blue-900/30 text-gray-700 dark:text-blue-200 rounded-xl hover:bg-gray-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                ↺ Rotate Left
              </button>
              <button
                type="button"
                onClick={handleRotateRight}
                className="px-3 py-1.5 text-xs font-bold bg-gray-100 dark:bg-blue-900/30 text-gray-700 dark:text-blue-200 rounded-xl hover:bg-gray-200 dark:hover:bg-blue-900/50 transition-colors"
              >
                ↻ Rotate Right
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1.5 text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/30 rounded-xl transition-colors ml-auto"
              >
                Reset All
              </button>
            </div>
          </div>

          {/* Zoom Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-blue-400/70 uppercase">
              <span>Zoom & Scale</span>
              <span>{(zoom * 100).toFixed(0)}%</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-blue-900/30 font-bold text-gray-700 dark:text-white hover:bg-gray-200"
              >
                -
              </button>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(2.5, z + 0.1))}
                className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-blue-900/30 font-bold text-gray-700 dark:text-white hover:bg-gray-200"
              >
                +
              </button>
            </div>
          </div>

          {/* Filter Preset Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-blue-400/70 uppercase tracking-widest">
              Color Filters
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {(
                [
                  { id: 'none', name: 'Normal' },
                  { id: 'vivid', name: 'Vivid' },
                  { id: 'mono', name: 'Mono' },
                  { id: 'sepia', name: 'Sepia' },
                  { id: 'cool', name: 'Cool' },
                  { id: 'warm', name: 'Warm' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFilter(f.id)}
                  className={`py-2 px-1 text-xs font-bold rounded-xl border transition-all ${
                    filter === f.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md scale-105'
                      : 'bg-gray-50 dark:bg-black/30 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-blue-900/20 hover:border-blue-400'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Brightness & Contrast Sliders */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-blue-400/70 uppercase">
                <span>Brightness</span>
                <span>{brightness > 0 ? `+${brightness}` : brightness}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={brightness}
                onChange={(e) => setBrightness(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-gray-500 dark:text-blue-400/70 uppercase">
                <span>Contrast</span>
                <span>{contrast > 0 ? `+${contrast}` : contrast}</span>
              </div>
              <input
                type="range"
                min="-50"
                max="50"
                value={contrast}
                onChange={(e) => setContrast(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>
          </div>

          {/* Avatar Accent Ring */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-gray-500 dark:text-blue-400/70 uppercase tracking-widest">
              Border Ring Accent
            </label>
            <div className="flex items-center gap-3">
              {[
                { id: 'none', label: 'None', bg: 'bg-gray-300 dark:bg-gray-700' },
                { id: 'gold', label: 'Gold', bg: 'bg-amber-500' },
                { id: 'blue', label: 'Blue', bg: 'bg-blue-500' },
                { id: 'emerald', label: 'Emerald', bg: 'bg-emerald-500' },
              ].map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRing(r.id as RingType)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all ${
                    ring === r.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 shadow'
                      : 'border-gray-200 dark:border-blue-900/20 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  <span className={`w-3 h-3 rounded-full ${r.bg}`} />
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-blue-900/30 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-blue-900/20 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xl shadow-blue-500/20 transition-all active:scale-95 text-sm"
            >
              Apply & Save Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
