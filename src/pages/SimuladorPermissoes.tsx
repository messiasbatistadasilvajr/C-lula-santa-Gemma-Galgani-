import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Check, 
  X, 
  AlertTriangle, 
  Bell, 
  Calendar, 
  MessageSquare, 
  HeartHandshake, 
  Image as ImageIcon, 
  BookOpen, 
  Settings, 
  Sparkles,
  UserCheck,
  Lock,
  Unlock,
  Layers,
  ChevronRight
} from 'lucide-react';
import { UserRole } from '../types';
import { Modal } from '../components/common/Modal';

interface SimuladorPermissoesProps {
  currentRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onNavigate: (tabId: string) => void;
  onBack: () => void;
}

export const SimuladorPermissoes: React.FC<SimuladorPermissoesProps> = ({
  currentRole,
  onSwitchRole,
  onNavigate,
  onBack,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{
    feature: string;
    allowed: boolean;
    reason: string;
    targetTab?: string;
  } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleRoleChange = (role: UserRole) => {
    onSwitchRole(role);
    const roleNames: Record<UserRole, string> = {
      membro: 'Membro da Célula',
      formador: 'Formador(a)',
      admin: 'Coordenação / Admin',
    };
    showToast(`Papel alterado para: ${roleNames[role]}!`);
  };

  // Test action permissions
  const runTest = (
    featureName: string,
    allowedRoles: UserRole[],
    descriptionAllowed: string,
    descriptionDenied: string,
    targetTab?: string
  ) => {
    const isAllowed = allowedRoles.includes(currentRole);
    setTestResult({
      feature: featureName,
      allowed: isAllowed,
      reason: isAllowed ? descriptionAllowed : descriptionDenied,
      targetTab: isAllowed ? targetTab : undefined,
    });
  };

  const rolesConfig: Record<UserRole, {
    title: string;
    badge: string;
    cardBorder: string;
    description: string;
    powers: string[];
  }> = {
    membro: {
      title: 'Membro da Célula',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      cardBorder: 'hover:border-rose-400',
      description: 'Participação ativa nos encontros, vida de oração fraterna, intercessão e partilha no mural.',
      powers: [
        'Confirmar presença nos encontros (RSVP)',
        'Fazer pedidos de oração e interceder pelos irmãos',
        'Registrar graças alcançadas',
        'Conversar nos canais de chat da célula',
        'Publicar testemunhos e reflexões no mural',
        'Visualizar e baixar apostilas de formação',
        'Visualizar fotos e memórias da célula',
      ],
    },
    formador: {
      title: 'Formador(a)',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      cardBorder: 'hover:border-emerald-400',
      description: 'Responsável pelo alimento espiritual, acompanhamento pessoal e conteúdos de formação do Caminho da Paz.',
      powers: [
        'Todas as permissões de Membro',
        'Publicar Avisos Oficiais da Célula',
        'Agendar encontros de formação espiritual',
        'Cadastrar novas apostilas e leituras sugeridas',
        'Organizar temas e roteiros das noites de célula',
      ],
    },
    admin: {
      title: 'Coordenação / Admin',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      cardBorder: 'hover:border-amber-400',
      description: 'Liderança e pastoreio da célula, gestão de eventos, escalas de serviço litúrgico e moderação geral.',
      powers: [
        'Todas as permissões de Formador e Membro',
        'Criar e gerenciar todos os eventos na Agenda',
        'Definir escalas de serviço (música, acolhida, lanche)',
        'Publicar comunicados com prioridade Alta/Urgente',
        'Moderar canais de comunicação e participantes',
        'Configurações gerais e parâmetros da célula',
      ],
    },
  };

  const permissionMatrix = [
    { feature: 'Visualizar Mural e Mensagens', membro: true, formador: true, admin: true },
    { feature: 'Confirmar Presença (RSVP)', membro: true, formador: true, admin: true },
    { feature: 'Fazer Pedido de Intercessão', membro: true, formador: true, admin: true },
    { feature: 'Rezar pelos Irmãos ("Estou Rezando")', membro: true, formador: true, admin: true },
    { feature: 'Registrar Graça Alcançada', membro: true, formador: true, admin: true },
    { feature: 'Participar do Chat Comunitário', membro: true, formador: true, admin: true },
    { feature: 'Adicionar Fotos à Galeria', membro: true, formador: true, admin: true },
    { feature: 'Publicar Aviso Oficial no Mural', membro: false, formador: true, admin: true },
    { feature: 'Agendar Encontros e Eventos', membro: false, formador: true, admin: true },
    { feature: 'Definir Escalas de Serviço', membro: false, formador: true, admin: true },
    { feature: 'Avisos com Prioridade Alta / Urgente', membro: false, formador: true, admin: true },
    { feature: 'Moderação de Canais do Chat & Ofertas', membro: false, formador: true, admin: true },
  ];

  return (
    <div className="pb-24 pt-3 px-4 space-y-4 max-w-md mx-auto">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          onClick={onBack}
          type="button"
          className="p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#ECE7DF] text-[#70645E] hover:text-[#241E1C] active:scale-95 transition cursor-pointer"
          aria-label="Voltar"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-base font-bold text-[#241E1C] font-cinzel">
            Simulador de Permissões (RBAC)
          </h2>
          <p className="text-xs text-[#70645E]">Alterne os papéis e teste as ações em tempo real</p>
        </div>
      </div>

      {/* Active Role Indicator Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#7B1113]/95 to-[#45090F]/95 backdrop-blur-md p-4 text-white shadow-md border border-[#E5C158]/40 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#E5C158]/20 flex items-center justify-center text-[#E5C158]">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-[#FFF0BE]/80 uppercase tracking-wider font-semibold">
                Papel Ativo no Momento
              </span>
              <h3 className="text-sm font-bold text-white font-cinzel">
                {rolesConfig[currentRole].title}
              </h3>
            </div>
          </div>
          <span className="text-[10px] bg-[#E5C158] text-[#36070D] font-bold px-2 py-0.5 rounded-full font-cinzel">
            Ativo
          </span>
        </div>
        <p className="text-xs text-[#FFF0BE]/90 leading-relaxed">
          {rolesConfig[currentRole].description}
        </p>
      </div>

      {/* Role Selection Buttons (The Core Switcher) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7C75] px-1 font-cinzel">
            1. Selecione o Papel para Simular
          </h3>
          <span className="text-[10px] text-[#70645E]">Toque para alternar</span>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {(['membro', 'formador', 'admin'] as UserRole[]).map(role => {
            const isSelected = currentRole === role;
            const config = rolesConfig[role];

            return (
              <button
                key={role}
                type="button"
                onClick={() => handleRoleChange(role)}
                className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer relative active:scale-[0.98] ${
                  isSelected
                    ? 'bg-white shadow-md border-[#7B1113] ring-2 ring-[#7B1113]/30'
                    : 'bg-white/80 backdrop-blur-sm border-white/70 hover:bg-white ' + config.cardBorder
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                      role === 'admin' 
                        ? 'bg-amber-100 text-amber-900' 
                        : role === 'formador' 
                        ? 'bg-emerald-100 text-emerald-900' 
                        : 'bg-rose-100 text-rose-900'
                    }`}>
                      {role === 'admin' ? '👑' : role === 'formador' ? '📖' : '🕊️'}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#241E1C]">
                        {config.title}
                      </h4>
                      <p className="text-[10px] text-[#70645E]">
                        {role === 'admin' ? 'Acesso Total' : role === 'formador' ? 'Formação & Avisos' : 'Participação Geral'}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
                    isSelected
                      ? 'bg-[#7B1113] text-white border-[#7B1113]'
                      : 'bg-[#F4EFEB] text-[#70645E] border-[#DDD5C7]'
                  }`}>
                    {isSelected ? '✓ Selecionado' : 'Alternar'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Test Buttons Suite */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A7C75] px-1 font-cinzel">
            2. Teste os Botões e Ações da Célula
          </h3>
          <span className="text-[10px] text-[#70645E]">Clique para disparar o teste</span>
        </div>

        <div className="space-y-2">
          {/* Test Button 1: Publicar Aviso */}
          <button
            type="button"
            onClick={() => runTest(
              'Publicar Aviso Oficial no Mural',
              ['admin', 'formador'],
              'Permissão CONCEDIDA! Seu papel atual tem autorização para emitir comunicados oficiais para toda a célula.',
              'Acesso BLOQUEADO! Somente irmãos com papel de Coordenação ou Formação podem publicar avisos oficiais. Mude o papel acima para testar.',
              'avisos'
            )}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/70 hover:border-[#7B1113]/30 transition shadow-2xs active:scale-[0.98] cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#241E1C] group-hover:text-[#7B1113] transition">
                  Testar: Publicar Aviso Oficial
                </h4>
                <p className="text-[10px] text-[#70645E]">
                  Requer: <strong>Coordenação</strong> ou <strong>Formação</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {['admin', 'formador'].includes(currentRole) ? (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Unlock className="w-3 h-3" /> Liberado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <Lock className="w-3 h-3" /> Restrito
                </span>
              )}
            </div>
          </button>

          {/* Test Button 2: Criar Evento & Escala */}
          <button
            type="button"
            onClick={() => runTest(
              'Criar Eventos e Gerenciar Escalas',
              ['admin', 'formador'],
              'Permissão CONCEDIDA! Você pode cadastrar novas datas de célula, missas comunitárias e organizar escalas.',
              'Acesso BLOQUEADO! Membros podem confirmar presença (RSVP), mas o agendamento de eventos é reservado à liderança.',
              'agenda'
            )}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/70 hover:border-[#7B1113]/30 transition shadow-2xs active:scale-[0.98] cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#241E1C] group-hover:text-[#7B1113] transition">
                  Testar: Criar Evento na Agenda
                </h4>
                <p className="text-[10px] text-[#70645E]">
                  Requer: <strong>Coordenação</strong> ou <strong>Formação</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {['admin', 'formador'].includes(currentRole) ? (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Unlock className="w-3 h-3" /> Liberado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <Lock className="w-3 h-3" /> Restrito
                </span>
              )}
            </div>
          </button>

          {/* Test Button 3: Moderação de Canais do Chat & Ofertas */}
          <button
            type="button"
            onClick={() => runTest(
              'Moderação Geral e Canais de Liderança',
              ['admin', 'formador'],
              'Permissão CONCEDIDA! Coordenadores, Administradores e Formadores (Cristiane Alves e Francisco José) têm acesso total aos canais e moderação da célula.',
              'Acesso BLOQUEADO! Moderação é exclusiva da Coordenação, Administração e Formação da Célula.',
              'chat'
            )}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/70 hover:border-[#7B1113]/30 transition shadow-2xs active:scale-[0.98] cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-900 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#241E1C] group-hover:text-[#7B1113] transition">
                  Testar: Moderação de Canais & Ofertas
                </h4>
                <p className="text-[10px] text-[#70645E]">
                  Requer: <strong>Coordenação / Admin</strong> ou <strong>Formador</strong>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold">
              {['admin', 'formador'].includes(currentRole) ? (
                <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  <Unlock className="w-3 h-3" /> Liberado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                  <Lock className="w-3 h-3" /> Restrito
                </span>
              )}
            </div>
          </button>

          {/* Test Button 4: Intercessão e Graças */}
          <button
            type="button"
            onClick={() => runTest(
              'Cadeia de Intercessão & Graças',
              ['membro', 'formador', 'admin'],
              'Permissão CONCEDIDA! Todos os membros da célula participam em comunhão de oração, enviando intenções e registrando graças.',
              '',
              'intercessao'
            )}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-white/90 backdrop-blur-sm border border-white/70 hover:border-[#7B1113]/30 transition shadow-2xs active:scale-[0.98] cursor-pointer group text-left"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center shrink-0">
                <HeartHandshake className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#241E1C] group-hover:text-[#7B1113] transition">
                  Testar: Pedidos de Oração & Graças
                </h4>
                <p className="text-[10px] text-[#70645E]">
                  Requer: <strong>Acesso Aberto a Todos</strong>
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] font-bold">
              <Unlock className="w-3 h-3" /> Liberado
            </span>
          </button>
        </div>
      </div>

      {/* 3. Matriz Visual de Permissões */}
      <div className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/70 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[#36070D] font-bold text-xs">
            <Layers className="w-4 h-4 text-[#7B1113]" />
            <span>Matriz Comparativa de Acesso (RBAC)</span>
          </div>
          <span className="text-[10px] font-semibold text-[#70645E]">
            PostgreSQL / Local
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#ECE7DF] text-[10px] text-[#70645E]">
                <th className="pb-2 font-bold">Funcionalidade</th>
                <th className={`pb-2 px-1 text-center font-bold ${currentRole === 'membro' ? 'text-[#7B1113] bg-[#7B1113]/5 rounded-t' : ''}`}>
                  Membro
                </th>
                <th className={`pb-2 px-1 text-center font-bold ${currentRole === 'formador' ? 'text-[#7B1113] bg-[#7B1113]/5 rounded-t' : ''}`}>
                  Formador
                </th>
                <th className={`pb-2 px-1 text-center font-bold ${currentRole === 'admin' ? 'text-[#7B1113] bg-[#7B1113]/5 rounded-t' : ''}`}>
                  Admin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ECE7DF]/60">
              {permissionMatrix.map((item, idx) => (
                <tr key={idx} className="hover:bg-black/2">
                  <td className="py-2 text-[11px] font-medium text-[#241E1C]">
                    {item.feature}
                  </td>
                  <td className={`py-2 px-1 text-center ${currentRole === 'membro' ? 'bg-[#7B1113]/5 font-bold' : ''}`}>
                    {item.membro ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-500 inline" />
                    )}
                  </td>
                  <td className={`py-2 px-1 text-center ${currentRole === 'formador' ? 'bg-[#7B1113]/5 font-bold' : ''}`}>
                    {item.formador ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-500 inline" />
                    )}
                  </td>
                  <td className={`py-2 px-1 text-center ${currentRole === 'admin' ? 'bg-[#7B1113]/5 font-bold' : ''}`}>
                    {item.admin ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600 inline" />
                    ) : (
                      <X className="w-3.5 h-3.5 text-rose-500 inline" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Test Result Feedback Modal */}
      <Modal
        isOpen={Boolean(testResult)}
        onClose={() => setTestResult(null)}
        title={testResult?.allowed ? 'Permissão Concedida' : 'Acesso Bloqueado'}
        subtitle={testResult?.feature}
      >
        {testResult && (
          <div className="space-y-3.5 text-xs">
            <div className={`p-3 rounded-xl border flex items-start gap-2.5 ${
              testResult.allowed 
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                : 'bg-rose-50 text-rose-900 border-rose-200'
            }`}>
              {testResult.allowed ? (
                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <p className="font-bold">
                  {testResult.allowed ? 'Ação Autorizada' : 'Restrição de Papel'}
                </p>
                <p className="leading-relaxed">
                  {testResult.reason}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-[#70645E]">
                Papel testado: <strong>{rolesConfig[currentRole].title}</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTestResult(null)}
                  className="px-3 py-1.5 rounded-xl border border-[#DDD5C7] text-[#70645E] hover:bg-[#EFEAE2] active:scale-95 transition cursor-pointer"
                >
                  Fechar
                </button>
                {testResult.allowed && testResult.targetTab && (
                  <button
                    type="button"
                    onClick={() => {
                      const tab = testResult.targetTab!;
                      setTestResult(null);
                      onNavigate(tab);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-[#7B1113] text-white font-bold hover:bg-[#580C14] active:scale-95 transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ir para a Página</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
