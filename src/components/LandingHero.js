import React, { useState ,useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HowItWorksModal } from "./HowItWorksModal";
import { Book, LogIn, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext"; 
import styles from './LandingHero.module.css';
import { useToast } from "./ui/use-toast";

export const LandingHero = () => {
  const navigate = useNavigate();
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [isWhyVisible, setIsWhyVisible] = useState(false);
  const { toast } = useToast();
  const { user, logout } = useAuth();


  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsWhyVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    const whySection = document.getElementById("why-section");
    if (whySection) {
      observer.observe(whySection);
    }

    return () => {
      if (whySection) {
        observer.unobserve(whySection);
      }
    };
  }, []);

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
          <div className={styles.container}>
      <img 
        src="/lovable-uploads/logo.png" 
        alt="SupplementScribe Logo" 
        className={styles.logo}
      />
    </div>
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

          <div 
      id="why-section"
      className={`${styles.whySection} ${isWhyVisible ? styles.visible : styles.hidden}`}
    >
      <h2 className={styles.mainTitle}>
        Why SupplementScribe?
      </h2>
      <div className={styles.content}>
        <h3 className={styles.subtitle}>
          Stop Wasting Money on Generic Supplements!
        </h3>
        
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Overwhelmed by Choices?</h4>
          <p className={styles.text}>
            Up to 80% of supplement users take products that aren't tailored to their unique needs. That means you might be wasting money and even risking your health.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Not Getting the Results You Need?</h4>
          <p className={styles.text}>
            Standard multivitamins and powders often miss the mark. They don't match your body's exact nutritional needs, which can lead to under- or over-supplementation.
          </p>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Experience a Tailor-Made Supplement Plan:</h4>
          <div className={styles.subsectionList}>
            <div className={styles.subsection}>
              <p className={styles.subsectionTitle}>Personal Data, Personal Plan:</p>
              <p className={styles.text}>
                SupplementScribe collects your health info, lifestyle habits, blood test results, and even genetic insights.
              </p>
            </div>
            <div className={styles.subsection}>
              <p className={styles.subsectionTitle}>Customized Just for You:</p>
              <p className={styles.text}>
                We create a supplement plan that fits your unique body profile—so you only get what you truly need.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Feel Energized and Confident:</h4>
          <p className={styles.text}>
            Imagine a supplement regimen that boosts your energy, supports your well-being, and saves you from unnecessary spending.
          </p>
        </div>

        <div className={styles.ctaSection}>
          <p className={styles.ctaTitle}>Take Control of Your Health Today!</p>
          <p className={styles.text}>
            Discover your personalized supplement plan with SupplementScribe and finally get the tailored support your body deserves.
          </p>
        </div>
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

