import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Beaker, Pill, GraduationCap } from 'lucide-react';
import { PartnershipForm } from "../components/partnership/PartnershipForm";
import styles from "./WorkWithUsPage.module.css";

const WorkWithUsPage = () => {
  const navigate = useNavigate();
  const [selectedPartnership, setSelectedPartnership] = useState(null);

  return (
    <div className={styles.container}>
      {/* Back button */}
      <button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft />
      Back
      </button>

      {/* Page title */}
      <h1 className={styles.pageTitle}>Work with Us</h1>

      {/* Categories grid */}
      <div className={styles.grid}>
        {/* Influencers Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Users className={styles.icon} />
              Influencers
            </h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              Partner with us to promote science-based supplement recommendations to your audience.
            </p>
            <button 
              className={styles.button}
              onClick={() => setSelectedPartnership('influencer')}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Lab Companies Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Beaker className={styles.icon} />
              Lab Companies
            </h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              Integrate your lab testing services with our platform for seamless results analysis.
            </p>
            <button 
              className={styles.button}
              onClick={() => setSelectedPartnership('lab')}
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Supplement Companies Card */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <Pill className={styles.icon} />
              Supplement Companies
            </h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
              List your high-quality supplements on our platform and reach health-conscious customers.
            </p>
            <button 
              className={styles.button}
              onClick={() => setSelectedPartnership('supplement')}
            >
              Learn More
            </button>
          </div>
        </div>


        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>
              <GraduationCap className={styles.icon} />
              Student Ambassadors
            </h2>
          </div>
          <div className={styles.cardContent}>
            <p className={styles.description}>
            Join our student ambassador network for marketing experience.
            </p>
            <button 
              className={styles.button}
              onClick={() => setSelectedPartnership('supplement')}
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      {/* Partnership Application Dialog */}
      {selectedPartnership && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <PartnershipForm
              type={selectedPartnership}
              onClose={() => setSelectedPartnership(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkWithUsPage;

