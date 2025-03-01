/**
 * PayCalculator Service
 *
 * This service handles all calculation logic for the Pay Calculator application,
 * separating business logic from UI components.
 */

import niCategoriesData from '../data/ni-categories.json';
import taxYearsData from '../data/tax-years.json';

/**
 * Formats a number as GBP currency with 2 decimal places
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Formats a number as GBP currency without decimal places
 * @param {number} amount - The amount to format
 * @returns {string} Formatted currency string without decimal places
 */
export const formatCurrencyNoDecimals = (amount) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Calculates the total uplift percentage for a worker
 * @param {Array} selectedUplifts - Array of selected uplifts (either strings or objects with id, multiplier, extraPercentage)
 * @param {Array} uplifts - Array of all available uplifts
 * @returns {number} Total uplift percentage
 */
export const calculateTotalUpliftPercentage = (selectedUplifts, uplifts) => {
  if (!selectedUplifts.length) return 0;

  return selectedUplifts.reduce((total, upliftData) => {
    // If it's just an ID (old format), find the uplift and use its percentage
    if (typeof upliftData === 'string') {
      const uplift = uplifts.find(u => u.id === upliftData);
      if (uplift && uplift.percentage) {
        return total + parseFloat(uplift.percentage);
      }
      return total;
    }

    // If it's an object with id, multiplier, and extraPercentage (new format)
    const uplift = uplifts.find(u => u.id === upliftData.id);
    if (uplift && uplift.percentage) {
      const basePercentage = parseFloat(uplift.percentage);
      const multiplier = upliftData.multiplier || 1;
      const extraPercentage = upliftData.extraPercentage || 0;
      return total + (basePercentage * multiplier) + extraPercentage;
    }

    return total;
  }, 0);
};

/**
 * Calculates the total uplift for a specific uplift
 * @param {string} upliftId - ID of the uplift
 * @param {Array} uplifts - Array of all available uplifts
 * @param {Object} upliftData - Object containing multiplier and extraPercentage
 * @returns {number} Total uplift percentage for the specific uplift
 */
export const calculateTotalUplift = (upliftId, uplifts, upliftData) => {
  const uplift = uplifts.find(u => u.id === upliftId);
  if (!uplift || !uplift.percentage) return 0;

  const basePercentage = parseFloat(uplift.percentage);
  const multiplier = upliftData.multiplier || 1;
  const extraPercentage = upliftData.extraPercentage || 0;

  return (basePercentage * multiplier) + extraPercentage;
};

/**
 * Calculates the gross salary for a worker
 * @param {number} baseSalary - Base salary
 * @param {number} totalUpliftPercentage - Total uplift percentage
 * @param {number} daysPerWeek - Number of days worked per week
 * @returns {number} Gross salary
 */
export const calculateGrossSalary = (baseSalary, totalUpliftPercentage, daysPerWeek) => {
  if (!baseSalary) return 0;

  const upliftMultiplier = 1 + (totalUpliftPercentage / 100);
  const daysAdjustment = daysPerWeek / 5;

  return baseSalary * upliftMultiplier * daysAdjustment;
};

/**
 * Calculates worker costs including uplifts, NI contributions, and pension
 * @param {Object} params - Calculation parameters
 * @param {string} params.salary - Base salary
 * @param {Array} params.workers - Worker data
 * @param {Array} params.uplifts - Available uplifts
 * @param {string} params.pensionContribution - Pension contribution percentage
 * @param {string} params.pensionBasis - Pension calculation basis ('gross' or 'net')
 * @param {string} params.taxYear - Selected tax year
 * @returns {Object} Calculation results including worker calculations and totals
 */
