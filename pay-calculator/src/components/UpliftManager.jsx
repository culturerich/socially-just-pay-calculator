import { usePayCalculator } from '../context/PayCalculatorContext';
import { UpliftRow } from './UpliftRow';
import './UpliftManager.css';

export const UpliftManager = () => {
  const { uplifts, setUplifts } = usePayCalculator();

  const handleAddUplift = () => {
    const newUplift = {
      id: `uplift-${Date.now()}`,
      title: '',
      percentage: '',
      multiplier: false
    };
    setUplifts([...uplifts, newUplift]);
  };

  const handleUpdateUplift = (updatedUplift) => {
    setUplifts(
      uplifts.map((uplift) =>
        uplift.id === updatedUplift.id ? updatedUplift : uplift
      )
    );
  };

  const handleRemoveUplift = (upliftId) => {
    setUplifts(uplifts.filter((uplift) => uplift.id !== upliftId));
  };

  return (
    <section>
      <div className="section-header">
        <h2>Salary Uplifts</h2>
        <button
          type="button"
          className="add-button"
          onClick={handleAddUplift}
          aria-label="Add new uplift"
        >
          + Add Uplift
        </button>
      </div>

      <div className="uplifts-container">
        {uplifts.length === 0 ? (
          <p className="no-uplifts">No uplifts added yet. Click "Add Uplift" to start.</p>
        ) : (
          uplifts.map((uplift) => (
            <UpliftRow
              key={uplift.id}
              uplift={uplift}
              onUpdate={handleUpdateUplift}
              onRemove={handleRemoveUplift}
            />
          ))
        )}
      </div>
    </section>
  );
};
