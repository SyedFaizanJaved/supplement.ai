import React, { useEffect, useState } from "react";
import { TriangleAlertIcon, ArrowRight } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import styles from "./styles.module.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { getProfile } from "../../../services/auth";

export default function PaymentRequired() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getProfile();
        if (profile) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.log("Error in catch",error);
        setError(error?.response?.data);
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleProceedPayment = (error) => {
    console.log("Error in catch",error);

    if (error?.checkout_session_url) {
      // Open the checkout URL in the same tab/window
      window.location.href = error.checkout_session_url;
    } else {
      console.error("No checkout session URL available.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.title}>
            <TriangleAlertIcon className={styles.icon} />
            Payment Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={styles.message}>
            {error?.error || "Your payment is required to access premium features. Please complete your payment."}
          </p>
        </CardContent>
        <CardFooter className={styles.footer}>
          <Button
            size="sm"
            className={styles.cancelButton}
            onClick={handleLogout}
          >
            Cancel
          </Button>
          <Button
            className={styles.button}
            onClick={handleProceedPayment}
          >
            <ArrowRight className={styles.buttonIcon} />
            Proceed to Payment
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}