export const calculateWorkerCosts = ({
  salary,
  workers,
  uplifts,
  pensionContribution,
  pensionBasis,
  taxYear
}) => {
  // Return empty results if required data is missing
  if (!salary || isNaN(parseFloat(salary)) || workers.length === 0) {
    return {
      workerCalculations: [],
      totals: null,
      hasValidData: false
    };
  }

  const baseSalary = parseFloat(salary);

  // Calculate costs for each worker
  const workerCalculations = workers.map(worker => {
    // Calculate uplifts
    let workerSalary = baseSalary;
    let appliedUplifts = [];

    // Process selected uplifts
    const processedUplifts = worker.selectedUplifts
      .map(upliftData => {
        // Handle both string format (old) and object format (new)
        const upliftId = typeof upliftData === 'string' ? upliftData : upliftData.id;
        const uplift = uplifts.find(u => u.id === upliftId);

        if (!uplift || !uplift.percentage || isNaN(parseFloat(uplift.percentage))) {
          return null;
        }

        // Get multiplier and extra percentage (defaults if using old format)
        const multiplier = typeof upliftData === 'string' ? 1 : (upliftData.multiplier || 1);
        const extraPercentage = typeof upliftData === 'string' ? 0 : (upliftData.extraPercentage || 0);

        return {
          uplift,
          multiplier,
          extraPercentage,
          order: uplifts.findIndex(u => u.id === upliftId)
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.order - b.order);

    // Apply each uplift
    processedUplifts.forEach(({ uplift, multiplier, extraPercentage }) => {
      const basePercentage = parseFloat(uplift.percentage);
      const totalPercentage = (basePercentage * multiplier) + extraPercentage;
      const upliftAmount = baseSalary * (totalPercentage / 100);

      workerSalary += upliftAmount;

      appliedUplifts.push({
        title: uplift.title || 'Untitled uplift',
        percentage: totalPercentage,
        basePercentage,
        multiplier,
        extraPercentage,
        amount: upliftAmount,
        isMultiplier: multiplier > 1 || extraPercentage > 0
      });
    });

    // Apply days per week adjustment if present
    if (worker.daysPerWeek && worker.daysPerWeek !== 5) {
      const daysAdjustment = worker.daysPerWeek / 5;
      workerSalary = workerSalary * daysAdjustment;

      // Adjust uplift amounts for days per week
      appliedUplifts = appliedUplifts.map(uplift => ({
        ...uplift,
        amount: uplift.amount * daysAdjustment
      }));
    }

    // Calculate employer NI contribution
    const employerNI = calculateEmployerNI({
      salary: workerSalary,
      niCategory: worker.niCategory,
      taxYear
    });

    // Calculate pension contribution
    const pensionAmount = calculatePensionContribution({
      salary: workerSalary,
      employerNI,
      pensionContribution,
      pensionBasis
    });

    // Calculate total cost
    const totalCost = workerSalary + employerNI + pensionAmount;

    return {
      id: worker.id,
      name: worker.name || 'Unnamed worker',
      baseSalary,
      uplifts: appliedUplifts,
      salaryWithUplifts: workerSalary,
      employerNI,
      pensionAmount,
      totalCost
    };
  });

  // Calculate grand totals
  const totals = {
    totalSalary: workerCalculations.reduce((sum, worker) => sum + worker.salaryWithUplifts, 0),
    totalEmployerNI: workerCalculations.reduce((sum, worker) => sum + worker.employerNI, 0),
    totalPension: workerCalculations.reduce((sum, worker) => sum + worker.pensionAmount, 0),
    grandTotal: workerCalculations.reduce((sum, worker) => sum + worker.totalCost, 0)
  };

  return {
    workerCalculations,
    totals,
    hasValidData: true
  };
};

/**
 * Calculates employer National Insurance contributions
 * @param {Object} params - Calculation parameters
 * @param {number} params.salary - Worker's salary with uplifts
 * @param {string} params.niCategory - NI category code
 * @param {string} params.taxYear - Selected tax year
 * @returns {number} Employer NI contribution amount
 */
export const calculateEmployerNI = ({ salary, niCategory, taxYear }) => {
  if (!niCategory) return 0;

  const category = niCategoriesData[niCategory];
  const currentTaxYear = taxYearsData[taxYear];

  if (!category || !currentTaxYear) return 0;

  const employerRate = category.employerRate;
  const lowerThreshold = currentTaxYear.niThresholds.lower * 52; // Annual lower threshold
  const upperThreshold = currentTaxYear.niThresholds.upper * 52; // Annual upper threshold

  // Calculate NI contribution on earnings above the lower threshold
  if (salary > lowerThreshold) {
    const contributableAmount = Math.min(salary, upperThreshold) - lowerThreshold;
    return contributableAmount * (employerRate / 100);
  }

  return 0;
};

/**
 * Calculates employer pension contribution
 * @param {Object} params - Calculation parameters
 * @param {number} params.salary - Worker's salary with uplifts
 * @param {number} params.employerNI - Employer NI contribution
 * @param {string} params.pensionContribution - Pension contribution percentage
 * @param {string} params.pensionBasis - Pension calculation basis ('gross' or 'net')
 * @returns {number} Employer pension contribution amount
 */
export const calculatePensionContribution = ({
  salary,
  employerNI,
  pensionContribution,
  pensionBasis
}) => {
  if (!pensionContribution || isNaN(parseFloat(pensionContribution))) return 0;

  const pensionRate = parseFloat(pensionContribution) / 100;

  return pensionBasis === 'gross'
    ? salary * pensionRate
    : (salary - employerNI) * pensionRate;
};
