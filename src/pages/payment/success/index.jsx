"use client";

import { useEffect, useState } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";

import styles from "./styles.module.css";
import { useNavigate, useParams } from "react-router";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);

  useEffect(() => {
    setPaymentDetails({
      amount: 99.99,
      currency: "USD",
      date: new Date().toLocaleDateString(),
      orderId: "ORD-12345-ABCDE",
    });
  }, []);

  return (
    <div className={styles.container}>
      <Card className={styles.card}>
        <CardHeader>
          <CardTitle className={styles.title}>
            <CheckCircle className={styles.icon} />
            Payment Successful
          </CardTitle>
        </CardHeader>
        {/* <CardContent>
          <p className={styles.message}>
            Thank you for your purchase! Your payment has been processed
            successfully.
          </p>
          <div className={styles.details}>
            <p>
              <strong>Amount:</strong> ${paymentDetails?.amount.toFixed(2)}{" "}
              {paymentDetails?.currency}
            </p>
            <p>
              <strong>Date:</strong> {paymentDetails?.date}
            </p>
            <p>
              <strong>Order ID:</strong> {paymentDetails?.orderId}
            </p>
          </div>
        </CardContent> */}
        <CardFooter className={styles.footer}>
          <Button
            className={styles.button}
            onClick={() => {
              navigate("/login");
            }}
          >
            <ArrowLeft className={styles.buttonIcon} />
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
