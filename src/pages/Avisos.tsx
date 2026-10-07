import React, { useState } from 'react';
import { 
  Bell, 
  ArrowLeft, 
  AlertCircle, 
  PlusCircle, 
  Check, 
  Sparkles,
  Share2
} from 'lucide-react';
import { CellNotice, UserRole } from '../types';
import { Modal } from '../components/common/Modal';

interface AvisosProps {
  notices: CellNotice[];
  currentRole?: UserRole;
  onBack: () => void;
  onAddNotice?: (notice: Omit<CellNotice, 'id'>) => void;
}

export const Avisos: React.FC<AvisosProps> = ({ 
  notices, 
  currentRole = 'membro', 
  onBack,
  onAddNotice,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Geral');
  const [priority, setPriority] = useState<'baixa' | 'normal' | 'alta'>('normal');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const canCreateNotice = currentRole === 'admin' || currentRole === 'formador';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareNotice = (notice: CellNotice) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `📢 AVISO OFICIAL • Célula Santa Gemma\n${notice.title}\n\n${notice.content}\n\nPor: ${notice.author} (${notice.date})`
      );
      showToast('Aviso copiado para compartilhar!');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !onAddNotice) return;

    onAddNotice({
      title: title.trim(),
      content: content.trim(),
      category,
      priority,
      date: new Date().toLocaleDateString('pt-BR'),
      author: currentRole === 'admin' ? 'Coordenação' : 'Formadora',
    });

    setTitle('');
    setContent('');
    setIsModalOpen(false);
    showToast('Aviso publicado no mural com sucesso!');
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
      <div className="flex items-center justify-between">
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
              Mural de Avisos
            </h2>
            <p className="text-xs text-[#70645E]">Comunicações oficiais e urgentes da célula</p>
          </div>
        </div>

        {canCreateNotice && onAddNotice ? (
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo Aviso</span>
          </button>
        ) : (
          <span className="text-[10px] text-[#8A7C75] bg-white/80 px-2 py-1 rounded-lg border border-[#EDE8E0]">
            Mural da Coordenação
          </span>
        )}
      </div>

      <div className="space-y-3">
        {notices.map(notice => {
          const isHighPriority = notice.priority === 'alta';
          return (
            <article
              key={notice.id}
              className={`rounded-2xl p-4 shadow-sm border transition backdrop-blur-md ${
                isHighPriority
                  ? 'bg-white/95 border-amber-400 ring-1 ring-amber-300/60'
                  : 'bg-white/90 border-white/70'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    isHighPriority
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-[#F4EFEB] text-[#7B1113]'
                  }`}>
                    {notice.category}
                  </span>
                  {isHighPriority && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-800">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Prioritário
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleShareNotice(notice)}
                    title="Compartilhar aviso"
                    className="p-1 text-[#8A7C75] hover:text-[#7B1113] active:scale-90 transition cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-[#8A7C75]">{notice.date}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-[#241E1C] mb-1.5">
                {notice.title}
              </h3>

              <p className="text-xs text-[#423834] leading-relaxed">
                {notice.content}
              </p>

              <div className="mt-3 pt-2.5 border-t border-[#ECE7DF] text-[11px] text-[#70645E] flex items-center justify-between">
                <span>Por: <strong>{notice.author}</strong></span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Modal: Novo Aviso */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publicar Novo Aviso"
        subtitle="Comunique a todos os irmãos da célula"
      >
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Título do Aviso *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Mudança de local no encontro de quinta"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Categoria
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2.5 text-xs bg-white focus:outline-[#7B1113]"
              >
                <option value="Geral">Geral</option>
                <option value="Liturgia">Liturgia & Missa</option>
                <option value="Eventos">Eventos / Retiro</option>
                <option value="Escala">Escala de Serviço</option>
                <option value="Formação">Formação</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as 'baixa' | 'normal' | 'alta')}
                className="w-full rounded-xl border border-[#D9D0C5] p-2.5 text-xs bg-white focus:outline-[#7B1113]"
              >
                <option value="normal">Normal</option>
                <option value="alta">Alta / Urgente</option>
                <option value="baixa">Informativa</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Mensagem do Aviso *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Descreva as instruções ou orientações com clareza..."
              value={content}
              onChange={e => setContent(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2.5 text-xs bg-white focus:outline-[#7B1113] leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-[#ECE7DF] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D9D0C5] bg-white text-xs font-bold text-[#70645E] hover:bg-[#EFEAE2] transition cursor-pointer active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] shadow-sm transition cursor-pointer active:scale-95"
            >
              Publicar Aviso
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
