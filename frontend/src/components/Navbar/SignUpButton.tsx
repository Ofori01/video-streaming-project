import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { OtpForm } from "../auth/OtpForm";
import { SignUpForm } from "../auth/SignUpForm";

const SignUpButton: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [isSignUpSuccessful, setIsSignUpSuccessful] = React.useState(false);
  const [email, setEmail] = React.useState<string>("")

  const handleLoginSuccess = (userEmail: string)=> {
    setEmail(userEmail)
    setIsSignUpSuccessful(true)
  }

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 z-100 max-h-[90vh] overflow-y-scroll">
        {isSignUpSuccessful ? <OtpForm email={email} /> : <SignUpForm handleSuccess={handleLoginSuccess} />}
      </DialogContent>
    </Dialog>
  );
};

export default SignUpButton;
