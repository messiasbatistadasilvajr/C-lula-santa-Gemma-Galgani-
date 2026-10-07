import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Heart, 
  Share2, 
  CheckCircle2, 
  PlusCircle, 
  Check, 
  Flame, 
  BookOpen, 
  Calendar, 
  MessageSquare,
  Cross,
  Award,
  ChevronRight,
  Filter
} from 'lucide-react';
import { NovenaDayItem, GraceTestimony, TestimonyCategory, UserRole } from '../types';
import { Modal } from '../components/common/Modal';

interface NovenaTestemunhosProps {
  onBack: () => void;
  currentRole?: UserRole;
  userName?: string;
  onNavigateToTerco?: () => void;
}

// Os 9 Dias da Novena Oficial de Santa Gemma Galgani
const NOVENA_DAYS: NovenaDayItem[] = [
  {
    dayNumber: 1,
    title: '1º Dia: O Amor Apaixonado à Santa Cruz',
    theme: 'Abraçar a Cruz de cada dia por amor a Jesus',
    scripture: 'Gl 6, 14: "Quanto a mim, que eu não me glorie a não ser na cruz de nosso Senhor Jesus Cristo."',
    meditacao: 'Santa Gemma não apenas suportava os sofrimentos, mas os desejava para estar mais unida a Jesus Crucificado. Ela nos ensina que as contrariedades e dores da vida, quando oferecidas com paciência e amor, se tornam fontes inesgotáveis de bênçãos para nossa célula e para a Igreja.',
    gemmaQuote: '"Viva Jesus! Quanto mais sofro, mais contente fico, porque me assemelho ao meu doce Jesus."',
    prayer: 'Ó gloriosa Santa Gemma, que abraçastes com tão heroica serenidade a Cruz de Cristo, obtende-nos do Senhor a graça de não nos queixarmos diante das provações cotidianas, mas de reconhecermos nelas um caminho de purificação e redenção.',
    intentionPrompt: 'Ofereça este dia pelas pessoas de nossa comunidade que estão enfrentando enfermidades e cruzes pesadas.'
  },
  {
    dayNumber: 2,
    title: '2º Dia: A Pureza Angélica e a Castidade',
    theme: 'Guarda do coração, dos olhos e dos pensamentos',
    scripture: 'Mt 5, 8: "Bem-aventurados os puros de coração, porque verão a Deus."',
    meditacao: 'Gemma era chamada em sua cidade de "o Anjo de Lucca" por sua virgindade irrepreensível e seu pudor celestial. Na Comunidade Shalom e na nossa célula, pedimos a virtude da pureza para amar os irmãos com amor desinteressado e santo.',
    gemmaQuote: '"Jesus, meu amor, guarda a minha alma e o meu corpo puros como a neve, para que eu viva unicamente para Ti."',
    prayer: 'Santa Gemma, lírio de pureza imaculada, protegei a juventude da nossa célula contra as seduções do mundo moderno. Concedei-nos a graça da castidade e a paz da consciência límpida.',
    intentionPrompt: 'Reze hoje pela santidade dos jovens e pelo discernimento matrimonial e celibatário da célula.'
  },
  {
    dayNumber: 3,
    title: '3º Dia: O Ardor pela Santíssima Eucaristia',
    theme: 'Comunhão frequente e profunda adoração diante do Sacrário',
    scripture: 'Jo 6, 51: "Eu sou o pão vivo descido do céu. Quem comer deste pão viverá eternamente."',
    meditacao: 'Para Gemma, o dia sem a Sagrada Comunhão era um dia de dor infinita. Muitas vezes ela entrava em êxtase contemplando a Hóstia Consagrada. Que em nossa célula o amor pela Santa Missa e adoração perpétua seja o centro de tudo.',
    gemmaQuote: '"Que fogo é este, Jesus, que sinto em meu coração quando Te recebo na Comunhão? Parece que vou morrer de tanto amor!"',
    prayer: 'Ó Santa Gemma, apaixonada pela Eucaristia, ensinai-nos a nos aproximarmos do altar com reverência, fé viva e coração arrependido. Fazei com que nunca façamos uma Comunhão fria ou distraída.',
    intentionPrompt: 'Dedique um momento de adoração ou oração pessoal diante do Santíssimo Sacramento hoje.'
  },
  {
    dayNumber: 4,
    title: '4º Dia: A Doce Intimidade com o Anjo da Guarda',
    theme: 'Amizade e docilidade às inspirações do nosso protetor celestial',
    scripture: 'Sl 91, 11: "Pois ele dará ordens aos seus anjos a teu respeito, para que te guardem em todos os teus caminhos."',
    meditacao: 'Santa Gemma via, conversava e até pedia recados ao seu Santo Anjo da Guarda. O anjo a corrigia quando errava e a consolava nas provações. Nós também temos um anjo custódio colocado por Deus ao nosso lado dia e noite.',
    gemmaQuote: '"O meu anjo não me deixa um instante só. Quando rezo, ele reza comigo; quando durmo, ele me vigia."',
    prayer: 'Amável Santa Gemma, despertai em nós a consciência da presença viva de nosso Anjo da Guarda. Que saibamos escutar suas santas inspirações e agradecer ao Senhor por tão fiel companheiro.',
    intentionPrompt: 'Reze três vezes o Santo Anjo do Senhor agradecendo pela proteção ao longo de sua vida.'
  },
  {
    dayNumber: 5,
    title: '5º Dia: O Espírito de Oração Incessante',
    theme: 'Viver em constante diálogo filial com o Pai',
    scripture: '1Ts 5, 17: "Orai sem cessar. Em tudo dai graças."',
    meditacao: 'A oração de Gemma não era uma obrigação pesada, mas o respirar de sua alma. Em seus colóquios com Deus, ela intercedia pelos pecadores até obter de Jesus a salvação das almas. Que nossa célula seja uma fornalha de oração.',
    gemmaQuote: '"Se eu pudesse, queria que o meu coração batesse a cada segundo dizendo: Jesus, eu Vos amo!"',
    prayer: 'Santa Gemma, mestra da oração contemplativa, ensinai-nos a cultivar a intimidade com o Espírito Santo na nossa célula. Afastai de nós a tibieza, a distração e o desânimo na oração comunitária.',
    intentionPrompt: 'Partilhe hoje no grupo de WhatsApp da célula um versículo bíblico que tocou sua oração pessoal.'
  },
  {
    dayNumber: 6,
    title: '6º Dia: A Paciência nas Doenças e Dores',
    theme: 'Confiança inabalável quando as forças humanas se esgotam',
    scripture: 'Rm 8, 18: "Considero que os sofrimentos do tempo presente não têm proporção com a glória que há de ser revelada em nós."',
    meditacao: 'Gemma sofreu graves doenças na juventude, meningite e dores lancinantes na coluna, antes de ser curada milagrosamente por intercessão de São Gabriel da Virgem Dolorosa e Santa Margarida Maria Alacoque. Na doença, ela glorificava a Deus.',
    gemmaQuote: '"Se Jesus me visita com a dor, é sinal de que ainda não se esqueceu de mim."',
    prayer: 'Ó piedosa Santa Gemma, confortai os enfermos que sofrem nos hospitais e em seus lares. Dai paciência aos que cuidam dos doentes e esperança àqueles que aguardam uma cura física ou espiritual.',
    intentionPrompt: 'Interceda nominalmente pelos pedidos de saúde registrados na aba de Intercessão do aplicativo.'
  },
  {
    dayNumber: 7,
    title: '7º Dia: A Humildade Profunda e Oculta',
    theme: 'Desapego dos elogios e alegria na simplicidade',
    scripture: 'Fl 2, 3: "Nada façais por ambição ou vanglória, mas, com humildade, cada um considere os outros superiores a si mesmo."',
    meditacao: 'Apesar dos estigmas e visões extraordinárias, Gemma considerava-se a mais indigna de todas as criaturas. Ela escondia os sinais da Paixão em suas mãos com luvas pretas para não chamar a atenção. Ela amava a vida oculta.',
    gemmaQuote: '"Reconheço que nada sou, nada posso e nada mereço a não ser castigos pelos meus pecados; tudo em mim é pura misericórdia."',
    prayer: 'Humilde virgem Santa Gemma, arrancai do nosso peito todo sentimento de soberba, vaidade e autorreferencialidade. Fazei com que sirvamos aos nossos irmãos de célula com mansidão e espírito de servo.',
    intentionPrompt: 'Faça um gesto de serviço ou gentileza anônimo hoje para alguém de sua casa ou trabalho.'
  },
  {
    dayNumber: 8,
    title: '8º Dia: A Devoção a Nossa Senhora das Dores',
    theme: 'Acolher a Mãe do Céu aos pés da Cruz',
    scripture: 'Jo 19, 27: "Depois disse ao discípulo: Eis aí a tua mãe. E desde aquela hora o discípulo a recebeu em sua casa."',
    meditacao: 'Órfã de mãe na infância, Gemma encontrou em Maria Santíssima seu refúgio e mestra espiritual. Ela rezava com ternura infinita à Mãe das Dores, pedindo para chorar com Ela as dores da Paixão de Jesus.',
    gemmaQuote: '"Minha Mãe Celeste, quando estarei contigo no Paraíso para cantar eternamente as misericórdias do Senhor?"',
    prayer: 'Santa Gemma, que descansastes nos braços maternos da Virgem das Dores, protegei as mães e famílias de nossa comunidade. Ensinai-nos a confiar sempre na poderosa intercessão da Mãe de Deus.',
    intentionPrompt: 'Reze um terço ou uma dezena hoje pedindo pela reconciliação de famílias divididas.'
  },
  {
    dayNumber: 9,
    title: '9º Dia: A Oferta Total e o Holocausto de Amor',
    theme: 'Entrega incondicional da vida pela salvação das almas',
    scripture: 'Jo 15, 13: "Ninguém tem maior amor do que aquele que dá a sua vida por seus amigos."',
    meditacao: 'Gemma partiu para a glória eterna no Sábado Santo de 1903, consumida como vela de amor no altar do Senhor. Sua vida breve foi um testemunho de que vale a pena dar tudo por Jesus. O carisma Shalom também nos chama a ofertar a vida pela Igreja e pelos jovens.',
    gemmaQuote: '"Não busco senão a Jesus. Se Ele for meu, tudo terei, nada mais me faltará."',
    prayer: 'Ó bendita Santa Gemma Galgani, padroeira de nossa Célula, alcançai-nos a perseverança final até o último suspiro. Que a nossa vida seja um canto de louvor a Deus e que um dia nos encontremos todos juntos no Céu!',
    intentionPrompt: 'Renove hoje seu compromisso com a Célula Santa Gemma e envie uma mensagem de ânimo a um irmão.'
  }
];

