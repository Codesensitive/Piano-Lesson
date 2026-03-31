export type Note = 
  | 'C3'|'C#3'|'D3'|'D#3'|'E3'|'F3'|'F#3'|'G3'|'G#3'|'A3'|'A#3'|'B3'
  | 'C4'|'C#4'|'D4'|'D#4'|'E4'|'F4'|'F#4'|'G4'|'G#4'|'A4'|'A#4'|'B4'
  | 'C5'|'C#5'|'D5'|'D#5'|'E5'|'F5'|'F#5'|'G5'|'G#5'|'A5'|'A#5'|'B5'
  | 'C6';

export interface SubMission {
  id: string; // Globally unique ID (e.g., 'm1-s1')
  targetSequence: Note[];
  instructions: string;
}

export interface LessonState {
  expectedNoteIndex: number;
  isComplete: boolean;
  errorCount: number;
}

export class LessonEngine {
  private subMission: SubMission;
  public state: LessonState;

  constructor(subMission: SubMission) {
    this.subMission = subMission;
    this.state = {
      expectedNoteIndex: 0,
      isComplete: subMission.targetSequence.length === 0,
      errorCount: 0
    };
  }

  public playNote(note: Note): boolean {
    if (this.state.isComplete) return false;

    const expectedNote = this.subMission.targetSequence[this.state.expectedNoteIndex];

    if (note === expectedNote) {
      // Correct note
      this.state.expectedNoteIndex++;
      
      // Check if step is complete
      if (this.state.expectedNoteIndex >= this.subMission.targetSequence.length) {
        this.state.isComplete = true;
      }
      return true;
    } else {
      // Incorrect Note
      this.state.errorCount++;
      // Reset progress for the current sequence to enforce learning repetition
      this.state.expectedNoteIndex = 0;
      return false;
    }
  }

  public getSubMission(): SubMission {
    return this.subMission;
  }
}
