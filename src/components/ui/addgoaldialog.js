import React, { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "./dialog"
import { Label } from "./label"
import { Button } from "./button"
import { Plus } from "lucide-react"
import { useToast } from "./use-toast"
import styles from "./addgoaldialog.module.css"

const AddGoalDialog = ({ category, onAddGoal }) => {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const [newGoal, setNewGoal] = useState({
    goal_name: "",
    description: "",
    target: 100,
    progress: 0,
    category: category,
  })

  const resetForm = () => {
    setNewGoal({
      goal_name: "",
      description: "",
      target: 100,
      progress: 0,
      category: category,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const success = await onAddGoal(newGoal)
    if (success) {
      toast({
        title: "Goal Created",
        description: "Your new goal has been added successfully.",
      })
      setOpen(false)
      resetForm()
    } else {
      toast({
        title: "Error",
        description: "Failed to create goal. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={styles.addButton} onClick={() => setOpen(true)}>
          <Plus className={styles.plusIcon} />
          Add New Goal
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Add New {category} Goal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <Label htmlFor="goal_name">Goal Name</Label>
            <input
              id="goal_name"
              className={styles.input}
              value={newGoal.goal_name}
              onChange={(e) => setNewGoal({ ...newGoal, goal_name: e.target.value })}
              placeholder="Enter goal name"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className={styles.textarea}
              value={newGoal.description}
              onChange={(e) => setNewGoal({ ...newGoal, description: e.target.value })}
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
              value={newGoal.target}
              onChange={(e) => setNewGoal({ ...newGoal, target: Number(e.target.value) })}
              min="0"
              required
            />
          </div>
          <DialogFooter className={styles.dialogFooter}>
            <Button type="submit" className={styles.submitButton}>
              Create Goal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default AddGoalDialog

