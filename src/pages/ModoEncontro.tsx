import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Clock, 
  Volume2, 
  VolumeX, 
  Music, 
  Users, 
  Sparkles, 
  Maximize2, 
  Minimize2, 
  Share2, 
  Check, 
  AlertCircle,
  FileText,
  ChevronRight,
  Flame,
  MessageCircle,
  Radio,
  BookOpen
} from 'lucide-react';
import { CellSong, MeetingScale, UserRole, LiveMeetingStep } from '../types';
import { soundManager, vibrateDevice } from '../utils/audioEffects';

interface ModoEncontroProps {
  onBack: () => void;
  songs?: CellSong[];
  currentScale?: MeetingScale;
  currentRole?: UserRole;
  onNavigateToCancioneiro?: () => void;
}

// Roteiro Oficial das Etapas do Encontro de Célula Shalom (Segunda e Sexta • 19:00 às 21:00 = 120 min)
const DEFAULT_STEPS: LiveMeetingStep[] = [
  {
    id: 'acolhida',
    title: '1. Acolhida Fraterna (19:00 - 19:15)',
    defaultMinutes: 15,
    description: 'Recepção calorosa de cada irmão às 19h, abraço da paz, acolhimento de visitantes novos e confraternização inicial.',
    tips: 'Certifique-se de que ninguém fique isolado. Apresente os novos participantes à célula.'
  },
  {
    id: 'louvor',
    title: '2. Oração Inicial & Louvor Vivo (19:15 - 19:40)',
    defaultMinutes: 25,
    description: 'Invocação ao Espírito Santo, cânticos de júbilo e adoração, oração em línguas e escuta carismática.',
    scriptureFocus: 'Sl 99, 2: "Entrai pelas suas portas com ações de graças e pelos seus átrios com cânticos de louvor."',
    tips: 'Conduza um louvor alegre e espontâneo. Deixe espaço para a oração de escuta.'
  },
  {
    id: 'formacao',
    title: '3. Formação Espiritual & Palavra (19:40 - 20:10)',
    defaultMinutes: 30,
    description: 'Estudo do tema bíblico, magistério da Igreja ou carisma da Comunidade Shalom partilhado pelo formador.',
    tips: 'Foco na aplicação prática para a vida cotidiana do jovem e das famílias.'
  },
  {
    id: 'partilha',
    title: '4. Partilha Fraterna dos Membros (20:10 - 20:30)',
    defaultMinutes: 20,
    description: 'Momento em que cada irmão abre o coração para partilhar como a Palavra tocou sua semana e suas lutas.',
    tips: 'Use o cronômetro individual de partilha (2-3 min) para que todos tenham voz com serenidade.'
  },
  {
    id: 'intercessao',
    title: '5. Intercessão & Oração de Cura (20:30 - 20:45)',
    defaultMinutes: 15,
    description: 'Oração comunitária estendendo as mãos pelos pedidos urgentes, famílias, enfermos e necessidades da célula.',
    scriptureFocus: 'Tg 5, 16: "Orai uns pelos outros para serdes curados. A oração fervorosa do justo tem grande poder."',
    tips: 'Rezem juntos por um irmão em especial ou pelas intenções registradas no app.'
  },
  {
    id: 'avisos',
    title: '6. Avisos, Próxima Escala & Ágape (20:45 - 21:00)',
    defaultMinutes: 15,
    description: 'Comunicações da célula, confirmação da escala de segunda/sexta e bênção de encerramento às 21:00 com ágape.',
    tips: 'Agradeça a quem preparou o lanche e confirme os aniversariantes.'
  }
];

