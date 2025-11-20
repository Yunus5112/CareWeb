import { useState } from 'react';
import type { SliderElement as SliderElementType } from '../../types';

interface SliderElementProps {
  element: SliderElementType;
}

const SliderElement = ({ element }: SliderElementProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => 
      prev === element.content.slides.length - 1 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => 
      prev === 0 ? element.content.slides.length - 1 : prev - 1
    );
  };

  const currentSlideData = element.content.slides[currentSlide];

  return (
    <div className="w-full h-full bg-gray-200 rounded-lg overflow-hidden relative group">
      {/* Slide */}
      {currentSlideData?.image ? (
        <img 
          src={currentSlideData.image} 
          alt={currentSlideData.caption || 'Slide'}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="text-6xl mb-4">🖼️</div>
            <p className="text-xl font-semibold">{currentSlideData?.caption || 'Slide'}</p>
          </div>
        </div>
      )}

      {/* Navigation Arrows */}
      {element.content.showNavigation && element.content.slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            ←
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            →
          </button>
        </>
      )}

      {/* Indicators */}
      {element.content.showIndicators && element.content.slides.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {element.content.slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'bg-white w-6' 
                  : 'bg-white bg-opacity-50 hover:bg-opacity-75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SliderElement;

