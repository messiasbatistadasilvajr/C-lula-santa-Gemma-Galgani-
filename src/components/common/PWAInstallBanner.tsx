import React, { useState } from 'react';
import { 
  Download, 
  Share, 
  PlusSquare, 
  X, 
  Smartphone, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  Info,
  WifiOff,
  Flame
} from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallBannerProps {
  onDismiss?: () => void;
  className?: string;
}

export const PWAInstallBanner: React.FC<PWAInstallBannerProps> = ({ className = '' }) => {
  const { 
    isInstallable, 
    isInstalled, 
    isInBrowser, 
    isIOS, 
    isAndroid, 
    isWhatsAppOrInApp, 
    platformName, 
    install 
  } = usePWAInstall();

  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [guidePlatform, setGuidePlatform] = useState<'ios' | 'android' | 'general'>(() => {
    if (isIOS) return 'ios';
    if (isAndroid) return 'android';
    return 'general';
  });
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('sg_pwa_banner_dismissed') === 'true';
    } catch {
      return false;
    }
  });
  const [justInstalled, setJustInstalled] = useState<boolean>(false);

  // Se já está rodando como app instalado ou dispensado na sessão, não exibe
  if (isInstalled || (dismissed && !justInstalled)) {
    return null;
  }

  // Se não está no navegador (impossível em web, mas por garantia)
  if (!isInBrowser && !justInstalled) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    try {
      sessionStorage.setItem('sg_pwa_banner_dismissed', 'true');
    } catch {
      // ignore
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        setJustInstalled(true);
        setTimeout(() => {
          setJustInstalled(false);
          setDismissed(true);
        }, 4000);
      }
    } else if (isIOS) {
      setGuidePlatform('ios');
      setShowGuideModal(true);
    } else {
      setGuidePlatform('android');
      setShowGuideModal(true);
    }
  };

  return (
    <>
      <div 
        id="pwa-install-component"
        className={`mx-3 sm:mx-4 my-2.5 rounded-2xl bg-gradient-to-br from-[#7B1113] via-[#650E17] to-[#40060C] text-white p-3.5 sm:p-4 shadow-xl border border-[#E5C158]/40 transition-all duration-300 relative overflow-hidden ${className}`}
      >
        {/* Adorno dourado de fundo */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#E5C158]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-6 -top-6 w-24 h-24 bg-[#E5C158]/15 rounded-full blur-xl pointer-events-none" />

        {justInstalled ? (
          <div className="flex items-center gap-3 py-1 text-center justify-center animate-in fade-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/40">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h4 className="text-sm font-bold text-white font-cinzel">Aplicativo Adicionado!</h4>
              <p className="text-xs text-[#FFF0BE]">O ícone de Santa Gemma já está na sua tela inicial.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 relative z-10">
            {/* Aviso especial se estiver abrindo pelo navegador interno do WhatsApp */}
            {isWhatsAppOrInApp && (
              <div className="bg-[#FAF8F5]/10 border border-[#E5C158]/40 rounded-xl p-2.5 text-[11px] text-[#FFF0BE] flex items-start gap-2">
                <Info className="w-4 h-4 text-[#E5C158] shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Aviso para irmãos no WhatsApp:</strong> Toque nos <strong>três pontinhos (⋮)</strong> no topo e escolha <em>"Abrir no Chrome"</em> ou <em>"Abrir no Safari"</em> para adicionar o app à sua tela inicial!
                </div>
              </div>
            )}

            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                {/* Ícone emblemático de Santa Gemma */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E5C158] to-[#B8860B] text-[#36070D] flex items-center justify-center font-cinzel font-black text-xl shadow-md shrink-0 border border-white/30">
                  ✝
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#E5C158] text-[#36070D]">
                      App Oficial da Célula
                    </span>
                    <span className="text-[10px] text-[#FFF0BE]/80 font-medium">
                      {platformName}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-cinzel text-white mt-1 leading-snug">
                    Instalar Aplicativo no Celular
                  </h3>

                  <p className="text-xs text-white/90 font-medium mt-0.5 leading-relaxed">
                    Adicione à tela inicial para ter acesso direto em 1 toque, com modo offline e lembretes dos encontros!
                  </p>
                </div>
              </div>

              {/* Botão de Fechar */}
              <button
                type="button"
                onClick={handleDismiss}
                aria-label="Dispensar aviso de instalação temporariamente"
                className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Vantagens em Destaque */}
            <div className="grid grid-cols-3 gap-2 pt-0.5 text-[10px] text-[#FFF0BE]/90">
              <div className="bg-black/20 rounded-lg p-1.5 text-center flex flex-col items-center justify-center gap-0.5 border border-white/5">
                <Smartphone className="w-3.5 h-3.5 text-[#E5C158]" />
                <span className="font-semibold">Acesso em 1 Toque</span>
              </div>
              <div className="bg-black/20 rounded-lg p-1.5 text-center flex flex-col items-center justify-center gap-0.5 border border-white/5">
                <WifiOff className="w-3.5 h-3.5 text-[#E5C158]" />
                <span className="font-semibold">Modo Sem Sinal</span>
              </div>
              <div className="bg-black/20 rounded-lg p-1.5 text-center flex flex-col items-center justify-center gap-0.5 border border-white/5">
                <Flame className="w-3.5 h-3.5 text-[#E5C158]" />
                <span className="font-semibold">Seg & Sex 19h</span>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
              {isInstallable ? (
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#D4AF37] hover:from-[#ECD279] hover:to-[#E5C158] text-[#36070D] text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Download className="w-4 h-4 text-[#36070D]" />
                  <span>Instalar Agora no Celular</span>
                </button>
              ) : isIOS ? (
                <button
                  type="button"
                  onClick={() => {
                    setGuidePlatform('ios');
                    setShowGuideModal(true);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#D4AF37] text-[#36070D] text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Share className="w-4 h-4 text-[#36070D]" />
                  <span>Adicionar à Tela de Início (iPhone)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setGuidePlatform('android');
                    setShowGuideModal(true);
                  }}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#E5C158] to-[#D4AF37] text-[#36070D] text-xs font-bold shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
                >
                  <Smartphone className="w-4 h-4 text-[#36070D]" />
                  <span>Adicionar à Tela Inicial (Android)</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setGuidePlatform(isIOS ? 'ios' : 'android');
                  setShowGuideModal(true);
                }}
                className="py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium border border-white/20 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Passo a Passo</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#E5C158]" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Interativo com o Passo a Passo Ilustrado */}
      {showGuideModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3.5 overflow-y-auto animate-in fade-in duration-150"
          role="dialog"
          aria-modal="true"
          onClick={() => setShowGuideModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-[#FAF8F5] p-5 shadow-2xl border-2 border-[#E5C158] text-[#241E1C] space-y-4 my-auto animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            {/* Cabeçalho */}
            <div className="flex items-start justify-between gap-2 border-b border-[#EAE4DB] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#7B1113] text-[#E5C158] flex items-center justify-center font-bold text-lg shadow-sm">
                  ✝
                </div>
                <div>
                  <h3 className="text-sm font-bold font-cinzel text-[#36070D]">
                    {guidePlatform === 'ios' ? 'Instalar no iPhone / iPad' : 'Instalar no Android'}
                  </h3>
                  <p className="text-[11px] text-[#70645E]">
                    Célula Santa Gemma Galgani
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuideModal(false)}
                className="p-1.5 rounded-full text-[#70645E] hover:bg-[#EAE4DB] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Alternador de Plataforma (se o irmão quiser ver o outro) */}
            <div className="flex rounded-xl bg-[#ECE7DF] p-1 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setGuidePlatform('android')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  guidePlatform === 'android' ? 'bg-[#7B1113] text-white shadow-xs' : 'text-[#70645E]'
                }`}
              >
                📱 Android (Chrome)
              </button>
              <button
                type="button"
                onClick={() => setGuidePlatform('ios')}
                className={`flex-1 py-1.5 rounded-lg transition cursor-pointer ${
                  guidePlatform === 'ios' ? 'bg-[#7B1113] text-white shadow-xs' : 'text-[#70645E]'
                }`}
              >
                🍏 iPhone (Safari)
              </button>
            </div>

            {/* Conteúdo do Passo a Passo */}
            {guidePlatform === 'ios' ? (
              <div className="space-y-3 text-xs text-[#36070D]">
                <p className="text-[11px] text-[#70645E] leading-relaxed">
                  No navegador <strong>Safari</strong> do seu iPhone ou iPad, siga estes 3 passos simples:
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EDE8E0] shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="leading-snug">
                      <p className="font-bold text-[#7B1113] flex items-center gap-1.5">
                        <Share className="w-3.5 h-3.5" /> Botão Compartilhar
                      </p>
                      <p className="text-[#554741] mt-0.5">
                        Toque no ícone de <strong>Compartilhar</strong> (quadrado com a seta apontando para cima) na barra inferior do Safari.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EDE8E0] shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="leading-snug">
                      <p className="font-bold text-[#7B1113] flex items-center gap-1.5">
                        <PlusSquare className="w-3.5 h-3.5" /> Adicionar à Tela de Início
                      </p>
                      <p className="text-[#554741] mt-0.5">
                        Role a lista para baixo e toque em <strong>"Adicionar à Tela de Início"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EDE8E0] shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="leading-snug">
                      <p className="font-bold text-[#7B1113]">Confirmar "Adicionar"</p>
                      <p className="text-[#554741] mt-0.5">
                        Toque em <strong>"Adicionar"</strong> no canto superior direito. O app aparecerá na tela do seu iPhone!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-xs text-[#36070D]">
                <p className="text-[11px] text-[#70645E] leading-relaxed">
                  No navegador <strong>Google Chrome</strong> (ou navegador padrão do Android):
                </p>

                <div className="space-y-2.5">
                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EDE8E0] shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      1
                    </span>
                    <div className="leading-snug">
                      <p className="font-bold text-[#7B1113]">Menu dos Três Pontinhos (⋮)</p>
                      <p className="text-[#554741] mt-0.5">
                        Toque nos <strong>três pontinhos verticais</strong> no canto superior direito da tela do Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EDE8E0] shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      2
                    </span>
                    <div className="leading-snug">
                      <p className="font-bold text-[#7B1113] flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5" /> "Instalar aplicativo"
                      </p>
                      <p className="text-[#554741] mt-0.5">
                        Selecione a opção <strong>"Instalar aplicativo"</strong> ou <strong>"Adicionar à tela inicial"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 bg-white p-3 rounded-xl border border-[#EDE8E0] shadow-2xs">
                    <span className="w-6 h-6 rounded-full bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center shrink-0">
                      3
                    </span>
                    <div className="leading-snug">
                      <p className="font-bold text-[#7B1113]">Confirmação Instantânea</p>
                      <p className="text-[#554741] mt-0.5">
                        Toque em <strong>"Instalar"</strong>. Em segundos o ícone sagrado de Santa Gemma estará junto dos seus outros aplicativos!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rodapé com botão de fechar */}
            <button
              type="button"
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Compreendi, vou adicionar agora!
            </button>
          </div>
        </div>
      )}
    </>
  );
};

/**
 * Botão PWA compacto para ser inserido em cabeçalhos, menus ou na tela de perfil
 */
export const PWAInstallButton: React.FC<{
  variant?: 'solid' | 'outline' | 'menu-item';
  onClickGuide?: () => void;
  className?: string;
}> = ({ variant = 'solid', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // Se já está instalado, não precisa exibir botão de instalação redundante
  if (isInstalled) {
    return null;
  }

  const handleAction = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowModal(true);
    }
  };

  if (variant === 'menu-item') {
    return (
      <>
        <button
          type="button"
          onClick={handleAction}
          className={`w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-left group shadow-2xs active:scale-[0.98] cursor-pointer transition ${className}`}
        >
          <div className="w-9 h-9 rounded-lg bg-[#7B1113] text-[#E5C158] flex items-center justify-center shrink-0 shadow-xs">
            <Download className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-xs font-bold text-[#36070D]">
                Instalar App no Celular
              </h4>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#E5C158] text-[#36070D]">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-[#70645E] truncate">
              {isIOS ? 'Adicionar à tela de início do iPhone' : 'Acesso rápido na tela inicial'}
            </p>
          </div>
        </button>

        {showModal && <PWAInstallBanner className="hidden" />}
      </>
    );
  }

  if (variant === 'outline') {
    return (
      <button
        type="button"
        onClick={handleAction}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E5C158] bg-[#FAF8F5] text-[#7B1113] hover:bg-[#EAE4DB] text-xs font-bold transition cursor-pointer shadow-2xs ${className}`}
      >
        <Download className="w-3.5 h-3.5 text-[#E5C158]" />
        <span>Instalar no Celular</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleAction}
      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold shadow-sm transition cursor-pointer active:scale-95 ${className}`}
    >
      <Download className="w-3.5 h-3.5 text-[#E5C158]" />
      <span>Instalar App</span>
    </button>
  );
};
