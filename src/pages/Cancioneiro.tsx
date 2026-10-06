import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Music, 
  Sparkles, 
  Sliders, 
  Plus, 
  X, 
  Volume2, 
  FileText,
  Flame,
  ChevronRight,
  Radio
} from 'lucide-react';
import { CellSong, SongCategory, UserRole } from '../types';

interface CancioneiroProps {
  songs: CellSong[];
  currentRole: UserRole;
  onAddSong: (song: Omit<CellSong, 'id'>) => void;
  onBack: () => void;
  onNavigate?: (tab: string) => void;
}

const CATEGORY_LABELS: Record<SongCategory, { label: string; color: string }> = {
  louvor: { label: 'Louvor', color: 'bg-amber-100 text-amber-900 border-amber-200' },
  adoracao: { label: 'Adoração', color: 'bg-purple-100 text-purple-900 border-purple-200' },
  espirito_santo: { label: 'Espírito Santo', color: 'bg-rose-100 text-rose-900 border-rose-200' },
  mariano: { label: 'Mariano', color: 'bg-blue-100 text-blue-900 border-blue-200' },
  santa_gemma: { label: 'Santa Gemma', color: 'bg-emerald-100 text-emerald-900 border-emerald-200' },
  comunhao: { label: 'Comunhão', color: 'bg-teal-100 text-teal-900 border-teal-200' },
  perdao: { label: 'Perdão', color: 'bg-gray-100 text-gray-800 border-gray-200' },
};

const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

