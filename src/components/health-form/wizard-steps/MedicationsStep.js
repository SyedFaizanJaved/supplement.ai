import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Checkbox } from "../../ui/checkbox";
import { Label } from "../../ui/label";
import { Plus } from "lucide-react";
import styles from "./MedicationsStep.module.css";

export const MedicationsStep = ({ form }) => {
  const [newMedication, setNewMedication] = useState("");
  const currentMedications = form.watch("currentMedications") || [];
  const [noMedications, setNoMedications] = useState(false);

  const handleAddMedication = () => {
    if (newMedication.trim() && !noMedications) {
      const updatedMedications = [...currentMedications, newMedication.trim()];
      form.setValue("currentMedications", updatedMedications);
      setNewMedication("");
    }
  };

  const handleRemoveMedication = (index) => {
    const updatedMedications = currentMedications.filter((_, i) => i !== index);
    form.setValue("currentMedications", updatedMedications);
  };

  const handleNoMedications = (checked) => {
    setNoMedications(checked);
    if (checked) {
      form.setValue("currentMedications", []);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.medicationSection}>
        <h3 className={styles.heading}>Are you taking any medications?</h3>
        
        <div className={styles.inputContainer}>
          <Input
            placeholder="Enter medication name"
            value={newMedication}
            onChange={(e) => setNewMedication(e.target.value)}
            disabled={noMedications}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAddMedication();
              }
            }}
          />
          <Button
            type="button"
            onClick={handleAddMedication}
            disabled={!newMedication.trim() || noMedications}
            className={styles.plusadd}
          >
            <Plus className={styles.plusIcon} />
            Add
          </Button>
        </div>

        <div className={styles.checkboxContainer}>
          <Checkbox
            id="noMedications"
            checked={noMedications}
            onCheckedChange={handleNoMedications}
          />
          <Label htmlFor="noMedications">
            I am not currently taking any medications
          </Label>
        </div>

        {currentMedications.length > 0 && (
          <div className={styles.medicationList}>
            <h4 className={styles.listHeading}>Current Medications:</h4>
            <ul className={styles.listContainer}>
              {currentMedications.map((medication, index) => (
                <li
                  key={index}
                  className={styles.medicationItem}
                >
                  <span>{medication}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveMedication(index)}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};