import React, { useState, useMemo } from 'react';
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
  Repeat,
  Moon,
  Copy,
  Check,
  Phone
} from 'lucide-react';
import { MeetingScale, UserRole } from '../types';
import { WhatsAppSummaryModal } from '../components/common/WhatsAppSummaryModal';
import { Modal } from '../components/common/Modal';
import { 
  getUpcomingVigilias, 
  generateVigiliaWhatsAppText, 
  getVigiliaWhatsAppShareLink,
  VigiliaEscala 
} from '../services/vigiliaService';

interface EscalasProps {
  scales: MeetingScale[];
  currentRole: UserRole;
  onAddScale: (scale: Omit<MeetingScale, 'id'>) => void;
  onUpdateScale: (id: string, partial: Partial<MeetingScale>) => void;
  onGenerateWhatsApp: (scaleId?: string) => string;
  getWhatsAppShareUrl: (scaleId?: string) => string;
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

export const Escalas: React.FC<EscalasProps> = ({
  scales,
  currentRole,
  onAddScale,
  onUpdateScale,
  onGenerateWhatsApp,
  getWhatsAppShareUrl,
  onBack,
  onNavigate,
}) => {
  // Navigation between monthly vigilia and regular meetings
  const [activeSection, setActiveSection] = useState<'vigilia' | 'encontros'>('vigilia');
  
  // Meeting scales state
  const [selectedScaleIndex, setSelectedScaleIndex] = useState(0);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirmedService, setConfirmedService] = useState<Record<string, boolean>>({});

  // Vigilia state: 12 upcoming monthly vigilias starting Oct 2026
  const vigilias = useMemo(() => getUpcomingVigilias(12, 2026, 10), []);
  // Default selected vigilia is Nov 26, 2026 (index 1)
  const [selectedVigiliaIndex, setSelectedVigiliaIndex] = useState(1);
  const [showVigiliaWhatsAppModal, setShowVigiliaWhatsAppModal] = useState(false);
  const [copiedVigilia, setCopiedVigilia] = useState(false);

  const currentScale = scales[selectedScaleIndex] || scales[0];
  const currentVigilia: VigiliaEscala = vigilias[selectedVigiliaIndex] || vigilias[1] || vigilias[0];
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

  const handleCopyVigiliaText = () => {
    const text = generateVigiliaWhatsAppText(currentVigilia);
    navigator.clipboard.writeText(text);
    setCopiedVigilia(true);
    setTimeout(() => setCopiedVigilia(false), 2500);
  };

  const serviceRoles = currentScale ? [
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
  ] : [];

