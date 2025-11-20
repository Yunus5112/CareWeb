import { useState } from 'react';
import { ELEMENT_TEMPLATES } from '../utils';
import { ElementType } from '../types';
import { useBuilder } from '../store/BuilderContext';

const Sidebar = () => {
  const { dispatch } = useBuilder();
  const [activeTab, setActiveTab] = useState<'components' | 'pages'>('components');
  const [draggingType, setDraggingType] = useState<ElementType | null>(null);

  const handleDragStart = (e: React.DragEvent, elementType: ElementType) => {
    e.dataTransfer.effectAllowed = 'copy';
    e.dataTransfer.setData('elementType', elementType);
    
    // Sürüklenen elementi işaretle
    setDraggingType(elementType);
    
    // Drag image'ı yarı şeffaf yap
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.5';
    }
    
    dispatch({
      type: 'START_DRAG',
      payload: {
        elementType,
        dragType: 'new-element'
      }
    });
  };

  const handleDragEnd = (e: React.DragEvent) => {
    // Opacity'yi geri al
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    
    setDraggingType(null);
    dispatch({ type: 'END_DRAG' });
  };

  return (
    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2">
          <span>← back to home</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-700">
        <button
          onClick={() => setActiveTab('components')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'components'
              ? 'text-white border-b-2 border-blue-600'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Components
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${
            activeTab === 'pages'
              ? 'text-white border-b-2 border-blue-600'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          Pages
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'components' && (
          <>
            <h3 className="text-xs uppercase font-semibold text-gray-400 mb-3">
              Page Builder
            </h3>
            
            <div className="space-y-2">
              {ELEMENT_TEMPLATES.map((template) => (
                <div
                  key={template.type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, template.type)}
                  onDragEnd={handleDragEnd}
                  className={`bg-gray-700 hover:bg-gray-600 rounded-lg p-4 cursor-move transition-all group ${
                    draggingType === template.type ? 'opacity-50 scale-95' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                      {template.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm mb-1">
                        {template.label}
                      </h4>
                      <p className="text-gray-400 text-xs leading-relaxed">
                        {template.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'pages' && (
          <div className="text-center py-8">
            <p className="text-gray-400 text-sm">No pages yet</p>
            <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors">
              + New Page
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-gray-700">
        <div className="text-xs text-gray-500">
          <p>Drag & drop components to canvas</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

