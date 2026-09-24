import React from 'react';
import { Menu, Bell, Image as ImageIcon } from 'lucide-react';
import { UserRole } from '../../types';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenNotices: () => void;
  onGoHome?: () => void;
  currentRole: UserRole;
  unreadNoticesCount?: number;
  bgOpacity?: number;
  onToggleBgOpacity?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMenu,
  onOpenNotices,
  onGoHome,
  currentRole,
  unreadNoticesCount = 3,
  bgOpacity = 0.55,
  onToggleBgOpacity,
}) => {
  const roleDisplay: Record<UserRole, { label: string; badgeClass: string }> = {
    admin: { label: 'Coordenação', badgeClass: 'bg-amber-100 text-amber-900 border-amber-300' },
    formador: { label: 'Formadora', badgeClass: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    membro: { label: 'Membro', badgeClass: 'bg-rose-50 text-rose-900 border-rose-200' },
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#7B1113]/95 backdrop-blur-md text-white shadow-md border-b border-[#580C14]">
      {/* Top micro bar for liturgical dignity */}
      <div className="bg-[#4B0B14] px-4 py-0.5 text-center text-[10px] tracking-widest text-[#E5C158] font-cinzel uppercase font-semibold">
        Comunidade Católica Shalom • Paz e Bem
      </div>

      <div className="px-4 py-2.5 flex items-center justify-between">
        {/* Brand & Emblem - Clickable to Home */}
        <button
          type="button"
          onClick={onGoHome}
          className="flex items-center gap-2.5 text-left group transition cursor-pointer active:scale-95"
          aria-label="Ir para o início"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E5C158] to-[#B8860B] text-[#36070D] flex items-center justify-center font-cinzel font-black text-base shadow-sm shrink-0 group-hover:scale-105 transition-transform">
            ✝
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-cinzel text-sm sm:text-base font-bold tracking-wide text-white leading-tight group-hover:text-[#FFF0BE] transition">
                SANTA GEMMA
              </h1>
              <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${roleDisplay[currentRole].badgeClass}`}>
                {roleDisplay[currentRole].label}
              </span>
            </div>
            <p className="text-[10px] text-[#FFF0BE]/80 tracking-wider">
              Célula de Oração e Fraternidade
            </p>
          </div>
        </button>

        {/* Action icons */}
        <div className="flex items-center gap-1">
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
  );
};
