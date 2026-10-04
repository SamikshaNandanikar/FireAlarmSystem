import React from 'react';
import type { StateId, InputSymbol } from '../types/dfa';
import { Play, RotateCcw, Award } from 'lucide-react';

interface DemoModeProps {
  currentState: StateId;
  isDemoMode: boolean;
  onToggleDemoMode: () => void;
  onResetSystem: () => void;
  onTriggerInput: (input: InputSymbol) => void;
}

export const DemoMode: React.FC<DemoModeProps> = ({
  currentState,
  isDemoMode,
  onToggleDemoMode,
  onResetSystem,
}) => {
  const getStepNumber = () => {
    switch (currentState) {
      case 'q0': return 1;
      case 'q1': return 2;
      case 'q2': return 3;
      case 'q3': return 4;
    }
  };

  const getRecommendedNextInput = (): InputSymbol | null => {
    switch (currentState) {
      case 'q0': return 'S'; // Step 2: S -> q1
      case 'q1': return 'H'; // Step 3: H -> q2
      case 'q2': return 'F'; // Step 4: F -> q3
      case 'q3': return null;
    }
  };

  const stepNum = getStepNumber();
  const nextInput = getRecommendedNextInput();

  return (
    <div className="glass-panel p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Demo Mode Toggle & Instructions */}
      <div className="flex flex-col gap-2 w-full md:w-auto text-left">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleDemoMode}
            className={`px-4 py-2.5 rounded-xl font-bold font-heading text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
              isDemoMode
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-sky-400'
                : 'bg-slate-900 text-sky-400 border border-slate-800 hover:border-sky-500/50'
            }`}
          >
            <Play size={15} className={isDemoMode ? 'fill-slate-950' : ''} />
            <span>{isDemoMode ? 'DEMO MODE ACTIVE' : 'ENABLE DEMO MODE'}</span>
          </button>

          {isDemoMode && (
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-extrabold font-mono">
              STEP {stepNum} / 4
            </span>
          )}
        </div>

        {isDemoMode && (
          <div className="text-xs text-slate-300 flex items-center gap-2 pt-1">
            <Award size={14} className="text-amber-400 flex-shrink-0" />
            <span>
              Recommended progression: <strong>NORMAL (q0)</strong> → <strong>SMOKE (q1)</strong> → <strong>HIGH TEMP (q2)</strong> → <strong>FIRE (q3)</strong>.
              {nextInput ? (
                <span className="text-sky-400 font-bold ml-1">Click "{nextInput}" button above!</span>
              ) : (
                <span className="text-red-400 font-bold ml-1">Sequence complete! Click RESET.</span>
              )}
            </span>
          </div>
        )}
      </div>

      {/* Large System Reset Button */}
      <div className="w-full md:w-auto flex justify-end">
        <button
          onClick={onResetSystem}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl font-extrabold font-heading text-sm uppercase tracking-wider bg-gradient-to-r from-red-600/30 via-red-500/20 to-orange-500/30 text-red-400 border border-red-500/50 hover:border-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95 flex items-center justify-center gap-2.5"
        >
          <RotateCcw size={18} className="animate-spin-once" />
          <span>RESET SYSTEM (q0)</span>
        </button>
      </div>
    </div>
  );
};
