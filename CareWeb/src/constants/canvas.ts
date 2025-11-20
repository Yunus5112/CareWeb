/**
 * Canvas-related constants
 * All magic numbers and configuration values for canvas operations
 */

export const CANVAS_CONSTRAINTS = {
  // Element size constraints
  MIN_ELEMENT_WIDTH: 50,
  MIN_ELEMENT_HEIGHT: 50,
  MAX_ELEMENT_WIDTH: 2000,
  MAX_ELEMENT_HEIGHT: 2000,
  
  // Grid settings
  DEFAULT_GRID_SIZE: 10,
  MIN_GRID_SIZE: 5,
  MAX_GRID_SIZE: 50,
  
  // Collision detection
  COLLISION_THRESHOLD: 5,
  COLLISION_SEARCH_RADIUS: 50,
  COLLISION_SEARCH_STEP: 10,
  
  // Resize handles
  RESIZE_HANDLE_SIZE: 12,
  RESIZE_HANDLE_HOVER_SCALE: 1.5,
  
  // Snap settings
  SNAP_THRESHOLD: 5,
  
  // Zoom settings
  MIN_ZOOM: 0.25,
  MAX_ZOOM: 2,
  ZOOM_STEP: 0.1,
  
  // Canvas defaults
  DEFAULT_CANVAS_WIDTH: 1200,
  DEFAULT_CANVAS_HEIGHT: 800,
  DEFAULT_CANVAS_PADDING: 20,
} as const;

export const CANVAS_COLORS = {
  BACKGROUND: '#f5f5f5',
  GRID_LINE: '#E5E7EB',
  SELECTION_RING: '#3B82F6',
  SELECTION_HANDLE: '#3B82F6',
  DRAG_PREVIEW_VALID: '#3B82F6',
  DRAG_PREVIEW_INVALID: '#F97316',
  HOVER_RING: '#9CA3AF',
} as const;

export const CANVAS_Z_INDEX = {
  ELEMENT_BASE: 1,
  ELEMENT_SELECTED: 2,
  RESIZE_HANDLES: 10,
  DRAG_PREVIEW: 100,
  HEADER_FOOTER: 100,
} as const;

