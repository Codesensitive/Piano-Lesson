import { useEffect, useState } from 'react';
import * as Tone from 'tone';
import type { Midi } from '@tonejs/midi';
import { PianoKeyboard } from './PianoKeyboard';
import { audioEngine } from '../AudioEngine';
import type { Note } from '../LessonEngine';

interface MidiPlayerProps {
  midi: Midi;
  onExit: () => void;
}

export function MidiPlayer({ midi, onExit }: MidiPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeNotes, setActiveNotes] = useState<Set<string>>(new Set());
  const [userHits, setUserHits] = useState<Map<string, 'success' | 'error'>>(new Map());
  const [speed, setSpeed] = useState(1.0);
  
  // Clean up any stray string into exact Note match (e.g. C4 vs C#4)
  const formatNote = (noteName: string): Note | null => {
    // Just a basic filter cast since @tonejs/midi guarantees standard note names
    return noteName as Note;
  };

  useEffect(() => {
    // Configure Transport for MIDI tick-based synchronization
    const originalBpm = midi.header.tempos.length > 0 ? midi.header.tempos[0].bpm : 120;
    Tone.Transport.PPQ = midi.header.ppq;
    Tone.Transport.bpm.value = originalBpm * speed; // Set initial speed

    // Note: We remount Parts heavily if we try to change PPQ, so this relies on Tone.Transport.bpm for dynamic stretching.
    const parts: Tone.Part[] = [];
    
    midi.tracks.forEach(track => {
      // Map to Tone.js friendly structure using pure MIDI Ticks ('10i')
      const events = track.notes.map(note => ({
        time: note.ticks + 'i',
        note: note.name,
        durationTicks: note.durationTicks + 'i',
        velocity: note.velocity,
        rawDurationSecs: note.duration // Used for audio duration mapping
      }));

      const part = new Tone.Part((time, value) => {
        const strictNote = formatNote(value.note);
        if (!strictNote) return;

        // Visual Note On
        Tone.Draw.schedule(() => {
          setActiveNotes(prev => new Set(prev).add(strictNote));
        }, time);

        // Visual Note Off (Scheduled exactly durationTicks later)
        const noteOffTime = (time as number) + Tone.Time(value.durationTicks as string).toSeconds();
        Tone.Draw.schedule(() => {
          setActiveNotes(prev => {
            const next = new Set(prev);
            next.delete(strictNote);
            return next;
          });
        }, noteOffTime);

        // Schedule audio 
        audioEngine.scheduleNote(value.note, value.rawDurationSecs, time, value.velocity);

      }, events).start(0);

      parts.push(part);
    });

    return () => {
      // Cleanup Parts and Transport on unmount
      parts.forEach(p => p.dispose());
      Tone.Transport.stop();
      Tone.Transport.cancel(); // clear timeline
    };
  }, [midi]);

  const togglePlayback = async () => {
    await audioEngine.unlock();
    if (isPlaying) {
      Tone.Transport.pause();
      setIsPlaying(false);
    } else {
      Tone.Transport.start();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSpeed = parseFloat(e.target.value);
    setSpeed(newSpeed);
    
    // Dynamically update the Tone Transport BPM without interrupting playback!
    const originalBpm = midi.header.tempos.length > 0 ? midi.header.tempos[0].bpm : 120;
    Tone.Transport.bpm.value = originalBpm * newSpeed;
  };

  const handleUserPlayNote = (note: string) => {
    // Forward the audio directly!
    audioEngine.playNote(note);

    if (!isPlaying) return; // Only validate during active playback

    // Interactive Core Gameplay Validation
    const status = activeNotes.has(note) ? 'success' : 'error';
    
    setUserHits(prev => {
      const next = new Map(prev);
      next.set(note, status);
      return next;
    });

    // Cleanup hit visual swiftly after 300ms
    setTimeout(() => {
      setUserHits(prev => {
        const next = new Map(prev);
        if (next.get(note) === status) {
          next.delete(note);
        }
        return next;
      });
    }, 300);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-screen pt-12 pb-24 relative overflow-hidden transition-all duration-1000 bg-[#0a0f1a]">
      {/* Immersive Synthesia Background */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-blue-900/40 via-blue-900/10 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <button 
        onClick={onExit}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer z-50"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Return to Academy
      </button>

      <div className="mb-8 mt-6 z-10 flex flex-col items-center">
        <h2 className="text-3xl font-black text-white drop-shadow-lg mb-2">{midi.name || "Custom MIDI Song"}</h2>
        <div className="text-blue-400 font-medium tracking-widest text-xs uppercase mb-6 drop-shadow-md">
          Synthesia Visualizer Engine Connected
        </div>

        <button 
          onClick={togglePlayback}
          className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all shadow-xl hover:scale-105 active:scale-95 ${isPlaying ? 'bg-red-500 hover:bg-red-600 shadow-[0_0_20px_rgba(239,68,68,0.4)]' : 'bg-emerald-500 hover:bg-emerald-600 shadow-[0_0_20px_rgba(34,197,94,0.4)]'}`}
        >
          {isPlaying ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
              Pause Playback
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
              Start Synthesia
            </>
          )}
        </button>
        
        {/* Speed Adjustment Slider */}
        <div className="mt-8 flex flex-col items-center bg-black/40 p-5 rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-2xl backdrop-blur-md w-72">
          <label className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-3 flex justify-between w-full">
            <span>Playback Speed</span>
            <span className="text-blue-400">{Math.round(speed * 100)}%</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="1.0" 
            step="0.05" 
            value={speed} 
            onChange={handleSpeedChange}
            className="w-full accent-blue-500 cursor-pointer h-2 bg-gray-700 rounded-lg appearance-none"
          />
          <div className="flex justify-between w-full mt-2 text-[10px] font-mono text-gray-500">
            <span>Extremely Slow</span>
            <span>Original</span>
          </div>
        </div>
      </div>

      <div className="z-10 w-full px-4 max-w-5xl relative mt-auto pb-12">
        {/* We pass activeNote as null since PianoKeyboard accepts strings, but we map the Set for visual glow overrides over top */}
        <div className="relative">
          <PianoKeyboard 
            activeNote={null}
            expectedNote={null}
            onPlayNote={handleUserPlayNote}
          />

          {/* Override CSS visualization injector: This forces the PianoKeys to light up dynamically */}
          <style>
            {`
              /* Base Backing Track (Blue) */
              ${Array.from(activeNotes).map(note => `
                div[data-note="${note}"] {
                  background-color: rgb(59 130 246) !important;
                  border-color: rgb(29 78 216) !important;
                  box-shadow: 0 0 25px rgba(59,130,246,0.8) !important;
                  transform: translateY(4px) !important;
                }
              `).join('\n')}

              /* User Hit Validaion (Green / Red) */
              ${Array.from(userHits.entries()).map(([note, status]) => {
                if (status === 'success') {
                  return `
                    div[data-note="${note}"] {
                      background-color: rgb(34 197 94) !important;
                      border-color: rgb(21 128 61) !important;
                      box-shadow: 0 0 35px rgba(34,197,94,1.0) !important;
                      transform: translateY(6px) !important;
                      z-index: 50 !important;
                    }
                  `;
                } else {
                  return `
                    div[data-note="${note}"] {
                      background-color: rgb(239 68 68) !important;
                      border-color: rgb(185 28 28) !important;
                      box-shadow: 0 0 35px rgba(239,68,68,1.0) !important;
                      transform: translateY(6px) !important;
                      z-index: 50 !important;
                    }
                  `;
                }
              }).join('\n')}
            `}
          </style>
        </div>
      </div>
    </div>
  );
}
