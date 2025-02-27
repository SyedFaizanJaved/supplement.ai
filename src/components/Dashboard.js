import React, { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "./hooks/use-mobile";
import { useToast } from "./hooks/use-toast";
import BASE_URL from "../config";
import styles from "./Dashboard.module.css";
import { useAuth } from "../context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import Loader from "./fallback";
import HamburgerMenu from "./hamburger-menu";
const HealthAssistant = React.lazy(() => import("./dashboard/HealthAssistant"));
const HealthMetrics = React.lazy(() => import("./dashboard/HealthMetrics"));
const SupplementPlan = React.lazy(() => import("./dashboard/SupplementPlan"));
const HealthGoals = React.lazy(() => import("./dashboard/HealthGoals"));

export const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { logout } = useAuth();

  // State to manage admin status
  const [isAdmin, setIsAdmin] = useState(false);

  // Fetch the user's profile to determine their role
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/v1/users/profile/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        // Check if user_role contains "Admin"
        const roles =
          response.data?.user_role?.map((role) => role.role_name) || [];
        setIsAdmin(roles.includes("Admin"));
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Unable to load profile",

          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <div>
        <div className={styles.hamburgerMenu}>
          <HamburgerMenu onLogout={handleLogout} />
        </div>
        <Tabs defaultValue="assistant">
          <div className={styles.header}>
            <div className={styles.logoutContainer}>
              <Button
                size="sm"
                className={styles.backButton}
                onClick={() => handleLogout()}
              >
                Logout
              </Button>
            </div>

            <div>
              <div className={styles.adminContainer}>
                {isAdmin && (
                  <Button
                    className={styles.adminButton}
                    onClick={() => navigate("/admin")}
                  >
                    Admin Panel
                  </Button>
                )}
              </div>

              <TabsList className={styles.tabsList}>
                <TabsTrigger value="assistant" className={styles.tabsTrigger}>
                  Assistant
                </TabsTrigger>
                <TabsTrigger value="metrics" className={styles.tabsTrigger}>
                  Metrics
                </TabsTrigger>
                <TabsTrigger value="supplements" className={styles.tabsTrigger}>
                  Plan
                </TabsTrigger>
                <TabsTrigger value="goals" className={styles.tabsTrigger}>
                  Goals
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <div className={styles.content}>
            <TabsContent value="assistant" className={styles.tabContent}>
              <Suspense fallback={<Loader />}>
                <HealthAssistant />
              </Suspense>
            </TabsContent>
            <TabsContent value="metrics" className={styles.tabContent}>
              <Suspense fallback={<Loader />}>
                <HealthMetrics />
              </Suspense>
            </TabsContent>
            <TabsContent value="supplements" className={styles.tabContent}>
              <Suspense fallback={<Loader />}>
                <SupplementPlan />
              </Suspense>
            </TabsContent>
            <TabsContent value="goals" className={styles.tabContent}>
              <Suspense fallback={<Loader />}>
                <HealthGoals />
              </Suspense>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
