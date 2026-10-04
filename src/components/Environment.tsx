import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { StateId } from '../types/dfa';
import { STATE_CONFIGS } from '../logic/dfa';
import { ShieldCheck, Wind, Thermometer, Flame } from 'lucide-react';

interface EnvironmentProps {
  currentState: StateId;
}

export const Environment: React.FC<EnvironmentProps> = ({ currentState }) => {
  const config = STATE_CONFIGS[currentState];

  return (
    <div className="glass-panel p-6 relative overflow-hidden min-h-[300px] md:min-h-[340px] flex flex-col justify-between">
      {/* Header Label */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 relative z-20">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
          LIVE ENVIRONMENT SIMULATION
        </span>
        <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800">
          State: {config.code}
        </span>
      </div>

      {/* Main Interactive Dynamic Layer */}
      <div className="relative flex-grow flex items-center justify-center my-4 overflow-hidden rounded-2xl bg-slate-950/80 border border-slate-800/80 p-6">
        
        {/* q0: Normal Ambient Floating Particles */}
        <AnimatePresence>
          {currentState === 'q0' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/20 via-transparent to-transparent" />
              <div className="flex flex-col items-center gap-3 relative z-10">
                <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <ShieldCheck className="w-12 h-12 text-emerald-400" />
                </div>
                <span className="text-sm font-bold text-emerald-400 tracking-wide font-heading">
                  SAFE AMBIENT ENVIRONMENT
                </span>
                <span className="text-xs text-slate-400">Zero smoke & thermal anomalies detected</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* q1: Dedicated Rising Smoke Particle Animation */}
        <AnimatePresence>
          {currentState === 'q1' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-950/30 via-yellow-900/10 to-transparent" />

              {/* Generated Smoke Particle Cloud Bubbles */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="smoke-particle"
                  style={{
                    left: `${15 + (i * 7) % 70}%`,
                    bottom: '-20px',
                    width: `${50 + (i * 15) % 80}px`,
                    height: `${50 + (i * 15) % 80}px`,
                    animationDelay: `${(i * 0.35) % 3.5}s`,
                    animationDuration: `${3.5 + (i % 3)}s`,
                  }}
                />
              ))}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-yellow-500/30 shadow-[0_0_20px_rgba(234,179,8,0.2)]">
                <div className="flex items-center gap-2 text-yellow-400 font-bold text-xs font-heading">
                  <Wind size={16} className="animate-spin" style={{ animationDuration: '4s' }} />
                  <span>SMOKE LEVEL: ELEVATED</span>
                </div>
                <span className="text-[11px] text-slate-300">Particulate count: 450 PPM</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* q2: Heat Wave Shimmer Animation */}
        <AnimatePresence>
          {currentState === 'q2' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none overflow-hidden"
            >
              {/* Heat Shimmer Wave Filter */}
              <div className="heat-wave-layer" />

              {/* Floating Orange Ember Particles */}
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{
                    y: [-10, -120],
                    x: [0, (i % 2 === 0 ? 20 : -20)],
                    opacity: [0.8, 0],
                  }}
                  transition={{
                    duration: 2 + (i % 2),
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  className="absolute rounded-full bg-orange-400 blur-[1px]"
                  style={{
                    left: `${20 + i * 7}%`,
                    bottom: '10px',
                    width: `${4 + (i % 3) * 2}px`,
                    height: `${4 + (i % 3) * 2}px`,
                    boxShadow: '0 0 10px rgba(249,115,22,0.8)',
                  }}
                />
              ))}

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-xl border border-orange-500/40 shadow-[0_0_25px_rgba(249,115,22,0.3)]">
                <div className="flex items-center gap-2 text-orange-400 font-bold text-xs font-heading">
                  <Thermometer size={16} className="animate-bounce" />
                  <span>TEMPERATURE: 75°C (CRITICAL HEAT)</span>
                </div>
                <span className="text-[11px] text-slate-300">Thermal radiation threshold exceeded</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* q3: Animated SVG Flames & Emergency Strobe */}
        <AnimatePresence>
          {currentState === 'q3' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 pointer-events-none overflow-hidden alert-pulse-container"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/50 via-orange-950/20 to-transparent" />

              {/* Animated Multi-layer SVG Flames */}
              <div className="absolute bottom-0 inset-x-0 flex justify-center items-end opacity-90">
                <svg className="w-64 h-36 flame-svg" viewBox="0 0 200 120" fill="none">
                  <path
                    d="M20 120 C10 80, 40 40, 50 10 C60 40, 70 80, 80 120 Z"
                    fill="url(#flameGrad1)"
                    opacity="0.9"
                  />
                  <path
                    d="M60 120 C50 70, 90 30, 100 0 C110 30, 130 70, 140 120 Z"
                    fill="url(#flameGrad2)"
                    opacity="0.95"
                  />
                  <path
                    d="M120 120 C110 80, 140 40, 150 15 C160 40, 170 80, 180 120 Z"
                    fill="url(#flameGrad1)"
                    opacity="0.85"
                  />
                  <defs>
                    <linearGradient id="flameGrad1" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#facc15" />
                    </linearGradient>
                    <linearGradient id="flameGrad2" x1="0" y1="1" x2="0" y2="0">
                      <stop offset="0%" stopColor="#dc2626" />
                      <stop offset="60%" stopColor="#ea580c" />
                      <stop offset="100%" stopColor="#fef08a" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 bg-red-950/90 backdrop-blur-md px-5 py-2.5 rounded-xl border border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                <div className="flex items-center gap-2 text-red-400 font-extrabold text-sm font-heading tracking-wide">
                  <Flame size={18} className="animate-pulse text-yellow-300" />
                  <span>🚨 FIRE ALARM ACTIVE — FIRE DETECTED</span>
                </div>
                <span className="text-xs text-red-200 font-medium">System locked in emergency state q3</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Environmental Summary */}
      <div className="flex items-center justify-between text-xs text-slate-400 relative z-10 pt-2">
        <span>Status: <strong style={{ color: config.color }}>{config.name}</strong></span>
        <span>Environment Telemetry Sync: <strong className="text-emerald-400">NORMAL</strong></span>
      </div>
    </div>
  );
};
