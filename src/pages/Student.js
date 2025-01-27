import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import styles from './Student.module.css';

function StudentsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton} 
        onClick={() => navigate("/")}
      >
        <ArrowLeft className={styles.backButtonIcon} />
        Back to Home
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Students</h1>
          <p className={styles.subtitle}>
            Special offers and opportunities for students
          </p>
        </div>

        <div className={styles.tabsContainer}>
          <div className={styles.tabsList}>
            <button 
              className={`${styles.tabsTrigger} ${styles.activeTab}`}
              data-value="discount"
            >
              Student Discount
            </button>
            <button 
              className={styles.tabsTrigger}
              data-value="ambassador"
            >
              Campus Ambassador
            </button>
          </div>

          <div className={styles.tabContent} data-value="discount">
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Student Discount</h2>
                <p className={styles.cardDescription}>
                  Get access to SupplementScribe at a special student rate
                </p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.pricingSection}>
                  <h3 className={styles.price}>$15/month</h3>
                  <p className={styles.priceDescription}>
                    Available for all students with a valid .edu email address
                  </p>
                </div>
                <div className={styles.detailsSection}>
                  <h4 className={styles.sectionTitle}>How it works:</h4>
                  <ul className={styles.benefitsList}>
                    <li>Sign up with your .edu email address</li>
                    <li>Get instant access to all premium features</li>
                    <li>Save $5 every month compared to regular pricing</li>
                    <li>No additional verification required</li>
                  </ul>
                  <button 
                    className={styles.actionButton}
                    onClick={() => navigate("/input")}
                  >
                    Get Started with Student Discount
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.tabContent} data-value="ambassador" hidden>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>Campus Ambassador Program</h2>
                <p className={styles.cardDescription}>
                  Represent SupplementScribe at your university and earn rewards
                </p>
              </div>
              <div className={styles.cardContent}>
                <div className={styles.programBenefits}>
                  <h4 className={styles.sectionTitle}>Program Benefits:</h4>
                  <ul className={styles.benefitsList}>
                    <li>Free premium subscription while you're an ambassador</li>
                    <li>Earn 15% commissions for every referral</li>
                    <li>Exclusive ambassador swag and merchandise</li>
                    <li>Add valuable experience to your resume</li>
                  </ul>
                </div>
                <div className={styles.programRequirements}>
                  <h4 className={styles.sectionTitle}>Requirements:</h4>
                  <ul className={styles.benefitsList}>
                    <li>Currently enrolled student</li>
                    <li>Post at least 5 Stories or Posts a month</li>
                  </ul>
                </div>
                <button 
                  className={styles.actionButton}
                  onClick={() => navigate("/work-with-us")}
                >
                  Apply to Become an Ambassador
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentsPage;