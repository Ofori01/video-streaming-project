"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLogin } from "@/hooks/mutations/useAuthMutations";
import * as z from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Mail } from "lucide-react";

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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon } from "@/components/ui/input-group";
import { Spinner } from "../ui/spinner";

const formSchema = z.object({
  email: z.email("Please enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
});


interface LoginFormProps {
  handleSuccess: (email: string)=> void
}

export const LoginForm: React.FC<LoginFormProps> =({handleSuccess})=> {
  const [showPassword, setShowPassword] = React.useState(false);

  const { mutate: login, isPending } = useLogin();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    //!make a request
    login(data, {
      onSuccess: (response) => {
        toast.success(response.message, {
          position: "top-right",
        });
        handleSuccess(response.data.email)
      },
      onError: (err) => {
        console.log(err);
        toast.error(err.message || "Login Failed", {
          position: "top-right",
        });
      },
    });
  }

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>You're not logged in!</CardTitle>
        <CardDescription>
          Sign in with your email and password to continue
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-rhf-demo-email">Email</FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="form-rhf-demo-email"
                      type="email"
                      aria-invalid={fieldState.invalid}
                      placeholder="email@example.com"
                      autoComplete="email"
                    />
                    <InputGroupAddon className="w-10 pr-2 flex items-center justify-center">
                      <Mail className="size-4" />
                    </InputGroupAddon>
                  </InputGroup>
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
                  <FieldLabel htmlFor="form-rhf-demo-password">
                    Password
                  </FieldLabel>
                  <InputGroup>
                    <Input
                      {...field}
                      id="form-rhf-demo-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      aria-invalid={fieldState.invalid}
                      autoComplete="current-password"
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
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
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
          <Button type="button" variant="outline" onClick={() => form.reset()}>
            Reset
          </Button>
          <Button type="submit" form="form-rhf-demo" disabled={isPending}>
            {isPending && <Spinner />}
            Sign In
          </Button>
        </Field>
      </CardFooter>
    </Card>
  );
}
