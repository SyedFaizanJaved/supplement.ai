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

export const TestResultsStep = ({ form, onTestChange }) => {
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
    console.log("File selected:", file);
    if (!file) return;

    // Validate file type
    if (file.type !== "application/pdf") {
      console.log("Invalid file type:", file.type);
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    const field = type === "bloodwork" ? "bloodWorkFiles" : "geneticTestFiles";
    const currentFiles = form.getValues(field) || [];
    console.log(`Current files for ${field}:`, currentFiles);

    // If a file already exists, prevent further uploads.
    if (currentFiles.length > 0) {
      console.log(`A file has already been uploaded for ${field}.`);
      toast({
        title: "File already uploaded",
        description: `You have already uploaded your ${type === "bloodwork" ? "blood work" : "genetic testing"} result.`,
        variant: "destructive",
      });
      return;
    }

    setUploading((prev) => ({ ...prev, [type]: true }));
    console.log(`Uploading started for ${type}`);

    try {
      form.setValue(field, [file]);
      console.log(`Stored file in form state under ${field}:`, form.getValues(field));

      form.setValue(
        type === "bloodwork" ? "hasBloodwork" : "hasGeneticTesting",
        true
      );
      console.log(`Set ${type === "bloodwork" ? "hasBloodwork" : "hasGeneticTesting"} to true`);

      toast({
        title: "File queued for upload",
        description: `Your ${type === "bloodwork" ? "blood work" : "genetic testing"} result will be uploaded with your registration.`,
      });

      if (onTestChange) {
        onTestChange(type, file);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "File selection failed",
        description: error.message || "There was an error selecting your file.",
        variant: "destructive",
      });
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
      console.log(`Uploading finished for ${type}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadGrid}>
        {/* Blood Test Upload Section */}
        <div className={styles.uploadSection}>
          <Label className={styles.sectionTitle}>Blood Test Results </Label>
          <div className={styles.uploadBox}>
            <Upload className={styles.uploadIcon} />

            <Label htmlFor="bloodwork" className={styles.uploadLabel}>
              Upload your blood test results
            </Label>
            <input
              type="file"
              id="bloodwork"
              accept=".pdf"
              className={styles.hiddenInput}
              onChange={(e) => handleFileUpload(e, "bloodwork")}
              {...form.register("bloodWorkFiles")}
              
            />
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById("bloodwork")?.click()}
              disabled={
                uploading.bloodwork ||
                noTestsYet ||
                proceedWithoutTests ||
                (form.getValues("bloodWorkFiles")?.length > 0)
              }
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

        {/* Genetic Test Upload Section */}
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

            <Label htmlFor="genetic" className={styles.uploadLabel}>
              Upload your genetic test results
            </Label>
            <input
              type="file"
              id="genetic"
              accept=".pdf"
              className={styles.hiddenInput}
              onChange={(e) => handleFileUpload(e, "genetic")}
              {...form.register("geneticTestFiles")}
            />
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById("genetic")?.click()}
              disabled={
                uploading.genetic ||
                noTestsYet ||
                proceedWithoutTests ||
                (form.getValues("geneticTestFiles")?.length > 0)
              }

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

      {/* Biomarker Concerns Section */}
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

      {/* Compatible Providers Section */}
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

      {/* Checkbox Section */}
      <div className={styles.checkboxSection}>
        <div className={styles.checkboxGroup}>
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