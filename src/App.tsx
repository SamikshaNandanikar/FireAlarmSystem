import { useDFA } from './hooks/useDFA';
import { Header } from './components/Header';
import { EmergencyAlert } from './components/EmergencyAlert';
import { SystemStatus } from './components/SystemStatus';
import { Environment } from './components/Environment';
import { SensorDashboard } from './components/SensorDashboard';
import { SensorControls } from './components/SensorControls';
import { DFAGraph } from './components/DFAGraph';
import { TransitionDisplay } from './components/TransitionDisplay';
import { TransitionHistory } from './components/TransitionHistory';
import { TransitionTable } from './components/TransitionTable';
import { DemoMode } from './components/DemoMode';
import { AutomataExplanation } from './components/AutomataExplanation';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/ToastContainer';

export function App() {
  const {
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
  } = useDFA();

  const getRecommendedNextInput = () => {
    if (!isDemoMode) return undefined;
    switch (currentState) {
      case 'q0': return 'S';
      case 'q1': return 'H';
      case 'q2': return 'F';
      default: return undefined;
    }
  };

  return (
    <div className="min-h-screen bg-[#070a14] text-slate-100 p-4 md:p-8 max-w-7xl mx-auto flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Header with audio controls */}
      <Header />

      {/* Emergency Alert Banner (q3 absorbing state active) */}
      <EmergencyAlert currentState={currentState} />

      {/* Top Grid: Hero Status & Environment Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SystemStatus
          currentState={currentState}
          lastInput={lastInput}
          lastTransition={lastTransition}
        />
        <Environment currentState={currentState} />
      </div>

      {/* Sensor Monitoring Cards */}
      <SensorDashboard currentState={currentState} />

      {/* Sensor Input Buttons */}
      <SensorControls
        onTriggerInput={triggerInput}
        recommendedInput={getRecommendedNextInput()}
      />

      {/* Demo Mode Guide & Large System Reset */}
      <DemoMode
        currentState={currentState}
        isDemoMode={isDemoMode}
        onToggleDemoMode={toggleDemoMode}
        onResetSystem={resetSystem}
        onTriggerInput={triggerInput}
      />

      {/* Middle Grid: DFA Graph & Transition Display/History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DFAGraph currentState={currentState} lastTransition={lastTransition} />
        <div className="flex flex-col justify-between gap-6">
          <TransitionDisplay lastTransition={lastTransition} />
          <TransitionHistory history={history} onClearHistory={clearHistory} />
        </div>
      </div>

      {/* DFA Transition Matrix Table */}
      <TransitionTable
        currentState={currentState}
        lastInput={lastInput}
        lastTransition={lastTransition}
      />

      {/* Academic Automata Theory Section */}
      <AutomataExplanation />

      {/* Footer */}
      <Footer />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default App;
