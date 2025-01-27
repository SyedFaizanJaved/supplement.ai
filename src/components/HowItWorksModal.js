import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { LineChartIcon as ChartLine, Upload, Pill, MessageSquare, LayoutDashboard } from 'lucide-react';
import styles from './HowItWorksModal.module.css';

export const HowItWorksModal = ({ open, onClose }) => {
  const steps = [
    {
      icon: <ChartLine />,
      title: "Input Health Metrics",
      description: "Enter your basic health information and metrics",
    },
    {
      icon: <Upload />,
      title: "Upload Test Results",
      description: "Upload your blood work and/or genetic test results",
    },
    {
      icon: <Pill />,
      title: "Get Personalized Plan",
      description: "Receive tailored supplement recommendations based on your data",
    },
    {
      icon: <MessageSquare />,
      title: "Chat Support",
      description: "Access our health assistant for guidance and questions",
    },
    {
      icon: <LayoutDashboard />,
      title: "Track Progress",
      description: "Monitor your health journey through your personalized dashboard",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={styles.dialogContent}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            How It Works
          </DialogTitle>
        </DialogHeader>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={styles.step}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={styles.stepIcon}>{step.icon}</div>
              <div>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

