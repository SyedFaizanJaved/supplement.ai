import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "./integrations/supabase/client";
import { LoadingSpinner } from "./ui/loading-spinner";
import { useToast } from "./hooks/use-toast";
import styles from "./AuthWrapper.module.css";

export const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Special handling for payment page
        if (location.pathname === '/payment' && location.search.includes('email=')) {
          setIsLoading(false);
          setIsAuthenticated(true);
          return;
        }

        if (!session) {
          toast({
            title: "Error!",
            description: "Please create an account to access this feature",
            action: (
              <button
                onClick={() => navigate("/input")}
                className={styles.signUpButton}
              >
                Sign Up
              </button>
            ),
            duration: 5000,
          });
          navigate("/");
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error("Auth check failed:", error);
        if (location.pathname !== '/payment') {
          navigate("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && location.pathname !== '/payment') {
        navigate("/");
      }
    });

    checkAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast, location]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <LoadingSpinner className={styles.spinner} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return children;
};