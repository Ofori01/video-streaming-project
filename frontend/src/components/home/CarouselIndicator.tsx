import { cn } from "@/lib/utils";
import React from "react";

interface CarouselIndicatorProps {
  count: number;
  current: number;
  className: string;
  onIndicatorClick?: (index: number) => void;
}

interface CircleProps {
  className: string;
}

const CarouselIndicators: React.FC<CarouselIndicatorProps> = ({
  count,
  current,
  className,
  onIndicatorClick,
}) => {
  return (
    <div className={cn(className, "flex flex-row gap-x-3 p-2 w-fit")}>
      {Array.from({ length: count }).map((_, index) => (
        <button key={index} onClick={() => onIndicatorClick?.(index)}>
          <IndicatorCircle
            className={`${current === index ? "bg-gray-50" : "bg-gray-400 hover:bg-gray-400/50"} `}
          />
        </button>
      ))}
    </div>
  );
};

const IndicatorCircle: React.FC<CircleProps> = ({ className }) => {
  return (
    <div
      className={cn(
        className,
        "h-4 w-4 rounded-full transition-all cursor-pointer"
      )}
    ></div>
  );
};

export default CarouselIndicators;
