import { Button } from "../ui/button";
import { Plus, HelpCircle } from "lucide-react";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { supabase } from "../integrations/supabase/client";
import { GoalItem } from "./goals/GoalItem";
import { SymptomTracker } from "./goals/SymptomTracker";
import { XPStore } from "./goals/XPStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { addHealthGoal } from "../../api/healthGoalsApi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState, useEffect } from "react";
import styles from "./HealthGoals.module.css";

export const HealthGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const fetchGoals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("health_goals")
      .select("id, goal_name, description, progress, target, category")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching goals:", error);
      return;
    }

    const formattedGoals = (data || []).map((goal) => ({
      ...goal,
      progress: Number(goal.progress) || 0,
      target: Number(goal.target) || 100,
    }));

    setGoals(formattedGoals);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved successfully",
      description: "Your health goals have been updated.",
    });
  };

  const handleAddGoal = async (category) => {
    try {
      await addHealthGoal({
        goal_name: "New Goal",
        description: "Click edit to modify this goal",
        target: 100,
        progress: 0,
        category,
      });

      toast({
        title: "Goal added",
        description: "New goal has been created successfully.",
      });

      fetchGoals();
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGoals();

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "health_goals",
        },
        () => {
          fetchGoals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const renderGoalsList = (category) => {
    const filteredGoals = goals.filter((goal) => goal.category === category);

    return (
      <div className={styles.goalsList}>
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className={styles.goalCard}>
            <GoalItem goal={goal} onUpdate={fetchGoals} isEditing={isEditing} />
          </Card>
        ))}
        <Button
          variant="ghost"
          className={styles.addGoalButton}
          onClick={() => handleAddGoal(category)}
        >
          <Plus className={styles.addIcon} />
          Add New Goal
        </Button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <Card className={styles.mainCard}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <h2 className={styles.title}>Health Goals</h2>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={styles.helpButton}
                >
                  <HelpCircle className={styles.helpIcon} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className={styles.popoverContent}>
                Track your progress towards your goals and earn XP for
                completing activities
              </PopoverContent>
            </Popover>
          </div>
          <Button
            className={styles.editButton}
            variant="outline"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          >
            {isEditing ? "Save Changes" : "Edit Goals"}
          </Button>
        </div>

        <Tabs defaultValue="fitness" className={styles.tabs}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="fitness">Fitness</TabsTrigger>
            <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
            <TabsTrigger value="wellness">Wellness</TabsTrigger>
            <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
          </TabsList>

          <TabsContent value="fitness" className={styles.tabContent}>
            {renderGoalsList("fitness")}
          </TabsContent>

          <TabsContent value="nutrition" className={styles.tabContent}>
            {renderGoalsList("nutrition")}
          </TabsContent>

          <TabsContent value="wellness" className={styles.tabContent}>
            {renderGoalsList("wellness")}
          </TabsContent>

          <TabsContent value="biomarkers" className={styles.tabContent}>
            {renderGoalsList("biomarkers")}
          </TabsContent>
        </Tabs>
      </Card>

      <div className={styles.bottomGrid}>
        <div className={styles.xpStoreWrapper}>
          <Card className={styles.xpStoreCard}>
            <XPStore />
          </Card>
        </div>
        <div className={styles.symptomTrackerWrapper}>
          <Card className={styles.symptomTrackerCard}>
            <SymptomTracker />
          </Card>
        </div>
      </div>
    </div>
  );
};
