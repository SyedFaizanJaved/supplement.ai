import React, { useState } from "react";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
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
import { forgotPassword } from "../../services/auth";
import { useToast } from "../../components/hooks/use-toast";

const defaultSchema = {
  email: "",
};

const validationSchema = z.object({
  email: z.string().email({
    message: "provide valid email",
  }),
});

const Login = () => {
  const toast = useToast();
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
    forgotPassword(formValues)
      .then((res) => {
        setIsLoading(false);
        setIsSuccess(true);
      })
      .catch((err) => {
        setIsLoading(false);
        setIsError(true);
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

  return (
    <div className={styles.container}>
      <Card className={styles.formContainer}>
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          {!isSuccess ? (
            <CardDescription className={styles.subtitle}>
              Please enter your email
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
              Check your inbox for the next steps. If you don't receive an
              email, and it's not in your spam folder this could mean you signed
              up with a different address.
            </p>
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className={styles.inputWrapper}>
                          <Mail className={styles.inputIcon} />
                          <input
                            {...field}
                            type="email"
                            className={styles.input}
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            className={styles.passwordToggle}
                          ></button>
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
              Sign-up
            </a>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Login;
