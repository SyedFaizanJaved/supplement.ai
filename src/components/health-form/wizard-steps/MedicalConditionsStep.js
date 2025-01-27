import React, { useState } from "react";
import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { X } from "lucide-react";
import { BubbleOption } from "../BubbleOption";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "../../ui/dialog";
import styles from "./MedicalConditionsStep.module.css";

const CONDITIONS = [
  { id: "diabetes", label: "Diabetes", requiresType: true },
  { id: "thyroid", label: "Thyroid Issues" },
  { id: "cholesterol", label: "High Cholesterol" },
  { id: "blood-pressure", label: "High Blood Pressure" },
  { id: "adhd", label: "ADHD" },
  { id: "anxiety-depression", label: "Anxiety or Depression" },
  { id: "ibs", label: "IBS" },
  { id: "arthritis", label: "Arthritis" },
  { id: "cancer", label: "Cancer" },
  { id: "other", label: "Other", requiresSpecification: true },
];

export const MedicalConditionsStep = ({ form }) => {
  const [otherCondition, setOtherCondition] = useState("");
  const [noConditions, setNoConditions] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const conditions = form.watch("medicalConditions") || [];

  const handleAddCondition = (condition, spec) => {
    const newCondition = {
      condition,
      specification: spec,
    };
    
    const currentConditions = form.getValues("medicalConditions") || [];
    form.setValue("medicalConditions", [...currentConditions, newCondition]);
    setOtherCondition("");
    setDialogOpen(false);
  };

  const handleRemoveCondition = (index) => {
    const currentConditions = [...conditions];
    currentConditions.splice(index, 1);
    form.setValue("medicalConditions", currentConditions);
  };

  const handleNoConditions = (checked) => {
    setNoConditions(checked);
    if (checked) {
      form.setValue("medicalConditions", []);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h2 className={styles.heading}>Do you have any medical conditions?</h2>
        
        <BubbleOption
          label="I don't have any medical conditions"
          isSelected={noConditions}
          onClick={() => handleNoConditions(!noConditions)}
        />

        {!noConditions && (
          <>
            <div className={styles.conditionsGrid}>
              {CONDITIONS.map((condition) => {
                if (condition.id === "diabetes") {
                  return (
                    <Dialog key={condition.id}>
                      <DialogTrigger asChild>
                        <div>
                          <BubbleOption
                            label={condition.label}
                            isSelected={conditions.some(c => c.condition === "Diabetes")}
                            onClick={() => {}}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Select Diabetes Type</DialogTitle>
                          <DialogDescription>
                            Please select which type of diabetes you have
                          </DialogDescription>
                        </DialogHeader>
                        <div className={styles.conditionsGrid}>
                          <BubbleOption
                            label="Type 1"
                            isSelected={conditions.some(c => c.condition === "Diabetes" && c.specification === "Type 1")}
                            onClick={() => handleAddCondition("Diabetes", "Type 1")}
                          />
                          <BubbleOption
                            label="Type 2"
                            isSelected={conditions.some(c => c.condition === "Diabetes" && c.specification === "Type 2")}
                            onClick={() => handleAddCondition("Diabetes", "Type 2")}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                } else if (condition.requiresSpecification) {
                  return (
                    <Dialog key={condition.id}>
                      <DialogTrigger asChild>
                        <div>
                          <BubbleOption
                            label={condition.label}
                            isSelected={conditions.some(c => c.condition === "Other")}
                            onClick={() => {}}
                          />
                        </div>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>{condition.label}</DialogTitle>
                          <DialogDescription>
                            Please specify your condition
                          </DialogDescription>
                        </DialogHeader>
                        <div className={styles.otherConditionContainer}>
                          <Input
                            value={otherCondition}
                            onChange={(e) => setOtherCondition(e.target.value)}
                            placeholder="Enter condition"
                          />
                          <button
                            className={styles.fullWidthButton}
                            onClick={() => handleAddCondition("Other", otherCondition)}
                            disabled={!otherCondition.trim()}
                          >
                            Add
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                }
                
                return (
                  <BubbleOption
                    key={condition.id}
                    label={condition.label}
                    isSelected={conditions.some(c => c.condition === condition.label)}
                    onClick={() => handleAddCondition(condition.label)}
                  />
                );
              })}
            </div>

            <div className={styles.selectedConditionsContainer}>
              <Label>Selected Conditions:</Label>
              <div className={styles.badgeContainer}>
                {conditions.map((condition, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={styles.badge}
                  >
                    {condition.condition}
                    {condition.specification && ` - ${condition.specification}`}
                    <button
                      onClick={() => handleRemoveCondition(index)}
                      className={styles.removeButton}
                    >
                      <X className={styles.removeIcon} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};