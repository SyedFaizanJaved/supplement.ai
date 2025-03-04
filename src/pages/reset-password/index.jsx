import React, { useState } from "react";
import { Check, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Card,
  CardTitle,
  CardHeader,
  CardContent,
  CardDescription,
  CardFooter,
} from "../../components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../../components/ui/form";

import { Input } from "../../components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.css";
import { useParams } from "react-router";
import { resetPassword } from "../../services/auth";
import { useToast } from "../../components/hooks/use-toast";

const defaultSchema = {
  password: "",
  confirmPassword: "",
  passwordResetToken: "",
};

const validationSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters long")
      .max(16, "Password must not exceed 16 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
    passwordResetToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Login = () => {
  const {toast} = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const { login: authLogin, user } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultSchema,
  });

  const onSubmit = (formValues) => {
    setIsLoading(true);
    resetPassword(formValues)
      .then((res) => {
        setIsLoading(false);
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Password changed successfully",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
        toast({
          title: "Error",
          description: "An error occurred. Please try again.",
          variant: "destructive",
        });
      });
  };

  React.useEffect(() => {
    form.setValue("passwordResetToken", params.passwordResetToken);
  }, []);

  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  React.useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        navigate("/login");
      }, [2000]);
    }
  }, [isSuccess]);

  return (
    <div className={styles.container}>
      <Card className={styles.formContainer}>
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          {!isSuccess ? (
            <CardDescription className={styles.subtitle}>
              Please enter your password
            </CardDescription>
          ) : (
            <CardDescription className={styles.cardDescriptionLinks}>
              <a href="/login" className={styles.signupLink}>
                Login
              </a>
              <span>or</span>
              <a href="/input" className={styles.signupLink}>
                Sign up
              </a>
            </CardDescription>
          )}
        </CardHeader>
        {isSuccess ? (
          <CardContent className={styles.cardContent}>
            <p>
              <Check />
            </p>
            <p>Password changed successfully</p>
          </CardContent>
        ) : (
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className={styles.form}
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className={styles.inputWrapper}>
                          <Lock className={styles.inputIcon} />
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className={styles.input}
                            disabled={isLoading}
                            placeholder="Enter your password"
                            maxLength={16}
                          />
                          <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className={styles.passwordToggleIcon} />
                            ) : (
                              <Eye className={styles.passwordToggleIcon} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm password</FormLabel>
                      <FormControl>
                        <div className={styles.inputWrapper}>
                          <Lock className={styles.inputIcon} />
                          <input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            className={styles.input}
                            disabled={isLoading}
                            placeholder="Confirm your password"
                            maxLength={16}
                          />
                          <button
                            type="button"
                            className={styles.passwordToggle}
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className={styles.passwordToggleIcon} />
                            ) : (
                              <Eye className={styles.passwordToggleIcon} />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isLoading}
                >
                  {isLoading ? <Loader2 className="animate-spin" /> : "Reset"}
                </button>
              </form>
            </Form>
          </CardContent>
        )}

        {!isSuccess && (
          <CardFooter className={styles.cardFooter}>
            <a href="/login" className={styles.signupLink}>
              Login
            </a>
            <span>or</span>
            <a href="/input" className={styles.signupLink}>
              Sign up
            </a>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Login;
