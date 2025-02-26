import { usePayCalculator } from '../context/PayCalculatorContext';
import { useMemo } from 'react';
import { calculateWorkerCosts, formatCurrency } from '../services/PayCalculatorService';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { tooltipContent } from '../data/tooltip-content';
import { CalculationFeedback } from './CalculationFeedback';
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

  // Use the PayCalculator service to perform calculations
  const { workerCalculations, totals, hasValidData } = useMemo(() => {
    return calculateWorkerCosts({
      salary,
      workers,
      uplifts,
      pensionContribution,
      pensionBasis,
      taxYear
    });
  }, [salary, workers, uplifts, pensionContribution, pensionBasis, taxYear]);

  if (!hasValidData) {
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
      <section className="calculations-section">
        <h2 id="calculations-heading" className="sr-only">Calculation Results</h2>
        <div className="calculations-container">
          {/* Worker calculations */}
          <div className="worker-calculations">
            {workerCalculations.map(worker => (
              <div
                key={worker.id}
                className="worker-calculation"
                aria-labelledby={`worker-heading-${worker.id}`}
              >
                <h3 id={`worker-heading-${worker.id}`}>{worker.name}</h3>

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
                  <span>
                    Employer NI
                    <Tooltip content={tooltipContent.employerNI}>
                      <InfoIcon />
                    </Tooltip>
                  </span>
                  <span>{formatCurrency(worker.employerNI)}</span>
                </div>

                <div className="calculation-row">
                  <span>
                    Employer Pension
                    <Tooltip content={tooltipContent.pensionContribution}>
                      <InfoIcon />
                    </Tooltip>
                  </span>
                  <span>{formatCurrency(worker.pensionAmount)}</span>
                </div>

                <CalculationFeedback value={worker.totalCost} className="calculation-row total">
                  <span>Total Cost</span>
                  <span>{formatCurrency(worker.totalCost)}</span>
                </CalculationFeedback>
              </div>
            ))}
          </div>

          {/* Grand totals */}
          {totals && (
            <div className="grand-totals" aria-labelledby="grand-totals-heading">
              <h3 id="grand-totals-heading">Grand Totals</h3>

              <div className="calculation-row">
                <span>Total Salaries</span>
                <span>{formatCurrency(totals.totalSalary)}</span>
              </div>

              <div className="calculation-row">
                <span>
                  Total Employer NI
                  <Tooltip content={tooltipContent.employerNI}>
                    <InfoIcon />
                  </Tooltip>
                </span>
                <span>{formatCurrency(totals.totalEmployerNI)}</span>
              </div>

              <div className="calculation-row">
                <span>
                  Total Employer Pension
                  <Tooltip content={tooltipContent.pensionContribution}>
                    <InfoIcon />
                  </Tooltip>
                </span>
                <span>{formatCurrency(totals.totalPension)}</span>
              </div>

              <CalculationFeedback value={totals.grandTotal} className="calculation-row grand-total">
                <span>Grand Total</span>
                <span>{formatCurrency(totals.grandTotal)}</span>
              </CalculationFeedback>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
