import { useBuilder } from '../store/BuilderContext';
import { Element, ElementType } from '../types';
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectElement(element.id, e.metaKey || e.ctrlKey);
  };

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
      onClick={handleClick}
      className={`absolute cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300'
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
          {/* Corner Handles */}
          <div className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 rounded-full cursor-nesw-resize" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full cursor-nwse-resize" />
          
          {/* Element Info Badge */}
          <div className="absolute -top-8 left-0 bg-blue-600 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            {element.type} • {element.id.split('_').pop()}
          </div>
        </>
      )}
    </div>
  );
};

export default CanvasElement;

