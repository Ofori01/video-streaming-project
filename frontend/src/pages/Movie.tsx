import React from "react";
import profile1 from "../assets/banner_1.png";
import VideoDescriptionCard from "@/components/Videos/VideoDescriptionCard";
import VideoPlayer from "@/components/Videos/VideoPlayer";
import RelatedVideosSection from "@/components/Videos/RelatedVideosSection";

const Movie: React.FC = () => {
  // const { id } = useParams();

  //   Todo - /api/video/id and display results --no prop

  return (
    <div className="min-h-screen py-15 px-15 text-secondary ">
      {/* content */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-x-3 h-full">
        {/* video player */}
        <div className="col-span-2">
          <VideoPlayer className="spread-bg" />
          
          {/* title and user profile with additional buttons */}
          <div className="mt-2 flex flex-col gap-2">
            <span className="text-xl font-medium">
              MAGGI December x Revel recap | Where Flavor Meets the Vibe
            </span>
            <div className="inline-flex justify-between items-center">
              {/* logo and author + follow and follow count */}
              <div className="flex flex-row gap-x-3 bg-red-0">
                {/* logo */}
                <div className="w-13 h-13 rounded-full overflow-hidden ">
                  <img src={profile1} className="w-full h-full object-cover" />
                </div>
                {/* title and followers */}
                <div className="flex flex-col justify-center">
                  <span className="tracking-wide text-lg">MAGGI GHANA</span>
                  <span className="text-gray-400">34k followers</span>
                </div>
              </div>
              <button className="py-3 px-5 bg-gray-200 text-sm cursor-pointer hover:bg-gray-300 text-primary rounded-[1234px]">
                Subscribe
              </button>
            </div>
          </div>
          {/* video description with see more */}
          <div>
            <VideoDescriptionCard
              createdAt="Sep 17,2023"
              categories={["Gaming", "Entertainment", "Sports"]}
              description="If you work in research, you already know the struggle:
              hallucinated answers, fake citations, dead-end links, and endless
              PDFs. Bohrium changes that. We connect 170M+ research papers and
              20M active scholars to give you verified, traceable insights you
              can actually trust. Think of it as a GPS for the scientific world.
              It is an AI for Science research tool that helps you work faster
              and with confidence. WHAT YOU WILL LEARN ✅ Run accurate
              literature reviews with 100% traceable sources ✅ Map the scholar
              network and see who influences your field ✅ Summarize papers
              instantly with charts and key insights ✅ Build a personal
              Knowledge Base to organize your research ✅ Generate
              conference-ready posters with AI Poster"
            />
          </div>
        </div>

        {/* related videos section */}
        <div className="col-span-1 overflow-y-auto mt-5 lg:mt-0  h-screen custom-scrollbar ">
          <RelatedVideosSection />
        </div>
      </div>
    </div>
  );
};

export default Movie;
