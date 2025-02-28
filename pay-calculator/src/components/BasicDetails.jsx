import { usePayCalculator } from '../context/PayCalculatorContext';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import { useEffect, useState } from 'react';
import { ChevronIcon } from './icons/ChevronIcon';
import { Tooltip } from './Tooltip';
import { InfoIcon } from './icons/InfoIcon';
import { tooltipContent } from '../data/tooltip-content';
import './BasicDetails.css';

export const BasicDetails = () => {
  const [pensionError, setPensionError] = useState('');
  const {
    salary,
    setSalary,
    currency,
    setCurrency,
    pensionContribution,
    setPensionContribution,
    pensionBasis,
    setPensionBasis,
    taxYear,
    setTaxYear
  } = usePayCalculator();

  const [taxYears, setTaxYears] = useState([]);

  useEffect(() => {
    // Load tax years data
    const loadTaxYears = async () => {
      try {
        const data = await import('../data/tax-years.json');
        setTaxYears(Object.keys(data.default));
      } catch (error) {
        console.error('Failed to load tax years:', error);
      }
    };
    loadTaxYears();
  }, []);

  return (
    <section className="basic-details-section" data-section="basics">
        <h2 id="basic-details-heading" className="sr-only">Basic Details</h2>
        <Form.Root className="basic-details-form">
        {/* Column 1 */}
        <div>
          <Form.Field className="form-field" name="salary">
            <Form.Label className="form-label">
              Base Annual Salary
              <Tooltip content={tooltipContent.baseSalary}>
                <InfoIcon />
              </Tooltip>
            </Form.Label>
            <Form.Control asChild>
              <div className="form-control">
                <Select.Root value={currency} onValueChange={setCurrency}>
                  <Select.Trigger className="select-trigger currency-select" aria-label="Currency">
                    <Select.Value>{currency}</Select.Value>
                    <ChevronIcon />
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content className="select-content" position="popper" data-section="basics">
                      <Select.Viewport className="select-viewport">
                        <Select.Item className="select-item" value="GBP">
                          <Select.ItemText>GBP</Select.ItemText>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
                <input
                  type="number"
                  className="form-input"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g. 36000"
                  required
                  min="0"
                  step="1000"
                  aria-describedby="salary-error"
                />
              </div>
            </Form.Control>
            <Form.Message className="form-message" match="valueMissing">
              Please enter a salary
            </Form.Message>
            <Form.Message className="form-message" match="typeMismatch">
              Please enter a valid number
            </Form.Message>
          </Form.Field>

          <Form.Field className="form-field" name="taxYear">
            <Form.Label className="form-label">
              UK Tax Year
              <Tooltip content={tooltipContent.taxYear}>
                <InfoIcon />
              </Tooltip>
            </Form.Label>
            <Form.Control asChild>
              <Select.Root value={taxYear} onValueChange={setTaxYear}>
                <Select.Trigger className="select-trigger" aria-label="Tax Year">
                  <Select.Value>{taxYear}</Select.Value>
                  <ChevronIcon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="select-content" data-section="basics">
                    <Select.Viewport className="select-viewport">
                      {taxYears.map((year) => (
                        <Select.Item
                          key={year}
                          className="select-item"
                          value={year}
                        >
                          <Select.ItemText>{year}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Control>
          </Form.Field>
        </div>

        {/* Column 2 */}
        <div>
          <Form.Field className="form-field" name="pension">
            <Form.Label className="form-label">
              Employer Pension Contribution %
              <Tooltip content={tooltipContent.pensionContribution}>
                <InfoIcon />
              </Tooltip>
            </Form.Label>
            <Form.Control asChild>
              <div className="form-control">
                <div className="input-with-suffix">
                  <input
                    type="number"
                    className={`form-input ${pensionError ? 'input-error' : ''}`}
                    value={pensionContribution}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Validate pension contribution
                      if (value && (isNaN(parseFloat(value)) || parseFloat(value) < 0)) {
                        setPensionError('Please enter a valid positive number');
                      } else if (value && parseFloat(value) > 100) {
                        setPensionError('Maximum contribution is 100%');
                      } else {
                        setPensionError('');
                      }

                      setPensionContribution(value);
                    }}
                    placeholder="e.g. 4%"
                    min="0"
                    max="100"
                    step="1"
                    aria-invalid={!!pensionError}
                    aria-describedby={pensionError ? 'pension-error' : undefined}
                    aria-label="Employer pension contribution percentage"
                  />
                  <span className="input-suffix">%</span>
                </div>
              </div>
            </Form.Control>
            {pensionError && (
              <div className="form-error-message" id="pension-error">
                {pensionError}
              </div>
            )}
          </Form.Field>

          <Form.Field className="form-field" name="pensionBasis">
            <Form.Label className="form-label">
              Pension Basis
              <Tooltip content={
                `${tooltipContent.pensionBasis.title}:
                ${pensionBasis === 'gross'
                  ? tooltipContent.pensionBasis.gross
                  : tooltipContent.pensionBasis.net}`
              }>
                <InfoIcon />
              </Tooltip>
            </Form.Label>
            <Form.Control asChild>
              <Select.Root value={pensionBasis} onValueChange={setPensionBasis}>
                <Select.Trigger className="select-trigger" aria-label="Pension Basis">
                  <Select.Value>
                    {pensionBasis === 'gross' ? 'Gross Salary' : 'Net Salary'}
                  </Select.Value>
                  <ChevronIcon />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="select-content" data-section="basics">
                    <Select.Viewport className="select-viewport">
                      <Select.Item className="select-item" value="gross">
                        <Select.ItemText>Gross Salary</Select.ItemText>
                      </Select.Item>
                      <Select.Item className="select-item" value="net">
                        <Select.ItemText>Net Salary</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </Form.Control>
          </Form.Field>
        </div>
        </Form.Root>
    </section>
  );
};
