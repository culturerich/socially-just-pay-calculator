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
     * Two-column responsive layout
     * Grouped related inputs
     * Optimized currency selector
     * Form validation
   - UpliftManager: Manages salary uplift calculations
     * Dynamic row management
     * Individual uplift controls
     * Multiplier functionality
     * Full-width uplift rows
     * Drag and drop reordering
   - WorkerManager: Handles worker-specific configurations
     * Default workers setup
     * NI category selection
     * Uplift checkbox integration
     * Drag and drop reordering
   - TotalCalculations: Aggregates all calculations
     * Clear section headings
     * Organized data display

3. **Layout Patterns**
   - CSS Grid for major layouts
   - Flexbox for component internals
   - Mobile-first responsive design
   - Consistent spacing using CSS variables
   - Section styling patterns:
     * Headers and descriptions outside boxes
     * Consistent padding and borders
     * Standardized drag handles with dots grid
     * Uniform button styles with icons
     * Full-width input rows for better space utilization

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
   - Custom styled form controls
   - Responsive select components
   - Consistent drag and drop functionality

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
