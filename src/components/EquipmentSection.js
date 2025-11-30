import React, { useState, useMemo } from "react";
import EquipmentCard from "./EquipmentCard";
import styles from "./EquipmentSection.module.css";

export default function EquipmentSection({ title, items, category }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) {
      return items;
    }
    
    const query = searchQuery.toLowerCase();
    return items.filter(item => {
      const titleMatch = item.title.toLowerCase().includes(query);
      return titleMatch;
    });
  }, [items, searchQuery]);

  return (
    <div className={styles.equipmentSection}>
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>{title}</h2>
        <div className={styles.searchContainer}>
          <svg 
            className={styles.searchIcon}
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M19 19L14.65 14.65" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <input
            type="text"
            className={styles.searchInput}
            placeholder={`Tìm kiếm trong ${title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className={styles.clearButton}
              onClick={() => setSearchQuery("")}
              aria-label="Xóa tìm kiếm"
            >
              <svg 
                width="16" 
                height="16" 
                viewBox="0 0 16 16" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M12 4L4 12M4 4L12 12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className={styles.noResults}>
          <p>Không tìm thấy dụng cụ nào phù hợp với từ khóa "{searchQuery}"</p>
        </div>
      ) : (
        <>
          <div className={styles.resultsCount}>
            Hiển thị {filteredItems.length} / {items.length} dụng cụ
          </div>
          <div className={styles.equipmentGrid}>
            {filteredItems.map((item, index) => (
              <EquipmentCard
                key={index}
                index={index + 1}
                title={item.title}
                description={item.description}
                images={item.images}
                id={`${category}-${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