function transposeChords(text: string, semitones: number): string {
  if (semitones === 0) return text;
  // Match chord tokens
  return text.replace(/\b([A-G][b#]?)(m|maj|min|dim|aug|sus[24]?|[2-9]|add[2-9]|7M|M)?(\/[A-G][b#]?)?\b/g, (match, root, ext = '', slash = '') => {
    const idx = NOTES.indexOf(root);
    if (idx === -1) return match;
    let newIdx = (idx + semitones) % 12;
    if (newIdx < 0) newIdx += 12;
    const newRoot = NOTES[newIdx];

    let newSlash = '';
    if (slash) {
      const slashRoot = slash.replace('/', '');
      const sIdx = NOTES.indexOf(slashRoot);
      if (sIdx !== -1) {
        let newSIdx = (sIdx + semitones) % 12;
        if (newSIdx < 0) newSIdx += 12;
        newSlash = '/' + NOTES[newSIdx];
      } else {
        newSlash = slash;
      }
    }
    return newRoot + ext + newSlash;
  });
}

export const Cancioneiro: React.FC<CancioneiroProps> = ({
  songs,
  currentRole,
  onAddSong,
  onBack,
  onNavigate,
}) => {
  const [selectedSong, setSelectedSong] = useState<CellSong | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showChords, setShowChords] = useState(true);
  const [transposeOffset, setTransposeOffset] = useState(0);
  const [fontSize, setFontSize] = useState<'normal' | 'large'>('normal');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Song Form State
  const [newTitle, setNewTitle] = useState('');
  const [newArtist, setNewArtist] = useState('');
  const [newCategory, setNewCategory] = useState<SongCategory>('louvor');
  const [newKey, setNewKey] = useState('G');
  const [newMoment, setNewMoment] = useState('');
  const [newLyrics, setNewLyrics] = useState('');

  const filteredSongs = useMemo(() => {
    return songs.filter(song => {
      const matchesSearch = 
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.lyrics.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || song.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [songs, searchQuery, selectedCategory]);

  const handleOpenSong = (song: CellSong) => {
    setSelectedSong(song);
    setTransposeOffset(0);
  };

  const handleSaveSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newLyrics.trim()) return;

    onAddSong({
      title: newTitle,
      artist: newArtist || 'Comunidade Shalom',
      category: newCategory,
      key: newKey || 'G',
      suggestedMoment: newMoment || 'Louvor',
      lyrics: newLyrics,
      hasChords: newLyrics.includes('[') || newLyrics.includes('Intro'),
    });

    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewArtist('');
    setNewMoment('');
    setNewLyrics('');
  };

  // Render Song View
  if (selectedSong) {
    const displayedLyrics = useMemo(() => {
      let text = selectedSong.lyrics;
      if (!showChords) {
        // Strip chord intro/tags
        text = text
          .replace(/\[Intro\].*?\n/g, '')
          .replace(/\[Refrão\].*?\n/g, '--- REFRÃO ---\n')
          .replace(/\b([A-G][b#]?)(m|maj|min|dim|aug|sus[24]?|[2-9]|add[2-9]|7M|M)?(\/[A-G][b#]?)?\b/g, '')
          .replace(/\n\s*\n\s*\n/g, '\n\n');
      } else if (transposeOffset !== 0) {
        text = transposeChords(text, transposeOffset);
      }
      return text;
    }, [selectedSong, showChords, transposeOffset]);

    const catBadge = CATEGORY_LABELS[selectedSong.category];

    return (
      <div className="space-y-4 px-4 py-3 animate-in fade-in duration-200">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setSelectedSong(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer active:scale-95 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Cancioneiro</span>
          </button>

          <div className="flex items-center gap-2">
            {/* Font size */}
            <button
              type="button"
              onClick={() => setFontSize(f => f === 'normal' ? 'large' : 'normal')}
              className="py-1 px-2.5 rounded-lg bg-white border border-[#DDD5C7] text-xs font-bold text-[#36070D] shadow-2xs"
            >
              {fontSize === 'normal' ? 'A+' : 'A-'}
            </button>

            {/* Toggle Chords */}
            <button
              type="button"
              onClick={() => setShowChords(!showChords)}
              className={`py-1 px-2.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs ${
                showChords 
                  ? 'bg-[#7B1113] text-white' 
                  : 'bg-white border border-[#DDD5C7] text-[#70645E]'
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>{showChords ? 'Com Cifras' : 'Só Letra'}</span>
            </button>
          </div>
        </div>

        {/* Song Header Card */}
        <div className="p-4 bg-linear-to-br from-[#7B1113] to-[#4A0A0C] text-white rounded-2xl shadow-md border border-[#E5C158]/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${catBadge.color}`}>
              {catBadge.label}
            </span>
            <span className="text-xs text-[#F3E7C4] font-mono font-bold bg-black/20 px-2 py-0.5 rounded">
              Tom Original: {selectedSong.key} {transposeOffset !== 0 && `(Transposto ${transposeOffset > 0 ? `+${transposeOffset}` : transposeOffset})`}
            </span>
          </div>

          <h2 className="text-lg font-bold font-cinzel text-white leading-tight">
            {selectedSong.title}
          </h2>
          <p className="text-xs text-[#F3E7C4]">
            {selectedSong.artist}
          </p>

          <div className="pt-1 border-t border-white/10 flex items-center justify-between text-[11px] text-[#F3E7C4]/80">
            <span>Momento sugerido: <strong>{selectedSong.suggestedMoment}</strong></span>
          </div>
        </div>

        {/* Transpose Controls */}
        {showChords && (
          <div className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#EDE8E0] shadow-2xs">
            <span className="text-xs font-bold text-[#36070D] flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#7B1113]" />
              Transpor Tom:
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTransposeOffset(prev => prev - 1)}
                className="w-7 h-7 rounded-lg bg-[#F4EFEB] hover:bg-[#EAE4DB] font-bold text-xs text-[#36070D] flex items-center justify-center cursor-pointer active:scale-95"
              >
                -1
              </button>
              <span className="text-xs font-mono font-bold text-[#7B1113] min-w-8 text-center">
                {transposeOffset === 0 ? '0' : transposeOffset > 0 ? `+${transposeOffset}` : transposeOffset}
              </span>
              <button
                type="button"
                onClick={() => setTransposeOffset(prev => prev + 1)}
                className="w-7 h-7 rounded-lg bg-[#F4EFEB] hover:bg-[#EAE4DB] font-bold text-xs text-[#36070D] flex items-center justify-center cursor-pointer active:scale-95"
              >
                +1
              </button>
              {transposeOffset !== 0 && (
                <button
                  type="button"
                  onClick={() => setTransposeOffset(0)}
                  className="text-[10px] text-[#8A7C75] hover:text-[#7B1113] underline ml-1 cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        )}

        {/* Lyrics / Chords Sheet */}
        <div className="p-4 bg-white/95 rounded-2xl border border-[#EDE8E0] shadow-2xs">
          <pre className={`font-mono text-[#241E1C] whitespace-pre-wrap leading-relaxed select-text ${
            fontSize === 'large' ? 'text-sm' : 'text-xs'
          }`}>
            {displayedLyrics}
          </pre>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('modo-encontro')}
            className="w-full py-2.5 px-3 rounded-xl bg-[#7B1113] hover:bg-[#580C14] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-[#FFF0BE] animate-pulse" />
            <span>Projetar Cânticos no Modo Encontro ao Vivo ⏱️</span>
          </button>
        )}
      </div>
    );
  }

  // Render Song List View
  return (
    <div className="space-y-4 px-4 py-3 animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#7B1113] hover:underline cursor-pointer active:scale-95 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="py-1.5 px-3 rounded-xl bg-[#7B1113] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs active:scale-95 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Sugerir Cântico</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="p-4 bg-linear-to-br from-[#7B1113] to-[#4A0A0C] text-white rounded-2xl shadow-md border border-[#E5C158]/30 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#E5C158] text-[#36070D] flex items-center justify-center">
            <Music className="w-4 h-4" />
          </div>
          <h2 className="text-base font-bold font-cinzel text-white">
            Cancioneiro da Célula
          </h2>
        </div>
        <p className="text-xs text-[#F3E7C4]/90 leading-relaxed">
          Cânticos de louvor, adoração, efusão do Espírito Santo e consagração com letras e cifras para os nossos encontros.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8A7C75]" />
        <input
          type="text"
          placeholder="Buscar por título, artista ou letra..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#DDD5C7] text-xs text-[#241E1C] placeholder-[#8A7C75] shadow-inner focus:outline-none focus:border-[#7B1113]"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`py-1 px-3 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
            selectedCategory === 'all'
              ? 'bg-[#7B1113] text-white shadow-xs'
              : 'bg-white text-[#70645E] border border-[#EDE8E0]'
          }`}
        >
          Todos ({songs.length})
        </button>
        {Object.entries(CATEGORY_LABELS).map(([catKey, info]) => {
          const count = songs.filter(s => s.category === catKey).length;
          const isSelected = selectedCategory === catKey;
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`py-1 px-3 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer active:scale-95 ${
                isSelected
                  ? 'bg-[#7B1113] text-white shadow-xs'
                  : 'bg-white text-[#70645E] border border-[#EDE8E0]'
              }`}
            >
              {info.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Songs List */}
      <div className="space-y-2">
        {filteredSongs.length === 0 ? (
          <div className="p-8 text-center bg-white/70 rounded-2xl border border-dashed border-[#DDD5C7]">
            <Music className="w-8 h-8 mx-auto text-[#8A7C75] mb-2 opacity-60" />
            <p className="text-xs text-[#70645E]">Nenhum cântico encontrado para a busca.</p>
          </div>
        ) : (
          filteredSongs.map(song => {
            const catBadge = CATEGORY_LABELS[song.category];
            return (
              <div
                key={song.id}
                onClick={() => handleOpenSong(song)}
                className="p-3.5 bg-white/90 hover:bg-white rounded-xl border border-[#EDE8E0] hover:border-[#DDD5C7] shadow-2xs transition flex items-center justify-between group cursor-pointer active:scale-[0.99]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-[#FAF5F0] border border-[#EDE8E0] flex items-center justify-center text-[#7B1113] font-bold text-xs shrink-0 font-mono">
                    {song.key}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="text-xs font-bold text-[#241E1C] group-hover:text-[#7B1113] transition truncate">
                        {song.title}
                      </h4>
                      <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${catBadge.color}`}>
                        {catBadge.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#70645E] truncate">
                      {song.artist} • <span className="italic">{song.suggestedMoment}</span>
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-4 h-4 text-[#8A7C75] group-hover:text-[#7B1113] transition shrink-0" />
              </div>
            );
          })
        )}
      </div>

      {/* Modal Adicionar Cântico */}
      {showAddModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
        >
          <div 
            className="w-full max-w-md bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#EDE8E0] p-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold font-cinzel text-[#36070D] mb-3">
              Adicionar Cântico ao Cancioneiro
            </h3>

            <form onSubmit={handleSaveSong} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#36070D] mb-1">Título do Cântico:</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Belíssimo Esposo"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Ministério / Autor:</label>
                  <input
                    type="text"
                    placeholder="Ex: Comunidade Shalom"
                    value={newArtist}
                    onChange={e => setNewArtist(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Tom Principal:</label>
                  <input
                    type="text"
                    placeholder="Ex: Em, G, D"
                    value={newKey}
                    onChange={e => setNewKey(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Categoria:</label>
                  <select
                    value={newCategory}
                    onChange={e => setNewCategory(e.target.value as SongCategory)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  >
                    <option value="louvor">Louvor</option>
                    <option value="adoracao">Adoração</option>
                    <option value="espirito_santo">Espírito Santo</option>
                    <option value="mariano">Mariano</option>
                    <option value="santa_gemma">Santa Gemma</option>
                    <option value="comunhao">Comunhão</option>
                    <option value="perdao">Perdão</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-[#36070D] mb-1">Momento Sugerido:</label>
                  <input
                    type="text"
                    placeholder="Ex: Louvor Inicial"
                    value={newMoment}
                    onChange={e => setNewMoment(e.target.value)}
                    className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#36070D] mb-1">Letra com Cifras:</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Cole aqui a letra e cifras do cântico..."
                  value={newLyrics}
                  onChange={e => setNewLyrics(e.target.value)}
                  className="w-full p-2 bg-white rounded-lg border border-[#DDD5C7] font-mono"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#DDD5C7]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg text-[#70645E] hover:bg-[#EAE4DB]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#7B1113] text-white font-bold"
                >
                  Salvar no Cancioneiro
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
