import React, { useState } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Clock,
  AlertCircle,
  Calendar,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import styles from "./SupplementCard.module.css";

const SupplementCard = ({
  id,
  supplement_name,
  dosage,
  timing,
  recommended_time,
  recommended_date,
  reason,
  company_name,
  product_url,
  image_url,
  benefits,
  precautions,
  category,
  priority,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFeedback = async (isHelpful) => {
    setIsSubmitting(true);
    setIsSubmitting(false);
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "High":
        return styles.priorityHigh;
      case "Medium":
        return styles.priorityMedium;
      case "Low":
        return styles.priorityLow;
      default:
        return styles.priorityMedium;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.headerContent}>
          <div className={styles.titleContainer}>
            <h3 className={styles.title}>{supplement_name}</h3>
            <p className={styles.dosage}>{dosage}</p>
          </div>
        </div>
      </div>

      <div className={styles.cardContent}>
        <p className={styles.reason}>{reason}</p>

        <div className={styles.scheduleContainer}>
          <h4 className={styles.scheduleTitle}>Recommended Schedule</h4>
          <div className={styles.scheduleInfo}>
            <div className={styles.scheduleRow}>
              <Clock className={styles.icon} />
              <span className={styles.timeLabel}>Time:</span>
              <span className={styles.timeValue}>{recommended_time}</span>
            </div>
            <div className={styles.separator} />
            <div className={styles.scheduleRow}>
              <Calendar className={styles.icon} />
              <span className={styles.timeLabel}>Start:</span>
              <span className={styles.timeValue}>
                {formatDate(recommended_date)}
              </span>
            </div>
            <div className={styles.separator} />
            <div className={styles.scheduleRow}>
              <AlertCircle className={styles.icon} />
              <span className={styles.timeLabel}>Notes:</span>
              <span className={styles.timeValue}>{timing}</span>
            </div>
          </div>
        </div>

        <div className={styles.metaContainer}>
          <div className={styles.metaInfo}>
            <span className={getPriorityClass(priority)}>
              {priority} Priority
            </span>
            <span className={styles.category}>• {category}</span>
          </div>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className={styles.precautionsButton}>
                <AlertCircle className={styles.icon} />
                Precautions
              </TooltipTrigger>
              <TooltipContent>
                <ul className={styles.precautionsList}>
                  {precautions.map((precaution, index) => (
                    <li key={index} className={styles.precautionsItem}>
                      {precaution}
                    </li>
                  ))}
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className={styles.benefitsContainer}>
          <p className={styles.benefitsTitle}>Benefits:</p>
          <ul className={styles.benefitsList}>
            {benefits.map((benefit, index) => (
              <li key={index} className={styles.benefitItem}>
                <span className={styles.benefitDot} />
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.cardFooter}>
        {product_url && (
          <button
            className={styles.productButton}
            onClick={() => window.open(product_url, "_blank")}
          >
            View on {company_name}
          </button>
        )}

        <div className={styles.feedbackContainer}>
          <button
            className={styles.feedbackButton}
            onClick={() => handleFeedback(true)}
            disabled={isSubmitting}
          >
            <ThumbsUp className={styles.icon} />
            Helpful
          </button>
          <button
            className={styles.feedbackButton}
            onClick={() => handleFeedback(false)}
            disabled={isSubmitting}
          >
            <ThumbsDown className={styles.icon} />
            Not Helpful
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupplementCard;
