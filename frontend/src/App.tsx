import { Route, Routes } from "react-router-dom";
import "./App.css";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Movie from "./pages/Movie";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import MovieCreate from "./pages/admin/MovieCreate";
import AdminVideos from "./pages/admin/AdminVideos";
import ProtectedRoutes from "./layouts/auth/ProtectedRoutes";
import AdminProtectedRoutes from "./layouts/auth/AdminProtectedRoutes";

function App() {
  return (
    <Routes>
      {/* admin routes */}
      <Route element={<AdminProtectedRoutes/>}>
        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="movies/add" element={<MovieCreate />} />
          <Route path="movies" element={<AdminVideos />} />
        </Route>
      </Route>
      {/* user routes */}
      <Route path="/*" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="movies" element={<Movies />} />
        <Route element={<ProtectedRoutes />}>
          <Route path="movies/:id" element={<Movie />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
