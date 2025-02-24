import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronIcon } from './icons/ChevronIcon';
import niCategories from '../data/ni-categories.json';

export const WorkerRow = ({ worker, uplifts, onUpdate, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id: worker.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleNameChange = (e) => {
    onUpdate({
      ...worker,
      name: e.target.value
    });
  };

  const handleNiCategoryChange = (value) => {
    onUpdate({
      ...worker,
      niCategory: value
    });
  };

  const handleUpliftToggle = (upliftId) => {
    const newSelectedUplifts = worker.selectedUplifts.includes(upliftId)
      ? worker.selectedUplifts.filter(id => id !== upliftId)
      : [...worker.selectedUplifts, upliftId];

    onUpdate({
      ...worker,
      selectedUplifts: newSelectedUplifts
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="worker-row"
    >
      <div className="drag-handle" {...attributes} {...listeners}>
        <div className="dots-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dot" />
          ))}
        </div>
      </div>
      <input
        type="text"
        value={worker.name}
        onChange={handleNameChange}
        placeholder="Worker name"
        className="worker-name-input"
      />

      <Select.Root value={worker.niCategory} onValueChange={handleNiCategoryChange}>
        <Select.Trigger className="select-trigger" aria-label="NI Category">
          <Select.Value placeholder="Select NI category" />
          <Select.Icon>
            <ChevronIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Portal>
          <Select.Content className="select-content">
            <Select.ScrollUpButton className="select-scroll-button">
              <ChevronIcon style={{ transform: 'rotate(180deg)' }} />
            </Select.ScrollUpButton>

            <Select.Viewport className="select-viewport">
              {Object.entries(niCategories).map(([category, details]) => (
                <Select.Item key={category} value={category} className="select-item">
                  <Select.ItemText>
                    {category} - {details.name}
                  </Select.ItemText>
                  <Select.ItemIndicator className="select-item-indicator">
                    <CheckIcon />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Viewport>

            <Select.ScrollDownButton className="select-scroll-button">
              <ChevronIcon />
            </Select.ScrollDownButton>
          </Select.Content>
        </Select.Portal>
      </Select.Root>

      <div className="uplifts-container">
        {uplifts.map(uplift => (
          <div key={uplift.id} className="uplift-checkbox">
            <Checkbox.Root
              className="checkbox-root"
              checked={worker.selectedUplifts.includes(uplift.id)}
              onCheckedChange={() => handleUpliftToggle(uplift.id)}
              disabled={!uplift.title || !uplift.percentage}
            >
              <Checkbox.Indicator className="checkbox-indicator">
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <label>{uplift.title || 'Untitled uplift'}</label>
          </div>
        ))}
      </div>

      <Dialog.Root open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <Dialog.Trigger asChild>
          <button className="delete-button" aria-label="Delete worker">
            ×
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Delete Worker</Dialog.Title>
            <Dialog.Description className="dialog-description">
              Are you sure you want to delete this worker? This action cannot be undone.
            </Dialog.Description>
            <div className="dialog-buttons">
              <Dialog.Close asChild>
                <button className="dialog-button cancel">Cancel</button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  className="dialog-button delete"
                  onClick={() => onDelete(worker.id)}
                >
                  Delete
                </button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
};
