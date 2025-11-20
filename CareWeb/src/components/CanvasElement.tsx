import { useEffect, useRef } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { Element, ElementType, ResizeHandle } from '../types';
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id, e.metaKey || e.ctrlKey);
  };

  // Drag implementation with state update
  useEffect(() => {
    if (!isSelected || !elementRef.current) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = typeof element.position.x === 'number' ? element.position.x : 0;
    let initialY = typeof element.position.y === 'number' ? element.position.y : 0;

    const handleMouseDown = (e: MouseEvent) => {
      // Resize handle'lara tıklanırsa drag'i başlatma
      if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
      
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = typeof element.position.x === 'number' ? element.position.x : 0;
      initialY = typeof element.position.y === 'number' ? element.position.y : 0;
      e.preventDefault();
      e.stopPropagation();
      
      // Cursor değiştir
      document.body.style.cursor = 'grabbing';
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
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
      
      // Geçici olarak style ile pozisyon güncelle (performans için)
      if (elementRef.current) {
        elementRef.current.style.left = `${newX}px`;
        elementRef.current.style.top = `${newY}px`;
      }
    };

    const handleMouseUp = () => {
      if (!isDragging) return;
      
      isDragging = false;
      document.body.style.cursor = '';
      
      // Son pozisyonu state'e kaydet
      if (elementRef.current) {
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
        left: element.position.x,
        top: element.position.y,
        width: element.position.width,
        height: element.position.height,
        zIndex: element.position.zIndex
      }}
    >
      {renderElement()}
      
      {/* Selection Handles */}
      {isSelected && (
        <>
          {/* Corner Handles - for resizing */}
          <div className="resize-handle absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-10" />
          <div className="resize-handle absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-10" />
          <div className="resize-handle absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize z-10" />
          <div className="resize-handle absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize z-10" />
          
          {/* Edge Handles */}
          <div className="resize-handle absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-10" />
          <div className="resize-handle absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ns-resize z-10" />
          <div className="resize-handle absolute top-1/2 -left-1 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-10" />
          <div className="resize-handle absolute top-1/2 -right-1 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full cursor-ew-resize z-10" />
          
          {/* Element Info Badge */}
          <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
            {element.type} • {element.id.split('_').pop()}
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasElement;

