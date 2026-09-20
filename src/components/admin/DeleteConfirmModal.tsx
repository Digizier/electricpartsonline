'use client';

import React, { useEffect } from 'react';
import { Trash2, AlertTriangle, X, Loader2 } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: React.ReactNode;
  itemName?: string;
  confirmText?: string;
  cancelText?: string;
  isDeleting?: boolean;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
}

export function DeleteConfirmModal({
  isOpen,
  title,
  message,
  itemName,
  confirmText = 'Yes, Delete',
  cancelText = 'Cancel',
  isDeleting = false,
  onConfirm,
  onClose,
}: DeleteConfirmModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isDeleting) onClose();
      }}
    >
      <div
        className="relative bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-5 sm:p-6 text-left my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isDeleting}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        {/* Title */}
        <h3 className="text-lg font-black text-white tracking-tight">
          {title}
        </h3>

        {/* Optional Highlighted Item Name */}
        {itemName && (
          <div className="mt-2 p-2.5 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs font-mono font-bold text-orange-400 break-words">
            {itemName}
          </div>
        )}

        {/* Description Message */}
        <div className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
          {message}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-xs sm:text-sm transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-950/50 transition-colors disabled:opacity-50"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
