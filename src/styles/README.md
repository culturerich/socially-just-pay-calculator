# CSS Organization Guidelines

This document explains the CSS organization in the Pay Calculator project and provides guidelines for future development.

## Overview

The CSS in this project is organized to improve maintainability, reduce duplication, and promote reuse. The CSS is structured into two main categories:

1. **Common CSS files** in the `styles` directory that define reusable styles and design systems
2. **Component-specific CSS files** that extend the common styles with component-specific variations

## Common CSS Files

### theme.css
Contains CSS variables that define the design system:
- Color palettes for light and dark themes
- Section accent colors (basic, uplift, worker, calculation)
- Spacing variables
- Typography settings
- Shadows and effects
- Border radius values
- Transition timing
- Z-index values
- Print theme overrides

### layout.css
Contains common layout styles such as:
- Section styling and structure
- Section headers and footers
- Container layouts (flex and grid)
- Responsive adjustments

### forms.css
Contains common form element styles such as:
- Input fields and focus states
- Select elements and dropdowns
- Checkboxes
- Buttons (standard, add, delete)
- Form layouts and controls
- Error states
- Currency inputs
- Drag handles with dots grid

### dialogs.css
Contains common dialog styles such as:
- Dialog overlays
- Dialog content containers
- Dialog titles and descriptions
- Dialog buttons (cancel, delete)
- Animation integration

### animations.css
Contains animation definitions and utilities:
- Keyframe definitions (slide, fade, scale, shake, spin)
- Animation utility classes
- Duration and timing function utilities
- Dialog-specific animations
- Reduced motion preference support

### utilities.css
Contains utility classes for common styling needs:
- Screen reader utilities
- Visibility utilities
- Flex and layout utilities
- Text formatting utilities
- Spacing utilities
- Width and height utilities
- Border utilities

### mobile.css
Contains responsive styles specifically for mobile devices:
- Touch target size optimizations
- Mobile-specific layouts
- Responsive adjustments for forms and inputs
- Landscape orientation adjustments
- Touch-specific improvements

### print.css
Contains styles for print media:
- Print layout optimizations
- Hidden elements for print
- Page breaks
- Color adjustments for printing
- Font size adjustments

## Usage Guidelines

### Importing Common Styles

The common styles are automatically imported in the main `index.css` file, so you don't need to import them in individual component files.

```css
/* In index.css */
@import './styles/animations.css';
@import './styles/dialogs.css';
@import './styles/forms.css';
@import './styles/layout.css';
@import './styles/mobile.css';
@import './styles/print.css';
@import './styles/theme.css';
@import './styles/utilities.css';
```

### Component-Specific Styles

Component-specific styles should be kept in their respective CSS files. These include:

1. **Component-specific layouts**: Unique layouts that are only used by a specific component.
2. **Component-specific variations**: Variations of common elements that are specific to a component.
3. **Component-specific accent colors**: Styles that apply section accent colors to elements within a specific component.

### When to Use Common Styles vs. Component-Specific Styles

- **Use common styles** for elements that appear in multiple components with the same styling.
- **Use component-specific styles** for elements that are unique to a component or have component-specific variations.
- **Extend common styles** with component-specific styles when you need to add component-specific variations.

### Example: Extending Common Styles with Section Accent Colors

The project uses a consistent pattern of extending common styles with section-specific accent colors:

```css
/* In WorkerRow.css - extending common form styles with worker accent color */
.worker-row .form-input:focus {
  border-color: var(--color-worker-accent);
  box-shadow: 0 0 0 1px var(--color-worker-accent);
}

/* In UpliftRow.css - extending common form styles with uplift accent color */
.uplift-row .form-input:focus {
  border-color: var(--color-uplift-accent);
  box-shadow: 0 0 0 1px var(--color-uplift-accent);
}
```

### Section Styling Patterns

The project follows consistent patterns for styling sections:

1. **Headers outside content boxes**: Section headers are placed outside the main content boxes for better visual hierarchy.
2. **Section-specific accent colors**: Each section uses a specific accent color defined in theme.css.
3. **Consistent padding and borders**: Sections use consistent padding and border styles.
4. **Standardized drag handles**: Drag handles use a consistent dots grid pattern.
5. **Uniform button styles**: Buttons follow consistent styling patterns with appropriate accent colors.
6. **Full-width input rows**: Input rows are designed to use the full width for better space utilization.

## Responsive Design

The project uses a mobile-first approach to responsive design:

1. **Base styles** are designed for mobile devices.
2. **Media queries** are used to adjust layouts for larger screens.
3. **Touch optimizations** are included for better mobile experience.
4. **Print styles** ensure the application prints correctly.

## Future Development

When adding new styles:

1. **Check if a common style already exists** before creating a new one.
2. **Consider if the style should be common** or component-specific.
3. **Add common styles** to the appropriate common CSS file.
4. **Add component-specific styles** to the component's CSS file.
5. **Follow the established patterns** for extending common styles with component-specific variations.
6. **Use CSS variables** from theme.css for consistent styling.
7. **Consider responsive design** and ensure styles work on all device sizes.
8. **Test print styles** if the new feature needs to be printable.

## Benefits of This Organization

- **Reduced duplication**: Common styles are defined once and reused across components.
- **Improved maintainability**: Changes to common styles only need to be made in one place.
- **Consistent styling**: Common elements have consistent styling across the application.
- **Smaller CSS bundle**: Reduced duplication leads to a smaller CSS bundle.
- **Easier onboarding**: New developers can quickly understand the CSS organization.
- **Better responsive design**: Mobile and print styles are organized in dedicated files.
- **Theme support**: Light and dark themes are easily managed through CSS variables.
