// Web Audio API Sound Synthesis Engine for Smart Fire Alarm System

class AudioManager {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private sirenOsc1: OscillatorNode | null = null;
  private sirenOsc2: OscillatorNode | null = null;
  private sirenGain: GainNode | null = null;
  private isSirenActive = false;

  private isMuted = false;
  private volume = 0.5;

  constructor() {
    this.loadSettings();
  }

  private loadSettings() {
    try {
      const storedMute = localStorage.getItem('dfa_fire_alarm_muted');
      const storedVol = localStorage.getItem('dfa_fire_alarm_volume');
      if (storedMute !== null) {
        this.isMuted = JSON.parse(storedMute);
      }
      if (storedVol !== null) {
        this.volume = parseFloat(storedVol);
      }
    } catch {
      // Fallback defaults
    }
  }

  public saveSettings() {
    try {
      localStorage.setItem('dfa_fire_alarm_muted', JSON.stringify(this.isMuted));
      localStorage.setItem('dfa_fire_alarm_volume', this.volume.toString());
    } catch {
      // Ignore storage errors
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getVolume(): number {
    return this.volume;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    this.saveSettings();
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    this.saveSettings();
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
  }

  // Play a single synthesized chime pulse
  private playTone(freq: number, durationSec: number, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // q0 -> q1: Smoke warning beep
  public playSmokeBeep() {
    this.playTone(880, 0.2, 'triangle');
  }

  // q1 -> q2: Double warning tones (660Hz -> 880Hz)
  public playTempWarningBeep() {
    if (this.isMuted) return;
    this.initContext();
    this.playTone(660, 0.15, 'sawtooth');
    setTimeout(() => {
      this.playTone(880, 0.25, 'sawtooth');
    }, 180);
  }

  // q2 -> q3: Emergency Siren Alarm (Looping dual-tone sweep)
  public startEmergencyAlarm() {
    if (this.isSirenActive) return; // Prevent duplicate audio instances!
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.isSirenActive = true;

      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
      this.sirenGain.connect(this.masterGain);

      this.sirenOsc1 = this.ctx.createOscillator();
      this.sirenOsc2 = this.ctx.createOscillator();

      this.sirenOsc1.type = 'sawtooth';
      this.sirenOsc2.type = 'square';

      // Sweep frequency back and forth for siren effect
      const now = this.ctx.currentTime;
      this.sirenOsc1.frequency.setValueAtTime(600, now);
      this.sirenOsc1.frequency.linearRampToValueAtTime(950, now + 0.6);
      this.sirenOsc1.frequency.linearRampToValueAtTime(600, now + 1.2);

      this.sirenOsc2.frequency.setValueAtTime(650, now);
      this.sirenOsc2.frequency.linearRampToValueAtTime(1000, now + 0.6);
      this.sirenOsc2.frequency.linearRampToValueAtTime(650, now + 1.2);

      // Loop frequency sweep modulation
      const modulate = () => {
        if (!this.isSirenActive || !this.ctx || !this.sirenOsc1 || !this.sirenOsc2) return;
        const t = this.ctx.currentTime;
        this.sirenOsc1.frequency.setValueAtTime(600, t);
        this.sirenOsc1.frequency.linearRampToValueAtTime(950, t + 0.6);
        this.sirenOsc1.frequency.linearRampToValueAtTime(600, t + 1.2);

        this.sirenOsc2.frequency.setValueAtTime(650, t);
        this.sirenOsc2.frequency.linearRampToValueAtTime(1000, t + 0.6);
        this.sirenOsc2.frequency.linearRampToValueAtTime(650, t + 1.2);
      };

      this.sirenOsc1.connect(this.sirenGain);
      this.sirenOsc2.connect(this.sirenGain);

      this.sirenOsc1.start();
      this.sirenOsc2.start();

      // Set periodic interval to refresh siren modulation curve
      const sirenInterval = setInterval(() => {
        if (!this.isSirenActive) {
          clearInterval(sirenInterval);
        } else {
          modulate();
        }
      }, 1200);
    } catch {
      this.isSirenActive = false;
    }
  }

  // Stop Emergency Siren
  public stopEmergencyAlarm() {
    this.isSirenActive = false;
    try {
      if (this.sirenOsc1) {
        this.sirenOsc1.stop();
        this.sirenOsc1.disconnect();
        this.sirenOsc1 = null;
      }
      if (this.sirenOsc2) {
        this.sirenOsc2.stop();
        this.sirenOsc2.disconnect();
        this.sirenOsc2 = null;
      }
      if (this.sirenGain) {
        this.sirenGain.disconnect();
        this.sirenGain = null;
      }
    } catch {
      // Ignore cleanup errors
    }
  }

  // Reset Sound (Ascending 440Hz -> 554Hz -> 659Hz resolve chime)
  public playResetChime() {
    this.stopEmergencyAlarm();
    if (this.isMuted) return;
    this.initContext();

    this.playTone(440, 0.15, 'sine');
    setTimeout(() => this.playTone(554, 0.15, 'sine'), 120);
    setTimeout(() => this.playTone(659, 0.25, 'sine'), 240);
  }
}

export const audioManager = new AudioManager();
