# Technical Context

## Core Technologies
1. **Frontend Framework**
   - React
   - JavaScript (ES6+)

2. **UI Components**
   - Radix UI primitives for accessible components
   - Semantic HTML elements

3. **Data Management**
   - Browser LocalStorage API
   - JSON data files

4. **Export Libraries**
   - SheetJS for spreadsheet exports

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
- Development server (e.g., Vite or Create React App)

## Technical Constraints
1. **Browser Support**
   - Modern browsers with LocalStorage API
   - ES6+ JavaScript support
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
