import type { StateId, InputSymbol, StateConfig, InputConfig } from '../types/dfa';

// Exact DFA Transition Function Matrix delta(q, symbol) -> q'
export const DFA_TRANSITION_MATRIX: Record<StateId, Record<InputSymbol, StateId>> = {
  q0: {
    N: 'q0',
    S: 'q1',
    H: 'q0',
    F: 'q0',
  },
  q1: {
    N: 'q1',
    S: 'q1',
    H: 'q2',
    F: 'q1',
  },
  q2: {
    N: 'q2',
    S: 'q2',
    H: 'q2',
    F: 'q3',
  },
  q3: {
    N: 'q3',
    S: 'q3',
    H: 'q3',
    F: 'q3',
  },
};

/**
 * Centralized DFA State Transition Function
 */
export function getNextDFAState(currentState: StateId, input: InputSymbol): StateId {
  return DFA_TRANSITION_MATRIX[currentState][input] || currentState;
}

// State Metadata Configurations
export const STATE_CONFIGS: Record<StateId, StateConfig> = {
  q0: {
    id: 'q0',
    code: 'q0',
    name: 'NORMAL',
    statusTitle: 'NORMAL',
    statusMessage: 'Environment is safe. All sensors operational.',
    environmentDesc: 'Clean environment with normal ambient readings.',
    color: '#10b981', // emerald green
    bgGlow: 'rgba(16, 185, 129, 0.15)',
    borderGlow: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    telemetry: {
      smokeLevel: 'LOW',
      smokePercent: 5,
      temperature: 24,
      alarmStatus: 'INACTIVE',
    },
  },
  q1: {
    id: 'q1',
    code: 'q1',
    name: 'SMOKE DETECTED',
    statusTitle: 'SMOKE DETECTED',
    statusMessage: 'Smoke detected — monitoring environment.',
    environmentDesc: 'Suspended smoke particles detected. Thermal verify pending.',
    color: '#eab308', // yellow
    bgGlow: 'rgba(234, 179, 8, 0.15)',
    borderGlow: 'rgba(234, 179, 8, 0.4)',
    badgeBg: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    telemetry: {
      smokeLevel: 'ELEVATED',
      smokePercent: 45,
      temperature: 30,
      alarmStatus: 'WARNING',
    },
  },
  q2: {
    id: 'q2',
    code: 'q2',
    name: 'HIGH TEMPERATURE',
    statusTitle: 'HIGH TEMPERATURE',
    statusMessage: 'Temperature rising — warning condition.',
    environmentDesc: 'Elevated ambient heat and thermal shimmer detected.',
    color: '#f97316', // orange
    bgGlow: 'rgba(249, 115, 22, 0.15)',
    borderGlow: 'rgba(249, 115, 22, 0.4)',
    badgeBg: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    telemetry: {
      smokeLevel: 'ELEVATED',
      smokePercent: 60,
      temperature: 75,
      alarmStatus: 'WARNING',
    },
  },
  q3: {
    id: 'q3',
    code: 'q3',
    name: 'FIRE ALARM',
    statusTitle: 'FIRE ALARM',
    statusMessage: 'Fire detected — emergency alarm active.',
    environmentDesc: '🚨 Combustion confirmed! Emergency evacuation signal active.',
    color: '#ef4444', // red
    bgGlow: 'rgba(239, 68, 68, 0.25)',
    borderGlow: 'rgba(239, 68, 68, 0.7)',
    badgeBg: 'bg-red-500/20 text-red-400 border-red-500/30',
    telemetry: {
      smokeLevel: 'CRITICAL',
      smokePercent: 95,
      temperature: 95,
      alarmStatus: 'ACTIVE',
    },
  },
};

// Input Symbols Data
export const INPUT_CONFIGS: Record<InputSymbol, InputConfig> = {
  N: {
    symbol: 'N',
    name: 'NORMAL',
    shortDesc: 'Ambient conditions clear',
    fullDesc: 'Sensor returns to standard ambient baseline readings.',
    iconName: 'ShieldCheck',
  },
  S: {
    symbol: 'S',
    name: 'SMOKE DETECTED',
    shortDesc: 'Smoke sensor triggered',
    fullDesc: 'Optical smoke chamber registers elevated particulate density.',
    iconName: 'Wind',
  },
  H: {
    symbol: 'H',
    name: 'HIGH TEMPERATURE',
    shortDesc: 'Thermal threshold exceeded',
    fullDesc: 'Thermal sensors register rapid ambient temperature spike.',
    iconName: 'ThermometerAlert',
  },
  F: {
    symbol: 'F',
    name: 'FIRE DETECTED',
    shortDesc: 'Optical flame confirmed',
    fullDesc: 'Infrared & UV flame sensors confirm active flame combustion.',
    iconName: 'Flame',
  },
};

// Human-readable transition explanations
export const TRANSITION_DESCRIPTIONS: Record<string, string> = {
  'q0->N->q0': 'Normal conditions persist; system remains safe in q0.',
  'q0->S->q1': 'Smoke detected while Normal; transitioning to Smoke Detected (q1).',
  'q0->H->q0': 'Temperature pulse detected in Normal state without smoke; system remains in q0.',
  'q0->F->q0': 'Optical glitch detected in Normal state; system remains in q0.',

  'q1->N->q1': 'Normal signal received in Smoke state; monitoring continues in q1.',
  'q1->S->q1': 'Smoke persists; system remains in Smoke Detected (q1).',
  'q1->H->q2': 'High temperature registered under Smoke condition; transitioning to High Temp (q2).',
  'q1->F->q1': 'Flame signal registered without heat threshold; system stays in q1.',

  'q2->N->q2': 'Normal signal in High Temp state; system holds warning state q2.',
  'q2->S->q2': 'Smoke persists under High Temp state; system holds warning state q2.',
  'q2->H->q2': 'High temperature persists; warning condition maintained in q2.',
  'q2->F->q3': 'Fire detected while in Warning state! Absorbing Fire Alarm state q3 ACTIVATED!',

  'q3->N->q3': 'Emergency alarm active (q3 is absorbing); remaining in Fire Alarm.',
  'q3->S->q3': 'Emergency alarm active (q3 is absorbing); remaining in Fire Alarm.',
  'q3->H->q3': 'Emergency alarm active (q3 is absorbing); remaining in Fire Alarm.',
  'q3->F->q3': 'Emergency alarm active (q3 is absorbing); remaining in Fire Alarm.',
};
