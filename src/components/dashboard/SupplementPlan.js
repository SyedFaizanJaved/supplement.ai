import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Share, Download, Mail } from "lucide-react";
import { useToast } from "../ui/use-toast";
import styles from "./SupplementPlan.module.css";
import jsPDF from "jspdf";
import SupplementsGrid from "./supplements/SupplementsGrid";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import API_URL from "../../config";
import { useAuth } from "../../context/AuthContext";  // Import useAuth

export const SupplementPlan = () => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();  // Get the user (and token) from AuthContext

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/v1/supplement-plan/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${user?.token}`, 
          },
        });
        const formattedData = formatSupplementData(response.data);
        setRecommendations(formattedData);
      } catch (error) {
        console.error("Error fetching supplements:", error);
        toast({
          title: "Error loading supplements",
          description: "Failed to fetch supplement recommendations",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSupplements();
  }, [toast, user]);

  const formatSupplementData = (data) => {
    const formatted = {}
    data.supplements.forEach((item) => {
      formatted[item.name] = {
        Benefits: item.benefits,
        "Medical-Grade Supplements": {
          "Product Name & Brand": `${item.product_name_brand}`,
          "Dosage & Instructions": item.dosage_instructions,
          "Image URL": item.product_img_url,
          "Product URL": item.product_urls.map((url) => ({
            name: url.name,
            url: url.url,
          })),
        },
      };
    });
    return formatted;
  };

  const generatePDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(15);
    pdf.text("Personalized Supplement Plan", 15, 20);
    pdf.setFontSize(12);

    let yOffset = 40;
    Object.entries(recommendations).forEach(([name, data], index) => {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 15;
      }
      pdf.setFontSize(12);
      pdf.text(name, 15, yOffset);
      yOffset += 10;
      pdf.setFontSize(9);
      pdf.text(`Benefits: ${data.Benefits}`, 15, yOffset);
      yOffset += 10;
      pdf.text(
        `Dosage: ${data["Medical-Grade Supplements"]["Dosage & Instructions"]}`,
        15,
        yOffset
      );
      yOffset += 20;
    });

    return pdf;
  };

  const handleShare = async () => {
    try {
      const pdf = generatePDF();
      const pdfBlob = pdf.output("blob");
      const file = new File([pdfBlob], "supplement_plan.pdf", {
        type: "application/pdf",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Supplement Plan",
          text: "Check out my personalized supplement plan!",
        });
      } else {
        throw new Error("Web Share API not supported");
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Sharing not supported",
        description:
          "Your browser doesn't support direct file sharing. Please use the download or email options.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const pdf = generatePDF();
    pdf.save("supplement_plan.pdf");
    toast({
      title: "PDF Downloaded",
      description: "Your supplement plan has been downloaded as a PDF.",
    });
  };

  const handleEmail = () => {
    const pdf = generatePDF();
    const pdfDataUri = pdf.output("datauristring");
    const emailBody = encodeURIComponent(
      "Please find attached my personalized supplement plan."
    );
    const mailtoLink = `mailto:?subject=My%20Supplement%20Plan&body=${emailBody}&attachment=${pdfDataUri}`;
    window.location.href = mailtoLink;
    toast({
      title: "Email Client Opened",
      description:
        "An email draft with your supplement plan has been created.",
    });
  };

  if (loading) {
    return <div className={styles.loading}>Loading supplements...</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.backgroundOverlay}>
          <div className={`${styles.backgroundGradient} ${styles.animationOne}`}></div>
          <div className={`${styles.backgroundGradient} ${styles.animationTwo}`}></div>
          <div className={`${styles.backgroundGradient} ${styles.animationThree}`}></div>
        </div>
      </div>

      <Card className={styles.card}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Personalized Supplement Plan</h2>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={styles.shareButton}>
                  <div className={styles.shareButtonBackground}></div>
                  <Share className={styles.shareIcon} />
                  <span className={styles.shareText}>Share Plan</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download PDF</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <SupplementsGrid supplements={recommendations} />
        </div>
      </Card>
    </div>
  );
};

export default SupplementPlan;