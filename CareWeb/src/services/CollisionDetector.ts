/**
 * CollisionDetector Service
 * Handles collision detection and position validation
 * Single Responsibility Principle implementation
 */

import type { BoundingBox, CollisionResult } from '../types';
import { CANVAS_CONSTRAINTS } from '../constants';

/**
 * Collision Detector Service
 */
export class CollisionDetector {
  /**
   * Check if two bounding boxes collide
   */
  static checkCollision(box1: BoundingBox, box2: BoundingBox): boolean {
    return !(
      box1.x + box1.width < box2.x ||
      box1.x > box2.x + box2.width ||
      box1.y + box1.height < box2.y ||
      box1.y > box2.y + box2.height
    );
  }
  
  /**
   * Detect collisions with multiple elements
   */
  static detectCollisions(
    newElement: BoundingBox,
    existingElements: Array<BoundingBox & { id: string }>,
    threshold: number = CANVAS_CONSTRAINTS.COLLISION_THRESHOLD
  ): CollisionResult {
    const collidingElementIds: string[] = [];
    
    for (const element of existingElements) {
      const expandedElement: BoundingBox = {
        x: element.x - threshold,
        y: element.y - threshold,
        width: element.width + threshold * 2,
        height: element.height + threshold * 2,
      };
      
      if (this.checkCollision(newElement, expandedElement)) {
        collidingElementIds.push(element.id);
      }
    }
    
    return {
      hasCollision: collidingElementIds.length > 0,
      collidingElementIds,
    };
  }
  
  /**
   * Find nearest non-colliding position
   */
  static findNearestValidPosition(
    desiredPosition: { x: number; y: number },
    elementSize: { width: number; height: number },
    existingElements: Array<BoundingBox & { id: string }>,
    canvasWidth: number,
    canvasHeight: number,
    searchRadius: number = CANVAS_CONSTRAINTS.COLLISION_SEARCH_RADIUS
  ): { x: number; y: number } {
    const { x, y } = desiredPosition;
    const { width, height } = elementSize;
    const step = CANVAS_CONSTRAINTS.COLLISION_SEARCH_STEP;
    
    // Try positions in expanding circles
    for (let radius = 0; radius <= searchRadius; radius += step) {
      const positions = [
        { x: x + radius, y },
        { x: x - radius, y },
        { x, y: y + radius },
        { x, y: y - radius },
        { x: x + radius, y: y + radius },
        { x: x - radius, y: y - radius },
        { x: x + radius, y: y - radius },
        { x: x - radius, y: y + radius },
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
        const collision = this.detectCollisions(testBox, existingElements);
        
        if (!collision.hasCollision) {
          return pos;
        }
      }
    }
    
    // If no valid position found, return original
    return desiredPosition;
  }
  
  /**
   * Check if element is within canvas bounds
   */
  static isWithinBounds(
    position: { x: number; y: number },
    size: { width: number; height: number },
    canvasSize: { width: number; height: number }
  ): boolean {
    return (
      position.x >= 0 &&
      position.y >= 0 &&
      position.x + size.width <= canvasSize.width &&
      position.y + size.height <= canvasSize.height
    );
  }
  
  /**
   * Constrain element within canvas bounds
   */
  static constrainToCanvas(
    position: { x: number; y: number },
    size: { width: number; height: number },
    canvasSize: { width: number; height: number }
  ): { x: number; y: number } {
    return {
      x: Math.max(0, Math.min(position.x, canvasSize.width - size.width)),
      y: Math.max(0, Math.min(position.y, canvasSize.height - size.height)),
    };
  }
}

