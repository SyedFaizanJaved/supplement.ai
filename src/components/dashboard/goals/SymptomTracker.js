import React, { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { useToast } from "../../ui/use-toast";
import { submitSymptomTracking } from "../../../services/journal/index"; // <-- import the function
import { Label } from "../../ui/label";
import { Slider } from "../../ui/slider";
import styles from "./SymptomTracker.module.css";

export const SymptomTracker = () => {
  const [energyLevel, setEnergyLevel] = useState(3);
  const [stressLevel, setStressLevel] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [otherSymptoms, setOtherSymptoms] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // yahan call ki ha submitSymptomTracking function ko jo journal/index.js me ha
      await submitSymptomTracking(energyLevel, sleepQuality, stressLevel, otherSymptoms);

      toast({
        title: "Wellness tracked",
        description: "Your wellness entry has been recorded successfully.",
      });

      //---reset form krne ke liye
      setEnergyLevel(3);
      setStressLevel(3);
      setSleepQuality(3);
      setOtherSymptoms("");
    } catch (error) {
      console.error("Error tracking wellness:", error);
      toast({
        title: "Error",
        description: "Failed to save wellness entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderSliderSection = (label, value, setValue, minLabel, maxLabel) => (
    <div className={styles.sliderSection}>
      <Label>{label}</Label>
      <div className={styles.sliderContainer}>
        <Slider
          value={[value]}
          onValueChange={(value) => setValue(value[0])}
          max={5}
          min={1}
          step={1}
          className={styles.slider}
        />
        <div className={styles.numberLabels}>
          <span>1</span>
          <span>2</span>
          <span>3</span>
          <span>4</span>
          <span>5</span>
        </div>
        <div className={styles.textLabels}>
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    </div>
  );

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>Daily Wellness Journal</h3>
      <form onSubmit={handleSubmit} className={styles.form}>
        {renderSliderSection(
          "How is your energy today?",
          energyLevel,
          setEnergyLevel,
          "Low Energy",
          "Great Energy"
        )}
        {renderSliderSection(
          "How well did you sleep?",
          sleepQuality,
          setSleepQuality,
          "Poor Sleep",
          "Great Sleep"
        )}
        {renderSliderSection(
          "Did you feel anxious or stressed today?",
          stressLevel,
          setStressLevel,
          "Not at all",
          "Very"
        )}
        <div className={styles.textareaSection}>
          <Label>Any other symptoms you want to track?</Label>
          <Textarea
            placeholder="Enter any other symptoms or notes here..."
            value={otherSymptoms}
            onChange={(e) => setOtherSymptoms(e.target.value)}
            className={styles.textarea}
          />
        </div>
        <Button type="submit" className={styles.submitButton}>
          Record Wellness Entry
        </Button>
      </form>
    </Card>
  );
};
