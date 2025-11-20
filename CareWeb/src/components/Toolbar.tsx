import { useRef } from 'react';
import { useBuilder } from '../store/BuilderContext';
import { ViewportMode, isOk, formatErrorMessage } from '../types';
import { UI_MESSAGES } from '../constants';

const Toolbar = () => {
  const { state, setViewportMode, exportJSON, importJSON } = useBuilder();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const result = exportJSON();
    
    if (!isOk(result)) {
      alert(`${UI_MESSAGES.EXPORT_FAILED}\n\n${formatErrorMessage(result.error)}`);
      return;
    }
    
    const blob = new Blob([result.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${state.project.metadata.name.toLowerCase().replace(/\s+/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    // Optional: Show success message
    console.log(UI_MESSAGES.PROJECT_SAVED);
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const json = event.target?.result as string;
      
      // Import with proper error handling
      const result = importJSON(json);
      
      if (!isOk(result)) {
        alert(`${UI_MESSAGES.IMPORT_FAILED}\n\n${formatErrorMessage(result.error)}`);
        return;
      }
      
      alert(UI_MESSAGES.PROJECT_LOADED);
    };
    reader.readAsText(file);
    
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="h-16 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-6">
      {/* Left: Project Name */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚀</span>
          <h1 className="text-xl font-bold text-white">Test Builder</h1>
        </div>
        
        <div className="h-6 w-px bg-gray-700" />
        
        <div className="text-sm text-gray-400">
          {state.project.metadata.name}
          {state.project.hasUnsavedChanges && (
            <span className="ml-2 text-yellow-400">• Unsaved</span>
          )}
        </div>
      </div>

      {/* Center: Viewport Mode Selector */}
      <div className="flex items-center gap-2 bg-gray-700 rounded-lg p-1">
        <button
          onClick={() => setViewportMode(ViewportMode.DESKTOP)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            state.canvas.viewportMode === ViewportMode.DESKTOP
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          🖥️ Desktop
        </button>
        <button
          onClick={() => setViewportMode(ViewportMode.TABLET)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            state.canvas.viewportMode === ViewportMode.TABLET
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          📱 Tablet
        </button>
        <button
          onClick={() => setViewportMode(ViewportMode.MOBILE)}
          className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
            state.canvas.viewportMode === ViewportMode.MOBILE
              ? 'bg-blue-600 text-white'
              : 'text-gray-300 hover:text-white'
          }`}
        >
          📱 Mobile
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />
        
        <button
          onClick={handleImport}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📥 Import JSON
        </button>
        
        <button
          onClick={handleExport}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          💾 Export JSON
        </button>
        
        <button
          className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ⚙️ Settings
        </button>
      </div>
    </div>
  );
};

export default Toolbar;

