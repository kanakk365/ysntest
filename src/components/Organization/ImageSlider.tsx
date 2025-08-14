import React, { useEffect, useState } from 'react'
import { Carousel, CarouselContent, CarouselApi } from '../ui/carousel';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface props {
    children :React.ReactNode,
    className ?:string
}

export default function ImageSlider ({children, className=""}:props) {
    const [carouselApi, setCarouselApi] = useState<CarouselApi>();
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    useEffect(() => {
        if (!carouselApi) {
          return;
        }
        const updateSelection = () => {
          setCanScrollPrev(carouselApi.canScrollPrev());
          setCanScrollNext(carouselApi.canScrollNext());
        };
        updateSelection();
        carouselApi.on("select", updateSelection);
        return () => {
          carouselApi.off("select", updateSelection);
        };
      }, [carouselApi]);

  return (
    <div className='relative'>
        <button
           onClick={() => {
            carouselApi?.scrollPrev();
          }}
          disabled={!canScrollPrev}
          className="absolute left-5 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-20 disabled:opacity-40 disabled:cursor-not-allowed"
          >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button
            onClick={() => {
                carouselApi?.scrollNext();
            }}
            disabled={!canScrollNext}
            className="absolute right-5 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors z-20 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        <Carousel setApi={setCarouselApi} opts={{ loop: false, dragFree: true, align: "start" }}>
            <CarouselContent className={`ml-0 md:ml-10 flex gap-6 md:gap-20 ${className}`}>
                {children}
            </CarouselContent>
        </Carousel>
    </div>

  );  
}
