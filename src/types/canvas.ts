// Canvas Configuration
export interface GridConfig {
  enabled: boolean;
  size: number;
  snap: boolean;
  showGrid?: boolean;
}

export interface CanvasConfig {
  width: number;
  height: number;
  grid: GridConfig;
  backgroundColor?: string;
  padding?: number;
}

// Viewport/Responsive Modes
export enum ViewportMode {
  DESKTOP = 'desktop',
  TABLET = 'tablet',
  MOBILE = 'mobile'
}

export interface ViewportDimensions {
  width: number;
  height: number;
}

export const VIEWPORT_SIZES: Record<ViewportMode, ViewportDimensions> = {
  [ViewportMode.DESKTOP]: { width: 1200, height: 800 },
  [ViewportMode.TABLET]: { width: 768, height: 1024 },
  [ViewportMode.MOBILE]: { width: 375, height: 667 }
};

// Canvas State
export interface CanvasState {
  config: CanvasConfig;
  viewportMode: ViewportMode;
  zoom: number;
  panOffset: { x: number; y: number };
}

