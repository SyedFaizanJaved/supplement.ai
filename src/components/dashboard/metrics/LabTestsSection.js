import React, { useState, useRef } from "react";
import { Button } from "../../ui/button";
import { Upload, ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "../../ui/use-toast";
import styles from "./LabTestsSection.module.css";

export const LabTestsSection = ({
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

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file.",
        variant: "destructive",
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
      // Pass the file object up to the parent.
      onBloodTestUpload(file);
    }, 1500);
  };

  const handleGeneticFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
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
      // Pass the file object up to the parent.
      onGeneticTestUpload(file);
    }, 1500);
  };

  const handleRemoveBloodFile = () => {
    onBloodTestUpload(null); // Remove file in parent state.
  };

  const handleRemoveGeneticFile = () => {
    onGeneticTestUpload(null); // Remove file in parent state.
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
      <h3 className={styles.title}>Lab Tests</h3>
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
            accept=".pdf"
            onChange={handleBloodFile}
            disabled={uploading.blood}
          />
          <Button
            variant="outline"
            className={styles.uploadButton}
            disabled={uploading.blood}
            onClick={() => {
              if (!bloodTestFile) {
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
                <span className={styles.removeFile} onClick={handleRemoveBloodFile}>
                  ×
                </span>
              </div>
            ) : (
              <>
                <Upload className={styles.buttonIcon} />
                Choose PDF File
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
            accept=".pdf"
            onChange={handleGeneticFile}
            disabled={uploading.genetic}
          />
          <Button
            variant="outline"
            className={styles.uploadButton}
            disabled={uploading.genetic}
            onClick={() => {
              if (!geneticTestFile) {
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
                <span className={styles.removeFile} onClick={handleRemoveGeneticFile}>
                  ×
                </span>
              </div>
            ) : (
              <>
                <Upload className={styles.buttonIcon} />
                Choose PDF File
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