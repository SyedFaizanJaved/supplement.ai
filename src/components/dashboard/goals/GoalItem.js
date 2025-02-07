import { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Progress } from "../../ui/progress";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import styles from "./GoalItem.module.css";

export const GoalItem = ({
  goal,
  onUpdate,
  isEditing,
  updateGoal,
  deleteGoal,
}) => {
  // Initialize with the goal object; assumes it has a field "goal_name"
  const [editedGoal, setEditedGoal] = useState(goal);
  const { toast } = useToast();

  // Update local state when the goal prop changes
  useEffect(() => {
    setEditedGoal(goal);
  }, [goal]);

  const calculateProgress = (progress, target) => {
    if (target === 1) {
      // Handle binary yes/no goals
      return progress * 100;
    }
    return (progress / target) * 100;
  };

  // Called when the user saves their changes
  const handleSave = async () => {
    try {
      // Use editedGoal.goal_name (consistent with display)
      await updateGoal(goal.id, {
        goal_name: editedGoal.goal_name,
        description: editedGoal.description,
        progress: editedGoal.progress,
        target: editedGoal.target,
      });
      toast({
        title: "Goal updated",
        description: "Your health goal has been updated successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error updating goal:", error);
      toast({
        title: "Error",
        description: "Failed to update goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Called when the user deletes the goal
  const handleDelete = async () => {
    try {
      await deleteGoal(goal.id);
      toast({
        title: "Goal deleted",
        description: "Your health goal has been deleted successfully.",
      });
      onUpdate();
    } catch (error) {
      console.error("Error deleting goal:", error);
      toast({
        title: "Error",
        description: "Failed to delete goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={styles.container}>
      {isEditing ? (
        <div className={styles.editContainer}>
          <Input
            value={editedGoal.goal_name || ""}
            onChange={(e) =>
              setEditedGoal((prev) => ({ ...prev, goal_name: e.target.value }))
            }
            className={styles.goalNameInput}
            placeholder="Goal name"
          />
          <Textarea
            value={editedGoal.description || ""}
            onChange={(e) =>
              setEditedGoal((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            placeholder="Add a description for your goal"
            className={styles.descriptionTextarea}
          />
          <div className={styles.progressInputContainer}>
            <Input
              type="number"
              value={editedGoal.progress}
              onChange={(e) =>
                setEditedGoal((prev) => ({
                  ...prev,
                  progress: Number(e.target.value),
                }))
              }
              className={styles.numberInput}
              placeholder="Progress"
            />
            <span className={styles.divider}>/</span>
            <Input
              type="number"
              value={editedGoal.target}
              onChange={(e) =>
                setEditedGoal((prev) => ({
                  ...prev,
                  target: Number(e.target.value),
                }))
              }
              className={styles.numberInput}
              placeholder="Target"
            />
          </div>
          <div className={styles.buttonGroup}>
            <Button onClick={handleSave} className={styles.saveButton}>
              Save Changes
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
              className={styles.deleteButton}
            >
              <Trash2 className={styles.trashIcon} />
              Delete
            </Button>
          </div>
        </div>
      ) : (
        <div className={styles.viewContainer}>
          <div className={styles.headerContainer}>
            <div>
              {/* Display the goal name from the goal prop */}
              <span className={styles.goalName}>{goal.goal_name}</span>
              {goal.description && (
                <p className={styles.description}>{goal.description}</p>
              )}
            </div>
            {isEditing && (
              <Button
                variant="ghost"
                onClick={() => setEditedGoal(goal)}
                className={styles.editButton}
              >
                <Pencil className={styles.editIcon} />
              </Button>
            )}
          </div>
          <div className={styles.progressContainer}>
            {goal.target === 1 ? (
              <span className={styles.progressText}>
                Status: {goal.progress ? "Completed" : "Not Started"}
              </span>
            ) : (
              <>
                <span className={styles.progressText}>
                  Progress: {goal.progress} / {goal.target}
                </span>
                <span className={styles.progressText}>
                  {Math.round(calculateProgress(goal.progress, goal.target))}%
                </span>
              </>
            )}
          </div>
          <Progress
            value={calculateProgress(goal.progress, goal.target)}
            className={styles.progressBar}
          />
        </div>
      )}
    </div>
  );
};