// Testemunhos Iniciais da Célula
const INITIAL_TESTIMONIES: GraceTestimony[] = [
  {
    id: 'test_1',
    authorName: 'Ana Regina Vieira de Brito',
    authorRole: 'membro',
    title: 'Cura física da minha mãe e paz no lar',
    story: 'Minha mãe estava internada com um quadro respiratório grave e muitas dores. Pedi intercessão na novena de Santa Gemma e a célula toda rezou comigo. Três dias depois os exames apresentaram melhora inacreditável e ela pôde voltar para casa curada! Louvado seja Deus!',
    category: 'cura',
    date: '18 de Setembro de 2026',
    praiseCount: 14,
    hasPraised: true
  },
  {
    id: 'test_2',
    authorName: 'Aliomar Gabriel Oliveira',
    authorRole: 'membro',
    title: 'Abertura para o discernimento vocacional',
    story: 'Lendo os escritos de Santa Gemma sobre o amor apaixonado pela Eucaristia e a Cruz, meu coração se inflamou de paz. A caminhada na célula fortaleceu minha oração diária com clareza e alegria interior.',
    category: 'vocacional',
    date: '10 de Setembro de 2026',
    praiseCount: 22,
    hasPraised: false
  },
  {
    id: 'test_3',
    authorName: 'Cristiane Alves Nunes de Oliveira',
    authorRole: 'formador',
    title: 'Reconciliação familiar pela intercessão de Santa Gemma',
    story: 'Apresentamos na oração comunitária da nossa célula a intenção de reconciliação e retorno aos sacramentos. Pela intercessão de Santa Gemma Galgani, alcançamos a graça da confissão e retorno à Santa Missa.',
    category: 'conversao',
    date: '02 de Setembro de 2026',
    praiseCount: 31,
    hasPraised: true
  },
  {
    id: 'test_4',
    authorName: 'Juliana Martins Lima',
    authorRole: 'membro',
    title: 'Provisão financeira e portas abertas no trabalho',
    story: 'Estávamos passando por um momento de aperto. Rezei a novena pedindo a intercessão de Santa Gemma para pagar as despesas e concluir os estudos. Deus abriu portas inesperadas no trabalho!',
    category: 'trabalho',
    date: '25 de Agosto de 2026',
    praiseCount: 19,
    hasPraised: false
  }
];

