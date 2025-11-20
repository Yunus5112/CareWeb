/**
 * useDraggable Hook
 * Extracted from CanvasElement - handles element dragging
 * Single Responsibility: Drag logic only
 */

import { useEffect, useRef, useCallback } from 'react';
import type { Element } from '../../types';
import { useBuilder } from '../../store/BuilderContext';

interface UseDraggableOptions {
  element: Element;
  isSelected: boolean;
  elementRef: React.RefObject<HTMLDivElement>;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

interface UseDraggableReturn {
  isDragging: boolean;
}

/**
 * Hook to make an element draggable
 */
export const useDraggable = ({
  element,
  isSelected,
  elementRef,
  onDragStart,
  onDragEnd,
}: UseDraggableOptions): UseDraggableReturn => {
  const { state, updateElement } = useBuilder();
  const isDraggingRef = useRef(false);
  const startPosRef = useRef({ x: 0, y: 0 });
  const initialPosRef = useRef({ x: 0, y: 0 });
  
  const handleMouseDown = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Don't start drag if clicking on resize handle
    if (target.classList.contains('resize-handle')) {
      return;
    }
    
    isDraggingRef.current = true;
    startPosRef.current = { x: e.clientX, y: e.clientY };
    initialPosRef.current = {
      x: typeof element.position.x === 'number' ? element.position.x : 0,
      y: typeof element.position.y === 'number' ? element.position.y : 0,
    };
    
    document.body.style.cursor = 'grabbing';
    e.preventDefault();
    e.stopPropagation();
    
    onDragStart?.();
  }, [element.position, onDragStart]);
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDraggingRef.current || !elementRef.current) return;
    
    const deltaX = (e.clientX - startPosRef.current.x) / state.canvas.zoom;
    const deltaY = (e.clientY - startPosRef.current.y) / state.canvas.zoom;
    
    let newX = initialPosRef.current.x + deltaX;
    let newY = initialPosRef.current.y + deltaY;
    
    // Apply grid snap if enabled
    if (state.canvas.config.grid.snap) {
      const gridSize = state.canvas.config.grid.size;
      newX = Math.round(newX / gridSize) * gridSize;
      newY = Math.round(newY / gridSize) * gridSize;
    }
    
    // Update visual position immediately (optimistic update)
    elementRef.current.style.left = `${newX}px`;
    elementRef.current.style.top = `${newY}px`;
  }, [state.canvas.zoom, state.canvas.config.grid, elementRef]);
  
  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current || !elementRef.current) return;
    
    const finalX = parseFloat(elementRef.current.style.left);
    const finalY = parseFloat(elementRef.current.style.top);
    
    // Calculate canvas bounds
    const elementWidth = typeof element.position.width === 'number' 
      ? element.position.width 
      : 0;
    const elementHeight = typeof element.position.height === 'number'
      ? element.position.height
      : 0;
    
    const maxX = state.canvas.config.width - elementWidth;
    const maxY = state.canvas.config.height - elementHeight;
    
    // Constrain to canvas bounds
    const constrainedX = Math.max(0, Math.min(finalX, maxX));
    const constrainedY = Math.max(0, Math.min(finalY, maxY));
    
    // Update element position in state
    updateElement(element.id, {
      position: {
        ...element.position,
        x: constrainedX,
        y: constrainedY,
      },
    });
    
    isDraggingRef.current = false;
    document.body.style.cursor = '';
    
    onDragEnd?.();
  }, [element.id, element.position, state.canvas.config, updateElement, elementRef, onDragEnd]);
  
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
      document.body.style.cursor = '';
    };
  }, [isSelected, handleMouseDown, handleMouseMove, handleMouseUp, elementRef]);
  
  return {
    isDragging: isDraggingRef.current,
  };
};

