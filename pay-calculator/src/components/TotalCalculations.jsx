import { usePayCalculator } from '../context/PayCalculatorContext';
import { useMemo, useEffect, useState } from 'react';
import niCategoriesData from '../data/ni-categories.json';
import taxYearsData from '../data/tax-years.json';
import './TotalCalculations.css';

export const TotalCalculations = () => {
  const {
    salary,
    workers,
    uplifts,
    pensionContribution,
    pensionBasis,
    taxYear
  } = usePayCalculator();

  // Calculate total costs for each worker
  const workerCalculations = useMemo(() => {
    if (!salary || isNaN(parseFloat(salary))) return [];

    const baseSalary = parseFloat(salary);

    return workers.map(worker => {
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
      let employerNI = 0;
      if (worker.niCategory) {
        const category = niCategoriesData[worker.niCategory];
        const currentTaxYear = taxYearsData[taxYear];

        if (category && currentTaxYear) {
          const employerRate = category.employerRate;
          const lowerThreshold = currentTaxYear.niThresholds.lower * 52; // Annual lower threshold
          const upperThreshold = currentTaxYear.niThresholds.upper * 52; // Annual upper threshold

          // Calculate NI contribution on earnings above the lower threshold
          if (workerSalary > lowerThreshold) {
            const contributableAmount = Math.min(workerSalary, upperThreshold) - lowerThreshold;
            employerNI = contributableAmount * (employerRate / 100);
          }
        }
      }

      // Calculate pension contribution
      let pensionAmount = 0;
      if (pensionContribution && !isNaN(parseFloat(pensionContribution))) {
        const pensionRate = parseFloat(pensionContribution) / 100;
        pensionAmount = pensionBasis === 'gross'
          ? workerSalary * pensionRate
          : (workerSalary - employerNI) * pensionRate;
      }

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
  }, [salary, workers, uplifts, pensionContribution, pensionBasis, taxYear]);

  // Calculate grand totals
  const totals = useMemo(() => {
    if (workerCalculations.length === 0) return null;

    return {
      totalSalary: workerCalculations.reduce((sum, worker) => sum + worker.salaryWithUplifts, 0),
      totalEmployerNI: workerCalculations.reduce((sum, worker) => sum + worker.employerNI, 0),
      totalPension: workerCalculations.reduce((sum, worker) => sum + worker.pensionAmount, 0),
      grandTotal: workerCalculations.reduce((sum, worker) => sum + worker.totalCost, 0)
    };
  }, [workerCalculations]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!salary || isNaN(parseFloat(salary)) || workers.length === 0) {
    return (
      <>
        <section>
          <div className="empty-calculations">
            <p>No calculations to display yet</p>
            <p>Enter a base salary and configure workers to see calculations</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section>
        <div className="calculations-container">
          {/* Worker calculations */}
          <div className="worker-calculations">
            {workerCalculations.map(worker => (
              <div key={worker.id} className="worker-calculation">
                <h3>{worker.name}</h3>

                <div className="calculation-row">
                  <span>Base Salary</span>
                  <span>{formatCurrency(worker.baseSalary)}</span>
                </div>

                {worker.uplifts.map((uplift, index) => (
                  <div key={index} className="calculation-row uplift-row">
                    <span>
                      {uplift.title} ({uplift.percentage}%
                      {uplift.isMultiplier ? ' multiplier' : ''})
                    </span>
                    <span>{formatCurrency(uplift.amount)}</span>
                  </div>
                ))}

                <div className="calculation-row subtotal">
                  <span>Salary with Uplifts</span>
                  <span>{formatCurrency(worker.salaryWithUplifts)}</span>
                </div>

                <div className="calculation-row">
                  <span>Employer NI</span>
                  <span>{formatCurrency(worker.employerNI)}</span>
                </div>

                <div className="calculation-row">
                  <span>Employer Pension</span>
                  <span>{formatCurrency(worker.pensionAmount)}</span>
                </div>

                <div className="calculation-row total">
                  <span>Total Cost</span>
                  <span>{formatCurrency(worker.totalCost)}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Grand totals */}
          {totals && (
            <div className="grand-totals">
              <h3>Grand Totals</h3>

              <div className="calculation-row">
                <span>Total Salaries</span>
                <span>{formatCurrency(totals.totalSalary)}</span>
              </div>

              <div className="calculation-row">
                <span>Total Employer NI</span>
                <span>{formatCurrency(totals.totalEmployerNI)}</span>
              </div>

              <div className="calculation-row">
                <span>Total Employer Pension</span>
                <span>{formatCurrency(totals.totalPension)}</span>
              </div>

              <div className="calculation-row grand-total">
                <span>Grand Total</span>
                <span>{formatCurrency(totals.grandTotal)}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
