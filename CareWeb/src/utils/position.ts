import { BoundingBox, CollisionResult } from '../types';

/**
 * Calculate absolute position from mouse coordinates
 */
export const calculateAbsolutePosition = (
  mouseX: number,
  mouseY: number,
  previewOffset: { x: number; y: number },
  elementWidth: number,
  elementHeight: number
): { x: number; y: number } => {
  return {
    x: mouseX - previewOffset.x - elementWidth / 2,
    y: mouseY - previewOffset.y - elementHeight / 2
  };
};

/**
 * Calculate relative position as percentage
 */
export const calculateRelativePosition = (
  absoluteX: number,
  absoluteY: number,
  canvasWidth: number,
  canvasHeight: number
): { x: string; y: string } => {
  const xPercent = (absoluteX / canvasWidth) * 100;
  const yPercent = (absoluteY / canvasHeight) * 100;
  
  return {
    x: `${xPercent.toFixed(2)}%`,
    y: `${yPercent.toFixed(2)}%`
  };
};

/**
 * Snap position to grid
 */
export const snapToGrid = (
  position: { x: number; y: number },
  gridSize: number,
  enabled: boolean
): { x: number; y: number } => {
  if (!enabled) return position;
  
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize
  };
};

/**
 * Check if two bounding boxes collide
 */
export const checkCollision = (box1: BoundingBox, box2: BoundingBox): boolean => {
  return !(
    box1.x + box1.width < box2.x ||
    box1.x > box2.x + box2.width ||
    box1.y + box1.height < box2.y ||
    box1.y > box2.y + box2.height
  );
};

/**
 * Detect collisions with multiple elements
 */
export const detectCollisions = (
  newElement: BoundingBox,
  existingElements: Array<BoundingBox & { id: string }>,
  threshold: number = 0
): CollisionResult => {
  const collidingElementIds: string[] = [];
  
  for (const element of existingElements) {
    const expandedElement: BoundingBox = {
      x: element.x - threshold,
      y: element.y - threshold,
      width: element.width + threshold * 2,
      height: element.height + threshold * 2
    };
    
    if (checkCollision(newElement, expandedElement)) {
      collidingElementIds.push(element.id);
    }
  }
  
  return {
    hasCollision: collidingElementIds.length > 0,
    collidingElementIds
  };
};

/**
 * Find nearest non-colliding position
 */
export const findNearestValidPosition = (
  desiredPosition: { x: number; y: number },
  elementSize: { width: number; height: number },
  existingElements: Array<BoundingBox & { id: string }>,
  canvasWidth: number,
  canvasHeight: number,
  searchRadius: number = 50
): { x: number; y: number } => {
  const { x, y } = desiredPosition;
  const { width, height } = elementSize;
  
  // Try positions in expanding circles
  for (let radius = 0; radius <= searchRadius; radius += 10) {
    const positions = [
      { x: x + radius, y },
      { x: x - radius, y },
      { x, y: y + radius },
      { x, y: y - radius },
      { x: x + radius, y: y + radius },
      { x: x - radius, y: y - radius },
      { x: x + radius, y: y - radius },
      { x: x - radius, y: y + radius }
    ];
    
    for (const pos of positions) {
      // Check bounds
      if (
        pos.x < 0 ||
        pos.y < 0 ||
        pos.x + width > canvasWidth ||
        pos.y + height > canvasHeight
      ) {
        continue;
      }
      
      // Check collisions
      const testBox: BoundingBox = { ...pos, width, height };
      const collision = detectCollisions(testBox, existingElements);
      
      if (!collision.hasCollision) {
        return pos;
      }
    }
  }
  
  // If no valid position found, return original
  return desiredPosition;
};

/**
 * Convert string position (like "50%" or "calc(100% - 60px)") to number
 */
export const parsePositionValue = (
  value: number | string,
  containerSize: number
): number => {
  if (typeof value === 'number') return value;
  
  // Handle percentage
  if (value.includes('%')) {
    const percent = parseFloat(value);
    return (percent / 100) * containerSize;
  }
  
  // Handle calc expressions (simplified)
  if (value.includes('calc')) {
    // Simple parser for "calc(100% - Npx)"
    const match = value.match(/calc\((\d+)%\s*-\s*(\d+)px\)/);
    if (match) {
      const percent = parseFloat(match[1]);
      const pixels = parseFloat(match[2]);
      return (percent / 100) * containerSize - pixels;
    }
  }
  
  // Handle pixel values
  if (value.includes('px')) {
    return parseFloat(value);
  }
  
  return 0;
};

/**
 * Constrain element within canvas bounds
 */
export const constrainToCanvas = (
  position: { x: number; y: number },
  size: { width: number; height: number },
  canvasSize: { width: number; height: number }
): { x: number; y: number } => {
  return {
    x: Math.max(0, Math.min(position.x, canvasSize.width - size.width)),
    y: Math.max(0, Math.min(position.y, canvasSize.height - size.height))
  };
};

