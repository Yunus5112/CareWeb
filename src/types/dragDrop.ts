import { ElementType } from './elements';

// Drag Data Transfer
export interface DragData {
  type: 'new-element' | 'existing-element';
  elementType?: ElementType;
  elementId?: string;
  sourceIndex?: number;
}

// Drag State
export interface DragState {
  isDragging: boolean;
  draggedElementType: ElementType | null;
  draggedElementId: string | null;
  dragType: 'new-element' | 'existing-element' | null;
  dragPreviewPosition: { x: number; y: number } | null;
}

// Drop Zone State
export interface DropZoneState {
  isOver: boolean;
  canDrop: boolean;
  dropPosition: { x: number; y: number } | null;
}

// Collision Detection
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CollisionResult {
  hasCollision: boolean;
  collidingElementIds: string[];
  suggestedPosition?: { x: number; y: number };
}

