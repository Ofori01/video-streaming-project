import React, { useState, useCallback } from "react";
import VideoPosterCard from "./VideoPosterCard";
import CarouselNavigation from "./CarouselNavigation";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export interface VIDEO {
  id: number;
  title: string;
  description: string;
  author: string;
  release_date: string;
  duration: string;
  thumbnail: string;
}

interface HomeSectionProps {
  sectionTitle: string;
  VideoList: VIDEO[];
}

const HomeSections: React.FC<HomeSectionProps> = ({
  VideoList,
  sectionTitle,
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
          {VideoList.map((video) => (
            <CarouselItem
              key={video.id}
              className="basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <VideoPosterCard
                description={video.description}
                title={video.title}
                thumbnail={video.thumbnail}
                views="2k"
                duration={video.duration}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default React.memo(HomeSections);
