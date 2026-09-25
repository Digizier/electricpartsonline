'use client';

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  productName: string;
  isInStock?: boolean;
}

export function ImageGallery({ images, productName, isInStock = true }: ImageGalleryProps) {
  const displayImages = images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&q=80',
    'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&q=80',
    'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&q=80'
  ];

  const [activeImage, setActiveImage] = useState(displayImages[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Vertical Thumbnails (Desktop) / Horizontal (Mobile) */}
      <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[460px] pb-2 md:pb-0">
        {displayImages.map((img, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveImage(img)}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-50 border-2 p-1 flex-shrink-0 transition-all ${
              activeImage === img
                ? 'border-[#FF6A00] shadow-sm'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <img
              src={img}
              alt={`${productName} Commercial Equipment Part - View ${idx + 1}`}
              className="w-full h-full object-contain"
            />
          </button>
        ))}
      </div>

      {/* Main Image Viewport with Hover Zoom */}
      <div
        className="relative flex-1 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-6 sm:p-8 cursor-crosshair min-h-[360px] sm:min-h-[460px]"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        {/* In Stock Badge */}
        {isInStock && (
          <div className="absolute top-4 left-4 z-10 bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>In Stock</span>
          </div>
        )}

        {/* Main Image */}
        <img
          src={activeImage}
          alt={`${productName} - Genuine Commercial Equipment Part - Usman Traders Pakistan`}
          className={`w-full max-h-[420px] object-contain transition-transform duration-200 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                }
              : undefined
          }
        />

        {/* Roll Over Hint */}
        <div className="absolute bottom-3 text-[11px] font-semibold text-slate-400 pointer-events-none select-none">
          🔍 Roll over image to zoom
        </div>
      </div>
    </div>
  );
}
