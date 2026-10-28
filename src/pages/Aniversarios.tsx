import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Cake,
  Calendar,
  Check,
  Copy,
  Gift,
  Heart,
  MessageCircle,
  BellRing,
  Search,
  Send,
  Sparkles,
  UserCheck,
  PartyPopper,
  Share2,
} from 'lucide-react';
import { CommunityPost, DonorProfile, UserRole } from '../types';
import { Modal } from '../components/common/Modal';
import {
  requestNotificationPermission,
  sendCellPushNotification,
} from '../services/cellReminders';

interface AniversariosProps {
  donors: DonorProfile[];
  currentUser: {
    name: string;
    role: UserRole;
    avatarUrl: string;
  };
  onAddPost: (
    post: Omit<
      CommunityPost,
      'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'commentsCount' | 'comments'
    >
  ) => void;
  onBack: () => void;
}

interface ParsedBirthdayMember {
  donor: DonorProfile;
  day: number;
  month: number;
  year: number;
  ageTurning: number;
  daysUntil: number;
  isToday: boolean;
  isThisMonth: boolean;
  nextBirthdayDateStr: string;
}

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

export interface BirthdayMessageTemplate {
  id: string;
  title: string;
  subtitle: string;
  buildMessage: (memberName: string, birthDate: string) => string;
}

export const BIRTHDAY_TEMPLATES: BirthdayMessageTemplate[] = [
  {
    id: 'shalom_fraterno',
    title: 'Bênção Shalom & Dom da Vida',
    subtitle: 'Mensagem calorosa da família da Célula Santa Gemma',
    buildMessage: (memberName) =>
      `🎉 *SHALOM! FELIZ E SANTO ANIVERSÁRIO, ${memberName.toUpperCase()}!* 🎂🌹\n\n` +
      `Hoje toda a nossa *Célula Santa Gemma Galgani* louva e bendiz a Deus pelo dom precioso da sua vida e vocação!\n\n` +
      `_"O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti e te conceda a Paz!"_ (Nm 6, 24-26)\n\n` +
      `Que o Ressuscitado que passou pela Cruz derrame graças abundantes sobre você e sua família neste novo ciclo. Conte sempre com nossas orações!\n\n` +
      `Com carinho e comunhão,\n` +
      `*Família Célula Santa Gemma Galgani • Shalom* ✝️🤍`,
  },
  {
    id: 'santa_gemma',
    title: 'Intercessão de Santa Gemma & Anjo da Guarda',
    subtitle: 'Inspirada na espiritualidade da nossa padroeira',
    buildMessage: (memberName) =>
      `🌹 *PARABÉNS PELO SEU DIA, ${memberName.toUpperCase()}!* 🎂✨\n\n` +
      `Neste dia em que celebramos o dom da sua vida, pedimos a doce intercessão de *Santa Gemma Galgani* e do seu Santo Anjo da Guarda sobre cada passo da sua caminhada!\n\n` +
      `_"Jesus, faz que eu Te ame cada dia mais!"_ — Que essa chama de amor a Deus ilumine seu novo ano de vida com muita saúde, alegria, paz e fidelidade.\n\n` +
      `Um abraço fraterno de todos os seus irmãos da *Célula Santa Gemma Galgani*! 🙏🎉`,
  },
  {
    id: 'intercessao_acao_gracas',
    title: 'Oração de Ação de Graças no Encontro',
    subtitle: 'Convite especial para celebrarmos juntos na célula',
    buildMessage: (memberName) =>
      `🎂 *FELIZ ANIVERSÁRIO, QUERIDO(A) IRMÃO(Ã) ${memberName.toUpperCase()}!* 🙌🕊️\n\n` +
      `Louvado seja Nosso Senhor Jesus Cristo por mais um ano da sua vida entre nós!\n` +
      `Sua presença em nossa *Célula Santa Gemma Galgani* é um verdadeiro presente de Deus para toda a comunidade.\n\n` +
      `Hoje colocamos sua vida e seus projetos no altar da nossa intercessão! Esperamos você no nosso próximo encontro (segunda e sexta às 19h) para rezarmos por você e cantarmos os parabéns em comunhão fraterna!\n\n` +
      `Shalom e muitas felicidades! 🌹🥳`,
  },
  {
    id: 'coordenacao_oficial',
    title: 'Homenagem da Coordenação & Formação',
    subtitle: 'Mensagem em nome de Cristiane e Francisco José',
    buildMessage: (memberName) =>
      `👑 *HOMENAGEM DE ANIVERSÁRIO • CÉLULA SANTA GEMMA GALGANI* 🎂🌹\n\n` +
      `Querido(a) *${memberName}*,\n\n` +
      `Em nome da Coordenação, Formação e de todos os irmãos da nossa célula, desejamos a você um *Feliz e Abençoado Aniversário*!\n\n` +
      `Agradecemos a Deus pelo seu "Sim", pela sua amizade e caminhada conosco no Caminho da Paz. Que Maria Santíssima e Santa Gemma cubram sua vida de bênçãos hoje e sempre!\n\n` +
      `Fraternalmente,\n` +
      `*Cristiane Alves, Francisco José & Célula Santa Gemma Galgani* ✝️🙏`,
  },
];

