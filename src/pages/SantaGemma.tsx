import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Sparkles, 
  Feather, 
  Quote, 
  Copy, 
  Check, 
  Eye, 
  EyeOff, 
  Sliders, 
  Info,
  Layers,
  Share2
} from 'lucide-react';
import santaGemmaImg from '../assets/images/santa_gemma_bg_1790044771008.jpg';

interface SantaGemmaProps {
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

type LayoutOption = 'option2' | 'option1' | 'option3';

export const SantaGemma: React.FC<SantaGemmaProps> = ({ onBack, onNavigate }) => {
  // Option 2 (Glassmorphism) is the chosen and default option requested by the user
  const [selectedOption, setSelectedOption] = useState<LayoutOption>('option2');
  const [copied, setCopied] = useState(false);
  const [hideTextForContemplation, setHideTextForContemplation] = useState(false);
  const [activeTab, setActiveTab] = useState<'oracao' | 'vida' | 'pilares'>('oracao');
  const [customBlur, setCustomBlur] = useState<number>(10);
  const [customOpacity, setCustomOpacity] = useState<number>(0.10);
  const [showConfig, setShowConfig] = useState(false);

  const oracaoText = `"Senhor Jesus Cristo, que concedestes a Santa Gemma Galgani a graça admirável de partilhar os mistérios da Vossa Paixão e uma vida de oração ininterrupta, concedei à nossa célula a chama do Vosso Amor, o zelo pela salvação das almas e a perseverança no Carisma Shalom. Santa Gemma Galgani, rogai por nós!"`;

  const handleCopyPrayer = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`✝ Oração à Santa Gemma Galgani • Comunidade Católica Shalom\n\n${oracaoText}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Glassmorphism specific styles (Opção 2)
  const glassStyle: React.CSSProperties = {
    backgroundColor: `rgba(255, 255, 255, ${customOpacity})`,
    backdropFilter: `blur(${customBlur}px)`,
    WebkitBackdropFilter: `blur(${customBlur}px)`,
    border: '1px solid rgba(255, 255, 255, 0.22)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.40), inset 0 1px 1px 0 rgba(255, 255, 255, 0.28)',
  };

  const textShadowStyle: React.CSSProperties = {
    textShadow: '0 1px 3px rgba(0, 0, 0, 0.85), 0 2px 6px rgba(0, 0, 0, 0.50)',
  };

  const titleShadowStyle: React.CSSProperties = {
    textShadow: '0 2px 5px rgba(0, 0, 0, 0.90), 0 0 12px rgba(229, 193, 88, 0.45)',
  };

  // Option 1 style: Semi-transparente preto (rgba(0, 0, 0, 0.7))
  const semiTransStyle: React.CSSProperties = {
    backgroundColor: 'rgba(0, 0, 0, 0.72)',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.60)',
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] -mx-4 -mt-3 pb-24 overflow-hidden select-none">
      {/* 
        ========================================================================
        1. BACKGROUND IMAGE: Santa Gemma Galgani ocupando todo o fundo
        ========================================================================
      */}
      {selectedOption !== 'option3' ? (
        <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
          <img
            src={santaGemmaImg}
            alt="Santa Gemma Galgani em oração"
            className="w-full h-full object-cover object-[center_22%] scale-105 transition-transform duration-700 ease-out filter brightness-95 contrast-105"
          />
          {/* Suave vinheta mística para manter profundidade */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/25 to-black/60 pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/75 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* Opção 3: Tela Dividida (Split Screen responsiva) */
        <div className="absolute inset-0 w-full h-full z-0 flex flex-col md:flex-row">
          <div className="w-full md:w-2/5 h-64 md:h-full relative overflow-hidden bg-[#241E1C]">
            <img
              src={santaGemmaImg}
              alt="Santa Gemma Galgani"
              className="w-full h-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 md:from-transparent to-transparent pointer-events-none" />
          </div>
          <div className="w-full md:w-3/5 flex-1 bg-[#1F1816]" />
        </div>
      )}

      {/* 
        ========================================================================
        2. TOP BAR & NAVIGATION (Voltar + Seletor de Modo + Contemplação)
        ========================================================================
      */}
      <header className="relative z-20 px-4 pt-3.5 pb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white active:scale-95 transition cursor-pointer flex items-center gap-1.5 shadow-md"
          aria-label="Voltar para a página anterior"
        >
          <ArrowLeft className="w-4 h-4 text-[#FFE082]" />
          <span className="text-xs font-semibold text-white pr-1">Voltar</span>
        </button>

        {/* Título Central */}
        <div className="text-center">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#FFE082] block" style={textShadowStyle}>
            Padroeira da Célula
          </span>
          <h1 className="text-sm font-bold text-white font-cinzel" style={titleShadowStyle}>
            Santa Gemma Galgani
          </h1>
        </div>

        {/* Ações: Ocultar texto / Configurar Glassmorphism */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setHideTextForContemplation(!hideTextForContemplation)}
            title={hideTextForContemplation ? "Mostrar conteúdo" : "Contemplar imagem limpa"}
            className="p-2 rounded-xl bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/20 text-white active:scale-95 transition cursor-pointer shadow-md"
          >
            {hideTextForContemplation ? <Eye className="w-4 h-4 text-[#FFE082]" /> : <EyeOff className="w-4 h-4 text-white/80" />}
          </button>
          
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            title="Ajustar parâmetros de vidro fosco"
            className={`p-2 rounded-xl backdrop-blur-md border transition cursor-pointer shadow-md ${
              showConfig ? 'bg-[#7B1113] border-[#FFE082] text-white' : 'bg-black/40 border-white/20 text-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 
        ========================================================================
        3. SELETOR DE OPÇÕES DE DESIGN (Opção 2 Ativa em destaque)
        ========================================================================
      */}
      <div className="relative z-20 px-4 pt-1 pb-2">
        <div className="bg-black/45 backdrop-blur-md rounded-2xl p-1 border border-white/15 shadow-lg flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={() => setSelectedOption('option2')}
            className={`flex-1 py-1.5 px-2 rounded-xl font-bold transition flex items-center justify-center gap-1 cursor-pointer ${
              selectedOption === 'option2'
                ? 'bg-gradient-to-r from-white/25 to-white/15 text-white shadow-sm border border-white/30 backdrop-blur-md font-semibold text-[#FFE082]'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>💎 Opção 2: Vidro Fosco</span>
            {selectedOption === 'option2' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFE082] animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setSelectedOption('option1')}
            className={`py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${
              selectedOption === 'option1'
                ? 'bg-black/80 text-white font-bold border border-white/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Opção 1: Escuro</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedOption('option3')}
            className={`py-1.5 px-2 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer ${
              selectedOption === 'option3'
                ? 'bg-[#3A2D28] text-white font-bold border border-white/30'
                : 'text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Opção 3: Dividida</span>
          </button>
        </div>

        {/* Badge explicativo da Opção 2 selecionada */}
        {selectedOption === 'option2' && (
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-white/90 px-1">
            <span className="flex items-center gap-1 font-medium" style={textShadowStyle}>
              <span className="text-[#FFE082]">✨ Glassmorphism ativo:</span> fundo rgba(255,255,255,{customOpacity}) + blur({customBlur}px)
            </span>
            <span className="text-[#FFE082] font-semibold" style={textShadowStyle}>
              Alta Legibilidade
            </span>
          </div>
        )}
      </div>

      {/* Painel expansível de ajuste fino do Glassmorphism */}
      {showConfig && selectedOption === 'option2' && (
        <div className="relative z-30 mx-4 mb-3 p-3.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-[#FFE082]/40 text-white text-xs shadow-2xl animate-in fade-in duration-200 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-bold text-[#FFE082] font-cinzel flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" /> Ajustes Finos do Vidro Fosco
            </span>
            <button
              type="button"
              onClick={() => {
                setCustomBlur(10);
                setCustomOpacity(0.10);
              }}
              className="text-[10px] text-[#FFE082] hover:underline cursor-pointer"
            >
              Restaurar Padrão (10px / 0.10)
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/80">Desfoque (Blur):</span>
                <span className="font-mono text-[#FFE082] font-bold">{customBlur}px</span>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={customBlur}
                onChange={(e) => setCustomBlur(Number(e.target.value))}
                className="w-full accent-[#E5C158] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-[11px] mb-1">
                <span className="text-white/80">Transparência:</span>
                <span className="font-mono text-[#FFE082] font-bold">{Math.round(customOpacity * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.30"
                step="0.02"
                value={customOpacity}
                onChange={(e) => setCustomOpacity(Number(e.target.value))}
                className="w-full accent-[#E5C158] cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 
        ========================================================================
        4. O CARD PRINCIPAL COM EFEITO VIDRO FOSCO (GLASSMORPHISM)
        ========================================================================
      */}
      {!hideTextForContemplation ? (
        <div className="relative z-10 px-4 pt-1 space-y-4">
          <div
            className="rounded-3xl p-5 sm:p-6 transition-all duration-300 relative overflow-hidden"
            style={
              selectedOption === 'option2'
                ? glassStyle
                : selectedOption === 'option1'
                ? semiTransStyle
                : { backgroundColor: '#2B211E', border: '1px solid #4D3C37' }
            }
          >
            {/* Brilho decorativo no topo do vidro (subtle reflection line) */}
            {selectedOption === 'option2' && (
              <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />
            )}

            {/* Cabeçalho do Card */}
            <div className="flex items-center gap-3.5 pb-3 border-b border-white/15">
              <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center font-cinzel text-2xl text-[#FFE082] font-bold shadow-inner">
                ✝
              </div>
              <div className="flex-1">
                <span 
                  className="text-[10px] font-bold tracking-widest uppercase text-[#FFE082]"
                  style={textShadowStyle}
                >
                  A Flor da Paixão de Jesus
                </span>
                <h2 
                  className="text-lg font-bold font-cinzel text-white leading-tight"
                  style={titleShadowStyle}
                >
                  Santa Gemma Galgani
                </h2>
                <p 
                  className="text-[11px] text-white/85 flex items-center gap-1.5 pt-0.5"
                  style={textShadowStyle}
                >
                  <span>1878 – 1903</span>
                  <span>•</span>
                  <span>Festa Litúrgica: 11 de Abril</span>
                </p>
              </div>
            </div>

            {/* Citação Central Mística */}
            <div className="my-3.5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-sm relative">
              <div className="flex items-center gap-1.5 text-[#FFE082] mb-1">
                <Quote className="w-4 h-4 fill-[#FFE082]/30" />
                <span className="text-[10px] font-bold uppercase tracking-wider font-cinzel" style={textShadowStyle}>
                  Palavra Mística de Santa Gemma
                </span>
              </div>
              <p 
                className="text-xs text-white leading-relaxed italic"
                style={textShadowStyle}
              >
                "Se eu tivesse mil corações, todos os mil seriam para Jesus! Nada desejo neste mundo, senão que o meu coração queime de amor pelo meu Deus."
              </p>
            </div>

            {/* Sub-abas de Navegação dentro do Card Glassmorphism */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 mb-3.5">
              <button
                type="button"
                onClick={() => setActiveTab('oracao')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'oracao'
                    ? 'bg-white/20 text-[#FFE082] shadow-xs border border-white/20'
                    : 'text-white/70 hover:text-white'
                }`}
                style={activeTab === 'oracao' ? textShadowStyle : undefined}
              >
                🙏 Oração
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('vida')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'vida'
                    ? 'bg-white/20 text-[#FFE082] shadow-xs border border-white/20'
                    : 'text-white/70 hover:text-white'
                }`}
                style={activeTab === 'vida' ? textShadowStyle : undefined}
              >
                📖 História
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('pilares')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  activeTab === 'pilares'
                    ? 'bg-white/20 text-[#FFE082] shadow-xs border border-white/20'
                    : 'text-white/70 hover:text-white'
                }`}
                style={activeTab === 'pilares' ? textShadowStyle : undefined}
              >
                🕊️ Pilares
              </button>
            </div>

            {/* Conteúdo Dinâmico das Abas */}
            {activeTab === 'oracao' && (
              <div className="space-y-3 animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <h3 
                    className="text-xs font-bold text-[#FFE082] uppercase tracking-wider font-cinzel mb-2 text-center"
                    style={titleShadowStyle}
                  >
                    Oração da Célula Santa Gemma Galgani
                  </h3>
                  <p 
                    className="text-xs text-white leading-relaxed text-center italic whitespace-pre-line"
                    style={textShadowStyle}
                  >
                    {oracaoText}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCopyPrayer}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#7B1113] to-[#991B1E] hover:from-[#8B1416] hover:to-[#A82023] text-white text-xs font-bold flex items-center justify-center gap-2 active:scale-95 transition shadow-lg border border-[#FFE082]/40 cursor-pointer"
                  style={textShadowStyle}
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-[#FFE082]" />
                      <span className="text-[#FFE082]">Oração copiada para a área de transferência!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-[#FFE082]" />
                      <span>Copiar Oração da Célula</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === 'vida' && (
              <div className="space-y-2.5 text-xs text-white/95 leading-relaxed animate-in fade-in duration-200">
                <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 space-y-2">
                  <h4 className="text-xs font-bold text-[#FFE082] font-cinzel" style={titleShadowStyle}>
                    Uma Vida Consagrada ao Amor Crucificado
                  </h4>
                  <p style={textShadowStyle}>
                    Nascida em Camigliano (Lucca, Itália), Gemma Galgani perdeu os pais ainda jovem e assumiu o cuidado carinhoso dos seus irmãos. Desejava consagrar-se como religiosa Passionista, mas sua saúde frágil a impediu.
                  </p>
                  <p style={textShadowStyle}>
                    Deus tinha para ela uma vocação singular: ser uma <strong>mística no meio do mundo</strong>, demonstrando que a mais alta intimidade com Deus é acessível a todos os leigos batizados.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between text-[11px]">
                  <span className="text-white/80" style={textShadowStyle}>Canonizada por: Papa Pio XII</span>
                  <span className="font-bold text-[#FFE082]" style={textShadowStyle}>Ano de 1940</span>
                </div>
              </div>
            )}

            {activeTab === 'pilares' && (
              <div className="space-y-2.5 animate-in fade-in duration-200">
                {/* Pilar 1 */}
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-rose-500/25 border border-rose-300/40 text-rose-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Heart className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFE082]" style={titleShadowStyle}>
                      1. O Amor aos Pés da Cruz
                    </h4>
                    <p className="text-[11px] text-white leading-relaxed mt-0.5" style={textShadowStyle}>
                      Santa Gemma abraçava as cruzes diárias sem queixas, transformando o sofrimento em intercessão viva pela conversão dos pecadores.
                    </p>
                  </div>
                </div>

                {/* Pilar 2 */}
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500/25 border border-amber-300/40 text-[#FFE082] flex items-center justify-center shrink-0 mt-0.5">
                    <Feather className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFE082]" style={titleShadowStyle}>
                      2. Intimidade com o Santo Anjo
                    </h4>
                    <p className="text-[11px] text-white leading-relaxed mt-0.5" style={textShadowStyle}>
                      Uma relação diária de amizade, reverência e escuta espiritual. O anjo a protegia, corrigia e rezava junto a ela em cada momento.
                    </p>
                  </div>
                </div>

                {/* Pilar 3 */}
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-emerald-500/25 border border-emerald-300/40 text-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#FFE082]" style={titleShadowStyle}>
                      3. Santidade no Cotidiano Simples
                    </h4>
                    <p className="text-[11px] text-white leading-relaxed mt-0.5" style={textShadowStyle}>
                      Viver o Carisma e a fé no lar, no trabalho e nos afazeres normais, sem ruído, com coração ardente e olhar fixo no Céu.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Ação Devocional da Célula */}
            {onNavigate && (
              <div className="pt-2 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => onNavigate('novena')}
                  className="py-2.5 px-3 rounded-2xl bg-[#E5C158] text-[#36070D] font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:bg-yellow-400 active:scale-95 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Rezar Novena (9 Dias)</span>
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('terco')}
                  className="py-2.5 px-3 rounded-2xl bg-white/20 text-white hover:bg-white/30 backdrop-blur-md border border-white/30 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition cursor-pointer"
                  style={textShadowStyle}
                >
                  <Heart className="w-3.5 h-3.5 text-[#FFE082]" />
                  <span>Terço das Chagas</span>
                </button>
              </div>
            )}

            {/* Rodapé técnico discreto do card */}
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-[10px] text-white/70">
              <span style={textShadowStyle}>Comunidade Católica Shalom</span>
              <span className="font-mono text-[#FFE082]/90" style={textShadowStyle}>
                backdrop-filter: blur({customBlur}px)
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Modo Contemplativo com imagem limpa e apenas botão flutuante */
        <div className="relative z-20 flex flex-col items-center justify-end min-h-[60vh] px-4 pb-12 animate-in fade-in">
          <div className="p-4 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-center max-w-xs shadow-2xl space-y-2">
            <span className="text-[#FFE082] text-xs font-bold font-cinzel">
              Modo Contemplativo
            </span>
            <p className="text-xs text-white" style={textShadowStyle}>
              Imagem completa de Santa Gemma Galgani visível sem textos sobrepostos.
            </p>
            <button
              type="button"
              onClick={() => setHideTextForContemplation(false)}
              className="mt-1 w-full py-2 rounded-xl bg-[#7B1113] hover:bg-[#8B1416] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer border border-[#FFE082]/40"
            >
              <Eye className="w-3.5 h-3.5 text-[#FFE082]" />
              <span>Restaurar Painel de Vidro</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
