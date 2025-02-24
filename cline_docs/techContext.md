# Technical Context

## Core Technologies
1. **Frontend Framework**
   - React
   - JavaScript (ES6+)

2. **UI Components**
   - Radix UI primitives for accessible components
   - Semantic HTML elements
   - CSS Grid and Flexbox layouts
   - CSS Variables for theming
   - @dnd-kit/core and @dnd-kit/sortable for drag and drop
   - Standardized section patterns:
     * Consistent header placement
     * Uniform button styling
     * Drag handle components
     * Form input layouts

3. **Data Management**
   - Browser LocalStorage API
   - JSON data files
   - React Context for state

4. **Export Libraries**
   - SheetJS for spreadsheet exports

5. **Styling System**
   - CSS Variables for:
     * Colors and theming
     * Spacing and layout
     * Shadows and effects
     * Border styles and radii
     * Button and input styles
   - Mobile-first responsive design
   - Component-scoped CSS
   - Consistent section styling:
     * Headers outside content boxes
     * Full-width input rows
     * Standardized drag handles
     * Uniform button designs

## Development Setup
### Required Dependencies
```json
{
  "dependencies": {
    "react": "latest",
    "@radix-ui/react-*": "latest",
    "xlsx": "latest"
  }
}
```

### Development Tools
- Node.js and npm
- Modern web browser with LocalStorage support
- Vite development server

## Technical Constraints
1. **Browser Support**
   - Modern browsers with LocalStorage API
   - ES6+ JavaScript support
   - CSS Grid and Flexbox support
   - Requires client-side JavaScript enabled

2. **Data Limitations**
   - LocalStorage size limits (typically 5-10MB)
   - Client-side only calculations
   - No server-side persistence

3. **Performance Requirements**
   - Real-time calculation updates
   - Smooth UI interactions
   - Efficient memory usage for large datasets

4. **Accessibility Requirements**
   - WCAG 2.1 compliance
   - Keyboard navigation support
   - Screen reader compatibility
   - High contrast support

## Configuration Requirements
1. **Tax Year Data**
   - JSON format
   - Annual updates needed
   - Threshold configurations

2. **NI Categories**
   - Static JSON data
   - Rate configurations
   - Category descriptions

## Security Considerations
- No sensitive data storage
- Client-side validation
- Safe JSON parsing
- XSS prevention in user inputs
