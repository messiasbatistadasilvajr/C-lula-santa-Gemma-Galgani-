import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Calendar, 
  MapPin, 
  Clock, 
  Sparkles, 
  Share2, 
  PlusCircle, 
  Quote, 
  ArrowRight, 
  Tag, 
  CheckCircle2,
  Send,
  Check,
  Maximize2,
  Radio,
  Flame,
  Award,
  QrCode,
  BellRing,
  Camera,
  Upload,
  Image as ImageIcon,
  Trash2
} from 'lucide-react';
import { CommunityPost, PostType, UserRole, DonorProfile } from '../types';
import { Modal } from '../components/common/Modal';
import { compressAndReadImageFile } from '../utils/imageUpload';
import {
  getNextCellMeeting,
  requestNotificationPermission,
  sendCellPushNotification,
} from '../services/cellReminders';

interface HomeProps {
  currentUser: {
    name: string;
    role: UserRole;
    avatarUrl: string;
  };
  posts: CommunityPost[];
  donors?: DonorProfile[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'commentsCount' | 'comments'>) => void;
  onNavigateToAgenda: () => void;
  onNavigate?: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  currentUser,
  posts,
  donors = [],
  onLikePost,
  onAddComment,
  onAddPost,
  onNavigateToAgenda,
  onNavigate,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('todos');
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);
  
  // Reactive comment post tracking by ID so additions immediately reflect
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const activeCommentPost = activeCommentPostId ? posts.find(p => p.id === activeCommentPostId) || null : null;
  const [newCommentText, setNewCommentText] = useState('');

  // Image lightbox preview
  const [previewImage, setPreviewImage] = useState<{ url: string; title?: string } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for new post
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<PostType>('reflexao');
  const [postTag, setPostTag] = useState('Reflexão');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handlePhotoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const dataUrl = await compressAndReadImageFile(file);
      setPostImageUrl(dataUrl);
      setPostType('foto');
      setPostTag('Foto');
      showToast('📷 Foto carregada e pronta para salvar!');
    } catch {
      showToast('Não foi possível carregar a foto selecionada.');
    } finally {
      setIsUploadingPhoto(false);
      e.target.value = '';
    }
  };

  // Dynamic greeting based on current local hour
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Bom dia';
    if (hour >= 12 && hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const filteredPosts = selectedTag === 'todos' 
    ? posts 
    : posts.filter(p => p.type === selectedTag);

  const handleSubmitNewPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !postImageUrl.trim()) return;

    onAddPost({
      authorId: 'me',
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      type: postType,
      title: postTitle.trim() || (postType === 'foto' ? 'Momento da Célula Santa Gemma' : undefined),
      content: postContent.trim() || 'Registro fotográfico da nossa Célula Santa Gemma Galgani 🌹',
      imageUrl: postImageUrl.trim() || undefined,
      tag: postTag || 'Comunidade',
    });

    setPostTitle('');
    setPostContent('');
    setPostImageUrl('');
    setIsNewPostModalOpen(false);
    showToast(postImageUrl ? '📷 Foto publicada no Mural e salva na Galeria!' : 'Publicação enviada para o mural!');
  };

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim() || !activeCommentPostId) return;
    onAddComment(activeCommentPostId, newCommentText.trim());
    setNewCommentText('');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Santa Gemma Galgani • Célula Shalom\n"${post.title ? post.title + ' - ' : ''}${post.content}"`);
      showToast('Mensagem copiada para compartilhar!');
    }
  };

  const typeLabels: Record<PostType, { label: string; badge: string }> = {
    reflexao: { label: 'Reflexão', badge: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    oracao: { label: 'Oração', badge: 'bg-amber-100 text-amber-800 border-amber-200' },
    testemunho: { label: 'Testemunho', badge: 'bg-purple-100 text-purple-800 border-purple-200' },
    aviso: { label: 'Aviso', badge: 'bg-blue-100 text-blue-800 border-blue-200' },
    foto: { label: 'Foto', badge: 'bg-rose-100 text-rose-800 border-rose-200' },
    momento: { label: 'Momento', badge: 'bg-amber-50 text-amber-900 border-amber-300' },
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
      {/* Toast Feedback */}
      {toastMessage && (
        <div 
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in"
        >
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Welcoming Header */}
      <section className="bg-gradient-to-br from-[#7B1113]/95 to-[#4A0A10]/95 backdrop-blur-md rounded-2xl p-4 text-white shadow-md border border-[#E5C158]/40 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-6 w-32 h-32 rounded-full bg-[#E5C158]/15 blur-xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">👋</span>
              <h2 className="text-base font-bold text-white tracking-tight">
                {getGreeting()}, {currentUser.name.split(' ')[0]}!
              </h2>
            </div>
            <span className="text-[11px] font-semibold bg-[#E5C158]/20 text-[#FFF0BE] px-2.5 py-0.5 rounded-full border border-[#E5C158]/40 font-cinzel">
              SHALOM
            </span>
          </div>
          <p className="text-xs text-[#FFF0BE]/90 mt-1 leading-relaxed">
            "Que a paz de Cristo reine em seus corações e a doce intercessão de Santa Gemma Galgani guarde a nossa célula."
          </p>

          <div className="mt-3 pt-2.5 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('perfil')}
                className="text-[11px] font-bold text-[#FFF0BE] hover:text-white underline underline-offset-2 cursor-pointer"
              >
                ✏️ Trocar meu nome ({currentUser.name.split(' ')[0]})
              </button>
            )}
            <a
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                '🌹 *Shalom, irmãos da Célula Santa Gemma Galgani!* ✝️\n\nAcesse agora o nosso *Aplicativo Oficial da Célula* (Mural, Intercessão, Agenda, Terço Virtual e Caixinha PIX):\n👉 https://ais-pre-kgz6f3aqokvkmkzezbfub7-154268790842.us-east1.run.app'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded-lg bg-[#E5C158] hover:bg-[#f2cf66] text-[#36070D] text-[10px] font-extrabold flex items-center gap-1 shadow-2xs transition cursor-pointer"
            >
              <Share2 className="w-3 h-3" />
              <span>Enviar no Grupo do WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Intenção do Dia / Reflexão Espiritual */}
      <section 
        onClick={() => onNavigate && onNavigate('santagemma')}
        role="button"
        tabIndex={0}
        aria-label="Conhecer Santa Gemma Galgani em detalhe com efeito vidro fosco"
        className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/60 relative cursor-pointer hover:border-[#E5C158] hover:shadow-md transition active:scale-[0.99] group"
      >
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-[#7B1113]">
            <Quote className="w-4 h-4 fill-[#7B1113]/20" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel">
              Intenção do Dia • Santa Gemma
            </h3>
          </div>
          <span className="text-[10px] font-bold text-[#7B1113] bg-[#7B1113]/10 px-2 py-0.5 rounded-full flex items-center gap-1 group-hover:bg-[#7B1113] group-hover:text-white transition">
            <span>Ver Padroeira</span>
            <ArrowRight className="w-3 h-3" />
          </span>
        </div>
        <p className="text-xs text-[#3A302C] leading-relaxed italic bg-[#FBF9F5]/90 p-3 rounded-xl border border-[#EDE8E0]">
          "Se verdadeiramente desejas amar a Jesus, aprende primeiro a sofrer por Ele, porque o sofrimento ensina a amar."
        </p>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#70645E]">
          <span className="font-medium text-[#7B1113]">Santa Gemma Galgani</span>
          <span className="text-[10px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            Toque para abrir tela com Vidro Fosco ✨
          </span>
        </div>
      </section>

      {/* 3. Próximo Compromisso */}
      <section className="rounded-2xl bg-gradient-to-br from-white/95 to-[#F7F3EB]/90 backdrop-blur-md p-4 shadow-sm border border-[#E0D8CB]/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-[#36070D]">
            <Calendar className="w-4 h-4 text-[#7B1113]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel">
              Encontros da Célula
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Segundas & Sextas • 19h às 21h
          </span>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-[#241E1C]">
            Célula Santa Gemma Galgani (Segunda e Sexta-feira)
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#554741] pt-1">
            <span className="flex items-center gap-1 font-semibold text-[#7B1113]">
              <Clock className="w-3.5 h-3.5" /> 19:00 às 21:00
            </span>
            <span className="flex items-center gap-1 text-[#70645E]">
              <MapPin className="w-3.5 h-3.5" /> Casa do Gabriel / Comunidade Shalom
            </span>
          </div>
          <p className="text-xs text-[#70645E] line-clamp-2 pt-1 leading-relaxed">
            Toda segunda-feira e sexta-feira das 19h00 às 21h00: Louvor comunitário, oração de escuta, formação, partilha fraterna e comunhão.
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#ECE7DF] flex flex-wrap items-center justify-between gap-2">
          <button
            type="button"
            onClick={async () => {
              const nextInfo = getNextCellMeeting();
              await requestNotificationPermission();
              await sendCellPushNotification({
                title: `🔔 Lembrete Ativado • Segundas e Sextas às 19:00`,
                body: `Próximo encontro: ${nextInfo.countdownText}. Você será avisado antes das 19:00!`,
                playSound: true,
              });
              showToast(`🔔 Lembrete ativo! Próximo: ${nextInfo.countdownText}`);
            }}
            className="px-2.5 py-1 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 text-[11px] font-bold flex items-center gap-1 border border-amber-300 transition cursor-pointer active:scale-95"
          >
            <BellRing className="w-3.5 h-3.5 text-[#7B1113]" />
            <span>Ativar Alerta 19:00</span>
          </button>

          <button
            type="button"
            onClick={onNavigateToAgenda}
            className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:text-[#580C14] active:scale-95 transition cursor-pointer"
          >
            <span>Configurar lembretes na agenda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('modo-encontro')}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-[#7B1113] to-[#99171C] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer border border-[#E5C158]/40"
          >
            <Radio className="w-3.5 h-3.5 text-red-300 animate-pulse" />
            <span>Abrir Modo Encontro ao Vivo (Cronômetro & Cânticos)</span>
          </button>
        )}
      </section>

      {/* 3.5 Atalhos Rápidos da Vida Comunitária */}
      {onNavigate && (
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel text-[#7B1113]">
              Recursos da Célula
            </h3>
            <span className="text-[10px] text-[#70645E]">Acesso rápido</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => onNavigate('membros')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-amber-50 to-white hover:bg-white border-2 border-[#7B1113]/30 shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-[#7B1113] text-[#E5C158] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform font-bold text-xs">
                {donors.length || 48}
              </div>
              <h4 className="text-[11px] font-bold text-[#7B1113] group-hover:text-[#580C14] transition leading-tight">
                Membros ({donors.length || 48})
              </h4>
              <p className="text-[9px] text-[#554741] font-semibold truncate">Lista & Nasc. 👥</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ofertas')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-emerald-50 to-white hover:bg-white border border-emerald-300/90 shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <QrCode className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Ofertas & PIX
              </h4>
              <p className="text-[9px] text-emerald-900 font-medium truncate">Bot WhatsApp 💸</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('modo-encontro')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-red-50 to-white hover:bg-white border border-red-200/80 shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Ao Vivo
              </h4>
              <p className="text-[9px] text-[#70645E] truncate">Modo Encontro ⏱️</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('terco')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-amber-50 to-white hover:bg-white border border-amber-200/80 shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Flame className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Terço Virtual
              </h4>
              <p className="text-[9px] text-[#70645E] truncate">Rosário & Toque 📿</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('novena')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-rose-50 to-white hover:bg-white border border-rose-200/80 shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-900 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Award className="w-4 h-4 text-[#7B1113]" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Novena & Graças
              </h4>
              <p className="text-[9px] text-[#70645E] truncate">9 Dias & Mural ✨</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('escalas')}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#EDE8E0] shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#7B1113] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Clock className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Escalas
              </h4>
              <p className="text-[9px] text-[#70645E] truncate">Roteiro & Serviços</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('cancioneiro')}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#EDE8E0] shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Tag className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Cânticos
              </h4>
              <p className="text-[9px] text-[#70645E] truncate">Letras & Cifras</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('galeria')}
              className="p-2.5 rounded-xl bg-gradient-to-b from-rose-50 to-white hover:bg-white border border-rose-300/90 shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-rose-100 text-[#7B1113] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Camera className="w-4 h-4 text-[#7B1113]" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Fotos & Galeria
              </h4>
              <p className="text-[9px] text-rose-900 font-medium truncate">Salvar Fotos 📷</p>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('santagemma')}
              className="p-2.5 rounded-xl bg-gradient-to-br from-white/95 to-[#FFF7ED]/90 hover:bg-white border border-[#FDE68A] shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-[#7B1113] flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform font-cinzel font-bold text-xs">
                ✝
              </div>
              <h4 className="text-[11px] font-bold text-[#7B1113] group-hover:text-[#580C14] transition leading-tight">
                Sta. Gemma
              </h4>
              <p className="text-[9px] text-amber-900 font-medium truncate">Vidro Fosco ✨</p>
            </button>
          </div>
        </section>
      )}

      {/* 4. Mural da Comunidade */}
      <section className="space-y-3 pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-[#241E1C]">Mural da Comunidade</h3>
            <p className="text-[11px] text-[#70645E]">Partilhas, avisos e momentos da célula</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                setPostType('foto');
                setPostTag('Foto');
                setIsNewPostModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-[#7B1113] border border-amber-300 text-xs font-bold shadow-2xs hover:bg-amber-200 active:scale-95 transition cursor-pointer"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Salvar Foto</span>
            </button>
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-sm hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>
          </div>
        </div>

        {/* Filter tags horizontal bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'reflexao', label: 'Reflexões' },
            { id: 'aviso', label: 'Avisos' },
            { id: 'testemunho', label: 'Testemunhos' },
            { id: 'momento', label: 'Momentos' },
            { id: 'foto', label: '📷 Fotos' },
          ].map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                selectedTag === tag.id
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-white/90 text-[#70645E] hover:bg-white border border-[#ECE7DF]'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Banner dedicado quando a aba Fotos está selecionada */}
        {selectedTag === 'foto' && (
          <div className="rounded-2xl bg-gradient-to-r from-[#7B1113]/10 to-amber-50 p-3.5 border border-[#7B1113]/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
            <div className="space-y-0.5">
              <h4 className="text-xs font-bold text-[#36070D] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#7B1113]" />
                <span>Fotos & Memórias da Célula</span>
              </h4>
              <p className="text-[11px] text-[#554741]">
                Envie fotos do celular ou computador ou acesse os álbuns completos da Galeria.
              </p>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setPostType('foto');
                  setPostTag('Foto');
                  setIsNewPostModalOpen(true);
                }}
                className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Enviar Foto</span>
              </button>
              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('galeria')}
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-white text-[#7B1113] border border-[#7B1113]/30 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-50 active:scale-95 transition cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Abrir Galeria</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Feed Posts List */}
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl bg-white/85 backdrop-blur-sm p-6 text-center text-xs text-[#8A7C75] border border-white/60 space-y-3">
              <p>Nenhuma publicação nesta categoria ainda. Seja o primeiro a partilhar!</p>
              {selectedTag === 'foto' && (
                <button
                  type="button"
                  onClick={() => {
                    setPostType('foto');
                    setPostTag('Foto');
                    setIsNewPostModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Adicionar Primeira Foto</span>
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map(post => {
              const typeInfo = typeLabels[post.type] || typeLabels.reflexao;
              return (
                <article 
                  key={post.id}
                  className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/70 space-y-3"
                >
                  {/* Author row */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.authorName} 
                        className="w-9 h-9 rounded-full object-cover border border-[#ECE7DF] shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="text-xs font-bold text-[#241E1C] truncate">
                            {post.authorName}
                          </h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F4EFEB] text-[#7B1113] shrink-0">
                            {post.authorRole === 'admin' ? 'Coordenação' : post.authorRole === 'formador' ? 'Formadora' : 'Membro'}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8A7C75]">{post.createdAt}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border shrink-0 ${typeInfo.badge}`}>
                      {typeInfo.label}
                    </span>
                  </div>

                  {/* Post body */}
                  {post.title && (
                    <h5 className="text-xs font-bold text-[#241E1C] leading-snug">
                      {post.title}
                    </h5>
                  )}

                  <p className="text-xs text-[#423834] leading-relaxed whitespace-pre-line break-words">
                    {post.content}
                  </p>

                  {/* Optional Post Image with click-to-preview */}
                  {post.imageUrl && (
                    <div 
                      onClick={() => setPreviewImage({ url: post.imageUrl!, title: post.title })}
                      className="group cursor-pointer rounded-xl overflow-hidden max-h-64 bg-[#F4EFEB] border border-[#ECE7DF] relative"
                    >
                      <img 
                        src={post.imageUrl} 
                        alt={post.title || 'Foto da publicação'} 
                        className="w-full h-full object-cover group-hover:scale-102 transition duration-200" 
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                        <Maximize2 className="w-5 h-5 drop-shadow" />
                      </div>
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between gap-2 text-xs text-[#70645E] flex-wrap">
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => onLikePost(post.id)}
                        className={`flex items-center gap-1.5 font-semibold transition cursor-pointer active:scale-95 ${
                          post.hasLiked ? 'text-[#7B1113]' : 'hover:text-[#7B1113]'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${post.hasLiked ? 'fill-[#7B1113] text-[#7B1113]' : ''}`} />
                        <span>{post.likesCount} {post.hasLiked ? 'Amém' : 'Louvar'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveCommentPostId(post.id)}
                        className="flex items-center gap-1.5 font-medium hover:text-[#241E1C] active:scale-95 transition cursor-pointer"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>{post.commentsCount} Comentários</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleShare(post)}
                        title="Compartilhar mensagem"
                        className="p-1 hover:text-[#7B1113] active:scale-90 transition cursor-pointer"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="text-[10px] font-medium text-[#8A7C75] bg-[#F7F3EB] px-2 py-0.5 rounded-full">
                      #{post.tag}
                    </span>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Modal: Nova Publicação no Mural (Responsivo e Centralizado) */}
      <Modal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title={postType === 'foto' ? 'Salvar & Publicar Foto' : 'Nova Publicação no Mural'}
        subtitle="Partilhe reflexões, avisos, orações ou fotos com a célula"
      >
        <form onSubmit={handleSubmitNewPost} className="space-y-4">
          {/* Autor Identificado */}
          <div className="flex items-center justify-between gap-2.5 p-2.5 rounded-xl bg-white border border-[#ECE7DF]">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-9 h-9 rounded-full object-cover border border-[#D9D0C5] shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#241E1C] truncate">
                  {currentUser.name}
                </p>
                <p className="text-[10px] text-[#7B1113] font-semibold">
                  Publicando como {currentUser.role === 'admin' ? 'Coordenação' : currentUser.role === 'formador' ? 'Formador(a)' : 'Membro da Célula'}
                </p>
              </div>
            </div>
            {onNavigate && (
              <button
                type="button"
                onClick={() => {
                  setIsNewPostModalOpen(false);
                  onNavigate('galeria');
                }}
                className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-[#7B1113] border border-amber-300 text-[10px] font-bold flex items-center gap-1 shrink-0 transition cursor-pointer active:scale-95"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Ver Galeria</span>
              </button>
            )}
          </div>

          {/* Seletor Visual de Tipo de Publicação */}
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1.5">
              Escolha a Categoria da Publicação:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {(
                [
                  { id: 'reflexao', label: '📖 Reflexão' },
                  { id: 'aviso', label: '📢 Aviso' },
                  { id: 'testemunho', label: '✨ Testemunho' },
                  { id: 'oracao', label: '🙏 Oração' },
                  { id: 'momento', label: '🌹 Momento' },
                  { id: 'foto', label: '📷 Foto' },
                ] as { id: PostType; label: string }[]
              ).map(item => {
                const isSelected = postType === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPostType(item.id);
                      setPostTag(typeLabels[item.id].label);
                    }}
                    className={`py-2 px-2.5 rounded-xl text-xs font-bold border transition text-center cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-xs'
                        : 'bg-white text-[#554741] border-[#D9D0C5] hover:bg-[#F4EFEB]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Painel Responsivo de Upload e Captura de Fotos (Destaque quando 'foto' é selecionado ou sempre disponível) */}
          <div className={`rounded-2xl p-3.5 border transition space-y-3 ${
            postType === 'foto'
              ? 'bg-gradient-to-br from-rose-50/90 to-amber-50/70 border-[#7B1113]/40 shadow-2xs'
              : 'bg-white border-[#ECE7DF]'
          }`}>
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-bold text-[#36070D] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#7B1113]" />
                <span>Selecionar ou Tirar Foto do Aparelho</span>
              </label>
              {isUploadingPhoto && (
                <span className="text-[10px] font-bold text-[#7B1113] animate-pulse">
                  Processando foto...
                </span>
              )}
            </div>

            {/* Botões Responsivos para escolher da Galeria do Celular/PC ou Câmera */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition text-center">
                <Upload className="w-4 h-4 shrink-0" />
                <span>Escolher Foto do Aparelho</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
              </label>

              <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#36070D] border border-amber-300 text-xs font-bold cursor-pointer active:scale-95 transition text-center">
                <Camera className="w-4 h-4 text-[#7B1113] shrink-0" />
                <span>Tirar Foto com a Câmera</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {/* Pré-visualização da Foto Carregada */}
            {postImageUrl && (
              <div className="relative rounded-xl overflow-hidden bg-black/90 border border-[#D9D0C5] max-h-52 flex items-center justify-center">
                <img
                  src={postImageUrl}
                  alt="Prévia da foto selecionada"
                  className="w-full h-auto max-h-52 object-contain"
                />
                <button
                  type="button"
                  onClick={() => setPostImageUrl('')}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-700/90 hover:bg-red-800 text-white text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remover</span>
                </button>
              </div>
            )}

            {/* Opção secundária de colar link caso deseje */}
            <div>
              <label className="block text-[10px] font-semibold text-[#70645E] mb-1">
                Ou cole o link (URL) de uma imagem da internet (Opcional):
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={postImageUrl.startsWith('data:') ? '' : postImageUrl}
                onChange={e => setPostImageUrl(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Título ou Legenda da Foto (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Encontro de célula abençoado na segunda-feira..."
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2.5 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              {postType === 'foto' ? 'Descrição ou Partilha da Foto (Opcional)' : 'Mensagem / Conteúdo *'}
            </label>
            <textarea
              required={postType !== 'foto' && !postImageUrl}
              rows={3}
              placeholder="Escreva sua reflexão, legenda da foto ou recado para os irmãos da célula..."
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2.5 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113] leading-relaxed"
            />
          </div>

          <div className="pt-2 border-t border-[#ECE7DF] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D9D0C5] bg-white text-xs font-bold text-[#70645E] hover:bg-[#EFEAE2] transition cursor-pointer active:scale-95"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] shadow-sm transition cursor-pointer active:scale-95"
            >
              {postType === 'foto' || postImageUrl ? 'Salvar Foto no Mural' : 'Publicar no Mural'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Comentários */}
      <Modal
        isOpen={Boolean(activeCommentPost)}
        onClose={() => setActiveCommentPostId(null)}
        title="Comentários"
        subtitle={activeCommentPost?.title || 'Partilha Comunitária'}
      >
        <div className="space-y-4">
          <div className="max-h-60 overflow-y-auto space-y-2.5 pr-1">
            {activeCommentPost?.comments.length === 0 ? (
              <p className="text-xs text-center text-[#8A7C75] py-4">
                Nenhum comentário ainda. Seja o primeiro a partilhar!
              </p>
            ) : (
              activeCommentPost?.comments.map(comment => (
                <div key={comment.id} className="bg-[#F8F6F2] p-2.5 rounded-xl border border-[#ECE7DF] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#241E1C]">
                      {comment.authorName}
                    </span>
                    <span className="text-[10px] text-[#8A7C75]">
                      {comment.createdAt}
                    </span>
                  </div>
                  <p className="text-xs text-[#423834] leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* New comment input */}
          <form onSubmit={handleSendComment} className="flex items-center gap-2 pt-2 border-t border-[#ECE7DF]">
            <input
              type="text"
              required
              placeholder="Escreva um comentário fraterno..."
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              className="flex-1 rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
            <button
              type="submit"
              disabled={!newCommentText.trim()}
              className="p-2 rounded-xl bg-[#7B1113] disabled:opacity-40 text-white hover:bg-[#580C14] transition shrink-0 cursor-pointer"
              aria-label="Enviar comentário"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </Modal>

      {/* Modal: Image Lightbox */}
      <Modal
        isOpen={Boolean(previewImage)}
        onClose={() => setPreviewImage(null)}
        title={previewImage?.title || 'Visualização da Foto'}
        subtitle="Mural Santa Gemma"
      >
        {previewImage && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden bg-black max-h-[60vh] flex items-center justify-center">
              <img
                src={previewImage.url}
                alt={previewImage.title || 'Foto'}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setPreviewImage(null)}
                className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
