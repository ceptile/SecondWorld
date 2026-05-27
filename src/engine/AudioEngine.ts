import { Howl } from 'howler';

type SoundKey = string;

export class AudioEngine {
  private sounds: Map<SoundKey, Howl> = new Map();
  private musicVolume = 0.4;
  private sfxVolume = 0.8;
  private currentMusic: Howl | null = null;

  async init() {
    // Howler global config
    Howler.autoSuspend = false;
    Howler.volume(1.0);
  }

  register(key: SoundKey, src: string | string[], options: Partial<HowlOptions> = {}) {
    const howl = new Howl({ src: Array.isArray(src) ? src : [src], volume: this.sfxVolume, ...options });
    this.sounds.set(key, howl);
  }

  play(key: SoundKey, volume?: number): number {
    const s = this.sounds.get(key);
    if (!s) return -1;
    if (volume !== undefined) s.volume(volume);
    return s.play();
  }

  playMusic(key: SoundKey) {
    this.stopMusic();
    const s = this.sounds.get(key);
    if (!s) return;
    s.volume(this.musicVolume);
    s.loop(true);
    s.play();
    this.currentMusic = s;
  }

  stopMusic() {
    if (this.currentMusic) { this.currentMusic.stop(); this.currentMusic = null; }
  }

  setMusicVolume(v: number) { this.musicVolume = v; this.currentMusic?.volume(v); }
  setSFXVolume(v: number) { this.sfxVolume = v; }
}
