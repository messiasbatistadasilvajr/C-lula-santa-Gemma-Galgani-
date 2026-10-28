import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  Link as LinkIcon, 
  Check, 
  X, 
  Trash2, 
  User, 
  Image as ImageIcon 
} from 'lucide-react';

export interface PhotoChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPhotoUrl?: string;
  targetName: string;
  onSavePhoto: (photoUrl: string) => void;
  canSetAsActiveUser?: boolean;
  onSetAsActiveUser?: () => void;
}

export const CATHOLIC_AVATARS = [
  {
    id: 'sta_gemma',
    name: 'Santa Gemma Galgani',
    subtitle: 'Padroeira da Célula',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'carlo_acutis',
    name: 'Beato Carlo Acutis',
    subtitle: 'Apóstolo da Eucaristia',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sta_teresinha',
    name: 'Santa Teresinha',
    subtitle: 'Doutora do Amor',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sao_francisco',
    name: 'São Francisco de Assis',
    subtitle: 'Paz e Bem',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sao_joao_paulo_ii',
    name: 'São João Paulo II',
    subtitle: 'Totus Tuus',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'nossa_senhora',
    name: 'Nossa Senhora',
    subtitle: 'Mãe da Divina Graça',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sao_jose',
    name: 'São José',
    subtitle: 'Guardião da Sagrada Família',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'sta_faustina',
    name: 'Santa Faustina',
    subtitle: 'Apóstola da Misericórdia',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'jovem_homem',
    name: 'Jovem Discípulo',
    subtitle: 'Vocação e Missão',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'jovem_mulher',
    name: 'Jovem Discípula',
    subtitle: 'Consagração e Louvor',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  },
];

