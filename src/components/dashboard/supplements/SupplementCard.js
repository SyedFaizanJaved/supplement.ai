import React from "react"
import styles from "./SupplementCard.module.css"
import { Button } from "../../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const SupplementCard = ({ supplementName, supplementData }) => {
  const {
    Benefits,
    "Medical-Grade Supplements": {
      "Product Name & Brand": productBrand,
      "Dosage & Instructions": dosageInstructions,
      "Image URL": imageUrl,
      "Product URL": productUrl,
    },
  } = supplementData

  // Convert productUrl to an array if it's a string
  const productUrls = Array.isArray(productUrl) ? productUrl : [{ name: "View Product", url: productUrl }]

  return (
    <div className={styles.card}>
      <div className={styles.container}>
        <div className={styles.header}>
          <img src={imageUrl || "/placeholder.svg"} alt={supplementName} className={styles.image} />
          <div>
            <h3 className={styles.title}>{supplementName}</h3>
            <p className={styles.subtitle}>{productBrand}</p>
          </div>
        </div>

        <p className={styles.description}>{Benefits}</p>

        <div className={styles.details}>
          <h4 className={styles.detailsTitle}>Dosage & Instructions</h4>
          <p className={styles.dosage}>{dosageInstructions}</p>
        </div>

        <div className={styles.footer}>
          {productUrls.length === 1 ? (
            <Button asChild variant="outline" className={styles.viewButton}>
              <a href={productUrls[0].url} target="_blank" rel="noopener noreferrer">
                {productUrls[0].name}
              </a>
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className={styles.viewButton}>
                  View Product <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {productUrls.map((item, index) => (
                  <DropdownMenuItem key={index} asChild>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.name}
                    </a>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  )
}

export default SupplementCard

