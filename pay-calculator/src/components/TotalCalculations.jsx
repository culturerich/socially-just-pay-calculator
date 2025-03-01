import { usePayCalculator } from '../context/PayCalculatorContext';
import { useMemo, useState } from 'react';
import { calculateWorkerCosts, formatCurrency } from '../services/PayCalculatorService';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { ChevronIcon } from './icons/ChevronIcon';
import { tooltipContent } from '../data/tooltip-content';
import { CalculationFeedback } from './CalculationFeedback';
import * as Collapsible from '@radix-ui/react-collapsible';
import './TotalCalculations.css';

export const TotalCalculations = () => {
  // State to track which worker calculations are expanded
  const [expandedWorkers, setExpandedWorkers] = useState({});

  // Toggle worker calculation expansion
  const toggleWorkerExpansion = (workerId) => {
    setExpandedWorkers(prev => ({
      ...prev,
      [workerId]: !prev[workerId]
    }));
  };
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

  // Create default empty data if no valid data exists
  const emptyWorkerCalculations = !hasValidData && workers.length > 0 ? workers.map(worker => ({
    id: worker.id,
    name: worker.name || 'Unnamed worker',
    baseSalary: 0,
    salaryWithUplifts: 0,
    employerNI: 0,
    pensionAmount: 0,
    totalCost: 0,
    uplifts: []
  })) : [];

  const emptyTotals = !hasValidData ? {
    totalSalary: 0,
    totalEmployerNI: 0,
    totalPension: 0,
    grandTotal: 0
  } : null;

  // Use either the calculated data or empty data
  const displayWorkerCalculations = hasValidData ? workerCalculations : emptyWorkerCalculations;
  const displayTotals = hasValidData ? totals : emptyTotals;

  return (
    <>
      <section className="calculations-section" data-section="calculations">
        <h2 id="calculations-heading" className="sr-only">Calculation Results</h2>
        <div className="calculations-container">
          {/* Grand totals with integrated worker calculations */}
          {(displayTotals || workers.length > 0) && (
            <div className="grand-totals" aria-labelledby="grand-totals-heading">

              {/* Worker calculations integrated into grand totals */}
              {displayWorkerCalculations.map(worker => (
                <Collapsible.Root
                  key={worker.id}
                  className="worker-calculation-collapsible"
                  open={expandedWorkers[worker.id]}
                  onOpenChange={() => toggleWorkerExpansion(worker.id)}
                >
                  <div className="worker-calculation-header">
                    <Collapsible.Trigger asChild>
                      <button className="worker-calculation-trigger">
                        <ChevronIcon className={`worker-calculation-chevron ${expandedWorkers[worker.id] ? 'open' : ''}`} />
                        <span id={`worker-heading-${worker.id}`}>{worker.name}</span>
                      </button>
                    </Collapsible.Trigger>
                    <span className="worker-total-cost">{formatCurrency(worker.totalCost)}</span>
                  </div>

                  <Collapsible.Content className="worker-calculation-content">
                    <div className="calculation-row">
                      <span>Base Salary</span>
                      <span>{formatCurrency(worker.baseSalary)}</span>
                    </div>

                    {worker.uplifts.map((uplift, index) => (
                      <div key={index} className="calculation-row total-uplift-row">
                        <span>
                          {uplift.title} ({uplift.percentage.toFixed(2)}%
                          {uplift.isMultiplier ?
                            ` (${uplift.basePercentage}% × ${uplift.multiplier}${uplift.extraPercentage > 0 ? ` + ${uplift.extraPercentage}%` : ''})`
                            : ''}
                          )
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
                      <span>Total Worker Cost</span>
                      <span>{formatCurrency(worker.totalCost)}</span>
                    </CalculationFeedback>
                  </Collapsible.Content>
                </Collapsible.Root>
              ))}

              {/* Summary totals */}
              {displayTotals && (
                <div className="summary-totals">
                  <div className="calculation-row">
                    <span>Total Salaries</span>
                    <span>{formatCurrency(displayTotals.totalSalary)}</span>
                  </div>

                  <div className="calculation-row">
                    <span>
                      Total Employer NI
                      <Tooltip content={tooltipContent.employerNI}>
                        <InfoIcon />
                      </Tooltip>
                    </span>
                    <span>{formatCurrency(displayTotals.totalEmployerNI)}</span>
                  </div>

                  <div className="calculation-row">
                    <span>
                      Total Employer Pension
                      <Tooltip content={tooltipContent.pensionContribution}>
                        <InfoIcon />
                      </Tooltip>
                    </span>
                    <span>{formatCurrency(displayTotals.totalPension)}</span>
                  </div>

                  <CalculationFeedback value={displayTotals.grandTotal} className="calculation-row grand-total">
                    <span>Total Costs</span>
                    <span>{formatCurrency(displayTotals.grandTotal)}</span>
                  </CalculationFeedback>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
};
