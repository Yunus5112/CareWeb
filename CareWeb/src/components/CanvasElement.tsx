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
  const { state, selectElement } = useBuilder();
  const isSelected = state.selection.selectedElementIds.includes(element.id);
  const elementRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id, e.metaKey || e.ctrlKey);
  };

  // Simple drag implementation
  useEffect(() => {
    if (!isSelected || !elementRef.current) return;

    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let initialX = typeof element.position.x === 'number' ? element.position.x : 0;
    let initialY = typeof element.position.y === 'number' ? element.position.y : 0;

    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as HTMLElement).classList.contains('resize-handle')) return;
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      initialX = typeof element.position.x === 'number' ? element.position.x : 0;
      initialY = typeof element.position.y === 'number' ? element.position.y : 0;
      e.preventDefault();
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = (e.clientX - startX) / state.canvas.zoom;
      const deltaY = (e.clientY - startY) / state.canvas.zoom;
      
      if (elementRef.current) {
        elementRef.current.style.left = `${initialX + deltaX}px`;
        elementRef.current.style.top = `${initialY + deltaY}px`;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    const element_div = elementRef.current;
    element_div.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      element_div?.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isSelected, element.position.x, element.position.y, state.canvas.zoom]);

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

