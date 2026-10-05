import React from 'react';
import type { AutomataState } from '../types/automata';
import { AUTOMATA_STATES } from '../logic/automata';
import { Network } from 'lucide-react';

interface DFAGraphProps {
  currentState: AutomataState;
  lastTransition: { fromState: AutomataState; toState: AutomataState; triggerInput: string; equation: string } | null;
}

export const DFAGraph: React.FC<DFAGraphProps> = ({ currentState, lastTransition }) => {
  const isEdgeActive = (from: AutomataState, to: AutomataState) => {
    if (!lastTransition) return false;
    return lastTransition.fromState === from && lastTransition.toState === to;
  };

  const nodePos: Record<AutomataState, { x: number; y: number }> = {
    q0: { x: 70, y: 100 },
    q1: { x: 230, y: 100 },
    q2: { x: 390, y: 100 },
    q3: { x: 550, y: 100 },
    q4: { x: 670, y: 100 },
    q5: { x: 550, y: 280 },
    q6: { x: 390, y: 280 },
    q7: { x: 70, y: 280 },
  };

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Network size={16} className="text-sky-400" />
          MEALY / DFA STATE MACHINE GRAPH (q0 – q7)
        </span>
        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          Active Node: {currentState} ({AUTOMATA_STATES[currentState].name})
        </span>
      </div>

      <div className="relative flex justify-center items-center py-4 bg-slate-950/80 rounded-xl border border-slate-800/80 overflow-x-auto">
        <svg viewBox="0 0 740 360" className="w-full min-w-[680px] max-w-[760px] h-auto">
          <defs>
            <marker id="arrow-default" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Initial Arrow into q0 */}
          <path d="M 15,100 L 38,100" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-default)" />
          <text x="25" y="90" fill="#64748b" fontSize="10" fontWeight="800" textAnchor="middle">
            START
          </text>

          {/* Core Escalation Edges */}
          {/* q0 -> q1 (Smoke / Heat) */}
          <path
            d="M 100,100 L 200,100"
            stroke={isEdgeActive('q0', 'q1') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q0', 'q1') ? '3.5' : '2'}
            className={isEdgeActive('q0', 'q1') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q0', 'q1') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="150" y="90" fill={isEdgeActive('q0', 'q1') ? '#38bdf8' : '#94a3b8'} fontSize="10" fontWeight="800" textAnchor="middle">
            Smoke/Heat
          </text>

          {/* q1 -> q2 (Smoke + Heat) */}
          <path
            d="M 260,100 L 360,100"
            stroke={isEdgeActive('q1', 'q2') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q1', 'q2') ? '3.5' : '2'}
            className={isEdgeActive('q1', 'q2') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q1', 'q2') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="310" y="90" fill={isEdgeActive('q1', 'q2') ? '#38bdf8' : '#94a3b8'} fontSize="10" fontWeight="800" textAnchor="middle">
            Smoke+Heat
          </text>

          {/* q2 -> q3 (Flame) */}
          <path
            d="M 420,100 L 520,100"
            stroke={isEdgeActive('q2', 'q3') ? '#ef4444' : '#334155'}
            strokeWidth={isEdgeActive('q2', 'q3') ? '3.5' : '2'}
            className={isEdgeActive('q2', 'q3') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q2', 'q3') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="470" y="90" fill={isEdgeActive('q2', 'q3') ? '#ef4444' : '#94a3b8'} fontSize="10" fontWeight="800" textAnchor="middle">
            Flame
          </text>

          {/* q3 -> q4 (Evacuate / Manual) */}
          <path
            d="M 580,100 L 640,100"
            stroke={isEdgeActive('q3', 'q4') ? '#dc2626' : '#334155'}
            strokeWidth={isEdgeActive('q3', 'q4') ? '3.5' : '2'}
            className={isEdgeActive('q3', 'q4') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q3', 'q4') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="610" y="90" fill={isEdgeActive('q3', 'q4') ? '#dc2626' : '#94a3b8'} fontSize="10" fontWeight="800" textAnchor="middle">
            Alarm
          </text>

          {/* Resolution & Fault Paths */}
          {/* q3 -> q5 (Fire Cleared) */}
          <path
            d="M 550,130 L 550,250"
            stroke={isEdgeActive('q3', 'q5') ? '#14b8a6' : '#334155'}
            strokeWidth={isEdgeActive('q3', 'q5') ? '3.5' : '2'}
            className={isEdgeActive('q3', 'q5') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q3', 'q5') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="560" y="190" fill={isEdgeActive('q3', 'q5') ? '#14b8a6' : '#94a3b8'} fontSize="10" fontWeight="800" textAnchor="start">
            Cleared
          </text>

          {/* q5 -> q0 (Baseline Return) */}
          <path
            d="M 520,280 L 100,280"
            stroke={isEdgeActive('q5', 'q0') ? '#10b981' : '#334155'}
            strokeWidth={isEdgeActive('q5', 'q0') ? '3.5' : '2'}
            className={isEdgeActive('q5', 'q0') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q5', 'q0') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="310" y="270" fill={isEdgeActive('q5', 'q0') ? '#10b981' : '#94a3b8'} fontSize="10" fontWeight="800" textAnchor="middle">
            All Clear $\to$ q0
          </text>

          {/* q6 (Fault) -> q0 (Reset) */}
          <path
            d="M 360,280 L 100,280"
            stroke={isEdgeActive('q6', 'q0') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q6', 'q0') ? '3.5' : '2'}
            className={isEdgeActive('q6', 'q0') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q6', 'q0') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />

          {/* Render State Nodes q0 to q7 */}
          {(Object.keys(nodePos) as AutomataState[]).map((stateId) => {
            const { x, y } = nodePos[stateId];
            const meta = AUTOMATA_STATES[stateId];
            const isActive = currentState === stateId;
            const isEmergency = stateId === 'q3' || stateId === 'q4';

            return (
              <g key={stateId} transform={`translate(${x}, ${y})`}>
                {/* Glow ring */}
                <circle
                  r={isEmergency ? '30' : '28'}
                  fill="#0f172a"
                  stroke={isActive ? meta.color : '#334155'}
                  strokeWidth={isActive ? '4' : '2'}
                  className="dfa-node-glow"
                  style={isActive ? { filter: `drop-shadow(0 0 16px ${meta.color})` } : {}}
                />
                {isEmergency && (
                  <circle
                    r="24"
                    fill="none"
                    stroke={isActive ? meta.color : '#475569'}
                    strokeWidth="1.5"
                  />
                )}
                <text
                  y="-2"
                  fill={isActive ? meta.color : '#f8fafc'}
                  fontSize="13"
                  fontWeight="800"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {stateId}
                </text>
                <text
                  y="12"
                  fill={isActive ? '#ffffff' : '#64748b'}
                  fontSize="8"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="central"
                >
                  {meta.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
        <span>State Set Q = &#123;q0, q1, q2, q3, q4, q5, q6, q7&#125;</span>
        <span>Accepting Emergency States: <strong className="text-red-400">q3, q4 (Double Circle)</strong></span>
      </div>
    </div>
  );
};
