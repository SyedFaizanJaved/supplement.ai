// PurchaseTests.js
import React, { useState } from "react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "../components/hooks/use-toast";
import { Loader2, ArrowLeft, TestTube, ArrowRight, Dna, HelpCircle } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import styles from './PurchaseTestsPage.module.css';

const LAB_TESTS = [
  {
    name: "Complete Blood Panel",
    description: "Comprehensive blood work analysis including CBC, metabolic panel, lipids, and key biomarkers",
    price: 335,
    icon: <TestTube className={styles.icon} />,
    image: "/lovable-uploads/111.png",
    purchaseUrl: "https://www.questhealth.com/product/comprehensive-health-profile-standard-34603M.html"
  },
  {
    name: "Most Affordable DNA Test",
    description: "Download the Raw DNA file included, upload it to our site, find your nutrient deficiencies, receive results",
    price: 36,
    icon: <Dna className={styles.icon} />,
    image: "/lovable-uploads/33.png",
    purchaseUrl: "https://www.myheritage.com/order/3154917996/MhDna.LandingPageKitOnly.Offer?initialProductId=900&currency=USD&processor=adyen&thirdPartyPaymentProcessor=adyen"
  },
  {
    name: "Extensive DNA Test",
    description: "Direct testing of all key SNPs that effect your everyday function",
    price: 349,
    icon: <Dna className={styles.icon} />,
    image: "/lovable-uploads/22.png",
    purchaseUrl: "https://maxgenlabs.com/collections/genetic-testing-kits/products/the-works-panel"
  },
];

const PurchaseTestsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (test) => {
    setIsLoading(true);
    try {
      if (test.purchaseUrl) {
        window.open(test.purchaseUrl, '_blank');
      } else {
        toast({
          title: "Redirecting to test provider",
          description: `You'll be redirected to purchase ${test.name}.`,
        });
        
        setTimeout(() => {
          navigate('/payment');
        }, 1500);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <div className={styles.backButtonContainer}>
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className={styles.backButton}
          >
            <ArrowLeft className={styles.buttonIcon} />
            Back
          </Button>
        </div>

        <div className={styles.header}>
          <div className={styles.titleContainer}>
            <h1 className={styles.title}>Purchase Testing</h1>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className={styles.helpButton}>
                    <HelpCircle className={styles.helpIcon} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className={styles.tooltip}>
                  These tests are optional, but we recommend taking a DNA test as you only need it once in your lifetime and can lead to finding information that can lower your blood biomarkers anyways. You can find any other blood or genetic test as well, but these are some we suggest
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className={styles.subtitle}>
            Select from our recommended health tests, we recommend to prioritize the DNA test
          </p>
        </div>

        <div className={styles.grid}>
          {LAB_TESTS.map((test, index) => (
            <Card key={index} className={styles.card}>
              <div className={styles.cardContent}>
                {test.image ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <div className={styles.imageContainer}>
                        <img 
                          src={test.image} 
                          alt={test.name}
                          className={styles.image}
                        />
                      </div>
                    </DialogTrigger>
                    <DialogContent className={styles.dialogContent}>
                      <img 
                        src={test.image} 
                        alt={test.name}
                        className={styles.dialogImage}
                      />
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className={styles.iconContainer}>
                    {test.icon}
                  </div>
                )}
                <div className={styles.testInfo}>
                  <h4 className={styles.testName}>{test.name}</h4>
                  <p className={styles.testDescription}>{test.description}</p>
                  <p className={styles.testPrice}>${test.price.toFixed(2)}</p>
                  <Button
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handlePurchase(test)}
                    className={styles.purchaseButton}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className={`${styles.buttonIcon} ${styles.spin}`} />
                        Processing...
                      </>
                    ) : (
                      "Purchase"
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className={styles.continueButtonContainer}>
          <Button 
            onClick={() => navigate('/input')}
            className={styles.continueButton}
          >
            Continue to Monthly Budget
            <ArrowRight className={styles.buttonIcon} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTestsPage;