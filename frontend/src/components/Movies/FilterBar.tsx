import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "../ui/carousel";
import { cn } from "@/lib/utils";

const FilterBar: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <div
      className={cn("sticky backdrop-blur-3xl bg-transparent mt-8", className)}
    >
      {/* left arrow */}
      {/* right arrow */}
      {/* filters */}
      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="md:-ml-4">
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="All" isActive={true} />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Computer Engineering" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Action" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Comedy" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Drama" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Thriller" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category categoryName="Sci-Fi" />
          </CarouselItem>
        </CarouselContent>
        <FilterBarNavButtons />
      </Carousel>
    </div>
  );
};

const Category: React.FC<{ categoryName: string; isActive?: boolean }> = ({
  categoryName,
  isActive,
}) => {
  return (
    <span
      className={` ${
        isActive && "bg-secondary! text-primary"
      } px-4 py-2 bg-gray-400/25 backdrop-blur-3xl rounded-lg w-fit text-nowrap`}
    >
      {categoryName}
    </span>
  );
};

const FilterBarNavButtons = () => {
  const { canScrollNext, canScrollPrev } = useCarousel();

  return (
    <>
      {canScrollNext && (
        <CarouselNext className="absolute text-secondary bg-black outline-none border-0 right-0" />
      )}

      {canScrollPrev && (
        <CarouselPrevious className="absolute left-0 bg-black border-0" />
      )}
    </>
  );
};
export default FilterBar;
