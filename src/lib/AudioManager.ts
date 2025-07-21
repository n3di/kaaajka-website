// /app/lib/AudioManager.ts
type PlayAction = () => Promise<void>;

export class AudioManager {
  private static instance: AudioManager;
  private queue: PlayAction[] = [];
  private isPlaying = false;

  private constructor() {}

  static getInstance() {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  // Dodaj do kolejki i graj, jak koniec, to next
  playSound(url: string, volume = 1): Promise<void> {
    return this.enqueue(() => this._playAudio(url, volume));
  }

  playTTS(text: string, volume = 1, lang = 'pl-PL'): Promise<void> {
    return this.enqueue(() => this._playTTS(text, volume, lang));
  }

  private enqueue(action: PlayAction): Promise<void> {
    console.log('[ENQUEUE SOUND]');
    return new Promise((resolve) => {
      this.queue.push(async () => {
        try {
          await action();
        } catch {}
        resolve();
        this.isPlaying = false;
        this.processQueue();
      });

      this.processQueue(); // <-- tylko uruchom bez zmiany isPlaying
    });
  }

  private async processQueue() {
    console.log('[PROCESS QUEUE]', this.queue.length);
    if (this.isPlaying) return;

    const next = this.queue.shift();
    if (!next) return;

    this.isPlaying = true; // <-- ustaw tutaj
    try {
      await next();
    } catch {}
    this.isPlaying = false;
    this.processQueue();
  }

  private _playAudio(url: string, volume: number): Promise<void> {
    return new Promise((resolve) => {
      console.log('[PLAYING AUDIO]', url, 'volume:', volume);
      const audio = new Audio(url);
      audio.volume = volume;
      audio.onended = () => resolve();
      audio.onerror = () => resolve();
      audio
        .play()
        .then(() => console.log('[AUDIO PLAY STARTED]'))
        .catch((e) => {
          console.warn('[AUDIO PLAY ERROR]', e);
          resolve();
        });
    });
  }

  private _playTTS(text: string, volume: number, lang: string): Promise<void> {
    return new Promise((resolve) => {
      if (!text) {
        resolve();
        return;
      }
      if (!('speechSynthesis' in window)) {
        console.warn('TTS not supported');
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.volume = volume;
      utterance.lang = lang;
      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      window.speechSynthesis.speak(utterance);
    });
  }
}
