

import MovieCard from '@/components/home/MovieCard'
import FilterBar from '@/components/Movies/FilterBar'
import React from 'react'
import banner3 from '../assets/banner_3.jpg'
const Movies : React.FC = () => {
  return (
    <div className='bg-black text-secondary relative px-15 py-15'>
      {/* filters bar */}
      <FilterBar className='mt-15' />

      {/* movie list, 3 columns */}
      <div className='mt-5 grid grid-cols-1 gap-y-5 gap-x-5 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({length: 30}).map((_,index)=> (
          <MovieCard title='Nice title' description='Nice looooong description fooooor the videoooooo soooo userssss cannn watchhh' duration='200min' views='20m' key={index} thumbnail={banner3}/>
        ))}

      </div>
    </div>
  )
}

export default Movies
