import React from 'react';
import { Button } from "../components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from './AboutPage.module.css';

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.pageContainer}>
      <div className={styles.container}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className={styles.arrowIcon} />
          Back
        </Button>
        
        <div className={styles.contentWrapper}>
          <div className={styles.header}>
            <h1 className={styles.title}>About SupplementScribe.ai</h1>
            <p className={styles.subtitle}>
              Your personal health optimization companion powered by artificial intelligence.
            </p>
          </div>

          <div className={styles.mainContent}>
            <h2>Our Mission</h2>
            <p>
              We believe that everyone deserves access to personalized health insights
              and recommendations. By combining cutting-edge AI technology with
              scientific research, we help you make informed decisions about your
              health and wellness journey.
            </p>

            <h2>What We Offer</h2>
            <ul>
              <li>Personalized supplement recommendations based on your health profile</li>
              <li>AI-powered health assistant for real-time guidance</li>
              <li>Secure storage and analysis of your lab results</li>
              <li>Goal tracking and progress monitoring</li>
              <li>Evidence-based health optimization strategies</li>
            </ul>

            <h2>Privacy & Security</h2>
            <p>
              Your health data is precious, and we treat it that way. All information
              is encrypted and stored securely. We never share your personal data
              with third parties without your explicit consent.
            </p>
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.startbutton}>
              <Link className={styles.same} to="/input">Get Started</Link>
            </button>
            <button  className={styles.faqbutton}>
              <Link className={styles.same1} to="/faq">View FAQ</Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;