import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { TransitionLogRecord } from '../types/automata';
import { AUTOMATA_STATES } from '../logic/automata';
import { History, Trash2 } from 'lucide-react';

interface TransitionHistoryProps {
  history: TransitionLogRecord[];
  onClearHistory: () => void;
}

export const TransitionHistory: React.FC<TransitionHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  return (
    <div className="glass-panel p-6 flex flex-col justify-between">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <History size={16} className="text-sky-400" />
          REAL-TIME AUTOMATA EVENT LOG
        </span>
        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-400 transition-colors px-2.5 py-1 rounded bg-slate-900 border border-slate-800 hover:border-red-500/30"
            title="Clearing history log does NOT modify current DFA state"
          >
            <Trash2 size={13} />
            <span>CLEAR LOG</span>
          </button>
        )}
      </div>

      <div className="flex-grow max-h-[320px] overflow-y-auto pr-1 space-y-2">
        {history.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs italic bg-slate-950/40 rounded-xl border border-slate-900">
            No transitions logged yet. Toggle virtual sensor switches in any zone to build execution trace.
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {history.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-500">{log.timestamp}</span>

                  <span className="px-2 py-0.5 rounded font-extrabold font-mono bg-sky-500/10 text-sky-400 border border-sky-500/20">
                    {log.zoneId}
                  </span>

                  <div className="flex items-center gap-1.5 font-bold font-mono">
                    <span style={{ color: AUTOMATA_STATES[log.fromState].color }}>{log.fromState}</span>
                    <span className="text-slate-500">→</span>
                    <span style={{ color: AUTOMATA_STATES[log.toState].color }}>{log.toState}</span>
                  </div>
                </div>

                <span className="text-slate-400 font-medium truncate max-w-[280px]">
                  {log.description}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-900 mt-3 flex justify-between">
        <span>Total Logged Events: {history.length}</span>
        <span>Clearing log maintains current DFA state</span>
      </div>
    </div>
  );
};
