import type { ContainerElement as ContainerElementType } from '../../types';

interface ContainerElementProps {
  element: ContainerElementType;
}

const ContainerElement = ({ element }: ContainerElementProps) => {
  return (
    <div 
      className="w-full h-full rounded-lg border-2 border-dashed border-gray-300 p-4"
      style={{
        backgroundColor: element.content.backgroundColor || 'transparent',
        padding: element.content.padding || 20,
        display: 'grid',
        gridTemplateColumns: `repeat(${element.content.columns}, 1fr)`,
        gap: element.content.gap || 20
      }}
    >
      {Array.from({ length: element.content.columns }).map((_, index) => (
        <div 
          key={index}
          className="bg-gray-100 rounded flex items-center justify-center text-gray-400"
        >
          Column {index + 1}
        </div>
      ))}
    </div>
  );
};

export default ContainerElement;

