import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import styles from './Student.module.css';

export default function StudentsPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Button
        variant="ghost"
        onClick={() => navigate("/")}
        className={styles.backButton}
      >
        <ArrowLeft className={styles.backIcon} />
        Back to Home
      </Button>

      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>Students</h1>
          <p className={styles.subtitle}>
            Special offers and opportunities for students
          </p>
        </div>

        <Tabs defaultValue="discount" className={styles.tabs}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="discount">Student Discount</TabsTrigger>
            <TabsTrigger value="ambassador">Campus Ambassador</TabsTrigger>
          </TabsList>

          <TabsContent value="discount">
            <Card>
              <CardHeader>
                <CardTitle>Student Discount</CardTitle>
                <CardDescription>
                  Get access to SupplementScribe at a special student rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.priceSection}>
                  <h3 className={styles.price}>$15/month</h3>
                  <p className={styles.priceDescription}>
                    Available for all students with a valid .edu email address
                  </p>
                </div>
                <div className={styles.infoSection}>
                  <div className={styles.listContainer}>
                    <h4 className={styles.listTitle}>How it works:</h4>
                    <ul className={styles.benefitsList}>
                      <li>Sign up with your .edu email address</li>
                      <li>Get instant access to all premium features</li>
                      <li>Save $5 every month compared to regular pricing</li>
                      <li>No additional verification required</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => navigate("/input")}
                    className={styles.ctaButton}
                  >
                    Get Started with Student Discount
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ambassador">
            <Card>
              <CardHeader>
                <CardTitle>Campus Ambassador Program</CardTitle>
                <CardDescription>
                  Represent SupplementScribe at your university and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.ambassadorContent}>
                  <div className={styles.listContainer}>
                    <h4 className={styles.listTitle}>Program Benefits:</h4>
                    <ul className={styles.benefitsList}>
                      <li>Free premium subscription while you're an ambassador</li>
                      <li>Earn 15% commissions for every referral</li>
                      <li>Exclusive ambassador swag and merchandise</li>
                      <li>Add valuable experience to your resume</li>
                    </ul>
                  </div>
                  <div className={styles.listContainer}>
                    <h4 className={styles.listTitle}>Requirements:</h4>
                    <ul className={styles.benefitsList}>
                      <li>Currently enrolled student</li>
                      <li>Post at least 5 Stories or Posts a month</li>
                    </ul>
                  </div>
                  <Button
                    onClick={() => navigate("/work-with-us")}
                    className={styles.applyButton}
                  >
                    Apply to Become an Ambassador
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}