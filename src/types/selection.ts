// Selection State
export interface SelectionState {
  selectedElementIds: string[];
  multiSelect: boolean;
  showHandles: boolean;
}

// Transform Handles
export enum ResizeHandle {
  TOP_LEFT = 'tl',
  TOP_CENTER = 'tc',
  TOP_RIGHT = 'tr',
  MIDDLE_LEFT = 'ml',
  MIDDLE_RIGHT = 'mr',
  BOTTOM_LEFT = 'bl',
  BOTTOM_CENTER = 'bc',
  BOTTOM_RIGHT = 'br'
}

export interface TransformState {
  isTransforming: boolean;
  transformType: 'move' | 'resize' | null;
  activeHandle: ResizeHandle | null;
  startPosition: { x: number; y: number } | null;
  initialBounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  } | null;
}

// Element Manipulation
export interface ElementBounds {
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex: number;
}

