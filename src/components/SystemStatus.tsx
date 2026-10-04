import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StateId, InputSymbol } from '../types/dfa';
import { STATE_CONFIGS, INPUT_CONFIGS } from '../logic/dfa';
import { ShieldCheck, AlertTriangle, Wind, Flame, Activity } from 'lucide-react';

interface SystemStatusProps {
  currentState: StateId;
  lastInput: InputSymbol | null;
  lastTransition: { from: StateId; input: InputSymbol; to: StateId; equation: string } | null;
}

export const SystemStatus: React.FC<SystemStatusProps> = ({
  currentState,
  lastInput,
  lastTransition,
}) => {
  const config = STATE_CONFIGS[currentState];

  const getStateIcon = () => {
    switch (currentState) {
      case 'q0': return <ShieldCheck className="w-8 h-8 text-emerald-400" />;
      case 'q1': return <Wind className="w-8 h-8 text-yellow-400" />;
      case 'q2': return <AlertTriangle className="w-8 h-8 text-orange-400" />;
      case 'q3': return <Flame className="w-8 h-8 text-red-400 animate-pulse" />;
    }
  };

  return (
    <div className="glass-panel p-6 relative overflow-hidden flex flex-col justify-between">
      {/* Background Glow Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-700"
        style={{
          background: `radial-gradient(circle at 10% 20%, ${config.bgGlow} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Activity size={14} className="text-sky-400" />
            LIVE SYSTEM STATUS
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${config.badgeBg}`}>
            {config.code}
          </span>
        </div>

        {/* Dynamic Hero State Container */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentState}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.35 }}
            className="flex items-start gap-4"
          >
            <div
              className="p-3.5 rounded-2xl border backdrop-blur-md flex items-center justify-center shadow-lg"
              style={{
                backgroundColor: config.bgGlow,
                borderColor: config.borderGlow,
                boxShadow: `0 0 20px ${config.bgGlow}`,
              }}
            >
              {getStateIcon()}
            </div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-slate-400">{config.code}</span>
                <h2 className="text-2xl md:text-3xl font-extrabold font-heading tracking-tight" style={{ color: config.color }}>
                  {config.name}
                </h2>
              </div>
              <p className="text-slate-300 text-sm md:text-base font-medium leading-relaxed">
                {config.statusMessage}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Live Details Sub-grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
          {/* Current Input */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Input</span>
            <span className="text-sm font-bold text-sky-400 font-heading">
              {lastInput ? `${lastInput} (${INPUT_CONFIGS[lastInput].name})` : 'None (System Initialized)'}
            </span>
          </div>

          {/* Last Transition */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Last Transition</span>
            <span className="text-sm font-bold text-emerald-400 font-mono">
              {lastTransition ? lastTransition.equation : 'δ(q0, Initial) = q0'}
            </span>
          </div>

          {/* Alarm Status */}
          <div className="col-span-2 sm:col-span-1 bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alarm Status</span>
            <span className={`text-sm font-extrabold ${config.telemetry.alarmStatus === 'ACTIVE' ? 'text-red-400 animate-pulse' : config.telemetry.alarmStatus === 'WARNING' ? 'text-yellow-400' : 'text-emerald-400'}`}>
              {config.telemetry.alarmStatus}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
