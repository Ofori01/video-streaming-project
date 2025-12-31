import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useMemo } from "react";

interface CarouselNavigationProps {
  current: number;
  totalItems: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  sectionTitle: string;
}

const CarouselNavigation: React.FC<CarouselNavigationProps> = ({
  current,
  totalItems,
  canScrollPrev,
  canScrollNext,
  onPrev,
  onNext,
  sectionTitle,
}) => {
  const indicators = useMemo(
    () =>
      Array.from({ length: totalItems }).map((_, index) => (
        <span
          key={index}
          className={`${
            current === index + 1 ? "w-5 bg-destructive!" : "w-2"
          } h-0.5 bg-destructive/30 rounded-4xl transition-all duration-500 ease-linear`}
        />
      )),
    [totalItems, current]
  );

  return (
    <div className="flex flex-row items-center justify-between w-full">
      <p className="text-secondary font-body text-lg uppercase">
        {sectionTitle}
      </p>
      <div className="flex flex-row items-center justify-between gap-x-3 md:min-w-5 p-2 bg-gray-900/10 outline backdrop-blur-sm rounded-lg">
        <button
          onClick={onPrev}
          disabled={!canScrollPrev}
          className="cursor-pointer outline p-2 rounded-md text-secondary bg-gray-300/30 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Previous slide"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="inline-flex gap-x-1">{indicators}</div>
        <button
          onClick={onNext}
          disabled={!canScrollNext}
          className="cursor-pointer outline p-2 rounded-md text-secondary bg-gray-300/30 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          aria-label="Next slide"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default React.memo(CarouselNavigation);