import LoginDialog from "@/components/auth/LoginDialog";
import type { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import { Outlet } from "react-router-dom";

const ProtectedRoutes: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated,
  );

  if (isAuthenticated) {
    return <Outlet />;
  }
  return (
    <div className="h-screen w-full">
      <LoginDialog showLoginButton={false} openDialog  />
    </div>
  );
};

export default ProtectedRoutes;
