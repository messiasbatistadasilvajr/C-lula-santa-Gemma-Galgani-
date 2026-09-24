import React, { useState } from 'react';
import { Cross, ArrowLeft, Heart, Sparkles, Feather, Quote, Copy, Check } from 'lucide-react';

interface SantaGemmaProps {
  onBack: () => void;
}

export const SantaGemma: React.FC<SantaGemmaProps> = ({ onBack }) => {
  const [copied, setCopied] = useState(false);

  const oracaoText = `"Senhor Jesus Cristo, que concedestes a Santa Gemma Galgani a graça admirável de partilhar os mistérios da Vossa Paixão e uma vida de oração ininterrupta, concedei à nossa célula a chama do Vosso Amor, o zelo pela salvação das almas e a perseverança no Carisma Shalom. Santa Gemma Galgani, rogai por nós!"`;

  const handleCopyPrayer = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`✝ Oração à Santa Gemma Galgani • Comunidade Shalom\n\n${oracaoText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
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
            Santa Gemma Galgani
          </h2>
          <p className="text-xs text-[#70645E]">Padroeira e inspiração da nossa célula</p>
        </div>
      </div>

      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#7B1113]/95 to-[#3B070D]/95 backdrop-blur-md p-5 text-white shadow-md border border-[#E5C158]/40 space-y-3 relative overflow-hidden">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E5C158]/20 border border-[#E5C158]/40 flex items-center justify-center font-cinzel text-xl text-[#E5C158] font-bold">
            ✝
          </div>
          <div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#E5C158]">
              A Flor da Paixão de Jesus
            </span>
            <h3 className="text-base font-bold font-cinzel text-white leading-tight">
              Santa Gemma Galgani (1878–1903)
            </h3>
            <p className="text-[11px] text-[#FFF0BE]/80">Festa litúrgica: 11 de Abril</p>
          </div>
        </div>

        <p className="text-xs text-white/90 leading-relaxed pt-1">
          Jovem leiga italiana canonizada pela Igreja Católica, Gemma viveu uma vida de profundíssima união mística com a Paixão de Cristo e extraordinária amizade com seu Anjo da Guarda.
        </p>
      </div>

      {/* Quote Banner */}
      <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-white/70 shadow-sm">
        <div className="flex items-center gap-2 text-[#7B1113] mb-1.5">
          <Quote className="w-4 h-4 fill-[#7B1113]/20" />
          <h4 className="text-xs font-bold uppercase tracking-wider font-cinzel">
            Palavra de Santa Gemma
          </h4>
        </div>
        <p className="text-xs text-[#3A302C] leading-relaxed italic bg-[#FBF9F5] p-3 rounded-xl border border-[#EDE8E0]">
          "Se eu tivesse mil corações, todos os mil seriam para Jesus! Nada desejo neste mundo, senão que o meu coração queime de amor pelo meu Deus."
        </p>
      </div>

      {/* Os Pilares Espirituais */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7C75] px-1 font-cinzel">
          Pilares para a nossa Célula Shalom
        </h3>

        <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/70 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-rose-100 text-[#7B1113] flex items-center justify-center shrink-0">
            <Heart className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#241E1C]">O Amor aos Pés da Cruz</h4>
            <p className="text-xs text-[#70645E] mt-0.5 leading-relaxed">
              Santa Gemma contemplava a Cruz não como derrota, mas como o abraço supremo de Deus à humanidade ferida. Na célula, somos chamados a consolar o Coração de Jesus.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/70 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Feather className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#241E1C]">Intimidade com o Santo Anjo da Guarda</h4>
            <p className="text-xs text-[#70645E] mt-0.5 leading-relaxed">
              Gemma conversava com seu anjo protetor com total simplicidade filial. O anjo a corrigia com ternura, a ensinava a orar e a protegia nos combates espirituais.
            </p>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl border border-white/70 shadow-sm flex items-start gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-[#241E1C]">Santidade no Cotidiano Simples</h4>
            <p className="text-xs text-[#70645E] mt-0.5 leading-relaxed">
              Sem nunca ter ingressado num mosteiro fechado, Gemma santificou as tarefas diárias do lar, o cuidado com a família e a oração silenciosa.
            </p>
          </div>
        </div>
      </div>

      {/* Oração da Célula */}
      <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 border border-white/70 shadow-sm space-y-3">
        <h4 className="text-xs font-bold text-[#7B1113] uppercase tracking-wider font-cinzel text-center">
          Oração da Célula Santa Gemma Galgani
        </h4>
        <p className="text-xs text-[#423834] leading-relaxed text-center whitespace-pre-line italic bg-[#FBF9F5] p-3 rounded-xl border border-[#EDE8E0]">
          {oracaoText}
        </p>
        <button
          type="button"
          onClick={handleCopyPrayer}
          className="w-full py-2 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
        >
          {copied ? <Check className="w-4 h-4 text-[#E5C158]" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Oração copiada!' : 'Copiar Oração da Célula'}</span>
        </button>
      </div>
    </div>
  );
};
