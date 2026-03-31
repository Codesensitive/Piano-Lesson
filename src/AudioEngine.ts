import * as Tone from 'tone';
import type { Note } from './LessonEngine';

export class AudioEngine {
  private sampler: Tone.Sampler | null = null;
  private isInitializing = false;
  private isReady = false;

  private onReadyCallback: (() => void) | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (this.isInitializing) return;
    this.isInitializing = true;

    // Use a basic synth for immediate start, but we can upgrade to a sampler
    const basicSynth = new Tone.PolySynth(Tone.Synth).toDestination();
    // We'll wrap it in a pseudo-sampler to keep API simple
    this.sampler = basicSynth as any;
    
    // Better option for learning: actual piano sampler setup (simplified for size)
    this.sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => {
        this.isReady = true;
        if (this.onReadyCallback) {
          this.onReadyCallback();
        }
      }
    }).toDestination();
  }

  // Silently unlock the audio context without playing a specific note
  public async unlock() {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
  }

  public async playNote(note: Note | string, duration: string = '8n') {
    // Browsers require user interaction before AudioContext can resume
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }
    
    if (this.isReady && this.sampler) {
      this.sampler.triggerAttackRelease(note, duration);
    }
  }

  // Used by synthesized MIDI playback
  public scheduleNote(note: string, duration: number, time: number, velocity: number) {
    if (this.isReady && this.sampler) {
      this.sampler.triggerAttackRelease(note, duration, time, velocity);
    }
  }

  public onReady(cb: () => void) {
    if (this.isReady) {
      cb();
    } else {
      this.onReadyCallback = cb;
    }
  }
}

// Singleton export
export const audioEngine = new AudioEngine();
