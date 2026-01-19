"use client";

import * as React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "../ui/spinner";
import { useSignUp } from "@/hooks/mutations/useAuthMutations";
import { useGetAvailableRoles } from "@/hooks/queries/useAuthQuerries";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/store/auth/authSlice";

const formSchema = Yup.object().shape({
  username: Yup.string()
    .required("Username is required.")
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be at most 20 characters.")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores."
    ),
  email: Yup.string()
    .required("Email is required.")
    .email("Please enter a valid email address."),
  password: Yup.string()
    .required("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .max(100, "Password must be at most 100 characters."),
  confirmPassword: Yup.string()
    .required("Please confirm your password.")
    .oneOf([Yup.ref("password")], "Passwords must match."),
  role: Yup.string().required("Please select a role."),
});

interface SignUpFormProps {
  handleSuccess: () => void;
}

export const SignUpForm: React.FC<SignUpFormProps> = ({ handleSuccess }) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { mutate: signUp, isPending } = useSignUp();
  const { data: rolesData, isLoading: isLoadingRoles } = useGetAvailableRoles();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: formSchema,
    onSubmit: onSubmit,
  });

  function onSubmit(data: Yup.InferType<typeof formSchema>) {
    console.log("Sign up data:", data);

    //  API call
    signUp(data, {
      onSuccess: (response) => {
        toast.success(response.message);
        //set credentials
        dispatch(
          setCredentials({
            token: response.data.token,
            userId: response.data.user.id,
            role: response.data.user.role,
          })
        );
        handleSuccess();
      },
      onError: (error) => {
        //if validation error
        if (error.errors) {
          error.errors.map((err) => {
            toast.error(err.message);
          });
        } else {
          //other errors
          toast.error(error.message);
        }
      },
    });
  }

  const { handleSubmit, touched, errors, handleChange, handleBlur, values } =
    form;

  return (
    <Card className="w-full sm:max-w-md">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="signup-form" onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={touched.username && !!errors.username}>
              <FieldLabel htmlFor="signup-username">Username</FieldLabel>
              <InputGroup>
                <Input
                  id="signup-username"
                  type="text"
                  name="username"
                  aria-invalid={touched.username && !!errors.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  placeholder="user"
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
              {touched.username && !!errors.username && (
                <FieldError errors={[{ message: errors.username }]} />
              )}
            </Field>
            <Field data-invalid={touched.email && !!errors.email}>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <InputGroup>
                <Input
                  id="signup-email"
                  type="email"
                  name="email"
                  aria-invalid={touched.email && !!errors.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
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
              {touched.email && !!errors.email && (
                <FieldError errors={[{ message: errors.email }]} />
              )}
            </Field>
            <Field data-invalid={touched.password && !!errors.password}>
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <InputGroup>
                <Input
                  id="signup-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  aria-invalid={touched.password && !!errors.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
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
              <FieldDescription>Must be at least 8 characters</FieldDescription>
              {touched.password && !!errors.password && (
                <FieldError errors={[{ message: errors.password }]} />
              )}
            </Field>
            <Field
              data-invalid={touched.confirmPassword && !!errors.confirmPassword}
            >
              <FieldLabel htmlFor="signup-confirm-password">
                Confirm Password
              </FieldLabel>
              <InputGroup>
                <Input
                  id="signup-confirm-password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  aria-invalid={
                    touched.confirmPassword && !!errors.confirmPassword
                  }
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
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
                Re-enter your password to confirm.
              </FieldDescription>
              {touched.confirmPassword && !!errors.confirmPassword && (
                <FieldError errors={[{ message: errors.confirmPassword }]} />
              )}
            </Field>
            <Field data-invalid={touched.role && !!errors.role}>
              <FieldLabel htmlFor="signup-role">Role</FieldLabel>
              <Select
                name="role"
                value={values.role || undefined}
                onValueChange={(value) => form.setFieldValue("role", value)}
                disabled={isPending || isLoadingRoles}
              >
                <SelectTrigger id="signup-role" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent
                  position="popper"
                  className="z-999"
                  sideOffset={4}
                >
                  {isLoadingRoles ? (
                    <SelectItem value="loading" disabled>
                      Loading roles...
                    </SelectItem>
                  ) : rolesData?.data && rolesData.data.length > 0 ? (
                    rolesData.data.map((role) => (
                      <SelectItem key={role.id} value={String(role.id)}>
                        {role.name}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-roles" disabled>
                      No roles available
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose the role that best fits your needs.
              </FieldDescription>
              {touched.role && !!errors.role && (
                <FieldError errors={[{ message: errors.role }]} />
              )}
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <Field orientation="horizontal">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.resetForm()}
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
