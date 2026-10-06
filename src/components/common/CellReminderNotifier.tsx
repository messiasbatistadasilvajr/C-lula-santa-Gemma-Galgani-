import React, { useEffect, useState } from 'react';
import { Bell, Calendar, Clock, X, Radio, Volume2 } from 'lucide-react';
import {
  getNextCellMeeting,
  loadReminderSettings,
  saveReminderSettings,
  sendCellPushNotification,
} from '../../services/cellReminders';
import { SpeakButton } from './SpeakButton';

interface CellReminderNotifierProps {
  onNavigateToAgenda?: () => void;
  onNavigateToLiveMeeting?: () => void;
}

export const CellReminderNotifier: React.FC<CellReminderNotifierProps> = ({
  onNavigateToAgenda,
  onNavigateToLiveMeeting,
}) => {
  const [activeAlert, setActiveAlert] = useState<{
    title: string;
    message: string;
    dayName: string;
  } | null>(null);

  useEffect(() => {
    const checkSchedule = () => {
      const settings = loadReminderSettings();
      if (!settings.enabled) return;

      const now = new Date();
      const dayOfWeek = now.getDay(); // 1 = Segunda, 5 = Sexta
      if (dayOfWeek !== 1 && dayOfWeek !== 5) return;

      const nextInfo = getNextCellMeeting(now);
      if (!nextInfo.isToday) return;

      const todayKeyBase = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
      const minsLeft = nextInfo.minutesUntilStart;

      // 1. Verifica lembrete antecipado (ex: 30 min antes das 19:00)
      if (
        minsLeft > 0 &&
        minsLeft <= settings.remindMinutesBefore &&
        settings.lastTriggeredKey !== `${todayKeyBase}_before` &&
        settings.lastTriggeredKey !== `${todayKeyBase}_start`
      ) {
        const title = `🔔 Lembrete: Célula hoje às 19:00!`;
        const message = `Shalom! Nosso encontro de ${nextInfo.dayName} da Célula Santa Gemma Galgani começa em ${minsLeft} minutos (das 19:00 às 21:00).`;

        saveReminderSettings({
          ...settings,
          lastTriggeredKey: `${todayKeyBase}_before`,
        });

        sendCellPushNotification({
          title,
          body: message,
          playSound: settings.soundEnabled,
        });

        setActiveAlert({
          title,
          message,
          dayName: nextInfo.dayName,
        });
      }

      // 2. Verifica alerta de início exato às 19:00
      if (
        settings.remindAtExactStart &&
        nextInfo.isHappeningNow &&
        settings.lastTriggeredKey !== `${todayKeyBase}_start`
      ) {
        const title = `🌹 A Célula Santa Gemma começou! (19:00)`;
        const message = `Paz e Bem! Já são 19:00 de ${nextInfo.dayName}. Nosso encontro de oração, louvor e partilha está começando!`;

        saveReminderSettings({
          ...settings,
          lastTriggeredKey: `${todayKeyBase}_start`,
        });

        sendCellPushNotification({
          title,
          body: message,
          playSound: settings.soundEnabled,
        });

        setActiveAlert({
          title,
          message,
          dayName: nextInfo.dayName,
        });
      }
    };

    // Verifica imediatamente ao abrir o app e depois a cada 30 segundos
    checkSchedule();
    const timer = setInterval(checkSchedule, 30000);

    // Ouve evento de disparo de teste manual vindo da página Agenda
    const handleCustomTest = (event: Event) => {
      const customEv = event as CustomEvent<{ title: string; message: string; dayName: string }>;
      if (customEv.detail) {
        setActiveAlert(customEv.detail);
      }
    };

    window.addEventListener('sg-trigger-reminder-banner', handleCustomTest);
    return () => {
      clearInterval(timer);
      window.removeEventListener('sg-trigger-reminder-banner', handleCustomTest);
    };
  }, []);

  if (!activeAlert) return null;

  return (
    <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-md animate-in slide-in-from-top-5 duration-200">
      <div className="rounded-2xl bg-gradient-to-br from-[#36070D] via-[#580C14] to-[#2B0509] text-white p-4 shadow-2xl border-2 border-[#E5C158] space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E5C158] text-[#36070D] flex items-center justify-center shrink-0 shadow-sm animate-bounce">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#E5C158] block">
                Notificação da Célula • Seg & Sex 19:00
              </span>
              <h4 className="text-sm font-bold text-white leading-snug">
                {activeAlert.title}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveAlert(null)}
            aria-label="Fechar lembrete"
            className="p-1.5 rounded-full text-[#FFF0BE] hover:bg-white/15 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#FFF0BE]/95 leading-relaxed bg-black/25 p-3 rounded-xl border border-white/10">
          {activeAlert.message}
        </p>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <SpeakButton
            id="reminder-alert-speak"
            text={`${activeAlert.title}. ${activeAlert.message}`}
            label="Ouvir Aviso"
            className="bg-white/15 text-[#FFF0BE] border-white/25 hover:bg-white/25"
          />

          <div className="flex items-center gap-1.5">
            {onNavigateToAgenda && (
              <button
                type="button"
                onClick={() => {
                  setActiveAlert(null);
                  onNavigateToAgenda();
                }}
                className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold flex items-center gap-1 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[#E5C158]" />
                <span>Ver Agenda</span>
              </button>
            )}

            {onNavigateToLiveMeeting && (
              <button
                type="button"
                onClick={() => {
                  setActiveAlert(null);
                  onNavigateToLiveMeeting();
                }}
                className="px-3 py-1.5 rounded-xl bg-[#E5C158] hover:bg-[#f3cf65] text-[#36070D] text-xs font-extrabold flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Radio className="w-3.5 h-3.5" />
                <span>Abrir Encontro</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
