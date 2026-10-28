import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Users, 
  Phone, 
  Cake, 
  ShieldCheck, 
  Camera, 
  MessageCircle, 
  Plus, 
  CheckCircle, 
  Heart, 
  Sparkles, 
  UserCheck, 
  Edit3, 
  Trash2, 
  Filter, 
  Check, 
  Copy,
  ChevronRight,
  Database
} from 'lucide-react';
import { DonorProfile, UserProfile, UserRole } from '../types';
import { PhotoChangeModal } from '../components/common/PhotoChangeModal';
import { Modal } from '../components/common/Modal';

interface MembrosProps {
  donors: DonorProfile[];
  currentUser: UserProfile;
  currentRole: UserRole;
  onBack: () => void;
  onNavigate?: (tab: string) => void;
  onUpsertDonor: (donor: Omit<DonorProfile, 'id' | 'totalDonated' | 'donationsCount' | 'createdAt'> & { id?: string; totalDonated?: number; donationsCount?: number; createdAt?: string }) => void;
  onDeleteDonor?: (donorId: string) => void;
  onUpdateDonorPhoto: (donorId: string, avatarUrl: string) => void;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  onSwitchUser?: (user: Partial<UserProfile>) => void;
}

export const Membros: React.FC<MembrosProps> = ({
  donors,
  currentUser,
  currentRole,
  onBack,
  onNavigate,
  onUpsertDonor,
  onDeleteDonor,
  onUpdateDonorPhoto,
  onUpdateProfile,
  onSwitchUser,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'todos' | 'lideranca' | 'aniversariantes' | 'com-foto' | 'sem-foto'>('todos');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Photo change modal state
  const [editingPhotoDonor, setEditingPhotoDonor] = useState<DonorProfile | null>(null);

  // Edit / New member modal state
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingDonorId, setEditingDonorId] = useState<string | null>(null);
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBirth, setFormBirth] = useState('');
  const [formMarital, setFormMarital] = useState('Solteiro(a)');
  const [formRole, setFormRole] = useState('Membro');
  const [formEmail, setFormEmail] = useState('');
  const [formPhoto, setFormPhoto] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Helper to extract day and month
  const currentMonth = 10; // Outubro de 2026

  // Statistics
  const stats = useMemo(() => {
    const total = donors.length;
    const withPhoto = donors.filter(d => Boolean(d.avatarUrl)).length;
    const leadership = donors.filter(d => 
      d.leadershipBadge && (
        d.leadershipBadge.includes('Coordenador') || 
        d.leadershipBadge.includes('Formador') ||
        d.leadershipBadge.includes('👑') ||
        d.leadershipBadge.includes('⭐')
      )
    ).length;
    const octoberBirthdays = donors.filter(d => {
      const parts = d.birthDate.split('/');
      if (parts.length === 3) {
        return parseInt(parts[1], 10) === currentMonth;
      }
      return false;
    }).length;

    return { total, withPhoto, leadership, octoberBirthdays };
  }, [donors]);

  // Filtered list
  const filteredDonors = useMemo(() => {
    return donors.filter(donor => {
      // Search text match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = donor.name.toLowerCase().includes(q);
        const matchPhone = donor.phone.toLowerCase().includes(q);
        const matchBirth = donor.birthDate.toLowerCase().includes(q);
        const matchMarital = (donor.maritalStatus || '').toLowerCase().includes(q);
        const matchBadge = (donor.leadershipBadge || '').toLowerCase().includes(q);
        if (!matchName && !matchPhone && !matchBirth && !matchMarital && !matchBadge) {
          return false;
        }
      }

      // Filter chips
      if (selectedFilter === 'lideranca') {
        return donor.leadershipBadge && (
          donor.leadershipBadge.includes('Coordenador') || 
          donor.leadershipBadge.includes('Formador') ||
          donor.leadershipBadge.includes('👑') ||
          donor.leadershipBadge.includes('⭐')
        );
      }
      if (selectedFilter === 'aniversariantes') {
        const parts = donor.birthDate.split('/');
        return parts.length === 3 && parseInt(parts[1], 10) === currentMonth;
      }
      if (selectedFilter === 'com-foto') {
        return Boolean(donor.avatarUrl);
      }
      if (selectedFilter === 'sem-foto') {
        return !donor.avatarUrl;
      }

      return true;
    });
  }, [donors, searchQuery, selectedFilter]);

  // Open edit modal for an existing member
  const handleOpenEdit = (donor: DonorProfile) => {
    setEditingDonorId(donor.id);
    setFormName(donor.name);
    setFormPhone(donor.phone);
    setFormBirth(donor.birthDate);
    setFormMarital(donor.maritalStatus || 'Solteiro(a)');
    setFormRole(donor.leadershipBadge || 'Membro');
    setFormEmail(donor.email || '');
    setFormPhoto(donor.avatarUrl || '');
    setIsMemberModalOpen(true);
  };

  // Open modal for creating a new member
  const handleOpenNew = () => {
    setEditingDonorId(null);
    setFormName('');
    setFormPhone('');
    setFormBirth('');
    setFormMarital('Solteiro(a)');
    setFormRole('Membro');
    setFormEmail('');
    setFormPhoto('');
    setIsMemberModalOpen(true);
  };

  // Save member form
  const handleSaveMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPhone.trim()) {
      showToast('Por favor preencha o Nome e Telefone do membro.');
      return;
    }

    onUpsertDonor({
      id: editingDonorId || undefined,
      name: formName.trim(),
      phone: formPhone.trim(),
      birthDate: formBirth.trim() || '14/10/1998',
      maritalStatus: formMarital,
      leadershipBadge: formRole,
      email: formEmail.trim(),
      avatarUrl: formPhoto.trim() || undefined,
    });

    setIsMemberModalOpen(false);
    showToast(editingDonorId ? 'Dados do membro atualizados com sucesso!' : 'Novo membro cadastrado na célula!');
  };

  // Save photo from photo modal
  const handleSavePhoto = (newPhotoUrl: string) => {
    if (!editingPhotoDonor) return;
    onUpdateDonorPhoto(editingPhotoDonor.id, newPhotoUrl);

    // If it's the active user or matching name, also update profile
    if (
      editingPhotoDonor.name.toLowerCase() === currentUser.name.toLowerCase() ||
      editingPhotoDonor.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')
    ) {
      if (onUpdateProfile) {
        onUpdateProfile({ avatarUrl: newPhotoUrl });
      }
    }

    showToast(`Foto de ${editingPhotoDonor.name.split(' ')[0]} atualizada com sucesso!`);
    setEditingPhotoDonor(null);
  };

  // Set this member as active user in the app
  const handleSetActiveUser = (donor: DonorProfile) => {
    const isLeadership =
      donor.leadershipBadge?.includes('Coordenador') ||
      donor.leadershipBadge?.includes('Formador') ||
      donor.leadershipBadge?.includes('👑') ||
      donor.leadershipBadge?.includes('⭐');
    const newRole: UserRole = isLeadership ? 'admin' : 'membro';

    let resolvedMinistry = 'Membro da Célula';
    const lowerName = donor.name.toLowerCase();
    if (lowerName.includes('cristiane alves')) {
      resolvedMinistry = 'Formadora Principal & Coordenadora da Célula';
    } else if (lowerName.includes('francisco josé') || lowerName.includes('francisco jose')) {
      resolvedMinistry = 'Formador Auxiliar & Coordenador da Célula';
    } else if (lowerName.includes('raquel barbosa')) {
      resolvedMinistry = 'Formadora Auxiliar da Célula (Acesso Total)';
    } else if (donor.leadershipBadge) {
      resolvedMinistry = donor.leadershipBadge;
    }

    if (onSwitchUser) {
      onSwitchUser({
        name: donor.name,
        phone: donor.phone,
        birthday: donor.birthDate,
        avatarUrl: donor.avatarUrl || currentUser.avatarUrl,
        role: newRole,
        ministry: resolvedMinistry,
      });
    } else if (onUpdateProfile) {
      onUpdateProfile({
        name: donor.name,
        phone: donor.phone,
        birthday: donor.birthDate,
        avatarUrl: donor.avatarUrl || currentUser.avatarUrl,
        role: newRole,
        ministry: resolvedMinistry,
      });
    }
    showToast(`Perfil ativo alterado para ${donor.name.split(' ')[0]} (${isLeadership ? 'Acesso Total' : 'Membro'})!`);
  };

  return (
    <div className="pb-28 pt-2 px-3 sm:px-4 space-y-4 max-w-lg mx-auto animate-in fade-in">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2.5 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <CheckCircle className="w-4 h-4 text-[#E5C158] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={onBack}
          className="p-2 rounded-xl bg-white/90 text-[#7B1113] hover:bg-white shadow-xs border border-[#ECE7DF] transition cursor-pointer flex items-center gap-1 text-xs font-bold active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <div className="text-center flex-1 min-w-0 px-1">
          <h1 className="text-base font-bold font-cinzel text-[#36070D] truncate">
            Membros da Célula
          </h1>
          <p className="text-[10px] text-[#70645E] truncate">
            Célula Santa Gemma Galgani • {donors.length} Irmãos
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="py-1.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold shadow-xs transition flex items-center gap-1 active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-[#E5C158]" />
          <span className="hidden sm:inline">Novo</span> Membro
        </button>
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/70 shadow-2xs text-center">
          <span className="text-base font-bold text-[#7B1113] font-cinzel block">
            {stats.total}
          </span>
          <span className="text-[9px] font-semibold text-[#70645E] block leading-tight">
            Irmãos
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/70 shadow-2xs text-center">
          <span className="text-base font-bold text-emerald-700 font-cinzel block">
            {stats.withPhoto}
          </span>
          <span className="text-[9px] font-semibold text-[#70645E] block leading-tight">
            Com Foto 📷
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/70 shadow-2xs text-center">
          <span className="text-base font-bold text-amber-600 font-cinzel block">
            {stats.octoberBirthdays}
          </span>
          <span className="text-[9px] font-semibold text-[#70645E] block leading-tight">
            Aniversários 🎂
          </span>
        </div>

        <div className="p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-white/70 shadow-2xs text-center">
          <span className="text-base font-bold text-[#36070D] font-cinzel block">
            {stats.leadership}
          </span>
          <span className="text-[9px] font-semibold text-[#70645E] block leading-tight">
            Liderança 👑
          </span>
        </div>
      </div>

      {/* Instruction Card for Photo Change */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50 via-white to-rose-50 border border-amber-300/80 shadow-xs flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#7B1113] text-[#E5C158] flex items-center justify-center shrink-0 shadow-2xs mt-0.5">
          <Camera className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-xs font-bold text-[#36070D] flex items-center gap-1.5">
            <span>Fotos de Perfil dos Membros</span>
            <span className="text-[9px] bg-[#E5C158] text-[#36070D] px-1.5 py-0.2 rounded-full font-extrabold">
              NOVO
            </span>
          </h3>
          <p className="text-[11px] text-[#554741] mt-0.5 leading-relaxed">
            Toque no ícone de <strong>câmera 📷</strong> sobre a foto de qualquer irmão para <strong>trocar a foto</strong>, tirar uma selfie pelo celular ou escolher um avatar devocional de santos.
          </p>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-[#8A7C75] absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Pesquisar por nome, telefone ou aniversário..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-2xl border border-[#DFD8CE] bg-white/95 pl-9 pr-3 py-2.5 text-xs text-[#241E1C] placeholder-[#8A7C75] shadow-2xs focus:outline-[#7B1113]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A7C75] hover:text-[#241E1C]"
          >
            Limpar
          </button>
        )}
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
        {[
          { id: 'todos', label: `Todos (${donors.length})` },
          { id: 'lideranca', label: `Liderança (${stats.leadership})` },
          { id: 'aniversariantes', label: `Outubro (${stats.octoberBirthdays}) 🎂` },
          { id: 'com-foto', label: `Com Foto (${stats.withPhoto}) 📷` },
          { id: 'sem-foto', label: `Sem Foto (${stats.total - stats.withPhoto})` },
        ].map(chip => (
          <button
            key={chip.id}
            type="button"
            onClick={() => setSelectedFilter(chip.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer border ${
              selectedFilter === chip.id
                ? 'bg-[#7B1113] text-white border-[#7B1113] shadow-xs'
                : 'bg-white/80 text-[#70645E] border-[#ECE7DF] hover:bg-white hover:text-[#241E1C]'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Member Cards List */}
      <div className="space-y-3">
        {filteredDonors.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white/90 text-center text-xs text-[#8A7C75] border border-[#ECE7DF]">
            Nenhum membro encontrado com os critérios de busca selecionados.
          </div>
        ) : (
          filteredDonors.map((donor) => {
            const isCurrentUser =
              donor.name.toLowerCase() === currentUser.name.toLowerCase() ||
              donor.phone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '');

            const cleanPhoneDigits = donor.phone.replace(/\D/g, '');
            const whatsappLink = `https://wa.me/55${cleanPhoneDigits}?text=${encodeURIComponent(
              `Shalom, ${donor.name.split(' ')[0]}! Paz e Bem! 🕊️ (Célula Santa Gemma Galgani)`
            )}`;

            return (
              <div
                key={donor.id}
                className={`p-3.5 rounded-2xl border transition shadow-2xs space-y-3 ${
                  isCurrentUser
                    ? 'bg-gradient-to-r from-amber-50/90 via-white to-amber-50/40 border-[#E5C158] ring-2 ring-[#E5C158]/40'
                    : 'bg-white/95 border-[#ECE7DF] hover:border-amber-300/80'
                }`}
              >
                {/* Top Row: Photo + Main Info */}
                <div className="flex items-start gap-3">
                  {/* Photo with Camera Overlay Button */}
                  <div className="relative group shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditingPhotoDonor(donor)}
                      title="Clique para trocar a foto de perfil"
                      className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#7B1113]/30 group-hover:border-[#7B1113] shadow-xs bg-[#FAF8F5] flex items-center justify-center transition cursor-pointer relative"
                    >
                      {donor.avatarUrl ? (
                        <img
                          src={donor.avatarUrl}
                          alt={donor.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-amber-100 to-rose-100 flex flex-col items-center justify-center text-[#7B1113]">
                          <span className="font-bold text-sm font-cinzel">
                            {donor.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                          </span>
                        </div>
                      )}

                      {/* Camera Overlay Badge */}
                      <span className="absolute bottom-0 right-0 w-5 h-5 rounded-tl-lg bg-[#7B1113] text-[#E5C158] flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
                        <Camera className="w-3 h-3" />
                      </span>
                    </button>
                  </div>

                  {/* Member Name and Badges */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs sm:text-sm font-bold text-[#241E1C] truncate leading-tight">
                        {donor.name}
                      </h4>
                      {isCurrentUser && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full bg-[#E5C158] text-[#36070D] shadow-2xs">
                          Você 🌟
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap mt-1">
                      {donor.leadershipBadge && (
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                            donor.leadershipBadge.includes('👑') || donor.leadershipBadge.includes('Principal')
                              ? 'bg-[#7B1113] text-[#FFF0BE] border-[#E5C158] shadow-2xs'
                              : donor.leadershipBadge.includes('⭐') || donor.leadershipBadge.includes('Auxiliar')
                              ? 'bg-amber-100 text-[#36070D] border-amber-300 font-extrabold shadow-2xs'
                              : donor.leadershipBadge.includes('Coordenador') || donor.leadershipBadge.includes('Formador')
                              ? 'bg-[#7B1113] text-[#FFF0BE] border-[#E5C158]'
                              : 'bg-rose-100 text-rose-900 border-rose-200'
                          }`}
                        >
                          {donor.leadershipBadge}
                        </span>
                      )}

                      {donor.maritalStatus && (
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#554741] border border-[#ECE7DF]">
                          {donor.maritalStatus}
                        </span>
                      )}
                    </div>

                    {/* Phone & Birthday Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-[#70645E] mt-2">
                      <span className="flex items-center gap-1 truncate">
                        <Phone className="w-3 h-3 text-[#7B1113] shrink-0" />
                        <span>{donor.phone}</span>
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Cake className="w-3 h-3 text-amber-600 shrink-0" />
                        <span>Nasc: <strong>{donor.birthDate}</strong></span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="pt-2 border-t border-[#F2EFE9] flex items-center justify-between gap-1.5 flex-wrap">
                  {/* Left: Quick Photo Button */}
                  <button
                    type="button"
                    onClick={() => setEditingPhotoDonor(donor)}
                    className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#7B1113] border border-amber-200/80 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer active:scale-95"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#7B1113]" />
                    <span>{donor.avatarUrl ? 'Trocar Foto' : '+ Colocar Foto'}</span>
                  </button>

                  {/* Right: WhatsApp + Actions */}
                  <div className="flex items-center gap-1.5">
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#075E54] border border-[#25D366]/30 text-[11px] font-bold flex items-center gap-1 transition cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#075E54]" />
                      <span>WhatsApp</span>
                    </a>

                    {!isCurrentUser && (
                      <button
                        type="button"
                        onClick={() => handleSetActiveUser(donor)}
                        title="Ativar este membro como o usuário atual do app"
                        className="px-2 py-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#554741] border border-[#ECE7DF] text-[10px] font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                        <span className="hidden sm:inline">Sou Eu</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(donor)}
                      title="Editar cadastro deste membro"
                      className="p-1.5 rounded-xl bg-white hover:bg-[#FAF8F5] text-[#70645E] hover:text-[#7B1113] border border-[#ECE7DF] transition cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {(currentRole === 'admin' || currentRole === 'formador') && onDeleteDonor && donors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Deseja realmente remover ${donor.name} da lista de membros?`)) {
                            onDeleteDonor(donor.id);
                            showToast(`Membro ${donor.name.split(' ')[0]} removido.`);
                          }
                        }}
                        title="Remover membro"
                        className="p-1.5 rounded-xl text-[#8A7C75] hover:text-red-600 transition cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL DE TROCA DE FOTO DE QUALQUER MEMBRO */}
      {editingPhotoDonor && (
        <PhotoChangeModal
          isOpen={Boolean(editingPhotoDonor)}
          onClose={() => setEditingPhotoDonor(null)}
          currentPhotoUrl={editingPhotoDonor.avatarUrl || ''}
          targetName={editingPhotoDonor.name}
          onSavePhoto={handleSavePhoto}
          canSetAsActiveUser={editingPhotoDonor.name.toLowerCase() !== currentUser.name.toLowerCase()}
          onSetAsActiveUser={() => handleSetActiveUser(editingPhotoDonor)}
        />
      )}

      {/* MODAL DE CADASTRO / EDIÇÃO DE DADOS DO MEMBRO */}
      <Modal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        title={editingDonorId ? 'Editar Cadastro do Membro' : 'Novo Membro da Célula'}
        subtitle="Atualize nome, telefone, aniversário e foto de perfil"
      >
        <form onSubmit={handleSaveMember} className="space-y-3">
          {/* Foto Preview & Alterar */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#FAF8F5] border border-[#ECE7DF]">
            <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-[#7B1113] bg-white flex items-center justify-center shrink-0">
              {formPhoto ? (
                <img src={formPhoto} alt="Foto" className="w-full h-full object-cover" />
              ) : (
                <Users className="w-6 h-6 text-[#7B1113] opacity-50" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Foto de Perfil
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="URL da foto ou toque em trocar"
                  value={formPhoto}
                  onChange={(e) => setFormPhoto(e.target.value)}
                  className="flex-1 rounded-xl border border-[#D9D0C5] px-2.5 py-1.5 text-xs bg-white focus:outline-[#7B1113]"
                />
                {formPhoto && (
                  <button
                    type="button"
                    onClick={() => setFormPhoto('')}
                    className="p-1.5 text-red-600 text-xs font-bold"
                  >
                    Limpar
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Maria dos Santos Silva"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Telefone / WhatsApp *
              </label>
              <input
                type="text"
                required
                placeholder="(85) 99999-9999"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Data de Nascimento
              </label>
              <input
                type="text"
                placeholder="DD/MM/AAAA (ex: 26/01/1983)"
                value={formBirth}
                onChange={(e) => setFormBirth(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Estado Civil
              </label>
              <select
                value={formMarital}
                onChange={(e) => setFormMarital(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              >
                <option value="Solteiro(a)">Solteiro(a)</option>
                <option value="Casado(a)">Casado(a)</option>
                <option value="Consagrado(a)">Consagrado(a)</option>
                <option value="Viúvo(a)">Viúvo(a)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Função na Célula
              </label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
              >
                <option value="Membro">Membro da Célula</option>
                <option value="👑 Formadora Principal & Coordenadora (Acesso Total)">👑 Formadora Principal & Coordenadora (Acesso Total)</option>
                <option value="⭐ Formador Auxiliar & Coordenador (Acesso Total)">⭐ Formador Auxiliar & Coordenador (Acesso Total)</option>
                <option value="⭐ Formadora Auxiliar (Acesso Total)">⭐ Formadora Auxiliar (Acesso Total)</option>
                <option value="Formador(a)">Formador(a)</option>
                <option value="Intercessor(a)">Intercessor(a)</option>
                <option value="Ministério de Música">Música & Louvor</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              E-mail (opcional)
            </label>
            <input
              type="email"
              placeholder="exemplo@shalom.org"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="pt-2 border-t border-[#ECE7DF] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsMemberModalOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D9D0C5] bg-white text-xs font-bold text-[#70645E] hover:bg-[#EFEAE2] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] shadow-sm transition cursor-pointer"
            >
              Salvar Membro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
