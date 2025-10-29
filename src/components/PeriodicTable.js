import React, { useState, useMemo, useEffect } from "react";
import elements from "./elements";
import "./PeriodicTable.css";

const categoryColors = {
  "kim loại kiềm": "#ffcccc",
  "kim loại kiềm thổ": "#ffe5b4",
  "kim loại chuyển tiếp": "#ffd700",
  "kim loại hậu chuyển tiếp": "#cccccc",
  "á kim": "#a3ffa3",
  "phi kim": "#cce5ff",
  halogen: "#fe9fadff",
  "khí hiếm": "#ffffcc",
  lantanide: "#e6ccff",
  actinide: "#ffccff",
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

  return (
    <div className="periodic-container">
      {/* Thanh công cụ */}
      <div className="toolbar">
        <input
          type="text"
          placeholder="Tìm kiếm số, ký hiệu, tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">--Tất cả nhóm--</option>
          {Object.keys(categoryColors).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Ẩn chi tiết ô" : "Hiện chi tiết ô"}
        </button>
        <button
          onClick={() => {
            setSearch("");
            setFilter("");
          }}
        >
          Reset
        </button>
      </div>
      {/* Legend */}
      <div className="legend">
        {Object.entries(categoryColors).map(([cat, color]) => (
          <span key={cat} className="legend-item">
            <span className="legend-color" style={{ background: color }}></span>
            {cat}
          </span>
        ))}
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

      {/* Khung chi tiết nguyên tố */}
      {selected && (
        <div className="detail-card">
          <h3>
            {selected.name} ({selected.symbol}) - {selected.viName}
          </h3>
          <p>
            <b>Số hiệu nguyên tử:</b> {selected.number}
          </p>
          <p>
            <b>Nguyên tử khối:</b> {selected.mass}
          </p>
          <p>
            <b>Chu kỳ:</b> {selected.period}
          </p>
          <p>
            <b>Trạng thái:</b> {selected.state}
          </p>
          <p>
            <b>Phân loại:</b> {selected.category}
          </p>
          <button onClick={() => setSelected(null)}>Đóng</button>
        </div>
      )}
    </div>
  );
}
