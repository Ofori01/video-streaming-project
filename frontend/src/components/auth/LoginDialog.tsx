import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { Button } from "../ui/button";
import { LoginForm } from "./LoginForm";
import { OtpForm } from "./OtpForm";

const LoginDialog: React.FC<{ showLoginButton?: boolean, openDialog?:boolean }> = ({
  showLoginButton = true,
  openDialog = false
}) => {
  const [open, setOpen] = React.useState(openDialog);
  const [isLogin, setIsLogin] = React.useState(false);
  const [email, setEmail] = React.useState<string>("");

  const handleLoginSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setIsLogin(true);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {showLoginButton && (
        <DialogTrigger asChild>
          <Button variant="ghost" className="cursor-pointer">Sign In</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-125">
        {isLogin ? (
          <OtpForm email={email} />
        ) : (
          <LoginForm handleSuccess={handleLoginSuccess} />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginDialog;
