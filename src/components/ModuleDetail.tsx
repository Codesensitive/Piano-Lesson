import type { Module } from '../Curriculum';
import { isSubMissionMastered } from '../Curriculum';
import type { SubMission } from '../LessonEngine';

interface ModuleDetailProps {
  module: Module;
  onBack: () => void;
  onSelectSubMission: (subMission: SubMission) => void;
}

export function ModuleDetail({ module, onBack, onSelectSubMission }: ModuleDetailProps) {
  
  const totalSubMissions = module.subMissions.length;
  const masteredCount = module.subMissions.filter(sm => isSubMissionMastered(sm.id)).length;
  const isFullyMastered = masteredCount === totalSubMissions;

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 px-6 lg:px-24 relative overflow-hidden transition-all duration-700">
      
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-full h-[600px] bg-gradient-to-bl from-blue-900/10 to-transparent pointer-events-none -z-10" />
      
      <button 
        onClick={onBack}
        className="self-start flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Return to Conservatory
      </button>

      <header className="mb-12 z-10">
        <div className="flex items-center gap-4 mb-3">
          <div className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-full ${isFullyMastered ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
            {masteredCount} / {totalSubMissions} Mastered
          </div>
        </div>
        <h1 className="text-4xl lg:text-6xl font-black text-white tracking-tight mb-4 drop-shadow-md">
          {module.title}
        </h1>
        <p className="text-gray-300 text-lg max-w-3xl font-light">
          {module.description}
        </p>
      </header>

      <div className="flex flex-col gap-4 max-w-4xl z-10">
        <h3 className="text-xl font-bold text-gray-200 mb-2 border-b border-gray-800 pb-2">Sub-Missions</h3>
        
        {module.subMissions.map((sm, index) => {
          const mastered = isSubMissionMastered(sm.id);
          
          return (
            <button
              key={sm.id}
              onClick={() => onSelectSubMission(sm)}
              className={`
                flex items-center justify-between p-6 rounded-xl border transition-all duration-300 group
                ${mastered 
                  ? 'bg-emerald-900/10 border-emerald-500/30 hover:bg-emerald-900/20 shadow-[inset_4px_0_0_rgb(16,185,129)]' 
                  : 'bg-[rgba(255,255,255,0.03)] border-[rgba(255,255,255,0.1)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(59,130,246,0.5)] shadow-[inset_4px_0_0_rgba(255,255,255,0.1)] hover:shadow-[inset_4px_0_0_rgb(59,130,246)]'
                }
              `}
            >
              <div className="flex flex-col items-start gap-1">
                <span className={`text-sm font-bold tracking-wider ${mastered ? 'text-emerald-400' : 'text-blue-400'}`}>
                  Sub-Mission {index + 1}
                </span>
                <span className="text-xl text-left font-medium text-white group-hover:text-blue-100 transition-colors">
                  {sm.instructions}
                </span>
                <span className="text-xs text-gray-500 font-mono mt-1">
                  Sequence length: {sm.targetSequence.length} notes
                </span>
              </div>
              
              <div className="flex-shrink-0 ml-6">
                {mastered ? (
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 ring-1 ring-emerald-500/50">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-[0_0_15px_rgba(59,130,246,0.6)] opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100">
                    <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4z" />
                    </svg>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
