import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  Maximize2,
  Check,
  Camera,
  Upload,
  Trash2,
  FolderOpen
} from 'lucide-react';
import { GalleryAlbum, GalleryPhoto } from '../types';
import { Modal } from '../components/common/Modal';
import { compressAndReadImageFile } from '../utils/imageUpload';

interface GaleriaProps {
  albums: GalleryAlbum[];
  onBack: () => void;
  onAddPhoto?: (albumId: string, photo: Omit<GalleryPhoto, 'id'>) => void;
}

export const Galeria: React.FC<GaleriaProps> = ({ 
  albums, 
  onBack,
  onAddPhoto,
}) => {
  const [selectedAlbumId, setSelectedAlbumId] = useState<string | null>(null);
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);
  const [isAddPhotoOpen, setIsAddPhotoOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for new photo
  const [targetAlbumId, setTargetAlbumId] = useState<string>(albums[0]?.id || '');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');
  const [photoAuthor, setPhotoAuthor] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const selectedAlbum = selectedAlbumId ? albums.find(a => a.id === selectedAlbumId) || null : null;

  const categoryLabels = {
    retiro: 'Retiro',
    encontro: 'Encontro',
    lanche: 'Lanche Fraterno',
    formacao: 'Formação',
    momentos: 'Momentos',
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const openAddPhotoModal = (albumId?: string) => {
    setTargetAlbumId(albumId || selectedAlbumId || albums[0]?.id || '');
    setIsAddPhotoOpen(true);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const dataUrl = await compressAndReadImageFile(file);
      setPhotoUrl(dataUrl);
      showToast('📷 Foto carregada com sucesso! Clique em Salvar Foto.');
    } catch {
      showToast('Não foi possível processar a imagem selecionada.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const destinationAlbumId = selectedAlbumId || targetAlbumId || albums[0]?.id;
    if (!photoUrl.trim() || !destinationAlbumId || !onAddPhoto) return;

    onAddPhoto(destinationAlbumId, {
      url: photoUrl.trim(),
      caption: photoCaption.trim() || 'Momento da Célula Santa Gemma Galgani',
      author: photoAuthor.trim() || 'Membro da Célula',
      date: new Date().toLocaleDateString('pt-BR'),
    });

    setPhotoUrl('');
    setPhotoCaption('');
    setPhotoAuthor('');
    setIsAddPhotoOpen(false);
    setSelectedAlbumId(destinationAlbumId);
    showToast('📷 Foto salva no álbum da célula com sucesso!');
  };

  return (
    <div className="pb-24 pt-3 px-4 space-y-4">
      {/* Toast feedback */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-full bg-[#36070D] text-white px-4 py-2 text-xs font-semibold shadow-xl border border-[#E5C158] animate-in fade-in">
          <Check className="w-3.5 h-3.5 text-[#E5C158]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Responsivo */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={selectedAlbum ? () => setSelectedAlbumId(null) : onBack}
            className="p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#ECE7DF] text-[#70645E] hover:text-[#241E1C] active:scale-95 transition cursor-pointer shrink-0"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#241E1C] font-cinzel truncate">
              {selectedAlbum ? selectedAlbum.title : 'Galeria de Fotos da Célula'}
            </h2>
            <p className="text-xs text-[#70645E] truncate">
              {selectedAlbum ? `${selectedAlbum.photos.length} fotos salvas neste álbum` : 'Toque em Salvar Foto ou escolha um álbum abaixo'}
            </p>
          </div>
        </div>

        {onAddPhoto && (
          <button
            type="button"
            onClick={() => openAddPhotoModal(selectedAlbum?.id)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-sm hover:bg-[#580C14] active:scale-95 transition cursor-pointer shrink-0"
          >
            <Camera className="w-4 h-4" />
            <span>Salvar Foto</span>
          </button>
        )}
      </div>

      {/* Card Rápido de Upload no Topo da Galeria */}
      {!selectedAlbum && onAddPhoto && (
        <div className="rounded-2xl bg-gradient-to-br from-[#7B1113]/95 to-[#4A0A10]/95 p-4 text-white shadow-sm border border-[#E5C158]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#FFF0BE] font-cinzel flex items-center gap-1.5">
              <Camera className="w-4 h-4 text-[#E5C158]" />
              <span>Guardar Memórias da Célula</span>
            </h3>
            <p className="text-xs text-white/90 leading-relaxed">
              Envie fotos dos encontros de segunda e sexta-feira, lanches fraternos ou retiros direto do seu celular ou computador.
            </p>
          </div>
          <button
            type="button"
            onClick={() => openAddPhotoModal()}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#E5C158] hover:bg-[#f2cf66] text-[#36070D] text-xs font-extrabold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer shrink-0"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Abrir Página para Salvar Fotos</span>
          </button>
        </div>
      )}

      {/* Album List View */}
      {!selectedAlbum ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {albums.map(album => (
            <div
              key={album.id}
              onClick={() => setSelectedAlbumId(album.id)}
              className="group cursor-pointer rounded-2xl bg-white/90 backdrop-blur-md overflow-hidden shadow-sm border border-white/70 hover:shadow-md transition text-left"
            >
              <div className="aspect-4/3 w-full bg-[#F4EFEB] overflow-hidden relative">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-black/65 text-white backdrop-blur-xs">
                  {album.photos.length} fotos
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openAddPhotoModal(album.id);
                  }}
                  className="absolute bottom-2 right-2 text-[10px] font-bold px-2.5 py-1 rounded-lg bg-[#7B1113] text-white shadow-sm hover:bg-[#580C14] flex items-center gap-1 cursor-pointer active:scale-95"
                >
                  <Camera className="w-3 h-3" />
                  <span>+ Foto</span>
                </button>
              </div>
              <div className="p-3 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#7B1113]">
                  {categoryLabels[album.category] || album.category}
                </span>
                <h3 className="text-xs font-bold text-[#241E1C] leading-snug truncate">
                  {album.title}
                </h3>
                <p className="text-[10px] text-[#8A7C75]">{album.date}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Inside Album Photo Grid */
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {selectedAlbum.photos.map(photo => (
              <div
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className="group relative cursor-pointer aspect-square rounded-xl overflow-hidden bg-[#F4EFEB] border border-white/70 shadow-xs"
              >
                <img
                  src={photo.url}
                  alt={photo.caption || 'Foto da célula'}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                  <Maximize2 className="w-5 h-5 drop-shadow" />
                </div>
                {photo.caption && (
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-1.5 text-[10px] text-white truncate">
                    {photo.caption}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <Modal
        isOpen={Boolean(activePhoto)}
        onClose={() => setActivePhoto(null)}
        title={activePhoto?.caption || 'Foto da Célula'}
        subtitle={`Enviado por ${activePhoto?.author || 'Membro'} • ${activePhoto?.date || ''}`}
      >
        {activePhoto && (
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden bg-black max-h-[65vh] flex items-center justify-center">
              <img
                src={activePhoto.url}
                alt={activePhoto.caption || 'Foto'}
                className="w-full h-auto max-h-[65vh] object-contain"
              />
            </div>
            {activePhoto.caption && (
              <p className="text-xs text-[#423834] bg-[#FBF9F5] p-2.5 rounded-xl border border-[#EDE8E0]">
                {activePhoto.caption}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold active:scale-95 transition cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Add Photo Modal (Responsivo e Centralizado) */}
      <Modal
        isOpen={isAddPhotoOpen}
        onClose={() => setIsAddPhotoOpen(false)}
        title="Salvar Nova Foto na Galeria"
        subtitle={selectedAlbum?.title || 'Escolha a foto do seu celular ou computador'}
      >
        <form onSubmit={handleAddPhotoSubmit} className="space-y-3.5">
          {/* Seleção de Álbum quando aberto da tela principal */}
          {!selectedAlbum && (
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1 flex items-center gap-1.5">
                <FolderOpen className="w-3.5 h-3.5 text-[#7B1113]" />
                <span>Álbum de Destino *</span>
              </label>
              <select
                value={targetAlbumId}
                onChange={e => setTargetAlbumId(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2.5 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113]"
              >
                {albums.map(alb => (
                  <option key={alb.id} value={alb.id}>
                    {alb.title} ({alb.photos.length} fotos)
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Upload Responsivo do Aparelho ou Câmera */}
          <div className="rounded-2xl p-3.5 bg-gradient-to-br from-rose-50/90 to-amber-50/70 border border-[#7B1113]/30 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#36070D] flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-[#7B1113]" />
                <span>Selecionar Foto do Aparelho *</span>
              </label>
              {isUploading && (
                <span className="text-[10px] font-bold text-[#7B1113] animate-pulse">
                  Carregando imagem...
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold shadow-xs cursor-pointer active:scale-95 transition text-center">
                <Upload className="w-4 h-4 shrink-0" />
                <span>Escolher da Galeria</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <label className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-amber-100 hover:bg-amber-200 text-[#36070D] border border-amber-300 text-xs font-bold cursor-pointer active:scale-95 transition text-center">
                <Camera className="w-4 h-4 text-[#7B1113] shrink-0" />
                <span>Tirar Foto Agora</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {photoUrl && (
              <div className="relative rounded-xl overflow-hidden bg-black/90 border border-[#D9D0C5] max-h-52 flex items-center justify-center">
                <img
                  src={photoUrl}
                  alt="Prévia da foto"
                  className="w-full h-auto max-h-52 object-contain"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl('')}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-700/90 hover:bg-red-800 text-white text-[10px] font-bold flex items-center gap-1 shadow-md cursor-pointer active:scale-95"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Remover</span>
                </button>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-semibold text-[#70645E] mb-1">
                Ou cole o link (URL) da foto (Opcional):
              </label>
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={photoUrl.startsWith('data:') ? '' : photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Legenda da Foto (Opcional)
              </label>
              <input
                type="text"
                placeholder="Ex: Louvor e comunhão na célula..."
                value={photoCaption}
                onChange={e => setPhotoCaption(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2.5 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#36070D] mb-1">
                Enviado por (Opcional)
              </label>
              <input
                type="text"
                placeholder="Seu nome na célula"
                value={photoAuthor}
                onChange={e => setPhotoAuthor(e.target.value)}
                className="w-full rounded-xl border border-[#D9D0C5] px-3 py-2.5 text-xs bg-white text-[#241E1C] focus:outline-[#7B1113]"
              />
            </div>
          </div>

          <div className="pt-2 border-t border-[#ECE7DF] grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddPhotoOpen(false)}
              className="w-full py-2.5 px-4 rounded-xl border border-[#D9D0C5] bg-white text-xs font-bold text-[#70645E] hover:bg-[#EFEAE2] active:scale-95 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!photoUrl.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-[#7B1113] disabled:opacity-40 text-white text-xs font-bold hover:bg-[#580C14] shadow-sm active:scale-95 transition cursor-pointer"
            >
              Salvar Foto
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

