import React from 'react';
import type { StateId, InputSymbol } from '../types/dfa';
import { DFA_TRANSITION_MATRIX, STATE_CONFIGS } from '../logic/dfa';
import { Table } from 'lucide-react';

interface TransitionTableProps {
  currentState: StateId;
  lastInput: InputSymbol | null;
  lastTransition: { from: StateId; input: InputSymbol; to: StateId; equation: string } | null;
}

export const TransitionTable: React.FC<TransitionTableProps> = ({
  currentState,
  lastInput,
  lastTransition,
}) => {
  const states: StateId[] = ['q0', 'q1', 'q2', 'q3'];
  const inputs: InputSymbol[] = ['N', 'S', 'H', 'F'];

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Table size={16} className="text-emerald-400" />
          DFA TRANSITION TABLE MATRIX: δ(Q, Σ) → Q
        </span>
        <span className="text-xs text-slate-500 font-medium">Highlight indicates active state and input selection</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs md:text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-heading">
              <th className="p-3 bg-slate-950/60 font-bold">Current State (Q)</th>
              {inputs.map((inputSym) => {
                const isSelectedCol = lastInput === inputSym;
                return (
                  <th
                    key={inputSym}
                    className={`p-3 text-center font-bold font-mono transition-colors ${
                      isSelectedCol ? 'bg-sky-500/20 text-sky-400 border-x border-sky-500/40' : 'bg-slate-950/40'
                    }`}
                  >
                    Input: {inputSym}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {states.map((stateId) => {
              const isCurrentRow = currentState === stateId;
              const stateConf = STATE_CONFIGS[stateId];

              return (
                <tr
                  key={stateId}
                  className={`border-b border-slate-800/60 transition-colors ${
                    isCurrentRow ? 'bg-slate-900/90 font-semibold' : 'hover:bg-slate-900/30'
                  }`}
                >
                  {/* Current State Cell */}
                  <td className="p-3 font-mono font-bold flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: stateConf.color }}
                    />
                    <span style={{ color: stateConf.color }}>
                      {stateId} ({stateConf.name})
                    </span>
                    {stateId === 'q3' && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded font-sans">
                        Absorbing
                      </span>
                    )}
                  </td>

                  {/* Transition Cells for inputs N, S, H, F */}
                  {inputs.map((inputSym) => {
                    const resultState = DFA_TRANSITION_MATRIX[stateId][inputSym];
                    const isCellTarget =
                      lastTransition?.from === stateId && lastTransition?.input === inputSym;
                    const isColSelected = lastInput === inputSym;

                    return (
                      <td
                        key={inputSym}
                        className={`p-3 text-center font-mono font-bold transition-all ${
                          isCellTarget
                            ? 'bg-sky-500/30 text-white ring-2 ring-sky-400/80 shadow-[0_0_15px_rgba(56,189,248,0.4)] scale-105 rounded-md'
                            : isCurrentRow && isColSelected
                            ? 'bg-sky-500/15 text-sky-300'
                            : isCurrentRow
                            ? 'bg-slate-800/40 text-slate-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {resultState}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
