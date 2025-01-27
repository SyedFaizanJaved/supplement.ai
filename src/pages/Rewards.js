import React from 'react';
import { Gift, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './Rewards.module.css';

const Rewards = () => {
  const navigate = useNavigate();

  const referralTiers = [
    { referrals: 5, reward: "1 Month Free" },
    { referrals: 10, reward: "3 Months Free" },
    { referrals: 15, reward: "1 Year Free" },
    { referrals: 20, reward: "Lifetime Free" },
    { referrals: 25, reward: "Lifetime Free + 20% Revenue Share" },
  ];

  return (
    <div className={styles.container}>
      <button 
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className={styles.backIcon} /> Back
      </button>

      <div className={styles.content}>
        <div className={styles.header}>
          <Gift className={styles.giftIcon} />
          <h1 className={styles.pageTitle}>Rewards Program</h1>
        </div>
        <p className={styles.subtitle}>
          We really want to get as many people healthy as possible and feel good, help us help you!
        </p>

        <div className={styles.rewardsSection}>
          <section className={styles.referralProgram}>
            <h2 className={styles.sectionTitle}>Referral Program</h2>
            <div className={styles.referralTiers}>
              {referralTiers.map((tier, index) => (
                <div key={index} className={styles.tierCard}>
                  <div className={styles.tierContent}>
                    <div>
                      <h3 className={styles.tierTitle}>{tier.referrals} Referrals</h3>
                      <p className={styles.tierReward}>{tier.reward}</p>
                    </div>
                    <div className={styles.tierBadge}>
                      <span>{tier.referrals}</span>
                    </div>
                  </div>
                  {tier.referrals === 25 && (
                    <p className={styles.revenueShareText}>
                      Earn 20% of the revenue from each member you refer
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Rewards;