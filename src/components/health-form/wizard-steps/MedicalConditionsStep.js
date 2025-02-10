import React, { useState, useCallback } from "react";
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

  const isConditionSelected = useCallback(
    (condition, spec = null) => {
      return spec
        ? conditions.some(
            (c) => c.condition === condition && c.specification === spec
          )
        : conditions.some((c) => c.condition === condition);
    },
    [conditions]
  );

  const toggleCondition = (condition, spec = "") => {
    const currentConditions = form.getValues("medicalConditions") || [];
    const existingIndex = currentConditions.findIndex(
      (c) => c.condition === condition
    );
    if (existingIndex !== -1) {
      if (!spec || currentConditions[existingIndex].specification === spec) {

        currentConditions.splice(existingIndex, 1);
        form.setValue("medicalConditions", [...currentConditions]);
        setOtherCondition("");
        setDialogOpen(false);
        return;
      } else {

        currentConditions[existingIndex].specification = spec;
        form.setValue("medicalConditions", [...currentConditions]);
        setOtherCondition("");
        setDialogOpen(false);
        return;
      }
    }
    const newCondition = { condition, specification: spec };
    form.setValue("medicalConditions", [...currentConditions, newCondition]);
    setOtherCondition("");
    setDialogOpen(false);
  };


  const removeCondition = (index) => {
    const updatedConditions = [...conditions];
    updatedConditions.splice(index, 1);
    form.setValue("medicalConditions", updatedConditions);
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
        <h2 className={styles.heading}>
          Do you have any medical conditions?
        </h2>

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
                        <div
                          onClick={(e) => {
      
                            if (isConditionSelected("Diabetes")) {
                              e.preventDefault();
                              const index = conditions.findIndex(
                                (c) => c.condition === "Diabetes"
                              );
                              removeCondition(index);
                            }
                          }}
                        >
                          <BubbleOption
                            label={condition.label}
                            isSelected={isConditionSelected("Diabetes")}
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
                            isSelected={isConditionSelected("Diabetes", "Type 1")}
                            onClick={() =>
                              toggleCondition("Diabetes", "Type 1")
                            }
                          />
                          <BubbleOption
                            label="Type 2"
                            isSelected={isConditionSelected("Diabetes", "Type 2")}
                            onClick={() =>
                              toggleCondition("Diabetes", "Type 2")
                            }
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                }

                else if (condition.requiresSpecification) {
                  return (
                    <Dialog
                      key={condition.id}
                      open={dialogOpen}
                      onOpenChange={setDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <div
                          onClick={(e) => {
                            if (isConditionSelected("Other")) {
                              e.preventDefault();
                              const index = conditions.findIndex(
                                (c) => c.condition === "Other"
                              );
                              removeCondition(index);
                            }
                          }}
                        >
                          <BubbleOption
                            label={condition.label}
                            isSelected={isConditionSelected("Other")}
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
                            onChange={(e) =>
                              setOtherCondition(e.target.value)
                            }
                            placeholder="Enter condition"
                          />
                          <Button
                            className={styles.fullWidthButton}
                            onClick={() =>
                              toggleCondition("Other", otherCondition)
                            }
                            disabled={!otherCondition.trim()}
                          >
                            Add
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                }
         
                return (
                  <BubbleOption
                    key={condition.id}
                    label={condition.label}
                    isSelected={isConditionSelected(condition.label)}
                    onClick={() => toggleCondition(condition.label)}
                  />
                );
              })}
            </div>

            <div className={styles.selectedConditionsContainer}>
              <Label>Selected Conditions:</Label>
              <div className={styles.badgeContainer}>
                {conditions.map((cond, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className={styles.badge}
                  >
                    {cond.condition}
                    {cond.specification && ` - ${cond.specification}`}
                    <button
                      onClick={() => removeCondition(index)}
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