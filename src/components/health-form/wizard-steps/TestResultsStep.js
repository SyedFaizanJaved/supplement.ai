import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Upload, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { supabase } from "../../integrations/supabase/client";
import styles from "./TestResultsStep.module.css";

export const TestResultsStep = ({ form }) => {
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

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);
      formData.append('tempUserId', crypto.randomUUID());

      const { error } = await supabase.functions.invoke('process-lab-results', {
        body: formData,
      });

      if (error) throw error;

      form.setValue(type === "bloodwork" ? "hasBloodwork" : "hasGeneticTesting", true);

      toast({
        title: "File uploaded successfully",
        description: `Your ${type === "bloodwork" ? "blood work" : "genetic testing"} results have been uploaded.`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
    } finally {
      setUploading(prev => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.gridContainer}>
        {/* Blood Test Upload Section */}
        <div className={styles.uploadSection}>
          <Label className={styles.labelBase}>Blood Test Results</Label>
          <div className={styles.uploadBox}>
            <Upload className={styles.uploadIcon} />
            <div>
              <Label htmlFor="bloodwork" className={styles.uploadLabel}>
                Upload your blood test results (PDF)
              </Label>
              <input
                type="file"
                id="bloodwork"
                accept=".pdf"
                className={styles.hiddenInput}
                onChange={(e) => handleFileUpload(e, "bloodwork")}
                disabled={uploading.bloodwork || noTestsYet}
              />
            </div>
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById('bloodwork')?.click()}
              disabled={uploading.bloodwork || noTestsYet}
            >
              {uploading.bloodwork ? (
                <>
                  <Loader2 className={styles.spinningLoader} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className={styles.buttonIcon} />
                  Choose PDF File
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Genetic Test Upload Section */}
        <div className={styles.uploadSection}>
          <Label className={styles.labelBase}>Genetic Test Results</Label>
          <div className={styles.uploadBox}>
            <Upload className={styles.uploadIcon} />
            <div>
              <Label htmlFor="genetic" className={styles.uploadLabel}>
                Upload your genetic test results (PDF)
              </Label>
              <input
                type="file"
                id="genetic"
                accept=".pdf"
                className={styles.hiddenInput}
                onChange={(e) => handleFileUpload(e, "genetic")}
                disabled={uploading.genetic || noTestsYet}
              />
            </div>
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById('genetic')?.click()}
              disabled={uploading.genetic || noTestsYet}
            >
              {uploading.genetic ? (
                <>
                  <Loader2 className={styles.spinningLoader} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className={styles.buttonIcon} />
                  Choose PDF File
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.checkboxContainer}>
        <div className={styles.checkboxWrapper}>
          <Checkbox
            id="no-tests"
            checked={noTestsYet}
            onCheckedChange={(checked) => {
              setNoTestsYet(checked);
              if (checked) {
                form.setValue("hasBloodwork", false);
                form.setValue("hasGeneticTesting", false);
              }
            }}
          />
          <Label htmlFor="no-tests" className={styles.checkboxLabel}>
            I don't have any test results yet
          </Label>
        </div>

        <button
          variant="outline"
          className={styles.purchaseButton}
          onClick={() => window.open("/purchase-tests", "_blank")}
        >
          <ExternalLink className={styles.buttonIcon} />
          Purchase Tests from Our Partners
        </button>
      </div>
    </div>
  );
};