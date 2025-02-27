"use client";

import { useState } from "react";
import { Menu, LogOut, Trash2 } from "lucide-react";
import styles from "./styles.module.css";

export default function HamburgerMenu({ onLogout, onClearHistory }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleLogout = () => {
    onLogout();
    setIsOpen(false);
  };

  const handleClearHistory = () => {
    onClearHistory();
    setIsOpen(false);
  };

  return (
    <div className={styles.hamburgerContainer}>
      <button
        className={styles.hamburgerButton}
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-label="Menu"
      >
        <Menu size={24} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <button className={styles.dropdownItem} onClick={handleLogout}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
          {/* <button className={styles.dropdownItem} onClick={handleClearHistory}>
            <Trash2 size={18} />
            <span>Clear Chat History</span>
          </button> */}
        </div>
      )}
    </div>
  );
}
