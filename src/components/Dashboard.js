import React from 'react';
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
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { toast } = useToast();

  const handleSignUpPrompt = () => {
    toast({
      title: "Create an account to save your progress",
      description: "Sign up to unlock all features and track your health journey.",
      action: (
        <button
          onClick={() => navigate("/input")}
          variant="default"
          size="sm"
          className={styles.signButton}
        >
          Sign Up
        </button>
      ),
      duration: 5000,
    });
  };

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
              <h1 className={styles.title}>
                Your Health Dashboard
              </h1>
            </div>
            <TabsList className={styles.tabsList}>
              <TabsTrigger 
                value="assistant" 
                className={styles.tabsTrigger}
                onClick={handleSignUpPrompt}
              >
                Assistant
              </TabsTrigger>
              <TabsTrigger 
                value="metrics" 
                className={styles.tabsTrigger}
                onClick={handleSignUpPrompt}
              >
                Metrics
              </TabsTrigger>
              <TabsTrigger 
                value="supplements" 
                className={styles.tabsTrigger}
                onClick={handleSignUpPrompt}
              >
                Plan
              </TabsTrigger>
              <TabsTrigger 
                value="goals" 
                className={styles.tabsTrigger}
                onClick={handleSignUpPrompt}
              >
                Goals
              </TabsTrigger>
            </TabsList>
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