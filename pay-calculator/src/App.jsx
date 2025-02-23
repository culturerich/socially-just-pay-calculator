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
          Calculate fair and equitable compensation packages that promote social justice in the workplace. This tool helps ensure your pay decisions align with principles of equality and fairness.
        </p>
        <main>
          <section className="section-intro">
            <h2>Basic Details</h2>
            <p>Enter the core salary information and pension details to begin your calculation.</p>
          </section>
          <BasicDetails />
          <section className="section-intro">
            <h2>Salary Uplifts</h2>
            <p>Add percentage-based adjustments to account for additional responsibilities, skills, or other factors that warrant increased compensation.</p>
          </section>
          <UpliftManager />

          <section className="section-intro">
            <h2>Worker Management</h2>
            <p>Configure specific worker details and employment categories to ensure accurate calculations.</p>
          </section>
          <WorkerManager />
          <TotalCalculations />
        </main>
      </div>
    </PayCalculatorProvider>
  );
}

export default App;
