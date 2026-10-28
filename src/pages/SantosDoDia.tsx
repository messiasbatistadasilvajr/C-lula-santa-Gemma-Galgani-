import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sun,
  BookOpen,
  Heart,
  Share2,
  Copy,
  Check,
  Search,
  Volume2,
  VolumeX,
  Flame,
  Cross,
  Star,
  Quote,
  Sparkles,
  Award,
  Filter,
  Bookmark
} from 'lucide-react';
import { saintsService, DetailedSaint, SAINTS_DATABASE } from '../services/saintsService';
import { getTodayIsoDate } from '../services/liturgyCalendar';
import { speechReader } from '../utils/speechReader';

interface SantosDoDiaProps {
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

export const SantosDoDia: React.FC<SantosDoDiaProps> = ({ onBack, onNavigate }) => {
  const todayIso = getTodayIsoDate();
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>(todayIso);
  const [activeTab, setActiveTab] = useState<'dia' | 'catalogo' | 'favoritos'>('dia');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => saintsService.getFavoriteSaintIds());
  const [expandedStory, setExpandedStory] = useState<boolean>(false);
  const [modalSaint, setModalSaint] = useState<DetailedSaint | null>(null);

  // Dados do Santo da data selecionada
  const dayData = saintsService.getSaintsForDate(selectedIsoDate);
  const currentSaints = dayData.saints;
  const [selectedSaintIndex, setSelectedSaintIndex] = useState(0);
  const activeSaint = currentSaints[selectedSaintIndex] || currentSaints[0] || SAINTS_DATABASE[0];

  // Observa o estado da síntese de fala
  useEffect(() => {
    const unsub = speechReader.subscribe(() => {
      setIsSpeaking(speechReader.getSpeakingId() === `saint-${activeSaint.id}`);
    });
    return () => {
      unsub();
      speechReader.stop();
    };
  }, [activeSaint.id]);

  const handleStepDate = (daysDelta: number) => {
    speechReader.stop();
    const [y, m, d] = selectedIsoDate.split('-').map(Number);
    const nextDate = new Date(y, m - 1, d + daysDelta);
    const ny = nextDate.getFullYear();
    const nm = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nd = String(nextDate.getDate()).padStart(2, '0');
    setSelectedIsoDate(`${ny}-${nm}-${nd}`);
    setSelectedSaintIndex(0);
    setExpandedStory(false);
  };

