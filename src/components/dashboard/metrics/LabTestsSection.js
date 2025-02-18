import React, { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Upload, ShoppingCart, Loader2, HelpCircle } from "lucide-react";
import { useToast } from "../../ui/use-toast";

// Import the tooltip components
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "../../ui/tooltip";
import styles from "./LabTestsSection.module.css";
const supportedFiles = ["application/pdf", "text/csv", "text/plain"];

const LabTestsSection = ({
  isEditing,
  bloodTestFile,
  geneticTestFile,
  onBloodTestUpload,
  onGeneticTestUpload,
}) => {
  const { toast } = useToast();

  const [uploading, setUploading] = useState({
    blood: false,
    genetic: false,
  });

  // Create refs for the hidden file inputs.
  const bloodInputRef = useRef(null);
  const geneticInputRef = useRef(null);

  const handleBloodFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!supportedFiles.includes(file.type)) {
      toast({
        title: "Only pdf, csv, text are supported",
        variant: "warning",
      });
      return;
    }

    setUploading((prev) => ({ ...prev, blood: true }));
    // Simulate file upload delay.
    setTimeout(() => {
      toast({
        title: "File uploaded successfully",
        description: "Your lab test file has been uploaded.",
      });
      setUploading((prev) => ({ ...prev, blood: false }));
      onBloodTestUpload(file);
    }, 1500);
  };

  const handleGeneticFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File-type", file.type);

    if (!supportedFiles.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
      });
      return;
    }

    setUploading((prev) => ({ ...prev, genetic: true }));
    // Simulate file upload delay.
    setTimeout(() => {
      toast({
        title: "File uploaded successfully",
        description: "Your genetic test file has been uploaded.",
      });
      setUploading((prev) => ({ ...prev, genetic: false }));
      onGeneticTestUpload(file);
    }, 1500);
  };

  const handleRemoveBloodFile = () => {
    if (!isEditing) return;
    onBloodTestUpload(null);
  };

  const handleRemoveGeneticFile = () => {
    if (!isEditing) return;
    onGeneticTestUpload(null);
  };

  const handlePurchase = () => {
    toast({
      title: "Redirecting to lab test purchase",
      description:
        "You'll be redirected to our partner's website to purchase your lab test.",
    });
    window.open("/purchase-tests", "_blank");
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        Lab Tests
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <span className={styles.tooltipTrigger}>
                <HelpCircle className={styles.helpIcon} />
              </span>
            </TooltipTrigger>
            <TooltipContent side="bottom" className={styles.tooltipContent}>
              Click on the Edit information button to upload a file and save the
              information
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </h3>

      <div className={styles.grid}>
        {/* Lab Test Upload */}
        <div className={styles.card}>
          <Upload className={styles.icon} />
          <h4 className={styles.cardTitle}>Lab Test</h4>
          <p className={styles.cardDescription}>
            Upload your lab test results here
          </p>
          <input
            type="file"
            ref={bloodInputRef}
            style={{ display: "none" }}
            accept=".pdf, .csv, .txt"
            onChange={handleBloodFile}
          />
          <Button
            variant="outline"
            className={styles.uploadButton}
            disabled={!isEditing || uploading.blood}
            onClick={() => {
              if (isEditing && !bloodTestFile) {
                bloodInputRef.current?.click();
              }
            }}
          >
            {uploading.blood ? (
              <>
                <Loader2 className={styles.spinningIcon} />
                Processing...
              </>
            ) : bloodTestFile ? (
              <div className={styles.fileContainer}>
                <span>{bloodTestFile.name}</span>
                {isEditing && (
                  <span
                    className={styles.removeFile}
                    onClick={handleRemoveBloodFile}
                  >
                    ×
                  </span>
                )}
              </div>
            ) : (
              <>
                <Upload className={styles.buttonIcon} />
                Choose File
              </>
            )}
          </Button>
        </div>

        {/* Genetic Test Upload */}
        <div className={styles.card}>
          <Upload className={styles.icon} />
          <h4 className={styles.cardTitle}>Genetic Test</h4>
          <p className={styles.cardDescription}>
            Upload your genetic test results here
          </p>
          <input
            type="file"
            ref={geneticInputRef}
            style={{ display: "none" }}
            accept=".pdf, .csv, .txt"
            onChange={handleGeneticFile}
          />
          <Button
            variant="outline"
            className={styles.uploadButton}
            disabled={!isEditing || uploading.genetic}
            onClick={() => {
              if (isEditing && !geneticTestFile) {
                geneticInputRef.current?.click();
              }
            }}
          >
            {uploading.genetic ? (
              <>
                <Loader2 className={styles.spinningIcon} />
                Processing...
              </>
            ) : geneticTestFile ? (
              <div className={styles.fileContainer}>
                <span>{geneticTestFile.name}</span>
                {isEditing && (
                  <span
                    className={styles.removeFile}
                    onClick={handleRemoveGeneticFile}
                  >
                    ×
                  </span>
                )}
              </div>
            ) : (
              <>
                <Upload className={styles.buttonIcon} />
                Choose File
              </>
            )}
          </Button>
        </div>

        {/* Purchase Lab Test */}
        <div className={styles.card}>
          <ShoppingCart className={styles.icon} />
          <h4 className={styles.cardTitle}>Purchase a Lab Test</h4>
          <p className={styles.cardDescription}>
            Get comprehensive lab testing through our trusted partners
          </p>
          <Button onClick={handlePurchase} className={styles.purchaseButton}>
            Order Now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LabTestsSection;
