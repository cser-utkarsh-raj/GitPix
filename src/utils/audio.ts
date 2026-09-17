// Web Audio API Synthesizer for Katana Slash & Ambient Sound Effects

class AudioSynthesizer {
  private ctx: AudioContext | null = null;

  private init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
  }

  // Play Katana Sword Slash Sound Effect
  playKatanaSlash() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;

      // Noise buffer for air blade whoosh
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.frequency.exponentialRampToValueAtTime(3200, now + 0.15);
      filter.Q.value = 3.0;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start(now);
      noise.stop(now + 0.25);

      // Steel blade metallic chime ringing
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(2400, now + 0.05);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.25);

      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.15, now + 0.07);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      osc.start(now + 0.05);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }

  // Play Futuristic Click / Pulse
  playCyberClick() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn('Audio playback error:', e);
    }
  }
}

export const soundEffects = new AudioSynthesizer();