export function parseDonorBirthday(donor: DonorProfile, refDate: Date = new Date()): ParsedBirthdayMember {
  const parts = (donor.birthDate || '01/01/1990').split('/');
  const day = parseInt(parts[0], 10) || 1;
  const month = parseInt(parts[1], 10) || 1;
  const year = parseInt(parts[2], 10) || 1990;

  const currentYear = refDate.getFullYear();
  const todayMidnight = new Date(currentYear, refDate.getMonth(), refDate.getDate());

  let nextBday = new Date(currentYear, month - 1, day);
  if (nextBday < todayMidnight) {
    nextBday = new Date(currentYear + 1, month - 1, day);
  }

  const diffTime = nextBday.getTime() - todayMidnight.getTime();
  const daysUntil = Math.round(diffTime / (1000 * 60 * 60 * 24));
  const isToday = day === refDate.getDate() && month === refDate.getMonth() + 1;
  const isThisMonth = month === refDate.getMonth() + 1;
  const ageTurning = nextBday.getFullYear() - year;

  const nextBirthdayDateStr = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;

  return {
    donor,
    day,
    month,
    year,
    ageTurning,
    daysUntil,
    isToday,
    isThisMonth,
    nextBirthdayDateStr,
  };
}

export const Aniversarios: React.FC<AniversariosProps> = ({
  donors,
  currentUser,
  onAddPost,
  onBack,
}) => {
  const now = new Date();
  const currentMonthNumber = now.getMonth() + 1;

  const [filterMode, setFilterMode] = useState<'proximos' | 'mes-atual' | 'todos'>('proximos');
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonthNumber);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Estado do Modal Gerador de Mensagens para o Aniversariante do Dia / Escolhido
  const [activeBirthdayMember, setActiveBirthdayMember] = useState<ParsedBirthdayMember | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(BIRTHDAY_TEMPLATES[0].id);
  const [customMessageText, setCustomMessageText] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const parsedMembers = useMemo(() => {
    return donors
      .map(d => parseDonorBirthday(d, now))
      .sort((a, b) => a.daysUntil - b.daysUntil);
  }, [donors]);

  // Aniversariantes de hoje ou o próximo mais próximo para destaque de "Aniversário do Dia"
  const birthdaysToday = useMemo(
    () => parsedMembers.filter(m => m.isToday),
    [parsedMembers]
  );

  const birthdaysThisMonth = useMemo(
    () =>
      parsedMembers
        .filter(m => m.isThisMonth)
        .sort((a, b) => a.day - b.day),
    [parsedMembers]
  );

  // Irmão em destaque no topo (se houver aniversariante hoje, mostra todos de hoje; senão destaca o próximo da fila e permite escolher qualquer irmão)
  const featuredBirthdayMember = birthdaysToday[0] || parsedMembers[0] || null;

  const openMessageComposer = (member: ParsedBirthdayMember, templateId: string = BIRTHDAY_TEMPLATES[0].id) => {
    setActiveBirthdayMember(member);
    setSelectedTemplateId(templateId);
    const tpl = BIRTHDAY_TEMPLATES.find(t => t.id === templateId) || BIRTHDAY_TEMPLATES[0];
    setCustomMessageText(tpl.buildMessage(member.donor.name, member.donor.birthDate));
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (activeBirthdayMember) {
      const tpl = BIRTHDAY_TEMPLATES.find(t => t.id === templateId) || BIRTHDAY_TEMPLATES[0];
      setCustomMessageText(tpl.buildMessage(activeBirthdayMember.donor.name, activeBirthdayMember.donor.birthDate));
    }
  };

  const handleCopyMessage = (text: string, id: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      showToast('Mensagem de aniversário copiada!');
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  const handleSendWhatsAppDirect = (phone: string, message: string) => {
    let digits = phone.replace(/\D/g, '');
    if (digits.length >= 10 && !digits.startsWith('55')) {
      digits = `55${digits}`;
    }
    const url = `https://api.whatsapp.com/send?phone=${digits}&text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleShareGroupWhatsApp = (message: string) => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handlePublishBirthdayOnMural = (member: ParsedBirthdayMember, messageText: string) => {
    onAddPost({
      authorId: 'me',
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      type: 'momento',
      title: `🎂 Feliz Aniversário, ${member.donor.name}! (${member.nextBirthdayDateStr})`,
      content: messageText,
      tag: 'Aniversário na Célula',
    });
    setActiveBirthdayMember(null);
    showToast(`🎂 Homenagem para ${member.donor.name.split(' ')[0]} publicada no Mural!`);
  };

  const handleActivateBirthdayPushReminder = async () => {
    await requestNotificationPermission();
    const target = featuredBirthdayMember;
    const bodyText = target
      ? target.isToday
        ? `Hoje é aniversário de ${target.donor.name}! Envie sua mensagem de parabéns.`
        : `Próximo aniversário da célula: ${target.donor.name} em ${target.nextBirthdayDateStr} (faltam ${target.daysUntil} dias).`
      : 'Você receberá alertas nos dias de aniversário dos irmãos da célula.';

    await sendCellPushNotification({
      title: '🎂 Lembrete de Aniversários Ativado • Santa Gemma',
      body: bodyText,
      playSound: true,
    });
    showToast('🔔 Alerta de aniversários da célula ativado!');
  };

  const filteredList = useMemo(() => {
    let list = parsedMembers;
    if (filterMode === 'mes-atual') {
      list = parsedMembers
        .filter(m => m.month === selectedMonth)
        .sort((a, b) => a.day - b.day);
    } else if (filterMode === 'todos') {
      list = [...parsedMembers].sort((a, b) =>
        a.month !== b.month ? a.month - b.month : a.day - b.day
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        m =>
          m.donor.name.toLowerCase().includes(q) ||
          m.donor.birthDate.includes(q) ||
          m.donor.phone.includes(q)
      );
    }
    return list;
  }, [parsedMembers, filterMode, selectedMonth, searchQuery]);

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Cabeçalho */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#ECE7DF] text-[#70645E] hover:text-[#241E1C] active:scale-95 transition cursor-pointer shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#241E1C] font-cinzel truncate">
              Lembretes de Aniversário
            </h2>
            <p className="text-xs text-[#70645E] truncate">
              Mensagens para o aniversariante do dia e calendário dos {donors.length} irmãos
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleActivateBirthdayPushReminder}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#36070D] border border-amber-300 text-xs font-bold shadow-2xs active:scale-95 transition cursor-pointer shrink-0"
        >
          <BellRing className="w-3.5 h-3.5 text-[#7B1113]" />
          <span>Ativar Alerta</span>
        </button>
      </div>

      {/* 1. DESTAQUE ESPECIAL: ANIVERSÁRIO DO DIA / PRÓXIMO ANIVERSARIANTE */}
      {featuredBirthdayMember && (
        <section className="rounded-2xl bg-gradient-to-br from-[#7B1113] via-[#610D10] to-[#3B0609] p-4 text-white shadow-md border border-[#E5C158]/50 relative overflow-hidden space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#E5C158]/20 border border-[#E5C158]/40 flex items-center justify-center text-[#FFF0BE]">
                <Cake className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#E5C158] font-cinzel">
                  {birthdaysToday.length > 0
                    ? '🎉 Aniversariante do Dia Hoje!'
                    : `Próximo Aniversário da Célula • Faltam ${featuredBirthdayMember.daysUntil} dias`}
                </p>
                <h3 className="text-sm font-bold text-white leading-tight">
                  {featuredBirthdayMember.donor.name}
                </h3>
              </div>
            </div>

            <span className="text-xs font-bold text-[#FFF0BE] bg-white/10 px-3 py-1 rounded-xl border border-white/15">
              🎂 {featuredBirthdayMember.donor.birthDate}
            </span>
          </div>

          <p className="text-xs text-[#FFF0BE]/90 leading-relaxed bg-black/20 p-3 rounded-xl border border-white/10">
            {birthdaysToday.length > 0
              ? `Hoje celebramos o dom da vida de ${featuredBirthdayMember.donor.name}! Escolha abaixo uma mensagem especial da Célula Santa Gemma para enviar no WhatsApp ou publicar no Mural.`
              : `Prepare desde já a mensagem de felicitações e oração para ${featuredBirthdayMember.donor.name} (dia ${featuredBirthdayMember.nextBirthdayDateStr}) ou escolha qualquer irmão abaixo para enviar os parabéns do dia!`}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => openMessageComposer(featuredBirthdayMember)}
              className="py-2.5 px-3.5 rounded-xl bg-[#E5C158] hover:bg-[#f2cf66] text-[#36070D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Mensagens de Aniversário</span>
            </button>

            <button
              type="button"
              onClick={() =>
                handleSendWhatsAppDirect(
                  featuredBirthdayMember.donor.phone,
                  BIRTHDAY_TEMPLATES[0].buildMessage(
                    featuredBirthdayMember.donor.name,
                    featuredBirthdayMember.donor.birthDate
                  )
                )
              }
              className="py-2.5 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Enviar Parabéns no WhatsApp</span>
            </button>
          </div>
        </section>
      )}

      {/* 2. MODELOS PRONTOS DE MENSAGENS PARA O ANIVERSÁRIO DO DIA */}
      <section className="rounded-2xl bg-white/95 backdrop-blur-md p-4 shadow-sm border border-[#ECE7DF] space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#7B1113] font-cinzel flex items-center gap-1.5">
              <Gift className="w-4 h-4" />
              <span>Mensagens Prontas para o Aniversário do Dia</span>
            </h3>
            <p className="text-[11px] text-[#70645E]">
              Toque para copiar, personalizar com o nome do irmão ou enviar no grupo da célula
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {BIRTHDAY_TEMPLATES.map(tpl => {
            const targetName = featuredBirthdayMember?.donor.name || 'Irmão(ã) da Célula';
            const targetBirth = featuredBirthdayMember?.donor.birthDate || '';
            const previewMsg = tpl.buildMessage(targetName, targetBirth);

            return (
              <div
                key={tpl.id}
                className="rounded-xl bg-[#FAF8F5] p-3 border border-[#E5DFD5] flex flex-col justify-between space-y-2.5"
              >
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-[#241E1C]">{tpl.title}</h4>
                  <p className="text-[10px] text-[#70645E]">{tpl.subtitle}</p>
                  <p className="text-[11px] text-[#423834] line-clamp-3 bg-white p-2 rounded-lg border border-[#ECE7DF] whitespace-pre-line leading-relaxed">
                    {previewMsg}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleCopyMessage(previewMsg, tpl.id)}
                    className="py-1.5 px-2.5 rounded-lg bg-white hover:bg-[#EFEAE2] text-[#36070D] border border-[#D9D0C5] text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
                  >
                    {copiedId === tpl.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Copiado!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#7B1113]" />
                        <span>Copiar Texto</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (featuredBirthdayMember) {
                        openMessageComposer(featuredBirthdayMember, tpl.id);
                      }
                    }}
                    className="py-1.5 px-2.5 rounded-lg bg-[#7B1113] hover:bg-[#580C14] text-white text-[11px] font-bold flex items-center justify-center gap-1 transition cursor-pointer active:scale-95"
                  >
                    <Send className="w-3 h-3" />
                    <span>Usar / Enviar</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. RESUMO DOS ANIVERSARIANTES DESTE MÊS */}
      <section className="rounded-2xl bg-gradient-to-r from-amber-50/95 to-rose-50/90 p-3.5 border border-amber-200/80 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-[#36070D] flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#7B1113]" />
            <span>
              Aniversariantes de {MONTH_NAMES[currentMonthNumber - 1]} ({birthdaysThisMonth.length})
            </span>
          </h3>
          <button
            type="button"
            onClick={() => {
              const listText = birthdaysThisMonth
                .map(m => `• *${m.nextBirthdayDateStr}* — ${m.donor.name}`)
                .join('\n');
              const groupSummary =
                `🎂 *ANIVERSARIANTES DE ${MONTH_NAMES[currentMonthNumber - 1].toUpperCase()} • CÉLULA SANTA GEMMA GALGANI* 🌹\n\n` +
                `${listText || 'Nenhum aniversariante neste mês.'}\n\n` +
                `_"Louvamos a Deus pelo dom da vida de cada irmão e irmã da nossa célula!"_ 🙏🎉`;
              handleShareGroupWhatsApp(groupSummary);
            }}
            className="px-2.5 py-1 rounded-lg bg-[#7B1113] text-white text-[10px] font-bold flex items-center gap-1 hover:bg-[#580C14] transition cursor-pointer active:scale-95"
          >
            <Share2 className="w-3 h-3" />
            <span>Compartilhar Lista do Mês</span>
          </button>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {birthdaysThisMonth.map(item => (
            <button
              key={item.donor.id}
              type="button"
              onClick={() => openMessageComposer(item)}
              className="shrink-0 p-2.5 rounded-xl bg-white border border-amber-300/80 shadow-2xs text-left hover:border-[#7B1113] transition cursor-pointer active:scale-95 min-w-[175px]"
            >
              <div className="flex items-center justify-between text-[10px] font-bold text-[#7B1113]">
                <span>🎂 Dia {String(item.day).padStart(2, '0')}/{String(item.month).padStart(2, '0')}</span>
                <span>{item.isToday ? '🎉 HOJE!' : `Faltam ${item.daysUntil}d`}</span>
              </div>
              <p className="text-xs font-bold text-[#241E1C] truncate mt-1">
                {item.donor.name}
              </p>
              <p className="text-[10px] text-[#70645E] mt-0.5 underline">
                Gerar mensagem de parabéns &rarr;
              </p>
            </button>
          ))}
        </div>
      </section>

      {/* 4. FILTROS E LISTA COMPLETA DE LEMBRETES DOS 48 IRMÃOS */}
      <section className="space-y-3">
        {/* Abas de Visualização */}
        <div className="grid grid-cols-3 gap-1.5 bg-white/90 p-1.5 rounded-xl border border-[#ECE7DF]">
          <button
            type="button"
            onClick={() => setFilterMode('proximos')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'proximos'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#554741] hover:bg-[#F4EFEB]'
            }`}
          >
            Próximos da Fila
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('mes-atual')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'mes-atual'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#554741] hover:bg-[#F4EFEB]'
            }`}
          >
            Filtrar por Mês
          </button>
          <button
            type="button"
            onClick={() => setFilterMode('todos')}
            className={`py-2 px-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              filterMode === 'todos'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#554741] hover:bg-[#F4EFEB]'
            }`}
          >
            Todos ({donors.length})
          </button>
        </div>

        {/* Seletor de Mês quando 'mes-atual' estiver ativo */}
        {filterMode === 'mes-atual' && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            {MONTH_NAMES.map((mName, idx) => {
              const mNum = idx + 1;
              const count = parsedMembers.filter(m => m.month === mNum).length;
              return (
                <button
                  key={mName}
                  type="button"
                  onClick={() => setSelectedMonth(mNum)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedMonth === mNum
                      ? 'bg-[#7B1113] text-white shadow-xs'
                      : 'bg-white/90 text-[#554741] border border-[#ECE7DF]'
                  }`}
                >
                  {mName} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* Busca por nome ou data */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A7C75] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar irmão pelo nome ou data (ex: 25/10, Cristiane, Francisco)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#D9D0C5] bg-white pl-9 pr-3 py-2.5 text-xs text-[#241E1C] focus:outline-[#7B1113]"
          />
        </div>

        {/* Lista de Membros */}
        <div className="space-y-2.5">
          {filteredList.length === 0 ? (
            <div className="rounded-2xl bg-white/90 p-6 text-center text-xs text-[#8A7C75] border border-[#ECE7DF]">
              Nenhum aniversariante encontrado para este filtro.
            </div>
          ) : (
            filteredList.map(item => (
              <div
                key={item.donor.id}
                className={`rounded-2xl p-3.5 border transition shadow-2xs space-y-2.5 ${
                  item.isToday
                    ? 'bg-gradient-to-r from-amber-50 to-rose-50 border-[#7B1113] ring-1 ring-[#7B1113]/30'
                    : 'bg-white/95 border-[#ECE7DF]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#7B1113]/30 bg-white shrink-0 shadow-2xs">
                      {item.donor.avatarUrl ? (
                        <img src={item.donor.avatarUrl} alt={item.donor.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-rose-100 flex items-center justify-center text-[#7B1113] font-bold text-xs font-cinzel">
                          {item.donor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className="text-xs font-bold text-[#241E1C]">
                          {item.donor.name}
                        </h4>
                      {item.donor.leadershipBadge &&
                        item.donor.leadershipBadge.includes('Coordenador') && (
                          <span className="text-[10px] font-bold text-[#7B1113]">
                            · Coordenação & Formação
                          </span>
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#70645E] mt-1">
                      <span className="font-semibold text-[#36070D]">
                        🎂 Nascimento: {item.donor.birthDate}
                      </span>
                      <span>·</span>
                      <span>📱 {item.donor.phone}</span>
                    </div>
                  </div>
                </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg ${
                        item.isToday
                          ? 'bg-[#7B1113] text-[#FFF0BE]'
                          : item.daysUntil <= 15
                          ? 'bg-amber-100 text-amber-950'
                          : 'bg-[#F4EFEB] text-[#554741]'
                      }`}
                    >
                      {item.isToday
                        ? '🎉 É HOJE!'
                        : item.daysUntil === 1
                        ? 'Amanhã!'
                        : `Faltam ${item.daysUntil} dias`}
                    </span>
                  </div>
                </div>

                {/* Botões de Ação Rápida de Aniversário */}
                <div className="pt-2 border-t border-[#F2EFE9] grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => openMessageComposer(item)}
                    className="py-2 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Mensagem do Dia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleSendWhatsAppDirect(
                        item.donor.phone,
                        BIRTHDAY_TEMPLATES[0].buildMessage(
                          item.donor.name,
                          item.donor.birthDate
                        )
                      )
                    }
                    className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp Direto</span>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handlePublishBirthdayOnMural(
                        item,
                        BIRTHDAY_TEMPLATES[0].buildMessage(
                          item.donor.name,
                          item.donor.birthDate
                        )
                      )
                    }
                    className="col-span-2 sm:col-span-1 py-2 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#36070D] border border-amber-300 text-[11px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#7B1113]" />
                    <span>Publicar no Mural</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* MODAL GERADOR E PERSONALIZADOR DE MENSAGEM PARA O ANIVERSARIANTE DO DIA */}
      <Modal
        isOpen={Boolean(activeBirthdayMember)}
        onClose={() => setActiveBirthdayMember(null)}
        title={
          activeBirthdayMember
            ? `Parabéns para ${activeBirthdayMember.donor.name.split(' ')[0]}`
            : 'Mensagem de Aniversário'
        }
        subtitle={
          activeBirthdayMember
            ? `Aniversário em ${activeBirthdayMember.donor.birthDate} • WhatsApp: ${activeBirthdayMember.donor.phone}`
            : ''
        }
      >
        {activeBirthdayMember && (
          <div className="space-y-4">
            {/* Escolha do Modelo de Mensagem */}
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1.5">
                Escolha o Modelo de Mensagem do Dia:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {BIRTHDAY_TEMPLATES.map(tpl => {
                  const isSelected = selectedTemplateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className={`p-2.5 rounded-xl border text-left transition cursor-pointer active:scale-95 ${
                        isSelected
                          ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-xs'
                          : 'bg-white text-[#241E1C] border-[#D9D0C5] hover:bg-[#F4EFEB]'
                      }`}
                    >
                      <p className="text-xs font-bold leading-snug">{tpl.title}</p>
                      <p
                        className={`text-[10px] mt-0.5 ${
                          isSelected ? 'text-[#FFF0BE]' : 'text-[#70645E]'
                        }`}
                      >
                        {tpl.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Editor da Mensagem Personalizada */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-[#36070D]">
                  Mensagem Personalizada para {activeBirthdayMember.donor.name}:
                </label>
                <button
                  type="button"
                  onClick={() => handleCopyMessage(customMessageText, 'modal_copy')}
                  className="text-[11px] font-bold text-[#7B1113] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedId === 'modal_copy' ? 'Copiado!' : 'Copiar texto'}</span>
                </button>
              </div>
              <textarea
                rows={7}
                value={customMessageText}
                onChange={e => setCustomMessageText(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-3 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113] leading-relaxed"
              />
            </div>

            {/* Ações de Envio: WhatsApp Individual, Grupo da Célula ou Mural */}
            <div className="space-y-2 pt-2 border-t border-[#ECE7DF]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSendWhatsAppDirect(
                      activeBirthdayMember.donor.phone,
                      customMessageText
                    )
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enviar no WhatsApp de {activeBirthdayMember.donor.name.split(' ')[0]}</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleShareGroupWhatsApp(customMessageText)}
                  className="w-full py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#36070D] border border-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Share2 className="w-4 h-4 text-[#7B1113]" />
                  <span>Enviar no Grupo da Célula</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBirthdayMember(null)}
                  className="w-full py-2.5 px-3 rounded-xl border border-[#D9D0C5] bg-white text-xs font-bold text-[#70645E] hover:bg-[#EFEAE2] transition cursor-pointer active:scale-95"
                >
                  Fechar
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handlePublishBirthdayOnMural(activeBirthdayMember, customMessageText)
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition cursor-pointer active:scale-95"
                >
                  <Heart className="w-4 h-4" />
                  <span>Publicar Homenagem no Mural</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
