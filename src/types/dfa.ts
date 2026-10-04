export type StateId = 'q0' | 'q1' | 'q2' | 'q3';

export type InputSymbol = 'N' | 'S' | 'H' | 'F';

export interface SensorTelemetry {
  smokeLevel: 'LOW' | 'ELEVATED' | 'CRITICAL';
  smokePercent: number;
  temperature: number; // in °C
  alarmStatus: 'INACTIVE' | 'WARNING' | 'ACTIVE';
}

export interface StateConfig {
  id: StateId;
  code: string;
  name: string;
  statusTitle: string;
  statusMessage: string;
  environmentDesc: string;
  color: string; // HEX or CSS variable
  bgGlow: string;
  borderGlow: string;
  badgeBg: string;
  telemetry: SensorTelemetry;
}

export interface InputConfig {
  symbol: InputSymbol;
  name: string;
  shortDesc: string;
  fullDesc: string;
  iconName: string;
}

export interface TransitionLog {
  id: string;
  timestamp: string;
  inputSymbol: InputSymbol;
  fromState: StateId;
  toState: StateId;
  description: string;
  equation: string;
}

export interface ToastItem {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
}
