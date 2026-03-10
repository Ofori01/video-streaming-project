import type { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import LoginButton from "./LoginButton";
import SignUpButton from "./SignUpButton";
import LogoutButton from "./LogoutButton";

const AuthButtons: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return (
    <>
      {isAuthenticated ? (
        <LogoutButton />
      ) : (
        <>
          {" "}
          <LoginButton /> <SignUpButton />{" "}
        </>
      )}
    </>
  );
};

export default AuthButtons;
