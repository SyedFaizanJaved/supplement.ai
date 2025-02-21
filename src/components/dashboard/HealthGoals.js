import React, { useState, useCallback, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import { Button } from "../ui/button";
import { HelpCircle, BookOpen, Loader2, RotateCcw } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { useToast } from "../ui/use-toast";
import { GoalItem } from "./goals/GoalItem";
import { XPStore } from "./goals/XPStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import AddGoalDialog from "../ui/addgoaldialog";
import styles from "./HealthGoals.module.css";
import API_URL from "../../config";
import { getProfile } from "../../services/auth";
import GeneInfoCard from "../Cards/gene-info";
import BioInfoCard from "../Cards/bio-info";
const HealthGoals = () => {
  const [goals, setGoals] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const [userProfile, setUserProfile] = useState(0);

  //sample add kia ha ye...
  const sampleBiomarkers = [
    { id: 1, name: "Blood Pressure", value: "120/80 mmHg" },
    { id: 2, name: "Heart Rate", value: "72 BPM" },
    { id: 3, name: "Blood Sugar", value: "90 mg/dL" },
  ];

  const sampleGenes = [
    { id: 1, name: "BRCA1", significance: "High risk" },
    { id: 2, name: "APOE", significance: "Moderate risk" },
    { id: 3, name: "TP53", significance: "Low risk" },
  ];

  const fetchGoals = useCallback(async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/goals/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setGoals(response.data);
      setIsError(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching goals:", error);
      setIsLoading(false);
      setIsError(true);
    }
  }, [user, toast]);

  useEffect(() => {
    getProfile()
      .then((data) => {
        setUserProfile(data);
      })
      .catch((err) => console.log(err));
  }, []);

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
          Authorization: `Bearer ${user?.token}`,
        },
      });
      // Append the new goal to the current list.
      setGoals((prevGoals) => [...prevGoals, response.data]);
      toast({
        title: "Goal added",
      });
      return true;
    } catch (error) {
      console.error("Error adding goal:", error);
      toast({
        description: "Unable to add goal",
        variant: "destructive",
      });
      return false;
    }
  };

  // PATCH: Update an existing goal
  const handleUpdateGoal = async (goalId, updatedFields) => {
    try {
      await axios.patch(`${API_URL}/api/v1/goals/${goalId}/`, updatedFields, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });
      await fetchGoals();
      toast({
        title: "Goal updated",
      });
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        description: "Unable to update goal.",
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
          Authorization: `Bearer ${user?.token}`,
        },
      });
      await fetchGoals();
      toast({
        title: "Goal deleted",
      });
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        description: "Unable to delete goal",
        variant: "destructive",
      });
    }
  };

  const handleReloadGoals = () => {
    fetchGoals();
  };

  useEffect(() => {
    getProfile()
      .then((data) => {
        console.log("profile", data);
      })
      .catch((err) => console.log(err));
  }, []);

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
      <>
        <div className="container">
          {isLoading && <Loader2 className="animate-spin loader " />}
          {isError && (
            <div className="container">
              <button className="ghost-btn" onClick={handleReloadGoals}>
                <RotateCcw className="info-text" />
              </button>
              <p className="info-text">Unable to load goals</p>
            </div>
          )}
        </div>
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
      </>
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
                      <Button
                        variant="ghost"
                        size="icon"
                        className={styles.helpButton}
                      >
                        <HelpCircle className={styles.helpIcon} />
                      </Button>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    onMouseEnter={() => setPopoverOpen(true)}
                    onMouseLeave={() => setPopoverOpen(false)}
                    className={styles.popoverContent}
                  >
                    Track your progress towards your goals and earn XP for
                    completing activities
                  </PopoverContent>
                </Popover>
              </div>
              <div className={styles.buttonContainer}>
                <Button
                  variant="outline"
                  onClick={handleJournalClick}
                  className={styles.button}
                >
                  <BookOpen className={styles.icon} />
                  Journal
                </Button>
                {tabIndex === 0 && (
                  <Button
                    variant="outline"
                    onClick={() =>
                      isEditing ? handleSave() : setIsEditing(true)
                    }
                    className={styles.button}
                  >
                    {isEditing ? "Save Changes" : "Edit Goals"}
                  </Button>
                )}
              </div>
            </div>

            <Tabs defaultValue="goal" className={styles.tabsContainer}>
              <TabsList className={styles.tabsList}>
                <TabsTrigger
                  onClick={() => setTabIndex(0)}
                  value="goal"
                  className={styles.tabsTrigger}
                >
                  Goals
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setTabIndex(1)}
                  value="biomarker"
                  className={styles.tabsTrigger}
                >
                  Biomarkers
                </TabsTrigger>
                <TabsTrigger
                  onClick={() => setTabIndex(2)}
                  value="gene"
                  className={styles.tabsTrigger}
                >
                  Genes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="goal" className={styles.tabContent}>
                {renderGoalsList("Goal")}
              </TabsContent>

              <TabsContent value="biomarker" className={styles.tabContent}>
                <div className={styles.bioContainer}>
                  {(
                    (userProfile &&
                      userProfile?.biomarkers.length > 0 &&
                      userProfile?.biomarkers) ||
                    []
                  ).map((biomarker) => (
                    <BioInfoCard
                      bioName={biomarker.name}
                      currentValue={biomarker.current_value}
                      normalValue={biomarker.normal_value}
                    />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gene" className={styles.tabContent}>
                <div className={styles.geneContainer}>
                  {(
                    (userProfile &&
                      userProfile?.genetic_variants.length > 0 &&
                      userProfile?.genetic_variants) ||
                    []
                  ).map((variant) => (
                    <GeneInfoCard
                      name={variant.name}
                      impact={variant.impact}
                      risk_allele={variant.risk_allele}
                      snp={variant.snp}
                    />
                  ))}
                </div>
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
