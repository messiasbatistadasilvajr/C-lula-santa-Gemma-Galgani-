import React from 'react';
import { 
  X, 
  Image as ImageIcon, 
  BookOpen, 
  Bell, 
  Cross, 
  Sparkles, 
  ShieldCheck, 
  Database, 
  ExternalLink,
  Clock,
  Sun,
  Music,
  Cloud
} from 'lucide-react';
import { UserRole } from '../../types';
import { getSupabaseStatus } from '../../services/supabaseClient';
import { localDataService } from '../../services/dataService';

interface SecondaryMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tabId: string) => void;
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
}

export const SecondaryMenuSheet: React.FC<SecondaryMenuSheetProps> = ({
  isOpen,
  onClose,
  onNavigate,
  currentRole,
  onSwitchRole,
}) => {
  if (!isOpen) return null;

  const supabaseStatus = getSupabaseStatus();

  const menuItems = [
    {
      id: 'escalas',
      title: 'Escalas & Roteiro do Encontro',
      subtitle: 'Música, acolhida, lanche, louvor e minutagem',
      icon: Clock,
      color: 'bg-rose-100 text-rose-900',
    },
    {
      id: 'liturgia',
      title: 'Liturgia Diária & Santo do Dia',
      subtitle: 'Leituras bíblicas, salmo, evangelho e virtudes',
      icon: Sun,
      color: 'bg-emerald-100 text-emerald-900',
    },
    {
      id: 'cancioneiro',
      title: 'Cancioneiro da Célula',
      subtitle: 'Cânticos com cifras, letras e transposição de tom',
      icon: Music,
      color: 'bg-purple-100 text-purple-900',
    },
    {
      id: 'permissoes',
      title: 'Simulador de Permissões',
      subtitle: 'Teste os papéis (Membro, Formador, Admin) e a matriz RBAC',
      icon: ShieldCheck,
      color: 'bg-amber-100 text-amber-900',
    },
    {
      id: 'galeria',
      title: 'Galeria da Célula',
      subtitle: 'Álbuns, retiros, encontros e fraternidade',
      icon: ImageIcon,
      color: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'formacao',
      title: 'Biblioteca de Formação',
      subtitle: 'Carisma Shalom, Santa Gemma, orações e apostilas',
      icon: BookOpen,
      color: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'avisos',
      title: 'Mural de Avisos',
      subtitle: 'Comunicações oficiais e pedidos urgentes',
      icon: Bell,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'santagemma',
      title: 'Santa Gemma Galgani',
      subtitle: 'História, mística da Cruz, anjo da guarda e novena',
      icon: Cross,
      color: 'bg-rose-100 text-rose-800',
    },
  ];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/60 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xs h-full bg-[#FAF8F5] shadow-2xl flex flex-col overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-[#ECE7DF]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#ECE7DF] bg-[#F4EFEB] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#7B1113] text-[#E5C158] flex items-center justify-center font-cinzel font-bold text-sm">
              SG
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#36070D]">Menu Complementar</h3>
              <p className="text-[10px] text-[#70645E]">Comunidade Católica Shalom</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label="Fechar menu"
            className="p-1 rounded-full text-[#70645E] hover:bg-[#E5DFD7] active:scale-95 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-3 space-y-1.5 flex-1">
          <p className="px-2 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#8A7C75]">
            Acessos Especiais
          </p>

          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white hover:bg-[#F2ECE3] border border-[#EDE8E0] transition text-left group shadow-2xs active:scale-[0.98] cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-[#241E1C] group-hover:text-[#7B1113] transition">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#70645E] truncate">
                    {item.subtitle}
                  </p>
                </div>
              </button>
            );
          })}

          {/* Permissões / Role Tester */}
          <div className="mt-5 p-3 rounded-xl bg-white border border-[#EDE8E0] shadow-2xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#7B1113]" />
                <p className="text-[11px] font-bold text-[#36070D]">
                  Simulador de Permissões (RBAC)
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  onNavigate('permissoes');
                  onClose();
                }}
                className="text-[10px] text-[#7B1113] font-bold hover:underline cursor-pointer"
              >
                Ver Matriz &rarr;
              </button>
            </div>
            <p className="text-[10px] text-[#70645E] leading-relaxed">
              Alterne o papel do usuário para testar as permissões de acesso:
            </p>
            <div className="grid grid-cols-3 gap-1.5">
              {(['membro', 'formador', 'admin'] as UserRole[]).map(role => {
                const isSelected = currentRole === role;
                const labels: Record<UserRole, string> = {
                  membro: 'Membro',
                  formador: 'Formadora',
                  admin: 'Coord/Admin',
                };
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => onSwitchRole(role)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold transition text-center cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#7B1113] text-white shadow-xs'
                        : 'bg-[#F4EFEB] text-[#423834] hover:bg-[#EAE4DB]'
                    }`}
                  >
                    {labels[role]} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => {
                onNavigate('permissoes');
                onClose();
              }}
              className="w-full mt-2 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#DDD5C7] text-[10px] font-bold text-[#7B1113] hover:bg-[#EFEAE2] active:scale-95 transition text-center cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Abrir Simulador Completo & Testes</span>
              <span>&rarr;</span>
            </button>
          </div>

          {/* Firebase Cloud Status Info */}
          <div className="mt-3 p-3 rounded-xl bg-[#F0EAE1] border border-[#DDD5C7] text-left">
            <div className="flex items-center gap-1.5 text-[#36070D] font-bold text-[11px] mb-1">
              <Cloud className="w-3.5 h-3.5 text-[#7B1113]" />
              <span>Nuvem em Tempo Real (Firebase)</span>
            </div>
            <p className="text-[10px] text-[#554741] leading-relaxed">
              Firestore conectado com regras de segurança ABAC ativas e sincronização multi-usuário.
            </p>
            <div className="mt-2 flex items-center justify-between text-[10px] pt-1.5 border-t border-[#DDD5C7]/60 text-[#70645E]">
              <span>Status:</span>
              <span className="font-semibold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                Ativo / Sincronizado
              </span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-[#ECE7DF] bg-[#F4EFEB] text-center">
          <p className="text-[10px] text-[#8A7C75]">
            Santa Gemma Galgani • Shalom v1.0
          </p>
        </div>
      </div>
    </div>
  );
};
