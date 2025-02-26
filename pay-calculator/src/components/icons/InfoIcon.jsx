/**
 * InfoIcon component for use with tooltips
 *
 * @param {Object} props - Component props
 * @param {string} [props.className] - Additional CSS class names
 */
export const InfoIcon = ({ className = '' }) => {
  return (
    <span className={`info-icon ${className}`} aria-hidden="true">
      i
    </span>
  );
};
