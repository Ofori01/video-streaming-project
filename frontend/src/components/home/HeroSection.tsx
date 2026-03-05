import React, { useState } from "react";
import CarouselIndicators from "./CarouselIndicator";
import bannerImage1 from "../../assets/banner_1.png";
import { Dot, Play } from "lucide-react";
import { useEffect } from "react";
import ShinyText from "../ui/ShinnyText";
import type { IVideo } from "@/types/Videos";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

interface HeroSlide {
  id: number;
  title: string;
  backgroundImage: string;
  categories: string[];
  description: string;
}

interface HeroSectionProps {
  videos?: IVideo[];
  isLoading?: boolean;
}

const mapToSlide = (video: IVideo): HeroSlide => ({
  id: video.id,
  title: video.title,
  backgroundImage: video.thumbnail?.url ?? bannerImage1,
  categories: video.category ? [video.category.name] : [],
  description:
    video.description.length > 70
      ? video.description.slice(0, 70) + "…"
      : video.description,
});

const HeroSection: React.FC<HeroSectionProps> = ({
  videos = [],
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides: HeroSlide[] =
    videos.length > 0 ? videos.slice(0, 5).map(mapToSlide) : [];

  const current = slides[currentSlide];

  const goToSlide = React.useCallback(
    (index: number) => setCurrentSlide(index),
    [],
  );

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % slides.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [currentSlide, goToSlide, slides.length]);

  if (isLoading) {
    return (
      <div className="relative h-screen w-full bg-black overflow-hidden">
        <Skeleton className="absolute inset-0 opacity-30 rounded-none" />
        <div className="relative flex flex-col gap-y-4 top-[30vh] ml-10 p-5">
          <div className="flex gap-x-2">
            <Skeleton className="h-6 w-20 rounded-full opacity-30" />
            <Skeleton className="h-6 w-20 rounded-full opacity-30" />
          </div>
          <Skeleton className="h-16 w-2/3 opacity-30" />
          <Skeleton className="h-5 w-1/3 opacity-30" />
          <div className="flex gap-x-3">
            <Skeleton className="h-12 w-32 rounded-full opacity-30" />
            <Skeleton className="h-12 w-24 rounded-full opacity-30" />
          </div>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div
      className="relative h-screen w-full bg-cover bg-center md:bg-top bg-no-repeat overflow-hidden transition-all ease-linear duration-700"
      style={{ backgroundImage: `url(${current.backgroundImage})` }}
    >
      <div className="relative flex flex-col gap-y-3 md:gap-y-3 lg:gap-y-4 top-[20vh] md:top-[20vh] lg:top-[30vh] ml-10 p-5 h-[115vh] md:h-[110vh] lg:h-[105vh]">
        {/* categories */}
        <div className="flex flex-row gap-x-2 shrink-0">
          {current.categories.map((category, index) => (
            <span
              key={index}
              className="bg-secondary/15 backdrop-blur-md border border-secondary/30 rounded-[1234px] px-3 py-1 text-xs md:text-sm text-secondary"
            >
              {category}
            </span>
          ))}
        </div>

        <h3 className="text-secondary text-4xl md:text-6xl lg:text-7xl xl:text-8xl uppercase shrink-0">
          {current.title}
        </h3>

        <span className="inline-flex items-center uppercase text-sm md:text-base lg:text-lg font-body shrink-0">
          <Dot size={32} className="md:w-12 md:h-12" />
          {current.description}
        </span>

        <div className="inline-flex items-center gap-x-3 md:gap-x-4 shrink-0">
          <button
            onClick={() => navigate(`/movies/${current.id}`)}
            className="btn inline-flex items-center gap-x-2 text-sm md:text-base"
          >
            <Play className="w-4 h-4 md:w-5 md:h-5" />
            <ShinyText delay={0.5} yoyo pauseOnHover text="Play Now" />
          </button>
          <button
            onClick={() => navigate(`/movies/${current.id}`)}
            className="bg-transparent btn inline-flex border border-dashed text-sm md:text-base"
          >
            Details
          </button>
        </div>
      </div>

      <div className="absolute inset-0 bg-linear-to-b from-transparent from-70% via-transparent to-black pointer-events-none" />
      <CarouselIndicators
        className="mx-auto z-100 absolute bottom-12 left-15 right-0"
        count={slides.length}
        current={currentSlide}
        onIndicatorClick={goToSlide}
      />
    </div>
  );
};

export default HeroSection;
