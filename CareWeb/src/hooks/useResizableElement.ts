import { useState, useRef, useCallback } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { ResizeHandle } from '../types';

interface UseResizableElementProps {
  elementId: string;
  initialWidth: number | string;
  initialHeight: number | string;
  initialX: number;
  initialY: number;
}

export const useResizableElement = ({ 
  elementId, 
  initialWidth, 
  initialHeight,
  initialX,
  initialY 
}: UseResizableElementProps) => {
  const { state, updateElement } = useBuilder();
  const [isResizing, setIsResizing] = useState(false);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const initialBounds = useRef({ 
    x: initialX, 
    y: initialY, 
    width: typeof initialWidth === 'number' ? initialWidth : 0, 
    height: typeof initialHeight === 'number' ? initialHeight : 0 
  });

  const handleResizeStart = useCallback((e: React.MouseEvent, handle: ResizeHandle) => {
    e.stopPropagation();
    setIsResizing(true);
    setActiveHandle(handle);
    resizeStartPos.current = { x: e.clientX, y: e.clientY };
    
    const element = state.elements.find(el => el.id === elementId);
    if (element) {
      initialBounds.current = {
        x: typeof element.position.x === 'number' ? element.position.x : initialX,
        y: typeof element.position.y === 'number' ? element.position.y : initialY,
        width: typeof element.position.width === 'number' ? element.position.width : 0,
        height: typeof element.position.height === 'number' ? element.position.height : 0
      };
    }
  }, [elementId, state.elements, initialX, initialY]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !activeHandle) return;

    const deltaX = (e.clientX - resizeStartPos.current.x) / state.canvas.zoom;
    const deltaY = (e.clientY - resizeStartPos.current.y) / state.canvas.zoom;

    const { x, y, width, height } = initialBounds.current;
    let newX = x;
    let newY = y;
    let newWidth = width;
    let newHeight = height;

    // Calculate new dimensions based on active handle
    switch (activeHandle) {
      case ResizeHandle.TOP_LEFT:
        newX = x + deltaX;
        newY = y + deltaY;
        newWidth = width - deltaX;
        newHeight = height - deltaY;
        break;
      case ResizeHandle.TOP_CENTER:
        newY = y + deltaY;
        newHeight = height - deltaY;
        break;
      case ResizeHandle.TOP_RIGHT:
        newY = y + deltaY;
        newWidth = width + deltaX;
        newHeight = height - deltaY;
        break;
      case ResizeHandle.MIDDLE_LEFT:
        newX = x + deltaX;
        newWidth = width - deltaX;
        break;
      case ResizeHandle.MIDDLE_RIGHT:
        newWidth = width + deltaX;
        break;
      case ResizeHandle.BOTTOM_LEFT:
        newX = x + deltaX;
        newWidth = width - deltaX;
        newHeight = height + deltaY;
        break;
      case ResizeHandle.BOTTOM_CENTER:
        newHeight = height + deltaY;
        break;
      case ResizeHandle.BOTTOM_RIGHT:
        newWidth = width + deltaX;
        newHeight = height + deltaY;
        break;
    }

    // Apply minimum constraints
    newWidth = Math.max(50, newWidth);
    newHeight = Math.max(50, newHeight);

    updateElement(elementId, {
      position: {
        ...state.elements.find(el => el.id === elementId)!.position,
        x: newX,
        y: newY,
        width: newWidth,
        height: newHeight
      }
    });
  }, [isResizing, activeHandle, elementId, state.canvas.zoom, state.elements, updateElement]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setActiveHandle(null);
  }, []);

  return {
    isResizing,
    activeHandle,
    handleResizeStart,
    handleResizeMove,
    handleResizeEnd
  };
};

