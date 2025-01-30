import { Button } from "./button"
import styles from "./pagination.module.css"

export const Pagination = ({ currentPage, totalCount, pageSize, onPageChange }) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  if (totalPages <= 1) return null

  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <nav className={styles.pagination}>
      <ul className={styles.paginationList}>
        {pageNumbers.map((number) => (
          <li key={number} className={styles.paginationItem}>
            <Button
              onClick={() => onPageChange(number)}
              variant={currentPage === number ? "default" : "outline"}
              size="sm"
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  )
}

