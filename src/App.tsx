import { useState, useRef } from 'react';
import type { Note, SubMission } from './LessonEngine';
import { LessonEngine } from './LessonEngine';
import { PianoKeyboard } from './components/PianoKeyboard';
import { LessonFeedback } from './components/LessonFeedback';
import { Dashboard } from './components/Dashboard';
import { ModuleDetail } from './components/ModuleDetail';
import { MidiPlayer } from './components/MidiPlayer';
import { audioEngine } from './AudioEngine';
import type { Module } from './Curriculum';
import { completeSubMission } from './Curriculum';
import type { Midi } from '@tonejs/midi';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'module' | 'lesson' | 'midiPlayer'>('dashboard');
  
  const [activeModule, setActiveModule] = useState<Module | null>(null);
  const [activeSubMission, setActiveSubMission] = useState<SubMission | null>(null);
  const [activeMidi, setActiveMidi] = useState<Midi | null>(null);

  const engineRef = useRef<LessonEngine | null>(null);
  
  // React render triggers
  const [, forceRender] = useState({});
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [showErrorFeedback, setShowErrorFeedback] = useState(false);

  // Navigation handlers
  const handleSelectModule = (module: Module) => {
    setActiveModule(module);
    setCurrentView('module');
  };

  const handleSelectSubMission = async (subMission: SubMission) => {
    await audioEngine.unlock(); // User interaction unlocks audio cleanly
    
    engineRef.current = new LessonEngine(subMission);
    setActiveSubMission(subMission);
    setCurrentView('lesson');
  };

  const handleReturnToDashboard = () => setCurrentView('dashboard');
  const handleReturnToModule = () => setCurrentView('module');

  const handleMidiLoaded = async (midi: Midi) => {
    await audioEngine.unlock();
    setActiveMidi(midi);
    setCurrentView('midiPlayer');
  };

  const handlePlayNote = (note: string) => {
    if (currentView !== 'lesson' || !engineRef.current || !activeSubMission) return;

    // Visual feedback for the exact physical note pressed
    setActiveNote(note);
    audioEngine.playNote(note);
    setTimeout(() => setActiveNote(null), 150);

    // Validate using Engine
    const isCorrect = engineRef.current.playNote(note as Note);
    
    if (!isCorrect && !engineRef.current.state.isComplete) {
      setShowErrorFeedback(true);
      setTimeout(() => setShowErrorFeedback(false), 800);
    }

    // If step completeness triggered the SubMission to finish:
    if (engineRef.current.state.isComplete) {
      completeSubMission(activeSubMission.id);
      
      // Allow user to bask in "Mastery" message for 2.5 seconds
      setTimeout(() => {
        handleReturnToModule();
      }, 2500);
    }
    
    forceRender({});
  };

  // ----------------------------------------------------------------------
  // View Rendering
  // ----------------------------------------------------------------------

  if (currentView === 'dashboard') {
    return <Dashboard onSelectModule={handleSelectModule} onMidiLoaded={handleMidiLoaded} />;
  }

  if (currentView === 'module' && activeModule) {
    return (
      <ModuleDetail 
        module={activeModule} 
        onBack={handleReturnToDashboard} 
        onSelectSubMission={handleSelectSubMission} 
      />
    );
  }

  if (currentView === 'lesson' && activeSubMission && engineRef.current) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen pt-12 pb-24 relative overflow-hidden transition-all duration-1000 bg-black/50">
        
        {/* Immersive Dark Mode HUD Background elements specifically for interactive lessons */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-black to-black pointer-events-none -z-10" />
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none -z-10" />

        <button 
          onClick={handleReturnToModule}
          className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Abort Sub-Mission
        </button>

        <div className="mb-8 mt-6 text-center z-10">
           <span className="text-blue-500 font-bold tracking-widest text-xs uppercase block mb-2">{activeModule?.title}</span>
        </div>

        <div className="z-10 w-full px-4 max-w-5xl">
          <LessonFeedback 
            subMission={activeSubMission} 
            lessonState={engineRef.current.state} 
            justPlayedError={showErrorFeedback}
          />
          
          <PianoKeyboard 
            activeNote={activeNote}
            expectedNote={activeSubMission.targetSequence[engineRef.current.state.expectedNoteIndex]}
            onPlayNote={handlePlayNote}
          />
        </div>
      </div>
    );
  }

  if (currentView === 'midiPlayer' && activeMidi) {
    return <MidiPlayer midi={activeMidi} onExit={handleReturnToDashboard} />;
  }

  return null;
}

export default App;
