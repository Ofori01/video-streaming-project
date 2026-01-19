import LoginDialog from "@/components/auth/LoginDialog";
import type { RootState } from "@/store/store";
import { USER_ROLE } from "@/types/User";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const AdminProtectedRoutes: React.FC = () => {
  const { isAuthenticated, role } = useSelector(
    (state: RootState) => ({
      isAuthenticated: state.auth.isAuthenticated,
      role: state.auth.role,
    }),
    shallowEqual,
  );

  return isAuthenticated ? (
    role === USER_ROLE.ADMIN ? (
      <Outlet />
    ) : (
      <Navigate to="/" />
    )
  ) : (
    <div className="h-screen w-full">
      <LoginDialog showLoginButton={false} openDialog />
    </div>
  );
};

export default AdminProtectedRoutes;
