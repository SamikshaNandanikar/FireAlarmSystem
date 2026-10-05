import { useState, useCallback, useEffect } from 'react';
import type {
  AutomataState,
  ZoneId,
  ZoneSensors,
  ZoneData,
  MealyOutput,
  TransitionLogRecord,
  ToastNotification,
} from '../types/automata';
import {
  INITIAL_ZONES,
  evaluateZoneState,
  evaluateBuildingState,
  getMealyOutput,
  getTransitionEquation,
} from '../logic/automata';
import { audioManager } from '../audio/AudioManager';

export function useAutomata() {
  const [zones, setZones] = useState<Record<ZoneId, ZoneData>>(INITIAL_ZONES);
  const [selectedZoneId, setSelectedZoneId] = useState<ZoneId>('ZONE_C'); // Default to Lab
  const [buildingState, setBuildingState] = useState<AutomataState>('q0');
  const [activeMealyOutput, setActiveMealyOutput] = useState<MealyOutput>(getMealyOutput('q0'));

  const [lastTransition, setLastTransition] = useState<{
    fromState: AutomataState;
    toState: AutomataState;
    triggerInput: string;
    equation: string;
  } | null>(null);

  const [history, setHistory] = useState<TransitionLogRecord[]>([]);
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(-1);
  const [isTheoryOpen, setIsTheoryOpen] = useState<boolean>(false);

  // Add Toast Notification
  const addToast = useCallback((type: ToastNotification['type'], title: string, message: string) => {
    const newToast: ToastNotification = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Trigger Sound Effects on State Change
  const triggerStateSound = useCallback((prevState: AutomataState, newState: AutomataState) => {
    if (prevState === newState && newState !== 'q3' && newState !== 'q4') return;

    switch (newState) {
      case 'q1':
        audioManager.stopEmergencySiren();
        audioManager.playWarningBeep();
        break;
      case 'q2':
        audioManager.stopEmergencySiren();
        audioManager.playFireSuspectedBeep();
        break;
      case 'q3':
        audioManager.startEmergencySiren(false);
        break;
      case 'q4':
        audioManager.startEmergencySiren(true);
        break;
      case 'q5':
        audioManager.playClearedChime();
        break;
      case 'q6':
        audioManager.stopEmergencySiren();
        audioManager.playFaultBuzz();
        break;
      case 'q7':
      case 'q0':
      default:
        audioManager.stopEmergencySiren();
        break;
    }
  }, []);

  // Toggle Virtual Sensor Switch for a specific Zone
  const toggleSensor = useCallback(
    (zoneId: ZoneId, sensorKey: keyof ZoneSensors) => {
      setZones((prevZones) => {
        const targetZone = prevZones[zoneId];
        const updatedSensors = {
          ...targetZone.sensors,
          [sensorKey]: !targetZone.sensors[sensorKey],
        };

        const newZoneState = evaluateZoneState(updatedSensors);
        const updatedZone: ZoneData = {
          ...targetZone,
          sensors: updatedSensors,
          state: newZoneState,
        };

        const nextZones = {
          ...prevZones,
          [zoneId]: updatedZone,
        };

        const prevBuildingState = buildingState;
        const newBuildingState = evaluateBuildingState(nextZones);
        const newMealy = getMealyOutput(newBuildingState);

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const triggerLabel = `${sensorKey.toUpperCase()} ${updatedSensors[sensorKey] ? 'ON' : 'OFF'}`;
        const equation = getTransitionEquation(prevBuildingState, newBuildingState, triggerLabel);
        const desc = `${triggerLabel} toggled in ${targetZone.code} (${targetZone.name}). State: ${prevBuildingState} → ${newBuildingState}.`;

        // Update last transition state
        setLastTransition({
          fromState: prevBuildingState,
          toState: newBuildingState,
          triggerInput: triggerLabel,
          equation,
        });

        setBuildingState(newBuildingState);
        setActiveMealyOutput(newMealy);

        // Sound trigger
        triggerStateSound(prevBuildingState, newBuildingState);

        // Add Toast
        const toastType = newBuildingState === 'q3' || newBuildingState === 'q4' ? 'error' : newBuildingState === 'q2' || newBuildingState === 'q1' ? 'warning' : 'info';
        addToast(toastType, `${targetZone.code}: ${triggerLabel}`, desc);

        // Add Log Record
        const newLogRecord: TransitionLogRecord = {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: timeStr,
          zoneId,
          zoneName: targetZone.name,
          triggerInput: triggerLabel,
          fromState: prevBuildingState,
          toState: newBuildingState,
          mealyOutput: newMealy,
          description: desc,
          equation,
        };

        setHistory((prev) => [newLogRecord, ...prev]);

        return nextZones;
      });
    },
    [buildingState, triggerStateSound, addToast]
  );

  // System Reset Action (Returns all zones to q0 NORMAL, keeps transition history!)
  const resetSystem = useCallback(() => {
    audioManager.playResetChime();
    setZones(INITIAL_ZONES);
    const prevBuildingState = buildingState;
    setBuildingState('q0');
    setActiveMealyOutput(getMealyOutput('q0'));
    setLastTransition({
      fromState: prevBuildingState,
      toState: 'q0',
      triggerInput: 'RESET',
      equation: `δ(${prevBuildingState}, [RESET]) = q0`,
    });
    setDemoStep(-1);
    addToast('success', 'SYSTEM RESET', 'All virtual zone sensors restored to NORMAL baseline (q0).');
  }, [buildingState, addToast]);

  // Clear History (Does NOT reset state machine!)
  const clearHistory = useCallback(() => {
    setHistory([]);
    addToast('info', 'History Log Cleared', 'Transition history cleared without modifying DFA state.');
  }, [addToast]);

  // Auto-Run 8-Step Fire Simulation Queue
  useEffect(() => {
    if (demoStep === -1) return;

    const timer = setTimeout(() => {
      if (demoStep === 0) {
        // Step 1: Normal initialization
        resetSystem();
        setDemoStep(1);
      } else if (demoStep === 1) {
        // Step 2: Smoke in Laboratory (Zone C)
        toggleSensor('ZONE_C', 'smoke');
        setDemoStep(2);
      } else if (demoStep === 2) {
        // Step 3: Heat in Laboratory (Zone C)
        toggleSensor('ZONE_C', 'heat');
        setDemoStep(3);
      } else if (demoStep === 3) {
        // Step 4: Flame in Laboratory (Zone C)
        toggleSensor('ZONE_C', 'flame');
        setDemoStep(4);
      } else if (demoStep === 4) {
        // Step 5: Manual Evacuation Signal
        toggleSensor('ZONE_C', 'manualAlarm');
        setDemoStep(5);
      } else if (demoStep === 5) {
        // Step 6: Clear Flame
        toggleSensor('ZONE_C', 'flame');
        setDemoStep(6);
      } else if (demoStep === 6) {
        // Step 7: Clear Heat & Smoke
        toggleSensor('ZONE_C', 'heat');
        toggleSensor('ZONE_C', 'smoke');
        toggleSensor('ZONE_C', 'manualAlarm');
        setDemoStep(7);
      } else if (demoStep === 7) {
        // Step 8: Return to Normal Baseline
        resetSystem();
        setDemoStep(-1); // Finished
      }
    }, 2200);

    return () => clearTimeout(timer);
  }, [demoStep, toggleSensor, resetSystem]);

  const startAutoSimulation = useCallback(() => {
    setIsDemoMode(true);
    setDemoStep(0);
  }, []);

  return {
    zones,
    selectedZoneId,
    setSelectedZoneId,
    buildingState,
    activeMealyOutput,
    lastTransition,
    history,
    toasts,
    isDemoMode,
    demoStep,
    isTheoryOpen,
    setIsTheoryOpen,
    toggleSensor,
    resetSystem,
    clearHistory,
    startAutoSimulation,
    removeToast,
  };
}
