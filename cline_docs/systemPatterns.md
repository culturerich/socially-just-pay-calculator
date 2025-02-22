# System Patterns

## Architecture Overview
The system follows a component-based architecture using React with the following key patterns:

### State Management
- React Context for global state
- LocalStorage for data persistence
- Memoization for performance optimization

### Component Structure
1. **App Root**
   - Global state management
   - Layout structure
   - LocalStorage integration

2. **Core Sections**
   - BasicDetails: Core salary and pension inputs
   - UpliftManager: Manages salary uplift calculations
   - WorkerManager: Handles worker-specific configurations
   - TotalCalculations: Aggregates all calculations

### Data Flow
1. User inputs → React state
2. State changes trigger calculations
3. Results update UI and persist to storage
4. Export functionality transforms data for external use

## Key Technical Decisions
1. **UI Framework**: React + Radix UI
   - Ensures accessibility
   - Provides unstyled, customizable components
   - Handles complex ARIA attributes

2. **Calculation Layer**
   - Dedicated PayCalculator service
   - Pure JavaScript for calculations
   - Memoization for complex operations

3. **Data Persistence**
   - LocalStorage for state
   - Dedicated StorageService
   - JSON-based configuration files

4. **Export Capabilities**
   - SheetJS integration
   - CSV and Google Sheets support
   - Formula generation

## Performance Patterns
1. **Optimization Techniques**
   - React.memo for pure components
   - Debounced user inputs
   - Lazy loaded exports
   - Memoized calculations

2. **Error Handling**
   - HTML5 validation
   - Graceful fallbacks
   - Clear error messaging
   - Input validation

## Data Sources
- tax-years.json: Tax year configurations
- ni-categories.json: NI rates and categories
