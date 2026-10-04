import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StateId, InputSymbol } from '../types/dfa';
import { STATE_CONFIGS } from '../logic/dfa';
import { ArrowRight, Terminal } from 'lucide-react';

interface TransitionDisplayProps {
  lastTransition: { from: StateId; input: InputSymbol; to: StateId; equation: string } | null;
}

export const TransitionDisplay: React.FC<TransitionDisplayProps> = ({ lastTransition }) => {
  return (
    <div className="glass-panel p-5 flex flex-col justify-between mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Terminal size={15} className="text-emerald-400" />
          CURRENT TRANSITION
        </span>
        <span className="text-[11px] font-mono text-slate-400">δ Function Mapping</span>
      </div>

      <AnimatePresence mode="wait">
        {lastTransition ? (
          <motion.div
            key={lastTransition.equation}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex items-center justify-around py-3 px-4 rounded-xl bg-slate-950/80 border border-slate-800"
          >
            {/* Previous State */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Previous State</span>
              <span
                className="text-base font-extrabold font-mono px-3 py-1 rounded-lg border"
                style={{
                  color: STATE_CONFIGS[lastTransition.from].color,
                  backgroundColor: STATE_CONFIGS[lastTransition.from].bgGlow,
                  borderColor: STATE_CONFIGS[lastTransition.from].borderGlow,
                }}
              >
                {lastTransition.from}
              </span>
            </div>

            {/* Animated Input Arrow */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-extrabold text-sky-400 uppercase tracking-wider">
                INPUT: {lastTransition.input}
              </span>
              <motion.div
                animate={{ x: [0, 6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="p-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400"
              >
                <ArrowRight size={18} />
              </motion.div>
            </div>

            {/* Next State */}
            <div className="flex flex-col items-center gap-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase">Next State</span>
              <span
                className="text-base font-extrabold font-mono px-3 py-1 rounded-lg border"
                style={{
                  color: STATE_CONFIGS[lastTransition.to].color,
                  backgroundColor: STATE_CONFIGS[lastTransition.to].bgGlow,
                  borderColor: STATE_CONFIGS[lastTransition.to].borderGlow,
                }}
              >
                {lastTransition.to}
              </span>
            </div>
          </motion.div>
        ) : (
          <div className="py-5 text-center text-slate-500 text-xs italic bg-slate-950/60 rounded-xl border border-slate-800/60">
            System in initial state q0 (NORMAL). Waiting for sensor input...
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
