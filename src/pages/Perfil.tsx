import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  HeartHandshake, 
  FileText, 
  Settings, 
  ShieldCheck, 
  Database, 
  RefreshCw, 
  Phone, 
  Cake, 
  Sparkles, 
  CheckCircle,
  Download,
  Edit3,
  Image as ImageIcon
} from 'lucide-react';
import { UserProfile, UserRole, CommunityPost, PrayerIntention, CalendarEvent } from '../types';
import { getSupabaseStatus } from '../services/supabaseClient';
import { offlineSyncQueue } from '../storage/syncQueue';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Modal } from '../components/common/Modal';

interface PerfilProps {
  currentUser: UserProfile;
  posts: CommunityPost[];
  prayers: PrayerIntention[];
  events: CalendarEvent[];
  onSwitchRole: (role: UserRole) => void;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  onResetToMock: () => void;
  bgOpacity?: number;
  onSetBgOpacity?: (opacity: number) => void;
  onNavigate?: (tab: string) => void;
  firebaseUser?: any;
  isConnectedToFirebase?: boolean;
  onLoginWithGoogle?: () => void;
  onLogoutFirebase?: () => void;
}

export const Perfil: React.FC<PerfilProps> = ({
  currentUser,
  posts,
  prayers,
  events,
  onSwitchRole,
  onUpdateProfile,
  onResetToMock,
  bgOpacity = 0.55,
  onSetBgOpacity,
  onNavigate,
  firebaseUser,
  isConnectedToFirebase = true,
  onLoginWithGoogle,
  onLogoutFirebase,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'prayers' | 'events' | 'settings'>('posts');
  const [showResetNotice, setShowResetNotice] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Edit form states
  const [editName, setEditName] = useState(currentUser.name);
  const [editBio, setEditBio] = useState(currentUser.bio || '');
  const [editPhone, setEditPhone] = useState(currentUser.phone || '');
  const [editBirthday, setEditBirthday] = useState(currentUser.birthday || '');
  const [editMinistry, setEditMinistry] = useState(currentUser.ministry || '');

  const supabaseStatus = getSupabaseStatus();
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const pendingSyncCount = offlineSyncQueue.getPendingCount();

  const myPosts = posts.filter(p => p.authorName === currentUser.name || p.authorId === currentUser.id);
  const myPrayers = prayers.filter(p => p.authorName === currentUser.name || p.authorId === currentUser.id);
  const myEvents = events.filter(e => e.rsvpStatus === 'attending');

  const roleDetails: Record<UserRole, { label: string; badge: string; desc: string }> = {
    admin: {
      label: 'Coordenador(a) / Admin',
      badge: 'bg-amber-100 text-amber-900 border-amber-300',
      desc: 'Gestão completa da célula, avisos oficiais, eventos e escalas.',
    },
    formador: {
      label: 'Formador(a)',
      badge: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      desc: 'Acompanhamento pessoal dos membros e conteúdo do Caminho da Paz.',
    },
    membro: {
      label: 'Membro da Célula',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      desc: 'Participação ativa nos encontros, intercessão, chat e fraternidade.',
    },
  };

  const handleReset = () => {
    onResetToMock();
    setShowResetNotice(true);
    setTimeout(() => setShowResetNotice(false), 3000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({
        name: editName.trim(),
        bio: editBio.trim(),
        phone: editPhone.trim(),
        birthday: editBirthday.trim(),
        ministry: editMinistry.trim(),
      });
    }
    setIsEditModalOpen(false);
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <CheckCircle className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Profile Card */}
      <section className="rounded-2xl bg-white/90 backdrop-blur-md p-4 shadow-sm border border-white/70 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-[#7B1113]/20 shadow-xs"
            />
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-bold text-[#241E1C] truncate">
                {currentUser.name}
              </h2>
              <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleDetails[currentUser.role].badge}`}>
                {roleDetails[currentUser.role].label}
              </span>
              <p className="text-xs text-[#70645E] mt-1 truncate">
                {currentUser.cellName}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditName(currentUser.name);
              setEditBio(currentUser.bio || '');
              setEditPhone(currentUser.phone || '');
              setEditBirthday(currentUser.birthday || '');
              setEditMinistry(currentUser.ministry || '');
              setIsEditModalOpen(true);
            }}
            className="p-2 rounded-xl text-[#7B1113] hover:bg-[#F4EFEB] active:scale-95 transition cursor-pointer"
            title="Editar dados do perfil"
          >
            <Edit3 className="w-4 h-4" />
          </button>
        </div>

        {currentUser.bio && (
          <p className="text-xs text-[#554741] italic bg-[#FBF9F5] p-2.5 rounded-xl border border-[#EDE8E0]">
            "{currentUser.bio}"
          </p>
        )}

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#554741] pt-1">
          <div className="flex items-center gap-2 bg-[#F8F6F2] p-2 rounded-xl border border-[#ECE7DF]">
            <Cake className="w-3.5 h-3.5 text-[#7B1113]" />
            <div>
              <p className="text-[10px] text-[#8A7C75]">Aniversário</p>
              <p className="font-semibold text-[#241E1C] text-[11px]">{currentUser.birthday}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#F8F6F2] p-2 rounded-xl border border-[#ECE7DF]">
            <Sparkles className="w-3.5 h-3.5 text-[#7B1113]" />
            <div>
              <p className="text-[10px] text-[#8A7C75]">Ministério</p>
              <p className="font-semibold text-[#241E1C] text-[11px] truncate">{currentUser.ministry}</p>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="pt-2 border-t border-[#ECE7DF] space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[#36070D] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#7B1113]" />
              Alternar Papel (RBAC)
            </span>
            {onNavigate && (
              <button
                type="button"
                onClick={() => onNavigate('permissoes')}
                className="text-[10px] text-[#7B1113] font-bold hover:underline active:scale-95 transition cursor-pointer flex items-center gap-0.5"
              >
                <span>Simulador Completo &rarr;</span>
              </button>
            )}
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {(['membro', 'formador', 'admin'] as UserRole[]).map(role => {
              const isSelected = currentUser.role === role;
              const labels: Record<UserRole, string> = {
                admin: 'Admin',
                formador: 'Formadora',
                membro: 'Membro'
              };
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    onSwitchRole(role);
                    showToast(`Papel alterado para: ${labels[role]}`);
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition text-center cursor-pointer active:scale-95 ${
                    isSelected
                      ? 'bg-[#7B1113] text-white shadow-xs'
                      : 'bg-[#F4EFEB] text-[#554741] hover:bg-[#EAE4DB]'
                  }`}
                >
                  {labels[role]} {isSelected && '✓'}
                </button>
              );
            })}
          </div>
          <p className="text-[10px] text-[#70645E]">
            {roleDetails[currentUser.role].desc}
          </p>
        </div>
      </section>

      {/* Profile Segmented Tabs */}
      <div className="flex rounded-xl bg-white/70 backdrop-blur-sm p-1 border border-[#DDD5C7]">
        <button
          type="button"
          onClick={() => setActiveTab('posts')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer active:scale-95 ${
            activeTab === 'posts' ? 'bg-[#7B1113] text-white shadow-xs' : 'text-[#70645E]'
          }`}
        >
          Publicações ({myPosts.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('prayers')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer active:scale-95 ${
            activeTab === 'prayers' ? 'bg-[#7B1113] text-white shadow-xs' : 'text-[#70645E]'
          }`}
        >
          Orações ({myPrayers.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('events')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer active:scale-95 ${
            activeTab === 'events' ? 'bg-[#7B1113] text-white shadow-xs' : 'text-[#70645E]'
          }`}
        >
          Presenças ({myEvents.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer active:scale-95 ${
            activeTab === 'settings' ? 'bg-[#7B1113] text-white shadow-xs' : 'text-[#70645E]'
          }`}
        >
          Ajustes
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-3">
        {activeTab === 'posts' && (
          <div className="space-y-2.5">
            {myPosts.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl text-center text-xs text-[#8A7C75] border border-white/60">
                Você ainda não fez nenhuma publicação no mural.
              </div>
            ) : (
              myPosts.map(post => (
                <div key={post.id} className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xs border border-white/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#7B1113] uppercase">
                      {post.type}
                    </span>
                    <span className="text-[10px] text-[#8A7C75]">{post.createdAt}</span>
                  </div>
                  {post.title && <h4 className="text-xs font-bold text-[#241E1C]">{post.title}</h4>}
                  <p className="text-xs text-[#423834] leading-relaxed line-clamp-3">{post.content}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'prayers' && (
          <div className="space-y-2.5">
            {myPrayers.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl text-center text-xs text-[#8A7C75] border border-white/60">
                Nenhuma intenção cadastrada por você.
              </div>
            ) : (
              myPrayers.map(prayer => (
                <div key={prayer.id} className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xs border border-white/70 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#7B1113] uppercase">
                      {prayer.category}
                    </span>
                    <span className="text-[10px] text-[#8A7C75]">{prayer.createdAt}</span>
                  </div>
                  <p className="text-xs text-[#423834] italic">"{prayer.content}"</p>
                  <p className="text-[10px] font-bold text-[#276F50]">{prayer.prayerCount} irmãos rezando por você</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-2.5">
            {myEvents.length === 0 ? (
              <div className="bg-white/85 backdrop-blur-sm p-6 rounded-2xl text-center text-xs text-[#8A7C75] border border-white/60">
                Você ainda não confirmou presença em nenhum evento.
              </div>
            ) : (
              myEvents.map(event => (
                <div key={event.id} className="bg-white/90 backdrop-blur-md p-3.5 rounded-2xl shadow-xs border border-white/70 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      Presença Confirmada
                    </span>
                    <span className="text-xs font-bold text-[#7B1113]">{event.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-[#241E1C]">{event.title}</h4>
                  <p className="text-[11px] text-[#70645E]">{event.location}</p>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-3">
            {/* Visual background controls for Santa Gemma */}
            {onSetBgOpacity && (
              <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xs border border-white/70 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[#36070D] font-bold text-xs">
                    <ImageIcon className="w-4 h-4 text-[#7B1113]" />
                    <span>Visibilidade de Santa Gemma Galgani</span>
                  </div>
                  <span className="text-xs font-bold text-[#7B1113] font-mono">
                    {Math.round(bgOpacity * 100)}%
                  </span>
                </div>
                <p className="text-xs text-[#554741]">
                  Ajuste a intensidade da imagem sagrada no plano de fundo com parallax.
                </p>
                <div className="grid grid-cols-4 gap-1.5 pt-1">
                  {[
                    { label: 'Suave', val: 0.35 },
                    { label: 'Padrão', val: 0.55 },
                    { label: 'Vívido', val: 0.75 },
                    { label: 'Intenso', val: 0.90 },
                  ].map(lvl => (
                    <button
                      key={lvl.label}
                      onClick={() => onSetBgOpacity(lvl.val)}
                      className={`py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                        Math.abs(bgOpacity - lvl.val) < 0.1
                          ? 'bg-[#7B1113] text-white shadow-xs'
                          : 'bg-[#F4EFEB] text-[#554741] hover:bg-[#EAE4DB]'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Firebase Cloud Firestore & Auth block */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xs border border-white/70 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[#36070D] font-bold text-xs">
                  <Database className="w-4 h-4 text-[#7B1113]" />
                  <span>Nuvem em Tempo Real (Firebase)</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Conectado
                </span>
              </div>

              <p className="text-xs text-[#554741] leading-relaxed">
                Banco de dados Firestore provisionado com persistência multi-usuário e regras de segurança ABAC.
              </p>

              {firebaseUser ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-[11px] font-bold text-emerald-950 truncate">
                      Conectado como {firebaseUser.displayName || firebaseUser.email}
                    </p>
                    <p className="text-[10px] text-emerald-700 truncate">
                      {firebaseUser.email}
                    </p>
                  </div>
                  {onLogoutFirebase && (
                    <button
                      type="button"
                      onClick={onLogoutFirebase}
                      className="px-2.5 py-1 rounded-lg bg-white border border-emerald-300 text-[10px] font-bold text-emerald-900 hover:bg-emerald-100 active:scale-95 transition cursor-pointer"
                    >
                      Sair
                    </button>
                  )}
                </div>
              ) : (
                onLoginWithGoogle && (
                  <button
                    type="button"
                    onClick={onLoginWithGoogle}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs active:scale-95 transition cursor-pointer"
                  >
                    <span>Entrar com Conta Google (Firebase)</span>
                  </button>
                )
              )}

              <div className="text-[11px] text-[#70645E] space-y-1 pt-1 border-t border-[#ECE7DF]">
                <p>• <strong>Firestore:</strong> Sincronização em tempo real de posts, orações e escalas.</p>
                <p>• <strong>Regras ABAC:</strong> Proteção de integridade e identidade ativa.</p>
                <p>• <strong>Modo Offline:</strong> Cache local automático via localStorage.</p>
              </div>
            </div>

            {/* PWA status block */}
            <div className="bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xs border border-white/70 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#241E1C]">Aplicativo PWA</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {isInstalled ? 'Instalado' : 'Pronto p/ Instalação'}
                </span>
              </div>
              <p className="text-xs text-[#70645E]">
                Manifesto, Service Worker e ícones estão configurados para funcionamento offline e mobile.
              </p>
              {isInstallable && (
                <button
                  onClick={install}
                  className="w-full py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Instalar App Agora
                </button>
              )}
            </div>

            {/* Reset data */}
            <div className="bg-[#FAF8F5]/90 backdrop-blur-sm p-4 rounded-2xl border border-[#ECE7DF] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#36070D]">Restaurar Dados Mock</span>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#DDD5C7] text-xs font-semibold text-[#7B1113] hover:bg-[#EAE4DB] transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restaurar</span>
                </button>
              </div>
              <p className="text-[11px] text-[#70645E]">
                Restaura os dados iniciais demonstrativos da célula, limpando cadastros temporários.
              </p>
              {showResetNotice && (
                <div className="p-2 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-semibold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-700" />
                  <span>Dados demonstrativos restaurados com sucesso!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal: Editar Perfil */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Editar Perfil"
        subtitle="Atualize suas informações pessoais na célula"
      >
        <form onSubmit={handleSaveProfile} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              value={editName}
              onChange={e => setEditName(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Telefone / WhatsApp
            </label>
            <input
              type="text"
              value={editPhone}
              onChange={e => setEditPhone(e.target.value)}
              placeholder="(85) 99999-9999"
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Data de Aniversário
            </label>
            <input
              type="text"
              value={editBirthday}
              onChange={e => setEditBirthday(e.target.value)}
              placeholder="Ex: 12 de Outubro"
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Ministério / Função
            </label>
            <input
              type="text"
              value={editMinistry}
              onChange={e => setEditMinistry(e.target.value)}
              placeholder="Ex: Música / Louvor"
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Biografia / Frase Espiritual
            </label>
            <textarea
              rows={3}
              value={editBio}
              onChange={e => setEditBio(e.target.value)}
              placeholder="Sua frase ou testemunho de fé..."
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#70645E] hover:bg-[#EFEAE2] cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] transition cursor-pointer"
            >
              Salvar Perfil
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
