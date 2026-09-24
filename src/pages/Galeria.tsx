import React, { useState } from 'react';
import { 
  ArrowLeft, 
  PlusCircle, 
  Maximize2,
  Check
} from 'lucide-react';
import { GalleryAlbum, GalleryPhoto } from '../types';
import { Modal } from '../components/common/Modal';

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
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoCaption, setPhotoCaption] = useState('');

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

  const handleAddPhotoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!photoUrl.trim() || !selectedAlbumId || !onAddPhoto) return;

    onAddPhoto(selectedAlbumId, {
      url: photoUrl.trim(),
      caption: photoCaption.trim() || undefined,
      author: 'Eu',
      date: new Date().toLocaleDateString('pt-BR'),
    });

    setPhotoUrl('');
    setPhotoCaption('');
    setIsAddPhotoOpen(false);
    showToast('Foto adicionada ao álbum com sucesso!');
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

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={selectedAlbum ? () => setSelectedAlbumId(null) : onBack}
            className="p-1.5 rounded-xl bg-white/90 backdrop-blur-sm border border-[#ECE7DF] text-[#70645E] hover:text-[#241E1C] active:scale-95 transition cursor-pointer"
            aria-label="Voltar"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-[#241E1C] font-cinzel">
              {selectedAlbum ? selectedAlbum.title : 'Galeria da Célula'}
            </h2>
            <p className="text-xs text-[#70645E]">
              {selectedAlbum ? `${selectedAlbum.photos.length} fotos salvas` : 'Memórias e encontros comunitários'}
            </p>
          </div>
        </div>

        {selectedAlbum && onAddPhoto && (
          <button
            type="button"
            onClick={() => setIsAddPhotoOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#7B1113] text-white text-xs font-bold shadow-xs hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Adicionar Foto</span>
          </button>
        )}
      </div>

      {/* Album List View */}
      {!selectedAlbum ? (
        <div className="grid grid-cols-2 gap-3">
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
                <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-black/60 text-white backdrop-blur-xs">
                  {album.photos.length} fotos
                </span>
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
          <div className="grid grid-cols-2 gap-2.5">
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

      {/* Add Photo Modal */}
      <Modal
        isOpen={isAddPhotoOpen}
        onClose={() => setIsAddPhotoOpen(false)}
        title="Adicionar Foto ao Álbum"
        subtitle={selectedAlbum?.title || 'Galeria'}
      >
        <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              URL da Imagem *
            </label>
            <input
              type="url"
              required
              placeholder="https://exemplo.com/foto.jpg"
              value={photoUrl}
              onChange={e => setPhotoUrl(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#36070D] mb-1">
              Legenda da Foto (Opcional)
            </label>
            <input
              type="text"
              placeholder="Ex: Momento de louvor na célula..."
              value={photoCaption}
              onChange={e => setPhotoCaption(e.target.value)}
              className="w-full rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
            />
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddPhotoOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#70645E] hover:bg-[#EFEAE2] active:scale-95 transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] active:scale-95 transition cursor-pointer"
            >
              Salvar Foto
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
