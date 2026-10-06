import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Heart, 
  Share2, 
  CheckCircle2, 
  BookOpen, 
  Vibrate, 
  SlidersHorizontal,
  Flame,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { soundManager, vibrateDevice } from '../utils/audioEffects';
import { RosaryType, RosaryMysteryGroup } from '../types';

interface TercoVirtualProps {
  onBack: () => void;
  cellIntention?: string;
}

// Mistérios do Rosário Mariano
const MISTERIOS = {
  gozosos: {
    nome: 'Mistérios Gozosos',
    dias: 'Segundas-feiras e Sábados',
    cor: 'from-amber-600 to-amber-800',
    itens: [
      {
        num: 1,
        titulo: 'A Anunciação do Anjo a Nossa Senhora e Encarnação do Verbo',
        fruto: 'Humildade e abandono à Vontade de Deus',
        biblia: 'Lc 1, 38: "Eis aqui a serva do Senhor; faça-se em mim segundo a tua palavra."',
        meditacao: 'Como Maria e Santa Gemma, pedimos a graça de dar nosso "sim" incondicional aos planos do Pai em nossa célula.'
      },
      {
        num: 2,
        titulo: 'A Visitação de Nossa Senhora a Santa Isabel',
        fruto: 'Caridade fraterna e solicitude com os irmãos',
        biblia: 'Lc 1, 41: "Quando Isabel ouviu a saudação de Maria, a criança estremeceu no seu seio."',
        meditacao: 'Rezamos para que nossa célula transborde caridade e vá ao encontro dos mais necessitados e dos doentes.'
      },
      {
        num: 3,
        titulo: 'O Nascimento de Jesus na Gruta de Belém',
        fruto: 'Espírito de pobreza e desprendimento',
        biblia: 'Lc 2, 7: "E deu à luz o seu primogênito, envolveu-o em faixas e o deitou numa manjedoura."',
        meditacao: 'Que o Menino Jesus nasça no coração de cada jovem e família de nossa comunidade.'
      },
      {
        num: 4,
        titulo: 'A Apresentação do Menino Jesus no Templo',
        fruto: 'Pureza de coração e obediência à Igreja',
        biblia: 'Lc 2, 22: "Levaram Jesus a Jerusalém para apresentá-lo ao Senhor."',
        meditacao: 'Oferecemos nossa vida e nossos carismas no altar do Senhor para servir a Santa Igreja.'
      },
      {
        num: 5,
        titulo: 'A Perda e o Encontro do Menino Jesus no Templo',
        fruto: 'Paciência e zelo na busca das coisas de Deus',
        biblia: 'Lc 2, 49: "Não sabíeis que me cumpre ocupar das coisas de meu Pai?"',
        meditacao: 'Pedimos a perseverança na oração diária e a fidelidade espiritual para nunca nos afastarmos de Cristo.'
      }
    ]
  },
  dolorosos: {
    nome: 'Mistérios Dolorosos',
    dias: 'Terças e Sextas-feiras',
    cor: 'from-rose-800 to-[#4A0A10]',
    itens: [
      {
        num: 1,
        titulo: 'A Agonia de Jesus no Horto das Oliveiras',
        fruto: 'Contrição sincera dos pecados e oração na tribulação',
        biblia: 'Mt 26, 39: "Meu Pai, se é possível, afasta de mim este cálice; todavia, não seja como eu quero, mas como Tu queres."',
        meditacao: 'Santa Gemma passou noites no Jardim do Getsêmani místico com Jesus; rezamos pela consolação de Cristo.'
      },
      {
        num: 2,
        titulo: 'A Flagelação de Nosso Senhor Jesus Cristo',
        fruto: 'Mortificação dos sentidos e pureza do corpo',
        biblia: 'Jo 19, 1: "Pilatos tomou então a Jesus e mandou flagelá-lo."',
        meditacao: 'Pelos sofrimentos de Jesus, pedimos a cura de todos os vícios e a purificação de nossos sentimentos.'
      },
      {
        num: 3,
        titulo: 'A Coroação de Espinhos de Nosso Senhor',
        fruto: 'Vitória contra o orgulho e paciência nas humilhações',
        biblia: 'Mt 27, 29: "Teceram uma coroa de espinhos e puseram-lha na cabeça."',
        meditacao: 'Que as ofensas e zombarias que enfrentamos pelo Evangelho se transformem em flores de amor a Deus.'
      },
      {
        num: 4,
        titulo: 'O Caminho do Calvário carregando a Santa Cruz',
        fruto: 'Paciência nas cruzes cotidianas',
        biblia: 'Lc 23, 26: "Tomaram um certo Simão de Cirene... e puseram-lhe a cruz sobre os ombros."',
        meditacao: 'Sejamos cireneus uns para os outros em nossa célula, carregando fraternalmente os fardos dos irmãos.'
      },
      {
        num: 5,
        titulo: 'A Crucificação e Morte de Nosso Senhor Jesus Cristo',
        fruto: 'Amor supremo e salvação das almas',
        biblia: 'Jo 19, 30: "Jesus disse: Tudo está consumado! E, inclinando a cabeça, entregou o espírito."',
        meditacao: 'Aos pés da Cruz, como Gemma e Nossa Senhora, renovamos nossa entrega total por amor a Cristo e à Igreja.'
      }
    ]
  },
  gloriosos: {
    nome: 'Mistérios Gloriosos',
    dias: 'Quartas-feiras e Domingos',
    cor: 'from-amber-500 to-yellow-700',
    itens: [
      {
        num: 1,
        titulo: 'A Triunfante Ressurreição de Nosso Senhor Jesus Cristo',
        fruto: 'Fé viva e renovação espiritual',
        biblia: 'Mc 16, 6: "Não vos assusteis! Buscais a Jesus Nazareno, o crucificado? Ele ressuscitou!"',
        meditacao: 'A esperança cristã não morre. A vitória de Cristo sobre a morte renova a juventude da nossa célula.'
      },
      {
        num: 2,
        titulo: 'A Gloriosa Ascensão de Jesus ao Céu',
        fruto: 'Desejo ardente do Céu e esperança cristã',
        biblia: 'At 1, 9: "À vista deles, Jesus foi elevado e uma nuvem o ocultou a seus olhos."',
        meditacao: 'Nossa pátria definitiva é o Céu; colocamos nossas aspirações na eternidade.'
      },
      {
        num: 3,
        titulo: 'A Descida do Espírito Santo em Pentecostes',
        fruto: 'Efusão do Espírito Santo, carismas e ardor apostólico',
        biblia: 'At 2, 4: "Ficaram todos cheios do Espírito Santo e começaram a falar em outras línguas."',
        meditacao: 'Clamamos um novo Pentecostes sobre a Célula Santa Gemma, renovando nossos dons e ousadia na evangelização.'
      },
      {
        num: 4,
        titulo: 'A Assunção de Nossa Senhora ao Céu em Corpo e Alma',
        fruto: 'Graça de uma santa morte e devoção filial à Virgem',
        biblia: 'Ct 2, 10: "Levanta-te, amiga minha, formosa minha, e vem!"',
        meditacao: 'Maria nos acolhe em seu colo materno e nos atrai para o coração da Trindade Santa.'
      },
      {
        num: 5,
        titulo: 'A Coroação de Nossa Senhora como Rainha do Céu e da Terra',
        fruto: 'Confiança na intercessão de Maria e perseverança final',
        biblia: 'Ap 12, 1: "Uma mulher vestida de sol, tendo a lua debaixo dos seus pés e na cabeça uma coroa de doze estrelas."',
        meditacao: 'Consagramos nossos lares, nossa cidade e nossa comunidade sob o manto soberano de Maria Santíssima.'
      }
    ]
  },
  luminosos: {
    nome: 'Mistérios Luminosos',
    dias: 'Quintas-feiras',
    cor: 'from-blue-600 to-cyan-800',
    itens: [
      {
        num: 1,
        titulo: 'O Batismo de Jesus no Rio Jordão',
        fruto: 'Fidelidade às promessas batismais',
        biblia: 'Mt 3, 17: "Este é o meu Filho muito amado, em quem pus toda a minha afeição."',
        meditacao: 'Renovamos nosso chamado batismal a sermos luz do mundo e sal da terra.'
      },
      {
        num: 2,
        titulo: 'A Auto-revelação de Jesus nas Bodas de Caná',
        fruto: 'Confiança em Maria e santificação das famílias',
        biblia: 'Jo 2, 5: "Fazei tudo o que Ele vos disser."',
        meditacao: 'Pedimos para que o vinho novo da alegria e do amor nunca falte nas famílias de nossa célula.'
      },
      {
        num: 3,
        titulo: 'O Anúncio do Reino de Deus e Convite à Conversão',
        fruto: 'Arrependimento e vida em santidade',
        biblia: 'Mc 1, 15: "O tempo está cumprido e o Reino de Deus está próximo. Arrependei-vos e crede no Evangelho."',
        meditacao: 'Rezamos para que nossa célula seja porto seguro de conversão e acolhimento dos que sofrem.'
      },
      {
        num: 4,
        titulo: 'A Transfiguração de Nosso Senhor no Monte Tabor',
        fruto: 'Desejo de contemplação e intimidade com Deus',
        biblia: 'Lc 9, 29: "Enquanto orava, a aparência do seu rosto se modificou e sua veste tornou-se de um branco resplandecente."',
        meditacao: 'Que nossos encontros de oração sejam verdadeiros Montes Tabores de encontro real com Jesus.'
      },
      {
        num: 5,
        titulo: 'A Instituição da Santíssima Eucaristia na Última Ceia',
        fruto: 'Amor ardente pela Missa e adoração perpétua',
        biblia: 'Lc 22, 19: "Isto é o meu corpo, que é dado por vós; fazei isto em memória de mim."',
        meditacao: 'Como Santa Gemma, que passava horas inflamada diante do Sacrário, pedimos loucura de amor pelo Santíssimo.'
      }
    ]
  }
};

