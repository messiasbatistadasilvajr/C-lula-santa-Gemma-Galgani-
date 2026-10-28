// =====================================================================
// SERVIÇO DE VIGÍLIA MENSAL • CÉLULA SANTA GEMMA GALGANI
// Regra: Vigília acontece todo dia 26 de cada mês.
// Horários oficiais:
//   1° horário: 22:00 às 02:00
//   2° horário: 02:00 às 06:00
// Ordem base (Outubro/2026):
//   1° horário (22:00 às 02:00): Cris e Francisco
//   2° horário (02:00 às 06:00): Raquel e Regina
//
// Regra de revezamento contínuo:
//   A partir do dia 26/11/2026:
//   - Quem estava no 1° horário (Cris e Francisco) passa para o 2° horário (02:00 às 06:00)
//   - Quem estava no 2° horário (Raquel e Regina) assume o 1° horário (22:00 às 02:00)
//   - E assim consecutivamente fazendo essa troca a cada mês!
// =====================================================================

export interface VigiliaMembro {
  nome: string;
  nomeCurto: string;
  papel: string;
  telefone?: string;
  avatarUrl?: string;
}

export interface VigiliaHorario {
  slotNome: '1° horário' | '2° horário';
  timeRange: string;
  rotulo: string; // ex: "Cris e Francisco" ou "Raquel e Regina"
  membros: VigiliaMembro[];
}

export interface VigiliaEscala {
  id: string;
  dataIso: string;          // ex: "2026-11-26"
  dia: number;              // 26
  mes: number;              // 1-12
  ano: number;              // ex: 2026
  dataFormatada: string;     // ex: "26 de Novembro de 2026"
  diaDaSemana: string;      // ex: "Quinta-feira"
  mesAnoLabel: string;      // ex: "Novembro de 2026"
  horario1: VigiliaHorario;
  horario2: VigiliaHorario;
  descricaoRegra: string;
  isProxima: boolean;
}

