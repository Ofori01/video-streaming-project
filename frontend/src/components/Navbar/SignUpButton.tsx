import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { SignUpForm } from "../auth/SignUpForm";

const SignUpButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);

  const handleSignUpSuccess = ()=> {
    setOpen(false)
  }

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 z-100 max-h-[90vh] overflow-y-scroll">
        <SignUpForm handleSuccess={handleSignUpSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default SignUpButton;
