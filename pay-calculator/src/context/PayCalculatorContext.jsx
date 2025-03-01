import { createContext, useContext, useState } from 'react';

const PayCalculatorContext = createContext(null);

export const usePayCalculator = () => {
  const context = useContext(PayCalculatorContext);
  if (!context) {
    throw new Error('usePayCalculator must be used within a PayCalculatorProvider');
  }
  return context;
};

export const PayCalculatorProvider = ({ children }) => {
  const [salary, setSalary] = useState('');
  const [currency, setCurrency] = useState('GBP');
  const [pensionContribution, setPensionContribution] = useState('');
  const [pensionBasis, setPensionBasis] = useState('gross');
  const [taxYear, setTaxYear] = useState('2024-25');
  const [uplifts, setUplifts] = useState([
    { id: '1', title: '', percentage: '', indentLevel: 0 },
    { id: '2', title: '', percentage: '', indentLevel: 0 }
  ]);
  const [workers, setWorkers] = useState([
    {
      id: crypto.randomUUID(),
      name: '',
      niCategory: 'A',
      daysPerWeek: 0,
      selectedUplifts: []
    },
    {
      id: crypto.randomUUID(),
      name: '',
      niCategory: 'A',
      daysPerWeek: 0,
      selectedUplifts: []
    }
  ]);

  const value = {
    salary,
    setSalary,
    currency,
    setCurrency,
    pensionContribution,
    setPensionContribution,
    pensionBasis,
    setPensionBasis,
    taxYear,
    setTaxYear,
    uplifts,
    setUplifts,
    workers,
    setWorkers
  };

  return (
    <PayCalculatorContext.Provider value={value}>
      {children}
    </PayCalculatorContext.Provider>
  );
};
