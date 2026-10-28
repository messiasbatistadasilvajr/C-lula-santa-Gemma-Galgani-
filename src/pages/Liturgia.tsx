import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Sun,
  Sparkles,
  Copy,
  Check,
  Flame,
  Cross,
  Calendar,
  Heart,
  ChevronLeft,
  ChevronRight,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { DailyLiturgy, SaintOfDay } from '../types';
import {
  fetchDailyLiturgyAndSaint,
  getLiturgyAndSaintForDate,
  getTodayIsoDate,
  OFFICIAL_OCTOBER_2026_LITURGY,
} from '../services/liturgyCalendar';

interface LiturgiaProps {
  liturgy: DailyLiturgy;
  saint: SaintOfDay;
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

export const Liturgia: React.FC<LiturgiaProps> = ({ onBack, onNavigate }) => {
  const todayIso = getTodayIsoDate();
  const [selectedIsoDate, setSelectedIsoDate] = useState<string>(todayIso);
  const [activeSubTab, setActiveSubTab] = useState<'liturgia' | 'santo'>('liturgia');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isLoadingOnline, setIsLoadingOnline] = useState(false);

  const initialDayData = getLiturgyAndSaintForDate(selectedIsoDate);
  const [currentLiturgy, setCurrentLiturgy] = useState<DailyLiturgy>(initialDayData.liturgy);
  const [currentSaints, setCurrentSaints] = useState<SaintOfDay[]>(initialDayData.saints);

  useEffect(() => {
    let active = true;
    const localData = getLiturgyAndSaintForDate(selectedIsoDate);
    setCurrentLiturgy(localData.liturgy);
    setCurrentSaints(localData.saints);

    setIsLoadingOnline(true);
    fetchDailyLiturgyAndSaint(selectedIsoDate)
      .then(remoteData => {
        if (active) {
          setCurrentLiturgy(remoteData.liturgy);
          setCurrentSaints(remoteData.saints);
        }
      })
      .finally(() => {
        if (active) setIsLoadingOnline(false);
      });

    return () => {
      active = false;
    };
  }, [selectedIsoDate]);

  const handleStepDate = (daysDelta: number) => {
    const [y, m, d] = selectedIsoDate.split('-').map(Number);
    const nextDate = new Date(y, m - 1, d + daysDelta);
    const ny = nextDate.getFullYear();
    const nm = String(nextDate.getMonth() + 1).padStart(2, '0');
    const nd = String(nextDate.getDate()).padStart(2, '0');
    setSelectedIsoDate(`${ny}-${nm}-${nd}`);
  };