  const handleSetToday = () => {
    speechReader.stop();
    setSelectedIsoDate(todayIso);
    setSelectedSaintIndex(0);
    setExpandedStory(false);
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error('Falha ao copiar texto:', e);
    }
  };

  const handleToggleSpeak = (saint: DetailedSaint) => {
    const textToRead = `${saint.name}. ${saint.title}. Resumo de sua história: ${saint.summary}. ${
      expandedStory ? `Biografia: ${saint.lifeStory}. ` : ''
    } Virtude para viver hoje: ${saint.virtue}. Oração: ${saint.prayer}`;
    speechReader.toggleSpeak(`saint-${saint.id}`, textToRead);
  };

  const handleToggleFavorite = (id: string) => {
    saintsService.toggleFavorite(id);
    setFavoriteIds(saintsService.getFavoriteSaintIds());
  };

  const handleShareWhatsApp = (saint: DetailedSaint) => {
    const msg =
      `🕊️ *SANTO DO DIA • CÉLULA SANTA GEMMA GALGANI*\n` +
      `📅 *Data Festiva:* ${saint.feastDate}\n` +
      `✨ *${saint.name}*\n` +
      `📜 *${saint.title}*\n\n` +
      `📖 *Resumo da História:*\n` +
      `"${saint.summary}"\n\n` +
      (saint.famousQuote ? `💬 *Citação:* ${saint.famousQuote}\n\n` : '') +
      `❤️ *Virtude para hoje:* ${saint.virtue}\n\n` +
      `🕯️ *Oração de Intercessão:*\n` +
      `"${saint.prayer}"\n\n` +
      `🌹 *Comunidade Católica Shalom • Célula Santa Gemma Galgani*`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Filtragem para o catálogo
  const filteredCatalog = saintsService.searchSaints(searchQuery, selectedCategory);
  const favoriteSaintsList = SAINTS_DATABASE.filter(s => favoriteIds.includes(s.id));

  return (
    <div className="pb-24 pt-2 px-3.5 space-y-4 max-w-md mx-auto text-[#241E1C]">
      {/* 1. Header com Navegação */}
      <header className="flex items-center justify-between gap-2 pt-1 pb-2 border-b border-[#ECE7DF]">
        <button
          type="button"
          onClick={onBack}
          aria-label="Voltar para a tela anterior"
          className="p-2 -ml-1 rounded-xl text-[#7B1113] hover:bg-[#7B1113]/10 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="text-center flex-1">
          <div className="inline-flex items-center gap-1.5 text-[#7B1113]">
            <Sparkles className="w-4 h-4 text-[#E5C158] fill-[#E5C158]" />
            <h1 className="text-base font-bold font-cinzel tracking-tight text-[#36070D]">
              Santos do Dia
            </h1>
          </div>
          <p className="text-[10px] text-[#70645E]">
            História, vida e virtudes para os irmãos da célula
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleToggleSpeak(activeSaint)}
          title={isSpeaking ? 'Parar narração' : 'Ouvir história em voz alta'}
          aria-label={isSpeaking ? 'Parar narração do Santo' : 'Ouvir história do Santo em voz alta'}
          className={`p-2 rounded-xl transition cursor-pointer active:scale-95 ${
            isSpeaking
              ? 'bg-[#7B1113] text-white animate-pulse'
              : 'text-[#7B1113] hover:bg-[#7B1113]/10 bg-amber-50 border border-amber-200'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </header>

      {/* 2. Seleção de Abas Principais */}
      <div className="flex rounded-xl bg-[#EDE8E0] p-1 text-xs font-semibold text-[#70645E] shadow-2xs">
        <button
          type="button"
          onClick={() => {
            setActiveTab('dia');
            speechReader.stop();
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'dia'
              ? 'bg-white text-[#7B1113] font-bold shadow-xs'
              : 'hover:text-[#36070D]'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Santo de Hoje</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('catalogo');
            speechReader.stop();
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'catalogo'
              ? 'bg-white text-[#7B1113] font-bold shadow-xs'
              : 'hover:text-[#36070D]'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Explorar Todos</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('favoritos');
            speechReader.stop();
          }}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
            activeTab === 'favoritos'
              ? 'bg-white text-[#7B1113] font-bold shadow-xs'
              : 'hover:text-[#36070D]'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span>Devoções ({favoriteIds.length})</span>
        </button>
      </div>

      {/* =========================================================================
          ABA 1: SANTO DE HOJE / NAVEGADOR DE DATAS
      ========================================================================= */}
      {activeTab === 'dia' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          {/* Seletor Rápido de Dias e Calendário */}
          <section className="bg-white/90 backdrop-blur-md rounded-2xl p-3 border border-[#E0D8CB] shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-1.5">
              <button
                type="button"
                onClick={() => handleStepDate(-1)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F0EBE3] border border-[#DDD5C7] text-xs font-semibold text-[#7B1113] flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Dia anterior</span>
              </button>

              <div className="text-center flex-1">
                <p className="text-[10px] uppercase tracking-wider text-[#70645E] font-bold">
                  Data Selecionada
                </p>
                <p className="text-xs font-bold text-[#36070D] font-cinzel">
                  {dayData.formattedDate}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleStepDate(1)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F0EBE3] border border-[#DDD5C7] text-xs font-semibold text-[#7B1113] flex items-center gap-1 active:scale-95 transition cursor-pointer"
              >
                <span className="hidden xs:inline">Próximo dia</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EDE8E0]">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#7B1113]" />
                <input
                  type="date"
                  value={selectedIsoDate}
                  onChange={e => {
                    if (e.target.value) {
                      setSelectedIsoDate(e.target.value);
                      setSelectedSaintIndex(0);
                      setExpandedStory(false);
                    }
                  }}
                  className="text-xs bg-transparent border-0 font-medium text-[#554741] focus:ring-0 cursor-pointer p-0"
                />
              </div>

              {selectedIsoDate !== todayIso && (
                <button
                  type="button"
                  onClick={handleSetToday}
                  className="px-2 py-0.5 rounded-md bg-amber-100 hover:bg-amber-200 text-amber-900 text-[10px] font-bold border border-amber-300 transition cursor-pointer"
                >
                  Voltar para Hoje
                </button>
              )}
            </div>

            {/* Abas se houver mais de um Santo celebrado no mesmo dia */}
            {currentSaints.length > 1 && (
              <div className="pt-2 border-t border-[#EDE8E0] flex items-center gap-1.5 overflow-x-auto pb-0.5">
                <span className="text-[10px] text-[#70645E] font-bold uppercase shrink-0">
                  Santos de Hoje:
                </span>
                {currentSaints.map((saint, idx) => (
                  <button
                    key={saint.id || saint.name}
                    type="button"
                    onClick={() => {
                      setSelectedSaintIndex(idx);
                      speechReader.stop();
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition cursor-pointer ${
                      selectedSaintIndex === idx
                        ? 'bg-[#7B1113] text-white shadow-2xs'
                        : 'bg-[#F2ECE4] text-[#554741] hover:bg-[#E8DFD5]'
                    }`}
                  >
                    {saint.name.split(' ')[0]} {saint.name.split(' ')[1] || ''}
                  </button>
                ))}
              </div>
            )}
          </section>

          {/* 3. CARD PRINCIPAL DO SANTO DO DIA (Nome + Resumo da História) */}
          <article className="rounded-3xl bg-linear-to-br from-[#7B1113] via-[#5C0D12] to-[#36070D] text-white p-5 shadow-lg border border-[#E5C158]/50 relative overflow-hidden space-y-4">
            <div className="absolute top-0 right-0 w-36 h-36 bg-[#E5C158]/10 rounded-full blur-2xl pointer-events-none" />

            {/* Cabeçalho do Card */}
            <div className="flex items-start justify-between gap-3 relative z-10">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-[#E5C158]/25 text-[#FFF0BE] text-[10px] font-bold uppercase tracking-wider border border-[#E5C158]/40 font-cinzel">
                    Festa Litúrgica • {activeSaint.feastDate}
                  </span>
                  {activeSaint.century && (
                    <span className="text-[10px] text-rose-200/80 font-medium">
                      {activeSaint.century}
                    </span>
                  )}
                </div>

                <h2 className="text-xl font-bold font-cinzel text-white tracking-wide pt-1">
                  {activeSaint.name}
                </h2>

                <p className="text-xs text-[#F3E7C4] font-medium leading-relaxed italic">
                  {activeSaint.title}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleToggleFavorite(activeSaint.id)}
                title={favoriteIds.includes(activeSaint.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                aria-label={favoriteIds.includes(activeSaint.id) ? 'Remover santo dos favoritos' : 'Adicionar santo aos favoritos'}
                className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center shrink-0 active:scale-90 transition cursor-pointer"
              >
                <Star
                  className={`w-5 h-5 ${
                    favoriteIds.includes(activeSaint.id)
                      ? 'fill-[#E5C158] text-[#E5C158]'
                      : 'text-white/70'
                  }`}
                />
              </button>
            </div>

            {/* ==========================================================
                DESTAQUE PRINCIPAL: RESUMO DA HISTÓRIA
            ========================================================== */}
            <div className="p-4 bg-black/35 rounded-2xl border border-white/15 backdrop-blur-xs space-y-2 relative z-10">
              <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-1.5">
                <span className="text-[11px] font-bold text-[#E5C158] uppercase tracking-wider flex items-center gap-1 font-cinzel">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Resumo da História</span>
                </span>
                <span className="text-[9px] text-[#FFF0BE]/70">Vida & Testemunho</span>
              </div>

              <p className="text-xs text-[#FAF5EB] leading-relaxed text-justify whitespace-pre-line font-sans font-normal selection:bg-[#E5C158] selection:text-black">
                {activeSaint.summary}
              </p>
            </div>

            {/* Frase Célebre se houver */}
            {activeSaint.famousQuote && (
              <div className="p-3 bg-white/10 rounded-xl border border-white/15 flex items-start gap-2.5 relative z-10">
                <Quote className="w-4 h-4 text-[#E5C158] shrink-0 mt-0.5 fill-[#E5C158]/30" />
                <p className="text-xs italic text-[#FFF0BE] leading-relaxed font-serif">
                  {activeSaint.famousQuote}
                </p>
              </div>
            )}

            {/* Barra de Ações Rápidas */}
            <div className="pt-1 flex items-center justify-between gap-2 relative z-10">
              <button
                type="button"
                onClick={() => handleToggleSpeak(activeSaint)}
                className="flex-1 py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center justify-center gap-1.5 border border-white/20 transition active:scale-95 cursor-pointer"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-[#E5C158]" />
                    <span>Pausar Leitura</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-[#E5C158]" />
                    <span>Ouvir História</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => handleShareWhatsApp(activeSaint)}
                className="flex-1 py-2 px-3 rounded-xl bg-[#E5C158] hover:bg-[#F2CF66] text-[#36070D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-95 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    `*${activeSaint.name}* (${activeSaint.feastDate})\n${activeSaint.title}\n\n*Resumo da História:*\n${activeSaint.summary}\n\n*Virtude:* ${activeSaint.virtue}\n\n*Oração:* ${activeSaint.prayer}`,
                    'main_saint_copy'
                  )
                }
                title="Copiar dados do santo"
                aria-label="Copiar resumo e oração do santo"
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/20 transition active:scale-95 cursor-pointer"
              >
                {copiedId === 'main_saint_copy' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </article>

          {/* 4. Virtude do Santo para Viver Hoje */}
          <section className="p-4 bg-amber-50/95 rounded-2xl border border-amber-200/90 shadow-2xs flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-amber-700 text-amber-700" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wide font-cinzel">
                Virtude para Praticar na Célula
              </h3>
              <p className="text-xs text-amber-900 leading-relaxed font-medium">
                {activeSaint.virtue}
              </p>
              {activeSaint.patronage && (
                <p className="text-[10px] text-amber-800/80 pt-1">
                  🛡️ <strong>Padroeiro:</strong> {activeSaint.patronage}
                </p>
              )}
            </div>
          </section>

          {/* 5. Biografia Completa (Expansível) */}
          <section className="bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs overflow-hidden">
            <button
              type="button"
              onClick={() => setExpandedStory(!expandedStory)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-[#FAF8F5] transition cursor-pointer"
            >
              <div className="flex items-center gap-2 text-[#7B1113]">
                <BookOpen className="w-4 h-4" />
                <h3 className="text-xs font-bold font-cinzel uppercase tracking-wider text-[#36070D]">
                  Biografia Completa & Vida Detalhada
                </h3>
              </div>
              <span className="text-[10px] font-bold text-[#7B1113] bg-[#7B1113]/10 px-2 py-0.5 rounded-full">
                {expandedStory ? 'Recolher' : 'Ler mais'}
              </span>
            </button>

            {expandedStory && (
              <div className="p-4 pt-1 border-t border-[#EDE8E0] text-xs text-[#3A302C] leading-relaxed text-justify whitespace-pre-line bg-[#FCFAF7] space-y-3">
                <p>{activeSaint.lifeStory}</p>
              </div>
            )}
          </section>

          {/* 6. Oração Oficial de Intercessão */}
          <section className="p-4 bg-linear-to-br from-[#FAF5F0] to-[#F2ECE4] rounded-2xl border border-[#E5DACD] shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2 border-b border-[#E0D8CB] pb-2">
              <div className="flex items-center gap-1.5 text-[#7B1113]">
                <Flame className="w-4 h-4 text-amber-600 fill-amber-500" />
                <h3 className="text-xs font-bold font-cinzel text-[#36070D]">
                  Oração Oficial de Intercessão
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleCopyText(activeSaint.prayer, 'prayer_copy')}
                className="px-2.5 py-1 rounded-lg bg-white border border-[#DDD5C7] text-[10px] font-bold text-[#7B1113] flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                {copiedId === 'prayer_copy' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiada</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Oração</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#36070D] font-serif italic leading-relaxed whitespace-pre-line bg-white/95 p-3.5 rounded-xl border border-[#E0D8CB] shadow-2xs">
              "{activeSaint.prayer}"
            </p>
          </section>

          {/* Atalho para Liturgia Diária e Santa Gemma */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('liturgia')}
                className="p-3 rounded-xl bg-white border border-[#EDE8E0] hover:border-[#7B1113]/40 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-1 text-[#7B1113] text-[11px] font-bold font-cinzel">
                  <Cross className="w-3.5 h-3.5" />
                  <span>Liturgia Diária</span>
                </div>
                <p className="text-[10px] text-[#70645E] mt-0.5">Leituras & Salmo do Dia</p>
              </button>
            )}

            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('santagemma')}
                className="p-3 rounded-xl bg-rose-50/80 border border-rose-200 hover:border-rose-300 text-left transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-1 text-[#7B1113] text-[11px] font-bold font-cinzel">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>Padroeira da Célula</span>
                </div>
                <p className="text-[10px] text-[#70645E] mt-0.5">Vida de Santa Gemma Galgani</p>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 2: CATÁLOGO COMPLETO & PESQUISA DE SANTOS
      ========================================================================= */}
      {activeTab === 'catalogo' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {/* Barra de Pesquisa */}
          <div className="relative">
            <Search className="w-4 h-4 text-[#70645E] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar por nome, história, virtude..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs placeholder:text-[#8C7E77] focus:outline-hidden focus:border-[#7B1113] focus:ring-1 focus:ring-[#7B1113] shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#70645E] hover:text-[#241E1C]"
              >
                Limpar
              </button>
            )}
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] font-semibold">
            {[
              { id: 'todos', label: 'Todos os Santos' },
              { id: 'padroeira', label: '🌹 Padroeira' },
              { id: 'mistico', label: '✨ Místicos' },
              { id: 'doutor', label: '📖 Doutores' },
              { id: 'mariano', label: '🕊️ Marianos' },
              { id: 'juventude', label: '🌱 Jovens' },
              { id: 'pastor', label: '✝️ Pastores' },
              { id: 'martir', label: '🛡️ Mártires' },
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full shrink-0 transition cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#7B1113] text-white shadow-2xs'
                    : 'bg-[#EDE8E0] text-[#554741] hover:bg-[#DFD8CE]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Lista de Cards de Santos com Nome e Resumo de sua História */}
          <div className="space-y-3">
            {filteredCatalog.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-[#EDE8E0] text-[#70645E] space-y-2">
                <Search className="w-8 h-8 mx-auto text-stone-300" />
                <p className="text-xs font-bold text-[#36070D]">Nenhum santo encontrado</p>
                <p className="text-[11px]">Tente outra palavra de busca ou remova o filtro.</p>
              </div>
            ) : (
              filteredCatalog.map(saint => (
                <div
                  key={saint.id}
                  className="p-4 bg-white rounded-2xl border border-[#EDE8E0] shadow-2xs hover:border-[#7B1113]/30 hover:shadow-xs transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#7B1113] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                          {saint.feastDate}
                        </span>
                        {favoriteIds.includes(saint.id) && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 border border-amber-200">
                            <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                            <span>Devoção</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold font-cinzel text-[#36070D] mt-1">
                        {saint.name}
                      </h3>
                      <p className="text-[11px] text-[#70645E] italic">
                        {saint.title}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFavorite(saint.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-amber-500 transition cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          favoriteIds.includes(saint.id)
                            ? 'fill-amber-400 text-amber-500'
                            : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Resumo da História exibido com clareza */}
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE8E0] text-xs text-[#3A302C] leading-relaxed text-justify">
                    <p className="font-semibold text-[10px] text-[#7B1113] uppercase tracking-wider mb-1 font-cinzel">
                      Resumo da História:
                    </p>
                    <p>{saint.summary}</p>
                  </div>

                  {/* Virtude & Botão para abrir modal com detalhes */}
                  <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EDE8E0]">
                    <span className="text-[10px] text-[#70645E] truncate">
                      ✨ <em>{saint.virtue}</em>
                    </span>

                    <button
                      type="button"
                      onClick={() => setModalSaint(saint)}
                      className="px-3 py-1 rounded-lg bg-[#7B1113] text-white text-[11px] font-bold hover:bg-[#5C0D12] active:scale-95 transition cursor-pointer shrink-0"
                    >
                      Ver Oração & Vida
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          ABA 3: SANTOS DE DEVOÇÃO PESSOAL / FAVORITOS
      ========================================================================= */}
      {activeTab === 'favoritos' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
            <Star className="w-4 h-4 text-amber-600 fill-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Seus Santos Protetores e de Devoção</p>
              <p className="text-[11px] text-amber-900 mt-0.5">
                Toque na estrela de qualquer santo do calendário ou catálogo para guardá-lo aqui.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {favoriteSaintsList.map(saint => (
              <div
                key={saint.id}
                className="p-4 bg-white rounded-2xl border border-[#EDE8E0] shadow-2xs space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-[#7B1113] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                      {saint.feastDate}
                    </span>
                    <h3 className="text-sm font-bold font-cinzel text-[#36070D] mt-1">
                      {saint.name}
                    </h3>
                    <p className="text-[11px] text-[#70645E] italic">
                      {saint.title}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFavorite(saint.id)}
                    className="p-1.5 rounded-lg text-amber-500 hover:text-stone-400 transition cursor-pointer"
                  >
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                  </button>
                </div>

                <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE8E0] text-xs text-[#3A302C] leading-relaxed text-justify">
                  <p className="font-semibold text-[10px] text-[#7B1113] uppercase tracking-wider mb-1 font-cinzel">
                    Resumo da História:
                  </p>
                  <p>{saint.summary}</p>
                </div>

                <div className="flex items-center justify-between gap-2 pt-1 border-t border-[#EDE8E0]">
                  <button
                    type="button"
                    onClick={() => handleShareWhatsApp(saint)}
                    className="text-[11px] font-bold text-[#7B1113] flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <Share2 className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setModalSaint(saint)}
                    className="px-3 py-1 rounded-lg bg-[#7B1113] text-white text-[11px] font-bold hover:bg-[#5C0D12] active:scale-95 transition cursor-pointer"
                  >
                    Ver Oração
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL COM DETALHES COMPLETOS DO SANTO SELECIONADO
      ========================================================================= */}
      {modalSaint && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in"
          onClick={() => setModalSaint(null)}
        >
          <div
            className="w-full max-w-sm max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#E0D8CB] flex flex-col overflow-hidden text-[#241E1C]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header do Modal */}
            <div className="p-4 bg-linear-to-r from-[#7B1113] to-[#5C0D12] text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#E5C158] uppercase tracking-wider font-bold font-cinzel">
                  {modalSaint.feastDate}
                </span>
                <h3 className="text-base font-bold font-cinzel text-white">
                  {modalSaint.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setModalSaint(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Conteúdo com Scroll */}
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs">
              <p className="text-[11px] text-[#70645E] italic">
                {modalSaint.title}
              </p>

              {/* Resumo da História */}
              <div className="p-3 bg-white rounded-xl border border-[#EDE8E0] space-y-1">
                <h4 className="text-[11px] font-bold text-[#7B1113] uppercase font-cinzel">
                  Resumo de sua História
                </h4>
                <p className="leading-relaxed text-justify text-[#3A302C]">
                  {modalSaint.summary}
                </p>
              </div>

              {/* Biografia completa */}
              {modalSaint.lifeStory && (
                <div className="p-3 bg-white rounded-xl border border-[#EDE8E0] space-y-1">
                  <h4 className="text-[11px] font-bold text-[#7B1113] uppercase font-cinzel">
                    Vida & Testemunho de Fé
                  </h4>
                  <p className="leading-relaxed text-justify text-[#3A302C] whitespace-pre-line">
                    {modalSaint.lifeStory}
                  </p>
                </div>
              )}

              {/* Citação */}
              {modalSaint.famousQuote && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950 italic">
                  "{modalSaint.famousQuote}"
                </div>
              )}

              {/* Oração de Intercessão */}
              <div className="p-3.5 bg-linear-to-br from-[#FAF5F0] to-[#EFE7DE] rounded-xl border border-[#DDD5C7] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#7B1113] uppercase font-cinzel flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                    <span>Oração Oficial</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyText(modalSaint.prayer, 'modal_prayer_copy')}
                    className="text-[10px] font-bold text-[#7B1113] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {copiedId === 'modal_prayer_copy' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Copiada</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="font-serif italic leading-relaxed text-[#36070D]">
                  "{modalSaint.prayer}"
                </p>
              </div>
            </div>

            {/* Footer com botões */}
            <div className="p-3 border-t border-[#EDE8E0] bg-[#F4EFEB] flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => handleShareWhatsApp(modalSaint)}
                className="flex-1 py-2 rounded-xl bg-[#E5C158] text-[#36070D] font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Enviar no WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => setModalSaint(null)}
                className="px-4 py-2 rounded-xl bg-white border border-[#DDD5C7] text-xs font-bold text-[#554741] active:scale-95 transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
