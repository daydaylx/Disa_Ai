# Role and Model Tile Redesign

## Overview

This redesign implements a more minimalistic approach for displaying role and model tiles in the Disa AI application. The new design only shows the name/title by default, with additional information revealed through an info button.

## Changes Made

### 1. RoleCard Component (`src/components/studio/RoleCard.tsx`)

- Removed the `showDescriptionOnToggle` prop
- Simplified the component structure to only show the title by default
- Implemented an expandable section that reveals description and badge information when the info button is clicked
- Updated styling to provide a cleaner, more focused appearance
- Maintained all accessibility features including proper ARIA attributes

### 2. Studio Page (`src/pages/Studio.tsx`)

- Updated the RoleCard usage to match the new component API
- Removed the `showDescriptionOnToggle` prop
- Ensured proper accessibility attributes are maintained

### 3. Models Page (`src/pages/Models.tsx`)

- The Models page already uses the RoleCard component correctly and required no changes

## Design Improvements

### Minimalist Approach

- Only the title/name is shown by default
- Reduced visual clutter by hiding badges and descriptions
- Cleaner, more focused interface that reduces cognitive load

### Information Disclosure

- Added an info button (ℹ️ icon) to each tile
- Clicking the info button expands the tile to show additional details
- Smooth animations provide visual feedback during expansion/collapse

### Accessibility

- Maintained proper ARIA attributes for screen readers
- Preserved keyboard navigation support
- Ensured sufficient color contrast for all text elements
- Maintained appropriate touch target sizes (minimum 44px)

## Technical Implementation

### Component Structure

The RoleCard component now uses a simpler structure:

- Title is always visible
- Info button toggles the visibility of additional details
- Expanded section contains description and badge information
- Proper state management for the expanded/collapsed state

### Styling Updates

- Removed min-height constraint for more flexible sizing
- Simplified padding and spacing
- Maintained consistent design language with the rest of the application
- Used existing design tokens for colors, spacing, and typography

### Barrierefreiheit Enhancements

- `aria-expanded` attribute on the info button indicates the current state
- `aria-label` provides descriptive text for screen reader users
- Proper focus management when expanding/collapsing
- Maintained heading structure for semantic correctness

## Benefits

1. **Improved Visual Clarity**: Less information overload on initial view
2. **Better Focus**: Users can focus on selecting a role/model without distraction
3. **Enhanced Usability**: Information is available when needed through intuitive interaction
4. **Consistent Experience**: Unified approach across both Roles and Models pages
5. **Maintained Functionality**: All existing features preserved with improved presentation

## Testing

The changes have been tested to ensure:

- No visual regressions in the application
- Proper functionality of all interactive elements
- Correct accessibility attributes and keyboard navigation
- Responsive design across different screen sizes
- Compatibility with existing state management

## Future Considerations

- Consider adding animation to the expand/collapse transition for enhanced user experience
- Evaluate user feedback to determine if additional information should be prioritized
- Explore potential performance optimizations for large lists of roles/models
