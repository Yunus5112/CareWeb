import { useState, useRef, useCallback } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { snapToGrid } from '../utils';

interface UseDraggableElementProps {
  elementId: string;
  initialX: number;
  initialY: number;
}

export const useDraggableElement = ({ elementId, initialX, initialY }: UseDraggableElementProps) => {
  const { state, updateElement } = useBuilder();
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const elementStartPos = useRef({ x: initialX, y: initialY });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only start drag if not clicking on a resize handle
    if ((e.target as HTMLElement).classList.contains('resize-handle')) {
      return;
    }

    setIsDragging(true);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    elementStartPos.current = { x: initialX, y: initialY };
  }, [initialX, initialY]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartPos.current.x;
    const deltaY = e.clientY - dragStartPos.current.y;

    let newX = elementStartPos.current.x + deltaX / state.canvas.zoom;
    let newY = elementStartPos.current.y + deltaY / state.canvas.zoom;

    // Apply grid snapping if enabled
    if (state.canvas.config.grid.snap) {
      const snapped = snapToGrid(
        { x: newX, y: newY },
        state.canvas.config.grid.size,
        true
      );
      newX = snapped.x;
      newY = snapped.y;
    }

    updateElement(elementId, {
      position: {
        ...state.elements.find(el => el.id === elementId)!.position,
        x: newX,
        y: newY
      }
    });
  }, [isDragging, elementId, state.canvas.zoom, state.canvas.config.grid, state.elements, updateElement]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return {
    isDragging,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp
  };
};

