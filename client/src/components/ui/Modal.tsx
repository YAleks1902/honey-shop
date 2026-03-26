import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export default function Modal({ open, onClose, title, children, className }: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/20 pt-20"
      onClick={onClose}
    >
      <div
        className={cn('relative w-full max-w-xl bg-white px-10 py-10 shadow-xl', className)}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-700"
          aria-label="Закрыть"
        >
          <X size={20} />
        </button>
        {title && <h2 className="mb-8 text-2xl font-light text-gray-900">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
