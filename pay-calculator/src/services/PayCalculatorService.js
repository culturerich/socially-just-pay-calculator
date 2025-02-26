/**
 * PayCalculator Service
 *
 * This service handles all calculation logic for the Pay Calculator application,
 * separating business logic from UI components.
 */

import niCategoriesData from '../data/ni-categories.json';
import taxYearsData from '../data/tax-years.json';

/**
 * Formats a number as GBP currency
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

    // Sort uplifts by their order in the uplifts array to ensure consistent application
    const sortedUplifts = worker.selectedUplifts
      .map(id => uplifts.find(u => u.id === id))
      .filter(Boolean)
      .sort((a, b) => {
        return uplifts.findIndex(u => u.id === a.id) - uplifts.findIndex(u => u.id === b.id);
      });

    // Apply each uplift
    sortedUplifts.forEach(uplift => {
      if (!uplift.percentage || isNaN(parseFloat(uplift.percentage))) return;

      const percentage = parseFloat(uplift.percentage);
      const upliftAmount = uplift.multiplier
        ? workerSalary * (percentage / 100)
        : baseSalary * (percentage / 100);

      workerSalary += upliftAmount;

      appliedUplifts.push({
        title: uplift.title || 'Untitled uplift',
        percentage,
        amount: upliftAmount,
        isMultiplier: uplift.multiplier
      });
    });

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
