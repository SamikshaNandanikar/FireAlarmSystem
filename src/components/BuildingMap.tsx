import React from 'react';
import type { ZoneId, ZoneData } from '../types/automata';
import { AUTOMATA_STATES } from '../logic/automata';
import { Building2, Flame, Wind, Thermometer, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BuildingMapProps {
  zones: Record<ZoneId, ZoneData>;
  selectedZoneId: ZoneId;
  onSelectZone: (zoneId: ZoneId) => void;
}

export const BuildingMap: React.FC<BuildingMapProps> = ({
  zones,
  selectedZoneId,
  onSelectZone,
}) => {
  const zoneList: ZoneId[] = ['ZONE_A', 'ZONE_B', 'ZONE_C', 'ZONE_D'];

  return (
    <div className="glass-panel p-6 mb-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
          <Building2 size={16} className="text-sky-400" />
          VIRTUAL BUILDING ZONE MAP (4 ZONES)
        </span>
        <span className="text-xs text-slate-500 font-medium">Select a zone to inspect or toggle virtual sensors</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {zoneList.map((id) => {
          const zone = zones[id];
          const isSelected = selectedZoneId === id;
          const stateMeta = AUTOMATA_STATES[zone.state];

          const activeSensorCount =
            (zone.sensors.smoke ? 1 : 0) +
            (zone.sensors.heat ? 1 : 0) +
            (zone.sensors.flame ? 1 : 0) +
            (zone.sensors.manualAlarm ? 1 : 0) +
            (zone.sensors.fault ? 1 : 0);

          return (
            <button
              key={id}
              onClick={() => onSelectZone(id)}
              className={`p-4 rounded-xl text-left transition-all relative flex flex-col justify-between gap-3 bg-slate-900/80 border ${
                isSelected
                  ? 'border-sky-400 ring-2 ring-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {isSelected && (
                <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-sky-500 text-[10px] font-extrabold text-slate-950 uppercase tracking-wider shadow">
                  SELECTED
                </span>
              )}

              {/* Zone Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="text-xs font-extrabold font-mono text-sky-400">{zone.code}</span>
                  <h3 className="text-sm font-bold font-heading text-slate-100">{zone.name}</h3>
                  <span className="text-[11px] text-slate-400">{zone.location}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-extrabold font-mono border ${stateMeta.badgeBg}`}
                >
                  {zone.state}
                </span>
              </div>

              {/* Sensor Active Indicators */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 text-xs">
                {activeSensorCount === 0 ? (
                  <span className="text-emerald-400 text-[11px] flex items-center gap-1 font-medium">
                    <CheckCircle2 size={13} />
                    All Sensors Normal
                  </span>
                ) : (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {zone.sensors.smoke && (
                      <span className="px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Wind size={10} /> Smoke
                      </span>
                    )}
                    {zone.sensors.heat && (
                      <span className="px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Thermometer size={10} /> Heat
                      </span>
                    )}
                    {zone.sensors.flame && (
                      <span className="px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-bold flex items-center gap-1">
                        <Flame size={10} /> Flame
                      </span>
                    )}
                    {zone.sensors.manualAlarm && (
                      <span className="px-1.5 py-0.5 rounded bg-red-600/30 text-red-300 border border-red-500/50 text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle size={10} /> Alarm
                      </span>
                    )}
                    {zone.sensors.fault && (
                      <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold flex items-center gap-1">
                        <AlertTriangle size={10} /> Fault
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
