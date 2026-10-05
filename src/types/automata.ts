export type AutomataState =
  | 'q0' // NORMAL
  | 'q1' // WARNING
  | 'q2' // FIRE_SUSPECTED
  | 'q3' // FIRE_CONFIRMED
  | 'q4' // EVACUATION
  | 'q5' // FIRE_CLEARED
  | 'q6' // SYSTEM_FAULT
  | 'q7'; // RESET

export type ZoneId = 'ZONE_A' | 'ZONE_B' | 'ZONE_C' | 'ZONE_D';

export interface ZoneSensors {
  smoke: boolean;
  heat: boolean;
  flame: boolean;
  manualAlarm: boolean;
  fault: boolean;
}

export interface ZoneData {
  id: ZoneId;
  code: string;
  name: string;
  location: string;
  sensors: ZoneSensors;
  state: AutomataState;
}

export interface MealyOutput {
  fireStatus: 'NORMAL' | 'WARNING' | 'FIRE_SUSPECTED' | 'FIRE_CONFIRMED' | 'EVACUATION' | 'FIRE_CLEARED' | 'SYSTEM_FAULT';
  alarm: boolean;
  siren: boolean;
  sirenHighPriority: boolean;
  light: boolean;
  sprinkler: boolean;
  evacuation: boolean;
  notification: boolean;
}

export interface StateMeta {
  id: AutomataState;
  code: string;
  name: string;
  title: string;
  description: string;
  color: string;
  bgGlow: string;
  borderGlow: string;
  badgeBg: string;
}

export interface TransitionLogRecord {
  id: string;
  timestamp: string;
  zoneId: ZoneId;
  zoneName: string;
  triggerInput: string;
  fromState: AutomataState;
  toState: AutomataState;
  mealyOutput: MealyOutput;
  description: string;
  equation: string;
}

export interface ToastNotification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
}
