/**
 * Audio feedback and Speech Synthesis helpers tailored for elderly ears:
 * - Slower, clear speech rate (0.85)
 * - Soothing sinusoidal harmonic chimes (no abrupt buzzer sounds)
 */

class SoundEffects {
  private ctx: AudioContext | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Gentle harmonic harp/bell chime for completion & success
  playGentleChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6 (Major warm chord)

      notes.forEach((freq, idx) => {
        const osc = this.ctx!.createOscillator();
        const gain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);

        gain.gain.setValueAtTime(0.0001, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.12, now + idx * 0.1 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.1 + 0.8);

        osc.connect(gain);
        gain.connect(this.ctx!.destination);

        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.9);
      });
    } catch {
      // Ignore audio failure if user hasn't interacted yet
    }
  }

  // Soft wooden tap sound for card flips and button presses
  playSoftTap() {
    try {
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.08);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // ignore
    }
  }

  // Distinct tone for the sound guessing game
  playSoundSample(type: 'bird' | 'bell' | 'rain' | 'flute' | 'stream' | 'wind-chime') {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === 'bell') {
        // Deep Tibetan / Temple Bell harmonic
        [440, 880, 1320].forEach((freq, i) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          const initialVol = 0.18 / (i + 1);
          gain.gain.setValueAtTime(initialVol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now);
          osc.stop(now + 2.3);
        });
      } else if (type === 'flute') {
        // Serene bamboo flute note sequence
        const freqs = [587.33, 659.25, 587.33, 523.25]; // D5, E5, D5, C5
        freqs.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.35);
          gain.gain.setValueAtTime(0.001, now + idx * 0.35);
          gain.gain.linearRampToValueAtTime(0.12, now + idx * 0.35 + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.35 + 0.38);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + idx * 0.35);
          osc.stop(now + idx * 0.35 + 0.4);
        });
      } else if (type === 'bird') {
        // Chirping morning songbird
        const chirps = [
          { f: 1800, t: 0 },
          { f: 2300, t: 0.1 },
          { f: 1900, t: 0.2 },
          { f: 2400, t: 0.4 },
        ];
        chirps.forEach((c) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(c.f, now + c.t);
          osc.frequency.exponentialRampToValueAtTime(c.f + 400, now + c.t + 0.08);
          gain.gain.setValueAtTime(0.1, now + c.t);
          gain.gain.exponentialRampToValueAtTime(0.001, now + c.t + 0.09);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(now + c.t);
          osc.stop(now + c.t + 0.1);
        });
      } else if (type === 'rain') {
        // Soothing rhythmic drops
        for (let i = 0; i < 8; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const dropTime = now + i * 0.18 + (Math.random() * 0.05);
          osc.type = 'sine';
          osc.frequency.setValueAtTime(400 + Math.random() * 300, dropTime);
          gain.gain.setValueAtTime(0.08, dropTime);
          gain.gain.exponentialRampToValueAtTime(0.001, dropTime + 0.06);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(dropTime);
          osc.stop(dropTime + 0.07);
        }
      } else if (type === 'stream') {
        // Flowing river stream: bubbling ambient wavelets
        for (let i = 0; i < 10; i++) {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          const t = now + i * 0.14;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(260 + (i % 3) * 60, t);
          osc.frequency.exponentialRampToValueAtTime(380 + (i % 4) * 40, t + 0.12);
          gain.gain.setValueAtTime(0.06, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(t);
          osc.stop(t + 0.14);
        }
      } else if (type === 'wind-chime') {
        // High harmonic bamboo wind-chime sparkle
        const chimeNotes = [1046.5, 1318.5, 1567.98, 2093.0, 1760.0]; // C6, E6, G6, C7, A6
        chimeNotes.forEach((freq, idx) => {
          const osc = this.ctx!.createOscillator();
          const gain = this.ctx!.createGain();
          const t = now + idx * 0.18;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.12, t + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.8);
          osc.connect(gain);
          gain.connect(this.ctx!.destination);
          osc.start(t);
          osc.stop(t + 0.85);
        });
      }
    } catch {
      // ignore
    }
  }
}

import { Language } from '../types';

export const soundEffects = new SoundEffects();

// Browser Text-To-Speech helper with Multi-language support (English, Hindi, Bengali, Assamese)
export function speakText(text: string, language: Language = 'en', onEnd?: () => void): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any overlapping speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82; // Slower, comfortable speech rate for elderly listeners
    utterance.pitch = 1.02; // Warm tone

    // Set voice language code according to selected language
    let langCode = 'en-IN';
    if (language === 'hi') {
      langCode = 'hi-IN';
    } else if (language === 'bn') {
      langCode = 'bn-IN';
    } else if (language === 'as') {
      // Assamese fallback in speech synthesis: as-IN or bn-IN
      langCode = 'as-IN';
    }
    utterance.lang = langCode;

    // Pick warm natural voice if available in user's browser
    const voices = window.speechSynthesis.getVoices();
    let voiceMatch = voices.find((v) => v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase()));
    
    // Fallback for Assamese if browser doesn't have native as-IN voice: check for Bengali (bn-IN) or Indian voice
    if (!voiceMatch && language === 'as') {
      voiceMatch = voices.find((v) => v.lang.toLowerCase().startsWith('bn'));
    }

    if (!voiceMatch && language === 'en') {
      voiceMatch = voices.find(
        (v) =>
          v.lang.startsWith('en') &&
          (v.name.includes('India') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google'))
      );
    }

    if (voiceMatch) {
      utterance.voice = voiceMatch;
    }

    if (onEnd) {
      utterance.onend = () => onEnd();
      utterance.onerror = () => onEnd();
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.error('Speech error:', e);
    if (onEnd) onEnd();
  }
}

export function stopSpeaking(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
