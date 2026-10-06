/**
 * Efeitos de Áudio e Feedback Háptico para o App da Célula Santa Gemma Galgani
 * Utiliza Web Audio API nativa (sem dependências externas) para som reverente de sinos e toques
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;

  constructor() {
    // Carrega preferência do usuário do localStorage se houver
    try {
      const saved = localStorage.getItem('sg_sound_enabled');
      if (saved !== null) {
        this.soundEnabled = saved === 'true';
      }
    } catch {
      this.soundEnabled = true;
    }
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    try {
      localStorage.setItem('sg_sound_enabled', String(this.soundEnabled));
    } catch {
      // Ignora erro de storage
    }
    return this.soundEnabled;
  }

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  /**
   * Toca um sino sacro suave para o Terço (com harmônicos ricos e decaimento reverente)
   */
  public playSacredBell(frequency: number = 523.25): void { // C5 nota base
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Fundamental + harmônico místico de sino
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(frequency, now);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(frequency * 1.5, now); // Quinta justa

      gainNode.gain.setValueAtTime(0.25, now);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      osc1.stop(now + 1.8);
      osc2.stop(now + 1.8);
    } catch {
      // Falha silenciosa
    }
  }

  /**
   * Som de toque tátil discreto para avanço de contas do terço
   */
  public playBeadClick(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {
      // Ignora erro
    }
  }

  /**
   * Sinal sonoro solene para troca de etapa no Modo Encontro da Célula
   */
  public playStepChime(): void {
    if (!this.soundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const notes = [440, 554.37, 659.25]; // Acorde Lá Maior sereno (A - C# - E)

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.12);

        gain.gain.setValueAtTime(0.18, now + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.12 + 1.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.12);
        osc.stop(now + idx * 0.12 + 1.4);
      });
    } catch {
      // Falha silenciosa
    }
  }
}

export const soundManager = new SoundManager();

/**
 * Dispara vibração háptica curta no aparelho móvel se suportado
 */
export const vibrateDevice = (pattern: number | number[] = 25): void => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Suprime se restrito por permissões do navegador
    }
  }
};
