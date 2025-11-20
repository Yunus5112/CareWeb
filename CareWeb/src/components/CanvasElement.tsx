import { useEffect, useRef, useMemo } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { Element, ElementType, ResizeHandle } from '../types';
import { getResponsivePosition } from '../utils';
import HeaderElement from './elements/HeaderElement';
import FooterElement from './elements/FooterElement';
import CardElement from './elements/CardElement';
import TextContentElement from './elements/TextContentElement';
import SliderElement from './elements/SliderElement';
import ContainerElement from './elements/ContainerElement';

interface CanvasElementProps {
  element: Element;
}

const CanvasElement = ({ element }: CanvasElementProps) => {
  const { state, selectElement, updateElement } = useBuilder();
  const isSelected = state.selection.selectedElementIds.includes(element.id);
  const elementRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const activeHandleRef = useRef<string | null>(null);

  // Get responsive position based on current viewport
  const effectivePosition = useMemo(() => {
    return getResponsivePosition(
      element.position,
      element.responsive,
      state.canvas.viewportMode
    );
  }, [element.position, element.responsive, state.canvas.viewportMode]);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id, e.metaKey || e.ctrlKey);
  };

  // Drag and Resize implementation
  useEffect(() => {
    if (!isSelected || !elementRef.current) return;

    let isDragging = false;
    let isResizing = false;
    let startX = 0;
    let startY = 0;
    let initialX = typeof element.position.x === 'number' ? element.position.x : 0;
    let initialY = typeof element.position.y === 'number' ? element.position.y : 0;
    let initialWidth = typeof element.position.width === 'number' ? element.position.width : 0;
    let initialHeight = typeof element.position.height === 'number' ? element.position.height : 0;
    let activeHandle: string | null = null;

    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Resize handle'a tıklandıysa
      if (target.classList.contains('resize-handle')) {
        isResizing = true;
        activeHandle = target.dataset.handle || null;
        activeHandleRef.current = activeHandle;
        isResizingRef.current = true;
        
        startX = e.clientX;
        startY = e.clientY;
        initialX = typeof element.position.x === 'number' ? element.position.x : 0;
        initialY = typeof element.position.y === 'number' ? element.position.y : 0;
        initialWidth = typeof element.position.width === 'number' ? element.position.width : 0;
        initialHeight = typeof element.position.height === 'number' ? element.position.height : 0;
        
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // Normal drag
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = typeof element.position.x === 'number' ? element.position.x : 0;
      initialY = typeof element.position.y === 'number' ? element.position.y : 0;
      e.preventDefault();
      e.stopPropagation();
      
      document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing && activeHandle) {
        const deltaX = (e.clientX - startX) / state.canvas.zoom;
        const deltaY = (e.clientY - startY) / state.canvas.zoom;
        
        let newX = initialX;
        let newY = initialY;
        let newWidth = initialWidth;
        let newHeight = initialHeight;
        
        // Aspect ratio hesapla
        const aspectRatio = initialWidth / initialHeight;
        const maintainAspectRatio = e.shiftKey; // Shift tuşu basılıysa oranı koru
        
        // Handle farklı yönlere göre resize işlemi
        switch (activeHandle) {
          case 'tl': // Top-left
            newX = initialX + deltaX;
            newY = initialY + deltaY;
            newWidth = initialWidth - deltaX;
            newHeight = initialHeight - deltaY;
            
            if (maintainAspectRatio) {
              // En büyük değişimi baz al
              const maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
              const sign = deltaX < 0 ? -1 : 1;
              newWidth = initialWidth - sign * maxDelta;
              newHeight = newWidth / aspectRatio;
              newX = initialX + (initialWidth - newWidth);
              newY = initialY + (initialHeight - newHeight);
            }
            break;
          case 'tc': // Top-center
            newY = initialY + deltaY;
            newHeight = initialHeight - deltaY;
            if (maintainAspectRatio) {
              newWidth = newHeight * aspectRatio;
              newX = initialX - (newWidth - initialWidth) / 2;
            }
            break;
          case 'tr': // Top-right
            newY = initialY + deltaY;
            newWidth = initialWidth + deltaX;
            newHeight = initialHeight - deltaY;
            
            if (maintainAspectRatio) {
              const maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
              const sign = deltaX > 0 ? 1 : -1;
              newWidth = initialWidth + sign * maxDelta;
              newHeight = newWidth / aspectRatio;
              newY = initialY + (initialHeight - newHeight);
            }
            break;
          case 'ml': // Middle-left
            newX = initialX + deltaX;
            newWidth = initialWidth - deltaX;
            if (maintainAspectRatio) {
              newHeight = newWidth / aspectRatio;
              newY = initialY - (newHeight - initialHeight) / 2;
            }
            break;
          case 'mr': // Middle-right
            newWidth = initialWidth + deltaX;
            if (maintainAspectRatio) {
              newHeight = newWidth / aspectRatio;
              newY = initialY - (newHeight - initialHeight) / 2;
            }
            break;
          case 'bl': // Bottom-left
            newX = initialX + deltaX;
            newWidth = initialWidth - deltaX;
            newHeight = initialHeight + deltaY;
            
            if (maintainAspectRatio) {
              const maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
              const sign = deltaX < 0 ? -1 : 1;
              newWidth = initialWidth - sign * maxDelta;
              newHeight = newWidth / aspectRatio;
              newX = initialX + (initialWidth - newWidth);
            }
            break;
          case 'bc': // Bottom-center
            newHeight = initialHeight + deltaY;
            if (maintainAspectRatio) {
              newWidth = newHeight * aspectRatio;
              newX = initialX - (newWidth - initialWidth) / 2;
            }
            break;
          case 'br': // Bottom-right
            newWidth = initialWidth + deltaX;
            newHeight = initialHeight + deltaY;
            
            if (maintainAspectRatio) {
              // En büyük değişimi baz al
              const maxDelta = Math.max(Math.abs(deltaX), Math.abs(deltaY));
              const sign = deltaX > 0 ? 1 : -1;
              newWidth = initialWidth + sign * maxDelta;
              newHeight = newWidth / aspectRatio;
            }
            break;
        }
        
        // Minimum boyut kontrolü
        newWidth = Math.max(50, newWidth);
        newHeight = Math.max(50, newHeight);
        
        // Grid snap if enabled
        if (state.canvas.config.grid.snap) {
          const gridSize = state.canvas.config.grid.size;
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
          newWidth = Math.round(newWidth / gridSize) * gridSize;
          newHeight = Math.round(newHeight / gridSize) * gridSize;
        }
        
        // Geçici style güncelle
        if (elementRef.current) {
          elementRef.current.style.left = `${newX}px`;
          elementRef.current.style.top = `${newY}px`;
          elementRef.current.style.width = `${newWidth}px`;
          elementRef.current.style.height = `${newHeight}px`;
        }
        return;
      }
      
      if (isDragging) {
        const deltaX = (e.clientX - startX) / state.canvas.zoom;
        const deltaY = (e.clientY - startY) / state.canvas.zoom;
        
        let newX = initialX + deltaX;
        let newY = initialY + deltaY;
        
        // Grid snap if enabled
        if (state.canvas.config.grid.snap) {
          const gridSize = state.canvas.config.grid.size;
          newX = Math.round(newX / gridSize) * gridSize;
          newY = Math.round(newY / gridSize) * gridSize;
        }
        
        if (elementRef.current) {
          elementRef.current.style.left = `${newX}px`;
          elementRef.current.style.top = `${newY}px`;
        }
      }
    };

    const handleMouseUp = () => {
      if (isResizing && elementRef.current) {
        const finalX = parseFloat(elementRef.current.style.left);
        const finalY = parseFloat(elementRef.current.style.top);
        const finalWidth = parseFloat(elementRef.current.style.width);
        const finalHeight = parseFloat(elementRef.current.style.height);
        
        updateElement(element.id, {
          position: {
            ...element.position,
            x: finalX,
            y: finalY,
            width: finalWidth,
            height: finalHeight
          }
        });
        
        isResizing = false;
        activeHandle = null;
        activeHandleRef.current = null;
        isResizingRef.current = false;
        return;
      }
      
      if (isDragging && elementRef.current) {
        const finalX = parseFloat(elementRef.current.style.left);
        const finalY = parseFloat(elementRef.current.style.top);
        
        // Sınırlar içinde tut
        const maxX = state.canvas.config.width - (typeof element.position.width === 'number' ? element.position.width : 0);
        const maxY = state.canvas.config.height - (typeof element.position.height === 'number' ? element.position.height : 0);
        
        const constrainedX = Math.max(0, Math.min(finalX, maxX));
        const constrainedY = Math.max(0, Math.min(finalY, maxY));
        
        updateElement(element.id, {
          position: {
            ...element.position,
            x: constrainedX,
            y: constrainedY
          }
        });
      }
      
      isDragging = false;
      document.body.style.cursor = '';
    };

    const element_div = elementRef.current;
    element_div.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      element_div?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
    };
  }, [isSelected, element.id, element.position, state.canvas.zoom, state.canvas.config, updateElement]);

  const renderElement = () => {
    switch (element.type) {
      case ElementType.HEADER:
        return <HeaderElement element={element} />;
      case ElementType.FOOTER:
        return <FooterElement element={element} />;
      case ElementType.CARD:
        return <CardElement element={element} />;
      case ElementType.TEXT_CONTENT:
        return <TextContentElement element={element} />;
      case ElementType.SLIDER:
        return <SliderElement element={element} />;
      case ElementType.CONTAINER:
        return <ContainerElement element={element} />;
      default:
        return <div className="p-4">Unknown Element</div>;
    }
  };

  return (
    <div
      ref={elementRef}
      onClick={handleClick}
      className={`absolute transition-all ${
        isSelected 
          ? 'ring-2 ring-blue-500 ring-offset-2 cursor-move' 
          : 'hover:ring-2 hover:ring-gray-300 cursor-pointer'
      }`}
      style={{
        left: effectivePosition.x,
        top: effectivePosition.y,
        width: effectivePosition.width,
        height: effectivePosition.height,
        zIndex: effectivePosition.zIndex
      }}
    >
      {renderElement()}
      
      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Corner Handles - for resizing */}
          <div 
            data-handle="tl" 
            className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-10 hover:scale-150 transition-transform" 
          />
          <div 
            data-handle="tr" 
            className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-10 hover:scale-150 transition-transform" 
          />
          <div 
            data-handle="bl" 
            className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-10 hover:scale-150 transition-transform" 
          />
          <div 
            data-handle="br" 
            className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-10 hover:scale-150 transition-transform" 
          />
          
          {/* Edge Handles */}
          <div 
            data-handle="tc" 
            className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-10 hover:scale-150 transition-transform" 
          />
          <div 
            data-handle="bc" 
            className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-10 hover:scale-150 transition-transform" 
          />
          <div 
            data-handle="ml" 
            className="resize-handle absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-10 hover:scale-150 transition-transform" 
          />
          <div 
            data-handle="mr" 
            className="resize-handle absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-10 hover:scale-150 transition-transform" 
          />
          
          {/* Element Info Badge */}
          <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
            {element.type} • {element.id.split('_').pop()}
            {isResizingRef.current && <span className="ml-2 opacity-75">• Hold Shift for aspect ratio</span>}
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasElement;