export const ModoEncontro: React.FC<ModoEncontroProps> = ({
  onBack,
  songs = [],
  currentScale,
  currentRole = 'membro',
  onNavigateToCancioneiro
}) => {
  // Aba ativa dentro do modo encontro
  const [activeTab, setActiveTab] = useState<'roteiro' | 'partilha' | 'canticos' | 'mocoes'>('roteiro');
  
  // Estado do Roteiro Geral
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number>(DEFAULT_STEPS[0].defaultMinutes * 60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundManager.isEnabled());

  // Estado do Temporizador Individual de Partilha ("Partilhômetro")
  const [speakerDurationSec, setSpeakerDurationSec] = useState<number>(180); // 3 min default
  const [speakerTimeLeft, setSpeakerTimeLeft] = useState<number>(180);
  const [isSpeakerTimerRunning, setIsSpeakerTimerRunning] = useState<boolean>(false);
  const [currentSpeakerName, setCurrentSpeakerName] = useState<string>('');
  const [speakersCount, setSpeakersCount] = useState<number>(0);

  // Estado dos Cânticos do Encontro
  const [selectedSongIndex, setSelectedSongIndex] = useState<number>(0);
  const [largeLyricsMode, setLargeLyricsMode] = useState<boolean>(true);
  const [showChords, setShowChords] = useState<boolean>(false);

  // Estado das Moções e Resumo do Encontro
  const [motionsText, setMotionsText] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const currentStep = DEFAULT_STEPS[currentStepIndex];

  // Temporizador Geral do Roteiro
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timeRemainingSeconds > 0) {
      interval = setInterval(() => {
        setTimeRemainingSeconds(prev => {
          if (prev <= 1) {
            // Tempo da etapa esgotado
            soundManager.playStepChime();
            vibrateDevice([100, 100, 200]);
            return 0;
          }
          // Aviso nos últimos 60 segundos
          if (prev === 60) {
            soundManager.playSacredBell(659.25);
            vibrateDevice([40, 80]);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timeRemainingSeconds]);

  // Temporizador Individual de Partilha
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isSpeakerTimerRunning && speakerTimeLeft > 0) {
      interval = setInterval(() => {
        setSpeakerTimeLeft(prev => {
          if (prev <= 1) {
            soundManager.playStepChime();
            vibrateDevice([80, 120, 80]);
            setIsSpeakerTimerRunning(false);
            setSpeakersCount(c => c + 1);
            return 0;
          }
          if (prev === 30) {
            // 30 segundos restantes
            soundManager.playSacredBell(523.25);
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isSpeakerTimerRunning, speakerTimeLeft]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Funções de controle do cronômetro geral
  const togglePlayTimer = () => {
    if (!isTimerRunning) {
      soundManager.playSacredBell(587.33);
    }
    setIsTimerRunning(!isTimerRunning);
  };

  const handleNextStep = () => {
    if (currentStepIndex < DEFAULT_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setTimeRemainingSeconds(DEFAULT_STEPS[nextIndex].defaultMinutes * 60);
      soundManager.playStepChime();
      vibrateDevice([40, 40]);
    } else {
      showToast('Encontro finalizado! Que Deus abençoe a célula!');
      setIsTimerRunning(false);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setTimeRemainingSeconds(DEFAULT_STEPS[prevIndex].defaultMinutes * 60);
    }
  };

  const handleResetStepTimer = () => {
    setTimeRemainingSeconds(currentStep.defaultMinutes * 60);
    setIsTimerRunning(false);
  };

  // Funções do Partilhômetro
  const startSpeakerTimer = (speaker?: string) => {
    if (speaker) setCurrentSpeakerName(speaker);
    setSpeakerTimeLeft(speakerDurationSec);
    setIsSpeakerTimerRunning(true);
    soundManager.playSacredBell(523.25);
  };

  const toggleSpeakerTimer = () => {
    setIsSpeakerTimerRunning(!isSpeakerTimerRunning);
  };

  const resetSpeakerTimer = () => {
    setIsSpeakerTimerRunning(false);
    setSpeakerTimeLeft(speakerDurationSec);
  };

  // Formatação de Tempo mm:ss
  const formatTime = (totalSecs: number): string => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cópia para o WhatsApp
  const handleCopyMeetingSummary = () => {
    const theme = currentScale?.theme || 'Vida Comunitária e Fé';
    const formador = currentScale?.formador || 'Coordenação';
    const summary = `Célula Santa Gemma Galgani • Resumo do Encontro\n` +
      `Tema: ${theme}\n` +
      `Partilha da Palavra: ${formador}\n` +
      `Irmãos que partilharam: ${speakersCount > 0 ? speakersCount : 'Vários irmãos'}\n\n` +
      `Moções & Palavra de Escuta:\n` +
      (motionsText.trim() ? motionsText.trim() : 'Encontro cheio do Espírito Santo e unidade fraterna.') +
      `\n\n"Jesus, fazei que eu Vos ame com o mesmo amor com que Vós me amastes!" - Sta. Gemma`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      showToast('Resumo do encontro copiado para o WhatsApp!');
    }
  };

  // Lista de cânticos para usar no encontro
  const activeSongs = songs.length > 0 ? songs : [
    {
      id: 'song_default_1',
      title: 'Em Teus Braços',
      artist: 'Missionário Shalom',
      category: 'louvor' as const,
      key: 'G',
      suggestedMoment: 'Louvor Inicial',
      lyrics: `[Intro] G C Em D\n\nG           C\nSeguro estou em Tuas mãos\nEm          D\nMeu Deus, meu refúgio e proteção\nC           G/B\nEm Teus braços encontro a paz\nAm          D\nQue o mundo não me traz\n\n[Refrão]\nG\nEm Teus braços é o meu lugar\nEm\nOnde eu posso descansar\nC           D\nJesus, meu Senhor e meu Tudo!`
    },
    {
      id: 'song_default_2',
      title: 'Espírito Santo, Vem',
      artist: 'Shalom',
      category: 'espirito_santo' as const,
      key: 'D',
      suggestedMoment: 'Oração de Efusão',
      lyrics: `[Intro] D A Bm G\n\nD           A\nVem, Espírito Santo de Deus\nBm          G\nInunda este lugar com Tua presença\nD           A\nVem inflamar nosso coração\nBm          G\nCom o fogo do Teu santo amor!`
    }
  ];

  const currentSong = activeSongs[selectedSongIndex] || activeSongs[0];

  return (
    <div className={`min-h-screen bg-[#FAF7F2] pb-24 text-[#2C2420] transition-colors duration-300 ${
      isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto bg-neutral-950 text-neutral-100' : ''
    }`}>
      {/* Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <header className={`sticky top-0 z-30 px-4 py-3 border-b backdrop-blur-md flex items-center justify-between transition-colors ${
        isFullscreen ? 'bg-neutral-900/90 border-neutral-800' : 'bg-[#FAF7F2]/90 border-[#ECE7DF]'
      }`}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-xl hover:bg-black/5 active:scale-95 transition cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-5 h-5 text-[#36070D] dark:text-neutral-200" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="flex items-center gap-1 font-cinzel text-xs font-bold uppercase tracking-wider text-[#7B1113] dark:text-[#E5C158]">
                <Radio className="w-3 h-3 text-red-500 animate-pulse" />
                Ao Vivo no Encontro
              </span>
              <span className="text-[10px] bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300 px-1.5 py-0.2 rounded-full font-bold">
                Célula
              </span>
            </div>
            <h1 className="text-base font-bold tracking-tight text-[#36070D] dark:text-white">
              Painel de Condução
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              const enabled = soundManager.toggleSound();
              setSoundEnabled(enabled);
            }}
            className={`p-2 rounded-xl transition cursor-pointer ${
              soundEnabled ? 'text-[#7B1113] dark:text-amber-400 bg-amber-100 dark:bg-neutral-800' : 'text-neutral-400'
            }`}
            title="Sons e sinos do encontro"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isFullscreen ? 'bg-[#7B1113] text-white' : 'hover:bg-black/5 text-[#554741]'
            }`}
            title="Modo Projeção / Tela Cheia"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Painel do Cronômetro Principal da Etapa */}
        <section className={`rounded-3xl p-5 border shadow-md text-center transition-all ${
          isFullscreen 
            ? 'bg-neutral-900 border-neutral-800' 
            : 'bg-gradient-to-b from-[#7B1113] to-[#4A0A10] text-white border-[#E5C158]/50'
        }`}>
          {/* Indicador da Etapa */}
          <div className="flex items-center justify-between text-xs text-[#FFF0BE]/90 mb-1">
            <span className="font-cinzel font-bold tracking-wider uppercase">
              Etapa {currentStepIndex + 1} de {DEFAULT_STEPS.length}
            </span>
            <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-semibold">
              Meta: {currentStep.defaultMinutes} min
            </span>
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white mb-3">
            {currentStep.title}
          </h2>

          {/* Relógio Gigante */}
          <div className="py-2">
            <div className={`text-5xl sm:text-6xl font-black font-mono tracking-tight drop-shadow-md ${
              timeRemainingSeconds <= 60 ? 'text-amber-300 animate-pulse' : 'text-[#FFF0BE]'
            }`}>
              {formatTime(timeRemainingSeconds)}
            </div>
            <p className="text-[11px] text-white/70 mt-1">tempo restante nesta fase</p>
          </div>

          {/* Barra de Progresso da Etapa */}
          <div className="w-full bg-black/40 rounded-full h-2 my-4 overflow-hidden p-0.5 border border-white/20">
            <div 
              className="bg-gradient-to-r from-[#E5C158] to-yellow-300 h-full rounded-full transition-all duration-300"
              style={{ 
                width: `${Math.min(100, Math.max(0, ((currentStep.defaultMinutes * 60 - timeRemainingSeconds) / (currentStep.defaultMinutes * 60)) * 100))}%` 
              }}
            />
          </div>

          {/* Controles do Cronômetro Geral */}
          <div className="flex items-center justify-center gap-3 pt-1">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
              title="Etapa anterior"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>

            <button
              type="button"
              onClick={togglePlayTimer}
              className={`px-6 py-3.5 rounded-2xl font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer transition active:scale-95 ${
                isTimerRunning
                  ? 'bg-amber-400 text-[#36070D] hover:bg-amber-300'
                  : 'bg-[#E5C158] text-[#36070D] hover:bg-yellow-400'
              }`}
            >
              {isTimerRunning ? (
                <>
                  <Pause className="w-5 h-5 fill-current" />
                  <span>Pausar Etapa</span>
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  <span>Iniciar Cronômetro</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title="Próxima etapa"
            >
              <SkipForward className="w-5 h-5 text-white" />
            </button>

            <button
              type="button"
              onClick={handleResetStepTimer}
              className="p-3 rounded-2xl bg-white/10 hover:bg-white/20 transition cursor-pointer"
              title="Reiniciar tempo da etapa"
            >
              <RotateCcw className="w-4 h-4 text-white" />
            </button>
          </div>
        </section>

        {/* Abas Secundárias do Modo Encontro */}
        <div className="bg-white dark:bg-neutral-900 p-1.5 rounded-2xl border border-[#EDE8E0] dark:border-neutral-800 shadow-2xs grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('roteiro')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'roteiro'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#70645E] dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Roteiro</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('partilha')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'partilha'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#70645E] dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Partilha</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('canticos')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'canticos'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#70645E] dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Music className="w-4 h-4" />
            <span>Cânticos</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('mocoes')}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition flex flex-col items-center justify-center gap-1 cursor-pointer ${
              activeTab === 'mocoes'
                ? 'bg-[#7B1113] text-white shadow-xs'
                : 'text-[#70645E] dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Moções</span>
          </button>
        </div>

        {/* CONTEÚDO 1: GUIA E DICAS DO ROTEIRO */}
        {activeTab === 'roteiro' && (
          <section className="space-y-3">
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 border border-[#ECE7DF] dark:border-neutral-800 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#7B1113] dark:text-amber-400 uppercase font-cinzel">
                  Orientações para o Condutor
                </span>
                <span className="text-[11px] text-[#70645E] dark:text-neutral-400">
                  Fase Atual: {currentStepIndex + 1}/6
                </span>
              </div>

              <p className="text-xs text-[#554741] dark:text-neutral-300 leading-relaxed">
                {currentStep.description}
              </p>

              {currentStep.scriptureFocus && (
                <div className="bg-amber-50/70 dark:bg-neutral-800/80 p-3 rounded-2xl border border-amber-200/80 dark:border-neutral-700 text-xs text-[#7B1113] dark:text-amber-300 font-serif italic">
                  {currentStep.scriptureFocus}
                </div>
              )}

              <div className="bg-[#FAF8F5] dark:bg-neutral-800/60 p-3 rounded-2xl border border-[#EDE8E0] dark:border-neutral-700 text-xs text-[#554741] dark:text-neutral-300 space-y-1">
                <strong className="block text-[#36070D] dark:text-neutral-200">Dica Prática Shalom:</strong>
                <p>{currentStep.tips}</p>
              </div>
            </div>

            {/* Lista das Etapas com Seleção Rápida */}
            <div className="bg-white dark:bg-neutral-900 rounded-3xl p-4 border border-[#ECE7DF] dark:border-neutral-800 shadow-2xs space-y-2">
              <h3 className="text-xs font-bold uppercase font-cinzel text-[#36070D] dark:text-neutral-200 mb-2">
                Linha do Tempo do Encontro
              </h3>
              {DEFAULT_STEPS.map((step, idx) => {
                const isCurrent = currentStepIndex === idx;
                const isDone = idx < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setCurrentStepIndex(idx);
                      setTimeRemainingSeconds(step.defaultMinutes * 60);
                      soundManager.playBeadClick();
                    }}
                    className={`w-full p-2.5 rounded-2xl border text-left flex items-center justify-between transition cursor-pointer ${
                      isCurrent
                        ? 'bg-[#7B1113]/10 border-[#7B1113] text-[#7B1113] dark:bg-amber-400/10 dark:border-amber-400 dark:text-amber-300 font-bold'
                        : isDone
                        ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 text-emerald-900 dark:text-emerald-300'
                        : 'bg-[#FAF8F5] dark:bg-neutral-800/50 border-[#EDE8E0] dark:border-neutral-700 text-[#70645E] dark:text-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isCurrent
                          ? 'bg-[#7B1113] text-white'
                          : isDone
                          ? 'bg-emerald-600 text-white'
                          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300'
                      }`}>
                        {idx + 1}
                      </div>
                      <span className="text-xs">{step.title}</span>
                    </div>
                    <span className="text-[11px] font-mono">{step.defaultMinutes} min</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* CONTEÚDO 2: PARTILHÔMETRO (TEMPORIZADOR INDIVIDUAL) */}
        {activeTab === 'partilha' && (
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-5 border border-[#ECE7DF] dark:border-neutral-800 shadow-2xs space-y-4 text-center">
            <div className="text-left">
              <span className="text-xs font-bold uppercase font-cinzel text-[#7B1113] dark:text-amber-400">
                Partilhômetro Fraterno
              </span>
              <h3 className="text-sm font-bold text-[#241E1C] dark:text-neutral-100">
                Tempo por Irmão para Todos Terem Voz
              </h3>
              <p className="text-xs text-[#70645E] dark:text-neutral-400 mt-0.5">
                Ideal para manter a partilha edificante e pontual.
              </p>
            </div>

            {/* Seletor de Tempo da Partilha (2 min, 3 min, 4 min) */}
            <div className="flex items-center justify-center gap-2">
              {[120, 180, 240].map(secs => (
                <button
                  key={secs}
                  type="button"
                  onClick={() => {
                    setSpeakerDurationSec(secs);
                    setSpeakerTimeLeft(secs);
                    setIsSpeakerTimerRunning(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    speakerDurationSec === secs
                      ? 'bg-[#7B1113] text-white border-[#7B1113]'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-[#70645E] dark:text-neutral-300 border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {secs / 60} minutos
                </button>
              ))}
            </div>

            {/* Relógio do Irmão */}
            <div className="py-4">
              <div className={`text-6xl font-black font-mono tracking-tight ${
                speakerTimeLeft <= 30 ? 'text-rose-600 animate-pulse' : 'text-[#7B1113] dark:text-[#FFF0BE]'
              }`}>
                {formatTime(speakerTimeLeft)}
              </div>
              <p className="text-xs text-[#70645E] dark:text-neutral-400 mt-1">
                {currentSpeakerName ? `Partilha de: ${currentSpeakerName}` : 'Irmão partilhando'}
              </p>
            </div>

            {/* Controles da Partilha */}
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={toggleSpeakerTimer}
                className={`px-6 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 cursor-pointer shadow-sm active:scale-95 transition ${
                  isSpeakerTimerRunning
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#7B1113] text-white hover:bg-[#580C14]'
                }`}
              >
                {isSpeakerTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isSpeakerTimerRunning ? 'Pausar' : 'Iniciar Partilha'}</span>
              </button>

              <button
                type="button"
                onClick={resetSpeakerTimer}
                className="p-3 rounded-2xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-[#70645E] dark:text-neutral-300 transition cursor-pointer"
                title="Reiniciar tempo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setSpeakersCount(c => c + 1);
                  resetSpeakerTimer();
                  soundManager.playSacredBell(659.25);
                  showToast('Próximo irmão! Tempo resetado.');
                }}
                className="px-4 py-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer active:scale-95 transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>Próximo</span>
              </button>
            </div>

            {/* Contador de Participações */}
            <div className="pt-2 text-xs text-[#70645E] dark:text-neutral-400 flex items-center justify-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span><strong>{speakersCount}</strong> irmãos já partilharam neste encontro</span>
            </div>
          </section>
        )}

        {/* CONTEÚDO 3: CÂNTICOS DO ENCONTRO EM MODO LETRA GRANDE */}
        {activeTab === 'canticos' && (
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-4 border border-[#ECE7DF] dark:border-neutral-800 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase font-cinzel text-[#7B1113] dark:text-amber-400">
                  Música & Louvor
                </span>
                <h3 className="text-sm font-bold text-[#241E1C] dark:text-neutral-100">
                  {currentSong.title}
                </h3>
                <p className="text-[11px] text-[#70645E] dark:text-neutral-400">{currentSong.artist} • Tom: {currentSong.key}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowChords(!showChords)}
                  className={`px-2 py-1 rounded-xl text-[10px] font-bold transition border cursor-pointer ${
                    showChords
                      ? 'bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950 dark:text-purple-300'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-[#70645E] border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  {showChords ? 'Cifras ON' : 'Cifras OFF'}
                </button>
                <button
                  type="button"
                  onClick={() => setLargeLyricsMode(!largeLyricsMode)}
                  className="px-2 py-1 rounded-xl text-[10px] font-bold bg-neutral-100 dark:bg-neutral-800 text-[#70645E] dark:text-neutral-300 cursor-pointer"
                >
                  {largeLyricsMode ? 'Letra Normal' : 'Letra Grande'}
                </button>
              </div>
            </div>

            {/* Seletor rápido de cânticos */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {activeSongs.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSelectedSongIndex(idx)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                    selectedSongIndex === idx
                      ? 'bg-[#7B1113] text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-[#70645E] dark:text-neutral-400'
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>

            {/* Letra / Cifra */}
            <div className="p-4 rounded-2xl bg-[#FAF8F5] dark:bg-neutral-800/80 border border-[#EDE8E0] dark:border-neutral-700 overflow-x-auto max-h-96">
              <pre className={`font-mono leading-relaxed whitespace-pre-wrap ${
                largeLyricsMode ? 'text-base sm:text-lg font-semibold' : 'text-xs'
              } ${!showChords ? 'font-sans' : ''}`}>
                {showChords 
                  ? currentSong.lyrics 
                  : currentSong.lyrics.replace(/\[Intro.*?\]|\[.*?\]|[A-G](#|b)?(m|maj|dim|aug|sus)?[0-9]?(\/[A-G](#|b)?)?/g, '').trim()}
              </pre>
            </div>

            {onNavigateToCancioneiro && (
              <button
                type="button"
                onClick={onNavigateToCancioneiro}
                className="w-full py-2 rounded-xl text-xs font-bold text-[#7B1113] dark:text-amber-300 border border-[#7B1113]/30 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                Abrir Cancioneiro Completo
              </button>
            )}
          </section>
        )}

        {/* CONTEÚDO 4: MOÇÕES ESPIRITUAIS & RESUMO DE WHATSAPP */}
        {activeTab === 'mocoes' && (
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-4 border border-[#ECE7DF] dark:border-neutral-800 shadow-2xs space-y-3">
            <div>
              <span className="text-xs font-bold uppercase font-cinzel text-[#7B1113] dark:text-amber-400">
                Escuta & Frutos Espirituais
              </span>
              <h3 className="text-sm font-bold text-[#241E1C] dark:text-neutral-100">
                Moções e Resumo do Encontro
              </h3>
              <p className="text-xs text-[#70645E] dark:text-neutral-400 mt-0.5">
                Anote profecias, passagens e pedidos surgidos durante a reunião para enviar no grupo.
              </p>
            </div>

            <textarea
              value={motionsText}
              onChange={e => setMotionsText(e.target.value)}
              rows={5}
              placeholder="Ex: Palavra de Efusão: Isaías 43; Moção: 'Não temas, porque Eu te remi'; Oração especial pela saúde do pai do Lucas..."
              className="w-full text-xs p-3 rounded-2xl border border-[#EDE8E0] dark:border-neutral-700 bg-[#FAF8F5] dark:bg-neutral-800 text-[#2C2420] dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#7B1113]"
            />

            <button
              type="button"
              onClick={handleCopyMeetingSummary}
              className="w-full py-3 px-4 rounded-2xl bg-[#7B1113] text-white font-bold text-xs shadow-md hover:bg-[#580C14] active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Share2 className="w-4 h-4 text-[#FFF0BE]" />
              <span>Gerar e Copiar Resumo para o WhatsApp</span>
            </button>
          </section>
        )}
      </main>
    </div>
  );
};
