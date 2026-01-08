import type { RootState } from "@/store/store";
import React from "react";
import { useSelector } from "react-redux";
import LoginButton from "./LoginButton";
import { Button } from "../ui/button";
import SignUpButton from "./SignUpButton";

const AuthButtons: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  return <>{isAuthenticated ? <Button> Logout</Button> :<> <LoginButton /> <SignUpButton />  </> }</>;
};

export default AuthButtons;
