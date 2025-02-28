import { usePayCalculator } from '../context/PayCalculatorContext';
import { UpliftRow } from './UpliftRow';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import './UpliftManager.css';

export const UpliftManager = () => {
  const { uplifts, setUplifts } = usePayCalculator();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddUplift = () => {
    const newUplift = {
      id: `uplift-${Date.now()}`,
      title: '',
      percentage: ''
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

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setUplifts((items) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  return (
    <section className="uplifts-section" data-section="uplifts">
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="uplifts-container">
          {uplifts.length === 0 ? (
            <p className="no-uplifts">No uplifts added yet. Click "Add Uplift" to start.</p>
          ) : (
            <SortableContext
              items={uplifts.map(u => u.id)}
              strategy={verticalListSortingStrategy}
            >
              {uplifts.map((uplift) => (
                <UpliftRow
                  key={uplift.id}
                  id={uplift.id}
                  uplift={uplift}
                  onUpdate={handleUpdateUplift}
                  onRemove={handleRemoveUplift}
                />
              ))}
            </SortableContext>
          )}
        </div>
      </DndContext>

      <div className="section-footer">
        <button
          type="button"
          className="add-button"
          onClick={handleAddUplift}
          aria-label="Add new uplift"
        >
          + Add Uplift
        </button>
      </div>
    </section>
  );
};
