import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { HelpCircle } from "lucide-react";
import { useToast } from "../ui/use-toast";
import { supabase } from "../integrations/supabase/client";
import { GoalItem } from "./goals/GoalItem";
import { SymptomTracker } from "./goals/SymptomTracker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { addHealthGoal } from "../../api/healthGoalsApi";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { AddGoalDialog } from "../ui/addgoaldialog";
import styles from './HealthGoals.module.css';
import initialGoalsData from '../../data/healthGoals.json';

export const HealthGoals = () => {
  const [goals, setGoals] = useState(initialGoalsData.healthGoals);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  const fetchGoals = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('health_goals')
      .select('id, goal_name, description, progress, target, category')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching goals:', error);
      return;
    }

    const formattedGoals = (data || []).map(goal => ({
      ...goal,
      progress: Number(goal.progress) || 0,
      target: Number(goal.target) || 100
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

  const handleAddGoal = async (newGoal) => {
    try {
      await addHealthGoal(newGoal);
      
      toast({
        title: "Goal added",
        description: "New goal has been created successfully.",
      });

      await fetchGoals();
      return true; 
    } catch (error) {
      console.error('Error adding goal:', error);
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
      return false; 
    }
  };

  useEffect(() => {
    fetchGoals();

    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'health_goals'
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
    const filteredGoals = goals.filter(goal => goal.category === category);
    
    return (
      <div className={styles.goalsContainer}>
        {filteredGoals.map((goal) => (
          <div key={goal.id} className={styles.goalCard}>
            <GoalItem 
              goal={goal} 
              onUpdate={fetchGoals}
              isEditing={isEditing}
            />
          </div>
        ))}
        <AddGoalDialog 
          category={category}
          onAddGoal={handleAddGoal}
        />
      </div>
    );
  };

  return (
    <div className={styles.healthGoalsCard}>
      <div className={styles.headerContainer}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>Health Goals</h2>
          <Popover>
            <PopoverTrigger className={styles.helpupButton}>
              <button className={styles.helpButton}>
                <HelpCircle className={styles.helpIcon} />
              </button>
            </PopoverTrigger>
            <PopoverContent className={styles.popoverContent}>
              Track your progress towards your goals and receive weekly recaps for completing your journal everyday
            </PopoverContent>
          </Popover>
        </div>
        <Button
          variant="outline"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
          className={styles.editButton}
        >
          {isEditing ? "Save Changes" : "Edit Goals"}
        </Button>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.tabsSection}>
          <Tabs defaultValue="fitness">
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="fitness">Fitness</TabsTrigger>
              <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
              <TabsTrigger value="wellness">Wellness</TabsTrigger>
              <TabsTrigger value="biomarkers">Biomarkers</TabsTrigger>
            </TabsList>

            <TabsContent value="fitness" className={styles.tabContent}>
              {renderGoalsList('fitness')}
            </TabsContent>

            <TabsContent value="nutrition" className={styles.tabContent}>
              {renderGoalsList('nutrition')}
            </TabsContent>

            <TabsContent value="wellness" className={styles.tabContent}>
              {renderGoalsList('wellness')}
            </TabsContent>

            <TabsContent value="biomarkers" className={styles.tabContent}>
              {renderGoalsList('biomarkers')}
            </TabsContent>
          </Tabs>
        </div>
        
        <div className={styles.symptomTrackerSection}>
          <SymptomTracker />
        </div>
      </div>
    </div>
  );
};

export default HealthGoals;