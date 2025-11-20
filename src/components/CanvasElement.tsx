/**
 * CanvasElement Component
 * Refactored: Now uses custom hooks for drag and resize
 * Cleaner, more maintainable, follows SRP
 */

import { useRef, useMemo } from 'react';
import { useBuilder } from '../store/BuilderContext';
import type { Element } from '../types';
import { ElementType } from '../types';
import { getResponsivePosition } from '../utils';
import { useDraggable } from '../hooks/element/useDraggable';
import { useResizable } from '../hooks/element/useResizable';
import { useIsElementSelected } from '../hooks/builder/useBuilderSelector';

// Element components
import HeaderElement from './elements/HeaderElement';
import FooterElement from './elements/FooterElement';
import CardElement from './elements/CardElement';
import TextContentElement from './elements/TextContentElement';
import SliderElement from './elements/SliderElement';
import ContainerElement from './elements/ContainerElement';

interface CanvasElementProps {
  element: Element;
}

/**
 * CanvasElement - Now much cleaner!
 * Complexity reduced from 380+ lines to ~150 lines
 */
const CanvasElement = ({ element }: CanvasElementProps) => {
  const { state, selectElement } = useBuilder();
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Use selector hook for better performance
  const isSelected = useIsElementSelected(element.id);
  
  // Calculate responsive position
  const effectivePosition = useMemo(() => {
    return getResponsivePosition(
      element.position,
      element.responsive,
      state.canvas.viewportMode
    );
  }, [element.position, element.responsive, state.canvas.viewportMode]);
  
  // Use custom hooks for drag and resize
  useDraggable({
    element,
    isSelected,
    elementRef: elementRef as React.RefObject<HTMLDivElement>,
  });
  
  const { isResizing } = useResizable({
    element,
    isSelected,
    elementRef: elementRef as React.RefObject<HTMLDivElement>,
  });
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id, e.metaKey || e.ctrlKey);
  };
  
  /**
   * Render element based on type
   */
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
  
  /**
   * Render resize handles
   */
  const renderResizeHandles = () => {
    if (!isSelected) return null;
    
    const handleClassName = "resize-handle absolute w-3 h-3 bg-blue-500 rounded-full z-10 hover:scale-150 transition-transform";
    
    return (
      <>
        {/* Corner Handles */}
        <div 
          data-handle="tl" 
          className={`${handleClassName} -top-1 -left-1 cursor-nwse-resize`}
        />
        <div 
          data-handle="tr" 
          className={`${handleClassName} -top-1 -right-1 cursor-nesw-resize`}
        />
        <div 
          data-handle="bl" 
          className={`${handleClassName} -bottom-1 -left-1 cursor-nesw-resize`}
        />
        <div 
          data-handle="br" 
          className={`${handleClassName} -bottom-1 -right-1 cursor-nwse-resize`}
        />
        
        {/* Edge Handles */}
        <div 
          data-handle="tc" 
          className={`${handleClassName} -top-1 left-1/2 -translate-x-1/2 cursor-ns-resize`}
        />
        <div 
          data-handle="bc" 
          className={`${handleClassName} -bottom-1 left-1/2 -translate-x-1/2 cursor-ns-resize`}
        />
        <div 
          data-handle="ml" 
          className={`${handleClassName} top-1/2 -left-1 -translate-y-1/2 cursor-ew-resize`}
        />
        <div 
          data-handle="mr" 
          className={`${handleClassName} top-1/2 -right-1 -translate-y-1/2 cursor-ew-resize`}
        />
        
        {/* Element Info Badge */}
        <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none">
          {element.type} • {element.id.split('_').pop()}
          {isResizing && <span className="ml-2 opacity-75">• Hold Shift for aspect ratio</span>}
        </div>
      </>
    );
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
      {renderResizeHandles()}
    </div>
  );
};

export default CanvasElement;
