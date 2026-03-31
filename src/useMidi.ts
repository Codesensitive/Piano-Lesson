/// <reference types="webmidi" />
import { useState, useEffect } from 'react';

// Basic mapping from MIDI note numbers to Note strings for C4-C5 range
// Middle C (C4) is MIDI note 60
const midiToNoteMap: Record<number, string> = {
  60: 'C4',
  61: 'C#4',
  62: 'D4',
  63: 'D#4',
  64: 'E4',
  65: 'F4',
  66: 'F#4',
  67: 'G4',
  68: 'G#4',
  69: 'A4',
  70: 'A#4',
  71: 'B4',
  72: 'C5'
};

export function useMidi(onNotePlay: (note: string) => void) {
  const [midiAccess, setMidiAccess] = useState<WebMidi.MIDIAccess | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (navigator.requestMIDIAccess) {
      navigator.requestMIDIAccess()
        .then((access) => {
          setMidiAccess(access);
          
          const inputs = access.inputs.values();
          for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
            input.value.onmidimessage = (message: WebMidi.MIDIMessageEvent) => {
              handleMidiMessage(message);
            };
          }
          
          access.onstatechange = (e: WebMidi.MIDIConnectionEvent) => {
            if (e.port.type === 'input' && e.port.state === 'connected') {
              (e.port as WebMidi.MIDIInput).onmidimessage = handleMidiMessage;
            }
          };
        })
        .catch(err => {
          console.warn("MIDI access failed", err);
          setError("MIDI access denied or unsupported.");
        });
    } else {
      setError("Web MIDI is not supported in this browser.");
    }
    
    return () => {
      // cleanup would go here if needed
    };
  }, []);

  const handleMidiMessage = (message: WebMidi.MIDIMessageEvent) => {
    // Note on message is typically 144 (0x90) for channel 1
    // Command corresponds to the top nibble
    const command = message.data[0] >> 4;
    const note = message.data[1];
    const velocity = message.data.length > 2 ? message.data[2] : 0;

    // Note On (command 9) with velocity > 0
    if (command === 9 && velocity > 0) {
      const parsedNote = midiToNoteMap[note];
      if (parsedNote) {
        onNotePlay(parsedNote);
      }
    }
  };

  return { midiAccess, error };
}
