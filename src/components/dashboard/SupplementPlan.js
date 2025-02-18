import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Share, Download, Mail, Loader2, RotateCcw } from "lucide-react";
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
import { useAuth } from "../../context/AuthContext"; // Import useAuth

export const SupplementPlan = () => {
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const intervalId = useRef(null);
  const [error, setError] = useState(false);

  // Function to format the supplement data
  const formatSupplementData = (data) => {
    const formatted = {};
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

  // Function to fetch supplements
  const fetchSupplements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/supplement-plan/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.status === 200) {
        const formattedData = formatSupplementData(response.data);
        setRecommendations(formattedData);
        setLoading(false);

        if (intervalId.current) {
          clearInterval(intervalId.current);
          intervalId.current = null;
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // toast({
        //   title: "Generating Plans",
        //   description: "Please wait for a while until plans are generated",
        //   variant: "Info",
        // });
      } else {
        // Handle other errors if needed
        setLoading(false);
        setError(true);
        // toast({
        //   title: "Error",
        //   description: "An error occurred while fetching supplement plans",
        //   variant: "destructive",
        // });
      }
    }
  };
  useEffect(() => {
    fetchSupplements();

    intervalId.current = setInterval(fetchSupplements, 15000);

    return () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
      }
    };
  }, [toast, user]);

  const generatePDF = async () => {
    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Supplement Plan", 15, 20); // Main Title

    let yOffset = 40;
    Object.entries(recommendations).forEach(([name, data]) => {
      if (yOffset > 250) {
        pdf.addPage();
        yOffset = 20;
      }

      // Supplement Name
      pdf.setFontSize(14);
      pdf.text(name, 15, yOffset);
      yOffset += 10;

      pdf.setFontSize(10);
      pdf.text(data.Benefits || "Not specified", 15, yOffset, {
        maxWidth: 180,
      });
      yOffset += 30;
    });

    // Add logo at the bottom center
    const logoUrl = "/logo.png"; // Ensure this file is inside the public folder
    try {
      const imgBase64 = await fetchImageAsBase64(logoUrl);
      if (imgBase64) {
        const imgWidth = 100; // Adjust width
        const imgHeight = 35; // Adjust height
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgX = (pageWidth - imgWidth) / 2;
        const imgY = pageHeight - imgHeight - 10;

        pdf.addImage(imgBase64, "PNG", imgX, imgY, imgWidth, imgHeight);
      }
    } catch (error) {
      console.error("Error loading logo:", error);
    }

    return pdf;
  };

  // Function to fetch the image and convert it to base64
  const fetchImageAsBase64 = (imageUrl) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous"; // Allows access from the public folder
      img.src = imageUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png")); // Convert to base64
      };
      img.onerror = (error) => reject(error);
    });
  };

  const handleDownload = async () => {
    const pdf = await generatePDF();
    pdf.save("supplement_plan.pdf");
    toast({
      title: "PDF Downloaded",
      description: "Your supplement plan has been downloaded as a PDF.",
    });
  };

  const handleShare = async () => {
    try {
      const pdf = await generatePDF();
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

  const handleEmail = async () => {
    const pdf = await generatePDF();
    const pdfDataUri = pdf.output("datauristring");
    const emailBody = encodeURIComponent(
      "Please find attached my personalized supplement plan."
    );
    const mailtoLink = `mailto:?subject=My%20Supplement%20Plan&body=${emailBody}&attachment=${pdfDataUri}`;
    window.location.href = mailtoLink;
    toast({
      title: "Email Client Opened",
      description: "An email draft with your supplement plan has been created.",
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundAnimation}>
        <div className={styles.backgroundOverlay}>
          <div
            className={`${styles.backgroundGradient} ${styles.animationOne}`}
          ></div>
          <div
            className={`${styles.backgroundGradient} ${styles.animationTwo}`}
          ></div>
          <div
            className={`${styles.backgroundGradient} ${styles.animationThree}`}
          ></div>
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
                {/* <DropdownMenuItem onClick={handleShare}>
                  <Share className="mr-2 h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem> */}
                <DropdownMenuItem onClick={handleDownload}>
                  <Download className="mr-2 h-4 w-4" />
                  <span>Download PDF</span>
                </DropdownMenuItem>
                {/* <DropdownMenuItem onClick={handleEmail}>
                  <Mail className="mr-2 h-4 w-4" />
                  <span>Email</span>
                </DropdownMenuItem> */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="container">
            {loading && (
              <div className="container">
                <Loader2 className="animate-spin loader " />
                <p className="info-text">
                  Hang tight! We're putting together your personalized
                  supplement plan. This won’t take long.
                </p>
              </div>
            )}
            {error && (
              <div className="container">
                <button
                  className="ghost-btn"
                  onClick={() => fetchSupplements()}
                >
                  <RotateCcw className="info-text" />
                </button>

                <p className="info-text">
                  Unable to load your personalized supplement plan
                </p>
              </div>
            )}
          </div>

          <SupplementsGrid supplements={recommendations} />
        </div>
      </Card>
    </div>
  );
};

export default SupplementPlan;
