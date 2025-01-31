import { useState, useEffect } from "react"
import { Button } from "../ui/button"
import { HelpCircle } from "lucide-react"
import { Card } from "../ui/card"
import { useToast } from "../ui/use-toast"
import { supabase } from "../integrations/supabase/client"
import { GoalItem } from "./goals/GoalItem"
import { SymptomTracker } from "./goals/SymptomTracker"
import { XPStore } from "./goals/XPStore"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { addHealthGoal } from "../../api/healthGoalsApi"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import AddGoalDialog from "../ui/addgoaldialog"
import styles from "./HealthGoals.module.css"
import initialGoalsData from "../../data/healthGoals.json"

const HealthGoals = () => {
  const [goals, setGoals] = useState(initialGoalsData.healthGoals)
  const [isEditing, setIsEditing] = useState(false)
  const { toast } = useToast()

  const fetchGoals = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from("health_goals")
      .select("id, goal_name, description, progress, target, category")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching goals:", error)
      return
    }

    const formattedGoals = (data || []).map((goal) => ({
      ...goal,
      progress: Number(goal.progress) || 0,
      target: Number(goal.target) || 100,
    }))

    setGoals(formattedGoals)
  }

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Changes saved successfully",
      description: "Your health goals have been updated.",
    })
  }

  const handleAddGoal = async (newGoal) => {
    try {
      const addedGoal = await addHealthGoal(newGoal)
      setGoals((prevGoals) => [...prevGoals, addedGoal])
      toast({
        title: "Goal added",
        description: "New goal has been created successfully.",
      })
      return true
    } catch (error) {
      console.error("Error adding goal:", error)
      toast({
        title: "Error",
        description: "Failed to add goal. Please try again.",
        variant: "destructive",
      })
      return false
    }
  }

  useEffect(() => {
    fetchGoals()

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
          fetchGoals()
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [fetchGoals]) // Added fetchGoals to the dependency array

  const renderGoalsList = (category) => {
    const filteredGoals = goals.filter((goal) => goal.category === category)

    return (
      <div className={styles.goalsList}>
        {filteredGoals.map((goal) => (
          <Card key={goal.id} className={styles.goalCard}>
            <GoalItem goal={goal} onUpdate={fetchGoals} isEditing={isEditing} />
          </Card>
        ))}
        <AddGoalDialog category={category} onAddGoal={handleAddGoal} />
      </div>
    )
  }

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
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="icon" className={styles.helpButton}>
                      <HelpCircle className={styles.helpIcon} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className={styles.popoverContent}>
                    Track your progress towards your goals and earn XP for completing activities
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

            <Tabs defaultValue="fitness" className={styles.tabsContainer}>
              <TabsList className={styles.tabsList}>
                <TabsTrigger value="fitness" className={styles.tabsTrigger}>
                  Fitness
                </TabsTrigger>
                <TabsTrigger value="nutrition" className={styles.tabsTrigger}>
                  Nutrition
                </TabsTrigger>
                <TabsTrigger value="wellness" className={styles.tabsTrigger}>
                  Wellness
                </TabsTrigger>
                <TabsTrigger value="biomarkers" className={styles.tabsTrigger}>
                  Biomarkers
                </TabsTrigger>
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
          </div>
        </Card>

        <div className={styles.bottomSection}>
          <div className={styles.xpStoreContainer}>
            <Card className={styles.bottomCard}>
              <div className={styles.cardPadding}>
                <XPStore />
              </div>
            </Card>
          </div>
          <div className={styles.symptomTrackerContainer}>
            <Card className={styles.bottomCard}>
              <div className={styles.cardPadding}>
                <SymptomTracker />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HealthGoals

