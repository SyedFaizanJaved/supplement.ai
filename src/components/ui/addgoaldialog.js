import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./dialog";
import { Label } from "./label";
import { Button } from "./button";
import { Plus } from "lucide-react";
import { useToast } from "./use-toast";
import styles from "./addgoaldialog.module.css";

const AddGoalDialog = ({ category, onAddGoal, initialGoal }) => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const isEditMode = Boolean(initialGoal);

  const [goal, setGoal] = useState(
    initialGoal || {
      name: "",
      description: "",
      target: 100,
      progress: 0,
      category: category,
    }
  );

  // Update state when initialGoal changes (for edit mode)
  useEffect(() => {
    if (initialGoal) {
      setGoal(initialGoal);
    }
  }, [initialGoal]);

  const resetForm = () => {
    setGoal({
      name: "",
      description: "",
      target: 100,
      progress: 0,
      category: category,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onAddGoal(goal);
    if (success) {
      toast({
        title: isEditMode ? "Goal Updated" : "Goal Created",
        description: isEditMode
          ? "Your goal has been updated successfully."
          : "Your new goal has been added successfully.",
      });
      setOpen(false);
      resetForm();
    } else {
      toast({
        title: "Error",
        description: isEditMode
          ? "Failed to update goal. Please try again."
          : "Failed to create goal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={styles.addGoalButton} onClick={() => setOpen(true)}>
          {isEditMode ? (
            "Edit Goal"
          ) : (
            <>
              <Plus className={styles.plusIcon} />
              Add New Goal
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit" : "Add New"} {category} Goal
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <Label htmlFor="goal_name">Goal Name</Label>
            <input
              id="goal_name"
              className={styles.input}
              value={goal.name}
              onChange={(e) => setGoal({ ...goal, name: e.target.value })}
              placeholder="Enter goal name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className={styles.textarea}
              value={goal.description}
              onChange={(e) =>
                setGoal({ ...goal, description: e.target.value })
              }
              placeholder="Enter goal description"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <Label htmlFor="target">Target Value</Label>
            <input
              id="target"
              type="number"
              className={styles.input}
              value={goal.target}
              onChange={(e) =>
                setGoal({ ...goal, target: Number(e.target.value) })
              }
              min="0"
              required
            />
          </div>
          <DialogFooter className={styles.dialogFooter}>
            <Button type="submit" className={styles.submitButton}>
              {isEditMode ? "Update Goal" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGoalDialog;