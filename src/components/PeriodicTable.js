import React, { useState, useMemo, useEffect, useRef } from "react";
import elements from "./elements";
import "./PeriodicTable.css";

// Updated color palette using student-friendly colors
const categoryColors = {
  "kim loại kiềm": "#F6B1CE",      // Pink
  "kim loại kiềm thổ": "#CCE5CF",  // Light green
  "kim loại chuyển tiếp": "#1581BF", // Blue
  "kim loại hậu chuyển tiếp": "#3DB6B1", // Teal
  "á kim": "#CCE5CF",              // Light green
  "phi kim": "#3DB6B1",            // Teal
  halogen: "#F6B1CE",              // Pink
  "khí hiếm": "#1581BF",           // Blue
  lantanide: "#3DB6B1",            // Teal
  actinide: "#F6B1CE",             // Pink
};

export default function PeriodicTable() {
  const [selected, setSelected] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");

  // ESC thoát khung chi tiết
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Lọc theo search + filter
  const filteredElements = useMemo(() => {
    const q = search.trim().toLowerCase();
    return elements.filter((el) => {
      const matchSearch =
        !q ||
        el.name.toLowerCase().includes(q) ||
        el.viName.toLowerCase().includes(q) ||
        el.symbol.toLowerCase().includes(q) ||
        String(el.number) === q;
      const matchFilter = !filter || el.category === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const detailCardRef = useRef(null);

  // Close detail card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selected && detailCardRef.current && !detailCardRef.current.contains(event.target)) {
        // Don't close if clicking on an element cell
        if (!event.target.closest('.element-cell')) {
          setSelected(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [selected]);

  return (
    <div className="periodic-container">
      {/* Header Section */}
      <div className="periodic-header">
        <h2 className="periodic-title">Bảng Tuần Hoàn Các Nguyên Tố Hóa Học</h2>
        <p className="periodic-subtitle">Nhấp vào nguyên tố để xem chi tiết</p>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-group">
          <div className="input-wrapper">
            <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M19 19L13 13M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              className="toolbar-input"
              placeholder="Tìm kiếm: số, ký hiệu, tên nguyên tố..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="select-wrapper">
            <select 
              className="toolbar-select"
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="">Tất cả nhóm</option>
              {Object.keys(categoryColors).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="toolbar-actions">
          <button 
            className="toolbar-btn secondary"
            onClick={() => setShowDetails(!showDetails)}
            title={showDetails ? "Ẩn tên tiếng Việt" : "Hiện tên tiếng Việt"}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10.5 5.5L15.5 6.5L12 9.5L12.5 14.5L8 12L3.5 14.5L4 9.5L0.5 6.5L5.5 5.5L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="none"/>
            </svg>
            {showDetails ? "Ẩn tên" : "Hiện tên"}
          </button>
          <button
            className="toolbar-btn secondary"
            onClick={() => {
              setSearch("");
              setFilter("");
            }}
            title="Đặt lại bộ lọc"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Đặt lại
          </button>
        </div>
      </div>

      {/* Legend */}
      <div className="legend">
        <div className="legend-title">Chú giải:</div>
        <div className="legend-items">
          {Object.entries(categoryColors).map(([cat, color]) => (
            <div key={cat} className="legend-item">
              <span className="legend-color" style={{ background: color }}></span>
              <span className="legend-label">{cat}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Lưới bảng tuần hoàn */}
      <div className="periodic-grid">
        {elements.map((el) => {
          const isHidden = !filteredElements.includes(el);
          return (
            <div
              key={el.number}
              role="button"
              tabIndex={0}
              aria-label={`${el.name} (${el.symbol}), số hiệu ${el.number}`}
              onClick={() => setSelected(el)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(el);
              }}
              className="element-cell"
              style={{
                gridColumn: el.x,
                gridRow: el.y,
                background: categoryColors[el.category] || "#eee",
                opacity: isHidden ? 0.2 : 1,
              }}
            >
              <div className={`atomic-number ${showDetails ? "small" : ""}`}>
                {el.number}
              </div>
              <div className={`symbol ${showDetails ? "small" : ""}`}>
                {el.symbol}
              </div>
              {showDetails && (
                <div className="viName" title={el.viName}>
                  {el.viName}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Detail Card Modal */}
      {selected && (
        <>
          <div className="detail-overlay" onClick={() => setSelected(null)}></div>
          <div className="detail-card" ref={detailCardRef}>
            <div className="detail-header">
              <div className="detail-symbol" style={{ background: categoryColors[selected.category] || "#1581BF" }}>
                {selected.symbol}
              </div>
              <div className="detail-title">
                <h3>{selected.viName}</h3>
                <p className="detail-english">{selected.enName || selected.name || ''}</p>
              </div>
              <button 
                className="detail-close"
                onClick={() => setSelected(null)}
                aria-label="Đóng"
              >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            </div>
            <div className="detail-content">
              <div className="detail-row">
                <span className="detail-label">Số hiệu nguyên tử</span>
                <span className="detail-value">{selected.number}</span>
              </div>
              {selected.mass && (
                <div className="detail-row">
                  <span className="detail-label">Nguyên tử khối</span>
                  <span className="detail-value">{selected.mass}</span>
                </div>
              )}
              {selected.period && (
                <div className="detail-row">
                  <span className="detail-label">Chu kỳ</span>
                  <span className="detail-value">{selected.period}</span>
                </div>
              )}
              {selected.state && (
                <div className="detail-row">
                  <span className="detail-label">Trạng thái</span>
                  <span className="detail-value">{selected.state}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-label">Phân loại</span>
                <span 
                  className="detail-badge"
                  style={{ background: categoryColors[selected.category] || "#1581BF" }}
                >
                  {selected.category}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
