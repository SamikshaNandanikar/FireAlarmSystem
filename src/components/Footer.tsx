import React from 'react';
import { ShieldCheck, Award } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="glass-panel p-6 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
      <div className="flex flex-col gap-1 text-center md:text-left">
        <span className="font-bold text-slate-200 font-heading text-sm">
          SMART FIRE ALARM SYSTEM — DFA SIMULATOR
        </span>
        <span className="text-slate-400">
          Deterministic Finite Automata (DFA) Theory of Computation Demonstration
        </span>
      </div>

      <div className="flex items-center gap-4 flex-wrap justify-center">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
          <Award size={14} className="text-amber-400" />
          <span>Automata Theory Project</span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500">
          <ShieldCheck size={14} className="text-emerald-400" />
          <span>Educational simulation — sensor values are simulated.</span>
        </div>
      </div>
    </footer>
  );
};
