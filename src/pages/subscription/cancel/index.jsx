import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import styles from "./styles.module.css";
import { cancelSubscription } from "../../../services/subscription-cancel";

export default function CancelSubscription() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    setIsModalOpen(true);
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError("");
  };

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);
      setError("");

      await cancelSubscription();

      setIsCancelled(true);
      setTimeout(() => {
        setIsModalOpen(false);
      }, 3000);
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to cancel your subscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Subscription Management</h2>
          <p>Manage your current subscription plan and billing</p>
        </div>

        <div className={styles.subscriptionInfo}>
          <div>
            <h3>Current Plan</h3>
            <p className={styles.planName}>Premium Plan</p>
            <p className={styles.planPrice}>$19.99/month</p>
            <p className={styles.renewalDate}>Renews on April 3, 2025</p>
          </div>

          <button
            onClick={openModal}
            className={styles.cancelButton}
            disabled={isCancelled}
          >
            {isCancelled ? "Subscription Cancelled" : "Cancel Subscription"}
          </button>
        </div>

        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modal}>
              {!isCancelled ? (
                <>
                  <div className={styles.modalHeader}>
                    <AlertTriangle size={24} className={styles.warningIcon} />
                    <h3>Cancel Your Subscription?</h3>
                    <button onClick={closeModal} className={styles.closeButton}>
                      <X size={20} />
                    </button>
                  </div>

                  <div className={styles.modalContent}>
                    <p>Are you sure you want to cancel your subscription?</p>
                    {/* <ul className={styles.consequencesList}>
                      <li>You will lose access to premium features</li>
                      <li>
                        Your subscription will remain active until the end of your
                        current billing period
                      </li>
                      <li>You can resubscribe at any time</li>
                    </ul> */}
                    {error && (
                      <p className={styles.errorMessage}>{error}</p>
                    )}
                  </div>

                  <div className={styles.modalActions}>
                    <button
                      onClick={closeModal}
                      className={styles.keepButton}
                      disabled={isLoading}
                    >
                      Keep Subscription
                    </button>
                    <button
                      onClick={handleCancelSubscription}
                      className={styles.confirmCancelButton}
                      disabled={isLoading}
                    >
                      {isLoading ? "Processing..." : "Confirm Cancellation"}
                    </button>
                  </div>
                </>
              ) : (
                <div className={styles.successMessage}>
                  <div className={styles.successIcon}>
                    <Check size={32} />
                  </div>
                  <h3>Subscription Cancelled</h3>
                  <p>
                    Your subscription has been cancelled successfully. You will
                    have access to premium features until the end of your
                    current billing period.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
