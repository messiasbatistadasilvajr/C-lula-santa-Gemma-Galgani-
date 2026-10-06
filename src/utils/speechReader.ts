/**
 * Utilitário de Acessibilidade e Leitura em Voz Alta (Text-to-Speech nativo em Português)
 * Ideal para irmãos com dificuldade visual, idosos ou quem prefere ouvir as orações e leituras.
 */

class SpeechReader {
  private currentId: string | null = null;
  private listeners: Set<() => void> = new Set();

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  public getSpeakingId(): string | null {
    return this.currentId;
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb());
  }

  public toggleSpeak(id: string, text: string): void {
    if (!this.isSupported()) return;

    if (this.currentId === id) {
      this.stop();
      return;
    }

    this.stop();

    const cleanText = text
      .replace(/[*_~`#]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.95; // Velocidade calma e compreensível

    // Tenta selecionar voz em português do Brasil se disponível
    const voices = window.speechSynthesis.getVoices();
    const ptVoice =
      voices.find(v => v.lang.includes('pt-BR')) ||
      voices.find(v => v.lang.includes('pt'));
    if (ptVoice) {
      utterance.voice = ptVoice;
    }

    utterance.onend = () => {
      this.currentId = null;
      this.notify();
    };

    utterance.onerror = () => {
      this.currentId = null;
      this.notify();
    };

    this.currentId = id;
    this.notify();
    window.speechSynthesis.speak(utterance);
  }

  public stop(): void {
    if (!this.isSupported()) return;
    window.speechSynthesis.cancel();
    this.currentId = null;
    this.notify();
  }
}

export const speechReader = new SpeechReader();
