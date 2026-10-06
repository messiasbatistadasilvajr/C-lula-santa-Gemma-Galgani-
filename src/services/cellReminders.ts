/**
 * Serviço de Lembretes Locais Agendados & Notificações Push (PWA)
 * Garante que todos os membros da Célula Santa Gemma Galgani sejam avisados
 * sobre os encontros de Segunda-feira e Sexta-feira das 19:00 às 21:00.
 */

export interface CellReminderSettings {
  enabled: boolean;
  remindMinutesBefore: number; // ex: 30, 60 ou 120 minutos antes das 19:00
  remindAtExactStart: boolean; // alerta pontualmente às 19:00
  soundEnabled: boolean;
  lastTriggeredKey?: string;
}

export interface NextCellMeetingInfo {
  dayName: 'Segunda-feira' | 'Sexta-feira';
  isToday: boolean;
  isHappeningNow: boolean;
  targetDate: Date;
  formattedDate: string; // DD/MM/AAAA
  countdownText: string;
  minutesUntilStart: number;
}

const REMINDER_STORAGE_KEY = 'sg_cell_meeting_reminders_v1';

const DEFAULT_REMINDER_SETTINGS: CellReminderSettings = {
  enabled: true,
  remindMinutesBefore: 30,
  remindAtExactStart: true,
  soundEnabled: true,
};

export function loadReminderSettings(): CellReminderSettings {
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_REMINDER_SETTINGS, ...JSON.parse(raw) };
    }
  } catch {
    // ignore
  }
  return DEFAULT_REMINDER_SETTINGS;
}

export function saveReminderSettings(settings: CellReminderSettings): void {
  try {
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // ignore
  }
}

/**
 * Calcula a próxima reunião oficial da Célula Santa Gemma Galgani:
 * Toda Segunda-feira (day = 1) e Sexta-feira (day = 5) das 19:00 às 21:00.
 */
export function getNextCellMeeting(now: Date = new Date()): NextCellMeetingInfo {
  const currentDay = now.getDay(); // 0=Dom, 1=Seg, 2=Ter, 3=Qua, 4=Qui, 5=Sex, 6=Sab
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const totalMinutesNow = currentHour * 60 + currentMinute;

  const startMinutes = 19 * 60; // 19:00
  const endMinutes = 21 * 60; // 21:00

  // Verifica se hoje é Segunda (1) ou Sexta (5) e ainda não passou das 21:00
  if ((currentDay === 1 || currentDay === 5) && totalMinutesNow < endMinutes) {
    const isHappeningNow = totalMinutesNow >= startMinutes && totalMinutesNow < endMinutes;
    const target = new Date(now);
    target.setHours(19, 0, 0, 0);

    const diffMs = target.getTime() - now.getTime();
    const minutesUntilStart = Math.max(0, Math.ceil(diffMs / 60000));

    let countdownText = '';
    if (isHappeningNow) {
      countdownText = '🔴 Acontecendo agora! (19:00 às 21:00)';
    } else if (minutesUntilStart <= 60) {
      countdownText = `Começa hoje em ${minutesUntilStart} min (às 19:00)`;
    } else {
      const hours = Math.floor(minutesUntilStart / 60);
      const mins = minutesUntilStart % 60;
      countdownText = `Hoje às 19:00 (faltam ${hours}h${mins > 0 ? ` ${mins}min` : ''})`;
    }

    return {
      dayName: currentDay === 1 ? 'Segunda-feira' : 'Sexta-feira',
      isToday: true,
      isHappeningNow,
      targetDate: target,
      formattedDate: target.toLocaleDateString('pt-BR'),
      countdownText,
      minutesUntilStart,
    };
  }

  // Caso contrário, busca a próxima Segunda (1) ou Sexta (5)
  let daysToAdd = 1;
  while (daysToAdd <= 7) {
    const candidate = new Date(now);
    candidate.setDate(now.getDate() + daysToAdd);
    candidate.setHours(19, 0, 0, 0);
    const dayOfWeek = candidate.getDay();

    if (dayOfWeek === 1 || dayOfWeek === 5) {
      const diffMs = candidate.getTime() - now.getTime();
      const minutesUntilStart = Math.max(0, Math.ceil(diffMs / 60000));
      const dayLabel = dayOfWeek === 1 ? 'Segunda-feira' : 'Sexta-feira';

      const countdownText =
        daysToAdd === 1
          ? `Amanhã (${dayLabel}) às 19:00`
          : `Próxima ${dayLabel} (${candidate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}) às 19:00`;

      return {
        dayName: dayLabel,
        isToday: false,
        isHappeningNow: false,
        targetDate: candidate,
        formattedDate: candidate.toLocaleDateString('pt-BR'),
        countdownText,
        minutesUntilStart,
      };
    }
    daysToAdd++;
  }

  // Fallback seguro
  const fallback = new Date(now);
  fallback.setHours(19, 0, 0, 0);
  return {
    dayName: 'Segunda-feira',
    isToday: false,
    isHappeningNow: false,
    targetDate: fallback,
    formattedDate: fallback.toLocaleDateString('pt-BR'),
    countdownText: 'Segundas e Sextas às 19:00',
    minutesUntilStart: 1440,
  };
}

