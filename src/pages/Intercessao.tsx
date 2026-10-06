import React, { useState } from 'react';
import { 
  HeartHandshake, 
  PlusCircle, 
  Flame, 
  CheckCircle, 
  Share2, 
  Check, 
  User,
  Sparkles,
  Trophy,
  WifiOff,
  HardDrive,
  Trash2
} from 'lucide-react';
import { PrayerIntention, PrayerCategory } from '../types';
import { Modal } from '../components/common/Modal';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

interface IntercessaoProps {
  prayers: PrayerIntention[];
  onTogglePray: (prayerId: string) => void;
  onAddPrayer: (content: string, category: PrayerCategory, urgent?: boolean) => void;
  onMarkAnswered?: (prayerId: string) => void;
  onDeletePrayer?: (prayerId: string) => void;
}

export const Intercessao: React.FC<IntercessaoProps> = ({
  prayers,
  onTogglePray,
  onAddPrayer,
  onMarkAnswered,
  onDeletePrayer,
}) => {
  const isOnline = useOnlineStatus();
  const [selectedCategory, setSelectedCategory] = useState<string>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<PrayerCategory>('familia');
  const [isUrgent, setIsUrgent] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const categoryLabels: Record<PrayerCategory, { label: string; badge: string }> = {
    familia: { label: 'Família', badge: 'bg-blue-100 text-blue-900 border-blue-200' },
    saude: { label: 'Saúde & Cura', badge: 'bg-rose-100 text-rose-900 border-rose-200' },
    vocacional: { label: 'Vocacional', badge: 'bg-purple-100 text-purple-900 border-purple-200' },
    espiritual: { label: 'Vida Espiritual', badge: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
    conversao: { label: 'Conversão', badge: 'bg-amber-100 text-amber-900 border-amber-200' },
    trabalho: { label: 'Trabalho / Estudo', badge: 'bg-orange-100 text-orange-900 border-orange-200' },
    outros: { label: 'Outras Intenções', badge: 'bg-gray-100 text-gray-800 border-gray-200' },
  };

  const filteredPrayers = prayers.filter(p => {
    if (selectedCategory === 'todas') return true;
    if (selectedCategory === 'gracas') return p.answered;
    return p.category === selectedCategory;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;

    onAddPrayer(newContent.trim(), newCategory, isUrgent);
    setNewContent('');
    setIsUrgent(false);
    setIsModalOpen(false);
    showToast(isOnline ? 'Intenção enviada! A célula está em oração.' : 'Intenção salva no aparelho e pronta para acesso offline!');
  };

  const handleSharePrayer = (prayer: PrayerIntention) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `✝ Pedido de Oração • Célula Santa Gemma\nPor: ${prayer.authorName}\nIntenção: "${prayer.content}"\nReze uma Ave-Maria por esta intenção!`
      );
      showToast('Pedido de oração copiado para compartilhar!');
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

      {/* Top spiritual card */}
      <div className="rounded-2xl bg-gradient-to-br from-[#7B1113]/95 to-[#45090F]/95 backdrop-blur-md p-4 text-white shadow-md border border-[#E5C158]/40 relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E5C158]/20 flex items-center justify-center text-[#E5C158]">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <h2 className="text-sm font-bold uppercase tracking-wider font-cinzel text-white">
              Cadeia de Intercessão
            </h2>
          </div>
          <span className="text-[10px] bg-[#E5C158] text-[#36070D] font-bold px-2 py-0.5 rounded-full font-cinzel">
            Ao Vivo
          </span>
        </div>
        <p className="text-xs text-[#FFF0BE]/90 leading-relaxed italic">
          "Orai uns pelos outros para serdes curados. A oração fervorosa do justo tem grande poder." (Tg 5, 16)
        </p>
      </div>

      {/* Indicador Amigável de Acesso Sem Internet */}
      <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs shadow-2xs ${
        !isOnline 
          ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
          : 'bg-white/85 border-[#ECE7DF] text-[#70645E]'
      }`}>
        <div className="flex items-center gap-2.5">
          {!isOnline ? (
            <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-amber-800 animate-pulse" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#241E1C]">
              <span>{!isOnline ? 'Pedidos Salvos no Celular (Sem Internet)' : 'Pedidos Salvos no seu Celular'}</span>
            </div>
            <p className="text-[11px] leading-tight mt-0.5">
              {!isOnline 
                ? 'Você pode continuar rezando pelos irmãos e anotando seus pedidos mesmo sem internet.'
                : 'Todos os pedidos de oração ficam guardados no seu celular para você rezar a qualquer hora.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Action button & category filter */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#241E1C]">Pedidos da Célula</h3>
          <p className="text-[11px] text-[#70645E]">Ninguém caminha ou reza sozinho</p>
        </div>
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Nova Intenção</span>
        </button>
      </div>

      {/* Filter categories */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'todas', label: 'Todas as Intenções' },
          { id: 'gracas', label: '✨ Graças Alcançadas' },
          { id: 'familia', label: 'Família' },
          { id: 'saude', label: 'Saúde' },
          { id: 'vocacional', label: 'Vocacional' },
          { id: 'espiritual', label: 'Espiritual' },
          { id: 'trabalho', label: 'Trabalho' },
        ].map(cat => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 ${
              selectedCategory === cat.id
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'bg-white/90 text-[#70645E] hover:bg-white border border-[#ECE7DF]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Prayer intentions list */}
      <div className="space-y-3">
        {filteredPrayers.length === 0 ? (
          <div className="rounded-2xl bg-white/85 backdrop-blur-sm p-6 text-center text-xs text-[#8A7C75] border border-white/60">
            Nenhuma intenção encontrada para este filtro.
          </div>
        ) : (
          filteredPrayers.map(prayer => {
            const category = categoryLabels[prayer.category] || categoryLabels.outros;

            return (
              <article
                key={prayer.id}
                className={`rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border transition ${
                  prayer.urgent 
                    ? 'border-amber-400 ring-1 ring-amber-300/60' 
                    : 'border-white/70'
                }`}
              >
                {/* Top row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${category.badge}`}>
                      {category.label}
                    </span>
                    {prayer.urgent && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300 animate-pulse">
                        <Flame className="w-3 h-3 text-amber-700" />
                        Urgente
                      </span>
                    )}
                    {prayer.answered && (
                      <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 border border-emerald-300">
                        <CheckCircle className="w-3 h-3 text-emerald-700" />
                        Graça Alcançada
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleSharePrayer(prayer)}
                      title="Compartilhar intenção"
                      className="p-1 text-[#8A7C75] hover:text-[#7B1113] active:scale-90 transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {onDeletePrayer && (
                      <button
                        type="button"
                        onClick={() => {
                          onDeletePrayer(prayer.id);
                          showToast('Pedido de oração removido.');
                        }}
                        title="Remover intenção"
                        aria-label="Remover intenção"
                        className="p-1 text-[#8A7C75] hover:text-red-600 active:scale-90 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="text-[10px] text-[#8A7C75]">
                      {prayer.createdAt}
                    </span>
                  </div>
                </div>

                {/* Author */}
                <div className="mt-2 flex items-center justify-between text-xs text-[#554741]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#8A7C75]" />
                    <span className="font-semibold text-[#241E1C]">{prayer.authorName}</span>
                    <span className="text-[10px] text-[#8A7C75]">({prayer.authorRole})</span>
                  </div>

                  {onMarkAnswered && (
                    <button
                      type="button"
                      onClick={() => {
                        onMarkAnswered(prayer.id);
                        showToast(prayer.answered ? 'Intenção reaberta' : 'Glória a Deus! Graça alcançada registrada.');
                      }}
                      className="text-[11px] text-[#276F50] hover:underline flex items-center gap-1 font-medium cursor-pointer active:scale-95 transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{prayer.answered ? 'Reabrir' : 'Graça Alcançada'}</span>
                    </button>
                  )}
                </div>

                {/* Content */}
                <p className="mt-2 text-xs text-[#362D29] leading-relaxed bg-[#FBF9F5] p-3 rounded-xl border border-[#EDE8E0]">
                  🙏 "{prayer.content}"
                </p>

                {/* Action row with "Estou rezando por você" */}
                <div className="mt-3 pt-2.5 border-t border-[#ECE7DF] flex items-center justify-between">
                  <div className="text-xs text-[#70645E]">
                    <span className="font-bold text-[#7B1113]">{prayer.prayerCount}</span> pessoa(s) rezando
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onTogglePray(prayer.id);
                      if (!prayer.userPrayed) {
                        showToast(isOnline ? 'Amém! Sua oração foi unida a esta intenção.' : 'Amém! Oração salva no seu aparelho (offline)!');
                      }
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer active:scale-95 ${
                      prayer.userPrayed
                        ? 'bg-[#276F50] text-white hover:bg-[#1E563E]'
                        : 'bg-[#F4EFEB] text-[#7B1113] hover:bg-[#EDE5DC] border border-[#DDD4C7]'
                    }`}
                  >
                    <HeartHandshake className={`w-4 h-4 ${prayer.userPrayed ? 'scale-110' : ''}`} />
                    <span>
                      {prayer.userPrayed ? 'Estou Rezando ✓' : 'Estou rezando por você'}
                    </span>
                  </button>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal: Nova Intenção de Oração */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Nova Intenção de Oração"
        subtitle="Sua célula se unirá em intercessão diante do Santíssimo"
      >
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Categoria da Intenção
            </label>
            <select
              value={newCategory}
              onChange={e => setNewCategory(e.target.value as PrayerCategory)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            >
              <option value="familia">Família e Matrimônio</option>
              <option value="saude">Saúde, Cura e Libertação</option>
              <option value="vocacional">Vocacional / Discernimento Shalom</option>
              <option value="espiritual">Vida Espiritual & Conversão Pessoal</option>
              <option value="conversao">Conversão de Pessoas Queridas</option>
              <option value="trabalho">Trabalho, Finanças & Estudos</option>
              <option value="outros">Outras Intenções</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Pedido de Oração *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Descreva sua necessidade com fé e humildade..."
              value={newContent}
              onChange={e => setNewContent(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="urgent"
              checked={isUrgent}
              onChange={e => setIsUrgent(e.target.checked)}
              className="rounded text-[#7B1113] focus:ring-[#7B1113] cursor-pointer"
            />
            <label htmlFor="urgent" className="text-xs font-semibold text-[#8E2828] cursor-pointer">
              Marcar como Intenção Urgente (necessidade iminente)
            </label>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#70645E] hover:bg-[#EFEAE2] active:scale-95 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
            >
              Pedir Oração
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
