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
        <h1>Socially Just Pay Calculator</h1>
        <p className="app-intro">
          A tool to help you calculate the costs of a socially-just pay policy with different uplifts &amp; workers.
        </p>
        <main>
          <section className="section-intro">
            <h2>Basic Details</h2>
            <p>Enter the core salary information and pension details to begin...</p>
          </section>
          <BasicDetails />
          <section className="section-intro">
            <h2>Uplifts</h2>
            <p>Add needs-based uplifts and their details...</p>
          </section>
          <UpliftManager />

          <section className="section-intro">
            <h2>Workers</h2>
            <p>Add workers and their uplifts...</p>
          </section>
          <WorkerManager />
          <section className="section-intro">
            <h2>Total Calculations</h2>
            <p>Based on the info above, here are total pay policy costs...</p>
          </section>
          <TotalCalculations />
        </main>
      </div>
    </PayCalculatorProvider>
  );
}

export default App;
