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
  AlertTriangle,
  WifiOff,
  HardDrive,
  Trash2,
  Bell,
  BellRing,
  Volume2,
  Download,
  MessageCircle
} from 'lucide-react';
import { CalendarEvent, EventType, RSVPStatus, UserRole } from '../types';
import { Modal } from '../components/common/Modal';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import {
  CellReminderSettings,
  getNextCellMeeting,
  loadReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  sendCellPushNotification,
  downloadRecurringCellCalendarIcs,
} from '../services/cellReminders';

interface AgendaProps {
  events: CalendarEvent[];
  onSetRSVP: (eventId: string, status: RSVPStatus) => void;
  currentRole?: UserRole;
  onAddEvent?: (event: Omit<CalendarEvent, 'id' | 'attendingCount' | 'maybeCount' | 'declinedCount'>) => void;
  onDeleteEvent?: (eventId: string) => void;
  onNavigate?: (tab: string) => void;
}

export const Agenda: React.FC<AgendaProps> = ({ 
  events, 
  onSetRSVP,
  currentRole = 'membro',
  onAddEvent,
  onDeleteEvent,
  onNavigate
}) => {
  const isOnline = useOnlineStatus();
  const [selectedType, setSelectedType] = useState<string>('todos');
  const [selectedDayNum, setSelectedDayNum] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showRoleAlertModal, setShowRoleAlertModal] = useState(false);

  // Form states for new event
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('2026-10-09');
  const [newTime, setNewTime] = useState('19:00');
  const [newLocation, setNewLocation] = useState('Casa do Gabriel');
  const [newLeader, setNewLeader] = useState('Coordenação');
  const [newType, setNewType] = useState<EventType>('encontro');
  const [newDescription, setNewDescription] = useState('');

  // Estados do Agendador de Lembretes Locais e Notificações Push (Segundas e Sextas às 19:00)
  const [reminderSettings, setReminderSettings] = useState<CellReminderSettings>(() =>
    loadReminderSettings()
  );
  const [notifPermission, setNotifPermission] = useState<NotificationPermission | 'unsupported'>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });
  const [nextMeeting, setNextMeeting] = useState(() => getNextCellMeeting());

  React.useEffect(() => {
    const interval = setInterval(() => {
      setNextMeeting(getNextCellMeeting());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateReminderSetting = (patch: Partial<CellReminderSettings>) => {
    const updated = { ...reminderSettings, ...patch };
    setReminderSettings(updated);
    saveReminderSettings(updated);
  };

  const handleEnablePushNotifications = async () => {
    const perm = await requestNotificationPermission();
    setNotifPermission(perm);
    handleUpdateReminderSetting({ enabled: true });

    if (perm === 'granted') {
      await sendCellPushNotification({
        title: '🌹 Lembretes da Célula Ativados!',
        body: 'Você será avisado toda Segunda-feira e Sexta-feira sobre o encontro das 19:00 às 21:00.',
        playSound: reminderSettings.soundEnabled,
      });
      showToast('Notificações Push e lembretes agendados ativados!');
    } else {
      showToast('Lembretes locais com som ativados no aplicativo!');
    }
  };

  const handleTestReminderNow = async () => {
    const title = `🔔 Lembrete: Célula ${nextMeeting.dayName} às 19:00!`;
    const message = `Shalom! Não esqueça do nosso encontro da Célula Santa Gemma Galgani (${nextMeeting.dayName}, das 19:00 às 21:00). Esperamos por você!`;

    if (notifPermission !== 'granted') {
      const perm = await requestNotificationPermission();
      setNotifPermission(perm);
    }

    await sendCellPushNotification({
      title,
      body: message,
      playSound: reminderSettings.soundEnabled,
    });

    window.dispatchEvent(
      new CustomEvent('sg-trigger-reminder-banner', {
        detail: {
          title,
          message,
          dayName: nextMeeting.dayName,
        },
      })
    );
  };

  // Days for the visual mini-calendar header strip (Destaque Segunda e Sexta: dias de Célula 19h às 21h)
  const calendarDays = [
    { day: 'SEG', num: '05', isToday: false, hasEvent: true, dateStr: '2026-10-05' }, // Encontro de Segunda
    { day: 'TER', num: '06', isToday: true, hasEvent: false, dateStr: '2026-10-06' },
    { day: 'QUA', num: '07', isToday: false, hasEvent: false, dateStr: '2026-10-07' },
    { day: 'QUI', num: '08', isToday: false, hasEvent: false, dateStr: '2026-10-08' },
    { day: 'SEX', num: '09', isToday: false, hasEvent: true, dateStr: '2026-10-09' }, // Encontro de Sexta
    { day: 'SÁB', num: '10', isToday: false, hasEvent: true, dateStr: '2026-10-10' }, // Retiro / Missa
    { day: 'SEG', num: '12', isToday: false, hasEvent: true, dateStr: '2026-10-12' }, // Encontro de Segunda
    { day: 'SEX', num: '16', isToday: false, hasEvent: true, dateStr: '2026-10-16' }, // Encontro de Sexta
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
      attending: isOnline ? 'Presença confirmada! Que alegria contar com você.' : 'Presença confirmada e salva localmente (offline)!',
      maybe: isOnline ? 'Status alterado para "Talvez". Esperamos você!' : 'Status salvo localmente no aparelho (offline)!',
      declined: isOnline ? 'Ausência informada à coordenação.' : 'Ausência registrada no aparelho (offline)!',
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
      const formattedTime = newTime.includes('às') ? newTime : `${newTime} às 21:00`;
      onAddEvent({
        title: newTitle.trim(),
        date: newDate,
        time: formattedTime,
        location: newLocation.trim() || 'Comunidade Shalom',
        leader: newLeader.trim() || 'Coordenação',
        type: newType,
        description: newDescription.trim() || 'Encontro fraterno com louvor e oração.',
        rsvpStatus: null,
      });
      showToast(isOnline ? 'Novo evento agendado com sucesso!' : 'Novo evento salvo no aparelho e pronto offline!');
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

      {/* Indicador Amigável de Acesso Sem Internet */}
      <div className={`p-3 rounded-2xl border transition-all flex items-center justify-between text-xs shadow-2xs ${
        !isOnline 
          ? 'bg-amber-50/90 border-amber-300 text-amber-950' 
          : 'bg-white/85 border-[#ECE7DF] text-[#70645E]'
      }`}>
        <div className="flex items-center gap-2.5">
          {!isOnline ? (
            <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-900 flex items-center justify-center shrink-0">
              <WifiOff className="w-4 h-4 text-amber-800 animate-pulse" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-1.5 font-bold text-[#241E1C]">
              <span>{!isOnline ? 'Funcionando sem Internet' : 'Agenda Salva no seu Celular'}</span>
            </div>
            <p className="text-[11px] leading-tight mt-0.5">
              {!isOnline 
                ? 'Você está sem internet, mas todos os dias e horários da célula continuam disponíveis aqui.'
                : 'Mesmo se você ficar sem internet depois, os dias e horários da célula continuarão abertos no seu celular.'
              }
            </p>
          </div>
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

      {/* Banner Oficial dos Dias e Horários Fixos da Célula + Sistema de Lembretes Push e Locais */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#7B1113] via-[#5A0D12] to-[#3B070B] text-white shadow-md border border-[#E5C158]/50 space-y-3.5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5C158] flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Lembretes Automáticos • Segundas & Sextas</span>
            </span>
            <h3 className="text-sm font-bold text-white">
              Toda Segunda-feira e Sexta-feira às 19:00
            </h3>
            <p className="text-xs text-[#FFF0BE]/95 flex items-center gap-1.5 pt-0.5">
              <Clock className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>
                Próximo encontro: <strong>{nextMeeting.countdownText}</strong>
              </span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const nextState = !reminderSettings.enabled;
              handleUpdateReminderSetting({ enabled: nextState });
              showToast(
                nextState
                  ? 'Lembretes de Segunda e Sexta às 19:00 ativados!'
                  : 'Lembretes automáticos pausados.'
              );
            }}
            className={`px-2.5 py-1.5 rounded-xl text-[11px] font-extrabold border transition cursor-pointer shrink-0 flex items-center gap-1 ${
              reminderSettings.enabled
                ? 'bg-emerald-500 text-white border-emerald-300 shadow-xs'
                : 'bg-white/10 text-[#FFF0BE] border-white/25'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>{reminderSettings.enabled ? 'Ativo ✓' : 'Ativar'}</span>
          </button>
        </div>

        {/* Seleção de antecedência do aviso antes das 19:00 */}
        <div className="bg-black/25 p-3 rounded-xl border border-white/15 space-y-2.5">
          <div className="flex items-center justify-between text-[11px]">
            <span className="font-bold text-[#FFF0BE]">
              ⏰ Avisar antes das 19:00 (Seg e Sex):
            </span>
            <button
              type="button"
              onClick={() => handleUpdateReminderSetting({ soundEnabled: !reminderSettings.soundEnabled })}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer border ${
                reminderSettings.soundEnabled
                  ? 'bg-[#E5C158]/25 text-[#FFF0BE] border-[#E5C158]/50'
                  : 'bg-white/5 text-white/60 border-white/15'
              }`}
            >
              <Volume2 className="w-3 h-3" />
              <span>{reminderSettings.soundEnabled ? 'Som Ligado' : 'Sem Som'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {[
              { mins: 15, label: '15 min antes (18:45)' },
              { mins: 30, label: '30 min antes (18:30)' },
              { mins: 60, label: '1 hora antes (18:00)' },
            ].map(opt => {
              const isSelected = reminderSettings.remindMinutesBefore === opt.mins;
              return (
                <button
                  key={opt.mins}
                  type="button"
                  onClick={() => {
                    handleUpdateReminderSetting({ remindMinutesBefore: opt.mins, enabled: true });
                    showToast(`Aviso agendado para ${opt.label} nas Segundas e Sextas!`);
                  }}
                  className={`py-1.5 px-2 rounded-lg text-[10px] font-bold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-[#E5C158] text-[#36070D] border-[#E5C158] shadow-2xs'
                      : 'bg-white/10 text-[#FFF0BE] border-white/15 hover:bg-white/20'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Botões de Ação: Ativar Push no Celular, Testar Alerta, Salvar no Despertador/Agenda e Avisar no WhatsApp */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {notifPermission !== 'granted' ? (
            <button
              type="button"
              onClick={handleEnablePushNotifications}
              className="py-2 px-3 rounded-xl bg-[#E5C158] hover:bg-[#f3cf65] text-[#36070D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
            >
              <BellRing className="w-4 h-4" />
              <span>Permitir Notificações Push</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleTestReminderNow}
              className="py-2 px-3 rounded-xl bg-[#E5C158] hover:bg-[#f3cf65] text-[#36070D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer active:scale-95"
            >
              <BellRing className="w-4 h-4" />
              <span>Testar Alerta de 19:00 Agora</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              downloadRecurringCellCalendarIcs(reminderSettings.remindMinutesBefore);
              showToast('Alarme de Segunda e Sexta (19h) baixado para a agenda do celular!');
            }}
            className="py-2 px-3 rounded-xl bg-white/15 hover:bg-white/25 text-white border border-white/25 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4 text-[#E5C158]" />
            <span>Salvar no Despertador/Agenda</span>
          </button>
        </div>

        <div className="pt-1 flex items-center justify-between gap-2 border-t border-white/15">
          <button
            type="button"
            onClick={handleTestReminderNow}
            className="text-[11px] font-bold text-[#FFF0BE] underline underline-offset-2 hover:text-white cursor-pointer"
          >
            🔔 Ouvir e testar lembrete na tela
          </button>

          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
              `🌹 *Lembrete Oficial • Célula Santa Gemma Galgani* ✝️\n\n` +
                `Shalom, irmãos! Lembramos que nosso encontro de célula acontece *toda Segunda-feira e Sexta-feira, das 19:00 às 21:00*.\n\n` +
                `📅 *Próximo encontro:* ${nextMeeting.dayName} (${nextMeeting.formattedDate}) às *19:00*\n` +
                `📍 Confirme sua presença e ative o lembrete na Agenda do nosso App!`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-2.5 py-1 rounded-lg bg-[#075E54] hover:bg-[#064E46] text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs transition cursor-pointer"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Lembrar Grupo no WhatsApp</span>
          </a>
        </div>
      </div>

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
                      type="button"
                      onClick={() => handleShareEvent(event)}
                      title="Copiar dados do evento"
                      className="p-1 text-[#8A7C75] hover:text-[#7B1113] transition cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    {(currentRole === 'admin' || currentRole === 'formador') && onDeleteEvent && (
                      <button
                        type="button"
                        onClick={() => {
                          onDeleteEvent(event.id);
                          showToast('Evento removido da agenda.');
                        }}
                        title="Excluir evento"
                        aria-label="Excluir evento"
                        className="p-1 text-[#8A7C75] hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
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
