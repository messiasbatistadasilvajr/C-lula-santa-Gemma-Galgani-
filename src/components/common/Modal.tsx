import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || typeof document === 'undefined') return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md mx-auto my-auto rounded-2xl bg-[#FAF8F5] shadow-2xl border border-[#ECE7DF] max-h-[88dvh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-[#241E1C]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 border-b border-[#ECE7DF] px-4 py-3.5 bg-[#F4EFEB] shrink-0">
          <div className="min-w-0 flex-1">
            <h3 id="modal-title" className="text-sm sm:text-base font-bold text-[#36070D] font-cinzel leading-snug">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-[#70645E] mt-0.5 leading-snug">{subtitle}</p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar modal"
            className="p-1.5 rounded-full text-[#70645E] hover:bg-[#E5DFD7] hover:text-[#36070D] transition shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1 overscroll-contain">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

