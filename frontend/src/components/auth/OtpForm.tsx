"use client";

import * as React from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "../ui/spinner";
import { useVerifyOtp } from "@/hooks/mutations/useAuthMutations";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/auth/authSlice";
import { USER_ROLE } from "@/types/User";
import { useNavigate } from "react-router-dom";

interface OtpFormProps {
  email: string;
}


export function OtpForm({ email }: OtpFormProps) {
    const dispatch = useDispatch()
  const [otp, setOtp] = React.useState("");
  const navigate = useNavigate()

  const {mutate: verifyOtp, isPending} = useVerifyOtp()

  const onSubmit =(value: string) => {
    verifyOtp({email,otp: value}, {
        onSuccess: (response)=> {
            toast.success(response.message)
            dispatch(setCredentials({
                token : response.data.token,
                userId: response.data.user.id,
                role: response.data.user.role,
                
            }))
            // check role and navigate user
            if(response.data.user.role === USER_ROLE.ADMIN){
              navigate("/admin",{replace: true, viewTransition: true})
            }
        },
        onError: (err)=> {
            toast.error(err.message)
        }
    })
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit?.(otp);
    }
  };

  // Auto-submit when all 6 digits are entered (optional)
  const handleComplete = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      onSubmit?.(value);
    }
  };

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader className="text-center">
        <CardTitle>Verify your email</CardTitle>
        <CardDescription>
          {email ? (
            <>
              We sent a 6-digit code to <strong>{email}</strong>
            </>
          ) : (
            "Enter the 6-digit code sent to your email"
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="otp-form" onSubmit={handleSubmit}>
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              pattern={REGEXP_ONLY_DIGITS}
              value={otp}
              onChange={setOtp}
              onComplete={handleComplete}
              disabled={isPending}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          type="submit"
          form="otp-form"
          className="w-full"
          disabled={otp.length !== 6 || isPending}
        >
          {isPending ? (
            <>
              <Spinner />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>
        <p className="text-sm text-muted-foreground text-center">
          Didn't receive a code?{" "}
          <button
            type="button"
            className="text-primary hover:underline font-medium"
            onClick={() => {
              // Handle resend logic
            }}
          >
            Resend
          </button>
        </p>
      </CardFooter>
    </Card>
  );
}
