'use client';

import { TriangleAlert as AlertTriangle, Loader as Loader2 } from 'lucide-react';

interface Props {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', loading, onConfirm, onCancel }: Props) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white w-full max-w-sm shadow-2xl p-6">
        <div className="flex items-start gap-4 mb-5">
          <div className="w-10 h-10 bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-[#D61C1C]" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-zinc-900 mb-1">{title}</h3>
            <p className="text-sm text-zinc-500 leading-relaxed">{message}</p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 text-sm text-zinc-600 border border-zinc-200 hover:border-zinc-400 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm bg-[#D61C1C] text-white font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
