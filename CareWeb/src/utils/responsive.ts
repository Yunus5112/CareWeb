import { Position, ResponsiveConfig, ViewportMode } from '../types';

/**
 * Get effective position based on viewport mode and responsive config
 */
export const getResponsivePosition = (
  basePosition: Position,
  responsive: ResponsiveConfig | undefined,
  viewportMode: ViewportMode
): Position => {
  if (!responsive) return basePosition;

  let responsiveOverrides: Partial<Position> = {};

  switch (viewportMode) {
    case ViewportMode.MOBILE:
      responsiveOverrides = responsive.mobile || {};
      break;
    case ViewportMode.TABLET:
      responsiveOverrides = responsive.tablet || {};
      break;
    case ViewportMode.DESKTOP:
      responsiveOverrides = responsive.desktop || {};
      break;
    default:
      responsiveOverrides = {};
  }

  return {
    ...basePosition,
    ...responsiveOverrides
  };
};

/**
 * Generate default responsive config for an element
 */
export const generateDefaultResponsiveConfig = (
  basePosition: Position
): ResponsiveConfig => {
  const baseWidth = typeof basePosition.width === 'number' ? basePosition.width : 300;
  const baseHeight = typeof basePosition.height === 'number' ? basePosition.height : 200;
  const baseX = typeof basePosition.x === 'number' ? basePosition.x : 50;

  return {
    mobile: {
      x: 10,
      width: 'calc(100% - 20px)',
      // Height'i orantılı tut
      height: baseHeight
    },
    tablet: {
      x: Math.max(20, baseX * 0.5),
      width: typeof basePosition.width === 'string' ? basePosition.width : Math.min(baseWidth * 1.2, 400),
      height: baseHeight
    },
    desktop: {
      // Desktop için base position kullan
    }
  };
};

/**
 * Check if element should be responsive (full width elements typically are)
 */
export const shouldBeResponsive = (position: Position): boolean => {
  return (
    position.width === '100%' ||
    position.width === '90%' ||
    (typeof position.width === 'string' && position.width.includes('calc'))
  );
};

/**
 * Scale position for different viewports
 */
export const scalePositionForViewport = (
  position: Position,
  fromViewport: ViewportMode,
  toViewport: ViewportMode,
  fromWidth: number,
  toWidth: number
): Position => {
  const scale = toWidth / fromWidth;

  return {
    ...position,
    x: typeof position.x === 'number' ? position.x * scale : position.x,
    y: typeof position.y === 'number' ? position.y * scale : position.y,
    width: typeof position.width === 'number' ? position.width * scale : position.width,
    height: typeof position.height === 'number' ? position.height * scale : position.height,
    zIndex: position.zIndex
  };
};

