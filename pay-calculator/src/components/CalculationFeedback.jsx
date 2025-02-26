import { useState, useEffect } from 'react';
import './CalculationFeedback.css';

/**
 * CalculationFeedback component
 *
 * This component provides visual feedback when calculations change.
 * It shows a subtle animation to indicate that values have been updated.
 *
 * @param {Object} props - Component props
 * @param {any} props.value - The value to monitor for changes
 * @param {React.ReactNode} props.children - The content to display
 * @param {string} [props.className] - Additional CSS class names
 */
export const CalculationFeedback = ({ value, children, className = '' }) => {
  const [isChanged, setIsChanged] = useState(false);
  const [prevValue, setPrevValue] = useState(value);

  useEffect(() => {
    // Check if the value has changed
    if (JSON.stringify(value) !== JSON.stringify(prevValue)) {
      // Set the changed state to trigger animation
      setIsChanged(true);

      // Update the previous value
      setPrevValue(value);

      // Reset the changed state after animation completes
      const timer = setTimeout(() => {
        setIsChanged(false);
      }, 1000); // Match this with the CSS animation duration

      return () => clearTimeout(timer);
    }
  }, [value, prevValue]);

  return (
    <div className={`calculation-feedback ${isChanged ? 'highlight' : ''} ${className}`}>
      {children}
    </div>
  );
};
