import React, { useState } from 'react';
import { 
  ArrowLeft, 
  BookOpen, 
  Sun, 
  Sparkles, 
  Volume2, 
  Copy, 
  Check, 
  Flame, 
  Cross,
  Calendar,
  Heart
} from 'lucide-react';
import { DailyLiturgy, SaintOfDay } from '../types';

interface LiturgiaProps {
  liturgy: DailyLiturgy;
  saint: SaintOfDay;
  onBack: () => void;
}

export const Liturgia: React.FC<LiturgiaProps> = ({
  liturgy,
  saint,
  onBack,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'liturgia' | 'santo'>('liturgia');
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [copiedPrayer, setCopiedPrayer] = useState(false);

  const handleCopyPrayer = async () => {
    try {
      await navigator.clipboard.writeText(saint.prayer);
      setCopiedPrayer(true);
      setTimeout(() => setCopiedPrayer(false), 2500);
    } catch (e) {
      console.error(e);
    }
  };

  const textClass = fontSize === 'large' ? 'text-base leading-relaxed' : 'text-xs leading-relaxed';

  return (
    <div className="space-y-4 px-4 py-3 animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        {/* Font size control */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#EDE8E0] shadow-2xs">
          <button
            type="button"
            onClick={() => setFontSize('normal')}
            className={`px-2 py-0.5 rounded-lg text-xs font-bold transition ${
              fontSize === 'normal' ? 'bg-[#7B1113] text-white' : 'text-[#70645E]'
            }`}
          >
            A
          </button>
          <button
            type="button"
            onClick={() => setFontSize('large')}
            className={`px-2 py-0.5 rounded-lg text-sm font-bold transition ${
              fontSize === 'large' ? 'bg-[#7B1113] text-white' : 'text-[#70645E]'
            }`}
          >
            A+
          </button>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex p-1 bg-[#EAE4DB] rounded-2xl gap-1">
        <button
          type="button"
          onClick={() => setActiveSubTab('liturgia')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            activeSubTab === 'liturgia'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'text-[#554741] hover:text-[#241E1C]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Liturgia Diária</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('santo')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 ${
            activeSubTab === 'santo'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'text-[#554741] hover:text-[#241E1C]'
          }`}
        >
          <Sun className="w-4 h-4 text-[#E5C158]" />
          <span>Santo do Dia</span>
        </button>
      </div>

      {/* LITURGIA DA PALAVRA TAB */}
      {activeSubTab === 'liturgia' && (
        <div className="space-y-4">
          {/* Header Card */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-[#1C4E32] to-[#0E2819] text-white shadow-md border border-emerald-400/30">
            <div className="flex items-center justify-between text-[11px] text-emerald-200 mb-1.5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> {liturgy.date}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/30 text-white font-semibold">
                {liturgy.liturgicalColor}
              </span>
            </div>
            <h2 className="text-sm font-bold font-cinzel text-white leading-snug">
              {liturgy.headline}
            </h2>
            <p className="text-[11px] text-emerald-100/80 mt-1 italic">
              "A Palavra de Deus é viva, eficaz e ilumina os passos da nossa célula."
            </p>
          </div>

          {/* Primeira Leitura */}
          <div className="p-4 bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between border-b border-[#EDE8E0] pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113]">
                {liturgy.firstReading.title}
              </span>
              <span className="text-[10px] text-[#8A7C75] bg-[#F4EFEB] px-2 py-0.5 rounded-md font-semibold">
                {liturgy.firstReading.reference}
              </span>
            </div>
            <p className={`${textClass} text-[#241E1C] whitespace-pre-line text-justify`}>
              {liturgy.firstReading.text}
            </p>
            <p className="text-[10px] font-bold text-[#8A7C75] text-right italic pt-1">
              — Palavra do Senhor. / Graças a Deus.
            </p>
          </div>

          {/* Salmo Responsorial */}
          <div className="p-4 bg-[#FBF9F6] rounded-2xl border border-[#E0D8CB] shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800">
                Salmo Responsorial
              </span>
              <span className="text-[10px] text-[#8A7C75]">
                {liturgy.psalm.reference}
              </span>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
              <p className="text-xs font-bold text-[#7B1113] italic">
                — {liturgy.psalm.chorus}
              </p>
            </div>

            <div className="space-y-2 text-[#423834] pt-1">
              {liturgy.psalm.verses.map((v, i) => (
                <p key={i} className={`${textClass} italic pl-3 border-l-2 border-amber-300`}>
                  — {v}
                </p>
              ))}
            </div>
          </div>

          {/* Evangelho de Jesus Cristo */}
          <div className="p-4 bg-white/95 rounded-2xl border-2 border-[#7B1113]/20 shadow-xs space-y-2.5">
            <div className="flex items-center justify-between border-b border-[#EDE8E0] pb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113] flex items-center gap-1.5">
                <Cross className="w-3.5 h-3.5 text-[#7B1113]" />
                Evangelho do Dia
              </span>
              <span className="text-[10px] font-bold text-[#7B1113] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                {liturgy.gospel.reference}
              </span>
            </div>

            <h3 className="text-xs font-bold text-[#36070D]">
              {liturgy.gospel.title}
            </h3>

            <p className={`${textClass} text-[#241E1C] whitespace-pre-line text-justify`}>
              {liturgy.gospel.text}
            </p>

            <p className="text-[10px] font-bold text-[#8A7C75] text-right italic pt-1">
              — Palavra da Salvação. / Glória a vós, Senhor!
            </p>
          </div>

          {/* Lectio Divina / Reflexão Comunitária */}
          <div className="p-4 bg-linear-to-br from-[#F5EFE6] to-[#EAE0D3] rounded-2xl border border-[#DDD5C7] space-y-2 shadow-2xs">
            <div className="flex items-center gap-2 text-[#7B1113]">
              <Sparkles className="w-4 h-4 text-[#E5C158]" />
              <h4 className="text-xs font-bold font-cinzel">
                Lectio Divina & Reflexão para a Célula
              </h4>
            </div>
            <p className="text-[11px] text-[#554741] leading-relaxed">
              {liturgy.reflection.text}
            </p>
            <p className="text-[10px] font-bold text-[#8A7C75] text-right">
              Fonte: {liturgy.reflection.author}
            </p>
          </div>
        </div>
      )}

      {/* SANTO DO DIA TAB */}
      {activeSubTab === 'santo' && (
        <div className="space-y-4">
          {/* Saint Card */}
          <div className="p-4 rounded-2xl bg-linear-to-br from-[#7B1113] to-[#36070D] text-white shadow-md border border-[#E5C158]/30 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5C158] text-[#36070D] uppercase tracking-wider">
                  Santo do Dia
                </span>
                <h2 className="text-base font-bold font-cinzel text-white mt-1.5">
                  {saint.name}
                </h2>
                <p className="text-xs text-[#F3E7C4] italic">
                  {saint.title}
                </p>
              </div>

              <div className="w-12 h-12 rounded-full bg-[#E5C158]/20 border border-[#E5C158]/40 flex items-center justify-center shrink-0">
                <Sun className="w-6 h-6 text-[#E5C158]" />
              </div>
            </div>

            <div className="p-3 bg-black/20 rounded-xl text-xs text-[#F3E7C4] leading-relaxed">
              {saint.summary}
            </div>
          </div>

          {/* Virtude Heroica */}
          <div className="p-3.5 bg-amber-50/90 rounded-2xl border border-amber-200 shadow-2xs flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-200 text-amber-900 flex items-center justify-center shrink-0">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-amber-950">
                Virtude para Praticar na Célula
              </h4>
              <p className="text-xs text-amber-900 mt-0.5 leading-relaxed">
                {saint.virtue}
              </p>
            </div>
          </div>

          {/* Biografia / História de Vida */}
          <div className="p-4 bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs space-y-2">
            <h3 className="text-xs font-bold font-cinzel text-[#7B1113] uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>História de Fé & Cruz</span>
            </h3>
            <p className={`${textClass} text-[#423834] whitespace-pre-line text-justify`}>
              {saint.lifeStory}
            </p>
          </div>

          {/* Oração Oficial do Santo */}
          <div className="p-4 bg-[#FAF5F0] rounded-2xl border border-[#E5DACD] shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[#7B1113]">
                <Flame className="w-4 h-4" />
                <h4 className="text-xs font-bold font-cinzel">
                  Oração Oficial a {saint.name}
                </h4>
              </div>

              <button
                type="button"
                onClick={handleCopyPrayer}
                className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-[10px] font-bold text-[#7B1113] flex items-center gap-1 active:scale-95 transition cursor-pointer shadow-2xs"
              >
                {copiedPrayer ? (
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

            <p className="text-xs text-[#36070D] font-serif italic leading-relaxed whitespace-pre-line bg-white/80 p-3.5 rounded-xl border border-[#E0D8CB]">
              {saint.prayer}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
