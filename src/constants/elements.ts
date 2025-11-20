/**
 * Element-related constants
 * Default values and configuration for different element types
 */

export const ELEMENT_DEFAULTS = {
  // Header defaults
  HEADER: {
    WIDTH: '100%' as const,
    HEIGHT: 80,
    POSITION_X: 0,
    POSITION_Y: 0,
    Z_INDEX: 100,
  },
  
  // Footer defaults
  FOOTER: {
    WIDTH: '100%' as const,
    HEIGHT: 60,
    POSITION_X: 0,
    POSITION_Y: 'calc(100% - 60px)' as const,
    Z_INDEX: 100,
  },
  
  // Card defaults
  CARD: {
    WIDTH: 300,
    HEIGHT: 200,
    POSITION_X: 50,
    POSITION_Y: 100,
    Z_INDEX: 1,
  },
  
  // Text Content defaults
  TEXT_CONTENT: {
    WIDTH: 400,
    HEIGHT: 'auto' as const,
    MIN_HEIGHT: 100,
    POSITION_X: 50,
    POSITION_Y: 100,
    Z_INDEX: 1,
    FONT_SIZE: 16,
  },
  
  // Slider defaults
  SLIDER: {
    WIDTH: '100%' as const,
    HEIGHT: 400,
    POSITION_X: 0,
    POSITION_Y: 100,
    Z_INDEX: 1,
    AUTO_PLAY: true,
    INTERVAL: 3000,
  },
  
  // Container defaults
  CONTAINER: {
    WIDTH: 600,
    HEIGHT: 300,
    POSITION_X: 50,
    POSITION_Y: 100,
    Z_INDEX: 1,
    GAP: 20,
    PADDING: 20,
    COLUMNS: 2,
  },
} as const;

export const ELEMENT_CONSTRAINTS = {
  MIN_FONT_SIZE: 8,
  MAX_FONT_SIZE: 72,
  MIN_GAP: 0,
  MAX_GAP: 100,
  MIN_PADDING: 0,
  MAX_PADDING: 100,
} as const;

