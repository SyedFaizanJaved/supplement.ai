import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useToast } from "../components/ui/use-toast";
import { Progress } from "../components/ui/progress";
import { supabase } from "../components/integrations/supabase/client";
import styles from "./PaymentPage.module.css";

export default function PaymentPage() {
  const { search, state } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const email = new URLSearchParams(search).get("email");
  const [familyMemberCount, setFamilyMemberCount] = useState(0);

  const pricePerPerson = 20;
  const totalPersons = familyMemberCount > 0 ? familyMemberCount + 1 : 1;
  const baseTotal = pricePerPerson * totalPersons;

  // useEffect(() => {
  //   if (!email) {
  //     navigate('/input');
  //   }
  // }, [email, navigate]);

  useEffect(() => {
    if (state?.members) {
      setFamilyMemberCount(Math.max(0, parseInt(state.members || 0)));
    }
  }, [state]);

  useEffect(() => {
    let intervalId;
    if (loading) {
      setProgress(0);
      intervalId = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + 10;
        });
      }, 500);
    }
    return () => clearInterval(intervalId);
  }, [loading]);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            email,
            totalPersons,
            baseTotal,
          },
        }
      );

      if (error) throw error;
      if (data?.url) {
        setProgress(100);
        setTimeout(() => {
          window.location.href = data.url;
        }, 500);
      } else {
        throw new Error("No checkout URL received");
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Complete Your Subscription</h1>
          <p className={styles.subtitle}>
            {familyMemberCount > 0
              ? `Family Plan for ${totalPersons} members`
              : "Individual Health Assistant Subscription"}
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.planBox}>
            <div className={styles.planHeader}>
              <h3 className={styles.planTitle}>Health Assistant Pro</h3>
              <div className={styles.pricing}>
                <span className={styles.price}>${baseTotal}/month</span>
              </div>
            </div>
            <ul className={styles.featureList}>
              <li>✓ Personalized Health Recommendations</li>
              <li>✓ AI-Powered Health Assistant</li>
              <li>✓ Custom Supplement Plans</li>
              <li>✓ Progress Tracking</li>
              {familyMemberCount > 0 && (
                <li>✓ Family Plan for {totalPersons} members</li>
              )}
            </ul>
          </div>

          {loading && (
            <div className={styles.progressContainer}>
              <Progress value={progress} />
              <p className={styles.progressText}>
                Creating your checkout session...
              </p>
            </div>
          )}

          <Button
            className={styles.subscribeButton}
            onClick={handleSubscribe}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Subscribe Now"}
          </Button>
        </div>

        <p className={styles.terms}>
          By subscribing, you agree to our terms of service and privacy policy
        </p>
      </Card>
    </div>
  );
}
