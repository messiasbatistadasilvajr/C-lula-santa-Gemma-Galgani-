import React, { useState } from 'react';
import { Download, Share, PlusSquare, X, Check } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isInstalled || dismissed) {
    return null;
  }

  // Chromium / Android / Desktop prompt
  if (isInstallable) {
    return (
      <div 
        id="pwa-install-banner" 
        className="mx-4 mt-3 mb-2 rounded-xl bg-gradient-to-r from-[#7B1113] to-[#580C14] text-white p-3.5 shadow-md flex items-center justify-between gap-3 border border-[#E5C158]/30"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#36070D]/60 flex items-center justify-center shrink-0 border border-[#E5C158]/40">
            <Download className="w-5 h-5 text-[#E5C158]" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#E5C158]">Aplicativo Oficial</h4>
            <p className="text-xs text-white/90 font-medium">Instale no seu celular para acesso rápido e offline</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={install}
            className="px-3 py-1.5 rounded-lg bg-[#E5C158] hover:bg-[#D4AF37] text-[#36070D] text-xs font-bold shadow-sm transition whitespace-nowrap"
          >
            Instalar
          </button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dispensar aviso de instalação"
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <div 
          id="pwa-install-banner-ios" 
          className="mx-4 mt-3 mb-2 rounded-xl bg-[#F4EFEB] border border-[#D9D0C5] text-[#241E1C] p-3 shadow-xs flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7B1113]/10 text-[#7B1113] flex items-center justify-center shrink-0">
              <Share className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#7B1113]">Adicionar à Tela de Início</p>
              <p className="text-[11px] text-[#70645E]">Use como app no seu iPhone</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowIOSGuide(true)}
              className="px-2.5 py-1 rounded-md bg-[#7B1113] text-white text-xs font-semibold hover:bg-[#580C14] transition"
            >
              Como instalar
            </button>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dispensar"
              className="text-[#70645E] hover:text-[#241E1C] p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {showIOSGuide && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
            role="dialog"
            aria-modal="true"
          >
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-[#7B1113]/10 text-[#7B1113] flex items-center justify-center mx-auto mb-3">
                <PlusSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[#241E1C]">Instalar no iPhone ou iPad</h3>
              <p className="text-xs text-[#70645E] mt-1 mb-4">
                Siga os dois passos abaixo no navegador Safari:
              </p>
              
              <div className="text-left space-y-2.5 text-xs text-[#423834] bg-[#FBF9F5] p-3.5 rounded-xl border border-[#ECE7DF]">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#7B1113] text-white text-[11px] font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Toque no botão <strong>Compartilhar</strong> (ícone com quadrado e seta para cima) na barra do Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#7B1113] text-white text-[11px] font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.</span>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-4 w-full rounded-xl bg-[#7B1113] py-2.5 text-xs font-bold text-white hover:bg-[#580C14] transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
