import type { StateId, InputSymbol } from '../types/dfa';
import { Network } from 'lucide-react';

interface DFAGraphProps {
  currentState: StateId;
  lastTransition: { from: StateId; input: InputSymbol; to: StateId; equation: string } | null;
}

export const DFAGraph: React.FC<DFAGraphProps> = ({ currentState, lastTransition }) => {
  const isEdgeActive = (from: StateId, to: StateId, inputSymbol?: InputSymbol) => {
    if (!lastTransition) return false;
    const matchFromTo = lastTransition.from === from && lastTransition.to === to;
    if (!matchFromTo) return false;
    if (inputSymbol) {
      return lastTransition.input === inputSymbol;
    }
    return true;
  };

  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Network size={16} className="text-sky-400" />
          DFA STATE GRAPH DIAGRAM
        </span>
        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          Active: {currentState}
        </span>
      </div>

      <div className="relative flex justify-center items-center py-2 bg-slate-950/70 rounded-xl border border-slate-800/80">
        <svg viewBox="0 0 520 380" className="w-full max-w-[540px] h-auto">
          <defs>
            {/* Markers */}
            <marker id="arrow-default" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#475569" />
            </marker>
            <marker id="arrow-active" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
            </marker>
          </defs>

          {/* Initial Arrow into q0 */}
          <path d="M 20,80 L 50,80" stroke="#64748b" strokeWidth="2" markerEnd="url(#arrow-default)" />
          <text x="35" y="70" fill="#64748b" fontSize="10" fontWeight="800" textAnchor="middle">
            START
          </text>

          {/* Edge q0 -> q1 (S) */}
          <path
            d="M 115,80 L 255,80"
            stroke={isEdgeActive('q0', 'q1', 'S') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q0', 'q1', 'S') ? '3.5' : '2'}
            className={isEdgeActive('q0', 'q1', 'S') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q0', 'q1', 'S') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text
            x="185"
            y="70"
            fill={isEdgeActive('q0', 'q1', 'S') ? '#38bdf8' : '#94a3b8'}
            fontSize="12"
            fontWeight="800"
            textAnchor="middle"
          >
            S
          </text>

          {/* Edge q1 -> q2 (H) */}
          <path
            d="M 290,115 L 290,205"
            stroke={isEdgeActive('q1', 'q2', 'H') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q1', 'q2', 'H') ? '3.5' : '2'}
            className={isEdgeActive('q1', 'q2', 'H') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q1', 'q2', 'H') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text
            x="305"
            y="165"
            fill={isEdgeActive('q1', 'q2', 'H') ? '#38bdf8' : '#94a3b8'}
            fontSize="12"
            fontWeight="800"
            textAnchor="start"
          >
            H
          </text>

          {/* Edge q2 -> q3 (F) */}
          <path
            d="M 290,275 L 290,320 M 290,320 L 290,325"
            stroke={isEdgeActive('q2', 'q3', 'F') ? '#ef4444' : '#334155'}
            strokeWidth={isEdgeActive('q2', 'q3', 'F') ? '3.5' : '2'}
            className={isEdgeActive('q2', 'q3', 'F') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q2', 'q3', 'F') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text
            x="305"
            y="300"
            fill={isEdgeActive('q2', 'q3', 'F') ? '#ef4444' : '#94a3b8'}
            fontSize="12"
            fontWeight="800"
            textAnchor="start"
          >
            F
          </text>

          {/* Self Loops */}
          {/* q0 Loop (N) */}
          <path
            d="M 70,52 C 55,20 115,20 100,52"
            fill="none"
            stroke={isEdgeActive('q0', 'q0', 'N') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q0', 'q0', 'N') ? '3' : '2'}
            className={isEdgeActive('q0', 'q0', 'N') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q0', 'q0', 'N') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="85" y="18" fill={isEdgeActive('q0', 'q0', 'N') ? '#38bdf8' : '#94a3b8'} fontSize="11" fontWeight="800" textAnchor="middle">
            N
          </text>

          {/* q1 Loop (S) */}
          <path
            d="M 275,52 C 260,20 320,20 305,52"
            fill="none"
            stroke={isEdgeActive('q1', 'q1', 'S') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q1', 'q1', 'S') ? '3' : '2'}
            className={isEdgeActive('q1', 'q1', 'S') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q1', 'q1', 'S') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="290" y="18" fill={isEdgeActive('q1', 'q1', 'S') ? '#38bdf8' : '#94a3b8'} fontSize="11" fontWeight="800" textAnchor="middle">
            S
          </text>

          {/* q2 Loop (H) */}
          <path
            d="M 325,225 C 360,210 360,265 325,250"
            fill="none"
            stroke={isEdgeActive('q2', 'q2', 'H') ? '#38bdf8' : '#334155'}
            strokeWidth={isEdgeActive('q2', 'q2', 'H') ? '3' : '2'}
            className={isEdgeActive('q2', 'q2', 'H') ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={isEdgeActive('q2', 'q2', 'H') ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="365" y="240" fill={isEdgeActive('q2', 'q2', 'H') ? '#38bdf8' : '#94a3b8'} fontSize="11" fontWeight="800" textAnchor="start">
            H
          </text>

          {/* q3 Loop (N,S,H,F Absorbing Loop) */}
          <path
            d="M 325,335 C 365,320 365,375 325,360"
            fill="none"
            stroke={currentState === 'q3' ? '#ef4444' : '#334155'}
            strokeWidth={currentState === 'q3' ? '3' : '2'}
            className={currentState === 'q3' ? 'dfa-edge dfa-edge-active' : 'dfa-edge'}
            markerEnd={currentState === 'q3' ? 'url(#arrow-active)' : 'url(#arrow-default)'}
          />
          <text x="370" y="350" fill={currentState === 'q3' ? '#ef4444' : '#94a3b8'} fontSize="11" fontWeight="800" textAnchor="start">
            N,S,H,F
          </text>

          {/* State Nodes */}
          {/* q0 */}
          <circle
            cx="85"
            cy="80"
            r="32"
            fill="#0f172a"
            stroke={currentState === 'q0' ? '#10b981' : '#334155'}
            strokeWidth={currentState === 'q0' ? '4' : '2'}
            className="dfa-node-glow"
            style={currentState === 'q0' ? { filter: 'drop-shadow(0 0 12px rgba(16,185,129,0.8))' } : {}}
          />
          <text x="85" y="76" fill={currentState === 'q0' ? '#10b981' : '#f8fafc'} fontSize="14" fontWeight="800" textAnchor="middle">
            q0
          </text>
          <text x="85" y="93" fill={currentState === 'q0' ? '#34d399' : '#64748b'} fontSize="9" fontWeight="700" textAnchor="middle">
            NORMAL
          </text>

          {/* q1 */}
          <circle
            cx="290"
            cy="80"
            r="32"
            fill="#0f172a"
            stroke={currentState === 'q1' ? '#eab308' : '#334155'}
            strokeWidth={currentState === 'q1' ? '4' : '2'}
            className="dfa-node-glow"
            style={currentState === 'q1' ? { filter: 'drop-shadow(0 0 12px rgba(234,179,8,0.8))' } : {}}
          />
          <text x="290" y="76" fill={currentState === 'q1' ? '#eab308' : '#f8fafc'} fontSize="14" fontWeight="800" textAnchor="middle">
            q1
          </text>
          <text x="290" y="93" fill={currentState === 'q1' ? '#facc15' : '#64748b'} fontSize="9" fontWeight="700" textAnchor="middle">
            SMOKE
          </text>

          {/* q2 */}
          <circle
            cx="290"
            cy="240"
            r="32"
            fill="#0f172a"
            stroke={currentState === 'q2' ? '#f97316' : '#334155'}
            strokeWidth={currentState === 'q2' ? '4' : '2'}
            className="dfa-node-glow"
            style={currentState === 'q2' ? { filter: 'drop-shadow(0 0 12px rgba(249,115,22,0.8))' } : {}}
          />
          <text x="290" y="236" fill={currentState === 'q2' ? '#f97316' : '#f8fafc'} fontSize="14" fontWeight="800" textAnchor="middle">
            q2
          </text>
          <text x="290" y="253" fill={currentState === 'q2' ? '#fb923c' : '#64748b'} fontSize="9" fontWeight="700" textAnchor="middle">
            HIGH TEMP
          </text>

          {/* q3 (Double Circle Accepting Emergency State) */}
          <circle
            cx="290"
            cy="350"
            r="32"
            fill="#0f172a"
            stroke={currentState === 'q3' ? '#ef4444' : '#334155'}
            strokeWidth={currentState === 'q3' ? '4' : '2'}
            className="dfa-node-glow"
            style={currentState === 'q3' ? { filter: 'drop-shadow(0 0 18px rgba(239,68,68,0.9))' } : {}}
          />
          <circle
            cx="290"
            cy="350"
            r="26"
            fill="none"
            stroke={currentState === 'q3' ? '#f87171' : '#475569'}
            strokeWidth="2"
          />
          <text x="290" y="346" fill={currentState === 'q3' ? '#ef4444' : '#f8fafc'} fontSize="14" fontWeight="800" textAnchor="middle">
            q3
          </text>
          <text x="290" y="363" fill={currentState === 'q3' ? '#f87171' : '#64748b'} fontSize="9" fontWeight="700" textAnchor="middle">
            FIRE ALARM
          </text>
        </svg>
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
        <span>State Q = &#123;q0, q1, q2, q3&#125;</span>
        <span>Accepting Emergency State: <strong className="text-red-400">q3 (Double Circle)</strong></span>
      </div>
    </div>
  );
};
