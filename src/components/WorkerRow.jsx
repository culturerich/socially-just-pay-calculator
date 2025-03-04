import { useState, useMemo } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as Select from '@radix-ui/react-select';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import * as Collapsible from '@radix-ui/react-collapsible';
import { CheckIcon } from './icons/CheckIcon';
import { ChevronIcon } from './icons/ChevronIcon';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { tooltipContent } from '../data/tooltip-content';
import niCategories from '../data/ni-categories.json';
import {
  formatCurrencyNoDecimals,
  calculateTotalUpliftPercentage,
  calculateGrossSalary,
  calculateTotalUplift
} from '../services/PayCalculatorService';

export const WorkerRow = ({ worker, uplifts, salary, onUpdate, onDelete }) => {
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
  const [isUpliftOpen, setIsUpliftOpen] = useState(false);

  // Calculate total uplift percentage using the service
  const totalUpliftPercentage = useMemo(() => {
    return calculateTotalUpliftPercentage(worker.selectedUplifts, uplifts);
  }, [worker.selectedUplifts, uplifts]);

  // Calculate gross salary using the service
  const grossSalary = useMemo(() => {
    if (!salary) return 0;
    return calculateGrossSalary(parseFloat(salary), totalUpliftPercentage, worker.daysPerWeek);
  }, [salary, totalUpliftPercentage, worker.daysPerWeek]);

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

  const handleDaysPerWeekChange = (e) => {
    const value = parseFloat(e.target.value);
    onUpdate({
      ...worker,
      daysPerWeek: value
    });
  };

  const handleUpliftToggle = (upliftId) => {
    // Convert old format to new format if needed
    const newSelectedUplifts = [...worker.selectedUplifts];

    const index = newSelectedUplifts.findIndex(item =>
      typeof item === 'string' ? item === upliftId : item.id === upliftId
    );

    if (index !== -1) {
      // Remove the uplift
      newSelectedUplifts.splice(index, 1);
    } else {
      // Add the uplift with default multiplier and extraPercentage
      newSelectedUplifts.push({
        id: upliftId,
        multiplier: 1,
        extraPercentage: 0
      });
    }

    onUpdate({
      ...worker,
      selectedUplifts: newSelectedUplifts
    });
  };

  const handleUpliftMultiplierChange = (upliftId, value) => {
    const newSelectedUplifts = [...worker.selectedUplifts];

    const index = newSelectedUplifts.findIndex(item =>
      typeof item === 'string' ? item === upliftId : item.id === upliftId
    );

    if (index !== -1) {
      // Convert string format to object format if needed
      if (typeof newSelectedUplifts[index] === 'string') {
        newSelectedUplifts[index] = {
          id: upliftId,
          multiplier: parseInt(value) || 1,
          extraPercentage: 0
        };
      } else {
        newSelectedUplifts[index] = {
          ...newSelectedUplifts[index],
          multiplier: parseInt(value) || 1
        };
      }

      onUpdate({
        ...worker,
        selectedUplifts: newSelectedUplifts
      });
    }
  };

  const handleUpliftExtraPercentageChange = (upliftId, value) => {
    const newSelectedUplifts = [...worker.selectedUplifts];

    const index = newSelectedUplifts.findIndex(item =>
      typeof item === 'string' ? item === upliftId : item.id === upliftId
    );

    if (index !== -1) {
      // Convert string format to object format if needed
      if (typeof newSelectedUplifts[index] === 'string') {
        newSelectedUplifts[index] = {
          id: upliftId,
          multiplier: 1,
          extraPercentage: parseFloat(value) || 0
        };
      } else {
        newSelectedUplifts[index] = {
          ...newSelectedUplifts[index],
          extraPercentage: parseFloat(value) || 0
        };
      }

      onUpdate({
        ...worker,
        selectedUplifts: newSelectedUplifts
      });
    }
  };

  // Helper function to check if an uplift is selected
  const isUpliftSelected = (upliftId) => {
    return worker.selectedUplifts.some(item =>
      typeof item === 'string' ? item === upliftId : item.id === upliftId
    );
  };

  // Helper function to get uplift data (multiplier and extraPercentage)
  const getUpliftData = (upliftId) => {
    const upliftData = worker.selectedUplifts.find(item =>
      typeof item === 'string' ? item === upliftId : item.id === upliftId
    );

    if (!upliftData) return { multiplier: 1, extraPercentage: 0 };

    if (typeof upliftData === 'string') {
      return { multiplier: 1, extraPercentage: 0 };
    }

    return {
      multiplier: upliftData.multiplier || 1,
      extraPercentage: upliftData.extraPercentage || 0
    };
  };

  // Calculate total uplift for a specific uplift using the service
  const getTotalUplift = (upliftId) => {
    const { multiplier, extraPercentage } = getUpliftData(upliftId);
    return calculateTotalUplift(upliftId, uplifts, { multiplier, extraPercentage });
  };

  // Delete button with dialog if needed
  const deleteButton = worker.name || worker.selectedUplifts.length > 0 ? (
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
  ) : (
    <button
      className="delete-button"
      aria-label="Delete worker"
      onClick={() => onDelete(worker.id)}
    >
      ×
    </button>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="worker-row-container"
      role="group"
      aria-label={`Worker: ${worker.name || 'Unnamed worker'}`}
    >
      {/* Drag handle */}
      <div className="drag-handle" {...attributes} {...listeners}>
        <div className="dots-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="dot" />
          ))}
        </div>
      </div>

      {/* Worker content container */}
      <div className="worker-content-container">
        {/* Main worker row */}
        <div className="worker-row">
          <div className="worker-name-container">
            <label htmlFor={`worker-name-${worker.id}`} className="form-label">Worker</label>
            <input
              id={`worker-name-${worker.id}`}
              type="text"
              value={worker.name}
              onChange={handleNameChange}
              placeholder="Enter name"
              className="worker-name-input"
              aria-label="Worker name"
              required
            />
          </div>

          <div className="ni-category-container">
            <div className="form-label">
              NI Category
              <Tooltip content="National Insurance category affects employer contributions">
                <InfoIcon />
              </Tooltip>
            </div>
            <Select.Root value={worker.niCategory} onValueChange={handleNiCategoryChange}>
              <Select.Trigger
                className="select-trigger"
                aria-label="National Insurance Category"
                aria-required="true"
              >
                <Select.Value placeholder="Select NI category" />
                <Select.Icon>
                  <ChevronIcon />
                </Select.Icon>
              </Select.Trigger>

              <Select.Portal>
                <Select.Content className="select-content" data-section="workers">
                  <Select.ScrollUpButton className="select-scroll-button">
                    <ChevronIcon style={{ transform: 'rotate(180deg)' }} />
                  </Select.ScrollUpButton>

                  <Select.Viewport className="select-viewport">
                    {Object.entries(niCategories).map(([category, details]) => (
                      <Select.Item key={category} value={category} className="select-item">
                        <Tooltip content={details.description} position="right">
                          <Select.ItemText>
                            {category} - {details.name}
                          </Select.ItemText>
                        </Tooltip>
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
          </div>

          {/* Days Per Week Input */}
          <div className="days-per-week-container">
            <label htmlFor={`days-per-week-${worker.id}`} className="form-label">
              Days/Week
              <Tooltip content="Number of days worked per week">
                <InfoIcon />
              </Tooltip>
            </label>
            <input
              id={`days-per-week-${worker.id}`}
              type="number"
              min="0"
              max="6"
              step="0.5"
              value={worker.daysPerWeek}
              onChange={handleDaysPerWeekChange}
              className="days-per-week-input"
              aria-label="Days per week"
            />
          </div>

          {/* Total Uplift Percentage */}
          <div className="total-uplift-container">
            <div className="form-label">
              Total Uplift
            </div>
            <div className="total-uplift-value">
              {totalUpliftPercentage.toFixed(1)}%
            </div>
          </div>

          {/* Gross Salary Display */}
          <div className="gross-salary-container">
            <div className="form-label">
              Gross Salary
            </div>
            <div className="gross-salary-value">
              {formatCurrencyNoDecimals(Math.round(grossSalary))}
            </div>
          </div>
        </div>

        {/* Collapsible Uplifts Section */}
        <Collapsible.Root
          className="worker-uplifts-collapsible"
          open={isUpliftOpen}
          onOpenChange={setIsUpliftOpen}
        >
          <Collapsible.Trigger asChild>
            <button className="worker-uplifts-trigger">
              <ChevronIcon className={`worker-uplifts-chevron ${isUpliftOpen ? 'open' : ''}`} />
              <span className="form-label">Uplifts</span>
            </button>
          </Collapsible.Trigger>

          <Collapsible.Content className="worker-uplifts-content">
            {/* Check if there are any valid uplifts to display */}
            {uplifts.filter(uplift => uplift.title && uplift.percentage).length === 0 ? (
              <div className="no-uplifts-message">No uplifts added yet.</div>
            ) : (
              uplifts.map(uplift => {
                if (!uplift.title || !uplift.percentage) return null;

                const isChecked = isUpliftSelected(uplift.id);
                const { multiplier, extraPercentage } = getUpliftData(uplift.id);
                const totalUplift = getTotalUplift(uplift.id);

                return (
                  <div
                    key={uplift.id}
                    className="worker-uplift-row"
                    data-indent-level={uplift.indentLevel || 0}
                  >
                    <div className="worker-uplift-checkbox">
                      <Checkbox.Root
                        className="checkbox-root"
                        checked={isChecked}
                        onCheckedChange={() => handleUpliftToggle(uplift.id)}
                        id={`worker-${worker.id}-uplift-${uplift.id}`}
                        aria-label={`Apply ${uplift.title} to ${worker.name || 'this worker'}`}
                      >
                        <Checkbox.Indicator className="checkbox-indicator">
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                      <label className="checkbox-label" htmlFor={`worker-${worker.id}-uplift-${uplift.id}`}>
                        {uplift.title}
                      </label>
                    </div>

                    {/* Always show the controls, regardless of isChecked */}
                    <div className="worker-uplift-multiplier" style={{ display: isChecked ? 'flex' : 'none' }}>
                      <label htmlFor={`worker-${worker.id}-uplift-${uplift.id}-multiplier`} className="form-label">
                        Multiplier
                      </label>
                      <div className="input-with-suffix">
                        <input
                          id={`worker-${worker.id}-uplift-${uplift.id}-multiplier`}
                          type="number"
                          min="1"
                          step="1"
                          value={multiplier}
                          onChange={(e) => handleUpliftMultiplierChange(uplift.id, e.target.value)}
                          className="multiplier-input"
                          aria-label={`Multiplier for ${uplift.title}`}
                        />
                        <span className="input-suffix">×</span>
                      </div>
                    </div>

                    <div className="worker-uplift-extra" style={{ display: isChecked ? 'flex' : 'none' }}>
                      <label htmlFor={`worker-${worker.id}-uplift-${uplift.id}-extra`} className="form-label">
                        Additional
                      </label>
                      <div className="input-with-suffix">
                        <input
                          id={`worker-${worker.id}-uplift-${uplift.id}-extra`}
                          type="number"
                          step="0.5"
                          value={extraPercentage}
                          onChange={(e) => handleUpliftExtraPercentageChange(uplift.id, e.target.value)}
                          className="extra-input"
                          aria-label={`Extra percentage for ${uplift.title}`}
                        />
                        <span className="input-suffix">%</span>
                      </div>
                    </div>

                    <div className="worker-uplift-total" style={{ display: isChecked ? 'flex' : 'none' }}>
                      <span className="form-label">Uplift Total</span>
                      <span className="total-value">{totalUplift.toFixed(1)}%</span>
                    </div>
                  </div>
                );
              })
            )}
          </Collapsible.Content>
        </Collapsible.Root>
      </div>

      {/* Delete button */}
      {deleteButton}
    </div>
  );
};
