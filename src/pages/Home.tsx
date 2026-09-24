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
  Maximize2
} from 'lucide-react';
import { CommunityPost, PostType, UserRole } from '../types';
import { Modal } from '../components/common/Modal';

interface HomeProps {
  currentUser: {
    name: string;
    role: UserRole;
    avatarUrl: string;
  };
  posts: CommunityPost[];
  onLikePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddPost: (post: Omit<CommunityPost, 'id' | 'createdAt' | 'likesCount' | 'hasLiked' | 'commentsCount' | 'comments'>) => void;
  onNavigateToAgenda: () => void;
  onNavigate?: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({
  currentUser,
  posts,
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
    if (!postContent.trim()) return;

    onAddPost({
      authorId: 'me',
      authorName: currentUser.name,
      authorRole: currentUser.role,
      authorAvatar: currentUser.avatarUrl,
      type: postType,
      title: postTitle.trim() || undefined,
      content: postContent.trim(),
      imageUrl: postImageUrl.trim() || undefined,
      tag: postTag || 'Comunidade',
    });

    setPostTitle('');
    setPostContent('');
    setPostImageUrl('');
    setIsNewPostModalOpen(false);
    showToast('Publicação enviada para o mural!');
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
        </div>
      </section>

      {/* 2. Intenção do Dia / Reflexão Espiritual */}
      <section className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/60 relative">
        <div className="flex items-center gap-2 mb-2 text-[#7B1113]">
          <Quote className="w-4 h-4 fill-[#7B1113]/20" />
          <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel">
            Intenção do Dia • Santa Gemma
          </h3>
        </div>
        <p className="text-xs text-[#3A302C] leading-relaxed italic bg-[#FBF9F5]/90 p-3 rounded-xl border border-[#EDE8E0]">
          "Se verdadeiramente desejas amar a Jesus, aprende primeiro a sofrer por Ele, porque o sofrimento ensina a amar."
        </p>
        <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#70645E]">
          <span className="font-medium text-[#7B1113]">Santa Gemma Galgani</span>
          <span>Oferecimento das 15h</span>
        </div>
      </section>

      {/* 3. Próximo Compromisso */}
      <section className="rounded-2xl bg-gradient-to-br from-white/95 to-[#F7F3EB]/90 backdrop-blur-md p-4 shadow-sm border border-[#E0D8CB]/80">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5 text-[#36070D]">
            <Calendar className="w-4 h-4 text-[#7B1113]" />
            <h3 className="text-xs font-bold uppercase tracking-wider font-cinzel">
              Próximo Compromisso
            </h3>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Nesta Quinta
          </span>
        </div>

        <div className="space-y-1.5">
          <h4 className="text-sm font-bold text-[#241E1C]">
            Encontro Semanal da Célula Santa Gemma
          </h4>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#554741] pt-1">
            <span className="flex items-center gap-1 font-semibold text-[#7B1113]">
              <Clock className="w-3.5 h-3.5" /> 20:00
            </span>
            <span className="flex items-center gap-1 text-[#70645E]">
              <MapPin className="w-3.5 h-3.5" /> Casa do Gabriel
            </span>
          </div>
          <p className="text-xs text-[#70645E] line-clamp-2 pt-1 leading-relaxed">
            Louvor comunitário, oração de escuta, partilha fraterna e lanche comunitário.
          </p>
        </div>

        <div className="mt-3.5 pt-3 border-t border-[#ECE7DF] flex items-center justify-between">
          <div className="text-[11px] text-[#70645E]">
            <span className="font-bold text-[#241E1C]">9 membros</span> já confirmaram
          </div>
          <button
            type="button"
            onClick={onNavigateToAgenda}
            className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:text-[#580C14] active:scale-95 transition cursor-pointer"
          >
            <span>Ver detalhes na agenda</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
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

          <div className="grid grid-cols-3 gap-2">
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
              onClick={() => onNavigate('liturgia')}
              className="p-2.5 rounded-xl bg-white/90 hover:bg-white border border-[#EDE8E0] shadow-2xs text-left group transition active:scale-95 flex flex-col justify-between cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="text-[11px] font-bold text-[#241E1C] group-hover:text-[#7B1113] transition leading-tight">
                Liturgia
              </h4>
              <p className="text-[9px] text-[#70645E] truncate">Santo do Dia</p>
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
          </div>
        </section>
      )}

      {/* 4. Mural da Comunidade */}
      <section className="space-y-3 pt-1">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#241E1C]">Mural da Comunidade</h3>
            <p className="text-[11px] text-[#70645E]">Partilhas, avisos e momentos da célula</p>
          </div>
          <button
            type="button"
            onClick={() => setIsNewPostModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-sm hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Publicar</span>
          </button>
        </div>

        {/* Filter tags horizontal bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'todos', label: 'Todos' },
            { id: 'reflexao', label: 'Reflexões' },
            { id: 'aviso', label: 'Avisos' },
            { id: 'testemunho', label: 'Testemunhos' },
            { id: 'momento', label: 'Momentos' },
            { id: 'foto', label: 'Fotos' },
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

        {/* Feed Posts List */}
        <div className="space-y-3">
          {filteredPosts.length === 0 ? (
            <div className="rounded-2xl bg-white/85 backdrop-blur-sm p-6 text-center text-xs text-[#8A7C75] border border-white/60">
              Nenhuma publicação nesta categoria ainda. Seja o primeiro a partilhar!
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img 
                        src={post.authorAvatar} 
                        alt={post.authorName} 
                        className="w-9 h-9 rounded-full object-cover border border-[#ECE7DF]" 
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-[#241E1C]">
                            {post.authorName}
                          </h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-[#F4EFEB] text-[#7B1113]">
                            {post.authorRole === 'admin' ? 'Coordenação' : post.authorRole === 'formador' ? 'Formadora' : 'Membro'}
                          </span>
                        </div>
                        <p className="text-[10px] text-[#8A7C75]">{post.createdAt}</p>
                      </div>
                    </div>

                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${typeInfo.badge}`}>
                      {typeInfo.label}
                    </span>
                  </div>

                  {/* Post body */}
                  {post.title && (
                    <h5 className="text-xs font-bold text-[#241E1C] leading-snug">
                      {post.title}
                    </h5>
                  )}

                  <p className="text-xs text-[#423834] leading-relaxed whitespace-pre-line">
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
                  <div className="pt-2 border-t border-[#F2ECE3] flex items-center justify-between text-xs text-[#70645E]">
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

      {/* Modal: Nova Publicação */}
      <Modal
        isOpen={isNewPostModalOpen}
        onClose={() => setIsNewPostModalOpen(false)}
        title="Nova Publicação no Mural"
        subtitle="Partilhe reflexões, avisos, orações ou fotos com a célula"
      >
        <form onSubmit={handleSubmitNewPost} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Tipo de Publicação
            </label>
            <select
              value={postType}
              onChange={e => {
                const val = e.target.value as PostType;
                setPostType(val);
                setPostTag(typeLabels[val].label);
              }}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            >
              <option value="reflexao">Reflexão Espiritual</option>
              <option value="aviso">Aviso da Célula</option>
              <option value="testemunho">Testemunho de Fé</option>
              <option value="oracao">Pedido de Oração</option>
              <option value="momento">Momento da Célula</option>
              <option value="foto">Foto / Memória</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Título (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: A presença de Deus nas pequenas coisas..."
              value={postTitle}
              onChange={e => setPostTitle(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Mensagem / Conteúdo *
            </label>
            <textarea
              required
              rows={4}
              placeholder="Escreva sua reflexão ou recado para a célula..."
              value={postContent}
              onChange={e => setPostContent(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              URL da Imagem (Opcional)
            </label>
            <input
              type="url"
              placeholder="https://exemplo.com/foto.jpg"
              value={postImageUrl}
              onChange={e => setPostImageUrl(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsNewPostModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#70645E] hover:bg-[#EFEAE2] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] transition cursor-pointer"
            >
              Publicar Agora
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
