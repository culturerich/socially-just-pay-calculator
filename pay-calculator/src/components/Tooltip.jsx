import { useState, useRef } from 'react';
import './Tooltip.css';

/**
 * Tooltip component for displaying explanatory information
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - The element that triggers the tooltip
 * @param {string} props.content - The tooltip content
 * @param {string} [props.position='top'] - Tooltip position (top, bottom, left, right)
 * @param {string} [props.className] - Additional CSS class names
 */
export const Tooltip = ({
  children,
  content,
  position = 'top',
  className = ''
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef(null);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <div
      className={`tooltip-container ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {isVisible && (
        <div
          className={`tooltip tooltip-${position}`}
          ref={tooltipRef}
          role="tooltip"
        >
          {content}
          <div className="tooltip-arrow"></div>
        </div>
      )}
    </div>
  );
};
