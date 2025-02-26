import React, { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config";
import styles from "./Login.module.css";

export const verifyToken = async (token) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/token/verify/`, {
      token,
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Token verification failed."
    );
  }
};

export const refreshToken = async (refresh) => {
  try {
    const response = await axios.post(`${API_URL}/api/v1/auth/token/refresh/`, {
      refresh,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Token refresh failed.");
  }
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin, user } = useAuth();

  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/login/`, {
        email: formData.email,
        password: formData.password,
      });

      // Assume the response includes `first_name`
      const { access, refresh } = response.data;

      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Pass first_name along with the other user data.
      authLogin({
        token: access,
        refreshToken: refresh,
        email: formData.email,
      });

      try {
        await verifyToken(access);
      } catch (verifyError) {
        console.error("Token verification error:", verifyError);
      }

      navigate("/dashboard");
    } catch (error) {
      console.log("ERROR:", error);
      setErrors({
        submit:
          error.response?.data?.message || "username/password is incorrect",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.headerSection}>
          <h1 className={styles.title}>Welcome</h1>
          <p className={styles.subtitle}>
            Please enter your details to sign in
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">
              Email
            </label>
            <div className={styles.inputWrapper}>
              <Mail className={styles.inputIcon} />
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ""
                }`}
                disabled={isLoading}
              />
            </div>
            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">
              Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock className={styles.inputIcon} />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
                disabled={isLoading}
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
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div className={styles.optionsGroup}>
            <div className={styles.rememberMe}>
              <input
                type="checkbox"
                id="remember"
                className={styles.checkbox}
              />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className={styles.forgotPassword}>
              Forgot password?
            </a>
          </div>

          {errors.submit && (
            <div className={styles.submitError}>{errors.submit}</div>
          )}

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>

          <p className={styles.signupPrompt}>
            Don't have an account?{" "}
            <a href="/input" className={styles.signupLink}>
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
