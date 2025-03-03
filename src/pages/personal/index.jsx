"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import styles from "./styles.module.css"


export default function AccountSettings() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [passwordSuccess, setPasswordSuccess] = useState(false)

  // Subscription state
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelSuccess, setCancelSuccess] = useState(false)

  // Handle password reset submission
  const onSubmitPasswordReset = async (data) => {
    setPasswordSuccess(false)

    try {
      // API call would go here
      // Example:
      // await resetPasswordAPI({
      //   currentPassword: data.currentPassword,
      //   newPassword: data.newPassword
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setPasswordSuccess(true)

      // Clear form
      reset()
    } catch (error) {
      // Handle API errors
      console.error("Failed to reset password:", error)
    }
  }

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setCancelLoading(true)

    try {
      // API call would go here
      // Example:
      // await cancelSubscriptionAPI();

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Show success message
      setCancelSuccess(true)
      setShowCancelConfirm(false)
    } catch (error) {
      // Handle API errors
      console.error("Failed to cancel subscription:", error)
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Your Account</h1>

      {/* Password Reset Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Change Password</h2>
        <form onSubmit={handleSubmit(onSubmitPasswordReset)} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword" className={styles.label}>
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              {...register("currentPassword", { required: "Current password is required" })}
              className={`${styles.input} ${errors.currentPassword ? styles.inputError : ""}`}
              disabled={isSubmitting}
            />
            {errors.currentPassword && <p className={styles.errorText}>{errors.currentPassword.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="newPassword" className={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
              className={`${styles.input} ${errors.newPassword ? styles.inputError : ""}`}
              disabled={isSubmitting}
            />
            {errors.newPassword && <p className={styles.errorText}>{errors.newPassword.message}</p>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register("confirmPassword", {
                required: "Please confirm your new password",
                validate: (value, formValues) => value === formValues.newPassword || "Passwords do not match",
              })}
              className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
              disabled={isSubmitting}
            />
            {errors.confirmPassword && <p className={styles.errorText}>{errors.confirmPassword.message}</p>}
          </div>

          <div className={styles.formActions}>
            <button type="submit" className={styles.primaryButton} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save New Password"}
            </button>
          </div>

          {passwordSuccess && <div className={styles.successMessage}>Password updated successfully!</div>}
        </form>
      </section>

      {/* Subscription Cancellation Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Subscription Management</h2>
        <div className={styles.subscriptionBox}>
          {!cancelSuccess ? (
            <>
              {!showCancelConfirm ? (
                <div className={styles.subscriptionContent}>
                  <p className={styles.subscriptionText}>
                    You currently have an active subscription. If you cancel, you'll continue to have access until the
                    end of your current billing period.
                  </p>
                  <button onClick={() => setShowCancelConfirm(true)} className={styles.dangerButton}>
                    Cancel Subscription
                  </button>
                </div>
              ) : (
                <div className={styles.confirmationBox}>
                  <h3 className={styles.confirmationTitle}>Are you sure?</h3>
                  <p className={styles.confirmationText}>
                    This will cancel your subscription at the end of the current billing period. You won't be charged
                    again, but you'll lose access to premium features.
                  </p>
                  <div className={styles.confirmationActions}>
                    <button
                      onClick={() => setShowCancelConfirm(false)}
                      className={styles.secondaryButton}
                      disabled={cancelLoading}
                    >
                      Keep Subscription
                    </button>
                    <button onClick={handleCancelSubscription} className={styles.dangerButton} disabled={cancelLoading}>
                      {cancelLoading ? "Processing..." : "Confirm Cancellation"}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className={styles.successMessage}>
              Your subscription has been canceled. You'll have access until the end of your current billing period.
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

