import type {
  AutomataState,
  ZoneId,
  ZoneSensors,
  ZoneData,
  MealyOutput,
  StateMeta,
} from '../types/automata';

// State Metadata Configurations (q0 to q7)
export const AUTOMATA_STATES: Record<AutomataState, StateMeta> = {
  q0: {
    id: 'q0',
    code: 'q0',
    name: 'NORMAL',
    title: 'NORMAL AMBIENT',
    description: 'System operating normally. No dangerous inputs registered across any zone.',
    color: '#10b981', // Emerald green
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    borderGlow: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  },
  q1: {
    id: 'q1',
    code: 'q1',
    name: 'WARNING',
    title: 'WARNING ALERT',
    description: 'Smoke or Heat detected. System monitoring for potential thermal escalation.',
    color: '#eab308', // Yellow
    bgGlow: 'rgba(234, 179, 8, 0.15)',
    borderGlow: 'rgba(234, 179, 8, 0.4)',
    badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  },
  q2: {
    id: 'q2',
    code: 'q2',
    name: 'FIRE_SUSPECTED',
    title: 'FIRE SUSPECTED',
    description: 'Simultaneous Smoke AND Heat registered. High threat probability.',
    color: '#f97316', // Orange
    bgGlow: 'rgba(249, 115, 22, 0.15)',
    borderGlow: 'rgba(249, 115, 22, 0.4)',
    badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  },
  q3: {
    id: 'q3',
    code: 'q3',
    name: 'FIRE_CONFIRMED',
    title: 'FIRE CONFIRMED',
    description: '🚨 Smoke + Heat + Flame confirmed! Sprinklers and primary alarms activated.',
    color: '#ef4444', // Red
    bgGlow: 'rgba(239, 68, 68, 0.25)',
    borderGlow: 'rgba(239, 68, 68, 0.7)',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
  },
  q4: {
    id: 'q4',
    code: 'q4',
    name: 'EVACUATION',
    title: 'EMERGENCY EVACUATION',
    description: '🚨 CRITICAL EVACUATION SIGNAL! Manual emergency pull or fire escalation triggered.',
    color: '#dc2626', // Deep emergency red
    bgGlow: 'rgba(220, 38, 38, 0.35)',
    borderGlow: 'rgba(220, 38, 38, 0.9)',
    badgeBg: 'bg-red-600/30 text-red-300 border-red-500/50 animate-pulse',
  },
  q5: {
    id: 'q5',
    code: 'q5',
    name: 'FIRE_CLEARED',
    title: 'FIRE CLEARED',
    description: 'Suppression complete. Hazards resolved; system returning to baseline.',
    color: '#14b8a6', // Teal
    bgGlow: 'rgba(20, 184, 166, 0.15)',
    borderGlow: 'rgba(20, 184, 166, 0.4)',
    badgeBg: 'bg-teal-500/20 text-teal-300 border-teal-500/30',
  },
  q6: {
    id: 'q6',
    code: 'q6',
    name: 'SYSTEM_FAULT',
    title: 'SENSOR / SYSTEM FAULT',
    description: '⚠️ Sensor fault or hardware malfunction detected. Maintenance required.',
    color: '#f59e0b', // Amber
    bgGlow: 'rgba(245, 158, 11, 0.15)',
    borderGlow: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  q7: {
    id: 'q7',
    code: 'q7',
    name: 'RESET',
    title: 'SYSTEM RESETTING',
    description: 'System reset pulse triggered. Restoring initial baseline state q0.',
    color: '#38bdf8', // Sky blue
    bgGlow: 'rgba(56, 189, 248, 0.15)',
    borderGlow: 'rgba(56, 189, 248, 0.4)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  },
};

// Initial Zone Configurations (4 Building Zones)
export const INITIAL_ZONES: Record<ZoneId, ZoneData> = {
  ZONE_A: {
    id: 'ZONE_A',
    code: 'ZONE A',
    name: 'Ground Floor Main Lobby',
    location: 'Ground Floor - Main Entrance & Atrium',
    sensors: { smoke: false, heat: false, flame: false, manualAlarm: false, fault: false },
    state: 'q0',
  },
  ZONE_B: {
    id: 'ZONE_B',
    code: 'ZONE B',
    name: 'First Floor Offices',
    location: 'First Floor - Executive & Working Bays',
    sensors: { smoke: false, heat: false, flame: false, manualAlarm: false, fault: false },
    state: 'q0',
  },
  ZONE_C: {
    id: 'ZONE_C',
    code: 'ZONE C',
    name: 'Research Laboratory',
    location: 'Second Floor - Chemical & Tech Lab',
    sensors: { smoke: false, heat: false, flame: false, manualAlarm: false, fault: false },
    state: 'q0',
  },
  ZONE_D: {
    id: 'ZONE_D',
    code: 'ZONE D',
    name: 'Data Center / Server Room',
    location: 'Basement - Core IT Servers & UPS',
    sensors: { smoke: false, heat: false, flame: false, manualAlarm: false, fault: false },
    state: 'q0',
  },
};

// Evaluate State for a single zone based on virtual sensor switches
export function evaluateZoneState(sensors: ZoneSensors): AutomataState {
  if (sensors.fault) {
    return 'q6'; // SYSTEM_FAULT
  }
  if (sensors.manualAlarm) {
    return 'q4'; // EVACUATION
  }
  if (sensors.smoke && sensors.heat && sensors.flame) {
    return 'q3'; // FIRE_CONFIRMED
  }
  if (sensors.smoke && sensors.heat) {
    return 'q2'; // FIRE_SUSPECTED
  }
  if (sensors.smoke || sensors.heat) {
    return 'q1'; // WARNING
  }
  return 'q0'; // NORMAL
}

// Evaluate Overall Building State (Highest priority state across all 4 zones)
const STATE_PRIORITY: Record<AutomataState, number> = {
  q4: 8, // EVACUATION (Highest)
  q3: 7, // FIRE_CONFIRMED
  q2: 6, // FIRE_SUSPECTED
  q6: 5, // SYSTEM_FAULT
  q1: 4, // WARNING
  q5: 3, // FIRE_CLEARED
  q7: 2, // RESET
  q0: 1, // NORMAL (Lowest)
};

export function evaluateBuildingState(zones: Record<ZoneId, ZoneData>): AutomataState {
  let highestState: AutomataState = 'q0';
  let maxPriority = 0;

  for (const key in zones) {
    const zoneState = zones[key as ZoneId].state;
    const priority = STATE_PRIORITY[zoneState] || 1;
    if (priority > maxPriority) {
      maxPriority = priority;
      highestState = zoneState;
    }
  }

  return highestState;
}

// Mealy Machine Output Function lambda(q, sigma) -> MealyOutput
export function getMealyOutput(state: AutomataState): MealyOutput {
  switch (state) {
    case 'q0':
      return {
        fireStatus: 'NORMAL',
        alarm: false,
        siren: false,
        sirenHighPriority: false,
        light: false,
        sprinkler: false,
        evacuation: false,
        notification: false,
      };

    case 'q1':
      return {
        fireStatus: 'WARNING',
        alarm: true,
        siren: false,
        sirenHighPriority: false,
        light: true,
        sprinkler: false,
        evacuation: false,
        notification: false,
      };

    case 'q2':
      return {
        fireStatus: 'FIRE_SUSPECTED',
        alarm: true,
        siren: true,
        sirenHighPriority: false,
        light: true,
        sprinkler: false,
        evacuation: false,
        notification: true,
      };

    case 'q3':
      return {
        fireStatus: 'FIRE_CONFIRMED',
        alarm: true,
        siren: true,
        sirenHighPriority: false,
        light: true,
        sprinkler: true,
        evacuation: true,
        notification: true,
      };

    case 'q4':
      return {
        fireStatus: 'EVACUATION',
        alarm: true,
        siren: true,
        sirenHighPriority: true,
        light: true,
        sprinkler: true,
        evacuation: true,
        notification: true,
      };

    case 'q5':
      return {
        fireStatus: 'FIRE_CLEARED',
        alarm: false,
        siren: false,
        sirenHighPriority: false,
        light: true,
        sprinkler: false,
        evacuation: false,
        notification: false,
      };

    case 'q6':
      return {
        fireStatus: 'SYSTEM_FAULT',
        alarm: false,
        siren: false,
        sirenHighPriority: false,
        light: true,
        sprinkler: false,
        evacuation: false,
        notification: false,
      };

    case 'q7':
    default:
      return {
        fireStatus: 'NORMAL',
        alarm: false,
        siren: false,
        sirenHighPriority: false,
        light: false,
        sprinkler: false,
        evacuation: false,
        notification: false,
      };
  }
}

// Generate human-readable transition equations
export function getTransitionEquation(from: AutomataState, to: AutomataState, trigger: string): string {
  return `δ(${from}, [${trigger}]) = ${to}`;
}
