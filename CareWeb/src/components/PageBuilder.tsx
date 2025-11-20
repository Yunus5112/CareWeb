import { BuilderProvider } from '../store/BuilderContext';
import Sidebar from './Sidebar';
import Canvas from './Canvas';
import Toolbar from './Toolbar';

const PageBuilder = () => {
  return (
    <BuilderProvider>
      <div className="h-screen flex flex-col bg-gray-900">
        {/* Top Toolbar */}
        <Toolbar />
        
        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar */}
          <Sidebar />
          
          {/* Canvas Area */}
          <Canvas />
        </div>
      </div>
    </BuilderProvider>
  );
};

export default PageBuilder;

