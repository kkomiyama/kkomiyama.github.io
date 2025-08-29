class SoundEngine {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;

  private initialize() {
    if (!this.isInitialized && typeof window !== 'undefined') {
      try {
        this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        this.isInitialized = true;
      } catch(e) {
        console.error("Web Audio API is not supported in this browser");
        this.isInitialized = false;
      }
    }
  }

  private playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
    this.initialize();
    if (!this.audioContext || this.audioContext.state === 'suspended') {
        this.audioContext?.resume();
    }
    if (!this.audioContext) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.00001, this.audioContext.currentTime + duration);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private playSequence(notes: {freq: number, dur: number, delay: number}[]) {
      this.initialize();
      if (!this.audioContext) return;
      
      let cumulativeDelay = 0;
      notes.forEach(note => {
          cumulativeDelay += note.delay;
          setTimeout(() => this.playTone(note.freq, note.dur), cumulativeDelay * 1000);
      });
  }

  public playCardSound(cardsPlayed: number) {
    const baseFreq = 600 + (cardsPlayed * 12);
    this.playTone(baseFreq, 0.15);
  }

  public playPokerSound() {
    const notes = [
      { freq: 1047, dur: 0.15, delay: 0 },
      { freq: 1175, dur: 0.15, delay: 0.05 },
      { freq: 1318, dur: 0.15, delay: 0.05 },
      { freq: 1568, dur: 0.15, delay: 0.05 },
    ];
    this.playSequence(notes);
  }

  public playSuccessSound() {
     const notes = [
      { freq: 523, dur: 0.2, delay: 0 },
      { freq: 659, dur: 0.2, delay: 0.1 },
      { freq: 784, dur: 0.2, delay: 0.1 },
      { freq: 1047, dur: 0.2, delay: 0.1 },
    ];
    this.playSequence(notes);
  }
  
  public playErrorSound() {
    this.playTone(200, 0.3, 'square');
  }

  public playStartSound() {
     const notes = [
      { freq: 261, dur: 0.25, delay: 0 },
      { freq: 329, dur: 0.25, delay: 0.15 },
      { freq: 392, dur: 0.25, delay: 0.15 },
      { freq: 523, dur: 0.25, delay: 0.15 },
    ];
    this.playSequence(notes);
  }
}

export const soundEngine = new SoundEngine();
