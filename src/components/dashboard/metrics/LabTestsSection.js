import React, { useState } from 'react';
import { Button } from "../../ui/button";
import { Upload, ShoppingCart, Loader2 } from "lucide-react";
import { useToast } from "../../ui/use-toast";
import { supabase } from "../../integrations/supabase/client";
import styles from './LabTestsSection.module.css';

export const LabTestsSection = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // First, upload the file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `lab_results/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('health_files')
        .upload(filePath, file);

      if (uploadError) {
        throw new Error('Failed to upload file');
      }

      // Now call the process-lab-results function
      const { data: session } = await supabase.auth.getSession();
      if (!session?.session?.access_token) {
        throw new Error('No authentication session found');
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await supabase.functions.invoke('process-lab-results', {
        body: formData,
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      toast({
        title: "Lab results uploaded successfully",
        description: "Your results are being processed and will be available shortly.",
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error.message || "There was an error uploading your lab results.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handlePurchase = () => {
    toast({
      title: "Redirecting to lab test purchase",
      description: "You'll be redirected to our partner's website to purchase your lab test.",
    });
    window.open("/purchase-tests", "_blank");
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Lab Tests</h3>
      <div className={styles.grid}>
        <div className={styles.card}>
          <Upload className={styles.icon} />
          <h4 className={styles.cardTitle}>Upload Your Lab Tests</h4>
          <p className={styles.cardDescription}>
            Drop your lab test results here or click to upload
          </p>
          <label className={styles.fullWidth}>
            <input
              type="file"
              className={styles.hiddenInput}
              accept=".pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
            <Button 
              variant="outline" 
              className={styles.uploadButton}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className={styles.spinningIcon} />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className={styles.buttonIcon} />
                  Choose PDF File
                </>
              )}
            </Button>
          </label>
        </div>
        
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