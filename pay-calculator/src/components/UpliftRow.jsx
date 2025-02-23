import * as Form from '@radix-ui/react-form';
import * as Checkbox from '@radix-ui/react-checkbox';
import { CheckIcon } from './icons/CheckIcon';
import './UpliftRow.css';

export const UpliftRow = ({ uplift, onUpdate, onRemove }) => {
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
    <div className="uplift-row">
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
          <input
            type="number"
            className="form-input"
            value={uplift.percentage}
            onChange={handlePercentageChange}
            placeholder="Enter %"
            min="0"
            max="100"
            step="0.1"
          />
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

        <button
          type="button"
          className="remove-button"
          onClick={() => onRemove(uplift.id)}
          aria-label="Remove uplift"
        >
          ✕
        </button>
      </div>
    </div>
  );
};
