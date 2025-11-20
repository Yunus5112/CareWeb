import type { TextContentElement as TextContentElementType } from '../../types';

interface TextContentElementProps {
  element: TextContentElementType;
}

const TextContentElement = ({ element }: TextContentElementProps) => {
  return (
    <div 
      className="w-full h-full p-4 bg-white rounded overflow-auto"
      style={{
        fontSize: element.content.fontSize || 16,
        fontWeight: element.content.fontWeight || 'normal',
        color: element.content.color || '#000000',
        textAlign: element.content.alignment || 'left'
      }}
    >
      <div 
        dangerouslySetInnerHTML={{ __html: element.content.html }}
      />
    </div>
  );
};

export default TextContentElement;

