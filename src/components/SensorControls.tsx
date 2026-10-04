import React from 'react';
import { motion } from 'framer-motion';
import type { InputSymbol } from '../types/dfa';
import { INPUT_CONFIGS } from '../logic/dfa';
import { ShieldCheck, Wind, Thermometer, Flame, Radio } from 'lucide-react';

interface SensorControlsProps {
  onTriggerInput: (input: InputSymbol) => void;
  recommendedInput?: InputSymbol | null;
}

export const SensorControls: React.FC<SensorControlsProps> = ({
  onTriggerInput,
  recommendedInput,
}) => {
  const getIcon = (symbol: InputSymbol) => {
    switch (symbol) {
      case 'N': return <ShieldCheck className="w-6 h-6 text-emerald-400" />;
      case 'S': return <Wind className="w-6 h-6 text-yellow-400" />;
      case 'H': return <Thermometer className="w-6 h-6 text-orange-400" />;
      case 'F': return <Flame className="w-6 h-6 text-red-400" />;
    }
  };

  const getBorderColorClass = (symbol: InputSymbol, isRecommended: boolean) => {
    if (isRecommended) {
      return 'border-sky-400 ring-2 ring-sky-400/50 shadow-[0_0_20px_rgba(56,189,248,0.4)] animate-pulse';
    }
    switch (symbol) {
      case 'N': return 'hover:border-emerald-500/60 hover:shadow-[0_0_15px_rgba(16,185,129,0.25)]';
      case 'S': return 'hover:border-yellow-500/60 hover:shadow-[0_0_15px_rgba(234,179,8,0.25)]';
      case 'H': return 'hover:border-orange-500/60 hover:shadow-[0_0_15px_rgba(249,115,22,0.25)]';
      case 'F': return 'hover:border-red-500/60 hover:shadow-[0_0_20px_rgba(239,68,68,0.35)]';
    }
  };

  const symbols: InputSymbol[] = ['N', 'S', 'H', 'F'];

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Radio size={16} className="text-sky-400" />
          SENSOR INPUT CONTROLS (Σ)
        </span>
        <span className="text-xs text-slate-500 font-medium">Click to feed input token to DFA</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {symbols.map((sym) => {
          const config = INPUT_CONFIGS[sym];
          const isRecommended = recommendedInput === sym;

          return (
            <motion.button
              key={sym}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onTriggerInput(sym)}
              className={`relative flex flex-col justify-between p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-left transition-all group ${getBorderColorClass(
                sym,
                isRecommended
              )}`}
            >
              {isRecommended && (
                <span className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-sky-500 text-[10px] font-extrabold text-slate-950 uppercase tracking-wider shadow-md">
                  NEXT STEP
                </span>
              )}

              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 group-hover:border-slate-700 transition-colors">
                  {getIcon(sym)}
                </div>
                <span className="w-7 h-7 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-xs font-extrabold font-mono text-slate-200">
                  {sym}
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-sm font-extrabold font-heading text-slate-100 group-hover:text-white">
                  {config.name}
                </span>
                <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors">
                  "{config.shortDesc}"
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
