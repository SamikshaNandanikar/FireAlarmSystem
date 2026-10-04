import { useState, useCallback } from 'react';
import type { StateId, InputSymbol, TransitionLog, ToastItem } from '../types/dfa';
import { getNextDFAState, TRANSITION_DESCRIPTIONS } from '../logic/dfa';
import { audioManager } from '../audio/AudioManager';

export function useDFA() {
  const [currentState, setCurrentState] = useState<StateId>('q0');
  const [lastInput, setLastInput] = useState<InputSymbol | null>(null);
  const [lastTransition, setLastTransition] = useState<{
    from: StateId;
    input: InputSymbol;
    to: StateId;
    equation: string;
  } | null>(null);

  const [history, setHistory] = useState<TransitionLog[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Helper to add toast notification
  const addToast = useCallback((type: ToastItem['type'], title: string, message: string) => {
    const newToast: ToastItem = {
      id: Math.random().toString(36).substring(2, 9),
      type,
      title,
      message,
    };
    setToasts((prev) => [newToast, ...prev].slice(0, 4));

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== newToast.id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Execute DFA State Transition
  const triggerInput = useCallback(
    (inputSymbol: InputSymbol) => {
      const nextState = getNextDFAState(currentState, inputSymbol);
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const transitionKey = `${currentState}->${inputSymbol}->${nextState}`;
      const desc = TRANSITION_DESCRIPTIONS[transitionKey] || `Transition from ${currentState} to ${nextState} via ${inputSymbol}.`;
      const equation = `δ(${currentState}, ${inputSymbol}) = ${nextState}`;

      // Audio Trigger Logic according to DFA requirements
      if (currentState === 'q0' && nextState === 'q1') {
        audioManager.playSmokeBeep();
        addToast('warning', 'Smoke Detected (S)', 'Particulate sensors registered smoke. Monitoring q1.');
      } else if (currentState === 'q1' && nextState === 'q2') {
        audioManager.playTempWarningBeep();
        addToast('warning', 'High Temperature (H)', 'Temperature threshold exceeded. Warning state q2.');
      } else if (nextState === 'q3') {
        audioManager.startEmergencyAlarm(); // Idempotent siren start
        if (currentState !== 'q3') {
          addToast('error', '🚨 FIRE ALARM ACTIVATED (F)', 'Combustion confirmed! Emergency state q3 reached.');
        } else {
          addToast('error', 'FIRE ALARM ACTIVE', 'System locked in q3 (Absorbing State). Reset required.');
        }
      } else if (currentState === nextState) {
        addToast('info', `Input ${inputSymbol} Received`, `State remains ${currentState} (Self-loop).`);
      }

      setLastInput(inputSymbol);
      setLastTransition({
        from: currentState,
        input: inputSymbol,
        to: nextState,
        equation,
      });

      setCurrentState(nextState);

      // Add to transition history log
      const newLogItem: TransitionLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: timeStr,
        inputSymbol,
        fromState: currentState,
        toState: nextState,
        description: desc,
        equation,
      };

      setHistory((prev) => [newLogItem, ...prev]);
    },
    [currentState, addToast]
  );

  // System Reset (Returns to q0, stops alarm, keeps transition history!)
  const resetSystem = useCallback(() => {
    audioManager.playResetChime();
    setCurrentState('q0');
    setLastInput(null);
    setLastTransition(null);
    addToast('success', 'SYSTEM RESET', 'Returning to NORMAL state (q0). Environment restored.');
  }, [addToast]);

  // Clear transition log (does NOT reset DFA state)
  const clearHistory = useCallback(() => {
    setHistory([]);
    addToast('info', 'History Cleared', 'Transition log history cleared.');
  }, [addToast]);

  // Demo mode toggle
  const toggleDemoMode = useCallback(() => {
    setIsDemoMode((prev) => !prev);
  }, []);

  return {
    currentState,
    lastInput,
    lastTransition,
    history,
    toasts,
    isDemoMode,
    triggerInput,
    resetSystem,
    clearHistory,
    toggleDemoMode,
    removeToast,
  };
}
