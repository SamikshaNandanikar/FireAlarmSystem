import React from 'react';
import type { AutomataState } from '../types/automata';
import { AUTOMATA_STATES, getMealyOutput } from '../logic/automata';
import { Table } from 'lucide-react';

interface TransitionTableProps {
  currentState: AutomataState;
  lastTransition: { fromState: AutomataState; toState: AutomataState; triggerInput: string; equation: string } | null;
}

export const TransitionTable: React.FC<TransitionTableProps> = ({
  currentState,
  lastTransition,
}) => {
  const tableRows: Array<{
    state: AutomataState | 'Any';
    condition: string;
    nextState: AutomataState;
    outputLabel: string;
  }> = [
    { state: 'q0', condition: 'No dangerous inputs (All OFF)', nextState: 'q0', outputLabel: 'Normal Baseline' },
    { state: 'q0', condition: 'Smoke ON OR Heat ON', nextState: 'q1', outputLabel: 'Warning Beep + Light ON' },
    { state: 'q1', condition: 'Smoke ON + Heat ON', nextState: 'q2', outputLabel: 'Double Warning Beep + Alert' },
    { state: 'q2', condition: 'Smoke + Heat + Flame ON', nextState: 'q3', outputLabel: 'Siren ON + Sprinkler ON' },
    { state: 'q3', condition: 'Manual Emergency Pull / Escalation', nextState: 'q4', outputLabel: 'High Priority Siren + Evacuate' },
    { state: 'q3', condition: 'Hazard Cleared (All OFF)', nextState: 'q5', outputLabel: 'Cleared Chime + Hazard OFF' },
    { state: 'Any', condition: 'Sensor Fault ON', nextState: 'q6', outputLabel: 'Fault Buzz + Maintenance' },
    { state: 'Any', condition: 'System Reset Pressed', nextState: 'q7', outputLabel: 'Reset Chime -> q0 Baseline' },
  ];

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Table size={16} className="text-emerald-400" />
          MEALY MACHINE TRANSITION TABLE: δ(State, Input) → Next State, λ(State, Input) → Output
        </span>
        <span className="text-xs text-slate-500 font-medium">Highlight indicates active state and transition rule</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-heading bg-slate-950/60">
              <th className="p-3 font-bold">Current State (Q)</th>
              <th className="p-3 font-bold">Virtual Sensor Input Condition (Σ)</th>
              <th className="p-3 font-bold">Next State (Q')</th>
              <th className="p-3 font-bold">Mealy Machine Response Output (λ)</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => {
              const isAnyState = row.state === 'Any';
              const isCurrentRow = currentState === row.state || (isAnyState && currentState !== 'q0');
              const isLastTraversed = lastTransition?.toState === row.nextState && lastTransition?.fromState === row.state;
              const meta = AUTOMATA_STATES[row.nextState];
              const mealy = getMealyOutput(row.nextState);
              const displayBadgeMeta = isAnyState ? AUTOMATA_STATES['q0'] : AUTOMATA_STATES[row.state as AutomataState];

              return (
                <tr
                  key={idx}
                  className={`border-b border-slate-800/60 transition-all ${
                    isLastTraversed
                      ? 'bg-sky-500/20 text-white font-bold border-l-4 border-l-sky-400'
                      : isCurrentRow
                      ? 'bg-slate-900/90 font-semibold'
                      : 'hover:bg-slate-900/40 text-slate-300'
                  }`}
                >
                  <td className="p-3 font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded border text-xs ${displayBadgeMeta.badgeBg}`}>
                      {row.state}
                    </span>
                  </td>
                  <td className="p-3 font-medium text-slate-200">{row.condition}</td>
                  <td className="p-3 font-mono font-bold">
                    <span className={`px-2 py-0.5 rounded border text-xs ${meta.badgeBg}`}>
                      {row.nextState} ({meta.name})
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-sky-300">{row.outputLabel}</span>
                      {mealy.sprinkler && (
                        <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px]">
                          💧 Sprinkler ON
                        </span>
                      )}
                      {mealy.siren && (
                        <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-300 text-[10px]">
                          🔊 Siren ON
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
