import React, { useState } from "react";
import { Card } from "../../ui/card";
import { Button } from "../../ui/button";
import { Textarea } from "../../ui/textarea";
import { useToast } from "../../ui/use-toast";
import { supabase } from "../../integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Label } from "../../ui/label";
import styles from './SymptomTracker.module.css';

export const SymptomTracker = () => {
  const [wellnessType, setWellnessType] = useState("");
  const [rating, setRating] = useState("");
  const [notes, setNotes] = useState("");
  const [tookSupplements, setTookSupplements] = useState("");
  const { toast } = useToast();

  const wellnessTypes = [
    "Energy Level",
    "Mental Clarity",
    "Physical Activity",
    "Sleep Quality",
    "Mood",
    "Digestion",
    "Immune Health",
    "Overall Wellness"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { error } = await supabase
        .from('symptom_tracking')
        .insert({
          symptom: wellnessType,
          severity: parseInt(rating),
          notes: `Supplements taken: ${tookSupplements}. Notes: ${notes}`,
        });

      if (error) throw error;

      toast({
        title: "Wellness tracked",
        description: "Your wellness entry has been recorded successfully.",
      });

      // Reset form
      setWellnessType("");
      setRating("");
      setNotes("");
      setTookSupplements("");
    } catch (error) {
      console.error('Error tracking wellness:', error);
      toast({
        title: "Error",
        description: "Failed to save wellness entry. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className={styles.card}>
      <h3 className={styles.title}>Daily Wellness Journal</h3>
      <p className={styles.description}>
        Track your daily wellness journey and celebrate your progress
      </p>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div>
          <Select
            value={wellnessType}
            onValueChange={setWellnessType}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="What would you like to track?" />
            </SelectTrigger>
            <SelectContent className={styles.selectContent}>
              {wellnessTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select
            value={rating}
            onValueChange={setRating}
          >
            <SelectTrigger className={styles.selectTrigger}>
              <SelectValue placeholder="How are you feeling? (1-10)" />
            </SelectTrigger>
            <SelectContent className={styles.selectContent}>
              {[...Array(10)].map((_, i) => {
                const value = i + 1;
                return (
                  <SelectItem key={value} value={value.toString()}>
                    {value}{value === 1 ? " - Poor :(" : value === 10 ? " - Amazing!" : ""}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className={styles.supplementSection}>
          <Label>Did you take your supplements today?</Label>
          <RadioGroup
            value={tookSupplements}
            onValueChange={setTookSupplements}
            className={styles.radioGroup}
          >
            <div className={styles.radioItem}>
              <RadioGroupItem value="yes" id="yes" />
              <Label htmlFor="yes">Yes</Label>
            </div>
            <div className={styles.radioItem}>
              <RadioGroupItem value="no" id="no" />
              <Label htmlFor="no">No</Label>
            </div>
          </RadioGroup>
        </div>
        <div>
          <Textarea
            placeholder="Share your wellness journey... What's working well? What makes you feel energized today?"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
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