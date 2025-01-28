import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HowItWorksModal } from "./HowItWorksModal";
import { BookOpen, LogIn, ShieldCheck } from "lucide-react";
import styles from "./LandingHero.module.css";

 const LandingHero = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);

  return (
    <>
      <div className={styles.navigationBar}>
        <div className={styles.navigationContent}>
          <h1 className={styles.logo}>
            SupplementScribe.ai
          </h1>
          <div className={styles.navigationButtons}>
            <button
              variant="ghost"
              onClick={() => navigate("/content")}
              className={styles.contentButton}
            >
              <BookOpen className={styles.buttonIcon} />
              Content
            </button>
            <button
              onClick={() => navigate("/login")}
              className={styles.LoginButton}
            >
              <LogIn className={styles.buttonIcon} />
              Login
            </button>
            {/* <Button variant="ghost" className={styles.menuButton}>
              <Menu className={styles.menuIcon} />
            </Button> */}
          </div>
        </div>
      </div>

      <div className={styles.heroContainer}>
        <div className={styles.heroContent}>
          {/* Main content */}
          <div className={styles.mainContentWrapper}>
            <div className={styles.gridContainer}>
              {/* Text content */}
              <div className={styles.textContent}>
                <h1 className={styles.mainHeading}>
                  Optimize Your Health with Supplements Tailored to Your Biology
                </h1>
                <p className={styles.subheading}>
                  Discover your perfect supplement plan in minutes—backed by your blood tests, genetics, and health goals.
                </p>
                <div className={styles.buttonGroup}>
                  <button
                    size="lg"
                    onClick={() => navigate("/input")}
                    className={styles.getStartedButton}
                  >
                    Get Started →
                  </button>
                  <button
                    size="lg"
                    onClick={() => navigate("/dashboard")}
                    variant="outline"
                    className={styles.dashboardButton}
                  >
                    Open Dashboard
                  </button>
                  <button
                    size="lg"
                    onClick={() => setShowHowItWorks(true)}
                    variant="outline"
                    className={styles.howItWorksButton}
                  >
                    How It Works
                  </button>
                </div>
              </div>

              {/* Image section */}
              <div className={styles.imageContainer}>
                <div className={styles.imageWrapper}>
                  <img
                    src="/lovable-uploads/1.png"
                    alt="Vitamin supplements"
                    className={styles.heroImage}
                  />
                  <div className={styles.imageOverlay}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Feature points */}
          <div className={styles.featuresGrid}>
            <div className={`${styles.featureItem} ${styles.fadeIn}`}>
              <div className={styles.featureIcon}>🔬</div>
              <h3 className={styles.featureTitle}>Backed by Science</h3>
              <p className={styles.featureDescription}>Get recommendations validated by thousands of clinical studies.</p>
            </div>
            <div className={`${styles.featureItem} ${styles.fadeInDelayed200}`}>
              <div className={styles.featureIcon}>🧬</div>
              <h3 className={styles.featureTitle}>Personalized to You</h3>
              <p className={styles.featureDescription}>Analyze your bloodwork, DNA, and lifestyle for a plan that fits.</p>
            </div>
            <div className={`${styles.featureItem} ${styles.fadeInDelayed400}`}>
              <div className={styles.featureIcon}>📈</div>
              <h3 className={styles.featureTitle}>Track Your Progress</h3>
              <p className={styles.featureDescription}>Monitor improvements in energy, sleep, and more over time.</p>
            </div>
            <div className={`${styles.featureItem} ${styles.fadeInDelayed600}`}>
              <div className={styles.featureIcon}>
                <ShieldCheck className={styles.shieldIcon} />
              </div>
              <h3 className={styles.featureTitle}>HIPAA Compliant</h3>
              <p className={styles.featureDescription}>All health data is encrypted and private.</p>
            </div>
          </div>

          {/* Footer links */}
          <div className={styles.footerLinks}>
            <div className={styles.footerLinksContent}>
              <Link to="/privacy" className={styles.footerLink}>Privacy Policy</Link>
              <Link to="/about" className={styles.footerLink}>About</Link>
              <Link to="/work-with-us" className={styles.footerLink}>Work with Us</Link>
              <Link to="/terms" className={styles.footerLink}>Terms & Conditions</Link>
              <Link to="/rewards" className={styles.footerLink}>Rewards</Link>
            </div>
          </div>
        </div>
      </div>

      <HowItWorksModal open={showHowItWorks} onClose={() => setShowHowItWorks(false)} />
    </>
  );
};

export {LandingHero}