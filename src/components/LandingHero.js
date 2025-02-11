import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HowItWorksModal } from "./HowItWorksModal";
import { Book, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import styles from './LandingHero.module.css';
import { useToast } from "./ui/use-toast";

export const LandingHero = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been logged out.",
      variant: "success",
    });    
    navigate("/"); 
  };

  return (
    <>
      <div className={styles.navBar}>
        <div className={styles.navContainer}>
          <div className={styles.navContent}>
            <h1 className={styles.logo}>SupplementScribe.ai</h1>
            <div className={styles.navButtons}>
              {user && user.token ? (
                <button
                  size="icon"
                  onClick={handleLogout}
                  className={styles.logout}
                >
                  <LogOut className={styles.icon} />
                  Logout
                </button>
              ) : (
                <button
                  size="icon"
                  onClick={() => navigate("/login")}
                  className={styles.login}
                >
                  <LogIn className={styles.icon} />
                  Login
                </button>
              )}
              <button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/content")}
                className={styles.iconButton}
              >
                <Book className={styles.icon} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainContainer}>
        <div className={styles.contentWrapper}>
          <div className={styles.heroSection}>
            <div className={styles.gridContainer}>
              <div className={styles.textContent}>
                <h1 className={styles.mainHeading}>
                  Optimize Your Health with Supplements Tailored to Your Biology
                </h1>
                <p className={styles.subHeading}>
                  Feel better, naturally. Discover your perfect supplement plan in minutes—backed by your blood tests, genetics, and health goals.
                </p>
                <div className={styles.buttonGroup}>
                  <button
                    size="lg"
                    onClick={() => navigate("/input")}
                    className={styles.primaryButton}
                  >
                    Get Started →
                  </button>
                  
                  <button
                    size="lg"
                    onClick={() => {               
                      if (user && user.token) {
                        navigate("/dashboard");
                      } else {
                        navigate("/login");
                      }
                    }}
                    variant="outline"
                    className={styles.secondaryButton}
                  >
                    Open Dashboard
                  </button>
                  
                  <button
                    size="lg"
                    onClick={() => setShowHowItWorks(true)}
                    variant="outline"
                    className={styles.secondaryButton}
                  >
                    How It Works
                  </button>
                </div>
              </div>

              <div className={styles.imageSection}>
                <div className={styles.imageContainer}>
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

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.emojiContainer}>
                <span className={styles.emoji}>🔬</span>
              </div>
              <h3 className={styles.featureTitle}>Backed by Science</h3>
              <p className={styles.featureText}>Get recommendations validated by thousands of clinical studies.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.emojiContainer}>
                <span className={styles.emojis}>🧬</span>
              </div>
              <h3 className={styles.featureTitle}>Personalized to You</h3>
              <p className={styles.featureText}>Analyze your bloodwork, DNA, and lifestyle for a plan that fits.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.emojiContainer}>
                <span className={styles.emoji}>📈</span>
              </div>
              <h3 className={styles.featureTitle}>Track Your Progress</h3>
              <p className={styles.featureText}>Monitor improvements in energy, sleep, and more over time.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.emojiContainer}>
                <ShieldCheck className={styles.shieldIcon} />
              </div>
              <h3 className={styles.featureTitle}>HIPAA Compliant</h3>
              <p className={styles.featureText}>All health data is encrypted and private.</p>
            </div>
          </div>

          <div className={styles.footer}>
            <div className={styles.footerLinks}>
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

export default LandingHero;
