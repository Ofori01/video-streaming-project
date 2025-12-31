import React from "react";
import ReactPlayer from "react-player";
import profile1 from "../assets/banner_1.png";
import { useParams } from "react-router-dom";

const Movie: React.FC = () => {
  const { id } = useParams();

  //   Todo - /api/video/id and display results --no prop

  return (
    <div className="h-screen py-15 px-15 text-secondary ">
      {/* content */}
      <div className="mt-10 grid grid-cols-3 gap-x-3 h-full">
        {/* video player */}
        <div className="col-span-2">
          <div className=" w-full rounded-xl  overflow-hidden ">
            <ReactPlayer
              controls
              src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
              style={{ width: "100%", height: "auto", aspectRatio: "16/9" }}
            />
          </div>
          {/* title and user profile with additional buttons */}
          <div className="mt-2 flex flex-col gap-2">
            <span className="text-xl font-semibold">
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
                <button className="py-3 px-5 bg-gray-200 text-sm hover:bg-gray-300 text-primary rounded-[1234px]">
                    Subscribe
                </button>
            </div>
          </div>
          {/* video description with see more */}
          <div>
            
          </div>
        </div>

        {/* related videos section */}
        <div className="col-span-1 overflow-y-auto  h-full custom-scrollbar ">
          <div className="bg-blue-400 w-full">
            {Array.from({ length: 100 }).map((_, index) => (
              <div key={index}>{id}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
