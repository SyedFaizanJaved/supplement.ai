import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { ChartLine, Upload, Pill, MessageSquare, LayoutDashboard, Gift, MessageCircle } from "lucide-react";
import { useIsMobile } from "./hooks/use-mobile";
import styles from './HowItWorksModal.module.css';

export const HowItWorksModal = ({ open, onClose }) => {
  const isMobile = useIsMobile();
  
  const steps = [
    {
      icon: <ChartLine className={styles.stepIcon} />,
      title: "Input Health Metrics",
      description: "Enter your basic health information and metrics",
    },
    {
      icon: <Upload className={styles.stepIcon} />,
      title: "Upload Test Results",
      description: "Upload your blood work and/or genetic test results",
    },
    {
      icon: <Pill className={styles.stepIcon} />,
      title: "Get Personalized Plan",
      description: "Receive tailored supplement recommendations based on your data",
    },
    {
      icon: <MessageSquare className={styles.stepIcon} />,
      title: "Chat Support",
      description: "Access our holistic health assistant for guidance and questions",
    },
    {
      icon: <LayoutDashboard className={styles.stepIcon} />,
      title: "Track Progress",
      description: "Monitor your health journey daily and receive recaps and insights",
    },
    {
      icon: <MessageCircle className={styles.stepIcon} />,
      title: "Receive Texts",
      description: "Everyday we will remind you to take your supplements and your holistic health advice providing inspiration to feel better and live healthier",
    },
    {
      icon: <Gift className={styles.stepIcon} />,
      title: "Redeem Prizes",
      description: "Earn XP points for logging if you took your supplements, complete your daily quiz, and refer friends in exchange for prizes like custom merch and fitness classes!",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className={`${styles.dialogContent} ${isMobile ? styles.mobilePadding : styles.desktopPadding}`}>
        <DialogHeader>
          <DialogTitle className={styles.dialogTitle}>
            How It Works
          </DialogTitle>
        </DialogHeader>
        <div className={styles.stepsContainer}>
          {steps.map((step, index) => (
            <div
              key={index}
              className={styles.stepItem}
            >
              <div className={styles.iconContainer}>
                <div className={styles.iconWrapper}>
                  {step.icon}
                </div>
              </div>
              <div className={styles.textContainer}>
                <h3 className={styles.stepTitle}>
                  {step.title}
                </h3>
                <p className={styles.stepDescription}>
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};