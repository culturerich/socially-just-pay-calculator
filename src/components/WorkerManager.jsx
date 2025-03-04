import { usePayCalculator } from '../context/PayCalculatorContext';
import { WorkerRow } from './WorkerRow';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import './WorkerRow.css';
import './WorkerManager.css';

export const WorkerManager = () => {
  const { workers, setWorkers, uplifts, salary } = usePayCalculator();

  const handleAddWorker = () => {
    const newWorker = {
      id: crypto.randomUUID(),
      name: '',
      niCategory: 'A',
      daysPerWeek: 4,
      selectedUplifts: []
    };
    setWorkers([...workers, newWorker]);
  };

  const handleUpdateWorker = (updatedWorker) => {
    setWorkers(workers.map(worker =>
      worker.id === updatedWorker.id ? updatedWorker : worker
    ));
  };

  const handleDeleteWorker = (workerId) => {
    setWorkers(workers.filter(worker => worker.id !== workerId));
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = workers.findIndex(worker => worker.id === active.id);
    const newIndex = workers.findIndex(worker => worker.id === over.id);

    const newWorkers = [...workers];
    const [movedWorker] = newWorkers.splice(oldIndex, 1);
    newWorkers.splice(newIndex, 0, movedWorker);

    setWorkers(newWorkers);
  };

  return (
    <>

      <section className="workers-section" data-section="workers">
        <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="worker-list">
          {workers.length === 0 ? (
            <div className="no-workers">
              Add workers to calculate their pay
            </div>
          ) : (
            <SortableContext
              items={workers.map(w => w.id)}
              strategy={verticalListSortingStrategy}
            >
              {workers.map((worker) => (
                <WorkerRow
                  key={worker.id}
                  worker={worker}
                  uplifts={uplifts}
                  salary={salary}
                  onUpdate={handleUpdateWorker}
                  onDelete={handleDeleteWorker}
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
            onClick={handleAddWorker}
            aria-label="Add new worker"
          >
            + Add Worker
          </button>
        </div>
      </section>
    </>
  );
};
