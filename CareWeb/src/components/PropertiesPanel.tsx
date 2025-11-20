import { useState } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { ElementType, ViewportMode } from '../types';
import { generateDefaultResponsiveConfig } from '../utils';

const PropertiesPanel = () => {
  const { state, updateElement, removeElement } = useBuilder();
  const [showResponsive, setShowResponsive] = useState(false);
  
  const selectedElement = state.selection.selectedElementIds.length === 1
    ? state.elements.find(el => el.id === state.selection.selectedElementIds[0])
    : null;

  if (!selectedElement) {
    return (
      <div className="w-80 bg-gray-800 border-l border-gray-700 p-6">
        <div className="text-center text-gray-400">
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="text-sm font-medium mb-1">No Selection</h3>
          <p className="text-xs">Select an element to edit properties</p>
        </div>
      </div>
    );
  }

  const handleContentUpdate = (field: string, value: any) => {
    updateElement(selectedElement.id, {
      content: {
        ...selectedElement.content,
        [field]: value
      }
    });
  };

  const handlePositionUpdate = (field: string, value: any) => {
    updateElement(selectedElement.id, {
      position: {
        ...selectedElement.position,
        [field]: value
      }
    });
  };

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this element?')) {
      removeElement(selectedElement.id);
    }
  };

  const handleEnableResponsive = () => {
    if (!selectedElement.responsive) {
      const defaultResponsive = generateDefaultResponsiveConfig(selectedElement.position);
      updateElement(selectedElement.id, {
        responsive: defaultResponsive
      });
    }
    setShowResponsive(true);
  };

  const handleResponsiveUpdate = (viewport: 'mobile' | 'tablet' | 'desktop', field: string, value: any) => {
    updateElement(selectedElement.id, {
      responsive: {
        ...selectedElement.responsive,
        [viewport]: {
          ...(selectedElement.responsive?.[viewport] || {}),
          [field]: value
        }
      }
    });
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-white font-semibold text-sm mb-1">Properties</h2>
        <p className="text-gray-400 text-xs">{selectedElement.type}</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Content Properties */}
        <div>
          <h3 className="text-white text-xs font-semibold uppercase mb-3">Content</h3>
          
          {selectedElement.type === ElementType.HEADER && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Header Text</label>
                <input
                  type="text"
                  value={(selectedElement.content as any).text || ''}
                  onChange={(e) => handleContentUpdate('text', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
            </div>
          )}

          {selectedElement.type === ElementType.CARD && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Title</label>
                <input
                  type="text"
                  value={(selectedElement.content as any).title || ''}
                  onChange={(e) => handleContentUpdate('title', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Description</label>
                <textarea
                  value={(selectedElement.content as any).description || ''}
                  onChange={(e) => handleContentUpdate('description', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-20 resize-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Icon Emoji</label>
                <input
                  type="text"
                  value={(selectedElement.content as any).icon || ''}
                  onChange={(e) => handleContentUpdate('icon', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                  placeholder="📦"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Button Text</label>
                <input
                  type="text"
                  value={(selectedElement.content as any).buttonText || ''}
                  onChange={(e) => handleContentUpdate('buttonText', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                  placeholder="Learn More"
                />
              </div>
            </div>
          )}

          {selectedElement.type === ElementType.TEXT_CONTENT && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Text Content</label>
                <textarea
                  value={(selectedElement.content as any).plainText || ''}
                  onChange={(e) => {
                    handleContentUpdate('plainText', e.target.value);
                    handleContentUpdate('html', `<p>${e.target.value}</p>`);
                  }}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm h-32 resize-none"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Font Size</label>
                <input
                  type="number"
                  value={(selectedElement.content as any).fontSize || 16}
                  onChange={(e) => handleContentUpdate('fontSize', parseInt(e.target.value))}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                  min="8"
                  max="72"
                />
              </div>
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Alignment</label>
                <select
                  value={(selectedElement.content as any).alignment || 'left'}
                  onChange={(e) => handleContentUpdate('alignment', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                >
                  <option value="left">Left</option>
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="justify">Justify</option>
                </select>
              </div>
            </div>
          )}

          {selectedElement.type === ElementType.FOOTER && (
            <div className="space-y-3">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Copyright Text</label>
                <input
                  type="text"
                  value={(selectedElement.content as any).copyright || ''}
                  onChange={(e) => handleContentUpdate('copyright', e.target.value)}
                  className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
                />
              </div>
            </div>
          )}
        </div>

        {/* Position & Size */}
        <div>
          <h3 className="text-white text-xs font-semibold uppercase mb-3">Position & Size</h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">X</label>
              <input
                type="number"
                value={typeof selectedElement.position.x === 'number' ? selectedElement.position.x : 0}
                onChange={(e) => handlePositionUpdate('x', parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Y</label>
              <input
                type="number"
                value={typeof selectedElement.position.y === 'number' ? selectedElement.position.y : 0}
                onChange={(e) => handlePositionUpdate('y', parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Width</label>
              <input
                type="number"
                value={typeof selectedElement.position.width === 'number' ? selectedElement.position.width : 0}
                onChange={(e) => handlePositionUpdate('width', parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Height</label>
              <input
                type="number"
                value={typeof selectedElement.position.height === 'number' ? selectedElement.position.height : 0}
                onChange={(e) => handlePositionUpdate('height', parseFloat(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
            </div>
          </div>
        </div>

        {/* Z-Index */}
        <div>
          <h3 className="text-white text-xs font-semibold uppercase mb-3">Layer</h3>
          <div className="space-y-2">
            <div>
              <label className="text-gray-400 text-xs mb-1 block">Z-Index</label>
              <input
                type="number"
                value={selectedElement.position.zIndex}
                onChange={(e) => handlePositionUpdate('zIndex', parseInt(e.target.value))}
                className="w-full bg-gray-700 text-white px-3 py-2 rounded text-sm"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handlePositionUpdate('zIndex', selectedElement.position.zIndex + 1)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-xs transition-colors"
              >
                ↑ Bring Forward
              </button>
              <button
                onClick={() => handlePositionUpdate('zIndex', Math.max(1, selectedElement.position.zIndex - 1))}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded text-xs transition-colors"
              >
                ↓ Send Back
              </button>
            </div>
          </div>
        </div>

        {/* Responsive Settings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white text-xs font-semibold uppercase">Responsive</h3>
            {!selectedElement.responsive ? (
              <button
                onClick={handleEnableResponsive}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                + Enable
              </button>
            ) : (
              <button
                onClick={() => setShowResponsive(!showResponsive)}
                className="text-xs text-gray-400 hover:text-white"
              >
                {showResponsive ? '▼ Hide' : '▶ Show'}
              </button>
            )}
          </div>

          {selectedElement.responsive && showResponsive && (
            <div className="space-y-4 pl-2 border-l-2 border-gray-700">
              {/* Current Viewport Indicator */}
              <div className="text-xs text-gray-400 mb-2">
                Current: <span className="text-blue-400">{state.canvas.viewportMode}</span>
              </div>

              {/* Mobile Settings */}
              <div>
                <h4 className="text-gray-300 text-xs font-medium mb-2">📱 Mobile</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-gray-500 text-xs">Width</label>
                    <input
                      type="text"
                      value={selectedElement.responsive.mobile?.width || ''}
                      onChange={(e) => handleResponsiveUpdate('mobile', 'width', e.target.value)}
                      placeholder="e.g. 100% or 320"
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Height</label>
                    <input
                      type="text"
                      value={selectedElement.responsive.mobile?.height || ''}
                      onChange={(e) => handleResponsiveUpdate('mobile', 'height', e.target.value)}
                      placeholder="auto or number"
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Tablet Settings */}
              <div>
                <h4 className="text-gray-300 text-xs font-medium mb-2">📱 Tablet</h4>
                <div className="space-y-2">
                  <div>
                    <label className="text-gray-500 text-xs">Width</label>
                    <input
                      type="text"
                      value={selectedElement.responsive.tablet?.width || ''}
                      onChange={(e) => handleResponsiveUpdate('tablet', 'width', e.target.value)}
                      placeholder="e.g. 100% or 600"
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 text-xs">Height</label>
                    <input
                      type="text"
                      value={selectedElement.responsive.tablet?.height || ''}
                      onChange={(e) => handleResponsiveUpdate('tablet', 'height', e.target.value)}
                      placeholder="auto or number"
                      className="w-full bg-gray-700 text-white px-2 py-1 rounded text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Desktop Settings */}
              <div>
                <h4 className="text-gray-300 text-xs font-medium mb-2">🖥️ Desktop</h4>
                <p className="text-xs text-gray-500 italic">Uses base position by default</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleDelete}
          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          🗑️ Delete Element
        </button>
      </div>
    </div>
  );
};

export default PropertiesPanel;

