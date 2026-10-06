import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageCircle, Sparkles } from 'lucide-react';
import { MeetingScale } from '../../types';

interface WhatsAppSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  scale: MeetingScale;
  summaryText: string;
  shareUrl: string;
}

export const WhatsAppSummaryModal: React.FC<WhatsAppSummaryModalProps> = ({
  isOpen,
  onClose,
  scale,
  summaryText,
  shareUrl,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#EDE8E0] flex flex-col max-h-[90vh] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 bg-[#7B1113] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#25D366] text-white flex items-center justify-center shadow-xs">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h3 className="text-sm font-bold font-cinzel tracking-wide text-[#F3E7C4]">
                Resumo para WhatsApp
              </h3>
              <p className="text-[11px] text-[#F3E7C4]/80">
                Pauta, escala de serviços e orações com 1 toque
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Preview */}
        <div className="p-4 overflow-y-auto flex-1 space-y-3">
          <div className="flex items-center justify-between text-xs text-[#70645E]">
            <span className="font-semibold text-[#36070D]">
              {scale.meetingDate}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <Sparkles className="w-3 h-3" /> Formatação Elegante
            </span>
          </div>

          <div className="relative">
            <pre className="w-full p-3.5 bg-white rounded-xl border border-[#DDD5C7] text-xs text-[#241E1C] font-mono whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto shadow-inner select-all">
              {summaryText}
            </pre>
          </div>

          <p className="text-[11px] text-[#8A7C75] text-center italic">
            Dica: Você pode copiar o texto ou abrir diretamente o WhatsApp Web / Aplicativo.
          </p>
        </div>

        {/* Actions Footer */}
        <div className="p-4 border-t border-[#ECE7DF] bg-[#F4EFEB] flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#DDD5C7] text-[#36070D] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#FAF8F5] active:scale-95 transition shadow-2xs cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Copiado para Área de Transferência!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#7B1113]" />
                <span>Copiar Mensagem</span>
              </>
            )}
          </button>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition shadow-xs cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Enviar no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
};
