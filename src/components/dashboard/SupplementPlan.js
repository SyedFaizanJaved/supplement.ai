import React, { useEffect, useState } from "react"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import { Share, Download, Mail } from "lucide-react"
import { supabase } from "../integrations/supabase/client"
import SupplementsGrid from "./supplements/SupplementsGrid"
import { useToast } from "../ui/use-toast"
import styles from "./SupplementPlan.module.css"
import supplementsData from "../../data/supplements.json"
import jsPDF from "jspdf"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"

export const SupplementPlan = () => {
  const [recommendations, setRecommendations] = useState({})
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        const { data: userData } = await supabase.auth.getUser()
        const user = userData?.user

        if (!user) {
          setRecommendations(supplementsData)
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from("supplement_recommendations")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (error) {
          console.error("Error fetching supplements:", error)
          setRecommendations(supplementsData) // Fallback
        } else {
          const formattedData = formatSupplementData(data)
          setRecommendations(formattedData)
        }
      } catch (error) {
        console.error("Error:", error)
        setRecommendations(supplementsData)
      } finally {
        setLoading(false)
      }
    }

    fetchSupplements()

    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "supplement_recommendations",
        },
        fetchSupplements,
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const formatSupplementData = (data) => {
    const formatted = {}
    data.forEach((item) => {
      formatted[item.supplement_name] = {
        Benefits: item.reason,
        "Medical-Grade Supplements": {
          "Product Name & Brand": `${item.supplement_name} by ${item.company_name}`,
          "Dosage & Instructions": item.dosage,
          "Image URL": item.image_url,
          "Product URL": item.product_url,
        },
      }
    })
    return formatted
  }

  const generatePDF = () => {
    const pdf = new jsPDF()
    pdf.setFontSize(15)
    pdf.text("Personalized Supplement Plan", 15, 20)
    pdf.setFontSize(12)

    let yOffset = 40
    Object.entries(recommendations).forEach(([name, data], index) => {
      if (yOffset > 250) {
        pdf.addPage()
        yOffset = 15
      }
      pdf.setFontSize(12)
      pdf.text(name, 15, yOffset)
      yOffset += 10
      pdf.setFontSize(9)
      pdf.text(`Benefits: ${data.Benefits}`, 15, yOffset)
      yOffset += 10
      pdf.text(`Dosage: ${data["Medical-Grade Supplements"]["Dosage & Instructions"]}`, 15, yOffset)
      yOffset += 20
    })

    return pdf
  }

  const handleShare = async () => {
    try {
      const pdf = generatePDF()
      const pdfBlob = pdf.output("blob")
      const file = new File([pdfBlob], "supplement_plan.pdf", { type: "application/pdf" })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My Supplement Plan",
          text: "Check out my personalized supplement plan!",
        })
      } else {
        throw new Error("Web Share API not supported")
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Sharing not supported",
        description: "Your browser doesn't support direct file sharing. Please use the download or email options.",
        variant: "destructive",
      })
    }
  }

  const handleDownload = () => {
    const pdf = generatePDF()
    pdf.save("supplement_plan.pdf")
    toast({
      title: "PDF Downloaded",
      description: "Your supplement plan has been downloaded as a PDF.",
    })
  }

  const handleEmail = () => {
    const pdf = generatePDF()
    const pdfDataUri = pdf.output("datauristring")
    const emailBody = encodeURIComponent("Please find attached my personalized supplement plan.")
    const mailtoLink = `mailto:?subject=My%20Supplement%20Plan&body=${emailBody}&attachment=${pdfDataUri}`
    window.location.href = mailtoLink
    toast({
      title: "Email Client Opened",
      description: "An email draft with your supplement plan has been created.",
    })
  }

  if (loading) {
    return <div className={styles.loading}>Loading supplements...</div>
  }

  return (
    <Card className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Personalized Supplement Plan</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={styles.shareButton}>
              <Share className={styles.shareIcon} />
              Share Plan
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
    </Card>
  )
}

export default SupplementPlan