export const PhotoChangeModal: React.FC<PhotoChangeModalProps> = ({
  isOpen,
  onClose,
  currentPhotoUrl = '',
  targetName,
  onSavePhoto,
  canSetAsActiveUser = false,
  onSetAsActiveUser,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'avatars' | 'url'>('upload');
  const [selectedPhoto, setSelectedPhoto] = useState<string>(currentPhotoUrl);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [setAsMeChecked, setSetAsMeChecked] = useState(false);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const triggerGallery = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
      galleryInputRef.current.click();
    }
  };

  const triggerCamera = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (cameraInputRef.current) {
      cameraInputRef.current.value = '';
      cameraInputRef.current.click();
    }
  };

  // Reset state when opening
  React.useEffect(() => {
    if (isOpen) {
      setSelectedPhoto(currentPhotoUrl);
      setUrlInput(currentPhotoUrl.startsWith('http') ? currentPhotoUrl : '');
      setErrorMsg(null);
      setIsProcessing(false);
      setSetAsMeChecked(false);
    }
  }, [isOpen, currentPhotoUrl]);

  if (!isOpen) return null;

  // Process and compress image to a performant data URL (max 320x320)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/') || /\.(jpe?g|png|webp|gif|bmp|heic|heif)$/i.test(file.name);
    if (!isImage) {
      setErrorMsg('Por favor selecione um arquivo de imagem válido (JPG, PNG, WebP).');
      if (e.target) e.target.value = '';
      return;
    }

    setIsProcessing(true);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const maxDim = 320;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
            setSelectedPhoto(compressedDataUrl);
          } else {
            setSelectedPhoto(event.target?.result as string);
          }
        } catch {
          setSelectedPhoto(event.target?.result as string);
        } finally {
          setIsProcessing(false);
          if (e.target) e.target.value = '';
        }
      };
      img.onerror = () => {
        setErrorMsg('Erro ao ler a imagem. Tente outra foto da galeria.');
        setIsProcessing(false);
        if (e.target) e.target.value = '';
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMsg('Erro ao carregar o arquivo da galeria.');
      setIsProcessing(false);
      if (e.target) e.target.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) {
      setErrorMsg('Por favor informe o link da foto.');
      return;
    }
    setSelectedPhoto(urlInput.trim());
    setErrorMsg(null);
  };

  const handleSave = () => {
    onSavePhoto(selectedPhoto);
    if (setAsMeChecked && onSetAsActiveUser) {
      onSetAsActiveUser();
    }
    onClose();
  };

  const handleRemovePhoto = () => {
    setSelectedPhoto('');
    onSavePhoto('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-amber-200/60 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#7B1113] via-[#580C14] to-[#36070D] p-4 text-white relative">
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2 mb-1">
            <Camera className="w-4 h-4 text-[#E5C158]" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#E5C158]">
              Foto de Perfil
            </span>
          </div>
          <h3 className="text-base font-bold font-cinzel leading-tight pr-6">
            Trocar Foto de {targetName}
          </h3>
          <p className="text-[11px] text-white/80 mt-0.5">
            Adicione sua foto pelo celular, galeria ou escolha um avatar devocional
          </p>
        </div>

        {/* Live Preview Card */}
        <div className="bg-gradient-to-b from-amber-50/60 to-white p-4 border-b border-[#ECE7DF] flex flex-col sm:flex-row items-center gap-4">
          <div className="relative group shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-3 border-[#7B1113] shadow-md bg-white flex items-center justify-center">
              {selectedPhoto ? (
                <img
                  src={selectedPhoto}
                  alt={targetName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-[#FAF8F5] flex flex-col items-center justify-center text-[#7B1113]">
                  <User className="w-8 h-8 opacity-40" />
                  <span className="text-[9px] font-bold mt-1 text-[#8A7C75]">Sem foto</span>
                </div>
              )}
            </div>
            {selectedPhoto && (
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Check className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="text-center sm:text-left min-w-0 flex-1">
            <h4 className="text-xs font-bold text-[#241E1C] truncate">{targetName}</h4>
            <p className="text-[11px] text-[#70645E] mt-0.5">
              {selectedPhoto
                ? 'Foto pré-visualizada e pronta para ser salva no perfil.'
                : 'Nenhuma foto selecionada no momento.'}
            </p>
            {selectedPhoto && (
              <button
                type="button"
                onClick={() => setSelectedPhoto('')}
                className="mt-2 text-[10px] font-bold text-red-700 hover:text-red-900 inline-flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3 h-3" />
                <span>Remover foto selecionada</span>
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#ECE7DF] bg-[#FAF8F5] px-3 pt-2 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'upload'
                ? 'bg-white text-[#7B1113] border-t-2 border-[#7B1113] shadow-xs'
                : 'text-[#70645E] hover:text-[#241E1C]'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Celular / Arquivo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('avatars')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'avatars'
                ? 'bg-white text-[#7B1113] border-t-2 border-[#7B1113] shadow-xs'
                : 'text-[#70645E] hover:text-[#241E1C]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Santos & Avatares</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex-1 py-2 px-2 text-xs font-bold rounded-t-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
              activeTab === 'url'
                ? 'bg-white text-[#7B1113] border-t-2 border-[#7B1113] shadow-xs'
                : 'text-[#70645E] hover:text-[#241E1C]'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Link / URL</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: UPLOAD DE ARQUIVO OU CÂMERA */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              {/* Inputs ocultos acionados via ref */}
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*,image/jpeg,image/png,image/webp,image/heic,image/heif"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileChange}
                className="hidden"
                aria-hidden="true"
              />

              {/* Opção 1: Escolher da Galeria do Celular (Botão direto com ref trigger) */}
              <button
                type="button"
                onClick={triggerGallery}
                className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-[#7B1113] hover:bg-[#580C14] text-white cursor-pointer active:scale-98 transition shadow-md border border-[#7B1113] group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/15 text-[#E5C158] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold leading-tight text-white">
                      Escolher da Galeria do Celular
                    </span>
                    <span className="text-[10px] text-[#FFF0BE] font-medium block mt-0.5">
                      Abrir álbuns de fotos, galeria e arquivos
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-white/20 text-[#FFF0BE] text-[10px] font-bold shrink-0">
                  Galeria 🖼️
                </span>
              </button>

              {/* Opção 2: Tirar Foto com a Câmera */}
              <button
                type="button"
                onClick={triggerCamera}
                className="w-full flex items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 hover:bg-amber-100 text-[#36070D] cursor-pointer active:scale-98 transition border-2 border-amber-300 shadow-xs group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#7B1113] text-[#E5C158] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xs font-bold leading-tight text-[#36070D]">
                      Tirar Foto com a Câmera
                    </span>
                    <span className="text-[10px] text-[#70645E] font-medium block mt-0.5">
                      Abrir a câmera do smartphone para selfie
                    </span>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-xl bg-amber-200/80 text-[#36070D] text-[10px] font-bold shrink-0">
                  Câmera 📷
                </span>
              </button>

              {/* Área alternativa de toque/arraste para Galeria */}
              <button
                type="button"
                onClick={triggerGallery}
                className="w-full border-2 border-dashed border-[#DFD8CE] hover:border-[#7B1113] rounded-2xl p-4 text-center bg-[#FAF8F5] hover:bg-amber-50/40 transition cursor-pointer flex flex-col items-center justify-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7B1113]/10 text-[#7B1113] flex items-center justify-center transition-colors mb-1.5 group-hover:scale-105">
                  <Upload className="w-5 h-5" />
                </div>
                <h5 className="text-xs font-bold text-[#241E1C]">
                  Ou toque aqui para selecionar uma imagem
                </h5>
                <p className="text-[10px] text-[#70645E] mt-0.5">
                  Formatos aceitos: JPG, PNG, WebP e fotos da câmera
                </p>
              </button>

              {isProcessing && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#7B1113] border-t-transparent rounded-full animate-spin" />
                  <span>Otimizando e preparando foto para o perfil...</span>
                </div>
              )}

              <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#ECE7DF] text-[11px] text-[#70645E] space-y-1">
                <p className="font-semibold text-[#36070D]">💡 Dicas para a foto:</p>
                <p>• Fotos quadradas com boa iluminação no rosto ficam perfeitas.</p>
                <p>• O sistema reduz o tamanho automaticamente para carregar rápido e sem travar.</p>
              </div>
            </div>
          )}

          {/* TAB 2: AVATARES DEVOCIONAIS & SANTOS */}
          {activeTab === 'avatars' && (
            <div className="space-y-2.5">
              <p className="text-xs text-[#70645E]">
                Selecione uma imagem de devoção ou representação da comunidade para seu perfil:
              </p>

              <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                {CATHOLIC_AVATARS.map((av) => {
                  const isSelected = selectedPhoto === av.url;
                  return (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        setSelectedPhoto(av.url);
                        setErrorMsg(null);
                      }}
                      className={`p-2 rounded-2xl border text-left transition flex items-center gap-2.5 cursor-pointer ${
                        isSelected
                          ? 'border-[#7B1113] bg-amber-50/80 shadow-xs ring-2 ring-[#7B1113]/30'
                          : 'border-[#ECE7DF] bg-white hover:bg-[#FAF8F5]'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.name}
                        className="w-10 h-10 rounded-xl object-cover shrink-0 border border-black/10"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h6 className="text-[11px] font-bold text-[#241E1C] truncate leading-tight">
                            {av.name}
                          </h6>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#7B1113] shrink-0 ml-1" />
                          )}
                        </div>
                        <span className="text-[9px] text-[#8A7C75] block truncate mt-0.5">
                          {av.subtitle}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: LINK / URL DA IMAGEM */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#36070D] mb-1">
                  Endereço da Imagem (URL na web)
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="url"
                    placeholder="https://exemplo.com/minha-foto.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    className="flex-1 rounded-xl border border-[#D9D0C5] p-2 text-xs bg-white focus:outline-[#7B1113]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="px-3 py-2 rounded-xl bg-[#7B1113] text-white text-xs font-bold hover:bg-[#580C14] cursor-pointer"
                  >
                    Carregar
                  </button>
                </div>
              </div>

              <p className="text-[11px] text-[#70645E]">
                Você pode colar links diretos de fotos hospedadas no Google Fotos, Imgur, WhatsApp Web ou redes sociais.
              </p>
            </div>
          )}

          {/* Opção opcional: Definir como Meu Perfil Ativo */}
          {canSetAsActiveUser && onSetAsActiveUser && (
            <label className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 cursor-pointer text-xs text-[#36070D]">
              <input
                type="checkbox"
                checked={setAsMeChecked}
                onChange={(e) => setSetAsMeChecked(e.target.checked)}
                className="mt-0.5 rounded text-[#7B1113] focus:ring-[#7B1113]"
              />
              <span className="leading-tight">
                <strong>Sou este membro!</strong> Ativar este perfil como meu usuário principal neste celular.
              </span>
            </label>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#ECE7DF] flex items-center justify-between gap-2">
          {currentPhotoUrl ? (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="py-2.5 px-3 rounded-xl border border-red-200 text-red-700 bg-red-50/60 hover:bg-red-100 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Excluir Foto</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 rounded-xl border border-[#D9D0C5] bg-white text-xs font-bold text-[#70645E] hover:bg-[#EFEAE2] transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="py-2.5 px-5 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold shadow-md flex items-center gap-1.5 transition cursor-pointer active:scale-95"
            >
              <Check className="w-3.5 h-3.5 text-[#E5C158]" />
              <span>Salvar Foto</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
