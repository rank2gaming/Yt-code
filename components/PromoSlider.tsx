
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../contexts/AuthContext';
import { ref, onValue } from 'firebase/database';

interface Slide {
  id: string;
  image: string;
  url: string;
  title?: string;
  subtitle?: string;
}

const PromoSlider: React.FC = () => {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const sliderRef = ref(db, 'slider/');
    const unsubscribe = onValue(sliderRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (typeof data === 'object' && data !== null) {
          const loadedSlides: Slide[] = Object.keys(data)
            .map(key => {
                const slideData = data[key];
                if (typeof slideData === 'object' && slideData !== null && slideData.image && slideData.url) {
                    return {
                        id: key,
                        ...slideData
                    } as Slide;
                }
                return null;
            })
            .filter((s): s is Slide => s !== null);
          setSlides(loadedSlides);
        } else {
          setSlides([]);
        }
      } else {
        setSlides([]);
      }
    });

    return () => unsubscribe();
  }, []);
  
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    if (slides.length > 1) {
        resetTimeout();
        timeoutRef.current = setTimeout(
            () => setCurrentIndex((prevIndex) =>
                prevIndex === slides.length - 1 ? 0 : prevIndex + 1
            ),
            3000
        );
        return () => {
            resetTimeout();
        };
    }
  }, [currentIndex, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="my-4 relative w-full aspect-[16/8] overflow-hidden rounded-xl shadow-lg">
        <div 
            className="flex transition-transform ease-in-out duration-500 h-full"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
            {slides.map((slide) => (
                <a 
                    href={slide.url} 
                    key={slide.id} 
                    className="relative w-full flex-shrink-0 h-full"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img src={slide.image} alt={slide.title || 'Promo'} className="w-full h-full object-cover" />
                    {(slide.title || slide.subtitle) && (
                         <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
                            {slide.title && <h3 className="text-xl font-bold">{slide.title}</h3>}
                            {slide.subtitle && <p className="text-sm mt-1">{slide.subtitle}</p>}
                        </div>
                    )}
                </a>
            ))}
        </div>
        {slides.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => goToSlide(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${currentIndex === idx ? 'bg-white scale-110' : 'bg-white/50'}`}
                        aria-label={`Go to slide ${idx + 1}`}
                    ></button>
                ))}
            </div>
        )}
    </div>
  );
};

export default PromoSlider;
