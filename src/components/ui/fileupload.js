import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "./dialog";
import { Label } from "./label";
import { Button } from "./button";
import { Upload } from "lucide-react";
import { useToast } from "./use-toast";
import styles from "./fileupload.module.css";

const FileUploadDialog = ({ onFileUpload }) => {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const resetForm = () => {
    setFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const success = await onFileUpload(file);
      if (success) {
        toast({
          title: "File Uploaded",
          description: "Your file has been uploaded successfully.",
        });
        setOpen(false);
        resetForm();
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={styles.uploadButton} onClick={() => setOpen(true)}>
          <Upload className={styles.uploadIcon} />
          <span className={styles.text}>Upload a File</span>
        </Button>
      </DialogTrigger>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle>Upload File</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <Label htmlFor="file">Select File</Label>
            <div className={styles.fileUploadContainer}>
              <input
                id="file"
                type="file"
                className={styles.fileInput}
                onChange={handleFileChange}
                accept=".pdf,.doc,.txt"
              />
              <div className={styles.uploadArea}>
                <Upload className={styles.uploadAreaIcon} />
                <p className={styles.uploadText}>
                  {file ? file.name : "Click or drag file to upload"}
                </p>
                <p className={styles.uploadSubtext}>
                  Supported files: PDF, DOC, DOCX, TXT
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className={styles.dialogFooter}>
            <Button
              type="submit"
              className={styles.submitButton}
              disabled={uploading || !file}
            >
              {uploading ? "Uploading..." : "Upload File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FileUploadDialog;
