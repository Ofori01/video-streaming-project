import React from "react";
import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";

const MainLayout: React.FC = () => {
  return (
    <div className="relative bg-black">
      <main>
        <Toaster position="top-right" />
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
