import { audioMap } from './audioMap';

class SoundEngine {
  constructor() {
    this.currentAudio = null;
    this.audioEnabled = true;
    this.isPlaying = false;
    this.queue = [];
    this.lastClickTime = 0;
  }

  setAudioEnabled(enabled) {
    this.audioEnabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }

  stop() {
    // Stop HTML5 Audio MP3
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    
    this.isPlaying = false;
    this.queue = [];
  }

  playDragClick() {
    if (!this.audioEnabled) return;
    try {
      const now = Date.now();
      if (this.lastClickTime && now - this.lastClickTime < 45) return; // Throttled for smooth drag sound
      this.lastClickTime = now;

      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 0.018);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.018);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.018);
    } catch (e) {
      // Ignore web audio errors if restricted
    }
  }

  playText(text) {
    if (!this.audioEnabled || !text) return;

    // Stop any currently playing audio to prevent overlapping
    this.stop();

    // Lookup pre-generated ElevenLabs asset in audioMap ONLY
    const audioPath = audioMap[text] || audioMap[`key:${text}`];
    if (!audioPath) {
      console.warn(`[SoundEngine] No pre-generated ElevenLabs audio found for: "${text.substring(0, 40)}..."`);
      return;
    }

    try {
      const audio = new Audio(audioPath);
      this.currentAudio = audio;
      this.isPlaying = true;

      audio.play().catch(err => {
        console.warn("[SoundEngine] Audio play error:", err.message);
        this.isPlaying = false;
      });

      audio.onended = () => {
        this.isPlaying = false;
        this.currentAudio = null;
        if (this.queue.length > 0) {
          const nextText = this.queue.shift();
          this.playText(nextText);
        }
      };
    } catch (e) {
      console.error("[SoundEngine] Audio error:", e);
      this.isPlaying = false;
    }
  }

  enqueue(text) {
    if (!this.audioEnabled) return;
    if (!this.isPlaying) {
      this.playText(text);
    } else {
      this.queue.push(text);
    }
  }
}

export const soundEngine = new SoundEngine();
export default soundEngine;
