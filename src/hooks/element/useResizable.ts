/**
 * useResizable Hook
 * Extracted from CanvasElement - handles element resizing
 * Single Responsibility: Resize logic only
 * Uses Strategy Pattern for resize handles
 */

import { useEffect, useRef, useCallback } from 'react';
import type { Element } from '../../types';
import { useBuilder } from '../../store/BuilderContext';
import { CANVAS_CONSTRAINTS } from '../../constants';

interface UseResizableOptions {
  element: Element;
  isSelected: boolean;
  elementRef: React.RefObject<HTMLDivElement>;
  onResizeStart?: () => void;
  onResizeEnd?: () => void;
}

interface UseResizableReturn {
  isResizing: boolean;
  activeHandle: string | null;
}

type ResizeHandle = 'tl' | 'tr' | 'bl' | 'br' | 'tc' | 'bc' | 'ml' | 'mr';

interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Resize strategies for different handles
 * Strategy Pattern implementation
 */
const resizeStrategies: Record<
  ResizeHandle,
  (initial: Rect, deltaX: number, deltaY: number, aspectRatio: number, maintainRatio: boolean) => Rect
> = {
  // Top-left corner
  tl: (initial, dx, dy, ratio, maintain) => {
    let newWidth = initial.width - dx;
    let newHeight = initial.height - dy;
    
    if (maintain) {
      const maxDelta = Math.max(Math.abs(dx), Math.abs(dy));
      const sign = dx < 0 ? -1 : 1;
      newWidth = initial.width - sign * maxDelta;
      newHeight = newWidth / ratio;
    }
    
    return {
      x: initial.x + (initial.width - newWidth),
      y: initial.y + (initial.height - newHeight),
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Top-right corner
  tr: (initial, dx, dy, ratio, maintain) => {
    let newWidth = initial.width + dx;
    let newHeight = initial.height - dy;
    
    if (maintain) {
      const maxDelta = Math.max(Math.abs(dx), Math.abs(dy));
      const sign = dx > 0 ? 1 : -1;
      newWidth = initial.width + sign * maxDelta;
      newHeight = newWidth / ratio;
    }
    
    return {
      x: initial.x,
      y: initial.y + (initial.height - newHeight),
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Bottom-left corner
  bl: (initial, dx, dy, ratio, maintain) => {
    let newWidth = initial.width - dx;
    let newHeight = initial.height + dy;
    
    if (maintain) {
      const maxDelta = Math.max(Math.abs(dx), Math.abs(dy));
      const sign = dx < 0 ? -1 : 1;
      newWidth = initial.width - sign * maxDelta;
      newHeight = newWidth / ratio;
    }
    
    return {
      x: initial.x + (initial.width - newWidth),
      y: initial.y,
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Bottom-right corner
  br: (initial, dx, dy, ratio, maintain) => {
    let newWidth = initial.width + dx;
    let newHeight = initial.height + dy;
    
    if (maintain) {
      const maxDelta = Math.max(Math.abs(dx), Math.abs(dy));
      const sign = dx > 0 ? 1 : -1;
      newWidth = initial.width + sign * maxDelta;
      newHeight = newWidth / ratio;
    }
    
    return {
      x: initial.x,
      y: initial.y,
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Top-center
  tc: (initial, _dx, dy, ratio, maintain) => {
    let newHeight = initial.height - dy;
    let newWidth = initial.width;
    let newX = initial.x;
    
    if (maintain) {
      newWidth = newHeight * ratio;
      newX = initial.x - (newWidth - initial.width) / 2;
    }
    
    return {
      x: newX,
      y: initial.y + (initial.height - newHeight),
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Bottom-center
  bc: (initial, _dx, dy, ratio, maintain) => {
    let newHeight = initial.height + dy;
    let newWidth = initial.width;
    let newX = initial.x;
    
    if (maintain) {
      newWidth = newHeight * ratio;
      newX = initial.x - (newWidth - initial.width) / 2;
    }
    
    return {
      x: newX,
      y: initial.y,
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Middle-left
  ml: (initial, dx, _dy, ratio, maintain) => {
    let newWidth = initial.width - dx;
    let newHeight = initial.height;
    let newY = initial.y;
    
    if (maintain) {
      newHeight = newWidth / ratio;
      newY = initial.y - (newHeight - initial.height) / 2;
    }
    
    return {
      x: initial.x + (initial.width - newWidth),
      y: newY,
      width: newWidth,
      height: newHeight,
    };
  },
  
  // Middle-right
  mr: (initial, dx, _dy, ratio, maintain) => {
    let newWidth = initial.width + dx;
    let newHeight = initial.height;
    let newY = initial.y;
    
    if (maintain) {
      newHeight = newWidth / ratio;
      newY = initial.y - (newHeight - initial.height) / 2;
    }
    
    return {
      x: initial.x,
      y: newY,
      width: newWidth,
      height: newHeight,
    };
  },
};

/**
 * Hook to make an element resizable
 */
export const useResizable = ({
  element,
  isSelected,
  elementRef,
  onResizeStart,
  onResizeEnd,
}: UseResizableOptions): UseResizableReturn => {
  const { state, updateElement } = useBuilder();
  const isResizingRef = useRef(false);
  const activeHandleRef = useRef<ResizeHandle | null>(null);
  const startPosRef = useRef({ x: 0, y: 0 });
  const initialRectRef = useRef<Rect>({ x: 0, y: 0, width: 0, height: 0 });
  
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Only handle resize handle clicks
    if (!target.classList.contains('resize-handle')) {
      return;
    }
    
    const handle = target.dataset.handle as ResizeHandle;
    if (!handle) return;
    
    isResizingRef.current = true;
    activeHandleRef.current = handle;
    
    startPosRef.current = { x: e.clientX, y: e.clientY };
    initialRectRef.current = {
      x: typeof element.position.x === 'number' ? element.position.x : 0,
      y: typeof element.position.y === 'number' ? element.position.y : 0,
      width: typeof element.position.width === 'number' ? element.position.width : 0,
      height: typeof element.position.height === 'number' ? element.position.height : 0,
    };
    
    e.preventDefault();
    e.stopPropagation();
    
    onResizeStart?.();
  }, [element.position, onResizeStart]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizingRef.current || !activeHandleRef.current || !elementRef.current) return;
    
    const deltaX = (e.clientX - startPosRef.current.x) / state.canvas.zoom;
    const deltaY = (e.clientY - startPosRef.current.y) / state.canvas.zoom;
    
    const initial = initialRectRef.current;
    const aspectRatio = initial.width / initial.height;
    const maintainAspectRatio = e.shiftKey;
    
    // Use strategy pattern to calculate new rect
    const strategy = resizeStrategies[activeHandleRef.current];
    let newRect = strategy(initial, deltaX, deltaY, aspectRatio, maintainAspectRatio);
    
    // Apply minimum size constraints
    newRect.width = Math.max(CANVAS_CONSTRAINTS.MIN_ELEMENT_WIDTH, newRect.width);
    newRect.height = Math.max(CANVAS_CONSTRAINTS.MIN_ELEMENT_HEIGHT, newRect.height);
    
    // Apply grid snap if enabled
    if (state.canvas.config.grid.snap) {
      const gridSize = state.canvas.config.grid.size;
      newRect.x = Math.round(newRect.x / gridSize) * gridSize;
      newRect.y = Math.round(newRect.y / gridSize) * gridSize;
      newRect.width = Math.round(newRect.width / gridSize) * gridSize;
      newRect.height = Math.round(newRect.height / gridSize) * gridSize;
    }
    
    // Update visual position immediately (optimistic update)
    elementRef.current.style.left = `${newRect.x}px`;
    elementRef.current.style.top = `${newRect.y}px`;
    elementRef.current.style.width = `${newRect.width}px`;
    elementRef.current.style.height = `${newRect.height}px`;
  }, [state.canvas.zoom, state.canvas.config.grid, elementRef]);
  
  const handleMouseUp = useCallback(() => {
    if (!isResizingRef.current || !elementRef.current) return;
    
    const finalX = parseFloat(elementRef.current.style.left);
    const finalY = parseFloat(elementRef.current.style.top);
    const finalWidth = parseFloat(elementRef.current.style.width);
    const finalHeight = parseFloat(elementRef.current.style.height);
    
    // Update element in state
    updateElement(element.id, {
      position: {
        ...element.position,
        x: finalX,
        y: finalY,
        width: finalWidth,
        height: finalHeight,
      },
    });
    
    isResizingRef.current = false;
    activeHandleRef.current = null;
    
    onResizeEnd?.();
  }, [element.id, element.position, updateElement, elementRef, onResizeEnd]);
  
  useEffect(() => {
    if (!isSelected || !elementRef.current) return;
    
    const elementDiv = elementRef.current;
    
    elementDiv.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      elementDiv?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelected, handleMouseDown, handleMouseMove, handleMouseUp, elementRef]);
  
  return {
    isResizing: isResizingRef.current,
    activeHandle: activeHandleRef.current,
  };
};

