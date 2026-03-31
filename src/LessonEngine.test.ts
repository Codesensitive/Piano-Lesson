import { describe, it, expect, beforeEach } from 'vitest';
import type { SubMission } from './LessonEngine';
import { LessonEngine } from './LessonEngine';

describe('LessonEngine', () => {
  let engine: LessonEngine;

  const testSubMission: SubMission = { 
    id: 'test-sm',
    targetSequence: ['C4', 'D4', 'E4'], 
    instructions: 'Play C, D, E' 
  };

  beforeEach(() => {
    engine = new LessonEngine(testSubMission);
  });

  it('should initialize correctly', () => {
    expect(engine.state.expectedNoteIndex).toBe(0);
    expect(engine.state.isComplete).toBe(false);
  });

  it('should advance when correct note is played', () => {
    expect(engine.playNote('C4')).toBe(true);
    expect(engine.state.expectedNoteIndex).toBe(1);
  });

  it('should record an error and reset expected note index on incorrect note', () => {
    engine.playNote('C4'); // correct
    expect(engine.playNote('G4')).toBe(false); // incorrect
    
    expect(engine.state.errorCount).toBe(1);
    expect(engine.state.expectedNoteIndex).toBe(0); // reset to beginning of sequence
  });

  it('should complete lesson after final note', () => {
    engine.playNote('C4');
    engine.playNote('D4');
    engine.playNote('E4');
    
    expect(engine.state.isComplete).toBe(true);
  });
});
