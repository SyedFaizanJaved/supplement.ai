import React from "react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { ArrowLeft } from 'lucide-react';
import styles from "./FAQPage.module.css";

const FAQPage = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <Button
        className={styles.backButton}
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className={styles.backIcon} />
        Back
      </Button>

      <h1 className={styles.title}>Frequently Asked Questions</h1>
      <Accordion type="single" collapsible className={styles.accordion}>
        <AccordionItem value="what-platform-does">
          <AccordionTrigger>What exactly does your platform do?</AccordionTrigger>
          <AccordionContent>
            We provide personalized supplement recommendations based on your unique health data—lab tests, genetic information (optional), and health goals. Our AI analyzes these factors to suggest vitamins, minerals, and other supplements best suited for you.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="how-different">
          <AccordionTrigger>How is this different from a regular supplement site or quiz-based recommendations?</AccordionTrigger>
          <AccordionContent>
            Unlike generic quiz-based sites, we use real data from your lab tests and potentially genetic results to deliver evidence-based, dynamic recommendations that update over time as your health data changes.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-security">
          <AccordionTrigger>Is my health information secure?</AccordionTrigger>
          <AccordionContent>
            Yes. We adhere to industry-standard security protocols and comply with relevant regulations (e.g., HIPAA in the U.S.) to protect your personal data. All sensitive information is encrypted both at rest and in transit.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="data-collection">
          <AccordionTrigger>What kind of data do you collect?</AccordionTrigger>
          <AccordionContent>
            We collect lab results (e.g., vitamin levels, cholesterol readings), basic health metrics (e.g., weight, age), and optionally genetic data (from services like 23andMe), plus any self-reported lifestyle data (sleep, diet, etc.) you choose to provide. All data is NOT sold to any outside third party.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="ai-decision">
          <AccordionTrigger>How does the AI decide which supplements I need?</AccordionTrigger>
          <AccordionContent>
            Our AI uses advanced algorithms that weigh your lab values, health goals, and known nutrient interactions. It references the latest clinical research and nutritional guidelines to suggest optimal supplements for you.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="platform-cost">
          <AccordionTrigger>What is the cost of using the platform?</AccordionTrigger>
          <AccordionContent>
            Our platform costs $10/month, but we also offer a family plan at $7/month for each member signed up.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default FAQPage;

