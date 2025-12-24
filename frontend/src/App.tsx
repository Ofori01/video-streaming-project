import { Route, Routes } from 'react-router-dom'
import './App.css'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Movies from './pages/Movies'

function App() {

  return (
    <Routes >
      <Route path='/*' element={<MainLayout/>} >
        <Route index element={<Home/>} />
        <Route path='movies' element={<Movies/>} />
      </Route>
    </Routes>
  )
}

export default App
