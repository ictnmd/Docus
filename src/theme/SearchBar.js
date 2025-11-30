import React, { useState, useEffect } from "react";
import ModalSearch from "./ModalSearch";
import styles from "./styles.module.css";

export default function SearchBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <button
        aria-label="Open search"
        className={styles.navButton}
        onClick={() => setOpen(true)}
        title="Tìm kiếm (Ctrl+K)"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.searchLabel}>Tìm kiếm</span>
      </button>

      {open && <ModalSearch onClose={() => setOpen(false)} />}
    </>
  );
}
