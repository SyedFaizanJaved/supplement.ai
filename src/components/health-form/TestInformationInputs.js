import React, { useState } from "react";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { ExternalLink, Upload, Loader2, HelpCircle } from "lucide-react";
import { supabase } from "../integrations/supabase/client";
import { useToast } from "../hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import styles from './TestInformationInputs.module.css';

const TestInformationInputs = ({ formData, onTestChange }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState({
    bloodwork: false,
    genetic: false
  });
  const [noTestsYet, setNoTestsYet] = useState(false);

  const handleFileUpload = async (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setUploading(prev => ({ ...prev, [type]: true }));
    console.log('Starting file upload:', { type, fileName: file.name });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('tempUserId', crypto.randomUUID());

      console.log('Invoking process-lab-results function...');
      const { data, error } = await supabase.functions.invoke('process-lab-results', {
        body: formData,
      });

      console.log('Upload response:', { data, error });

      if (error) {
        throw error;
      }

      onTestChange(type === "bloodwork" ? "hasBloodwork" : "hasGeneticTesting", true);

      toast({
        title: "File uploaded successfully",
        description: `Your ${type === "bloodwork" ? "blood work" : "genetic testing"} results have been uploaded.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <Label>Available Test Results</Label>
        
        <div className={styles.uploadSection}>
          <div className={styles.uploadGroup}>
            <Label htmlFor="bloodwork" className={styles.label}>
              Blood Work Results (PDF)
            </Label>
            <div className={styles.uploadControls}>
              <Button
                variant="outline"
                className={styles.uploadButton}
                disabled={uploading.bloodwork || noTestsYet}
                onClick={() => document.getElementById('bloodwork').click()}
                aria-disabled={noTestsYet}
              >
                {uploading.bloodwork ? (
                  <Loader2 className={styles.spinIcon} />
                ) : (
                  <Upload className={styles.icon} />
                )}
                {uploading.bloodwork ? "Uploading..." : "Upload Blood Work"}
              </Button>
              <input
                type="file"
                id="bloodwork"
                accept=".pdf"
                className={styles.hiddenInput}
                onChange={(e) => handleFileUpload(e, "bloodwork")}
                disabled={noTestsYet}
              />
              {formData.hasBloodwork && (
                <span className={styles.successText}>✓ Uploaded</span>
              )}
            </div>
          </div>

          <div className={styles.uploadGroup}>
            <div className={styles.labelWithTooltip}>
              <Label htmlFor="genetic" className={styles.label}>
                Genetic Testing Results (PDF)
              </Label>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className={styles.tooltipTrigger}>
                      <HelpCircle className={styles.icon} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className={styles.tooltipContent}>
                    <p className={styles.tooltipText}>
                      Helps understand your genetic profile to see how well your body processes nutrients
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className={styles.uploadControls}>
              <Button
                variant="outline"
                className={styles.uploadButton}
                disabled={uploading.genetic || noTestsYet}
                onClick={() => document.getElementById('genetic').click()}
                aria-disabled={noTestsYet}
              >
                {uploading.genetic ? (
                  <Loader2 className={styles.spinIcon} />
                ) : (
                  <Upload className={styles.icon} />
                )}
                {uploading.genetic ? "Uploading..." : "Upload Genetic Results"}
              </Button>
              <input
                type="file"
                id="genetic"
                accept=".pdf"
                className={styles.hiddenInput}
                onChange={(e) => handleFileUpload(e, "genetic")}
                disabled={noTestsYet}
              />
              {formData.hasGeneticTesting && (
                <span className={styles.successText}>✓ Uploaded</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.checkboxContainer}>
          <Checkbox
            id="no-tests"
            checked={noTestsYet}
            onCheckedChange={(checked) => {
              setNoTestsYet(checked);
              if (checked) {
                onTestChange("hasBloodwork", false);
                onTestChange("hasGeneticTesting", false);
              }
            }}
          />
          <Label htmlFor="no-tests" className={styles.checkboxLabel}>
            I don't have any test results yet
          </Label>
        </div>

        <Button
          variant="outline"
          className={styles.purchaseButton}
          onClick={() => window.open("/purchase-tests", "_blank")}
        >
          Purchase Tests <ExternalLink className={styles.icon} />
        </Button>
      </div>
    </div>
  );
};

export default TestInformationInputs;