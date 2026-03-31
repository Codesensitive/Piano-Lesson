import { COURSE_CURRICULUM, isModuleUnlocked, isModuleMastered } from '../Curriculum';
import type { Module } from '../Curriculum';
import { MidiDropzone } from './MidiDropzone';
import type { Midi } from '@tonejs/midi';

interface DashboardProps {
  onSelectModule: (module: Module) => void;
  onMidiLoaded: (midi: Midi) => void;
}

export function Dashboard({ onSelectModule, onMidiLoaded }: DashboardProps) {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 lg:px-24 relative overflow-hidden">
      
      {/* HUD Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[150px] pointer-events-none" />

      <header className="mb-16 z-10">
        <h1 className="text-5xl lg:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400 tracking-tight mb-4 drop-shadow-lg">
          Global Piano Academy
        </h1>
        <p className="text-gray-300 text-lg lg:text-xl max-w-2xl font-light">
          Your complete roadmap to mastering the keyboard. Select a Module or Drop a custom song below.
        </p>
      </header>

      <div className="relative z-10 w-full">
        <MidiDropzone onMidiLoaded={onMidiLoaded} />
      </div>

      <div className="flex flex-col gap-12 z-10">
        {COURSE_CURRICULUM.map((phase, pIndex) => (
          <section key={phase.id} className="relative">
            {/* Phase Header */}
            <div className="mb-6 flex items-baseline gap-4">
              <h2 className="text-2xl font-bold text-white tracking-wide">{phase.title}</h2>
              <span className="text-sm text-gray-400 font-medium">{phase.description}</span>
            </div>

            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {phase.modules.map((module, mIndex) => {
                const unlocked = isModuleUnlocked(pIndex, mIndex);
                const completed = isModuleMastered(module.id);

                return (
                  <button
                    key={module.id}
                    onClick={() => unlocked && onSelectModule(module)}
                    disabled={!unlocked}
                    className={`
                      relative group flex flex-col items-start p-8 rounded-2xl border text-left transition-all duration-300
                      ${unlocked 
                        ? 'bg-[rgba(255,255,255,0.05)] backdrop-blur-xl hover:bg-[rgba(255,255,255,0.08)] cursor-pointer shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:-translate-y-1' 
                        : 'bg-[rgba(0,0,0,0.3)] backdrop-blur-sm cursor-not-allowed opacity-60'
                      }
                      ${completed 
                        ? 'border-[rgba(34,197,94,0.4)]' 
                        : unlocked ? 'border-[rgba(255,255,255,0.1)] border-b-[rgba(59,130,246,0.5)] border-b-2' : 'border-[rgba(255,255,255,0.05)]'
                      }
                    `}
                  >
                    
                    {/* Status Badge */}
                    <div className="flex justify-between w-full mb-4">
                      <div className={`text-xs font-bold tracking-widest uppercase px-3 py-1 rounded-full ${completed ? 'bg-emerald-500/20 text-emerald-400' : unlocked ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`}>
                        {completed ? 'Mastered' : unlocked ? 'Unlocked' : 'Locked'}
                      </div>
                      
                      {!unlocked && (
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      )}
                    </div>

                    <h3 className={`text-xl font-bold mb-2 ${unlocked ? 'text-white' : 'text-gray-400'}`}>
                      {module.title}
                    </h3>
                    
                    <p className="text-sm text-gray-400 font-light leading-relaxed">
                      {module.description}
                    </p>

                    {/* Completion metrics hook */}
                    <div className="w-full bg-gray-800 h-1.5 rounded-full mt-6 overflow-hidden">
                      <div className={`h-full transition-all duration-700 ${completed ? 'bg-emerald-500 w-full' : unlocked ? 'bg-gradient-to-r from-blue-500 to-emerald-500 group-hover:w-[10%] w-0' : 'w-0'}`}></div>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
