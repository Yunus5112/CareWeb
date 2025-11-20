/**
 * UI-related constants
 * Colors, sizes, and other UI configuration
 */

export const UI_COLORS = {
  // Background colors
  BG_PRIMARY: '#1F2937',
  BG_SECONDARY: '#374151',
  BG_TERTIARY: '#4B5563',
  
  // Text colors
  TEXT_PRIMARY: '#FFFFFF',
  TEXT_SECONDARY: '#D1D5DB',
  TEXT_TERTIARY: '#9CA3AF',
  
  // Border colors
  BORDER_PRIMARY: '#374151',
  BORDER_SECONDARY: '#4B5563',
  
  // State colors
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
} as const;

export const UI_SIZES = {
  // Sidebar
  SIDEBAR_WIDTH: 320,
  
  // Properties panel
  PROPERTIES_PANEL_WIDTH: 320,
  
  // Toolbar
  TOOLBAR_HEIGHT: 64,
  
  // Spacing
  SPACING_XS: 4,
  SPACING_SM: 8,
  SPACING_MD: 16,
  SPACING_LG: 24,
  SPACING_XL: 32,
} as const;

export const UI_TRANSITIONS = {
  FAST: '150ms',
  NORMAL: '300ms',
  SLOW: '500ms',
} as const;

export const UI_MESSAGES = {
  // Success messages
  ELEMENT_CREATED: 'Element created successfully',
  ELEMENT_UPDATED: 'Element updated',
  ELEMENT_DELETED: 'Element deleted',
  PROJECT_SAVED: 'Project saved successfully',
  PROJECT_LOADED: 'Project loaded successfully',
  
  // Error messages
  IMPORT_FAILED: 'Failed to import project',
  EXPORT_FAILED: 'Failed to export project',
  VALIDATION_FAILED: 'Validation failed',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  
  // Confirmation messages
  CONFIRM_DELETE: 'Are you sure you want to delete this element?',
  CONFIRM_NEW_PROJECT: 'Start a new project? Unsaved changes will be lost.',
  CONFIRM_OVERWRITE: 'This will overwrite the current project. Continue?',
} as const;

