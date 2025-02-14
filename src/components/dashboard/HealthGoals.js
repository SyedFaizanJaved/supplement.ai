import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "../ui/button";
import { HelpCircle, BookOpen } from "lucide-react";
import { Card } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { GoalItem } from "./goals/GoalItem";
import { XPStore } from "./goals/XPStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import AddGoalDialog from "../ui/addgoaldialog";
import styles from "./HealthGoals.module.css";
import API_URL from "../../config";
// import FileUploadDialog from "../ui/fileupload";

const HealthGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);

  // GET: Fetch all goals
  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      const response = await axios.get(`${API_URL}/api/v1/goals/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
      });
      setGoals(response.data);
    } catch (error) {
      console.error("Error fetching goals:", error);
      toast({
        title: "Error fetching goals",
        description: "There was an error fetching your goals. Please try again.",
        variant: "destructive",
      });
    }
  }, [user, toast]);

  const handleJournalClick = () => {
    navigate("journal");
  };

  // When editing mode is done, refresh goals from API
  const handleSave = async () => {
    setIsEditing(false);
    await fetchGoals();
    toast({
      title: "Changes saved successfully",
      description: "Your health goals have been updated.",
    });
  };

  // POST: Create a new goal
  const handleAddGoal = async (newGoal) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/goals/`, newGoal, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
      });
      // Append the new goal to the current list.
      setGoals((prevGoals) => [...prevGoals, response.data]);
      toast({
        title: "Goal added",
        description: "New goal has been created successfully.",
      });
      return true;
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  // PATCH: Update an existing goal
  const handleUpdateGoal = async (goalId, updatedFields) => {
    try {
      await axios.patch(
        `${API_URL}/api/v1/goals/${goalId}/`,
        updatedFields,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`
          }
        }
      );
      await fetchGoals();
      toast({
        title: "Goal updated",
        description: "Your goal has been updated successfully.",
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // DELETE: Remove a goal
  const handleDeleteGoal = async (goalId) => {
    try {
      await axios.delete(`${API_URL}/api/v1/goals/${goalId}/`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user?.token}`
        },
      });
      await fetchGoals();
      toast({
        title: "Goal deleted",
        description: "Your goal has been deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const renderGoalsList = (category) => {
    let filteredGoals;
    if (category === "Goal") {
      filteredGoals = goals.filter(
        (goal) => !goal.category || goal.category === "Goal"
      );
    } else {
      filteredGoals = goals.filter((goal) => goal.category === category);
    }
    return (
      <div className={styles.goalsList}>
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className={styles.goalCard}>
            <GoalItem
              goal={goal}
              onUpdate={fetchGoals}
              isEditing={isEditing}
              updateGoal={handleUpdateGoal}
              deleteGoal={handleDeleteGoal}
            />
          </Card>
        ))}
        <AddGoalDialog onAddGoal={handleAddGoal} />
      </div>
    );
  };
  

  return (
    <div className={styles.container}>
      <div className={styles.animatedBackground}>
        <div className={styles.backgroundOverlay}>
          <div className={styles.backgroundPulse1} />
          <div className={styles.backgroundPulse2} />
          <div className={styles.backgroundPulse3} />
        </div>
      </div>
      <div className={styles.contentWrapper}>
        <Card className={styles.mainCard}>
          <div className={styles.cardContent}>
            <div className={styles.headerSection}>
              <div className={styles.titleContainer}>
                <h2 className={styles.title}>Health Goals</h2>
                <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div
                      onMouseEnter={() => setPopoverOpen(true)}
                      onMouseLeave={() => setPopoverOpen(false)}
                    >
                      <Button variant="ghost" size="icon" className={styles.helpButton}>
                        <HelpCircle className={styles.helpIcon} />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    onMouseEnter={() => setPopoverOpen(true)}
                    onMouseLeave={() => setPopoverOpen(false)}
                    className={styles.popoverContent}
                  >
                    Track your progress towards your goals and earn XP for completing activities
                  </PopoverContent>
                </Popover>
              </div>
              <div className={styles.buttonContainer}>
                <Button variant="outline" onClick={handleJournalClick} className={styles.button}>
                  <BookOpen className={styles.icon} />
                  Journal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                  className={styles.button}
                >
                  {isEditing ? "Save Changes" : "Edit Goals"}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="goal" className={styles.tabsContainer}>
              <TabsList className={styles.tabsList}>
                <TabsTrigger value="goal" className={styles.tabsTrigger}>
                  Goals
                </TabsTrigger>
                <TabsTrigger value="biomarker" className={styles.tabsTrigger}>
                  Biomarkers
                </TabsTrigger>
                <TabsTrigger value="gene" className={styles.tabsTrigger}>
                  Genes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="goal" className={styles.tabContent}>
                {renderGoalsList("Goal")}
              </TabsContent>

              <TabsContent value="biomarker" className={styles.tabContent}>
              {/* <FileUploadDialog tabName="Biomarker" /> */}
              </TabsContent>

              <TabsContent value="gene" className={styles.tabContent}>
              {/* <FileUploadDialog tabName="Gene" /> */}
              </TabsContent>
            </Tabs>
          </div>
        </Card>

        <div className={styles.bottomcontainer}>
          <Card className={styles.card}>
            <div className={styles.content}>
              <XPStore />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HealthGoals;
