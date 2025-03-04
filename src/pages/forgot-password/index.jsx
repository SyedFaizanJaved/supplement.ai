import React, { useState } from "react";
import { Loader2, Mail } from "lucide-react";
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
import { forgotPassword } from "../../services/auth";
import { useToast } from "../../components/hooks/use-toast";

const defaultSchema = {
  email: "",
};

const validationSchema = z.object({
  email: z.string().email({ message: "Please provide a valid email" }),
});

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(validationSchema),
    defaultValues: defaultSchema,
  });

  const onSubmit = (formValues) => {
    setIsLoading(true);
    forgotPassword(formValues)
      .then(() => {
        setIsLoading(false);
        setIsSuccess(true);
        toast({
          title: "Success",
          description: "Check your inbox for the next steps.",
        });
      })
      .catch((err) => {
        setIsLoading(false);
        toast({
          title: "Error",
          description: "No account exists with that email address.",
          variant: "destructive",
        });
      });
  };

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);


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
                            placeholder="Enter your email"
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

export default ForgotPassword;
