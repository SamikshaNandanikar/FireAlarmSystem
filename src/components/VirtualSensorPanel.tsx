import React from 'react';
import { motion } from 'framer-motion';
import type { ZoneId, ZoneData, ZoneSensors } from '../types/automata';
import { AUTOMATA_STATES } from '../logic/automata';
import { Wind, Thermometer, Flame, Siren, AlertTriangle, Radio } from 'lucide-react';

interface VirtualSensorPanelProps {
  selectedZone: ZoneData;
  onToggleSensor: (zoneId: ZoneId, sensorKey: keyof ZoneSensors) => void;
}

export const VirtualSensorPanel: React.FC<VirtualSensorPanelProps> = ({
  selectedZone,
  onToggleSensor,
}) => {
  const stateMeta = AUTOMATA_STATES[selectedZone.state];

  const sensorButtons: Array<{
    key: keyof ZoneSensors;
    label: string;
    description: string;
    icon: React.ReactNode;
    activeColor: string;
  }> = [
    {
      key: 'smoke',
      label: 'Smoke Sensor',
      description: 'Optical particulate chamber detects aerosol smoke',
      icon: <Wind size={20} className="text-yellow-400" />,
      activeColor: 'bg-yellow-500/20 border-yellow-500/60 text-yellow-300 shadow-[0_0_15px_rgba(234,179,8,0.25)]',
    },
    {
      key: 'heat',
      label: 'Heat / Thermal Sensor',
      description: 'Thermal resistor exceeds 75°C warning threshold',
      icon: <Thermometer size={20} className="text-orange-400" />,
      activeColor: 'bg-orange-500/20 border-orange-500/60 text-orange-300 shadow-[0_0_15px_rgba(249,115,22,0.25)]',
    },
    {
      key: 'flame',
      label: 'Optical Flame Sensor',
      description: 'Infrared & UV sensors register active open flame',
      icon: <Flame size={20} className="text-red-400" />,
      activeColor: 'bg-red-500/20 border-red-500/60 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.35)]',
    },
    {
      key: 'manualAlarm',
      label: 'Manual Emergency Pull',
      description: 'Physical break-glass manual emergency station activated',
      icon: <Siren size={20} className="text-red-400 animate-pulse" />,
      activeColor: 'bg-red-600/30 border-red-500 text-red-200 shadow-[0_0_25px_rgba(220,38,38,0.4)] animate-pulse',
    },
    {
      key: 'fault',
      label: 'Sensor Fault Simulation',
      description: 'Simulates hardware malfunction or sensor circuit error',
      icon: <AlertTriangle size={20} className="text-amber-400" />,
      activeColor: 'bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.25)]',
    },
  ];

  return (
    <div className="glass-panel p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-sky-400" />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            VIRTUAL SENSOR SWITCHBOARD — {selectedZone.code}: {selectedZone.name}
          </span>
        </div>
        <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${stateMeta.badgeBg}`}>
          Zone State: {selectedZone.state} ({stateMeta.name})
        </span>
      </div>

      {/* Sensor Switch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {sensorButtons.map((btn) => {
          const isActive = selectedZone.sensors[btn.key];

          return (
            <motion.button
              key={btn.key}
              whileTap={{ scale: 0.96 }}
              onClick={() => onToggleSensor(selectedZone.id, btn.key)}
              className={`p-4 rounded-xl text-left border flex flex-col justify-between gap-3 transition-all relative ${
                isActive
                  ? btn.activeColor
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Top Row: Icon & Status Toggle */}
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800">
                  {btn.icon}
                </div>
                <div className="flex items-center gap-1.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      isActive ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-slate-700'
                    }`}
                  />
                  <span className="text-[11px] font-mono font-extrabold uppercase">
                    {isActive ? 'ON' : 'OFF'}
                  </span>
                </div>
              </div>

              {/* Label & Description */}
              <div className="flex flex-col gap-1">
                <span className="text-xs font-extrabold font-heading text-slate-100">
                  {btn.label}
                </span>
                <span className="text-[11px] text-slate-400 leading-snug">
                  {btn.description}
                </span>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
