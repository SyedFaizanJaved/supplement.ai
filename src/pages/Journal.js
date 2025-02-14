import React, { useState } from "react";
import { SymptomTracker } from "../components/dashboard/goals/SymptomTracker";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { useToast } from "../components/ui/use-toast";
import { supabase } from "../components/integrations/supabase/client";
import styles from "./Journal.module.css";

const Journal = () => {
  const navigate = useNavigate();
  const [tookSupplements, setTookSupplements] = useState("");
  const { toast } = useToast();

  const handleSupplementsSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { error } = await supabase
        .from('supplement_tracking')
        .insert({
          took_supplements: tookSupplements === "yes",
          date: new Date().toISOString(),
          user_id: user.id
        });

      if (error) throw error;

      toast({
        title: "Recorded successfully",
        description: "Your supplement intake has been tracked.",
      });
      
      setTookSupplements("");
    } catch (error) {
      console.error('Error tracking supplements:', error);
      toast({
        title: "Error",
        description: "Failed to save. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <Button
            variant="ghost"
            size="sm"
            className={styles.backButton}
            onClick={() => navigate("/dashboard")}
          >
            <ChevronLeft className={styles.backIcon} />
            <span className={styles.backText}>Back to Dashboard</span>
          </Button>
          <h1 className={styles.title}>Health Journal</h1>
        </div>

        <Card className={styles.supplementCard}>
          <div className={styles.supplementContent}>
            <div className={styles.supplementInner}>
              <h3 className={styles.supplementTitle}>Daily Supplement Check</h3>
              <div className={styles.supplementForm}>
                <Label className={styles.questionLabel}>
                  Did you take your supplements today?
                </Label>
                <RadioGroup
                  value={tookSupplements}
                  onValueChange={setTookSupplements}
                  className={styles.radioGroup}
                >
                  {["yes", "no"].map((value) => (
                    <div key={value} className={styles.radioWrapper}>
                      <div className={styles.radioInner}>
                        <div className={styles.radioBox}>
                          <RadioGroupItem value={value} id={value} className={styles.radio} />
                        </div>
                        <Label htmlFor={value} className={styles.radioLabel}>
                          {value.charAt(0).toUpperCase() + value.slice(1)}
                        </Label>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
                <Button 
                  onClick={handleSupplementsSubmit}
                  className={styles.submitButton}
                  disabled={!tookSupplements}
                  size="lg"
                >
                  Save Response
                </Button>
              </div>
            </div>
          </div>
        </Card>

        <Card className={styles.trackerCard}>
          <div className={styles.trackerContent}>
            <SymptomTracker />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Journal;