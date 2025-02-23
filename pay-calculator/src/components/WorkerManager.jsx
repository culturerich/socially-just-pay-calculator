import { usePayCalculator } from '../context/PayCalculatorContext';

export const WorkerManager = () => {
  const { workers, setWorkers, uplifts } = usePayCalculator();

  return (
    <section>
      <h2>Workers</h2>
      <div>
        {/* TODO: Implement worker rows with NI category and uplift selection */}
        <p>Placeholder for worker management interface</p>
      </div>
    </section>
  );
};
