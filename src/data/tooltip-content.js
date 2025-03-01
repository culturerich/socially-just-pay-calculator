/**
 * Tooltip content for various concepts in the Pay Calculator
 */

export const tooltipContent = {
  // Basic Details section
  taxYear: "The tax year for which calculations are being made. This affects National Insurance thresholds.",

  baseSalary: "The base annual salary before any uplifts are applied.",

  pensionContribution: "The percentage of salary that the employer contributes to the worker's pension.",

  pensionBasis: {
    title: "Pension Basis",
    gross: "Pension calculated as a percentage of the full salary including uplifts.",
    net: "Pension calculated as a percentage of the salary minus employer NI contributions."
  },

  // Uplifts section
  uplifts: "Uplifts are additional percentages added to the base salary based on specific needs or circumstances.",

  multiplier: "When enabled, the uplift percentage is applied to the current salary including previous uplifts. When disabled, it's applied to the base salary only.",

  // Workers section
  niCategories: {
    A: "Standard rate for most employees.",
    H: "Apprentices under 25 - employers don't pay National Insurance contributions.",
    B: "Married women and widows entitled to pay reduced National Insurance.",
    C: "Employees over the State Pension age.",
    J: "Employees who can defer National Insurance because they're already paying it in another job.",
    M: "Employees under 21 - employers don't pay National Insurance contributions."
  },

  // Calculations section
  employerNI: "National Insurance contributions that employers must pay for their employees. The rate varies based on the employee's NI category and salary.",

  niThresholds: {
    lower: "The Lower Earnings Limit (LEL). Employers start paying NI contributions on earnings above this threshold.",
    upper: "The Upper Earnings Limit (UEL). Different NI rates may apply to earnings above this threshold."
  }
};
