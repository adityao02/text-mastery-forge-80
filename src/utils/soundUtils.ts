
export class SoundUtils {
  private audioContext: AudioContext | null = null;
  private isEnabled: boolean = true;

  constructor() {
    // Initialize audio context on first user interaction
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
  }

  private async initAudioContext() {
    if (!this.audioContext && typeof window !== 'undefined' && 'AudioContext' in window) {
      this.audioContext = new AudioContext();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  async playKeySound(isCorrect: boolean = true) {
    if (!this.isEnabled || !this.audioContext) return;

    try {
      await this.initAudioContext();
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Mechanical click: square wave, short and percussive; different freq for correct/incorrect
      oscillator.frequency.setValueAtTime(
        isCorrect ? 1200 : 700, 
        this.audioContext.currentTime
      );
      oscillator.type = 'square';
      
      // Sharper, mechanical-sounding envelope: quick attack, immediate decay
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.18, now + 0.005); // fast attack
      gainNode.gain.linearRampToValueAtTime(0.01, now + 0.025); // very short decay

      oscillator.start(now);
      oscillator.stop(now + 0.03); // total ~30ms, very short/clicky
    } catch (error) {
      console.log('Sound not available:', error);
    }
  }

  toggleSound() {
    this.isEnabled = !this.isEnabled;
    return this.isEnabled;
  }

  setEnabled(enabled: boolean) {
    this.isEnabled = enabled;
  }

  isSound() {
    return this.isEnabled;
  }
}

export const soundUtils = new SoundUtils();

