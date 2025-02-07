import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Upload, ExternalLink, Loader2, HelpCircle } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Textarea } from "../../ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import styles from "./TestResultsStep.module.css";

export const TestResultsStep = ({ form }) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState({
    bloodwork: false,
    genetic: false,
  });
  const [noTestsYet, setNoTestsYet] = useState(false);
  const [proceedWithoutTests, setProceedWithoutTests] = useState(false);
  const [biomarkerConcerns, setBiomarkerConcerns] = useState("");

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

    setUploading((prev) => ({ ...prev, [type]: true }));

    try {
      // Convert file to base64
      const base64File = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
      });

      // Update form with file data
      const field = type === "bloodwork" ? "bloodWorkFiles" : "geneticTestFiles";
      const fileData = {
        name: file.name,
        type: file.type,
        size: file.size,
        content: base64File
      };
      
      // Store single file instead of array
      form.setValue(field, fileData);
      
      // Set flag indicating file was uploaded
      form.setValue(type === "bloodwork" ? "hasBloodwork" : "hasGeneticTesting", true);

      toast({
        title: "File uploaded successfully",
        description: `Your ${type === "bloodwork" ? "blood work" : "genetic testing"} results have been uploaded.`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your file.",
        variant: "destructive",
      });
      
      // Clear form values on error
      const field = type === "bloodwork" ? "bloodWorkFiles" : "geneticTestFiles";
      form.setValue(field, null);
      form.setValue(type === "bloodwork" ? "hasBloodwork" : "hasGeneticTesting", false);
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
    }
  };

  return (
    <div className={styles.container}>
      {/* Rest of the JSX remains the same */}
      <div className={styles.uploadGrid}>
        <div className={styles.uploadSection}>
          <Label className={styles.sectionTitle}>Blood Test Results</Label>
          <div className={styles.uploadBox}>
            <Upload className={styles.uploadIcon} />
            <div>
              <Label htmlFor="bloodwork" className={styles.uploadLabel}>
                Upload your blood test results
              </Label>
              <input
                type="file"
                id="bloodwork"
                accept=".pdf"
                className={styles.hiddenInput}
                onChange={(e) => handleFileUpload(e, "bloodwork")}
                disabled={uploading.bloodwork || noTestsYet || proceedWithoutTests}
              />
            </div>
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById("bloodwork")?.click()}
              disabled={uploading.bloodwork || noTestsYet || proceedWithoutTests}
            >
              {uploading.bloodwork ? (
                <>
                  <Loader2 className={styles.buttonIcon} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className={styles.buttonIcon} />
                  Choose File
                </>
              )}
            </Button>
          </div>
        </div>

        <div className={styles.uploadSection}>
          <div className={styles.titleWithTooltip}>
            <Label className={styles.sectionTitle}>Genetic Test Results</Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={styles.tooltipTrigger}>
                    <HelpCircle className={styles.helpIcon} />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className={styles.tooltipContent}>
                  <p className={styles.tooltipText}>
                    Already completed any DNA test? Download the raw file and
                    upload it here. We can analyze it and find which supplements
                    are best for you.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className={styles.uploadBox}>
            <Upload className={styles.uploadIcon} />
            <div>
              <Label htmlFor="genetic" className={styles.uploadLabel}>
                Upload your genetic test results
              </Label>
              <input
                type="file"
                id="genetic"
                accept=".pdf"
                className={styles.hiddenInput}
                onChange={(e) => handleFileUpload(e, "genetic")}
                disabled={uploading.genetic || noTestsYet || proceedWithoutTests}
              />
            </div>
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById("genetic")?.click()}
              disabled={uploading.genetic || noTestsYet || proceedWithoutTests}
            >
              {uploading.genetic ? (
                <>
                  <Loader2 className={styles.buttonIcon} />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className={styles.buttonIcon} />
                  Choose File
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className={styles.biomarkerSection}>
        <Label className={styles.sectionTitle}>
          Describe any Biomarkers or Genetic Data you are concerned with specifically (Optional)
        </Label>
        <Textarea
          placeholder="E.g., Vitamin D levels, MTHFR gene mutation, cholesterol levels..."
          value={biomarkerConcerns}
          onChange={(e) => setBiomarkerConcerns(e.target.value)}
          className={styles.textarea}
        />
      </div>

      <div className={styles.providersSection}>
        <p className={styles.providersTitle}>Compatible with</p>
        <div className={styles.providersGrid}>
          <img src="/lovable-uploads/2.png" alt="23andMe" className={styles.providerLogo} />
          <img src="/lovable-uploads/3.png" alt="Ancestry" className={styles.providerLogo} />
          <img src="/lovable-uploads/4.png" alt="MyHeritage DNA" className={styles.providerLogo} />
          <img src="/lovable-uploads/5.png" alt="Quest Diagnostics" className={styles.providerLogo} />
          <img src="/lovable-uploads/6.png" alt="Labcorp" className={styles.providerLogo} />
        </div>
        <p className={styles.providersSubtitle}>+ many more!</p>
      </div>

      <div className={styles.checkboxSection}>
        <div className={styles.checkboxGroup}>
          <div className={styles.checkboxWrapper}>
            <Checkbox
              id="no-tests"
              checked={noTestsYet}
              onCheckedChange={(checked) => {
                setNoTestsYet(checked);
                if (checked) {
                  form.setValue("bloodWorkFiles", null);
                  form.setValue("geneticTestFiles", null);
                  form.setValue("hasBloodwork", false);
                  form.setValue("hasGeneticTesting", false);
                }
              }}
            />
            <Label htmlFor="no-tests" className={styles.checkboxLabel}>
              I don't have any test results yet but am purchasing
            </Label>
          </div>

          <div className={styles.checkboxWrapper}>
            <Checkbox
              id="proceed-without-tests"
              checked={proceedWithoutTests}
              onCheckedChange={(checked) => {
                setProceedWithoutTests(checked);
                if (checked) {
                  setNoTestsYet(false);
                  form.setValue("bloodWorkFiles", null);
                  form.setValue("geneticTestFiles", null);
                  form.setValue("hasBloodwork", false);
                  form.setValue("hasGeneticTesting", false);
                }
              }}
            />
            <Label htmlFor="proceed-without-tests" className={styles.checkboxLabel}>
              Proceed without any test results
            </Label>
          </div>
        </div>

        <Button
          variant="outline"
          className={styles.purchaseButton}
          onClick={() => window.open("/purchase-tests", "_blank")}
        >
          <ExternalLink className={styles.buttonIcon} />
          Purchase Tests from Our Partners
        </Button>
      </div>
    </div>
  );
};

export default TestResultsStep;