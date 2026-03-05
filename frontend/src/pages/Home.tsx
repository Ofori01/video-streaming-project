import HeroSection from "@/components/home/HeroSection";
import React, { useMemo } from "react";
import HomeSections from "@/components/home/HomeSections";
import { useGetAllVideos } from "@/hooks/queries/useVideoQuerries";
import type { IVideo } from "@/types/Videos";

const Home: React.FC = () => {
  const { data: videos = [], isLoading } = useGetAllVideos();

  const heroVideos = useMemo(() => videos.slice(0, 5), [videos]);

  const categoryGroups = useMemo(() => {
    const map = new Map<string, { name: string; videos: IVideo[] }>();
    for (const video of videos) {
      const catId = video.category?.id
        ? String(video.category.id)
        : "uncategorized";
      const catName = video.category?.name ?? "All Videos";
      if (!map.has(catId)) {
        map.set(catId, { name: catName, videos: [] });
      }
      map.get(catId)!.videos.push(video);
    }
    return Array.from(map.values());
  }, [videos]);

  return (
    <div className="relative text-secondary bg-black min-h-screen">
      <HeroSection videos={heroVideos} isLoading={isLoading} />

      <div className="py-15 px-15 flex flex-col gap-y-10">
        {isLoading && categoryGroups.length === 0 ? (
          <>
            <HomeSections sectionTitle="Loading…" VideoList={[]} isLoading />
            <HomeSections sectionTitle="Loading…" VideoList={[]} isLoading />
          </>
        ) : (
          categoryGroups.map((group) => (
            <HomeSections
              key={group.name}
              sectionTitle={group.name}
              VideoList={group.videos}
              isLoading={false}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
