import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";
import { OtpForm } from "../auth/OtpForm";

const LoginButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isLogin, setIsLogin] = React.useState(false);
  const [email, setEmail] = React.useState<string>("")

  const handleLoginSuccess = (userEmail: string)=> {
    setEmail(userEmail)
    setIsLogin(true)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        {isLogin ? <OtpForm email={email} /> : <LoginForm handleSuccess={handleLoginSuccess} />}
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;
