import { useState } from 'react';
import { Midi } from '@tonejs/midi';

interface MidiDropzoneProps {
  onMidiLoaded: (midi: Midi) => void;
}

export function MidiDropzone({ onMidiLoaded }: MidiDropzoneProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [errorStatus, setErrorStatus] = useState<string | null>(null);

  const handleFileDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(false);
    setErrorStatus(null);
    
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.mid') && !file.name.toLowerCase().endsWith('.midi')) {
      setErrorStatus('Please drop a valid .mid or .midi file!');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      onMidiLoaded(midi);
    } catch (err) {
      console.error(err);
      setErrorStatus('Failed to parse MIDI file. It might be corrupted.');
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsHovering(true);
  };

  const handleDragLeave = () => {
    setIsHovering(false);
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorStatus(null);
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const midi = new Midi(arrayBuffer);
      onMidiLoaded(midi);
    } catch (err) {
      console.error(err);
      setErrorStatus('Failed to parse MIDI file.');
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-12 relative flex flex-col md:flex-row gap-6 items-stretch">
      {/* Visual Instruction Panel */}
      <div className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.05)] rounded-2xl p-8 backdrop-blur-md flex flex-col justify-center items-start shadow-xl">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-blue-400">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold tracking-wide text-white">Synthesia Engine</h2>
        </div>
        <p className="text-gray-400 leading-relaxed font-light mb-6 text-sm">
          Experience interactive falling-note visualisations on any song in the world. 
          Upload a standard <code className="bg-black/30 px-1 py-0.5 rounded text-blue-300">.mid</code> file, and the engine will instantly synchronize our 32-key piano to the backing tracks giving you a perfect visual teacher.
        </p>
        
        {/* BitMidi Prompt */}
        <div className="flex items-center gap-4 bg-black/40 p-4 rounded-xl border border-white/5 w-full group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
          <div className="relative z-10 font-bold text-2xl tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            bitmidi
          </div>
          <div className="relative z-10 flex flex-col">
            <span className="text-xs text-gray-300 font-medium">Need a song?</span>
            <a 
              href="https://bitmidi.com/" 
              target="_blank" 
              rel="noreferrer"
              className="text-sm font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              Download MIDI files here
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Interactive Drop Zone */}
      <div 
        onDrop={handleFileDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`flex-1 min-h-[250px] rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-8 transition-all duration-300 relative overflow-hidden group cursor-pointer
          ${isHovering 
            ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]' 
            : 'border-gray-700 bg-[rgba(0,0,0,0.4)] hover:border-gray-500 hover:bg-[rgba(255,255,255,0.02)]'
          }
        `}
      >
        <input 
          type="file" 
          accept=".mid,.midi" 
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
          title="Drop a MIDI file here"
        />

        <svg 
          className={`w-16 h-16 mb-4 transition-all duration-500 ${isHovering ? 'text-blue-400 scale-110 -translate-y-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'text-gray-600 group-hover:text-gray-400'}`} 
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>

        <h3 className={`text-xl font-bold mb-2 transition-colors ${isHovering ? 'text-white' : 'text-gray-300'}`}>
          Drop your <span className={isHovering ? 'text-blue-400' : 'text-white'}>.mid</span> file here
        </h3>
        <p className="text-gray-500 text-sm font-medium z-10 text-center">
          Or click to browse your computer
        </p>
        
        {errorStatus && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap bg-red-500/20 px-4 py-1.5 rounded-full text-red-400 text-xs font-bold ring-1 ring-red-500/40 z-10">
            {errorStatus}
          </div>
        )}
      </div>
    </div>
  );
}
