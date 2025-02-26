import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckIcon } from './icons/CheckIcon';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './UpliftRow.css';

export const UpliftRow = ({ uplift, onUpdate, onRemove, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  const handleDelete = () => {
    onRemove(uplift.id);
  };

  const handleTitleChange = (e) => {
    onUpdate({ ...uplift, title: e.target.value });
  };

  const handlePercentageChange = (e) => {
    onUpdate({ ...uplift, percentage: e.target.value });
  };

  const handleMultiplierChange = (checked) => {
    onUpdate({ ...uplift, multiplier: checked });
  };

  return (
    <div ref={setNodeRef} style={style} className="uplift-row">
      <div className="drag-handle" aria-label="Drag to reorder" {...attributes} {...listeners}>
        <div className="dots-grid">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>
      <Form.Root>
        <Form.Field className="form-field" name={`uplift-title-${uplift.id}`}>
        <Form.Control asChild>
          <input
            type="text"
            className="form-input"
            value={uplift.title}
            onChange={handleTitleChange}
            placeholder="Enter uplift title"
          />
        </Form.Control>
        </Form.Field>

        <Form.Field className="form-field" name={`uplift-percentage-${uplift.id}`}>
        <Form.Control asChild>
          <div className="input-with-suffix">
            <input
              type="number"
              className="form-input"
              value={uplift.percentage}
              onChange={handlePercentageChange}
              placeholder="Enter %"
              min="0"
              max="1000"
              step="0.5"
            />
            <span className="input-suffix">%</span>
          </div>
        </Form.Control>
        </Form.Field>
      </Form.Root>

      <div className="uplift-controls">
        <div className="multiplier-control">
          <Checkbox.Root
            className="checkbox-root"
            checked={uplift.multiplier}
            onCheckedChange={handleMultiplierChange}
            id={`uplift-multiplier-${uplift.id}`}
          >
            <Checkbox.Indicator className="checkbox-indicator">
              <CheckIcon />
            </Checkbox.Indicator>
          </Checkbox.Root>
          <label
            className="checkbox-label"
            htmlFor={`uplift-multiplier-${uplift.id}`}
          >
            Multiplier
          </label>
        </div>

        {uplift.title ? (
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <button
                type="button"
                className="remove-button"
                aria-label="Remove uplift"
              >
                ×
              </button>
            </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="dialog-overlay" />
            <Dialog.Content className="dialog-content">
              <Dialog.Title className="dialog-title">Delete Uplift</Dialog.Title>
              <Dialog.Description className="dialog-description">
                Are you sure you want to delete this uplift? This action cannot be undone.
              </Dialog.Description>
              <div className="dialog-buttons">
                <Dialog.Close asChild>
                  <button type="button" className="dialog-cancel">
                    Cancel
                  </button>
                </Dialog.Close>
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="dialog-delete"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </Dialog.Close>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        ) : (
          <button
            type="button"
            className="remove-button"
            onClick={handleDelete}
            aria-label="Remove uplift"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};
