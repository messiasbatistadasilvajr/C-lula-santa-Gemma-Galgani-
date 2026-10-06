import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speechReader } from '../../utils/speechReader';

interface SpeakButtonProps {
  id: string;
  text: string;
  label?: string;
  className?: string;
}

export const SpeakButton: React.FC<SpeakButtonProps> = ({
  id,
  text,
  label = 'Ouvir',
  className = '',
}) => {
  const [speakingId, setSpeakingId] = useState<string | null>(speechReader.getSpeakingId());

  useEffect(() => {
    return speechReader.subscribe(() => {
      setSpeakingId(speechReader.getSpeakingId());
    });
  }, []);

  if (!speechReader.isSupported()) return null;

  const isPlaying = speakingId === id;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        speechReader.toggleSpeak(id, text);
      }}
      title={isPlaying ? 'Parar leitura em voz alta' : 'Ouvir texto em voz alta'}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition cursor-pointer active:scale-95 ${
        isPlaying
          ? 'bg-[#7B1113] text-white shadow-xs animate-pulse'
          : 'bg-amber-100 hover:bg-amber-200 text-[#7B1113] border border-amber-300'
      } ${className}`}
    >
      {isPlaying ? (
        <>
          <Square className="w-3.5 h-3.5 fill-current" />
          <span>Parar Áudio</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5" />
          <span>🔊 {label}</span>
        </>
      )}
    </button>
  );
};
