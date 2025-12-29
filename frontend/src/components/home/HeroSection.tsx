import React, { useState } from "react";
import CarouselIndicators from "./CarouselIndicator";
import bannerImage1 from "../../assets/banner_1.png";
import bannerImage2 from "../../assets/banner_2.png";
import bannerImage3 from "../../assets/banner_3.jpg";
import { Dot, Play } from "lucide-react";
import { useEffect } from "react";

interface HeroSlide {
  id: number;
  title: string;
  backgroundImage: string;
  categories: string[];
  episode: string;
  description: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "HANDMAIDEN TALES",
    backgroundImage: bannerImage1,
    categories: ["Sci-Fi", "Thriller", "Fantasy"],
    episode: "S1E2",
    description: "The origins of evil",
  },
  {
    id: 2,
    title: "STRANGER THINGS",
    backgroundImage: bannerImage2,
    categories: ["Horror", "Drama", "Mystery"],
    episode: "S4E1",
    description: "The hellfire club",
  },
  {
    id: 3,
    title: "Spider Man",
    backgroundImage: bannerImage3,
    categories: ["Fantasy", "Drama", "Mystery"],
    episode: "S4E1",
    description: "In the multiverse of madness",
  },
];

const HeroSection: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const current = heroSlides[currentSlide];

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      goToSlide((currentSlide + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  return (
    <div
      className="h-screen  w-full bg-cover bg-center md:bg-top bg-no-repeat overflow-hidden transition-all ease-linear duration-700"
      style={{ backgroundImage: `url(${current.backgroundImage})` }}
    >
      <div className="relative flex flex-col gap-y-3 md:gap-y-3 lg:gap-y-4 top-[10vh] md:top-[20vh] lg:top-[30vh] ml-10 p-5 h-[115vh] md:h-[110vh] lg:h-[105vh]">
        {/* title and categories */}
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

        {/* brief description */}
        <span className="inline-flex items-center uppercase text-sm md:text-base lg:text-lg font-body shrink-0">
          {current.episode}
          <Dot size={32} className="md:w-12 md:h-12" />
          {current.description}
        </span>

        {/* play button with details button  */}
        <div className="inline-flex items-center gap-x-3 md:gap-x-4 shrink-0">
          <button className="btn inline-flex gap-x-2 text-sm md:text-base">
            <Play className="w-4 h-4 md:w-5 md:h-5" />
            Play {current.episode}
          </button>

          <button className="bg-transparent btn inline-flex border border-dashed text-sm md:text-base">
            Details
          </button>
        </div>

        {/* carousel */}

        <CarouselIndicators
          className="mx-auto"
          count={heroSlides.length}
          current={currentSlide}
          onIndicatorClick={goToSlide}
        />
      </div>
    </div>
  );
};

export default HeroSection;
