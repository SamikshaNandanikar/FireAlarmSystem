import React from 'react';
import { Play, RotateCcw, Award } from 'lucide-react';

interface DemoModeProps {
  demoStep: number;
  onStartAutoSimulation: () => void;
  onResetSystem: () => void;
}

export const DemoMode: React.FC<DemoModeProps> = ({
  demoStep,
  onStartAutoSimulation,
  onResetSystem,
}) => {
  const getStepDescription = () => {
    switch (demoStep) {
      case 0: return 'Step 1 / 8: Initializing Normal Baseline (q0)';
      case 1: return 'Step 2 / 8: Smoke Detected in Laboratory (Zone C) -> q1 (WARNING)';
      case 2: return 'Step 3 / 8: Heat Spike Detected in Laboratory (Zone C) -> q2 (FIRE SUSPECTED)';
      case 3: return 'Step 4 / 8: Optical Flame Confirmed -> q3 (FIRE CONFIRMED)';
      case 4: return 'Step 5 / 8: Manual Emergency Pull Activated -> q4 (EVACUATION)';
      case 5: return 'Step 6 / 8: Flame Suppressed by Sprinklers';
      case 6: return 'Step 7 / 8: Fire Cleared & Decontaminated -> q5 (FIRE CLEARED)';
      case 7: return 'Step 8 / 8: Restoring System Baseline -> q0 (NORMAL)';
      default: return 'Automated Fire Simulation Completed';
    }
  };

  return (
    <div className="glass-panel p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-6">
      {/* Demo Runner Controls */}
      <div className="flex flex-col gap-2 w-full md:w-auto text-left">
        <div className="flex items-center gap-3">
          <button
            onClick={onStartAutoSimulation}
            disabled={demoStep !== -1}
            className={`px-5 py-3 rounded-xl font-bold font-heading text-xs tracking-wider uppercase transition-all flex items-center gap-2 ${
              demoStep !== -1
                ? 'bg-sky-500 text-slate-950 shadow-[0_0_20px_rgba(56,189,248,0.5)] border border-sky-400'
                : 'bg-slate-900 text-sky-400 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800'
            }`}
          >
            <Play size={16} className={demoStep !== -1 ? 'fill-slate-950' : ''} />
            <span>{demoStep !== -1 ? 'RUNNING FIRE SIMULATION...' : '▶ RUN FIRE SIMULATION'}</span>
          </button>

          {demoStep !== -1 && (
            <span className="px-3 py-1 rounded-full bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-extrabold font-mono">
              STEP {demoStep + 1} / 8
            </span>
          )}
        </div>

        {demoStep !== -1 && (
          <div className="text-xs text-slate-300 flex items-center gap-2 pt-1 font-mono">
            <Award size={14} className="text-amber-400 flex-shrink-0" />
            <span>{getStepDescription()}</span>
          </div>
        )}
      </div>

      {/* Reset Button */}
      <div className="w-full md:w-auto flex justify-end">
        <button
          onClick={onResetSystem}
          className="w-full md:w-auto px-6 py-3.5 rounded-xl font-extrabold font-heading text-sm uppercase tracking-wider bg-gradient-to-r from-red-600/30 via-red-500/20 to-orange-500/30 text-red-400 border border-red-500/50 hover:border-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(239,68,68,0.25)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] active:scale-95 flex items-center justify-center gap-2.5"
        >
          <RotateCcw size={18} />
          <span>RESET SYSTEM (q0)</span>
        </button>
      </div>
    </div>
  );
};
