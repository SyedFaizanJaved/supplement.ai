import { useState } from "react";
import { ThumbsUp, ThumbsDown, DollarSign } from "lucide-react";
import { useToast } from "../../ui/use-toast";
import { supabase } from "../../integrations/supabase/client";
import styles from './SupplementCard.module.css';

export const SupplementCard = ({
  id,
  name,
  dosage,
  reason,
  cost,
  companyName,
  productUrl,
  imageUrl
}) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitFeedback = async (isHelpful, followedRecommendation) => {
    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { error } = await supabase.functions.invoke('track-ai-metrics', {
        body: {
          userId: user.id,
          recommendationId: id,
          isHelpful,
          followedRecommendation,
          budgetFit: true,
          feedback: `User ${isHelpful ? 'found' : 'did not find'} the recommendation helpful`,
        }
      });

      if (error) throw error;

      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve our recommendations.",
      });

    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error submitting feedback",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.dosage}>{dosage}</p>
        </div>
        {imageUrl && (
          <img 
            src={imageUrl} 
            alt={name} 
            className={styles.image}
          />
        )}
      </div>

      <p className={styles.reason}>{reason}</p>

      <div className={styles.costContainer}>
        <DollarSign className={styles.dollarIcon} />
        <span>${cost}/month</span>
      </div>

      <div className={styles.footer}>
        {productUrl && (
          <button 
            className={styles.viewProductButton}
            onClick={() => window.open(productUrl, '_blank')}
          >
            View Product
          </button>
        )}

        <div className={styles.feedbackButtons}>
          <button
            className={`${styles.feedbackButton} ${isSubmitting ? styles.disabled : ''}`}
            onClick={() => submitFeedback(true, true)}
            disabled={isSubmitting}
          >
            <ThumbsUp className={styles.icon} />
            Helpful
          </button>
          <button
            className={`${styles.feedbackButton} ${isSubmitting ? styles.disabled : ''}`}
            onClick={() => submitFeedback(false, false)}
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