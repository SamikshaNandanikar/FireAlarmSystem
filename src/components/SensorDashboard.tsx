import React from 'react';
import { motion } from 'framer-motion';
import type { StateId } from '../types/dfa';
import { STATE_CONFIGS } from '../logic/dfa';
import { Wind, Thermometer, BellRing } from 'lucide-react';

interface SensorDashboardProps {
  currentState: StateId;
}

export const SensorDashboard: React.FC<SensorDashboardProps> = ({ currentState }) => {
  const telemetry = STATE_CONFIGS[currentState].telemetry;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      {/* 1. Smoke Sensor Card */}
      <div className="glass-panel p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wind size={16} className="text-yellow-400" />
            SMOKE SENSOR
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
              telemetry.smokeLevel === 'CRITICAL'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : telemetry.smokeLevel === 'ELEVATED'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {telemetry.smokeLevel}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-extrabold font-heading text-slate-100">
              {telemetry.smokePercent}%
            </span>
            <span className="text-xs text-slate-400">Particulate Density</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${telemetry.smokePercent}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                telemetry.smokeLevel === 'CRITICAL'
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                  : telemetry.smokeLevel === 'ELEVATED'
                  ? 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.8)]'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 2. Temperature Sensor Card */}
      <div className="glass-panel p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Thermometer size={16} className="text-orange-400" />
            TEMPERATURE SENSOR
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
              telemetry.temperature >= 90
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : telemetry.temperature >= 60
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {telemetry.temperature}°C
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-extrabold font-heading text-slate-100">
              {telemetry.temperature}°C
            </span>
            <span className="text-xs text-slate-400">Thermal Threshold</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, (telemetry.temperature / 100) * 100)}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                telemetry.temperature >= 90
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]'
                  : telemetry.temperature >= 60
                  ? 'bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. Alarm Status Card */}
      <div className="glass-panel p-5 flex flex-col justify-between gap-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <BellRing size={16} className="text-red-400" />
            ALARM RELAY
          </span>
          <span
            className={`px-2 py-0.5 rounded text-[11px] font-extrabold ${
              telemetry.alarmStatus === 'ACTIVE'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse'
                : telemetry.alarmStatus === 'WARNING'
                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            {telemetry.alarmStatus}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-baseline">
            <span
              className={`text-2xl font-extrabold font-heading ${
                telemetry.alarmStatus === 'ACTIVE'
                  ? 'text-red-400 animate-pulse'
                  : telemetry.alarmStatus === 'WARNING'
                  ? 'text-yellow-400'
                  : 'text-emerald-400'
              }`}
            >
              {telemetry.alarmStatus}
            </span>
            <span className="text-xs text-slate-400">Emergency Trigger</span>
          </div>

          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{
                width:
                  telemetry.alarmStatus === 'ACTIVE'
                    ? '100%'
                    : telemetry.alarmStatus === 'WARNING'
                    ? '50%'
                    : '10%',
              }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`h-full rounded-full ${
                telemetry.alarmStatus === 'ACTIVE'
                  ? 'bg-red-500 shadow-[0_0_12px_rgba(239,68,68,0.9)]'
                  : telemetry.alarmStatus === 'WARNING'
                  ? 'bg-yellow-500'
                  : 'bg-emerald-500'
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
