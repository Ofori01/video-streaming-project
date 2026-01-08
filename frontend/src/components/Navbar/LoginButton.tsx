import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LoginForm } from "@/components/auth/LoginForm";

const LoginButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign In</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
};

export default LoginButton;
