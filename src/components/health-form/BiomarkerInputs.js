import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Plus, Trash2 } from "lucide-react";
import styles from './BiomarkerInputs.module.css';

export const BiomarkerInputs = ({ onChange }) => {
  const [biomarkers, setBiomarkers] = useState([{ name: "", value: "" }]);

  const handleAddBiomarker = () => {
    setBiomarkers([...biomarkers, { name: "", value: "" }]);
  };

  const handleRemoveBiomarker = (index) => {
    const newBiomarkers = biomarkers.filter((_, i) => i !== index);
    setBiomarkers(newBiomarkers);
    onChange(newBiomarkers);
  };

  const handleBiomarkerChange = (index, field, value) => {
    const newBiomarkers = biomarkers.map((biomarker, i) => {
      if (i === index) {
        return { ...biomarker, [field]: value };
      }
      return biomarker;
    });
    setBiomarkers(newBiomarkers);
    onChange(newBiomarkers);
  };

  return (
    <div className={styles.container}>
      <div className={styles.orDivider}>Or</div>
      <Label>Upload Biomarkers you are concerned with</Label>
      {biomarkers.map((biomarker, index) => (
        <div key={index} className={styles.biomarkerRow}>
          <div className={styles.inputWrapper}>
            <Input
              placeholder="Biomarker name (e.g., Vitamin D)"
              value={biomarker.name}
              onChange={(e) => handleBiomarkerChange(index, "name", e.target.value)}
            />
          </div>
          <div className={styles.inputWrapper}>
            <Input
              placeholder="Value"
              value={biomarker.value}
              onChange={(e) => handleBiomarkerChange(index, "value", e.target.value)}
            />
          </div>
          <div className={styles.removeButtonWrapper}>
            {index > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveBiomarker(index)}
              >
                <Trash2 className={styles.removeIcon} />
              </Button>
            )}
          </div>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className={styles.addButton}
        onClick={handleAddBiomarker}
      >
        <Plus className={styles.addIcon} />
        Add Another Biomarker
      </Button>
    </div>
  );
};