  const handleCopyText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const handleShareWhatsAppLiturgy = () => {
    const saintHeadline = currentSaints[0]?.name || 'Santo do Dia';
    const message =
      `📖 *LITURGIA DIÁRIA & SANTO DO DIA • CÉLULA SANTA GEMMA GALGANI*\n` +
      `📅 *${currentLiturgy.date}*\n` +
      `🕯️ *${currentLiturgy.headline}*\n` +
      `🎨 *Cor Litúrgica:* ${currentLiturgy.liturgicalColor}\n\n` +
      `📜 *${currentLiturgy.firstReading.title}*\n` +
      `📜 *Salmo:* ${currentLiturgy.psalm.reference} — _"${currentLiturgy.psalm.chorus}"_\n` +
      (currentLiturgy.secondReading
        ? `📜 *${currentLiturgy.secondReading.title}*\n`
        : '') +
      `✝️ *Evangelho do Dia:* ${currentLiturgy.gospel.reference}\n\n` +
      `_"${currentLiturgy.gospel.text}"_\n\n` +
      `✨ *Santo do Dia:* ${saintHeadline}\n` +
      `🙏 *Reflexão da Célula:* ${currentLiturgy.reflection.text}`;

    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    const a = document.createElement('a');
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const textClass = fontSize === 'large' ? 'text-base leading-relaxed' : 'text-xs leading-relaxed';
  const activeSaint = currentSaints[0];
  const octoberDatesList = Object.keys(OFFICIAL_OCTOBER_2026_LITURGY).sort();

  return (
    <div className="space-y-4 px-4 py-3 pb-24 animate-in fade-in duration-200">
      {/* Barra Superior */}
      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShareWhatsAppLiturgy}
            className="px-2.5 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-[11px] font-bold flex items-center gap-1 shadow-2xs active:scale-95 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Compartilhar no Zap</span>
          </button>

          {/* Controle de tamanho de fonte */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EDE8E0] shadow-2xs">
            <button
              type="button"
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                fontSize === 'normal' ? 'bg-[#7B1113] text-white' : 'text-[#70645E]'
              }`}
            >
              A
            </button>
            <button
              type="button"
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded-lg text-sm font-bold transition cursor-pointer ${
                fontSize === 'large' ? 'bg-[#7B1113] text-white' : 'text-[#70645E]'
              }`}
            >
              A+
            </button>
          </div>
        </div>
      </div>

      {/* Navegador de Data da Liturgia Diária (Hoje 08/10/2026 e outros dias) */}
      <div className="p-3 rounded-2xl bg-white/95 border border-[#EDE8E0] shadow-2xs space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => handleStepDate(-1)}
            className="p-2 rounded-xl bg-[#F4EFEB] hover:bg-[#E6DFD5] text-[#36070D] transition cursor-pointer active:scale-95"
            aria-label="Dia anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="text-center flex-1 min-w-0">
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#7B1113]">
              <Calendar className="w-3.5 h-3.5" />
              <span>Calendário Litúrgico Oficial CNBB</span>
              {isLoadingOnline && <RefreshCw className="w-3 h-3 animate-spin text-[#7B1113]" />}
            </div>
            <p className="text-xs font-bold text-[#241E1C] truncate mt-0.5">
              {currentLiturgy.date}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleStepDate(1)}
            className="p-2 rounded-xl bg-[#F4EFEB] hover:bg-[#E6DFD5] text-[#36070D] transition cursor-pointer active:scale-95"
            aria-label="Próximo dia"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Atalhos rápidos dos dias da semana / Outubro 2026 */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <button
            type="button"
            onClick={() => setSelectedIsoDate(todayIso)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition cursor-pointer ${
              selectedIsoDate === todayIso
                ? 'bg-[#7B1113] text-[#FFF0BE] shadow-2xs'
                : 'bg-amber-100 text-[#36070D] hover:bg-amber-200'
            }`}
          >
            Hoje • {todayIso.split('-')[2]}/{todayIso.split('-')[1]} (Domingo • Lc 18,1-8)
          </button>

          {octoberDatesList
            .filter(d => d !== todayIso)
            .map(iso => {
              const item = OFFICIAL_OCTOBER_2026_LITURGY[iso];
              const isSelected = selectedIsoDate === iso;
              return (
                <button
                  key={iso}
                  type="button"
                  onClick={() => setSelectedIsoDate(iso)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    isSelected
                      ? 'bg-[#7B1113] text-white shadow-2xs'
                      : 'bg-[#FAF8F5] text-[#554741] border border-[#E5DFD5] hover:bg-[#EFEAE2]'
                  }`}
                >
                  {item.dayMonthKey} ({item.liturgy.gospel.reference.replace('São ', '')})
                </button>
              );
            })}
        </div>
      </div>

      {/* Seletor de Abas: Liturgia Diária vs Santo do Dia */}
      <div className="flex p-1 bg-[#EAE4DB] rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('liturgia')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            activeSubTab === 'liturgia'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'text-[#554741] hover:text-[#241E1C]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Liturgia Diária ({currentLiturgy.gospel.reference.replace('São ', '')})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('santo')}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            activeSubTab === 'santo'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'text-[#554741] hover:text-[#241E1C]'
          }`}
        >
          <Sun className="w-4 h-4 text-[#E5C158]" />
          <span>Santos do Dia ({activeSaint.feastDate})</span>
        </button>
      </div>

      {/* =====================================================================
          ABA 1: LITURGIA DA PALAVRA DO DIA (1ª Leitura, Salmo, 2ª Leitura, Evangelho)
      ===================================================================== */}
      {activeSubTab === 'liturgia' && (
        <div className="space-y-4">
          {/* Card Principal de Cabeçalho Litúrgico */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-[#1C4E32] to-[#0E2819] text-white shadow-md border border-emerald-400/30 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-emerald-200">
              <span className="flex items-center gap-1 font-semibold">
                <Calendar className="w-3.5 h-3.5" /> {currentLiturgy.date}
              </span>
              <span className="text-emerald-100 font-bold">
                Cor: {currentLiturgy.liturgicalColor}
              </span>
            </div>
            <h2 className="text-sm font-bold font-cinzel text-white leading-snug">
              {currentLiturgy.headline}
            </h2>
            <div className="pt-1 border-t border-white/15 flex flex-wrap items-center gap-2 text-[11px] text-emerald-100">
              <span>📖 1ª Leitura: <strong>{currentLiturgy.firstReading.reference}</strong></span>
              <span>·</span>
              <span>✝️ Evangelho: <strong>{currentLiturgy.gospel.reference}</strong></span>
            </div>
          </div>

          {/* 1. Primeira Leitura */}
          <div className="p-4 bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#EDE8E0] pb-2 gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113] block">
                  {currentLiturgy.firstReading.title}
                </span>
                <span className="text-[11px] font-semibold text-[#554741]">
                  {currentLiturgy.firstReading.reference}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    `${currentLiturgy.firstReading.title}\n${currentLiturgy.firstReading.text}`,
                    'first_reading'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] border border-[#DFD8CE] text-[10px] font-bold text-[#7B1113] flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'first_reading' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className={`${textClass} text-[#241E1C] whitespace-pre-line text-justify`}>
              {currentLiturgy.firstReading.text}
            </p>
            <p className="text-[11px] font-bold text-[#7B1113] text-right italic pt-1">
              — Palavra do Senhor. / Graças a Deus!
            </p>
          </div>

          {/* 2. Salmo Responsorial */}
          <div className="p-4 bg-[#FBF9F6] rounded-2xl border border-[#E0D8CB] shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900">
                Salmo Responsorial / Cântico
              </span>
              <span className="text-[11px] font-bold text-[#554741]">
                {currentLiturgy.psalm.reference}
              </span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-xs font-bold text-[#7B1113] italic">
                Refrão: “{currentLiturgy.psalm.chorus}”
              </p>
            </div>

            <div className="space-y-2 text-[#423834] pt-1">
              {currentLiturgy.psalm.verses.map((v, i) => (
                <p key={i} className={`${textClass} italic pl-3 border-l-2 border-amber-400`}>
                  — {v}
                </p>
              ))}
            </div>
          </div>

          {/* 3. Segunda Leitura (Domingos e Solenidades) */}
          {currentLiturgy.secondReading && (
            <div className="p-4 bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#EDE8E0] pb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113]">
                  {currentLiturgy.secondReading.title}
                </span>
                <span className="text-[10px] text-[#8A7C75] font-semibold">
                  {currentLiturgy.secondReading.reference}
                </span>
              </div>
              <p className={`${textClass} text-[#241E1C] whitespace-pre-line text-justify`}>
                {currentLiturgy.secondReading.text}
              </p>
              <p className="text-[11px] font-bold text-[#7B1113] text-right italic pt-1">
                — Palavra do Senhor. / Graças a Deus!
              </p>
            </div>
          )}

          {/* 4. Evangelho de Jesus Cristo */}
          <div className="p-4 bg-white/95 rounded-2xl border-2 border-[#7B1113]/30 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#EDE8E0] pb-2 gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#7B1113] flex items-center gap-1.5">
                <Cross className="w-4 h-4 text-[#7B1113]" />
                <span>Evangelho do Dia • {currentLiturgy.gospel.reference}</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  handleCopyText(
                    `${currentLiturgy.gospel.title}\n\n${currentLiturgy.gospel.text}`,
                    'gospel_copy'
                  )
                }
                className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-[10px] font-bold text-[#7B1113] flex items-center gap-1 cursor-pointer"
              >
                {copiedId === 'gospel_copy' ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-700" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copiar Evangelho</span>
                  </>
                )}
              </button>
            </div>

            <h3 className="text-xs font-bold text-[#36070D]">
              {currentLiturgy.gospel.title}
            </h3>

            <p className={`${textClass} text-[#241E1C] whitespace-pre-line text-justify`}>
              {currentLiturgy.gospel.text}
            </p>

            <p className="text-[11px] font-bold text-[#7B1113] text-right italic pt-1">
              — Palavra da Salvação. / Glória a vós, Senhor!
            </p>
          </div>

          {/* 5. Reflexão & Lectio Divina para a Célula */}
          <div className="p-4 bg-linear-to-br from-[#F5EFE6] to-[#EAE0D3] rounded-2xl border border-[#DDD5C7] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-[#7B1113]">
              <Sparkles className="w-4 h-4 text-[#7B1113]" />
              <h4 className="text-xs font-bold font-cinzel">
                Meditação do Evangelho & Lectio Divina
              </h4>
            </div>
            <p className="text-xs text-[#36070D] leading-relaxed">
              {currentLiturgy.reflection.text}
            </p>
            <p className="text-[10px] font-bold text-[#70645E] text-right">
              Fonte: {currentLiturgy.reflection.author}
            </p>
          </div>
        </div>
      )}

      {/* =====================================================================
          ABA 2: SANTOS DO DIA
      ===================================================================== */}
      {activeSubTab === 'santo' && activeSaint && (
        <div className="space-y-4">
          {/* Card Principal do Santo do Dia */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-[#7B1113] to-[#36070D] text-white shadow-md border border-[#E5C158]/40 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold text-[#E5C158] uppercase tracking-wider font-cinzel">
                  Santo do Dia • {activeSaint.feastDate}
                </p>
                <h2 className="text-base font-bold font-cinzel text-white mt-1">
                  {activeSaint.name}
                </h2>
                <p className="text-xs text-[#F3E7C4] italic mt-0.5">
                  {activeSaint.title}
                </p>
              </div>

              <div className="w-11 h-11 rounded-xl bg-[#E5C158]/20 border border-[#E5C158]/40 flex items-center justify-center shrink-0">
                <Sun className="w-5 h-5 text-[#E5C158]" />
              </div>
            </div>

            <div className="p-3 bg-black/25 rounded-xl text-xs text-[#F3E7C4] leading-relaxed border border-white/10">
              {activeSaint.summary}
            </div>
          </div>

          {/* Virtude para praticar hoje */}
          <div className="p-3.5 bg-amber-50/95 rounded-2xl border border-amber-200 shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Virtude do Dia para Praticar na Célula
              </h4>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                {activeSaint.virtue}
              </p>
            </div>
          </div>

          {/* História e Martirológio */}
          <div className="p-4 bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs space-y-2">
            <h3 className="text-xs font-bold font-cinzel text-[#7B1113] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>História e Testemunho dos Santos de Hoje ({activeSaint.feastDate})</span>
            </h3>
            <p className={`${textClass} text-[#423834] whitespace-pre-line text-justify`}>
              {activeSaint.lifeStory}
            </p>
          </div>

          {/* Oração do Dia */}
          <div className="p-4 bg-[#FAF5F0] rounded-2xl border border-[#E5DACD] shadow-2xs space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[#7B1113]">
                <Flame className="w-4 h-4" />
                <h4 className="text-xs font-bold font-cinzel">
                  Oração de Intercessão do Dia
                </h4>
              </div>

              <button
                type="button"
                onClick={() => handleCopyText(activeSaint.prayer, 'saint_prayer')}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-[10px] font-bold text-[#7B1113] flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                {copiedId === 'saint_prayer' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copiada!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Oração</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-xs text-[#36070D] font-serif italic leading-relaxed whitespace-pre-line bg-white/90 p-3.5 rounded-xl border border-[#E0D8CB]">
              “{activeSaint.prayer}”
            </p>
          </div>

          {onNavigate && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onNavigate('santos')}
                className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-[#7B1113] to-[#5C0D12] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#4A0A10] active:scale-95 transition cursor-pointer border border-[#E5C158]/40"
              >
                <Sparkles className="w-4 h-4 text-[#E5C158]" />
                <span>Explorar Página Completa de Santos & Histórias</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
