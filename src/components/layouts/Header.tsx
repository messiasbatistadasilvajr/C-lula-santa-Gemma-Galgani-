import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Menu, Bell, Image as ImageIcon, Share2, Copy, Check, MessageCircle, X, QrCode, UserCheck } from 'lucide-react';
import { UserRole } from '../../types';
import { generateQrMatrixFromString } from '../../utils/pixGenerator';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotices: () => void;
  onGoHome?: () => void;
  currentRole: UserRole;
  unreadNoticesCount?: number;
  bgOpacity?: number;
  onToggleBgOpacity?: () => void;
}

const PUBLIC_APP_URL = 'https://ais-pre-kgz6f3aqokvkmkzezbfub7-154268790842.us-east1.run.app';

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotices,
  onGoHome,
  currentRole,
  unreadNoticesCount = 3,
  bgOpacity = 0.55,
  onToggleBgOpacity,
}) => {
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [isLargeText, setIsLargeText] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sg_accessible_large_text') === 'true';
    } catch {
      return false;
    }
  });

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isLargeText) {
        document.documentElement.classList.add('accessible-large-text');
      } else {
        document.documentElement.classList.remove('accessible-large-text');
      }
    }
    try {
      localStorage.setItem('sg_accessible_large_text', String(isLargeText));
    } catch {
      // ignore
    }
  }, [isLargeText]);

  const shareUrl =
    typeof window !== 'undefined' && !window.location.hostname.includes('ais-dev')
      ? window.location.origin
      : PUBLIC_APP_URL;

  const whatsappInviteText =
    `🌹 *Shalom, irmãos da Célula Santa Gemma Galgani!* ✝️\n\n` +
    `Acesse agora o nosso *Aplicativo Oficial da Célula* (Encontros toda Segunda e Sexta das 19h às 21h) com Mural, Pedidos de Oração, Terço Virtual e Caixinha da Célula (PIX):\n\n` +
    `👉 ${shareUrl}\n\n` +
    `📱 _Basta tocar no link acima para abrir direto no celular (sem precisar de senha)!_`;

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const qrMatrix = generateQrMatrixFromString(shareUrl, 25);

  const roleDisplay: Record<UserRole, { label: string; badgeClass: string }> = {
    admin: { label: 'Coordenação', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300' },
    formador: { label: 'Formadora', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    membro: { label: 'Membro', badgeClass: 'bg-rose-50 text-rose-900 border-rose-200' },
  };

  return (
    <>
      <header className="sticky top-0 z-30 w-full bg-[#7B1113]/95 backdrop-blur-md text-white shadow-md border-b border-[#580C14]">
        {/* Top micro bar for liturgical dignity */}
        <div className="bg-[#4B0B14] px-4 py-0.5 text-center text-[10px] tracking-widest text-[#E5C158] font-cinzel uppercase font-semibold">
          Comunidade Católica Shalom • Seg & Sex 19h às 21h
        </div>

        <div className="px-3.5 py-2.5 flex items-center justify-between gap-1">
          {/* Brand & Emblem - Clickable to Home */}
          <button
            type="button"
            onClick={onGoHome}
            className="flex items-center gap-2 text-left group transition cursor-pointer active:scale-95 min-w-0"
            aria-label="Ir para o início"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5C158] to-[#B8860B] text-[#36070D] flex items-center justify-center font-cinzel font-black text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform">
              ✝
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="font-cinzel text-sm font-bold tracking-wide text-white leading-tight group-hover:text-[#FFF0BE] transition truncate">
                  SANTA GEMMA
                </h1>
              </div>
              <p className="text-[10px] text-[#FFF0BE]/85 truncate">
                Seg & Sex • 19h às 21h
              </p>
            </div>
          </button>

          {/* Action icons */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Botão de Acessibilidade Letra Grande (A+) */}
            <button
              type="button"
              onClick={() => setIsLargeText(prev => !prev)}
              title={isLargeText ? 'Voltar ao tamanho normal de letra' : 'Aumentar tamanho das letras para leitura fácil'}
              aria-label="Alternar tamanho da letra (A+)"
              className={`px-2 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer active:scale-95 border ${
                isLargeText
                  ? 'bg-white text-[#7B1113] border-[#E5C158] shadow-sm'
                  : 'bg-white/15 text-[#FFF0BE] border-white/25 hover:bg-white/25'
              }`}
            >
              {isLargeText ? 'A-' : 'A+'}
            </button>

            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              title="Compartilhar App com o Grupo de Oração"
              aria-label="Compartilhar App com o Grupo de Oração"
              className="px-2.5 py-1.5 rounded-xl bg-[#E5C158] hover:bg-[#f2cf66] text-[#36070D] active:scale-95 transition cursor-pointer flex items-center gap-1 text-[10px] font-extrabold shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Convidar</span>
            </button>

            {onToggleBgOpacity && (
              <button
                type="button"
                onClick={onToggleBgOpacity}
                title={`Fundo Santa Gemma: ${(bgOpacity * 100).toFixed(0)}% (Clique para alterar)`}
                aria-label="Ajustar visibilidade do fundo de Santa Gemma"
                className="p-2 rounded-xl text-[#FFF0BE] hover:bg-white/10 active:scale-95 transition cursor-pointer flex items-center gap-1 text-[11px]"
              >
                <ImageIcon className="w-4 h-4" />
                <span className="text-[10px] font-bold font-mono">
                  {Math.round(bgOpacity * 100)}%
                </span>
              </button>
            )}

            <button
              type="button"
              onClick={onOpenNotices}
              aria-label="Abrir avisos da célula"
              className="p-2 rounded-xl text-[#FFF0BE] hover:bg-white/10 active:scale-95 transition cursor-pointer relative"
            >
              <Bell className="w-5 h-5" />
              {unreadNoticesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#E5C158] border-2 border-[#7B1113]" />
              )}
            </button>

            <button
              type="button"
              onClick={onOpenMenu}
              aria-label="Abrir menu complementar"
              className="p-2 rounded-xl text-[#FFF0BE] hover:bg-white/10 active:scale-95 transition cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Modal de Compartilhamento para o Grupo de Oração */}
      {isShareOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto"
            onClick={() => setIsShareOpen(false)}
          >
            <div
              className="w-full max-w-sm mx-auto my-auto bg-[#FAF8F5] rounded-2xl p-4 shadow-2xl border-2 border-[#E5C158] space-y-3.5 text-[#241E1C] animate-in zoom-in-95 duration-150 max-h-[90dvh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113]">
                    Acesso Liberado para Todos os Irmãos
                  </span>
                  <h3 className="text-sm font-bold font-cinzel text-[#36070D]">
                    Enviar App para o Grupo de Oração
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsShareOpen(false)}
                  className="p-1 rounded-full text-[#70645E] hover:bg-[#EAE4DB] cursor-pointer shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 text-[11px] text-emerald-950 leading-relaxed">
                ✅ <strong>Sincronização Automática Ativa:</strong> Qualquer irmão do grupo que abrir o link abaixo já consegue ver e interagir no Mural, Intercessão, Agenda e Caixinha PIX sem bloqueio de login!
              </div>

              {/* QR Code para escanear presencialmente no encontro */}
              <div className="flex flex-col items-center justify-center bg-white p-3 rounded-xl border border-[#ECE7DF]">
                <svg
                  viewBox={`0 0 ${qrMatrix.length} ${qrMatrix.length}`}
                  width={132}
                  height={132}
                  shapeRendering="crispEdges"
                >
                  <rect width={qrMatrix.length} height={qrMatrix.length} fill="#FFFFFF" />
                  {qrMatrix.map((row, rIdx) =>
                    row.map((cell, cIdx) =>
                      cell ? (
                        <rect key={`${rIdx}-${cIdx}`} x={cIdx} y={rIdx} width={1} height={1} fill="#241E1C" />
                      ) : null
                    )
                  )}
                </svg>
                <span className="text-[10px] text-[#70645E] mt-1.5 font-medium text-center">
                  Escaneie na reunião da célula ou envie no WhatsApp
                </span>
              </div>

              {/* Caixa com o Link Oficial */}
              <div className="bg-white p-2.5 rounded-xl border border-[#DFD8CE]">
                <span className="text-[9px] font-bold uppercase text-[#70645E] block mb-0.5">
                  Link Oficial do Aplicativo:
                </span>
                <p className="text-[11px] font-mono text-[#7B1113] font-bold break-all select-all">
                  {shareUrl}
                </p>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-2">
                <a
                  href={`https://api.whatsapp.com/send?text=${encodeURIComponent(whatsappInviteText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-3 rounded-xl bg-[#075E54] hover:bg-[#064E46] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar Convite no Grupo do WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={handleCopyInvite}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 text-[#E5C158]" />
                      <span>Link Copiado! Cole no WhatsApp</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar Link do App</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};

