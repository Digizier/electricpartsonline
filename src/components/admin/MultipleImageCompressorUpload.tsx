'use client';

import React, { useState, useRef } from 'react';
import { uploadImageToSupabase } from '@/lib/supabase';
import { Upload, X, Star, Loader2, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface MultipleImageCompressorUploadProps {
  images: string[];
  thumbnailUrl?: string;
  onImagesChange: (images: string[], primaryUrl: string) => void;
}

export function MultipleImageCompressorUpload({
  images = [],
  thumbnailUrl = '',
  onImagesChange,
}: MultipleImageCompressorUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const primaryImage = thumbnailUrl || images[0] || '';

  const handleFiles = async (files: FileList | File[]) => {
    const fileArray = Array.from(files).filter((file) =>
      file.type.startsWith('image/')
    );

    if (fileArray.length === 0) {
      setErrorMsg('Please select valid image files (JPG, PNG, WebP).');
      return;
    }

    setIsUploading(true);
    setErrorMsg(null);
    const newUploadedUrls: string[] = [];

    try {
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        setUploadStatus(`Optimizing & uploading ${i + 1} of ${fileArray.length}...`);
        const { url, sizeKB } = await uploadImageToSupabase(file, 'catalog');
        newUploadedUrls.push(url);
      }

      const updatedImages = [...images, ...newUploadedUrls];
      const updatedPrimary = primaryImage || updatedImages[0] || '';
      onImagesChange(updatedImages, updatedPrimary);
      setUploadStatus(`Successfully uploaded ${newUploadedUrls.length} image(s)!`);
      setTimeout(() => setUploadStatus(null), 3000);
    } catch (err: any) {
      console.error('Upload failed:', err);
      setErrorMsg(err.message || 'Failed to compress and upload images.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleSetPrimary = (url: string) => {
    onImagesChange(images, url);
  };

  const handleRemoveImage = (urlToRemove: string) => {
    const updatedImages = images.filter((url) => url !== urlToRemove);
    let updatedPrimary = primaryImage;
    if (primaryImage === urlToRemove) {
      updatedPrimary = updatedImages[0] || '';
    }
    onImagesChange(updatedImages, updatedPrimary);
  };

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-orange-500 bg-orange-50/50'
            : 'border-slate-300 hover:border-orange-400 bg-slate-50/50 hover:bg-slate-50'
        } ${isUploading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center gap-2">
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-orange-600">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="text-xs font-bold">{uploadStatus}</span>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mb-1 shadow-sm">
                <Upload className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-800">
                Click to upload multiple images or drag & drop here
              </p>
              <p className="text-xs text-slate-500 max-w-sm">
                Automatic high-efficiency client-side WebP compression (sub-100KB per photo) stored directly on cloud storage.
              </p>
            </>
          )}
        </div>
      </div>

      {uploadStatus && !isUploading && (
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {errorMsg && (
        <div className="flex items-center gap-2 text-xs font-bold text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg">
          <X className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Images Gallery Grid */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
              <span>Product Image Gallery ({images.length} images)</span>
            </label>
            <span className="text-[11px] text-slate-400">Click star to set main cover photo</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((url, idx) => {
              const isPrimary = url === primaryImage;
              return (
                <div
                  key={url + idx}
                  className={`relative group rounded-xl overflow-hidden border-2 transition-all bg-slate-100 ${
                    isPrimary
                      ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="aspect-square w-full relative flex items-center justify-center p-2 bg-white">
                    <img
                      src={url}
                      alt={`Product preview ${idx + 1}`}
                      className="w-full h-full object-contain"
                      loading="lazy"
                    />
                  </div>

                  {/* Primary Badge */}
                  {isPrimary && (
                    <div className="absolute top-1.5 left-1.5 bg-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow">
                      <Star className="w-3 h-3 fill-current" />
                      <span>Primary Cover</span>
                    </div>
                  )}

                  {/* Action Buttons Overlay */}
                  <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    {!isPrimary && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSetPrimary(url);
                        }}
                        className="px-2 py-1 bg-white hover:bg-orange-50 text-slate-800 hover:text-orange-600 rounded-md text-[11px] font-bold shadow flex items-center gap-1 transition-colors"
                        title="Set as main cover image"
                      >
                        <Star className="w-3 h-3" />
                        <span>Set Primary</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveImage(url);
                      }}
                      className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-md text-xs shadow transition-colors"
                      title="Delete this image"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
