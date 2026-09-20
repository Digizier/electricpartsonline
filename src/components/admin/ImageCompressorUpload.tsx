'use client';

import React, { useState, useRef } from 'react';
import { uploadImageToSupabase } from '@/lib/supabase';
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Trash2 } from 'lucide-react';

interface ImageCompressorUploadProps {
  onImageUploaded: (url: string) => void;
  existingUrl?: string;
  folder?: string;
  label?: string;
}

export function ImageCompressorUpload({
  onImageUploaded,
  existingUrl,
  folder = 'products',
  label = 'Product Image',
}: ImageCompressorUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(existingUrl || null);
  const [fileStats, setFileStats] = useState<{ sizeKB: number; originalName: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsUploading(true);

    try {
      // In-browser WebP compression and Cloud Storage upload
      const result = await uploadImageToSupabase(file, folder);
      setPreview(result.url);
      setFileStats({ sizeKB: result.sizeKB, originalName: result.originalName });
      onImageUploaded(result.url);
    } catch (err: any) {
      console.error('Image compression upload failed:', err);
      setError(err?.message || 'Failed to upload image.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleClear = () => {
    setPreview(null);
    setFileStats(null);
    onImageUploaded('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      {label && <label className="block text-xs font-bold text-slate-300">{label}</label>}

      {preview ? (
        <div className="relative w-full rounded-2xl border border-slate-700/80 bg-slate-950 p-2.5 flex items-center gap-3 shadow-inner">
          <img
            src={preview}
            alt="Uploaded Preview"
            className="w-16 h-16 object-contain bg-slate-900 rounded-xl border border-slate-700 p-1 flex-shrink-0"
          />
          <div className="flex-1 min-w-0 text-xs">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Optimized WebP Uploaded</span>
            </div>
            {fileStats && (
              <p className="text-[11px] text-slate-400 mt-0.5">
                Size: <span className="font-bold text-white">{fileStats.sizeKB} KB</span> (95%+ smaller)
              </p>
            )}
            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-mono">{preview}</p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Remove image"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-slate-700 hover:border-orange-500 rounded-2xl p-5 text-center cursor-pointer transition-all bg-slate-950/60 hover:bg-slate-900"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          {isUploading ? (
            <div className="flex flex-col items-center gap-2 text-orange-400">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">Compressing to WebP & Uploading to Cloud Storage...</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1.5">
              <UploadCloud className="w-6 h-6 text-orange-400" />
              <span className="text-xs font-bold text-white">
                Click to upload image
              </span>
              <span className="text-[11px] text-slate-400">
                PNG, JPG, BMP auto-compressed into lightweight WebP in KB size
              </span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-400 font-medium">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
