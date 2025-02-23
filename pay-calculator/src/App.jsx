import { PayCalculatorProvider } from './context/PayCalculatorContext';
import { BasicDetails } from './components/BasicDetails';
import { UpliftManager } from './components/UpliftManager';
import { WorkerManager } from './components/WorkerManager';
import { TotalCalculations } from './components/TotalCalculations';
import './App.css';

function App() {
  return (
    <PayCalculatorProvider>
      <div className="app">
        <h1>UK Pay Calculator</h1>
        <main>
          <BasicDetails />
          <UpliftManager />
          <WorkerManager />
          <TotalCalculations />
        </main>
      </div>
    </PayCalculatorProvider>
  );
}

export default App;
