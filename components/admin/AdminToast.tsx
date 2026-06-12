'use client';

import { useEffect } from 'react';
import { CircleCheck as CheckCircle2, Circle as XCircle, X } from 'lucide-react';

interface Props {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

export default function AdminToast({ message, type = 'success', onClose }: Props) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 bg-white border border-zinc-200 shadow-xl px-4 py-3 max-w-sm animate-in slide-in-from-bottom-2 duration-200">
      {type === 'success'
        ? <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
        : <XCircle className="w-4 h-4 text-[#D61C1C] flex-shrink-0" />}
      <p className="text-sm text-zinc-800 flex-1">{message}</p>
      <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 flex-shrink-0">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
