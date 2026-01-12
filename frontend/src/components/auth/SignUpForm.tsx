"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Mail, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Spinner } from "../ui/spinner";
import { useSignUp } from "@/hooks/mutations/useAuthMutations";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    ),
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});

interface SignUpFormProps {
  handleSuccess: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ handleSuccess }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {mutate: signUp, isPending} = useSignUp()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {

    // TODO: Replace with actual signup mutation
    console.log("Sign up data:", data);

    // Simulate API call
    signUp(data, {
        onSuccess : (response) => {
            toast.success(response.message)
            handleSuccess()
        },
        onError : (error)=> {
            //if validation error
            if(error.errors){
                error.errors.map((err)=>{
                    toast.error(err.message)
                })
            }else{
                //other errors
                toast.error(error.message)

            }

        }
    })
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-username">Username</FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="signup-username"
                      type="text"
                      aria-invalid={fieldState.invalid}
                      placeholder="Ofori"
                      autoComplete="username"
                      disabled={isPending}
                    />
                    <InputGroupAddon className="w-10 pr-2 flex items-center justify-center">
                      <User className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    3-20 characters. Letters, numbers, and underscores only.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-email">Email</FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="signup-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="email@example.com"
                      autoComplete="email"
                      disabled={isPending}
                    />
                    <InputGroupAddon className="w-10 pr-2 flex items-center justify-center">
                      <Mail className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    We'll send you a verification code to this email.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="signup-password">Password</FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="signup-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="new-password"
                      disabled={isPending}
                    />
                    <InputGroupAddon className="w-10 pr-2 flex items-center justify-center">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        disabled={isPending}
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldDescription>
                    Must be at least 8 characters
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={isPending}
          >
            Reset
          </Button>
          <Button type="submit" form="signup-form" disabled={isPending}>
            {isPending && <Spinner />}
            Create Account
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
};
