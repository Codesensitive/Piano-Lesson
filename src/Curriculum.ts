import type { SubMission } from './LessonEngine';

export interface Module {
  id: string;
  title: string;
  description: string;
  subMissions: SubMission[];
}

export interface Phase {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}

// V4 GLOBAL Curriculum Roadmap (Individual Sub-Missions structure)
export const COURSE_CURRICULUM: Phase[] = [
  {
    id: 'phase-1',
    title: 'Phase 1: Foundation (Physical Mastery)',
    description: 'Establish core mechanical skills, scales, and finger independence.',
    modules: [
      {
        id: 'module-1-1',
        title: 'The Architecture of the Keys',
        description: 'Understand the geometric layout of white and black key sub-groups.',
        subMissions: [
          { id: 'm1-1-s1', targetSequence: ['C4'], instructions: "Strike Middle C, the center of the acoustic universe." },
          { id: 'm1-1-s2', targetSequence: ['C4', 'D4', 'E4', 'F4'], instructions: "Navigate the lower white keys exactly." },
          { id: 'm1-1-s3', targetSequence: ['C#4', 'D#4'], instructions: "Strike the defining grouping of two black keys." },
          { id: 'm1-1-s4', targetSequence: ['F#4', 'G#4', 'A#4'], instructions: "Strike the grouping of three black keys." }
        ]
      },
      {
        id: 'module-1-2',
        title: 'Finger Independence Drillset',
        description: 'Build robust mechanical separation between specific muscle groups.',
        subMissions: [
          { id: 'm1-2-s1', targetSequence: ['C4', 'D4', 'E4', 'F4', 'G4'], instructions: "The 1-2-3-4-5 sequential press." },
          { id: 'm1-2-s2', targetSequence: ['G4', 'F4', 'E4', 'D4', 'C4'], instructions: "The 5-4-3-2-1 descending press." },
          { id: 'm1-2-s3', targetSequence: ['C4', 'E4', 'D4', 'F4', 'E4', 'G4'], instructions: "Skipping Thirds (Crucial to un-linking adjacent fingers)." },
          { id: 'm1-2-s4', targetSequence: ['C4', 'C5', 'C4'], instructions: "The Hand Span Drill: Stretching across the octave." }
        ]
      },
      {
        id: 'module-1-3',
        title: 'Thumb Cross-Unders & The Scale',
        description: 'The foundation of all runs and sweeps on the keyboard.',
        subMissions: [
          { id: 'm1-3-s1', targetSequence: ['C4', 'D4', 'E4', 'F4'], instructions: "Play 1-2-3, then tuck your thumb exactly onto F." },
          { id: 'm1-3-s2', targetSequence: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], instructions: "The Full C Major Ascending run." },
          { id: 'm1-3-s3', targetSequence: ['C5', 'B4', 'A4', 'G4', 'F4', 'E4', 'D4', 'C4'], instructions: "The Full Descending run (cross middle finger over thumb)." }
        ]
      }
    ]
  },
  {
    id: 'phase-2',
    title: 'Phase 2: First Global Melodies',
    description: 'Apply your physical mastery to universally recognized folk phrasing.',
    modules: [
      {
        id: 'module-2-1',
        title: 'Frère Jacques (France)',
        description: 'Master this ancient French nursery melody.',
        subMissions: [
          { id: 'm2-1-s1', targetSequence: ['C4', 'D4', 'E4', 'C4'], instructions: "Phrase A: Frère Jacques, Frère Jacques..." },
          { id: 'm2-1-s2', targetSequence: ['E4', 'F4', 'G4'], instructions: "Phrase B: Dormez-vous, Dormez-vous?" },
          { id: 'm2-1-s3', targetSequence: ['G4', 'A4', 'G4', 'F4', 'E4', 'C4'], instructions: "Phrase C: Sonnez les matines!" }
        ]
      },
      {
        id: 'module-2-2',
        title: 'Sakura Sakura (Japan)',
        description: 'Explore the haunting sound of the Japanese minor pentatonic scale.',
        subMissions: [
          { id: 'm2-2-s1', targetSequence: ['A4', 'A4', 'B4', 'A4', 'A4', 'B4'], instructions: "The delicate cherry blossom opening." },
          { id: 'm2-2-s2', targetSequence: ['A4', 'B4', 'C5', 'B4', 'A4', 'F4'], instructions: "The falling petal sequence." },
          { id: 'm2-2-s3', targetSequence: ['E4', 'C4', 'E4', 'F4', 'E4', 'E4', 'C4', 'B3'], instructions: "The resolution. Feel the minor pull on B3." }
        ]
      },
      {
        id: 'module-2-3',
        title: 'Ode to Joy (Beethoven)',
        description: 'The universal anthem of humanity.',
        subMissions: [
          { id: 'm2-3-s1', targetSequence: ['E4', 'E4', 'F4', 'G4'], instructions: "Phrase A: The bold ascent." },
          { id: 'm2-3-s2', targetSequence: ['G4', 'F4', 'E4', 'D4'], instructions: "Phrase B: The descent." },
          { id: 'm2-3-s3', targetSequence: ['C4', 'C4', 'D4', 'E4'], instructions: "Phrase C: The turnaround hook." },
          { id: 'm2-3-s4', targetSequence: ['E4', 'D4', 'D4'], instructions: "Phrase D: The imperfect resolution." }
        ]
      }
    ]
  },
  {
    id: 'phase-3',
    title: 'Phase 3: Harmony and Structure',
    description: 'Transition from single-note phrasing into playing rigid, structured chords.',
    modules: [
      {
        id: 'module-3-1',
        title: 'The Major Triads',
        description: 'The foundation of bright, happy emotion in harmony.',
        subMissions: [
          { id: 'm3-1-s1', targetSequence: ['C4', 'E4', 'G4'], instructions: "Press the notes of the C Major Triad." },
          { id: 'm3-1-s2', targetSequence: ['F4', 'A4', 'C5'], instructions: "Shift upward to construct the F Major outline." },
          { id: 'm3-1-s3', targetSequence: ['G4', 'B4', 'D5'], instructions: "Shift to the dominant G Major chord." }
        ]
      },
      {
        id: 'module-3-2',
        title: 'The Minor Triads',
        description: 'The foundation of somber, introspective emotion.',
        subMissions: [
          { id: 'm3-2-s1', targetSequence: ['A4', 'C5', 'E5'], instructions: "Construct the A Minor Triad." },
          { id: 'm3-2-s2', targetSequence: ['D4', 'F4', 'A4'], instructions: "Construct the D Minor Triad." }
        ]
      },
      {
        id: 'module-3-3',
        title: 'The I-IV-V Progression',
        description: 'The single most critical chord framework in the history of music.',
        subMissions: [
          { id: 'm3-3-s1', targetSequence: ['C4', 'F4', 'G4', 'C5'], instructions: "Trace the roots of a generic hit song: I -> IV -> V -> I." }
        ]
      }
    ]
  },
  {
    id: 'phase-4',
    title: 'Phase 4: Advanced Global Repertoire',
    description: 'Combine deep rhythmic understanding with sweeping global melodies.',
    modules: [
      {
        id: 'module-4-1',
        title: 'Arirang (Korea)',
        description: 'The unofficial anthem of Korea. A masterclass in major pentatonic soaring.',
        subMissions: [
          { id: 'm4-1-s1', targetSequence: ['G4', 'G4', 'A4', 'G4', 'C5', 'D5', 'C5'], instructions: "The opening valley." },
          { id: 'm4-1-s2', targetSequence: ['A4', 'G4', 'E4', 'D4', 'C4', 'D4', 'C4'], instructions: "The descending mountain motif." }
        ]
      },
      {
        id: 'module-4-2',
        title: 'Cielito Lindo (Mexico)',
        description: 'A masterpiece in lyrical phrasing and bounding melodies.',
        subMissions: [
          { id: 'm4-2-s1', targetSequence: ['C5', 'C5', 'A4', 'B4', 'G4'], instructions: "The iconic waltz entrance." },
          { id: 'm4-2-s2', targetSequence: ['C5', 'C5', 'A4', 'B4', 'G4'], instructions: "The answering waltz repetition." },
          { id: 'm4-2-s3', targetSequence: ['F4', 'E4', 'D4', 'C4'], instructions: "The strict chromatic waltz descent." }
        ]
      },
      {
        id: 'module-4-3',
        title: 'The Master Certification',
        description: 'Prove your physical intuition to graduate the digital academy.',
        subMissions: [
          { id: 'm4-3-s1', targetSequence: ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'], instructions: "Final Test Phase A: Flawless Ascension." },
          { id: 'm4-3-s2', targetSequence: ['C5', 'A4', 'F4', 'D4'], instructions: "Final Test Phase B: The leaping arpeggio drop." },
          { id: 'm4-3-s3', targetSequence: ['C4', 'E4', 'G4', 'C5'], instructions: "Final Test Phase C: The resolving chord climax. You did it!" }
        ]
      }
    ]
  }
];

export function isModuleUnlocked(phaseIndex: number, moduleIndex: number): boolean {
  if (phaseIndex === 0 && moduleIndex === 0) return true;
  if (moduleIndex > 0) {
    const prevModule = COURSE_CURRICULUM[phaseIndex].modules[moduleIndex - 1];
    return isModuleMastered(prevModule.id);
  } else {
    const prevPhase = COURSE_CURRICULUM[phaseIndex - 1];
    const prevModule = prevPhase.modules[prevPhase.modules.length - 1];
    return isModuleMastered(prevModule.id);
  }
}

// Module mastery means every sub-mission within it has a completion token
export function isModuleMastered(moduleId: string): boolean {
  for (const phase of COURSE_CURRICULUM) {
    for (const mod of phase.modules) {
      if (mod.id === moduleId) {
        return mod.subMissions.every(sm => localStorage.getItem(`completed_${sm.id}`) === 'true');
      }
    }
  }
  return false;
}

export function isSubMissionMastered(subMissionId: string): boolean {
  return localStorage.getItem(`completed_${subMissionId}`) === 'true';
}

export function completeSubMission(subMissionId: string) {
  localStorage.setItem(`completed_${subMissionId}`, 'true');
}