// Terço de Santa Gemma Galgani (Cinco Chagas de Cristo)
const CHAGAS_GEMMA = [
  {
    num: 1,
    titulo: '1ª Dezena: Chaga da Mão Esquerda de Jesus',
    invocacao: 'Pelos méritos de Vossa mão cravada por amor, concedei-nos a pureza de coração.',
    oracaoGrande: 'Eterno Pai, pelo amor inefável que Santa Gemma teve à Cruz de Vosso Filho, oferecemos a Chaga da Mão Esquerda de Jesus por todos os jovens que buscam a castidade e a santidade.',
    oracaoPequena: 'Pelas santas Chagas de Jesus e intercessão de Santa Gemma, fazei-nos amar a Cruz com alegria.'
  },
  {
    num: 2,
    titulo: '2ª Dezena: Chaga da Mão Direita de Jesus',
    invocacao: 'Pela Vossa mão direita abençoadora, protegei e fortalecei a nossa Célula.',
    oracaoGrande: 'Eterno Pai, oferecemos a Chaga da Mão Direita de Jesus em reparação pelas ofensas contra a Santíssima Eucaristia e pelo ardor missionário dos consagrados e da Comunidade Shalom.',
    oracaoPequena: 'Pelas santas Chagas de Jesus e intercessão de Santa Gemma, inflamai nosso coração no fogo da Eucaristia.'
  },
  {
    num: 3,
    titulo: '3ª Dezena: Chaga do Pé Esquerdo de Jesus',
    invocacao: 'Pelos Vossos passos ensanguentados rumo ao Calvário, guiai nossos caminhos.',
    oracaoGrande: 'Eterno Pai, oferecemos a Chaga do Pé Esquerdo de Jesus pelas famílias em conflito, pelos enfermos graves e por aqueles que perderam a esperança na vida comunitária.',
    oracaoPequena: 'Pelas santas Chagas de Jesus e intercessão de Santa Gemma, dai alívio aos doentes e paz às famílias.'
  },
  {
    num: 4,
    titulo: '4ª Dezena: Chaga do Pé Direito de Jesus',
    invocacao: 'Pelo Vosso sacrifício supremo, acolhei os moribundos e as almas do Purgatório.',
    oracaoGrande: 'Eterno Pai, pelo Anjo da Guarda que socorria Santa Gemma em seus combates espirituais, oferecemos a Chaga do Pé Direito de Jesus pela conversão urgente de nossos amigos e parentes.',
    oracaoPequena: 'Pelas santas Chagas de Jesus e auxílio de nossos Anjos da Guarda, livrai-nos de toda cilada do maligno.'
  },
  {
    num: 5,
    titulo: '5ª Dezena: Chaga do Sagrado Lado e Coração de Jesus',
    invocacao: 'Do Vosso Coração aberto brotam sangue e água, fonte inesgotável de misericórdia.',
    oracaoGrande: 'Eterno Pai, diante do Coração trespassado de Jesus, pedimos com Santa Gemma: "Jesus, fazei que eu Vos ame com o mesmo amor com que Vós me amastes!". Que a nossa Célula viva o carisma da Paz e o holocausto por amor.',
    oracaoPequena: 'Sagrado Coração de Jesus, ferido por amor, fazei o nosso coração semelhante ao Vosso.'
  }
];

