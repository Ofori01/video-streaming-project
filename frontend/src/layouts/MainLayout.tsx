import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const MainLayout: React.FC = () => {
  return (
    <div className="relative bg-black">
      <Navbar />
      <main>
        <Toaster position="top-right" />
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
