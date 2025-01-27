import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card } from "../components/ui/card";
import styles from './Content.module.css';

const ContentPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Button
          variant="ghost"
          size="sm"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <ChevronLeft className={styles.backIcon} />
          Back
        </Button>

        <div className={styles.section}>
          <div className={styles.header}>
            <h1 className={styles.title}>Educational Content</h1>
            <Button variant="outline" className={styles.backButtons}>View All Blog Posts</Button>
          </div>
          
          <Tabs defaultValue="blogs" className={styles.tabs}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="blogs" className={styles.tabTrigger}>Blog Posts</TabsTrigger>
              <TabsTrigger value="videos" className={styles.tabTrigger}>Videos</TabsTrigger>
            </TabsList>
            
            <TabsContent value="blogs" className={styles.tabContent}>
              <div className={styles.grid}>
                <Card className={styles.card}>
                  <h3 className={styles.cardTitle}>Understanding Vitamin D</h3>
                  <p className={styles.cardDescription}>Learn about the importance of Vitamin D and how it affects your health.</p>
                  <Button className={styles.cardButton} variant="outline">Read More</Button>
                </Card>
                <Card className={styles.card}>
                  <h3 className={styles.cardTitle}>Omega-3 Benefits</h3>
                  <p className={styles.cardDescription}>Discover the essential benefits of Omega-3 fatty acids for your health.</p>
                  <Button className={styles.cardButton} variant="outline">Read More</Button>
                </Card>
                <Card className={styles.card}>
                  <h3 className={styles.cardTitle}>Magnesium Guide</h3>
                  <p className={styles.cardDescription}>Everything you need to know about magnesium supplementation.</p>
                  <Button className={styles.cardButton} variant="outline">Read More</Button>
                </Card>
                <Card className={styles.card}>
                  <h3 className={styles.cardTitle}>Vitamin B Complex</h3>
                  <p className={styles.cardDescription}>Understanding the different B vitamins and their roles.</p>
                  <Button className={styles.cardButton} variant="outline">Read More</Button>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="videos" className={styles.tabContent}>
              <div className={styles.grid}>
                <Card className={styles.card}>
                  <div className={styles.videoPlaceholder}></div>
                  <h3 className={styles.cardTitle}>Supplement Guide</h3>
                  <p className={styles.cardDescription}>A comprehensive guide to choosing the right supplements.</p>
                </Card>
                <Card className={styles.card}>
                  <div className={styles.videoPlaceholder}></div>
                  <h3 className={styles.cardTitle}>Nutrition Basics</h3>
                  <p className={styles.cardDescription}>Understanding fundamental nutrition principles.</p>
                </Card>
                <Card className={styles.card}>
                  <div className={styles.videoPlaceholder}></div>
                  <h3 className={styles.cardTitle}>Workout Tips</h3>
                  <p className={styles.cardDescription}>Essential workout tips for better results.</p>
                </Card>
                <Card className={styles.card}>
                  <div className={styles.videoPlaceholder}></div>
                  <h3 className={styles.cardTitle}>Health Myths</h3>
                  <p className={styles.cardDescription}>Debunking common health and supplement myths.</p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ContentPage;