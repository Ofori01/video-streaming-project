import HeroSection from "@/components/home/HeroSection";
import React from "react";
import banner2 from "../assets/banner_2.png";
import banner3 from "../assets/banner_3.jpg";
import HomeSections, { type VIDEO } from "@/components/home/HomeSections";

const Home: React.FC = () => {
  const data: Array<VIDEO> = [
    {
      author: "Sam",
      description: "Barcelona 2012 highlights",
      duration: "3hr",
      id: 1,
      release_date: "2020",
      thumbnail: banner2,
      title: "Barcelona La Liga",
    },
    {
      title: "SpiderMan",
      author: "Mark",
      description: "In the multiverse of Madness",
      duration: "2hr",
      id: 2,
      release_date: "2020",
      thumbnail: banner3,
    },
    {
      title: "The Dark Knight",
      author: "Christopher Nolan",
      description: "Batman faces the Joker in Gotham City",
      duration: "2hr 32min",
      id: 3,
      release_date: "2008",
      thumbnail: banner2,
    },
    {
      title: "Inception",
      author: "Christopher Nolan",
      description: "A thief who enters dreams to steal secrets",
      duration: "2hr 28min",
      id: 4,
      release_date: "2010",
      thumbnail: banner3,
    },
    {
      title: "Manchester United Champions",
      author: "David",
      description: "Premier League 2013 season highlights",
      duration: "2hr 45min",
      id: 5,
      release_date: "2013",
      thumbnail: banner2,
    },
    {
      title: "Avengers Endgame",
      author: "Russo Brothers",
      description: "The epic conclusion to the Infinity Saga",
      duration: "3hr 2min",
      id: 6,
      release_date: "2019",
      thumbnail: banner3,
    },
    {
      title: "Avengers Endgame",
      author: "Russo Brothers",
      description: "The epic conclusion to the Infinity Saga",
      duration: "3hr 2min",
      id: 7,
      release_date: "2019",
      thumbnail: banner3,
    },
    {
      title: "Avengers Endgame",
      author: "Russo Brothers",
      description: "The epic conclusion to the Infinity Saga",
      duration: "3hr 2min",
      id: 8,
      release_date: "2019",
      thumbnail: banner3,
    },
    {
      title: "Avengers Endgame",
      author: "Russo Brothers",
      description: "The epic conclusion to the Infinity Saga",
      duration: "3hr 2min",
      id: 9,
      release_date: "2019",
      thumbnail: banner3,
    },
    {
      title: "Avengers Endgame",
      author: "Russo Brothers",
      description: "The epic conclusion to the Infinity Saga",
      duration: "3hr 2min",
      id: 10,
      release_date: "2019",
      thumbnail: banner3,
    },
  ];
  return (
    <div className="relative text-secondary bg-black min-h-screen">
      <HeroSection />
      {/* trending now videos */}
      <div className="py-15 px-15">
        <HomeSections sectionTitle="trending now" VideoList={data} />
      </div>

      {/* new releases */}
      <div className="px-15 ">
        <HomeSections sectionTitle="new release" VideoList={data} />
      </div>

    </div>
  );
};

export default Home;