/**
 * Toca um sino litúrgico suave usando Web Audio API quando um lembrete é disparado
 */
export function playLiturgicalChime(): void {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playNote = (freq: number, startOffset: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + startOffset);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + startOffset + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + startOffset + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + startOffset);
      osc.stop(ctx.currentTime + startOffset + duration);
    };

    // Acorde suave Sol Maior / Lá (Dó5 - Mi5 - Sol5)
    playNote(523.25, 0, 0.45);
    playNote(659.25, 0.18, 0.5);
    playNote(783.99, 0.36, 0.75);
  } catch {
    // ignore audio restrictions
  }
}

/**
 * Solicita permissão de Notificação Push Nativa do navegador / PWA
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return Notification.permission;
  }
}

/**
 * Dispara uma Notificação Push Nativa via Service Worker (PWA) ou Notification API,
 * além de vibrar o celular e tocar o sino suave.
 */
export async function sendCellPushNotification(params: {
  title: string;
  body: string;
  playSound?: boolean;
}): Promise<boolean> {
  if (params.playSound !== false) {
    playLiturgicalChime();
  }

  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([200, 100, 200]);
    }
  } catch {
    // ignore
  }

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    return false;
  }

  try {
    if ('serviceWorker' in navigator) {
      const registration = await navigator.serviceWorker.getRegistration();
      if (registration && 'showNotification' in registration) {
        await registration.showNotification(params.title, {
          body: params.body,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: 'celula-santa-gemma-lembrete',
        });
        return true;
      }
    }

    new Notification(params.title, {
      body: params.body,
      icon: '/pwa-192x192.png',
    });
    return true;
  } catch {
    return false;
  }
}

/**
 * Gera um arquivo .ICS universal com regra recorrente semanal (RRULE: BYDAY=MO,FR)
 * para adicionar os encontros de Segunda e Sexta às 19:00 direto no despertador/agenda do celular
 */
export function downloadRecurringCellCalendarIcs(remindMinutesBefore: number = 30): void {
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Celula Santa Gemma Galgani//Comunidade Shalom//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:celula-santa-gemma-seg-sex-19h@shalom.org`,
    'SUMMARY:🌹 Célula Santa Gemma Galgani (Shalom)',
    'DESCRIPTION:Encontro Oficial da Célula Santa Gemma Galgani — Toda Segunda-feira e Sexta-feira das 19:00 às 21:00 (Louvor, Formação, Oração e Partilha Fraterna).',
    'LOCATION:Comunidade Católica Shalom / Célula Santa Gemma Galgani',
    'DTSTART:20261005T190000',
    'DTEND:20261005T210000',
    'RRULE:FREQ=WEEKLY;BYDAY=MO,FR',
    'BEGIN:VALARM',
    `TRIGGER:-PT${remindMinutesBefore}M`,
    'ACTION:DISPLAY',
    'DESCRIPTION:Lembrete: A Célula Santa Gemma Galgani começa às 19:00!',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:PT0M',
    'ACTION:DISPLAY',
    'DESCRIPTION:A Célula Santa Gemma Galgani está começando agora (19:00)!',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'lembretes-celula-santa-gemma-seg-sex-19h.ics');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
