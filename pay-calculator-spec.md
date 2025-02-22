# UK Pay Calculator - Technical Specification

## Overview
A web-based calculator for computing needs-based pay, including uplifts, pension contributions, and employer costs.

## Technical Stack
- React for component architecture
- Radix UI primitives for accessible, unstyled components
- Plain JavaScript for calculations
- SheetJS for CSV/Google Sheets export
- LocalStorage for data persistence

## Data Sources
Two separate JSON files:
1. `tax-years.json`: Tax years with associated rates and thresholds
   ```json
   {
     "2024-25": {
       "niThresholds": {
         "lower": 242,
         "upper": 967
       }
     }
   }
   ```

2. `ni-categories.json`: NI rates for different worker types
   ```json
   {
     "A": {
       "name": "Standard",
       "employerRate": 13.8,
       "description": "Most employees"
     },
     "H": {
       "name": "Apprentice under 25",
       "employerRate": 0,
       "description": "Apprentices under 25"
     }
   }
   ```

## Component Structure

### App Root
- Global state management using React Context
- LocalStorage integration for persistence
- Main layout structure

### Section 1: Basics
```jsx
<BasicDetails>
  - Salary input (number, required)
  - Currency selector (defaulting to GBP)
  - Pension contribution input (number, percentage)
  - Pension calculation basis selector
  - Tax year selector (populated from tax-years.json)
</BasicDetails>
```

### Section 2: Uplifts
```jsx
<UpliftManager>
  - Array of <UpliftRow> components
  - Add/remove/reorder functionality
  - Each row contains:
    - Title input
    - Percentage input
    - Multiplier checkbox
  - Default: Two pre-populated rows
</UpliftManager>
```

### Section 3: Workers
```jsx
<WorkerManager>
  - Array of <WorkerRow> components
  - Each row contains:
    - Name input
    - NI category selector
    - Uplift selector (multi-select)
    - Uplift multiplier inputs
    - Calculated total salary
</WorkerManager>
```

### Section 4: Totals
```jsx
<TotalCalculations>
  - Base salary total
  - Uplift amounts total
  - Pension contributions total
  - NI contributions total
  - Total wage bill
</TotalCalculations>
```

## Calculation Service
```javascript
class PayCalculator {
  // Core calculation methods
  calculateUpliftTotal(baseSalary, uplifts) {}
  calculatePension(salary, percentage, basis) {}
  calculateNIContributions(salary, category) {}
  
  // Helper methods
  applyPercentages(base, percentages) {}
  calculateEmployerCosts(salary, pension, ni) {}
}
```

## Export Service
```javascript
class ExportService {
  // Export methods
  toCSV(data) {}
  toGoogleSheets(data) {}
  
  // Formula generation
  generateSalaryFormulas() {}
  generateCostFormulas() {}
}
```

## Accessibility Features
- Use semantic HTML elements (forms, tables, lists)
- Radix UI handles ARIA attributes for complex interactions
- Clear labeling and descriptions
- Keyboard navigation support
- Error messages linked to inputs

## Data Persistence
```javascript
class StorageService {
  saveToLocalStorage(data) {}
  loadFromLocalStorage() {}
  clearStorage() {}
}
```

## Performance Considerations
- Memoize complex calculations
- Debounce user inputs
- Lazy load export functionality
- Use React.memo for pure components

## Error Handling
- Form validation using native HTML5 validation where possible
- Required field validation for base salary and worker names
- Clear error messages
- Graceful fallbacks for calculation edge cases

## Future Considerations
- Style system integration
- Additional export formats
- API integration for live rates
- Tax and take-home pay calculations
