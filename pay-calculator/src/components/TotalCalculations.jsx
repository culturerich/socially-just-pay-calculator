import { usePayCalculator } from '../context/PayCalculatorContext';

export const TotalCalculations = () => {
  const {
    salary,
    workers,
    uplifts,
    pensionContribution,
    pensionBasis
  } = usePayCalculator();

  return (
    <section>
      <div>
        {/* TODO: Implement calculation displays */}
        <p>Placeholder for total calculations display</p>
      </div>
    </section>
  );
};
