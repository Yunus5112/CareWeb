import type { CardElement as CardElementType } from '../../types';

interface CardElementProps {
  element: CardElementType;
}

const CardElement = ({ element }: CardElementProps) => {
  return (
    <div className="w-full h-full bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
      {/* Image Area */}
      {element.content.image ? (
        <div className="h-32 bg-gradient-to-br from-blue-400 to-purple-500" />
      ) : (
        <div className="h-32 bg-gray-200 flex items-center justify-center">
          <span className="text-4xl">{element.content.icon || '📦'}</span>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 p-4">
        <h3 className="font-bold text-lg mb-2 text-gray-900">
          {element.content.title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {element.content.description}
        </p>
      </div>

      {/* Button */}
      {element.content.buttonText && (
        <div className="p-4 pt-0">
          <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors">
            {element.content.buttonText}
          </button>
        </div>
      )}
    </div>
  );
};

export default CardElement;

