import React, { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox";
import { Upload, ExternalLink, Loader2, HelpCircle } from "lucide-react";
import { useToast } from "../../hooks/use-toast";
import { Textarea } from "../../ui/textarea";
import { Controller } from "react-hook-form";

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
  const [bloodFileName, setBloodFileName] = useState("");
  const [geneticFileName, setGeneticFileName] = useState("");
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleBloodFile = (e, field) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setBloodFileName(files[0].name);
      field.onChange([...files]);
      toast({
        title: "File uploaded successfully",
        description: "Your blood test file has been uploaded",
      });
    }
  };

  const handleGeneticFile = (e, field) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setGeneticFileName(files[0].name);
      field.onChange([...files]);
      toast({
        title: "File uploaded successfully",
        description: "Your genetic test file has been uploaded",
      });
    }
  };
  const handleRemoveBloodFile = () => {
    setBloodFileName("");
    form.setValue("bloodWorkFiles", null);
  };

  const handleRemoveGeneticFile = () => {
    setGeneticFileName("");
    form.setValue("geneticTestFiles", null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadGrid}>
        <div className={styles.uploadSection}>
          <Label className={styles.sectionTitle}>Blood Test Results</Label>
          <div className={styles.uploadBox}>
            <Upload className={styles.uploadIcon} />
            <div>
              <Label className={styles.uploadLabel}>
                Upload your blood test results
              </Label>
              <Controller
                control={form.control}
                name="bloodWorkFiles"
                render={({ field }) => (
                  <input
                    type="file"
                    accept=".pdf"
                    id="bloodwork"
                    className={styles.hiddenInput}
                    onChange={(e) => handleBloodFile(e, field)}
                    disabled={
                      uploading.bloodwork || noTestsYet || proceedWithoutTests
                    }
                  />
                )}
              />
            </div>
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById("bloodwork")?.click()}
              disabled={
                uploading.bloodwork || noTestsYet || proceedWithoutTests
              }
            >
              {uploading.bloodwork ? (
                <>
                  <Loader2 className={styles.buttonIcon} />
                  Uploading...
                </>
              ) : bloodFileName ? (
                <div className={styles.fileContainer}>
                  <span className={styles.fileName}>{bloodFileName}</span>
                  <span
                    className={styles.removeFile}
                    onClick={handleRemoveBloodFile}
                  >
                    ×
                  </span>
                </div>
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
              <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
                <TooltipTrigger asChild>
                  <div
                    className={styles.tooltipTrigger}
                    onMouseEnter={() => setTooltipOpen(true)}
                    onMouseLeave={() => setTooltipOpen(false)}
                  >
                    <HelpCircle className={styles.helpIcon} />
                  </div>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className={styles.tooltipContent}
                  onMouseEnter={() => setTooltipOpen(true)}
                  onMouseLeave={() => setTooltipOpen(false)}
                >
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
              <Label className={styles.uploadLabel}>
                Upload your genetic test results
              </Label>
              <Controller
                control={form.control}
                name="geneticTestFiles"
                render={({ field }) => (
                  <input
                    type="file"
                    accept=".pdf"
                    id="genetic"
                    className={styles.hiddenInput}
                    onChange={(e) => handleGeneticFile(e, field)}
                    disabled={
                      uploading.genetic || noTestsYet || proceedWithoutTests
                    }
                  />
                )}
              />
            </div>
            <Button
              variant="outline"
              className={styles.uploadButton}
              onClick={() => document.getElementById("genetic")?.click()}
              disabled={
                uploading.genetic || noTestsYet || proceedWithoutTests
              }
            >
              {uploading.genetic ? (
                <>
                  <Loader2 className={styles.buttonIcon} />
                  Uploading...
                </>
              ) : geneticFileName ? (
                <div className={styles.fileContainer}>
                  <span className={styles.fileName}>{geneticFileName}</span>
                  <span
                    className={styles.removeFile}
                    onClick={handleRemoveGeneticFile}
                  >
                    ×
                  </span>
                </div>
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

      <div className={styles.biomarkerSection} name="concerns">
        <Label className={styles.sectionTitle}>
          Describe any Biomarkers or Genetic Data you are concerned with
          specifically (Optional)
        </Label>
        <Textarea
  placeholder="E.g., Vitamin D levels, MTHFR gene mutation, cholesterol levels..."
  value={biomarkerConcerns}
  onChange={(e) => {
    setBiomarkerConcerns(e.target.value);
    form.setValue("concerns", e.target.value);
  }}
  className={styles.textarea}
/>

      </div>

      <div className={styles.providersSection}>
        <p className={styles.providersTitle}>Compatible with</p>
        <div className={styles.providersGrid}>
          <img
            src="/lovable-uploads/2.png"
            alt="23andMe"
            className={styles.providerLogo}
          />
          <img
            src="/lovable-uploads/3.png"
            alt="Ancestry"
            className={styles.providerLogo}
          />
          <img
            src="/lovable-uploads/4.png"
            alt="MyHeritage DNA"
            className={styles.providerLogo}
          />
          <img
            src="/lovable-uploads/5.png"
            alt="Quest Diagnostics"
            className={styles.providerLogo}
          />
          <img
            src="/lovable-uploads/6.png"
            alt="Labcorp"
            className={styles.providerLogo}
          />
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
                  setBloodFileName("");
                  setGeneticFileName("");
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
                  setBloodFileName("");
                  setGeneticFileName("");
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