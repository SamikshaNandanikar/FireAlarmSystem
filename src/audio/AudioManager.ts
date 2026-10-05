// Web Audio API Sound Synthesis Engine for Automata Fire Alarm Simulator

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
      const storedMute = localStorage.getItem('automata_fire_alarm_muted');
      const storedVol = localStorage.getItem('automata_fire_alarm_volume');
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
      localStorage.setItem('automata_fire_alarm_muted', JSON.stringify(this.isMuted));
      localStorage.setItem('automata_fire_alarm_volume', this.volume.toString());
    } catch {
      // Ignore storage errors
    }
  }

  private initContext() {
    if (!this.ctx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
  private playTone(freq: number, durationSec: number, type: OscillatorType = 'sine', gainVal = 0.3) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSec);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.ctx.currentTime + durationSec);
    } catch {
      // Ignore audio synthesis errors
    }
  }

  // q1 (WARNING): Short warning beep
  public playWarningBeep() {
    this.playTone(880, 0.2, 'triangle', 0.25);
  }

  // q2 (FIRE_SUSPECTED): Double warning beep (660Hz -> 880Hz)
  public playFireSuspectedBeep() {
    if (this.isMuted) return;
    this.initContext();
    this.playTone(660, 0.15, 'sawtooth', 0.3);
    setTimeout(() => {
      this.playTone(880, 0.25, 'sawtooth', 0.3);
    }, 180);
  }

  // q3 (FIRE_CONFIRMED) & q4 (EVACUATION): Looping Siren Emergency Alarm
  public startEmergencySiren(highPriority = false) {
    if (this.isSirenActive) return; // Prevent duplicate audio instances!
    this.initContext();
    if (!this.ctx || !this.masterGain) return;

    try {
      this.isSirenActive = true;

      this.sirenGain = this.ctx.createGain();
      this.sirenGain.gain.setValueAtTime(highPriority ? 0.45 : 0.35, this.ctx.currentTime);
      this.sirenGain.connect(this.masterGain);

      this.sirenOsc1 = this.ctx.createOscillator();
      this.sirenOsc2 = this.ctx.createOscillator();

      this.sirenOsc1.type = highPriority ? 'square' : 'sawtooth';
      this.sirenOsc2.type = 'sawtooth';

      const lowFreq = highPriority ? 700 : 600;
      const highFreq = highPriority ? 1100 : 950;
      const sweepTime = highPriority ? 0.4 : 0.6;

      const now = this.ctx.currentTime;
      this.sirenOsc1.frequency.setValueAtTime(lowFreq, now);
      this.sirenOsc1.frequency.linearRampToValueAtTime(highFreq, now + sweepTime);
      this.sirenOsc1.frequency.linearRampToValueAtTime(lowFreq, now + sweepTime * 2);

      this.sirenOsc2.frequency.setValueAtTime(lowFreq + 50, now);
      this.sirenOsc2.frequency.linearRampToValueAtTime(highFreq + 50, now + sweepTime);
      this.sirenOsc2.frequency.linearRampToValueAtTime(lowFreq + 50, now + sweepTime * 2);

      // Loop frequency sweep modulation
      const modulate = () => {
        if (!this.isSirenActive || !this.ctx || !this.sirenOsc1 || !this.sirenOsc2) return;
        const t = this.ctx.currentTime;
        this.sirenOsc1.frequency.setValueAtTime(lowFreq, t);
        this.sirenOsc1.frequency.linearRampToValueAtTime(highFreq, t + sweepTime);
        this.sirenOsc1.frequency.linearRampToValueAtTime(lowFreq, t + sweepTime * 2);

        this.sirenOsc2.frequency.setValueAtTime(lowFreq + 50, t);
        this.sirenOsc2.frequency.linearRampToValueAtTime(highFreq + 50, t + sweepTime);
        this.sirenOsc2.frequency.linearRampToValueAtTime(lowFreq + 50, t + sweepTime * 2);
      };

      this.sirenOsc1.connect(this.sirenGain);
      this.sirenOsc2.connect(this.sirenGain);

      this.sirenOsc1.start();
      this.sirenOsc2.start();

      const sirenInterval = setInterval(() => {
        if (!this.isSirenActive) {
          clearInterval(sirenInterval);
        } else {
          modulate();
        }
      }, sweepTime * 2000);
    } catch {
      this.isSirenActive = false;
    }
  }

  // Stop Emergency Siren
  public stopEmergencySiren() {
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

  // q5 (FIRE_CLEARED): Resolution chime
  public playClearedChime() {
    this.stopEmergencySiren();
    if (this.isMuted) return;
    this.initContext();

    this.playTone(523, 0.2, 'sine', 0.25);
    setTimeout(() => this.playTone(659, 0.3, 'sine', 0.25), 180);
  }

  // q6 (SYSTEM_FAULT): Fault warning buzz
  public playFaultBuzz() {
    this.playTone(220, 0.35, 'sawtooth', 0.3);
  }

  // q7 / RESET: Ascending resolution chime (440Hz -> 554Hz -> 659Hz)
  public playResetChime() {
    this.stopEmergencySiren();
    if (this.isMuted) return;
    this.initContext();

    this.playTone(440, 0.15, 'sine', 0.25);
    setTimeout(() => this.playTone(554, 0.15, 'sine', 0.25), 120);
    setTimeout(() => this.playTone(659, 0.25, 'sine', 0.25), 240);
  }
}

export const audioManager = new AudioManager();
