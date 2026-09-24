import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  User, 
  Users, 
  Check, 
  HelpCircle, 
  XCircle, 
  CalendarCheck2,
  Layers,
  Share2,
  CheckCircle2,
  PlusCircle,
  AlertTriangle
} from 'lucide-react';
import { CalendarEvent, EventType, RSVPStatus, UserRole } from '../types';
import { Modal } from '../components/common/Modal';

interface AgendaProps {
  events: CalendarEvent[];
  onSetRSVP: (eventId: string, status: RSVPStatus) => void;
  currentRole?: UserRole;
  onAddEvent?: (event: Omit<CalendarEvent, 'id' | 'attendingCount' | 'maybeCount' | 'declinedCount'>) => void;
  onNavigate?: (tab: string) => void;
}

export const Agenda: React.FC<AgendaProps> = ({ 
  events, 
  onSetRSVP,
  currentRole = 'membro',
  onAddEvent,
  onNavigate
}) => {
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedDayNum, setSelectedDayNum] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showRoleAlertModal, setShowRoleAlertModal] = useState(false);

  // Form states for new event
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-09-30');
  const [newTime, setNewTime] = useState('20:00');
  const [newLocation, setNewLocation] = useState('Casa do Gabriel');
  const [newLeader, setNewLeader] = useState('Coordenação');
  const [newType, setNewType] = useState<EventType>('encontro');
  const [newDescription, setNewDescription] = useState('');

  // Days for the visual mini-calendar header strip
  const calendarDays = [
    { day: 'QUA', num: '23', isToday: false, dateStr: '2026-09-23' },
    { day: 'QUI', num: '24', isToday: true, hasEvent: true, dateStr: '2026-09-24' }, // Encontro da Célula
    { day: 'SEX', num: '25', isToday: false, dateStr: '2026-09-25' },
    { day: 'SÁB', num: '26', isToday: false, hasEvent: true, dateStr: '2026-09-26' }, // Missa Shalom
    { day: 'DOM', num: '27', isToday: false, dateStr: '2026-09-27' },
    { day: 'SEG', num: '28', isToday: false, dateStr: '2026-09-28' },
    { day: 'TER', num: '29', isToday: false, hasEvent: true, dateStr: '2026-09-29' }, // Formação
  ];

  const typeConfig: Record<EventType, { label: string; badge: string }> = {
    encontro: { label: 'Encontro de Célula', badge: 'bg-[#7B1113]/10 text-[#7B1113] border-[#7B1113]/30' },
    missa: { label: 'Santa Missa', badge: 'bg-amber-100 text-amber-900 border-amber-300' },
    formacao: { label: 'Noite de Formação', badge: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
    retiro: { label: 'Retiro Comunitário', badge: 'bg-purple-100 text-purple-900 border-purple-300' },
    evento: { label: 'Vigília / Evento', badge: 'bg-blue-100 text-blue-900 border-blue-300' },
    escala: { label: 'Escala de Serviço', badge: 'bg-orange-100 text-orange-900 border-orange-300' },
  };

  const filteredEvents = events.filter(e => {
    const matchesType = selectedType === 'todos' || e.type === selectedType;
    const matchesDay = !selectedDayNum || e.date.endsWith(`-${selectedDayNum}`);
    return matchesType && matchesDay;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShareEvent = (event: CalendarEvent) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `✝ ${event.title}\n📅 Data: ${event.date} às ${event.time}\n📍 Local: ${event.location}\nResponsável: ${event.leader}\n${event.description}`
      );
      showToast('Detalhes do evento copiados para compartilhar!');
    }
  };

  const handleRSVPClick = (eventId: string, status: RSVPStatus) => {
    onSetRSVP(eventId, status);
    const msgs: Record<RSVPStatus, string> = {
      attending: 'Presença confirmada! Que alegria contar com você.',
      maybe: 'Status alterado para "Talvez". Esperamos você!',
      declined: 'Ausência informada à coordenação.',
    };
    showToast(msgs[status]);
  };

  const handleOpenAddEvent = () => {
    if (currentRole === 'membro') {
      setShowRoleAlertModal(true);
    } else {
      setIsAddModalOpen(true);
    }
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    if (onAddEvent) {
      onAddEvent({
        title: newTitle.trim(),
        date: newDate,
        time: newTime,
        location: newLocation.trim() || 'Comunidade Shalom',
        leader: newLeader.trim() || 'Coordenação',
        type: newType,
        description: newDescription.trim() || 'Encontro fraterno com louvor e oração.',
        rsvpStatus: null,
      });
      showToast('Novo evento agendado com sucesso!');
    }

    setNewTitle('');
    setNewDescription('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#241E1C] font-cinzel">
            Agenda & Escalas
          </h2>
          <p className="text-xs text-[#70645E]">Compromissos fraternos e litúrgicos</p>
        </div>
        <div className="flex items-center gap-1.5">
          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('escalas')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-50 text-[#7B1113] border border-amber-200 text-xs font-bold shadow-2xs hover:bg-amber-100 active:scale-95 transition cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Escalas</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleOpenAddEvent}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Escala Quick Banner */}
      {onNavigate && (
        <div 
          onClick={() => onNavigate('escalas')}
          className="p-3 bg-linear-to-r from-amber-500/10 via-rose-500/10 to-amber-500/10 rounded-2xl border border-amber-300/60 shadow-2xs flex items-center justify-between cursor-pointer active:scale-[0.99] transition hover:border-amber-400"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#7B1113] text-[#E5C158] flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#36070D]">
                Escala de Serviços & Roteiro
              </h3>
              <p className="text-[10px] text-[#70645E]">
                Música, acolhida, lanche, oração e minutagem
              </p>
            </div>
          </div>
          <span className="text-[11px] font-bold text-[#7B1113] flex items-center gap-0.5">
            Ver &rarr;
          </span>
        </div>
      )}

      {/* Interactive Visual Mini-Calendar Mobile Strip */}
      <div className="rounded-2xl bg-white/90 backdrop-blur-md p-3 shadow-sm border border-white/60">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar">
          {calendarDays.map((d, i) => {
            const isSelected = selectedDayNum === d.num;
            return (
              <button
                key={i}
                onClick={() => setSelectedDayNum(isSelected ? null : d.num)}
                title={`Filtrar dia ${d.num}`}
                className={`flex-1 min-w-[42px] py-2 px-1 rounded-xl text-center flex flex-col items-center justify-center transition cursor-pointer ${
                  isSelected
                    ? 'bg-[#7B1113] text-white shadow-md font-bold scale-105'
                    : d.isToday
                    ? 'bg-[#E5C158]/25 text-[#36070D] font-bold border border-[#E5C158]'
                    : 'bg-[#FBF9F5] text-[#554741] hover:bg-[#F2ECE3]'
                }`}
              >
                <span className={`text-[9px] uppercase tracking-wider ${isSelected ? 'text-[#FFF0BE]' : 'text-[#8A7C75]'}`}>
                  {d.day}
                </span>
                <span className="text-sm font-bold mt-0.5">
                  {d.num}
                </span>
                {d.hasEvent && (
                  <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-[#E5C158]' : 'bg-[#7B1113]'}`} />
                )}
              </button>
            );
          })}
        </div>

        {selectedDayNum && (
          <div className="mt-2 pt-2 border-t border-[#ECE7DF] flex items-center justify-between text-xs text-[#7B1113]">
            <span>Filtrando dia <strong>{selectedDayNum}</strong></span>
            <button
              onClick={() => setSelectedDayNum(null)}
              className="text-[11px] font-semibold underline cursor-pointer"
            >
              Ver todos os dias
            </button>
          </div>
        )}
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'todos', label: 'Todos os Eventos' },
          { id: 'encontro', label: 'Encontros' },
          { id: 'missa', label: 'Missas' },
          { id: 'formacao', label: 'Formações' },
          { id: 'retiro', label: 'Retiros' },
          { id: 'evento', label: 'Vigílias' },
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setSelectedType(filter.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              selectedType === filter.id
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'bg-white/90 text-[#70645E] hover:bg-white border border-[#ECE7DF]'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-3.5">
        {filteredEvents.length === 0 ? (
          <div className="rounded-2xl bg-white/85 backdrop-blur-sm p-6 text-center text-xs text-[#8A7C75] border border-white/60">
            Nenhum evento agendado para o filtro selecionado.
          </div>
        ) : (
          filteredEvents.map(event => {
            const type = typeConfig[event.type] || typeConfig.encontro;
            return (
              <article 
                key={event.id}
                className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/70 space-y-3 relative overflow-hidden"
              >
                {/* Type and date badge */}
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${type.badge}`}>
                    {type.label}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShareEvent(event)}
                      title="Copiar dados do evento"
                      className="p-1 text-[#8A7C75] hover:text-[#7B1113] transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] bg-[#FBF9F5] px-2.5 py-0.5 rounded-full border border-[#ECE7DF]">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>

                {/* Event title & info */}
                <div>
                  <h3 className="text-sm font-bold text-[#241E1C]">
                    {event.title}
                  </h3>
                  <div className="mt-2 space-y-1 text-xs text-[#554741]">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#8A7C75] shrink-0" />
                      <span>
                        {new Date(event.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-[#8A7C75] shrink-0" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-[#8A7C75] shrink-0" />
                      <span>Responsável: <strong>{event.leader}</strong></span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-[#554741] leading-relaxed bg-[#FBF9F5] p-2.5 rounded-xl border border-[#EDE8E0]">
                  {event.description}
                </p>

                {/* Escala de Serviços se houver */}
                {event.scaleRoles && event.scaleRoles.length > 0 && (
                  <div className="bg-[#FFFDF9] p-3 rounded-xl border border-[#E8DFC8] space-y-2">
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#36070D]">
                      <Layers className="w-3.5 h-3.5 text-[#7B1113]" />
                      <span>Escala de Serviço da Célula</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {event.scaleRoles.map((scale, sIdx) => (
                        <div 
                          key={sIdx}
                          className="flex items-center justify-between text-xs bg-white px-2.5 py-1.5 rounded-lg border border-[#EDE8E0]"
                        >
                          <span className="text-[#70645E] text-[11px]">{scale.role}:</span>
                          <span className="font-bold text-[#241E1C] text-[11px]">{scale.personName}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attendance counters */}
                <div className="flex items-center justify-between text-[11px] text-[#70645E] pt-1">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span><strong>{event.attendingCount}</strong> confirmados</span>
                    {event.maybeCount > 0 && <span>• {event.maybeCount} talvez</span>}
                  </span>
                  {event.rsvpStatus && (
                    <span className="font-bold text-[#7B1113]">
                      Seu status: {event.rsvpStatus === 'attending' ? 'Confirmado' : event.rsvpStatus === 'maybe' ? 'Talvez' : 'Não vou'}
                    </span>
                  )}
                </div>

                {/* RSVP Interactive Buttons */}
                <div className="pt-2 border-t border-[#ECE7DF]">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8A7C75] mb-2">
                    Confirmar sua presença:
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleRSVPClick(event.id, 'attending')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                        event.rsvpStatus === 'attending'
                          ? 'bg-[#276F50] text-white shadow-xs'
                          : 'bg-[#F4EFEB] text-[#276F50] hover:bg-emerald-50 border border-emerald-200'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Vou</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRSVPClick(event.id, 'maybe')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                        event.rsvpStatus === 'maybe'
                          ? 'bg-[#B8860B] text-white shadow-xs'
                          : 'bg-[#F4EFEB] text-[#855B04] hover:bg-amber-50 border border-amber-200'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Talvez</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRSVPClick(event.id, 'declined')}
                      className={`py-2 px-1 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95 ${
                        event.rsvpStatus === 'declined'
                          ? 'bg-[#8E2828] text-white shadow-xs'
                          : 'bg-[#F4EFEB] text-[#7A2121] hover:bg-rose-50 border border-rose-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Não vou</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal: Agendar Novo Evento (Para Formadores e Admin) */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Agendar Novo Evento"
        subtitle="Adicione um compromisso oficial na agenda da célula"
      >
        <form onSubmit={handleCreateEvent} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Título do Evento *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Noite de Louvor & Adoração"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Data *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={e => setNewDate(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Horário *
              </label>
              <input
                type="time"
                required
                value={newTime}
                onChange={e => setNewTime(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Tipo
              </label>
              <select
                value={newType}
                onChange={e => setNewType(e.target.value as EventType)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              >
                <option value="encontro">Encontro de Célula</option>
                <option value="formacao">Noite de Formação</option>
                <option value="missa">Santa Missa</option>
                <option value="retiro">Retiro Comunitário</option>
                <option value="evento">Vigília / Outro</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Responsável
              </label>
              <input
                type="text"
                value={newLeader}
                onChange={e => setNewLeader(e.target.value)}
                placeholder="Ex: Coordenação"
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Local
            </label>
            <input
              type="text"
              value={newLocation}
              onChange={e => setNewLocation(e.target.value)}
              placeholder="Ex: Casa do Gabriel ou Shalom da Paz"
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Descrição / Orientações
            </label>
            <textarea
              rows={2}
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              placeholder="Louvor comunitário, lanche e partilha..."
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#70645E] hover:bg-[#EFEAE2] active:scale-95 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
            >
              Agendar Evento
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Permissão Negada (Para Membros) */}
      <Modal
        isOpen={showRoleAlertModal}
        onClose={() => setShowRoleAlertModal(false)}
        title="Acesso Restrito"
        subtitle="Agendamento de Eventos"
      >
        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 flex items-start gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold">Permissão Exclusiva da Liderança</p>
              <p className="leading-relaxed text-[11px]">
                O agendamento de eventos e definição de escalas é de responsabilidade da <strong>Coordenação</strong> ou <strong>Formação</strong> da Célula.
              </p>
            </div>
          </div>

          <p className="text-[11px] text-[#70645E]">
            Como membro, você pode confirmar sua presença nos encontros. Para testar o cadastro como líder, use o <strong>Simulador de Permissões</strong>.
          </p>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowRoleAlertModal(false)}
              className="px-3 py-1.5 rounded-xl border border-[#DDD5C7] text-[#70645E] hover:bg-[#EFEAE2] active:scale-95 transition cursor-pointer"
            >
              Entendido
            </button>
            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  setShowRoleAlertModal(false);
                  onNavigate('permissoes');
                }}
                className="px-3 py-1.5 rounded-xl bg-[#7B1113] text-white font-bold hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
              >
                Abrir Simulador
              </button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};
