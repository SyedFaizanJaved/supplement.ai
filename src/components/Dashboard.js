import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "./ui/button";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { HealthAssistant } from "./dashboard/HealthAssistant";
import { HealthMetrics } from "./dashboard/HealthMetrics";
import { SupplementPlan } from "./dashboard/SupplementPlan";
import HealthGoals from "./dashboard/HealthGoals";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useIsMobile } from "./hooks/use-mobile";
import { useToast } from "./hooks/use-toast";
import BASE_URL from "../config";
import styles from "./Dashboard.module.css";

export const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

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
          title: "Error",
          description: "Failed to fetch user profile.",
          variant: "destructive",
        });
      }
    };

    fetchProfile();
  }, [toast]);

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <Tabs defaultValue="assistant" className={styles.tabs}>
          <div className={styles.header}>
            <div className={styles.headerLeft}>
              <Button
                variant="ghost"
                size="sm"
                className={styles.backButton}
                onClick={() => navigate("/")}
              >
                <ChevronLeft className={styles.icon} />
                Back
              </Button>
            </div>

            <div className={styles.btnContainer}>
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
              <HealthAssistant />
            </TabsContent>
            <TabsContent value="metrics" className={styles.tabContent}>
              <HealthMetrics />
            </TabsContent>
            <TabsContent value="supplements" className={styles.tabContent}>
              <SupplementPlan />
            </TabsContent>
            <TabsContent value="goals" className={styles.tabContent}>
              <HealthGoals />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};
