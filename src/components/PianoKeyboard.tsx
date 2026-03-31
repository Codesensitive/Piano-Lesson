import { useEffect, useRef } from 'react';

import { useMidi } from '../useMidi';

// Expanding Piano Keys to 2.5 Octaves (C3 to G5) to support global repertoire
const PIANO_KEYS = [
  { note: 'C3', type: 'w', keyMap: '1' }, { note: 'C#3', type: 'b', keyMap: 'q' },
  { note: 'D3', type: 'w', keyMap: '2' }, { note: 'D#3', type: 'b', keyMap: 'w' },
  { note: 'E3', type: 'w', keyMap: '3' },
  { note: 'F3', type: 'w', keyMap: '4' }, { note: 'F#3', type: 'b', keyMap: 'r' },
  { note: 'G3', type: 'w', keyMap: '5' }, { note: 'G#3', type: 'b', keyMap: 't' },
  { note: 'A3', type: 'w', keyMap: '6' }, { note: 'A#3', type: 'b', keyMap: 'y' },
  { note: 'B3', type: 'w', keyMap: '7' },
  
  { note: 'C4', type: 'w', keyMap: 'a' }, { note: 'C#4', type: 'b', keyMap: 'z' },
  { note: 'D4', type: 'w', keyMap: 's' }, { note: 'D#4', type: 'b', keyMap: 'x' },
  { note: 'E4', type: 'w', keyMap: 'd' },
  { note: 'F4', type: 'w', keyMap: 'f' }, { note: 'F#4', type: 'b', keyMap: 'c' },
  { note: 'G4', type: 'w', keyMap: 'g' }, { note: 'G#4', type: 'b', keyMap: 'v' },
  { note: 'A4', type: 'w', keyMap: 'h' }, { note: 'A#4', type: 'b', keyMap: 'b' },
  { note: 'B4', type: 'w', keyMap: 'j' },
  
  { note: 'C5', type: 'w', keyMap: 'k' }, { note: 'C#5', type: 'b', keyMap: 'n' },
  { note: 'D5', type: 'w', keyMap: 'l' }, { note: 'D#5', type: 'b', keyMap: 'm' },
  { note: 'E5', type: 'w', keyMap: ';' },
  { note: 'F5', type: 'w', keyMap: '\'' }, { note: 'F#5', type: 'b', keyMap: ',' },
  { note: 'G5', type: 'w', keyMap: ']' },
];

interface PianoKeyboardProps {
  activeNote: string | null;
  expectedNote: string | null;
  onPlayNote: (note: string) => void;
}

export const PianoKeyboard: React.FC<PianoKeyboardProps> = ({ 
  activeNote, 
  expectedNote, 
  onPlayNote 
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useMidi((midiNote) => {
    onPlayNote(midiNote);
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return; 
      const keyMapObj = PIANO_KEYS.find(k => k.keyMap === e.key.toLowerCase());
      if (keyMapObj) {
        onPlayNote(keyMapObj.note);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onPlayNote]);

  // Auto-scroll to Middle C (C4) on mount so the user isn't lost on the left side
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 200; // rough px estimation to center C4
    }
  }, []);

  return (
    <div className="relative flex justify-center mt-12 mb-8 select-none w-full max-w-5xl mx-auto overflow-x-auto pb-4 custom-scrollbar" ref={scrollRef}>
      <div className="relative flex h-64 bg-gray-900 p-4 rounded-xl shadow-2xl border-[rgba(255,255,255,0.1)] border min-w-max">
        {PIANO_KEYS.map((k) => {
          const isBlack = k.type === 'b';
          const isActive = activeNote === k.note;
          const isExpected = expectedNote === k.note;
          
          return (
            <div
              key={k.note}
              data-note={k.note}
              onMouseDown={() => onPlayNote(k.note)}
              className={`
                relative cursor-pointer transition-all duration-75 overflow-hidden
                ${isBlack 
                  ? 'bg-[#222222] h-40 w-10 -mx-5 z-10 rounded-b-md border-b-4 border-black box-border hover:bg-[#333]' 
                  : 'bg-white h-full w-14 rounded-b-lg border-x-[1px] border-b-8 border-gray-300 hover:bg-gray-100'}
                ${isActive && isBlack ? '!bg-[#111111] border-b-0 translate-y-1' : ''}
                ${isActive && !isBlack ? '!bg-[#e0e0e0] border-b-2 translate-y-1' : ''}
                ${isExpected && isBlack ? '!bg-blue-500 !border-blue-800 shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse z-20' : ''}
                ${isExpected && !isBlack ? '!bg-blue-200 !border-blue-400 shadow-[inset_0_0_30px_rgba(59,130,246,0.5)] animate-pulse' : ''}
              `}
            >
              
              <div className={`absolute bottom-1 w-full text-center text-[10px] font-bold opacity-30 ${isBlack ? 'text-white' : 'text-black'}`}>
                {k.keyMap.toUpperCase()}
              </div>
              
              {k.note === 'C4' && !isBlack && (
                <div className="absolute top-2 w-full text-center text-[10px] font-bold text-gray-400">
                  C4
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
