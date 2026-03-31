import type { SubMission, LessonState } from '../LessonEngine';

interface LessonFeedbackProps {
  subMission: SubMission;
  lessonState: LessonState;
  justPlayedError: boolean;
}

export function LessonFeedback({ 
  subMission, 
  lessonState,
  justPlayedError
}: LessonFeedbackProps) {

  if (lessonState.isComplete) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-[rgba(255,255,255,0.05)] backdrop-blur-xl border border-[rgba(34,197,94,0.3)] rounded-2xl shadow-[0_0_40px_rgba(34,197,94,0.15)] w-full max-w-2xl mx-auto transition-all duration-500 scale-105">
        <h2 className="text-4xl font-extrabold text-[#22c55e] mb-4">Mastered!</h2>
        <p className="text-emerald-100 text-lg">Sequence executed flawlessly.</p>
        <div className="mt-6 text-sm text-emerald-400">Total Errors: {lessonState.errorCount}</div>
      </div>
    );
  }

  return (
    <div className={`relative flex flex-col p-8 bg-[rgba(255,255,255,0.02)] backdrop-blur-3xl border rounded-2xl w-full max-w-2xl mx-auto transition-all duration-300 ${justPlayedError ? 'border-[#ef4444] shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-[#3b82f6] shadow-[0_0_20px_rgba(59,130,246,0.1)]'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold tracking-widest text-blue-400 uppercase">Interactive Drill Active</h3>
        <span className="text-xs text-gray-500">Errors: {lessonState.errorCount}</span>
      </div>
      
      <p className="text-2xl font-semibold text-white tracking-wide mb-8">
        {subMission.instructions}
      </p>

      {/* Sequence visualization */}
      <div className="flex flex-wrap gap-4 min-h-[4rem] justify-center">
        {subMission.targetSequence.map((note, idx) => {
          const isCompleted = idx < lessonState.expectedNoteIndex;
          const isNext = idx === lessonState.expectedNoteIndex;
          
          return (
            <div 
              key={`${note}-${idx}`}
              className={`flex items-center justify-center w-14 h-14 rounded-full font-bold text-lg transition-all duration-300
                ${isCompleted ? 'bg-[#22c55e] text-white shadow-[0_0_15px_rgba(34,197,94,0.4)] scale-110' : ''}
                ${isNext ? 'bg-[#3b82f6] text-white shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-pulse border-2 border-white' : ''}
                ${!isCompleted && !isNext ? 'bg-[rgba(255,255,255,0.05)] text-gray-500 border border-[rgba(255,255,255,0.1)]' : ''}
              `}
            >
              {note}
            </div>
          );
        })}
      </div>
      
      {justPlayedError && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-[#ef4444] text-sm font-bold tracking-widest uppercase animate-bounce drop-shadow-[0_2px_5px_rgba(239,68,68,0.5)]">
          Sequence broken! Resetting...
        </div>
      )}
    </div>
  );
}