  return (
    <div className="space-y-4 px-4 py-3 animate-in fade-in duration-200 max-w-lg mx-auto">
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
          {activeSection === 'encontros' && canManage && (
            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="py-1.5 px-3 rounded-xl bg-[#7B1113] text-white text-xs font-bold flex items-center gap-1 shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nova Escala</span>
            </button>
          )}

          {activeSection === 'encontros' && currentScale && (
            <button
              type="button"
              onClick={() => setShowWhatsAppModal(true)}
              className="py-1.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          )}

          {activeSection === 'vigilia' && (
            <button
              type="button"
              onClick={() => setShowVigiliaWhatsAppModal(true)}
              className="py-1.5 px-3 rounded-xl bg-[#25D366] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer hover:bg-[#20ba5a]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp da Vigília</span>
            </button>
          )}
        </div>
      </div>

      {/* Selector de Seção: Vigília (Todo dia 26) vs Encontros (Seg & Sex) */}
      <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#ECE7DF] rounded-2xl border border-[#D9D0C5]">
        <button
          type="button"
          onClick={() => setActiveSection('vigilia')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'vigilia'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'text-[#554741] hover:text-[#241E1C]'
          }`}
        >
          <Flame className={`w-4 h-4 ${activeSection === 'vigilia' ? 'text-[#E5C158]' : 'text-amber-700'}`} />
          <span>Vigília (Todo dia 26)</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveSection('encontros')}
          className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSection === 'encontros'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'text-[#554741] hover:text-[#241E1C]'
          }`}
        >
          <Calendar className={`w-4 h-4 ${activeSection === 'encontros' ? 'text-[#E5C158]' : 'text-[#7B1113]'}`} />
          <span>Encontros (Seg/Sex)</span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* SEÇÃO 1: ESCALA DA VIGÍLIA MENSAL (TODO DIA 26 COM TROCA MENSAL)   */}
      {/* =================================================================== */}
      {activeSection === 'vigilia' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {/* Header Card da Vigília */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7B1113] via-[#5A0D12] to-[#3B070B] text-white shadow-md border border-[#E5C158]/50 space-y-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C158] flex items-center gap-1">
                  <Moon className="w-3.5 h-3.5 text-[#E5C158]" />
                  <span>Vigília Mensal • Adoração & Intercessão</span>
                </span>
                <h2 className="text-base font-bold font-cinzel text-white mt-0.5">
                  Todo Dia 26 de Cada Mês
                </h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5C158] text-[#36070D]">
                Revezamento Ativo
              </span>
            </div>

            <p className="text-xs text-[#FFF0BE]/95 leading-relaxed">
              Adoração ao Santíssimo Sacramento e oração fervorosa pelas famílias da Célula Santa Gemma Galgani.
            </p>

            {/* Banner explicativo da regra de troca mensal */}
            <div className="p-2.5 rounded-xl bg-black/25 border border-[#E5C158]/30 flex items-start gap-2 text-xs text-[#FFF0BE]">
              <Repeat className="w-4 h-4 text-[#E5C158] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold text-white text-[11px] block">
                  Regra de Alternância Mensal Consecutiva:
                </span>
                <p className="text-[11px] leading-tight text-[#FFF0BE]/90">
                  No próximo dia <strong>26/11/2026</strong> quem estava no 1° horário (<strong>Cris e Francisco</strong>) passa para o 2° horário, e <strong>Raquel e Regina</strong> assumem o 1° horário, alternando consecutivamente a cada mês!
                </p>
              </div>
            </div>
          </div>

          {/* Seletor de Meses da Vigília */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-xs font-bold text-[#36070D]">
                Selecione o Mês da Vigília:
              </span>
              <span className="text-[10px] font-semibold text-[#70645E]">
                {currentVigilia.diaDaSemana}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {vigilias.map((vig, idx) => {
                const isSelected = selectedVigiliaIndex === idx;
                const isNov26 = vig.ano === 2026 && vig.mes === 11;
                return (
                  <button
                    key={vig.id}
                    type="button"
                    onClick={() => setSelectedVigiliaIndex(idx)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-[#7B1113] text-white shadow-xs'
                        : isNov26
                        ? 'bg-amber-100 text-[#7B1113] border border-amber-300 hover:bg-amber-200'
                        : 'bg-white/90 text-[#554741] border border-[#EDE8E0] hover:bg-white'
                    }`}
                  >
                    <span>{vig.mesAnoLabel}</span>
                    {isNov26 && (
                      <span className={`text-[9px] px-1 py-0.2 rounded-full font-bold ${isSelected ? 'bg-[#E5C158] text-[#36070D]' : 'bg-[#7B1113] text-white'}`}>
                        Próxima
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card Principal da Vigília Selecionada */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3">
              <div>
                <span className="text-[11px] font-bold text-[#7B1113] uppercase tracking-wider flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{currentVigilia.dataFormatada}</span>
                </span>
                <h3 className="text-sm font-bold text-[#241E1C] mt-0.5">
                  Escala de Turnos ({currentVigilia.diaDaSemana})
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-[#70645E] block">Local</span>
                <span className="text-[11px] font-bold text-[#36070D]">Capela do Santíssimo</span>
              </div>
            </div>

            {/* Aviso do revezamento aplicado no mês */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{currentVigilia.descricaoRegra}</span>
            </div>

            {/* Turnos / Horários da Vigília */}
            <div className="space-y-3">
              {/* 1° Horário */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/70 via-rose-50/40 to-amber-50/70 border-2 border-amber-300 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#7B1113] text-[#E5C158] font-bold text-xs flex items-center justify-center shadow-xs">
                      1°
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#36070D]">
                        1° Horário: {currentVigilia.horario1.rotulo}
                      </h4>
                      <p className="text-[10px] text-[#70645E]">
                        Turno de abertura e adoração comunitária ({currentVigilia.horario1.timeRange})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300">
                    {currentVigilia.horario1.timeRange}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentVigilia.horario1.membros.map(m => (
                    <div key={m.nome} className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] flex items-center gap-2.5 shadow-2xs">
                      {m.avatarUrl ? (
                        <img 
                          src={m.avatarUrl} 
                          alt={m.nome} 
                          className="w-9 h-9 rounded-full object-cover border-2 border-[#E5C158] shrink-0" 
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-[#7B1113] text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {m.nomeCurto[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#241E1C] truncate">
                            {m.nome}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#70645E] truncate">
                          {m.papel}
                        </p>
                        {m.telefone && (
                          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{m.telefone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2° Horário */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-50/60 via-indigo-50/40 to-purple-50/60 border-2 border-indigo-200 shadow-2xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-indigo-900 text-indigo-100 font-bold text-xs flex items-center justify-center shadow-xs">
                      2°
                    </span>
                    <div>
                      <h4 className="text-xs font-bold text-[#36070D]">
                        2° Horário: {currentVigilia.horario2.rotulo}
                      </h4>
                      <p className="text-[10px] text-[#70645E]">
                        Turno da madrugada e intercessão profunda ({currentVigilia.horario2.timeRange})
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-200">
                    {currentVigilia.horario2.timeRange}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {currentVigilia.horario2.membros.map(m => (
                    <div key={m.nome} className="p-2.5 rounded-xl bg-white border border-[#E8DFD3] flex items-center gap-2.5 shadow-2xs">
                      {m.avatarUrl ? (
                        <img 
                          src={m.avatarUrl} 
                          alt={m.nome} 
                          className="w-9 h-9 rounded-full object-cover border-2 border-indigo-300 shrink-0" 
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-indigo-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {m.nomeCurto[0]}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-[#241E1C] truncate">
                            {m.nome}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#70645E] truncate">
                          {m.papel}
                        </p>
                        {m.telefone && (
                          <p className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{m.telefone}</span>
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Ações de Compartilhamento */}
            <div className="pt-2 border-t border-[#F0EBE1] flex items-center gap-2">
              <a
                href={getVigiliaWhatsAppShareLink(currentVigilia)}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition active:scale-95"
              >
                <Share2 className="w-4 h-4" />
                <span>Enviar no WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={handleCopyVigiliaText}
                className="py-2.5 px-3.5 rounded-xl bg-white border border-[#D9D0C5] text-[#36070D] text-xs font-bold flex items-center gap-1.5 hover:bg-[#FAF8F5] transition active:scale-95 cursor-pointer"
              >
                {copiedVigilia ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#70645E]" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Tabela do Cronograma dos Próximos Meses (Para consulta de todos) */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-[#36070D] flex items-center gap-1.5">
                <Repeat className="w-3.5 h-3.5 text-[#7B1113]" />
                <span>Cronograma de Revezamento Mensal</span>
              </h3>
              <span className="text-[10px] text-[#70645E]">Todo dia 26</span>
            </div>

            <div className="space-y-1.5">
              {vigilias.map((vig, idx) => {
                const isSelected = selectedVigiliaIndex === idx;
                const isNov26 = vig.ano === 2026 && vig.mes === 11;
                return (
                  <div
                    key={vig.id}
                    onClick={() => setSelectedVigiliaIndex(idx)}
                    className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-amber-50/80 border-[#7B1113]'
                        : isNov26
                        ? 'bg-rose-50/50 border-rose-200 hover:bg-rose-50'
                        : 'bg-[#FAF8F5] border-[#ECE7DF] hover:bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-[#241E1C]">
                          {vig.dataFormatada}
                        </span>
                        {isNov26 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-[#7B1113] text-white">
                            Próxima (26/11)
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#70645E] block">
                        {vig.diaDaSemana}
                      </span>
                    </div>

                    <div className="text-right space-y-0.5">
                      <div className="text-[11px] font-bold text-[#7B1113]">
                        1°: {vig.horario1.rotulo}
                      </div>
                      <div className="text-[10px] text-[#554741]">
                        2°: {vig.horario2.rotulo}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* SEÇÃO 2: ESCALA DOS ENCONTROS DA CÉLULA (SEGUNDA E SEXTA)           */}
      {/* =================================================================== */}
      {activeSection === 'encontros' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          {!currentScale ? (
            <div className="p-6 text-center bg-white rounded-2xl border border-[#EDE8E0]">
              <p className="text-sm text-[#70645E]">Nenhuma escala de encontro cadastrada no momento.</p>
            </div>
          ) : (
            <>
              {/* Seletor de Escalas dos Encontros */}
              {scales.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
                  {scales.map((sc, idx) => {
                    const isSelected = selectedScaleIndex === idx;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setSelectedScaleIndex(idx)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-[#7B1113] text-white shadow-xs'
                            : 'bg-white/90 text-[#554741] border border-[#EDE8E0] hover:bg-white'
                        }`}
                      >
                        {sc.meetingDate}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Hero Header Card Encontros */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7B1113] via-[#5A0D12] to-[#3B070B] text-white shadow-md border border-[#E5C158]/50 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C158] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#E5C158]" />
                      <span>{currentScale.meetingDate}</span>
                    </span>
                    <h2 className="text-base font-bold font-cinzel leading-tight text-white">
                      {currentScale.theme}
                    </h2>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5C158] text-[#36070D] shrink-0">
                    Oficial
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-1.5 text-[#FFF0BE]/90">
                    <BookOpen className="w-3.5 h-3.5 text-[#E5C158] shrink-0" />
                    <span className="truncate">Formador: <strong>{currentScale.formador}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[#FFF0BE]/90">
                    <Sparkles className="w-3.5 h-3.5 text-[#E5C158] shrink-0" />
                    <span className="truncate">Animação: <strong>{currentScale.animator}</strong></span>
                  </div>
                </div>

                {currentScale.notes && (
                  <p className="text-[11px] text-[#FFF0BE]/80 italic pt-1 border-t border-white/10">
                    &ldquo;{currentScale.notes}&rdquo;
                  </p>
                )}
              </div>

              {/* Lista dos Ministérios / Serviços */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-bold text-[#36070D]">
                    Responsáveis pelos Serviços
                  </h3>
                  <span className="text-[10px] text-[#70645E]">Toque para confirmar presença</span>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {serviceRoles.map(role => {
                    const Icon = role.icon;
                    const isConfirmed = confirmedService[role.key];

                    return (
                      <div
                        key={role.key}
                        className={`p-3 rounded-2xl border transition-all shadow-2xs ${
                          isConfirmed 
                            ? 'bg-emerald-50/70 border-emerald-300' 
                            : 'bg-white border-[#EDE8E0] hover:border-[#D5CDC3]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div className={`p-2 rounded-xl shrink-0 border ${role.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <span className="text-[10px] font-bold text-[#70645E] block uppercase tracking-wide">
                                {role.label}
                              </span>
                              <p className="text-xs font-bold text-[#241E1C] truncate">
                                {role.person}
                              </p>
                              <p className="text-[10px] text-[#70645E] mt-0.5 line-clamp-1">
                                {role.tips}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleConfirmService(role.key)}
                            className={`p-1.5 rounded-xl border text-xs font-bold transition flex items-center gap-1 shrink-0 cursor-pointer ${
                              isConfirmed
                                ? 'bg-emerald-600 text-white border-emerald-600'
                                : 'bg-[#FAF8F5] text-[#70645E] border-[#EDE8E0] hover:bg-emerald-50 hover:text-emerald-800'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span className="text-[10px]">{isConfirmed ? 'Confirmado' : 'Confirmar'}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Roteiro e Minutagem */}
              {currentScale.roteiro && currentScale.roteiro.length > 0 && (
                <div className="p-4 rounded-2xl bg-white border border-[#EDE8E0] shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[#36070D] flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-[#7B1113]" />
                      <span>Roteiro Minuto a Minuto</span>
                    </h3>
                    <span className="text-[10px] text-[#70645E]">Duração: ~2h</span>
                  </div>

                  <div className="space-y-2 border-l-2 border-[#E5C158]/50 ml-2 pl-3">
                    {currentScale.roteiro.map((step, idx) => (
                      <div key={step.id || idx} className="space-y-0.5 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900">
                            {step.timeEstimate}
                          </span>
                          <span className="font-bold text-[#241E1C]">{step.title}</span>
                        </div>
                        <p className="text-[11px] text-[#70645E] leading-relaxed">
                          {step.description}
                        </p>
                        <p className="text-[10px] font-semibold text-[#7B1113]">
                          Condução: {step.leader}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Modal WhatsApp da Vigília */}
      {showVigiliaWhatsAppModal && (
        <Modal
          isOpen={showVigiliaWhatsAppModal}
          onClose={() => setShowVigiliaWhatsAppModal(false)}
          title="🕊️ Escala da Vigília no WhatsApp"
        >
          <div className="space-y-3 text-xs">
            <p className="text-[#70645E]">
              Mensagem formatada para envio nos grupos da Célula Santa Gemma:
            </p>

            <pre className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EDE8E0] text-[11px] text-[#241E1C] whitespace-pre-wrap font-sans leading-relaxed max-h-60 overflow-y-auto">
              {generateVigiliaWhatsAppText(currentVigilia)}
            </pre>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#EDE8E0]">
              <button
                type="button"
                onClick={handleCopyVigiliaText}
                className="w-full py-2.5 px-3 rounded-xl border border-[#D9D0C5] bg-white font-bold text-[#36070D] flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
              >
                {copiedVigilia ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#70645E]" />
                    <span>Copiar Texto</span>
                  </>
                )}
              </button>

              <a
                href={getVigiliaWhatsAppShareLink(currentVigilia)}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-[#25D366] text-white font-bold flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 hover:bg-[#20ba5a] text-center"
              >
                <Share2 className="w-4 h-4" />
                <span>Abrir WhatsApp</span>
              </a>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Nova Escala */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Cadastrar Nova Escala"
      >
        <form onSubmit={handleCreateScale} className="space-y-3 text-xs">
          <div>
            <label className="block font-bold text-[#36070D] mb-1">Data e Horário do Encontro:</label>
            <input
              type="text"
              placeholder="Ex: Segunda-feira • 19:00 às 21:00"
              value={newMeetingDate}
              onChange={e => setNewMeetingDate(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              required
            />
          </div>

          <div>
            <label className="block font-bold text-[#36070D] mb-1">Tema da Formação:</label>
            <input
              type="text"
              placeholder="Ex: Caminho da Paz - Módulo A Vida de Oração"
              value={newTheme}
              onChange={e => setNewTheme(e.target.value)}
              className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#36070D] mb-1">Formador(a):</label>
              <input
                type="text"
                placeholder="Quem ministrará o tema"
                value={newFormador}
                onChange={e => setNewFormador(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#36070D] mb-1">Animação / Condução:</label>
              <input
                type="text"
                placeholder="Quem conduzirá"
                value={newAnimator}
                onChange={e => setNewAnimator(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#36070D] mb-1">Música & Louvor:</label>
              <input
                type="text"
                placeholder="Irmãos escalados"
                value={newMusic}
                onChange={e => setNewMusic(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#36070D] mb-1">Acolhida & Porta:</label>
              <input
                type="text"
                placeholder="Quem recebe os irmãos"
                value={newWelcome}
                onChange={e => setNewWelcome(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-bold text-[#36070D] mb-1">Lanche / Ágape:</label>
              <input
                type="text"
                placeholder="Responsáveis pelo comes"
                value={newSnack}
                onChange={e => setNewSnack(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
              />
            </div>
            <div>
              <label className="block font-bold text-[#36070D] mb-1">Intercessão Prévia:</label>
              <input
                type="text"
                placeholder="Quem reza antes"
                value={newIntercession}
                onChange={e => setNewIntercession(e.target.value)}
                className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
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
              className="w-full p-2.5 bg-white rounded-xl border border-[#DDD5C7]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-[#DDD5C7]">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="w-full py-2.5 px-3 rounded-xl border border-[#DDD5C7] bg-white font-bold text-[#70645E] hover:bg-[#EAE4DB] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#7B1113] text-white font-bold hover:bg-[#580C14] cursor-pointer"
            >
              Salvar Escala
            </button>
          </div>
        </form>
      </Modal>

      {/* WhatsApp Modal Encontros */}
      {currentScale && (
        <WhatsAppSummaryModal
          isOpen={showWhatsAppModal}
          onClose={() => setShowWhatsAppModal(false)}
          scale={currentScale}
          summaryText={onGenerateWhatsApp(currentScale.id)}
          shareUrl={getWhatsAppShareUrl(currentScale.id)}
        />
      )}
    </div>
  );
};
