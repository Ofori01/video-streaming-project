import React, { useState, useCallback } from "react";
import VideoPosterCard from "./VideoPosterCard";
import CarouselNavigation from "./CarouselNavigation";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import type { IVideo } from "@/types/Videos";

interface HomeSectionProps {
  sectionTitle: string;
  VideoList: IVideo[];
  isLoading?: boolean;
}

const PosterSkeleton: React.FC = () => (
  <div className="flex flex-col gap-y-4 p-3 h-full outline rounded-lg bg-gray-100/10">
    <Skeleton className="w-full aspect-4/5 rounded-lg opacity-20" />
    <div className="flex flex-col gap-2">
      <Skeleton className="h-5 w-3/4 opacity-20" />
      <Skeleton className="h-3 w-full opacity-20" />
      <Skeleton className="h-3 w-2/3 opacity-20" />
    </div>
    <div className="inline-flex mt-auto justify-between">
      <Skeleton className="h-6 w-16 rounded-full opacity-20" />
      <Skeleton className="h-6 w-16 rounded-full opacity-20" />
    </div>
  </div>
);

const HomeSections: React.FC<HomeSectionProps> = ({
  VideoList,
  sectionTitle,
  isLoading = false,
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    const updateScrollState = () => {
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    };

    updateScrollState();
    api.on("select", updateScrollState);

    return () => {
      api.off("select", updateScrollState);
    };
  }, [api]);

  const handlePrev = useCallback(() => {
    if (api?.canScrollPrev()) {
      api.scrollPrev();
    }
  }, [api]);

  const handleNext = useCallback(() => {
    if (api?.canScrollNext()) {
      api.scrollNext();
    }
  }, [api]);

  return (
    <div className="flex flex-col gap-y-3">
      <CarouselNavigation
        current={current}
        totalItems={count}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
        onPrev={handlePrev}
        onNext={handleNext}
        sectionTitle={sectionTitle}
      />

      <Carousel
        setApi={setApi}
        opts={{ align: "start", loop: false, skipSnaps: false }}
        className="w-full overflow-visible"
      >
        <CarouselContent className="py-2">
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <CarouselItem
                  key={i}
                  className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                >
                  <PosterSkeleton />
                </CarouselItem>
              ))
            : VideoList.map((video) => {
                const duration =
                  video.duration != null
                    ? `${Math.floor(video.duration / 60)}:${String(video.duration % 60).padStart(2, "0")}`
                    : null;
                return (
                  <CarouselItem
                    key={video.id}
                    className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                  >
                    <VideoPosterCard
                      id={video.id}
                      description={video.description ?? ""}
                      title={video.title}
                      thumbnail={video.thumbnail?.url ?? ""}
                      views="20"
                      duration={duration || "20m"}
                    />
                  </CarouselItem>
                );
              })}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HomeSections;
