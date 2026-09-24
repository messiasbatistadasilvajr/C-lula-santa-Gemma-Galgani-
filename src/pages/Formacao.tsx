import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  Cross, 
  HeartHandshake, 
  FileText, 
  Video, 
  ExternalLink, 
  Sparkles, 
  Share2,
  Check
} from 'lucide-react';
import { FormationItem } from '../types';
import { INITIAL_FORMATIONS } from '../services/mockData';
import { Modal } from '../components/common/Modal';

interface FormacaoProps {
  onBack: () => void;
}

export const Formacao: React.FC<FormacaoProps> = ({ onBack }) => {
  const [selectedCat, setSelectedCat] = useState<string>('todas');
  const [activeItem, setActiveItem] = useState<FormationItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categories: { id: string; label: string; icon: typeof BookOpen }[] = [
    { id: 'todas', label: 'Tudo', icon: BookOpen },
    { id: 'shalom', label: 'Carisma Shalom', icon: Sparkles },
    { id: 'santa-gemma', label: 'Santa Gemma', icon: Cross },
    { id: 'oracoes', label: 'Devocionário', icon: HeartHandshake },
    { id: 'documentos', label: 'Roteiros', icon: FileText },
    { id: 'videos', label: 'Vídeos', icon: Video },
  ];

  const items = selectedCat === 'todas'
    ? INITIAL_FORMATIONS
    : INITIAL_FORMATIONS.filter(item => item.category === selectedCat);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = (item: FormationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `📖 Formação • Célula Santa Gemma\n${item.title}\n${item.subtitle ? item.subtitle + '\n' : ''}\n"${item.contentSnippet}"`
      );
      showToast('Trecho da formação copiado para compartilhar!');
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#ECE7DF] text-[#70645E] hover:text-[#241E1C] active:scale-95 transition cursor-pointer"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-[#241E1C] font-cinzel">
            Biblioteca de Formação
          </h2>
          <p className="text-xs text-[#70645E]">Alimento espiritual e formação para a célula</p>
        </div>
      </div>

      {/* Categories horizontal scroll */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {categories.map(cat => {
          const Icon = cat.icon;
          const isActive = selectedCat === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCat(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-white/90 text-[#70645E] hover:bg-white border border-[#ECE7DF]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Formation Items List */}
      <div className="space-y-3">
        {items.map(item => (
          <article
            key={item.id}
            onClick={() => setActiveItem(item)}
            className="cursor-pointer rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/70 hover:border-[#7B1113]/30 active:scale-[0.99] transition space-y-2 group"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#F4EFEB] text-[#7B1113] uppercase tracking-wider">
                {item.category === 'shalom' ? 'Formação Shalom' : item.category === 'santa-gemma' ? 'Santa Gemma' : item.category === 'oracoes' ? 'Oração' : item.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={(e) => handleShare(item, e)}
                  title="Compartilhar trecho"
                  className="p-1 text-[#8A7C75] hover:text-[#7B1113] active:scale-90 transition cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>
                {item.durationOrPages && (
                  <span className="text-[10px] text-[#8A7C75]">
                    {item.durationOrPages}
                  </span>
                )}
              </div>
            </div>

            <h3 className="text-sm font-bold text-[#241E1C] group-hover:text-[#7B1113] transition">
              {item.title}
            </h3>

            <p className="text-xs text-[#70645E] leading-relaxed line-clamp-2">
              {item.contentSnippet}
            </p>

            <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#7B1113] font-bold">
              <span>{item.author || item.subtitle}</span>
              <span className="flex items-center gap-1 group-hover:underline">
                Ler conteúdo completo &rarr;
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Reader Modal */}
      <Modal
        isOpen={Boolean(activeItem)}
        onClose={() => setActiveItem(null)}
        title={activeItem?.title || 'Formação Espiritual'}
        subtitle={activeItem?.subtitle}
      >
        {activeItem && (
          <div className="space-y-4">
            {activeItem.author && (
              <p className="text-xs font-semibold text-[#7B1113]">
                Autor(a): {activeItem.author}
              </p>
            )}

            <div className="text-xs text-[#362D29] leading-relaxed whitespace-pre-line bg-[#FBF9F5] p-4 rounded-xl border border-[#EDE8E0] max-h-[60vh] overflow-y-auto">
              {activeItem.fullContent || activeItem.contentSnippet}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={(e) => handleShare(activeItem, e)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-[#DDD5C7] text-[#7B1113] text-xs font-bold hover:bg-[#F4EFEB] active:scale-95 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartilhar</span>
              </button>
              {activeItem.externalUrl && (
                <a
                  href={activeItem.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
                >
                  <span>Link Externo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
