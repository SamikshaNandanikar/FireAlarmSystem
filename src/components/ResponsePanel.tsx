import React from 'react';
import type { MealyOutput, AutomataState } from '../types/automata';
import { AUTOMATA_STATES } from '../logic/automata';
import {
  Activity,
  BellRing,
  Volume2,
  Lightbulb,
  Droplets,
  DoorOpen,
  Radio,
  Flame,
} from 'lucide-react';

interface ResponsePanelProps {
  currentState: AutomataState;
  mealyOutput: MealyOutput;
}

export const ResponsePanel: React.FC<ResponsePanelProps> = ({
  currentState,
  mealyOutput,
}) => {
  const stateMeta = AUTOMATA_STATES[currentState];

  const responseItems = [
    {
      label: 'Fire Status',
      value: mealyOutput.fireStatus.replace('_', ' '),
      active: currentState !== 'q0',
      icon: <Flame size={18} className="text-red-400" />,
      colorClass: stateMeta.badgeBg,
    },
    {
      label: 'Alarm Relay',
      value: mealyOutput.alarm ? 'ACTIVE' : 'INACTIVE',
      active: mealyOutput.alarm,
      icon: <BellRing size={18} className="text-yellow-400" />,
      colorClass: mealyOutput.alarm ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40' : 'bg-slate-900 text-slate-500 border-slate-800',
    },
    {
      label: 'Emergency Siren',
      value: mealyOutput.sirenHighPriority ? 'HIGH PRIORITY' : mealyOutput.siren ? 'ACTIVE' : 'INACTIVE',
      active: mealyOutput.siren,
      icon: <Volume2 size={18} className="text-red-400 animate-pulse" />,
      colorClass: mealyOutput.sirenHighPriority ? 'bg-red-600/30 text-red-200 border-red-500/60 animate-pulse' : mealyOutput.siren ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-900 text-slate-500 border-slate-800',
    },
    {
      label: 'Emergency Lighting',
      value: mealyOutput.light ? 'ACTIVE' : 'INACTIVE',
      active: mealyOutput.light,
      icon: <Lightbulb size={18} className="text-amber-400" />,
      colorClass: mealyOutput.light ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900 text-slate-500 border-slate-800',
    },
    {
      label: 'Sprinkler System',
      value: mealyOutput.sprinkler ? 'ACTIVE (WATER FLOW)' : 'INACTIVE',
      active: mealyOutput.sprinkler,
      icon: <Droplets size={18} className="text-cyan-400 animate-bounce" />,
      colorClass: mealyOutput.sprinkler ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-900 text-slate-500 border-slate-800',
    },
    {
      label: 'Evacuation Warning',
      value: mealyOutput.evacuation ? 'EVACUATE NOW' : 'INACTIVE',
      active: mealyOutput.evacuation,
      icon: <DoorOpen size={18} className="text-red-400" />,
      colorClass: mealyOutput.evacuation ? 'bg-red-600/30 text-red-200 border-red-500/60 font-bold animate-pulse' : 'bg-slate-900 text-slate-500 border-slate-800',
    },
    {
      label: 'Emergency Broadcast',
      value: mealyOutput.notification ? 'TRANSMITTING' : 'INACTIVE',
      active: mealyOutput.notification,
      icon: <Radio size={18} className="text-sky-400" />,
      colorClass: mealyOutput.notification ? 'bg-sky-500/20 text-sky-300 border-sky-500/40' : 'bg-slate-900 text-slate-500 border-slate-800',
    },
  ];

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Activity size={16} className="text-emerald-400" />
          MEALY MACHINE RESPONSE OUTPUT: λ(State, Input)
        </span>
        <span className="text-xs text-slate-500 font-medium">Real-time hardware relay controls</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {responseItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex flex-col justify-between gap-2 transition-all ${item.colorClass}`}
          >
            <div className="flex items-center justify-between">
              <div className="p-1.5 rounded-lg bg-slate-950/80 border border-slate-800">
                {item.icon}
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  item.active ? 'bg-emerald-400 animate-ping' : 'bg-slate-700'
                }`}
              />
            </div>

            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {item.label}
              </span>
              <span className="text-xs font-extrabold font-mono truncate">
                {item.value}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
