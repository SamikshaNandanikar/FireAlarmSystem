import { useAutomata } from './hooks/useAutomata';
import { Header } from './components/Header';
import { EmergencyAlert } from './components/EmergencyAlert';
import { SystemStatus } from './components/SystemStatus';
import { Environment } from './components/Environment';
import { BuildingMap } from './components/BuildingMap';
import { VirtualSensorPanel } from './components/VirtualSensorPanel';
import { ResponsePanel } from './components/ResponsePanel';
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
    zones,
    selectedZoneId,
    setSelectedZoneId,
    buildingState,
    activeMealyOutput,
    lastTransition,
    history,
    toasts,
    demoStep,
    toggleSensor,
    resetSystem,
    clearHistory,
    startAutoSimulation,
    removeToast,
  } = useAutomata();

  const selectedZone = zones[selectedZoneId];

  return (
    <div className="min-h-screen bg-[#070a14] text-slate-100 p-4 md:p-8 max-w-7xl mx-auto flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Header with audio controls */}
      <Header />

      {/* Emergency Alert Banner (q3, q4, q6 active) */}
      <EmergencyAlert currentState={buildingState} />

      {/* Top Grid: Hero System Status & Live Environment Simulation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <SystemStatus
          currentState={buildingState}
          selectedZoneName={`${selectedZone.code}: ${selectedZone.name}`}
          lastTransition={lastTransition}
        />
        <Environment currentState={buildingState} />
      </div>

      {/* 4 Virtual Building Zones Selection Map */}
      <BuildingMap
        zones={zones}
        selectedZoneId={selectedZoneId}
        onSelectZone={setSelectedZoneId}
      />

      {/* Virtual Sensor Switchboard for Selected Zone */}
      <VirtualSensorPanel
        selectedZone={selectedZone}
        onToggleSensor={toggleSensor}
      />

      {/* Mealy Machine Emergency Response Panel */}
      <ResponsePanel
        currentState={buildingState}
        mealyOutput={activeMealyOutput}
      />

      {/* 8-Step Auto Run Fire Simulation & Reset Controls */}
      <DemoMode
        demoStep={demoStep}
        onStartAutoSimulation={startAutoSimulation}
        onResetSystem={resetSystem}
      />

      {/* Middle Grid: SVG State Graph (q0-q7) & Transition Formula / Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <DFAGraph currentState={buildingState} lastTransition={lastTransition} />
        <div className="flex flex-col justify-between gap-6">
          <TransitionDisplay lastTransition={lastTransition} />
          <TransitionHistory history={history} onClearHistory={clearHistory} />
        </div>
      </div>

      {/* Mealy Machine Transition Table */}
      <TransitionTable
        currentState={buildingState}
        lastTransition={lastTransition}
      />

      {/* Educational Automata Theory & Viva Preparation Section */}
      <AutomataExplanation />

      {/* Footer */}
      <Footer />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}

export default App;
