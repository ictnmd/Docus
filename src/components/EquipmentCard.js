import React, { useState, useEffect, useRef } from "react";
import styles from "./EquipmentCard.module.css";

export default function EquipmentCard({ title, description, images, index, id }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Use the provided ID or generate one based on category and index
  const cardId = id || `equipment-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  return (
    <div className={styles.equipmentCard} id={cardId} style={{ scrollMarginTop: '80px' }}>
      <div 
        className={styles.cardHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.cardTitle}>
          <span className={styles.cardNumber}>{index}</span>
          <span className={styles.cardName}>{title}</span>
        </div>
        <button 
          className={`${styles.expandButton} ${isExpanded ? styles.expanded : ''}`}
          aria-label={isExpanded ? "Thu gọn" : "Mở rộng"}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 20 20" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M5 7.5L10 12.5L15 7.5" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      
      {isExpanded && (
        <div className={styles.cardContent}>
          <div className={styles.cardDescription}>
            {description}
          </div>
          {images && images.length > 0 && (
            <div className={styles.cardImages}>
              {images.map((img, idx) => (
                <div key={idx} className={styles.imageWrapper}>
                  <img 
                    src={img.src} 
                    alt={img.alt || title}
                    className={styles.equipmentImage}
                    loading="lazy"
                  />
                  {img.alt && <span className={styles.imageLabel}>{img.alt}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

