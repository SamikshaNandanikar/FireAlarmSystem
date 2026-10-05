import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { AutomataState } from '../types/automata';
import { Flame, Siren, AlertTriangle } from 'lucide-react';

interface EmergencyAlertProps {
  currentState: AutomataState;
}

export const EmergencyAlert: React.FC<EmergencyAlertProps> = ({ currentState }) => {
  if (currentState !== 'q3' && currentState !== 'q4' && currentState !== 'q6') return null;

  const isEvacuation = currentState === 'q4';
  const isFault = currentState === 'q6';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.98 }}
        className={`mb-6 p-4 md:p-5 rounded-2xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 relative z-30 shadow-2xl ${
          isFault
            ? 'bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.5)]'
            : 'bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 border-red-500 shadow-[0_0_35px_rgba(239,68,68,0.5)] alert-pulse-container'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-600/30 border border-red-400 text-yellow-300 animate-bounce">
            {isFault ? <AlertTriangle size={28} className="text-amber-400" /> : <Flame size={28} />}
          </div>
          <div className="flex flex-col gap-0.5 text-center md:text-left">
            <h3 className="text-lg md:text-xl font-extrabold font-heading text-red-100 tracking-wide flex items-center justify-center md:justify-start gap-2">
              <Siren size={20} className="animate-spin text-red-400" style={{ animationDuration: '3s' }} />
              {isEvacuation
                ? '🚨 EMERGENCY BUILDING EVACUATION SIGNAL ACTIVE'
                : isFault
                ? '⚠️ SENSOR CIRCUIT FAULT DETECTED'
                : '🚨 FIRE CONFIRMED — EMERGENCY SPRINKLERS ACTIVE'}
            </h3>
            <p className="text-xs md:text-sm text-red-200 font-medium">
              {isEvacuation
                ? 'Critical State q4: All building occupants must evacuate immediately to designated assembly areas.'
                : isFault
                ? 'State q6: Sensor malfunction or wiring fault detected. Technician maintenance required.'
                : 'State q3: Combustion confirmed by optical flame sensors. Primary fire suppression engaged.'}
            </p>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl bg-red-900/80 border border-red-400/50 text-xs font-bold text-red-200 flex items-center gap-2 whitespace-nowrap">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-ping" />
          <span>{isFault ? 'FAULT ALERT' : isEvacuation ? 'EVACUATE NOW' : 'ALARM ACTIVE'}</span>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
