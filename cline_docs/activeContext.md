# Active Context

## Current Focus

Completing remaining enhancements to the Pay Calculator application:

1. Adding a notes section to the application
2. Extracting calculation logic to a dedicated service
3. Implementing data persistence with LocalStorage
4. Adding export functionality

## Recent Changes

- Changed the default value for daysPerWeek from 5 to 0 in both PayCalculatorContext.jsx and WorkerManager.jsx
- Added visual cues for selected uplifts in WorkerRow component:
  - Left border indicator for selected uplifts
  - Bold text and accent color for selected uplift titles
- Improved indentation display in WorkerRow uplift section
- Completed all core component implementations
- Marked all uplift and worker calculations as complete

## Current Task

Completing remaining enhancements:

- Add a notes section at the end of the application
- Extract calculation logic from components to a dedicated PayCalculator service
- Implement form validation for the new input fields

## Next Steps

1. Create the Notes component with the required information
2. Extract calculation logic from components to a dedicated PayCalculator service
3. Implement form validation for the new input fields
4. Test all new functionality thoroughly
5. After completing these enhancements:
   - Add StorageService for data persistence with LocalStorage
   - Implement ExportService for CSV and Google Sheets export
   - Add unit tests for critical functionality

## Implementation Notes

- The Notes component should include information about:
  - Gross figure not including employer pension contributions
  - Uplift rows being draggable into a two-level hierarchy
- The PayCalculator service should:
  - Centralize all calculation logic currently in components
  - Handle worker calculations with uplifts, NI, and pension
  - Support days-per-week pro-rata calculations
  - Provide consistent currency formatting
- Form validation should be added for:
  - Numeric inputs (salary, percentages, multipliers)
  - Required fields

## Questions to Address

- How to structure the PayCalculator service
- Best approach for implementing the export functionality
- How to handle currency formatting consistently

## Current Blockers

None - ready to proceed with improvements
