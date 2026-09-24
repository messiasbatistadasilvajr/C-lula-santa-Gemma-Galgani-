import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Music, 
  HeartHandshake, 
  Coffee, 
  Flame, 
  BookOpen, 
  Clock, 
  Share2, 
  Plus, 
  CheckCircle2, 
  Sparkles,
  Info,
  ShieldAlert
} from 'lucide-react';
import { MeetingScale, UserRole } from '../types';
import { WhatsAppSummaryModal } from '../components/common/WhatsAppSummaryModal';

interface EscalasProps {
  scales: MeetingScale[];
  currentRole: UserRole;
  onAddScale: (scale: Omit<MeetingScale, 'id'>) => void;
  onUpdateScale: (id: string, partial: Partial<MeetingScale>) => void;
  onGenerateWhatsApp: (scaleId?: string) => string;
  getWhatsAppShareUrl: (scaleId?: string) => string;
  onBack: () => void;
}

export const Escalas: React.FC<EscalasProps> = ({
  scales,
  currentRole,
  onAddScale,
  onUpdateScale,
  onGenerateWhatsApp,
  getWhatsAppShareUrl,
  onBack,
}) => {
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmedService, setConfirmedService] = useState<Record<string, boolean>>({});

  const currentScale = scales[selectedScaleIndex] || scales[0];
  const canManage = currentRole === 'admin' || currentRole === 'formador';

  // Form state for creating a new scale
  const [newMeetingDate, setNewMeetingDate] = useState('');
  const [newTheme, setNewTheme] = useState('');
  const [newFormador, setNewFormador] = useState('');
  const [newMusic, setNewMusic] = useState('');
  const [newWelcome, setNewWelcome] = useState('');
  const [newSnack, setNewSnack] = useState('');
  const [newIntercession, setNewIntercession] = useState('');
  const [newAnimator, setNewAnimator] = useState('');
  const [newNotes, setNewNotes] = useState('');

  const handleCreateScale = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeetingDate.trim() || !newTheme.trim()) return;

    onAddScale({
      meetingDate: newMeetingDate,
      theme: newTheme,
      formador: newFormador || 'A definir',
      animator: newAnimator || 'Coordenação',
      musicLeader: newMusic || 'Ministério de Música',
      welcomeLeader: newWelcome || 'Acolhida',
      snackLeader: newSnack || 'Partilha fraterna',
      intercessionLeader: newIntercession || 'Intercessão da célula',
      notes: newNotes,
      roteiro: [
        {
          id: 'r_1',
          timeEstimate: '10 min',
          title: 'Acolhida Fraterna & Recepção',
          description: 'Recepção carinhosa dos irmãos, abraço da paz e acomodação.',
          leader: newWelcome || 'Acolhida',
        },
        {
          id: 'r_2',
          timeEstimate: '25 min',
          title: 'Louvor Vibrante & Cânticos Espirituais',
          description: 'Ação de graças, cântico em línguas e efusão do Espírito Santo.',
          leader: newMusic || 'Música',
        },
        {
          id: 'r_3',
          timeEstimate: '15 min',
          title: 'Escuta da Palavra & Oração',
          description: 'Silêncio sagrado, profecia e oração fraterna comunitária.',
          leader: newAnimator || 'Animação',
        },
        {
          id: 'r_4',
          timeEstimate: '30 min',
          title: 'Formação & Partilha',
          description: 'Ensino da palavra e partilha concreta de vida.',
          leader: newFormador || 'Formador',
        },
        {
          id: 'r_5',
          timeEstimate: '20 min',
          title: 'Avisos & Ágape Fraterno',
          description: 'Avisos da célula e partilha do lanche.',
          leader: newSnack || 'Lanche',
        },
      ],
    });

    setShowCreateModal(false);
    // Reset form
    setNewMeetingDate('');
    setNewTheme('');
    setNewFormador('');
    setNewMusic('');
    setNewWelcome('');
    setNewSnack('');
    setNewIntercession('');
    setNewAnimator('');
    setNewNotes('');
  };

  const handleToggleConfirmService = (roleKey: string) => {
    setConfirmedService(prev => ({
      ...prev,
      [roleKey]: !prev[roleKey]
    }));
  };

  if (!currentScale) {
    return (
      <div className="p-6 text-center">
        <p className="text-sm text-[#70645E]">Nenhuma escala cadastrada no momento.</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  const serviceRoles = [
    {
      key: 'music',
      label: 'Música & Louvor',
      person: currentScale.musicLeader,
      icon: Music,
      color: 'bg-amber-100 text-amber-900 border-amber-200',
      tips: 'Conduzir os cânticos de louvor, oração em línguas e adoração.',
    },
    {
      key: 'welcome',
      label: 'Acolhida & Recepção',
      person: currentScale.welcomeLeader,
      icon: HeartHandshake,
      color: 'bg-rose-100 text-rose-900 border-rose-200',
      tips: 'Receber cada irmão na porta com um sorriso fraterno e folhetos.',
    },
    {
      key: 'snack',
      label: 'Lanche / Ágape Fraterno',
      person: currentScale.snackLeader,
      icon: Coffee,
      color: 'bg-emerald-100 text-emerald-900 border-emerald-200',
      tips: 'Organizar os comes e bebes e preparar a mesa comunitária.',
    },
    {
      key: 'intercession',
      label: 'Intercessão Prévia',
      person: currentScale.intercessionLeader,
      icon: Flame,
      color: 'bg-indigo-100 text-indigo-900 border-indigo-200',
      tips: 'Oração de intercessão 15 a 30 minutos antes do início do encontro.',
    },
    {
      key: 'animator',
      label: 'Animação / Condução',
      person: currentScale.animator,
      icon: Sparkles,
      color: 'bg-purple-100 text-purple-900 border-purple-200',
      tips: 'Oração inicial, conduzir as etapas do roteiro com sensibilidade ao Espírito.',
    },
    {
      key: 'formador',
      label: 'Formação & Ensino',
      person: currentScale.formador,
      icon: BookOpen,
      color: 'bg-blue-100 text-blue-900 border-blue-200',
      tips: 'Ministração do tema do Caminho da Paz e mediação das partilhas.',
    },
  ];

  return (
    <div className="space-y-4 px-4 py-3 animate-in fade-in duration-200">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="flex items-center gap-2">
          {canManage && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="py-1.5 px-3 rounded-xl bg-[#7B1113] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Escala</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowWhatsAppModal(true)}
            className="py-1.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Gerar WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Hero Header Card */}
      <div className="p-4 rounded-2xl bg-linear-to-br from-[#7B1113] to-[#4A0A0C] text-white shadow-md border border-[#E5C158]/30 relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#E5C158] text-[#36070D] uppercase tracking-wider">
              Encontro da Célula
            </span>
            <span className="text-[11px] text-[#F3E7C4] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> {currentScale.meetingDate}
            </span>
          </div>

          <h2 className="text-lg font-bold font-cinzel text-white leading-snug">
            {currentScale.theme}
          </h2>

          <div className="flex items-center justify-between text-xs text-[#F3E7C4]/90 pt-1 border-t border-white/10">
            <span>Formador(a): <strong className="text-white">{currentScale.formador}</strong></span>
            <span>Animador: <strong className="text-white">{currentScale.animator}</strong></span>
          </div>

          {currentScale.notes && (
            <p className="text-[11px] text-[#F3E7C4]/80 italic bg-black/20 p-2 rounded-lg">
              📌 {currentScale.notes}
            </p>
          )}
        </div>
      </div>

      {/* Escala de Serviços Grid */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B1113] flex items-center gap-1.5">
            <HeartHandshake className="w-4 h-4" />
            <span>Escala de Serviços da Semana</span>
          </h3>
          <span className="text-[10px] text-[#70645E]">Toque para confirmar serviço</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {serviceRoles.map(item => {
            const Icon = item.icon;
            const isConfirmed = confirmedService[item.key];

            return (
              <div
                key={item.key}
                onClick={() => handleToggleConfirmService(item.key)}
                className={`p-3 rounded-xl border transition cursor-pointer select-none relative group active:scale-[0.98] ${
                  isConfirmed 
                    ? 'bg-emerald-50/80 border-emerald-300 shadow-xs' 
                    : 'bg-white/80 border-[#EDE8E0] hover:border-[#DDD5C7] shadow-2xs'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#8A7C75]">
                        {item.label}
                      </span>
                      <h4 className="text-xs font-bold text-[#241E1C]">
                        {item.person}
                      </h4>
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Confirmar presença"
                    className={`w-6 h-6 rounded-full flex items-center justify-center transition ${
                      isConfirmed ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-[#70645E] leading-relaxed">
                  {item.tips}
                </p>

                {isConfirmed && (
                  <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Presença confirmada no serviço!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Roteiro Estruturado do Encontro */}
      <div className="space-y-2.5 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B1113] flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Roteiro & Minutagem do Encontro</span>
          </h3>
          <span className="text-[10px] text-[#8A7C75] bg-[#F4EFEB] px-2 py-0.5 rounded-md font-semibold">
            Duração: ~1h40min
          </span>
        </div>

        <div className="space-y-2">
          {currentScale.roteiro.map((step, idx) => (
            <div
              key={step.id}
              className="p-3 bg-white/90 rounded-xl border border-[#EDE8E0] shadow-2xs flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-full bg-[#7B1113] text-[#E5C158] font-bold text-xs flex items-center justify-center shrink-0">
                {idx + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#36070D]">
                    {step.title}
                  </h4>
                  <span className="text-[10px] font-bold text-[#7B1113] bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200 shrink-0">
                    {step.timeEstimate}
                  </span>
                </div>

                <p className="text-[11px] text-[#554741] mt-1 leading-relaxed">
                  {step.description}
                </p>

                {step.leader && (
                  <p className="text-[10px] text-[#8A7C75] mt-1">
                    Responsável: <strong className="text-[#36070D]">{step.leader}</strong>
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Criar Nova Escala */}
      {showCreateModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#EDE8E0] p-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold font-cinzel text-[#36070D] mb-3">
              Cadastrar Nova Escala & Roteiro
            </h3>

            <form onSubmit={handleCreateScale} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#36070D] mb-1">Data e Horário:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Quinta-feira, 03 de Outubro • 19:30"
                  value={newMeetingDate}
                  onChange={e => setNewMeetingDate(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#36070D] mb-1">Tema da Formação:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: A Vida no Espírito e a Vocação Cristã"
                  value={newTheme}
                  onChange={e => setNewTheme(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Formador(a):</label>
                  <input
                    type="text"
                    placeholder="Nome do formador"
                    value={newFormador}
                    onChange={e => setNewFormador(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Animação/Oração:</label>
                  <input
                    type="text"
                    placeholder="Nome do condutor"
                    value={newAnimator}
                    onChange={e => setNewAnimator(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Música / Louvor:</label>
                  <input
                    type="text"
                    placeholder="Quem toca violão/canta"
                    value={newMusic}
                    onChange={e => setNewMusic(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Acolhida & Porta:</label>
                  <input
                    type="text"
                    placeholder="Quem recebe os irmãos"
                    value={newWelcome}
                    onChange={e => setNewWelcome(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Lanche / Comes:</label>
                  <input
                    type="text"
                    placeholder="Quem organiza o ágape"
                    value={newSnack}
                    onChange={e => setNewSnack(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Intercessão Prévia:</label>
                  <input
                    type="text"
                    placeholder="Quem reza antes"
                    value={newIntercession}
                    onChange={e => setNewIntercession(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#36070D] mb-1">Observações adicionais:</label>
                <textarea
                  rows={2}
                  placeholder="Instruções para o encontro..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD5C7]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg text-[#70645E] hover:bg-[#EAE4DB]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#7B1113] text-white font-bold"
                >
                  Salvar Escala
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WhatsApp Modal */}
      <WhatsAppSummaryModal
        isOpen={showWhatsAppModal}
        onClose={() => setShowWhatsAppModal(false)}
        scale={currentScale}
        summaryText={onGenerateWhatsApp(currentScale.id)}
        shareUrl={getWhatsAppShareUrl(currentScale.id)}
      />
    </div>
  );
};
