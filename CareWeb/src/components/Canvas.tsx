import { useRef, useState } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { ElementType } from '../types';
import CanvasElement from './CanvasElement';

const Canvas = () => {
  const { state, addElement, dispatch, deselectAll } = useBuilder();
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setIsOver(true);

    // Update drag preview position
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      dispatch({
        type: 'UPDATE_DRAG_POSITION',
        payload: { x, y }
      });
    }
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);

    const elementType = e.dataTransfer.getData('elementType') as ElementType;
    
    if (elementType && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      addElement(elementType, { x, y });
    }

    dispatch({ type: 'END_DRAG' });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    // Only deselect if clicking directly on canvas
    if (e.target === e.currentTarget) {
      deselectAll();
    }
  };

  return (
    <div className="flex-1 bg-gray-900 overflow-auto p-8">
      <div className="flex justify-center">
        <div
          ref={canvasRef}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          className="relative bg-white rounded-lg shadow-2xl transition-all"
          style={{
            width: state.canvas.config.width,
            height: state.canvas.config.height,
            transform: `scale(${state.canvas.zoom})`,
            transformOrigin: 'top center',
            border: isOver ? '2px dashed #3B82F6' : '2px solid #E5E7EB'
          }}
        >
          {/* Grid Background (optional) */}
          {state.canvas.config.grid.showGrid && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent ${state.canvas.config.grid.size - 1}px, #E5E7EB ${state.canvas.config.grid.size - 1}px, #E5E7EB ${state.canvas.config.grid.size}px),
                  repeating-linear-gradient(90deg, transparent, transparent ${state.canvas.config.grid.size - 1}px, #E5E7EB ${state.canvas.config.grid.size - 1}px, #E5E7EB ${state.canvas.config.grid.size}px)
                `
              }}
            />
          )}

          {/* Drop Zone Indicator */}
          {isOver && (
            <div className="absolute inset-0 bg-blue-500 bg-opacity-5 pointer-events-none flex items-center justify-center">
              <div className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg">
                Drop element here
              </div>
            </div>
          )}

          {/* Drag Preview */}
          {state.drag.isDragging && state.drag.dragPreviewPosition && (
            <div
              className="absolute pointer-events-none border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-20 rounded"
              style={{
                left: state.drag.dragPreviewPosition.x - 50,
                top: state.drag.dragPreviewPosition.y - 50,
                width: 100,
                height: 100
              }}
            />
          )}

          {/* Rendered Elements */}
          {state.elements.map((element) => (
            <CanvasElement key={element.id} element={element} />
          ))}

          {/* Empty State */}
          {state.elements.length === 0 && !isOver && (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-6xl mb-4">📦</div>
                <h3 className="text-xl font-semibold mb-2">Start Building</h3>
                <p className="text-sm">Drag components from the sidebar to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Canvas;