export const TercoVirtual: React.FC<TercoVirtualProps> = ({ 
  onBack,
  cellIntention = 'Pela fidelidade dos irmãos da Célula Santa Gemma Galgani, frutos vocacionais e paz nas famílias.'
}) => {
  // Estado de tipo de terço
  const [rosaryType, setRosaryType] = useState<RosaryType>('mariano');
  
  // Detecta mistério de hoje
  const getTodayMysteryGroup = (): RosaryMysteryGroup => {
    const day = new Date().getDay();
    if (day === 1 || day === 6) return 'gozosos'; // Seg e Sáb
    if (day === 2 || day === 5) return 'dolorosos'; // Ter e Sex
    if (day === 4) return 'luminosos'; // Quinta
    return 'gloriosos'; // Quarta e Domingo
  };

  const [selectedGroup, setSelectedGroup] = useState<RosaryMysteryGroup>(getTodayMysteryGroup());
  
  // Controles de oração
  // 0 = Preparação (Sinal da Cruz, Creio, Pai Nosso inicial, 3 Ave-Marias, Glória)
  // 1 a 5 = As 5 dezenas (cada uma com 1 conta grande + 10 contas pequenas)
  // 6 = Oração final (Salve Rainha / Agradecimento)
  const [currentDecade, setCurrentDecade] = useState<number>(1);
  const [currentBead, setCurrentBead] = useState<number>(1); // 0 = Conta Grande (Pai Nosso), 1 a 10 = Contas pequenas (Ave Maria)
  const [isIntroStage, setIsIntroStage] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [isFocusMode, setIsFocusMode] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(soundManager.isEnabled());
  const [hapticActive, setHapticActive] = useState<boolean>(true);
  const [largeFont, setLargeFont] = useState<boolean>(false);
  const [customIntention, setCustomIntention] = useState<string>(cellIntention);
  const [isEditingIntention, setIsEditingIntention] = useState<boolean>(false);

  // Sincroniza som
  const handleToggleSound = () => {
    const enabled = soundManager.toggleSound();
    setSoundActive(enabled);
    if (enabled) {
      soundManager.playSacredBell(659.25);
    }
  };

  // Avançar conta
  const nextBead = () => {
    if (hapticActive) vibrateDevice(25);
    soundManager.playBeadClick();

    if (currentBead < 10) {
      setCurrentBead(prev => prev + 1);
      // Se completou a 10ª conta, toca o sino do fim da dezena
      if (currentBead === 9) {
        soundManager.playSacredBell(523.25);
        if (hapticActive) vibrateDevice([30, 60, 30]);
      }
    } else {
      // Avança a dezena
      if (currentDecade < 5) {
        setCurrentDecade(prev => prev + 1);
        setCurrentBead(0); // vai para o Pai Nosso da nova dezena
        soundManager.playSacredBell(587.33);
      } else {
        // Terço Concluído!
        setIsCompleted(true);
        soundManager.playSacredBell(659.25);
        if (hapticActive) vibrateDevice([50, 100, 150]);
      }
    }
  };

  // Voltar conta
  const prevBead = () => {
    if (hapticActive) vibrateDevice(15);
    if (currentBead > 0) {
      setCurrentBead(prev => prev - 1);
    } else if (currentDecade > 1) {
      setCurrentDecade(prev => prev - 1);
      setCurrentBead(10);
    }
  };

  // Reiniciar terço
  const resetRosary = () => {
    setCurrentDecade(1);
    setCurrentBead(1);
    setIsCompleted(false);
    soundManager.playSacredBell(440);
  };

  // Ir direto para uma dezena
  const jumpToDecade = (dec: number) => {
    setCurrentDecade(dec);
    setCurrentBead(1);
    soundManager.playBeadClick();
  };

  // Dados do mistério atual
  const activeMysteryData = MISTERIOS[selectedGroup].itens[currentDecade - 1];
  const activeGemmaChaga = CHAGAS_GEMMA[currentDecade - 1];

  // Texto da oração atual
  const getPrayerDetails = () => {
    if (rosaryType === 'mariano') {
      if (currentBead === 0) {
        return {
          title: 'Pai Nosso (Conta Grande)',
          body: 'Pai Nosso que estais nos Céus, santificado seja o Vosso Nome, venha a nós o Vosso Reino, seja feita a Vossa vontade assim na Terra como no Céu. O pão nosso de cada dia nos dai hoje; perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.',
          badge: 'Dezena ' + currentDecade + ' • Pai Nosso'
        };
      }
      return {
        title: `Ave Maria (${currentBead} de 10)`,
        body: 'Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora de nossa morte. Amém.',
        badge: `Dezena ${currentDecade} • Conta ${currentBead}/10`
      };
    } else if (rosaryType === 'santa_gemma') {
      if (currentBead === 0) {
        return {
          title: 'Oferecimento da Chaga (Conta Grande)',
          body: activeGemmaChaga.oracaoGrande,
          badge: `Chaga ${currentDecade} de 5`
        };
      }
      return {
        title: `Invocação a Santa Gemma (${currentBead} de 10)`,
        body: activeGemmaChaga.oracaoPequena,
        badge: `Chaga ${currentDecade} • Invocação ${currentBead}/10`
      };
    } else {
      // Misericórdia
      if (currentBead === 0) {
        return {
          title: 'Eterno Pai (Conta Grande)',
          body: 'Eterno Pai, eu Vos ofereço o Corpo e Sangue, a Alma e Divindade de Vosso diletíssimo Filho, Nosso Senhor Jesus Cristo, em expiação dos nossos pecados e dos do mundo inteiro.',
          badge: `Dezena ${currentDecade} de 5`
        };
      }
      return {
        title: `Pela Sua dolorosa Paixão (${currentBead} de 10)`,
        body: 'Pela Sua dolorosa Paixão, tende misericórdia de nós e do mundo inteiro.',
        badge: `Dezena ${currentDecade} • Conta ${currentBead}/10`
      };
    }
  };

  const currentPrayer = getPrayerDetails();

  return (
    <div className={`min-h-screen bg-[#FAF7F2] pb-24 text-[#2C2420] transition-all duration-300 ${isFocusMode ? 'fixed inset-0 z-50 overflow-y-auto bg-black text-white' : ''}`}>
      {/* Top Header */}
      <header className={`sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-md flex items-center justify-between transition-colors ${
        isFocusMode 
          ? 'bg-neutral-900/90 border-neutral-800 text-white' 
          : 'bg-[#FAF7F2]/90 border-[#ECE7DF] text-[#36070D]'
      }`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-black/5 active:scale-95 transition cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-cinzel text-xs font-bold uppercase tracking-wider text-[#7B1113]">
                Devocionário Interativo
              </span>
              <span className="text-[10px] bg-[#E5C158]/30 text-[#855D08] px-1.5 py-0.2 rounded-full font-bold">
                Ao Vivo
              </span>
            </div>
            <h1 className="text-base font-bold tracking-tight">
              {rosaryType === 'mariano' && 'Santo Rosário Mariano'}
              {rosaryType === 'santa_gemma' && 'Terço de Santa Gemma'}
              {rosaryType === 'misericordia' && 'Terço da Misericórdia'}
            </h1>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-xl transition cursor-pointer ${
              soundActive 
                ? (isFocusMode ? 'bg-neutral-800 text-[#E5C158]' : 'bg-amber-100 text-amber-900') 
                : 'text-neutral-400 hover:bg-black/5'
            }`}
            title={soundActive ? 'Som ativado (Sinos sacros)' : 'Som mutado'}
          >
            {soundActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setHapticActive(!hapticActive)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              hapticActive 
                ? (isFocusMode ? 'bg-neutral-800 text-emerald-400' : 'bg-emerald-50 text-emerald-800') 
                : 'text-neutral-400'
            }`}
            title={hapticActive ? 'Vibração ativada' : 'Vibração desativada'}
          >
            <Vibrate className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => setIsFocusMode(!isFocusMode)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isFocusMode ? 'bg-[#7B1113] text-white' : 'hover:bg-black/5 text-[#554741]'
            }`}
            title={isFocusMode ? 'Sair do modo foco' : 'Modo Foco / Noturno'}
          >
            {isFocusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Seletor do Tipo de Terço */}
        {!isFocusMode && (
          <div className="bg-white/80 backdrop-blur-sm p-1.5 rounded-2xl border border-[#EDE8E0] shadow-2xs flex gap-1">
            <button
              type="button"
              onClick={() => { setRosaryType('mariano'); resetRosary(); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                rosaryType === 'mariano'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#70645E] hover:bg-neutral-100'
              }`}
            >
              Rosário Mariano
            </button>
            <button
              type="button"
              onClick={() => { setRosaryType('santa_gemma'); resetRosary(); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                rosaryType === 'santa_gemma'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#70645E] hover:bg-neutral-100'
              }`}
            >
              Sta. Gemma (Chagas)
            </button>
            <button
              type="button"
              onClick={() => { setRosaryType('misericordia'); resetRosary(); }}
              className={`flex-1 py-2 px-1 text-center rounded-xl text-xs font-bold transition cursor-pointer ${
                rosaryType === 'misericordia'
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'text-[#70645E] hover:bg-neutral-100'
              }`}
            >
              Misericórdia
            </button>
          </div>
        )}

        {/* Escolha do Mistério Mariano se estiver em Terço Mariano */}
        {rosaryType === 'mariano' && !isFocusMode && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl p-3 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-[#855D08] uppercase tracking-wider font-cinzel">
                Mistérios de Hoje: {MISTERIOS[getTodayMysteryGroup()].nome}
              </span>
              <span className="text-[10px] text-amber-900 bg-amber-200/60 px-2 py-0.5 rounded-full font-medium">
                {MISTERIOS[selectedGroup].dias.split(' ')[0]}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1.5 text-center">
              {(['gozosos', 'dolorosos', 'gloriosos', 'luminosos'] as RosaryMysteryGroup[]).map(grp => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => { setSelectedGroup(grp); resetRosary(); }}
                  className={`py-1.5 px-1 rounded-xl text-[11px] font-bold capitalize transition border cursor-pointer ${
                    selectedGroup === grp
                      ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-xs'
                      : 'bg-white/80 text-[#70645E] border-amber-200/60 hover:bg-white'
                  }`}
                >
                  {grp}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Card do Mistério / Invocação em Destaque */}
        <div className={`rounded-2xl p-4 transition-all border shadow-sm ${
          isFocusMode 
            ? 'bg-neutral-900 border-neutral-800 text-neutral-100' 
            : 'bg-white border-[#E8E1D5]'
        }`}>
          <div className="flex items-center justify-between text-xs text-[#70645E] mb-1.5">
            <span className={`font-cinzel font-bold text-xs uppercase ${isFocusMode ? 'text-[#E5C158]' : 'text-[#7B1113]'}`}>
              {rosaryType === 'mariano' && `${currentDecade}º Mistério ${selectedGroup.charAt(0).toUpperCase() + selectedGroup.slice(1)}`}
              {rosaryType === 'santa_gemma' && `Chaga ${currentDecade} de 5`}
              {rosaryType === 'misericordia' && `Dezena ${currentDecade} de 5`}
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 font-medium">
              Dezena {currentDecade} de 5
            </span>
          </div>

          <h2 className="text-sm font-bold leading-snug">
            {rosaryType === 'mariano' && activeMysteryData.titulo}
            {rosaryType === 'santa_gemma' && activeGemmaChaga.titulo}
            {rosaryType === 'misericordia' && 'Pela Salvação das Almas e dos Enfermos'}
          </h2>

          {rosaryType === 'mariano' && (
            <div className="mt-2 space-y-1.5 text-xs text-[#554741] dark:text-neutral-300">
              <div className="italic text-[#7B1113] dark:text-amber-300/90 font-serif bg-amber-500/10 p-2 rounded-xl border border-amber-400/20">
                {activeMysteryData.biblia}
              </div>
              <p className="leading-relaxed pt-0.5">
                <strong className="text-[#2C2420] dark:text-neutral-200">Fruto Espiritual:</strong> {activeMysteryData.fruto}
              </p>
              <p className="text-[11px] text-[#70645E] dark:text-neutral-400">
                {activeMysteryData.meditacao}
              </p>
            </div>
          )}

          {rosaryType === 'santa_gemma' && (
            <div className="mt-2 text-xs italic text-[#7B1113] dark:text-amber-300/90 bg-rose-500/10 p-2 rounded-xl border border-rose-300/30">
              "{activeGemmaChaga.invocacao}"
            </div>
          )}
        </div>

        {/* Visualização Tátil das Contas (Rosary Interactive Beads) */}
        <div className={`p-4 rounded-3xl border shadow-md text-center transition-all ${
          isFocusMode 
            ? 'bg-neutral-900 border-neutral-800' 
            : 'bg-gradient-to-b from-white to-[#F9F6F0] border-[#E8E1D5]'
        }`}>
          {/* Seletor rápido de dezenas */}
          <div className="flex items-center justify-center gap-1.5 mb-3">
            {[1, 2, 3, 4, 5].map(dec => (
              <button
                key={dec}
                type="button"
                onClick={() => jumpToDecade(dec)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  currentDecade === dec
                    ? 'bg-[#7B1113] text-[#FFF0BE] scale-110 shadow-sm border border-[#E5C158]'
                    : dec < currentDecade
                    ? 'bg-amber-100 text-amber-900 border border-amber-200'
                    : 'bg-neutral-100 text-neutral-400'
                }`}
              >
                {dec}
              </button>
            ))}
          </div>

          {/* Conta Grande: Pai Nosso */}
          <div className="flex flex-col items-center mb-3">
            <button
              type="button"
              onClick={() => {
                setCurrentBead(0);
                if (hapticActive) vibrateDevice(30);
                soundManager.playSacredBell(440);
              }}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                currentBead === 0
                  ? 'bg-amber-500 text-white scale-105 shadow-md ring-4 ring-amber-300/40 animate-pulse'
                  : 'bg-amber-100 text-amber-900 hover:bg-amber-200/80 border border-amber-300'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#FFF0BE]" />
              <span>Conta Grande • {rosaryType === 'mariano' ? 'Pai Nosso' : 'Oferecimento'}</span>
            </button>
          </div>

          {/* Grade das 10 Contas Pequenas (Ave-Marias) */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 px-1 py-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(bead => {
              const isPassed = bead < currentBead;
              const isCurrent = bead === currentBead;

              return (
                <button
                  key={bead}
                  type="button"
                  onClick={() => {
                    setCurrentBead(bead);
                    if (hapticActive) vibrateDevice(25);
                    soundManager.playBeadClick();
                  }}
                  className={`h-11 rounded-2xl flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                    isCurrent
                      ? 'bg-gradient-to-tr from-[#7B1113] to-[#A31619] text-[#FFF0BE] font-bold shadow-lg scale-105 ring-4 ring-[#E5C158]/60'
                      : isPassed
                      ? 'bg-amber-100 text-amber-900 border border-amber-300/60 font-semibold'
                      : isFocusMode
                      ? 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                      : 'bg-white text-neutral-500 hover:bg-amber-50 border border-neutral-200'
                  }`}
                  aria-label={`Conta ${bead}`}
                >
                  <span className="text-xs">{bead}</span>
                  {isPassed && <CheckCircle2 className="w-2.5 h-2.5 text-amber-700" />}
                  {isCurrent && <Flame className="w-3 h-3 text-[#E5C158] animate-bounce" />}
                </button>
              );
            })}
          </div>

          {/* Progresso Numérico */}
          <div className="mt-3 flex items-center justify-between text-xs text-[#70645E] dark:text-neutral-400 px-2">
            <span>Progresso da dezena</span>
            <span className="font-bold text-[#7B1113] dark:text-amber-400">
              {currentBead === 0 ? 'Início (Pai Nosso)' : `${currentBead} de 10 rezadas`}
            </span>
          </div>
        </div>

        {/* Texto da Oração Atual */}
        <div className={`p-4 rounded-2xl border shadow-sm space-y-2 transition-all ${
          isFocusMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-[#E8E1D5]'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#7B1113]/10 text-[#7B1113] dark:bg-amber-400/20 dark:text-amber-300">
              {currentPrayer.badge}
            </span>
            <button
              type="button"
              onClick={() => setLargeFont(!largeFont)}
              className="text-[11px] font-bold text-[#70645E] dark:text-neutral-400 hover:text-[#7B1113] transition cursor-pointer"
            >
              {largeFont ? 'Fonte Normal' : 'Aumentar Letra'}
            </button>
          </div>

          <h3 className="text-sm font-bold text-[#2C2420] dark:text-neutral-100">
            {currentPrayer.title}
          </h3>

          <p className={`text-[#3A302B] dark:text-neutral-200 leading-relaxed font-serif ${
            largeFont ? 'text-base sm:text-lg' : 'text-sm'
          }`}>
            "{currentPrayer.body}"
          </p>
        </div>

        {/* Intenção da Célula / Pessoal */}
        <div className={`p-3.5 rounded-2xl border shadow-2xs space-y-1.5 transition-all ${
          isFocusMode ? 'bg-neutral-900/80 border-neutral-800' : 'bg-rose-50/70 border-rose-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] dark:text-rose-300">
              <Heart className="w-3.5 h-3.5 text-[#7B1113] fill-[#7B1113]" />
              <span>Intenção deste Terço</span>
            </div>
            <button
              type="button"
              onClick={() => setIsEditingIntention(!isEditingIntention)}
              className="text-[10px] font-bold text-[#7B1113] underline cursor-pointer"
            >
              {isEditingIntention ? 'Salvar' : 'Editar intenção'}
            </button>
          </div>

          {isEditingIntention ? (
            <textarea
              value={customIntention}
              onChange={e => setCustomIntention(e.target.value)}
              rows={2}
              className="w-full text-xs p-2 rounded-xl border border-rose-300 bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7B1113]"
              placeholder="Digite aqui o pedido pelo qual você está oferecendo o terço..."
            />
          ) : (
            <p className="text-xs text-[#554741] dark:text-neutral-300 italic leading-relaxed">
              "{customIntention}"
            </p>
          )}
        </div>

        {/* Controles Principais de Avanço (Grandes e fáceis de tocar) */}
        <div className="pt-2 flex items-center gap-2">
          <button
            type="button"
            onClick={prevBead}
            className="p-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#554741] dark:text-neutral-200 shadow-sm active:scale-95 transition cursor-pointer"
            title="Conta Anterior"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            type="button"
            onClick={nextBead}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#7B1113] to-[#99171C] text-white font-bold text-sm shadow-md hover:shadow-lg active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer border border-[#E5C158]/40"
          >
            <span>Próxima Conta</span>
            <ChevronRight className="w-5 h-5 text-[#FFF0BE]" />
          </button>

          <button
            type="button"
            onClick={resetRosary}
            className="p-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-[#554741] dark:text-neutral-200 shadow-sm active:scale-95 transition cursor-pointer"
            title="Reiniciar Terço"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Botão de Conclusão / Salve Rainha */}
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setIsCompleted(true)}
            className="text-xs text-[#70645E] dark:text-neutral-400 hover:text-[#7B1113] font-semibold underline cursor-pointer"
          >
            Concluir Terço & Rezar Salve Rainha
          </button>
        </div>
      </main>

      {/* Modal Festivo de Conclusão do Terço */}
      {isCompleted && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm bg-gradient-to-b from-[#FFFDF9] to-[#F5EFE6] rounded-3xl p-6 shadow-2xl border border-[#E5C158] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#7B1113] text-[#E5C158] mx-auto flex items-center justify-center shadow-lg font-cinzel text-2xl font-bold border-2 border-[#E5C158]">
              ✝
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase font-cinzel text-[#855D08]">
                Graças e Louvores a Jesus!
              </span>
              <h3 className="text-lg font-bold text-[#36070D] mt-0.5">
                Terço Concluído com Frutos de Paz!
              </h3>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/90 border border-[#EDE8E0] text-xs text-[#554741] space-y-2 text-left">
              <p className="font-bold text-[#7B1113]">Oração da Salve Rainha:</p>
              <p className="italic leading-relaxed font-serif text-[11px]">
                "Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós volvei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce sempre Virgem Maria."
              </p>
            </div>

            <div className="bg-[#7B1113]/10 p-3 rounded-2xl border border-[#7B1113]/20 text-xs text-[#36070D]">
              <strong className="block font-cinzel text-[11px] text-[#7B1113]">Palavra de Santa Gemma:</strong>
              "Se soubesses quão doce é padecer com Jesus e sofrer por Ele, não desejarias outro consolo na terra."
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={resetRosary}
                className="flex-1 py-2.5 rounded-xl border border-[#EDE8E0] text-xs font-bold text-[#554741] hover:bg-neutral-100 transition cursor-pointer"
              >
                Rezar Novamente
              </button>
              <button
                type="button"
                onClick={onBack}
                className="flex-1 py-2.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-sm hover:bg-[#580C14] transition cursor-pointer"
              >
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