// Membros das duplas fixas
const DUPLA_CRIS_FRANCISCO: VigiliaMembro[] = [
  {
    nome: 'Cristiane Alves Nunes de Oliveira',
    nomeCurto: 'Cris',
    papel: 'Formadora Principal (Acesso Total)',
    telefone: '(85) 98225-0655',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  },
  {
    nome: 'Francisco José de Oliveira',
    nomeCurto: 'Francisco',
    papel: 'Formador Auxiliar & Coordenador (Acesso Total)',
    telefone: '(85) 99843-3531',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
];

const DUPLA_RAQUEL_REGINA: VigiliaMembro[] = [
  {
    nome: 'Raquel Barbosa Gomes',
    nomeCurto: 'Raquel',
    papel: 'Formadora Auxiliar (Acesso Total)',
    telefone: '(85) 99225-4241',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  },
  {
    nome: 'Ana Regina Vieira de Brito',
    nomeCurto: 'Regina',
    papel: 'Membro da Célula & Acolhida',
    telefone: '(85) 98858-6902',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  },
];

const MESES_PT = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

const DIAS_SEMANA_PT = [
  'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
  'Quinta-feira', 'Sexta-feira', 'Sábado'
];

/**
 * Calcula a escala da Vigília do dia 26 para um determinado mês e ano.
 * Regra de alternância mensal consecutiva:
 * - Outubro/2026 (base): 1° horário = Cris e Francisco | 2° horário = Raquel e Regina
 * - Novembro/2026:       1° horário = Raquel e Regina  | 2° horário = Cris e Francisco (Cris e Francisco passaram para o 2°)
 * - Dezembro/2026:       1° horário = Cris e Francisco | 2° horário = Raquel e Regina
 * - Janeiro/2027:        1° horário = Raquel e Regina  | 2° horário = Cris e Francisco
 * - E assim consecutivamente alternando todo mês.
 */
export function getVigiliaForMonth(year: number, month: number): VigiliaEscala {
  // Delta de meses a partir de Outubro/2026 (base)
  const deltaMonths = (year - 2026) * 12 + (month - 10);
  
  // Se deltaMonths for par (0 = Out/26, 2 = Dez/26, 4 = Fev/27...):
  // 1° = Cris e Francisco, 2° = Raquel e Regina
  // Se deltaMonths for ímpar (1 = Nov/26, 3 = Jan/27, 5 = Mar/27...):
  // 1° = Raquel e Regina, 2° = Cris e Francisco
  const isOddShift = Math.abs(deltaMonths % 2) === 1;

  const firstPairLabel = isOddShift ? 'Raquel e Regina' : 'Cris e Francisco';
  const firstPairMembers = isOddShift ? DUPLA_RAQUEL_REGINA : DUPLA_CRIS_FRANCISCO;

  const secondPairLabel = isOddShift ? 'Cris e Francisco' : 'Raquel e Regina';
  const secondPairMembers = isOddShift ? DUPLA_CRIS_FRANCISCO : DUPLA_RAQUEL_REGINA;

  // Data do dia 26
  const monthPad = String(month).padStart(2, '0');
  const dataIso = `${year}-${monthPad}-26`;
  const dateObj = new Date(year, month - 1, 26, 12, 0, 0);
  const diaDaSemana = DIAS_SEMANA_PT[dateObj.getDay()];
  const nomeMes = MESES_PT[month - 1];

  let descricaoRegra = '';
  if (year === 2026 && month === 11) {
    descricaoRegra = 'Troca mensal ativa: no dia 26/11/2026 Cris e Francisco passam para o 2° horário e Raquel e Regina assumem o 1° horário.';
  } else if (isOddShift) {
    descricaoRegra = 'Troca mensal consecutiva: 1° horário com Raquel e Regina, 2° horário com Cris e Francisco.';
  } else {
    descricaoRegra = 'Troca mensal consecutiva: 1° horário com Cris e Francisco, 2° horário com Raquel e Regina.';
  }

  return {
    id: `vigilia_${year}_${monthPad}_26`,
    dataIso,
    dia: 26,
    mes: month,
    ano: year,
    dataFormatada: `26 de ${nomeMes} de ${year}`,
    diaDaSemana,
    mesAnoLabel: `${nomeMes} de ${year}`,
    horario1: {
      slotNome: '1° horário',
      timeRange: '22:00 às 02:00',
      rotulo: firstPairLabel,
      membros: firstPairMembers,
    },
    horario2: {
      slotNome: '2° horário',
      timeRange: '02:00 às 06:00',
      rotulo: secondPairLabel,
      membros: secondPairMembers,
    },
    descricaoRegra,
    isProxima: false,
  };
}

/**
 * Retorna a próxima vigília a partir da data atual (ou data de referência).
 * Se hoje já passou do dia 26 do mês atual, retorna o dia 26 do mês seguinte.
 */
export function getNextVigilia(refDate: Date = new Date()): VigiliaEscala {
  const currentYear = refDate.getFullYear();
  const currentMonth = refDate.getMonth() + 1; // 1-12
  const currentDay = refDate.getDate();

  let targetYear = currentYear;
  let targetMonth = currentMonth;

  // Se já passou do dia 26 às 23:59, a próxima vigília é no mês seguinte
  if (currentDay > 26) {
    targetMonth += 1;
    if (targetMonth > 12) {
      targetMonth = 1;
      targetYear += 1;
    }
  }

  const vigilia = getVigiliaForMonth(targetYear, targetMonth);
  vigilia.isProxima = true;
  return vigilia;
}

/**
 * Retorna uma lista de vigílias consecutivas a partir de um mês específico
 * (padrão: Outubro de 2026 até os próximos 12 meses para consulta completa).
 */
export function getUpcomingVigilias(count: number = 8, startYear: number = 2026, startMonth: number = 10): VigiliaEscala[] {
  const list: VigiliaEscala[] = [];
  const nextVig = getNextVigilia();

  let y = startYear;
  let m = startMonth;

  for (let i = 0; i < count; i++) {
    const item = getVigiliaForMonth(y, m);
    if (item.dataIso === nextVig.dataIso) {
      item.isProxima = true;
    }
    list.push(item);

    m += 1;
    if (m > 12) {
      m = 1;
      y += 1;
    }
  }

  return list;
}

/**
 * Gera mensagem formatada pronta para enviar no WhatsApp da Célula
 */
export function generateVigiliaWhatsAppText(escala: VigiliaEscala): string {
  let msg = `🕊️ *VIGÍLIA MENSAL • CÉLULA SANTA GEMMA GALGANI*\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `📅 *DATA:* ${escala.dataFormatada} (${escala.diaDaSemana})\n`;
  msg += `📍 *LOCAL:* Capela do Santíssimo Sacramento • Shalom\n`;
  msg += `⏰ *DURAÇÃO:* 22:00 às 06:00 (Todo dia 26)\n\n`;

  msg += `⏰ *1° HORÁRIO (${escala.horario1.timeRange}):* ${escala.horario1.rotulo}\n`;
  escala.horario1.membros.forEach(m => {
    msg += `   • ${m.nomeCurto} (${m.nome})\n`;
  });
  msg += `\n`;

  msg += `⏰ *2° HORÁRIO (${escala.horario2.timeRange}):* ${escala.horario2.rotulo}\n`;
  escala.horario2.membros.forEach(m => {
    msg += `   • ${m.nomeCurto} (${m.nome})\n`;
  });
  msg += `\n`;

  msg += `🔄 *REVEZAMENTO MENSAL:* ${escala.descricaoRegra}\n\n`;
  msg += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  msg += `_"Permanecei aqui e vigiai Comigo!" (Mt 26, 38)_\n`;
  msg += `Santa Gemma Galgani, rogai por nós e pela nossa oração! ✨❤️`;

  return msg;
}

/**
 * Gera link direto para compartilhar no WhatsApp
 */
export function getVigiliaWhatsAppShareLink(escala: VigiliaEscala): string {
  const text = generateVigiliaWhatsAppText(escala);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}