export const NovenaTestemunhos: React.FC<NovenaTestemunhosProps> = ({
  onBack,
  currentRole = 'membro',
  userName = 'Irmão em Cristo',
  onNavigateToTerco
}) => {
  const [activeTab, setActiveTab] = useState<'novena' | 'testemunhos'>('novena');
  
  // Estado da Novena
  const [selectedDayNumber, setSelectedDayNumber] = useState<number>(1);
  const [completedDays, setCompletedDays] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('sg_novena_completed_days');
      return saved ? JSON.parse(saved) : [1];
    } catch {
      return [1];
    }
  });
  const [personalIntention, setPersonalIntention] = useState<string>(() => {
    try {
      return localStorage.getItem('sg_novena_intention') || 'Pela conversão e saúde da minha família e pelos jovens da célula.';
    } catch {
      return 'Pela conversão e saúde da minha família e pelos jovens da célula.';
    }
  });
  const [isEditingIntention, setIsEditingIntention] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Estado dos Testemunhos
  const [testimonies, setTestimonies] = useState<GraceTestimony[]>(() => {
    try {
      const saved = localStorage.getItem('sg_testimonies_list_v3');
      return saved ? JSON.parse(saved) : INITIAL_TESTIMONIES;
    } catch {
      return INITIAL_TESTIMONIES;
    }
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [isNewTestimonyModalOpen, setIsNewTestimonyModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState<string>('');
  const [newStory, setNewStory] = useState<string>('');
  const [newCategory, setNewCategory] = useState<TestimonyCategory>('espiritual');
  const [newAuthorName, setNewAuthorName] = useState<string>(userName);

  // Salvar no storage
  useEffect(() => {
    try {
      localStorage.setItem('sg_novena_completed_days', JSON.stringify(completedDays));
    } catch {
      // Ignora erro
    }
  }, [completedDays]);

  useEffect(() => {
    try {
      localStorage.setItem('sg_testimonies_list_v3', JSON.stringify(testimonies));
    } catch {
      // Ignora erro
    }
  }, [testimonies]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveIntention = () => {
    try {
      localStorage.setItem('sg_novena_intention', personalIntention);
      setIsEditingIntention(false);
      showToast('Intenção da novena atualizada!');
    } catch {
      setIsEditingIntention(false);
    }
  };

  const toggleDayCompleted = (dayNum: number) => {
    if (completedDays.includes(dayNum)) {
      setCompletedDays(prev => prev.filter(d => d !== dayNum));
      showToast(`Dia ${dayNum} desmarcado.`);
    } else {
      setCompletedDays(prev => [...prev, dayNum]);
      showToast(`Deo Gratias! Oração do ${dayNum}º Dia concluída! ✨`);
    }
  };

  const handlePraise = (id: string) => {
    setTestimonies(prev => prev.map(t => {
      if (t.id === id) {
        const nextHasPraised = !t.hasPraised;
        return {
          ...t,
          hasPraised: nextHasPraised,
          praiseCount: nextHasPraised ? t.praiseCount + 1 : Math.max(0, t.praiseCount - 1)
        };
      }
      return t;
    }));
  };

  const handleShareTestimony = (item: GraceTestimony) => {
    const text = `Testemunho de Graça Alcançada • Santa Gemma Galgani\n\n"${item.title}"\n${item.story}\n\n— Partilhado por ${item.authorName} na Célula Santa Gemma Galgani`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Testemunho copiado para o WhatsApp!');
    }
  };

  const handleCreateTestimony = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newStory.trim()) {
      showToast('Por favor, preencha o título e o relato da graça.');
      return;
    }

    const created: GraceTestimony = {
      id: `test_${Date.now()}`,
      authorName: newAuthorName.trim() || 'Irmão da Célula',
      authorRole: currentRole,
      title: newTitle.trim(),
      story: newStory.trim(),
      category: newCategory,
      date: 'Hoje, ' + new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }),
      praiseCount: 1,
      hasPraised: true
    };

    setTestimonies(prev => [created, ...prev]);
    setNewTitle('');
    setNewStory('');
    setIsNewTestimonyModalOpen(false);
    showToast('Glória a Deus! Testemunho registrado no mural!');
  };

  const activeDay = NOVENA_DAYS[selectedDayNumber - 1];

  const categoryLabels: Record<TestimonyCategory, { label: string; badge: string }> = {
    cura: { label: 'Cura & Saúde', badge: 'bg-rose-100 text-rose-800 border-rose-300' },
    familia: { label: 'Família & Lar', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
    vocacional: { label: 'Vocacional', badge: 'bg-purple-100 text-purple-800 border-purple-300' },
    conversao: { label: 'Conversão', badge: 'bg-amber-100 text-amber-800 border-amber-300' },
    trabalho: { label: 'Trabalho & Provisão', badge: 'bg-blue-100 text-blue-800 border-blue-300' },
    espiritual: { label: 'Graça Espiritual', badge: 'bg-amber-50 text-[#7B1113] border-[#E5C158]' }
  };

  const filteredTestimonies = selectedCategory === 'todos' 
    ? testimonies 
    : testimonies.filter(t => t.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24 text-[#2C2420]">
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="sticky top-0 z-30 px-4 py-3 bg-[#FAF7F2]/95 border-b border-[#ECE7DF] backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-black/5 active:scale-95 transition cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-[#36070D]" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#7B1113]">
                Padroeira da Célula
              </span>
              <span className="text-[10px] bg-amber-100 text-amber-900 px-1.5 py-0.2 rounded-full font-bold">
                9 Dias
              </span>
            </div>
            <h1 className="text-base font-bold text-[#36070D] tracking-tight">
              Novena & Graças Alcançadas
            </h1>
          </div>
        </div>

        {onNavigateToTerco && (
          <button
            type="button"
            onClick={onNavigateToTerco}
            className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-[#7B1113] hover:bg-amber-200/80 border border-amber-300 text-xs font-bold flex items-center gap-1 cursor-pointer active:scale-95 transition"
            title="Ir para o Terço Virtual"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span className="hidden sm:inline">Rezar Terço</span>
          </button>
        )}
      </header>

      {/* Aba de Navegação: Novena vs Graças Alcançadas */}
      <div className="max-w-md mx-auto px-4 pt-3">
        <div className="bg-white p-1 rounded-2xl border border-[#EDE8E0] shadow-2xs flex">
          <button
            type="button"
            onClick={() => setActiveTab('novena')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'novena'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#70645E] hover:bg-neutral-50'
            }`}
          >
            <Cross className="w-3.5 h-3.5" />
            <span>Novena de Sta. Gemma</span>
            <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-mono">
              {completedDays.length}/9
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('testemunhos')}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'testemunhos'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#70645E] hover:bg-neutral-50'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Graças Alcançadas</span>
            <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-full font-mono font-bold">
              {testimonies.length}
            </span>
          </button>
        </div>
      </div>

      {/* CONTEÚDO DA ABA 1: NOVENA INTERATIVA */}
      {activeTab === 'novena' && (
        <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {/* Card de Progresso dos 9 Dias */}
          <section className="bg-gradient-to-br from-[#7B1113] to-[#4A0A10] text-white rounded-3xl p-4 shadow-md border border-[#E5C158]/50 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFF0BE] font-cinzel">
                  Jornada de Oração
                </span>
                <h2 className="text-base font-bold">Progresso da Novena</h2>
              </div>
              <div className="text-right">
                <span className="text-xl font-bold font-cinzel text-[#E5C158]">
                  {Math.round((completedDays.length / 9) * 100)}%
                </span>
                <span className="block text-[10px] text-white/80">concluído</span>
              </div>
            </div>

            {/* Barra de Progresso */}
            <div className="w-full bg-black/30 rounded-full h-2 mb-4 overflow-hidden p-0.5 border border-white/20">
              <div 
                className="bg-gradient-to-r from-[#E5C158] to-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${(completedDays.length / 9) * 100}%` }}
              />
            </div>

            {/* Grade dos 9 Dias */}
            <div className="grid grid-cols-9 gap-1 text-center">
              {NOVENA_DAYS.map(d => {
                const isSelected = selectedDayNumber === d.dayNumber;
                const isDone = completedDays.includes(d.dayNumber);

                return (
                  <button
                    key={d.dayNumber}
                    type="button"
                    onClick={() => setSelectedDayNumber(d.dayNumber)}
                    className={`py-2 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#E5C158] text-[#36070D] font-bold scale-105 shadow-md ring-2 ring-white'
                        : isDone
                        ? 'bg-white/20 text-[#FFF0BE] font-semibold border border-white/30'
                        : 'bg-black/20 text-white/60 hover:bg-black/30'
                    }`}
                  >
                    <span className="text-[11px] leading-none">D{d.dayNumber}</span>
                    {isDone && <Check className="w-2.5 h-2.5 text-[#E5C158] mt-0.5" />}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Intenção Pessoal da Novena */}
          <section className="bg-white rounded-2xl p-3.5 border border-[#EDE8E0] shadow-2xs space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113]">
                <Heart className="w-3.5 h-3.5 fill-[#7B1113]" />
                <span>Minha Intenção nesta Novena</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (isEditingIntention) {
                    handleSaveIntention();
                  } else {
                    setIsEditingIntention(true);
                  }
                }}
                className="text-[10px] font-bold text-[#7B1113] underline cursor-pointer"
              >
                {isEditingIntention ? 'Salvar' : 'Editar intenção'}
              </button>
            </div>

            {isEditingIntention ? (
              <div className="space-y-2 pt-1">
                <textarea
                  value={personalIntention}
                  onChange={e => setPersonalIntention(e.target.value)}
                  rows={2}
                  className="w-full text-xs p-2 rounded-xl border border-amber-300 focus:outline-none focus:ring-2 focus:ring-[#7B1113] bg-[#FFFDF9]"
                  placeholder="Escreva a graça que você suplica por intercessão de Santa Gemma..."
                />
                <button
                  type="button"
                  onClick={handleSaveIntention}
                  className="px-3 py-1 bg-[#7B1113] text-white text-[11px] font-bold rounded-lg cursor-pointer"
                >
                  Confirmar Intenção
                </button>
              </div>
            ) : (
              <p className="text-xs text-[#554741] italic leading-relaxed">
                "{personalIntention}"
              </p>
            )}
          </section>

          {/* Oração Preparatória Diária */}
          <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-3.5 text-xs text-[#554741] space-y-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 font-cinzel font-bold text-[#855D08] text-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Oração Preparatória (Para todos os dias)</span>
            </div>
            <p className="italic leading-relaxed font-serif text-[11px] text-[#4A3D36]">
              "Ó Santa Gemma, que em vossa curta vida terrena fostes um espelho resplandecente de pureza, amor à Cruz e intimidade com Jesus na Eucaristia, volvei vosso olhar maternal e amigo para a nossa Célula. Apresentai ao Coração de Cristo as nossas súplicas, para que, inflamados do mesmo amor que vos consumiu, vivamos santamente cada dia. Por Cristo, Nosso Senhor. Amém."
            </p>
          </section>

          {/* Conteúdo do Dia Selecionado */}
          <section className="bg-white rounded-3xl p-5 border border-[#E8E1D5] shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-[#ECE7DF] pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#7B1113] font-cinzel">
                  Dia {activeDay.dayNumber} de 9
                </span>
                <h2 className="text-base font-bold text-[#241E1C]">
                  {activeDay.title}
                </h2>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                {activeDay.theme}
              </span>
            </div>

            {/* Palavra da Sagrada Escritura */}
            <div className="bg-[#FFFDF9] p-3 rounded-2xl border-l-4 border-[#7B1113] border-t border-r border-b border-[#EDE8E0] space-y-1">
              <span className="text-[10px] font-bold text-[#7B1113] uppercase font-cinzel">
                Palavra de Deus
              </span>
              <p className="text-xs italic font-serif text-[#3A302B] leading-relaxed">
                "{activeDay.scripture}"
              </p>
            </div>

            {/* Meditação Espiritual */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#36070D] uppercase font-cinzel">
                Meditação do Dia
              </h3>
              <p className="text-xs text-[#554741] leading-relaxed">
                {activeDay.meditacao}
              </p>
            </div>

            {/* Palavra de Santa Gemma */}
            <div className="bg-gradient-to-r from-rose-50 to-orange-50 p-3.5 rounded-2xl border border-rose-200/80 space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#7B1113] font-cinzel">
                <Flame className="w-3.5 h-3.5 text-rose-600" />
                <span>Palavra Viva de Santa Gemma:</span>
              </div>
              <p className="text-xs italic text-[#554741] font-serif leading-relaxed">
                {activeDay.gemmaQuote}
              </p>
            </div>

            {/* Oração do Dia */}
            <div className="space-y-1.5">
              <h3 className="text-xs font-bold text-[#36070D] uppercase font-cinzel">
                Oração Específica
              </h3>
              <p className="text-xs text-[#4A3D36] font-serif leading-relaxed bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE8E0]">
                "{activeDay.prayer}"
              </p>
            </div>

            {/* Propósito / Gesto Prático do Dia */}
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 space-y-1">
              <strong className="block font-bold">Propósito da Célula para Hoje:</strong>
              <p>{activeDay.intentionPrompt}</p>
            </div>

            {/* Jaculatória & Pai Nosso, Ave Maria, Glória */}
            <div className="text-center text-xs text-[#70645E] pt-2 border-t border-[#ECE7DF]">
              <p className="font-semibold italic text-[#7B1113]">
                "Santa Gemma Galgani, lírio da Paixão de Cristo, rogai por nós e por nossa célula!"
              </p>
              <p className="text-[11px] text-[#8A7C75] mt-1">
                (Rezar 1 Pai Nosso, 1 Ave Maria e 1 Glória ao Pai)
              </p>
            </div>

            {/* Botão de Marcar como Concluído */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => toggleDayCompleted(activeDay.dayNumber)}
                className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                  completedDays.includes(activeDay.dayNumber)
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-[#7B1113] text-white hover:bg-[#580C14] border border-[#E5C158]/50'
                }`}
              >
                {completedDays.includes(activeDay.dayNumber) ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>Dia {activeDay.dayNumber} Concluído! (Clique para desmarcar)</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4 text-[#FFF0BE]" />
                    <span>Concluir Oração do Dia {activeDay.dayNumber}</span>
                  </>
                )}
              </button>
            </div>
          </section>
        </main>
      )}

      {/* CONTEÚDO DA ABA 2: MURAL DE GRAÇAS ALCANÇADAS */}
      {activeTab === 'testemunhos' && (
        <main className="max-w-md mx-auto px-4 pt-4 space-y-4">
          {/* Banner de Acolhimento e Registro */}
          <section className="bg-gradient-to-br from-[#7B1113] to-[#4A0A10] text-white rounded-3xl p-4 shadow-md border border-[#E5C158]/40 relative overflow-hidden">
            <div className="relative z-10 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FFF0BE] font-cinzel">
                  Mural de Bênçãos
                </span>
                <h2 className="text-base font-bold">Graças & Testemunhos</h2>
                <p className="text-xs text-[#FFF0BE]/90 mt-0.5 max-w-[240px]">
                  "O Senhor fez por nós grandes coisas e por isso estamos alegres!" (Sl 125)
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsNewTestimonyModalOpen(true)}
                className="px-3 py-2 rounded-2xl bg-[#E5C158] text-[#36070D] font-bold text-xs shadow-md hover:bg-yellow-400 active:scale-95 transition flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Testemunhar</span>
              </button>
            </div>
          </section>

          {/* Filtro por Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setSelectedCategory('todos')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === 'todos'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-white text-[#70645E] border border-[#EDE8E0] hover:bg-neutral-50'
              }`}
            >
              Todas as Graças ({testimonies.length})
            </button>
            {(Object.keys(categoryLabels) as TestimonyCategory[]).map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#7B1113] text-white shadow-xs'
                    : 'bg-white text-[#70645E] border border-[#EDE8E0] hover:bg-neutral-50'
                }`}
              >
                {categoryLabels[cat].label}
              </button>
            ))}
          </div>

          {/* Lista de Testemunhos */}
          <div className="space-y-3">
            {filteredTestimonies.map(item => {
              const catInfo = categoryLabels[item.category] || categoryLabels.espiritual;

              return (
                <article
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-[#ECE7DF] shadow-2xs space-y-3 hover:border-amber-300 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${catInfo.badge}`}>
                        {catInfo.label}
                      </span>
                      <h3 className="text-sm font-bold text-[#241E1C] mt-1.5 leading-snug">
                        {item.title}
                      </h3>
                    </div>
                    <span className="text-[10px] text-[#70645E] whitespace-nowrap font-medium">
                      {item.date}
                    </span>
                  </div>

                  <p className="text-xs text-[#554741] leading-relaxed italic font-serif bg-[#FAF8F5] p-3 rounded-2xl border border-[#EDE8E0]/70">
                    "{item.story}"
                  </p>

                  <div className="flex items-center justify-between pt-1 border-t border-[#F2ECE4] text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-[#7B1113] text-[#FFF0BE] flex items-center justify-center font-bold text-[10px]">
                        {item.authorName.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-[#36070D]">
                        {item.authorName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleShareTestimony(item)}
                        className="p-1.5 rounded-lg text-[#70645E] hover:text-[#7B1113] hover:bg-neutral-100 transition cursor-pointer"
                        title="Compartilhar no WhatsApp"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePraise(item.id)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold transition cursor-pointer active:scale-95 ${
                          item.hasPraised
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-neutral-100 text-[#70645E] hover:bg-neutral-200'
                        }`}
                      >
                        <Flame className={`w-3.5 h-3.5 ${item.hasPraised ? 'text-amber-600 fill-amber-600' : 'text-neutral-400'}`} />
                        <span>Glória a Deus!</span>
                        <span className="font-mono text-[11px] ml-0.5">{item.praiseCount}</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredTestimonies.length === 0 && (
              <div className="text-center py-10 bg-white rounded-3xl border border-dashed border-[#ECE7DF] p-6 space-y-2">
                <Sparkles className="w-8 h-8 text-neutral-300 mx-auto" />
                <h4 className="text-sm font-bold text-[#36070D]">Nenhum testemunho nesta categoria</h4>
                <p className="text-xs text-[#70645E]">
                  Seja o primeiro a partilhar uma bênção alcançada com os irmãos!
                </p>
                <button
                  type="button"
                  onClick={() => setIsNewTestimonyModalOpen(true)}
                  className="mt-2 px-4 py-2 bg-[#7B1113] text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Registrar Testemunho
                </button>
              </div>
            )}
          </div>
        </main>
      )}

      {/* Modal para Adicionar Novo Testemunho */}
      <Modal
        isOpen={isNewTestimonyModalOpen}
        onClose={() => setIsNewTestimonyModalOpen(false)}
        title="Registrar Graça Alcançada"
      >
        <form onSubmit={handleCreateTestimony} className="space-y-3.5">
          <p className="text-xs text-[#70645E] leading-relaxed">
            Partilhe com a Célula Santa Gemma uma bênção, milagre ou resposta de oração para a maior glória de Deus e edificação da fé dos irmãos.
          </p>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Título da Graça *
            </label>
            <input
              type="text"
              required
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="Ex: Cura de uma dor crônica / Paz na família"
              className="w-full text-xs p-2.5 rounded-xl border border-[#EDE8E0] focus:ring-2 focus:ring-[#7B1113] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Categoria
              </label>
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value as TestimonyCategory)}
                className="w-full text-xs p-2.5 rounded-xl border border-[#EDE8E0] bg-white focus:ring-2 focus:ring-[#7B1113] focus:outline-none"
              >
                <option value="cura">Cura & Saúde</option>
                <option value="familia">Família & Lar</option>
                <option value="vocacional">Vocacional</option>
                <option value="conversao">Conversão</option>
                <option value="trabalho">Trabalho & Provisão</option>
                <option value="espiritual">Graça Espiritual</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Seu Nome (ou anônimo)
              </label>
              <input
                type="text"
                value={newAuthorName}
                onChange={e => setNewAuthorName(e.target.value)}
                placeholder="Ex: Lucas / Uma irmã da célula"
                className="w-full text-xs p-2.5 rounded-xl border border-[#EDE8E0] focus:ring-2 focus:ring-[#7B1113] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Relato da Bênção *
            </label>
            <textarea
              required
              value={newStory}
              onChange={e => setNewStory(e.target.value)}
              rows={4}
              placeholder="Conte como aconteceu a oração, a intercessão de Santa Gemma e a graça que Deus operou..."
              className="w-full text-xs p-2.5 rounded-xl border border-[#EDE8E0] focus:ring-2 focus:ring-[#7B1113] focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsNewTestimonyModalOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#EDE8E0] text-xs font-bold text-[#70645E] hover:bg-neutral-50 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-sm hover:bg-[#580C14] transition cursor-pointer"
            >
              Publicar Graça
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
