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
import { useGetAllVideoCategories } from "@/hooks/queries/useVideoQuerries";
import { Skeleton } from "../ui/skeleton";

interface FilterBarProps {
  className?: string;
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string | undefined) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  className,
  selectedCategoryId,
  onSelectCategory,
}) => {
  const { data: categories = [], isPending } = useGetAllVideoCategories();
  return (
    <div className={cn("backdrop-blur-3xl z-10", className)}>
      <Carousel
        className="w-full"
        opts={{
          align: "start",
        }}
      >
        <CarouselContent className="md:-ml-4">
          {/* "All" pill */}
          <CarouselItem className="pl-2 md:pl-4 py-2 basis-auto">
            <Category
              categoryName="All"
              isActive={!selectedCategoryId}
              onClick={() => onSelectCategory?.(undefined)}
            />
          </CarouselItem>

          {isPending
            ? Array.from({ length: 6 }).map((_, i) => (
                <CarouselItem key={i} className="pl-2 md:pl-4 py-2 basis-auto">
                  <Skeleton className="h-8 w-24 rounded-lg opacity-30" />
                </CarouselItem>
              ))
            : categories.map((cat) => (
                <CarouselItem
                  key={cat.id}
                  className="pl-2 md:pl-4 py-2 basis-auto"
                >
                  <Category
                    categoryName={cat.name}
                    isActive={selectedCategoryId === String(cat.id)}
                    onClick={() =>
                      onSelectCategory?.(
                        selectedCategoryId === String(cat.id)
                          ? undefined
                          : String(cat.id),
                      )
                    }
                  />
                </CarouselItem>
              ))}
        </CarouselContent>
        <FilterBarNavButtons />
      </Carousel>
    </div>
  );
};

const Category: React.FC<{
  categoryName: string;
  isActive?: boolean;
  onClick?: () => void;
}> = ({ categoryName, isActive, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={cn(
        "px-4 py-2 bg-gray-400/25 backdrop-blur-3xl rounded-lg w-fit text-nowrap cursor-pointer transition-colors",
        isActive && "bg-secondary! text-primary",
        !isActive && "hover:bg-gray-400/40",
      )}
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
        <CarouselNext className="absolute text-secondary bg-black outline-none border-0 -right-9" />
      )}
      {canScrollPrev && (
        <CarouselPrevious className="absolute -left-9 bg-black border-0" />
      )}
    </>
  );
};
export default FilterBar;
