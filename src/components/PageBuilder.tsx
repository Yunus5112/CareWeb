import { BuilderProvider } from '../store/BuilderContext';
import { useKeyboardShortcuts } from '../hooks';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import Toolbar from './Toolbar';
import PropertiesPanel from './PropertiesPanel';

const PageBuilderContent = () => {
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col bg-gray-900">
      {/* Top Toolbar */}
      <Toolbar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />
        
        {/* Canvas Area */}
        <Canvas />
        
        {/* Right Properties Panel */}
        <PropertiesPanel />
      </div>
    </div>
  );
};

const PageBuilder = () => {
  return (
    <BuilderProvider>
      <PageBuilderContent />
    </BuilderProvider>
  );
};

export default PageBuilder;

