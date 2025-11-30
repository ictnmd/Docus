import React, { useEffect, useRef, useState } from "react";
import Fuse from "fuse.js";
import { searchData } from "@site/src/data/searchData";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import useBaseUrl from "@docusaurus/useBaseUrl";
/* ========================
  Utilities: normalization + prettify + tokenize
   - normalizeChemicalText: convert subscripts/superscripts to ascii digits and signs
   - prettifyChemicalText: convert ascii digits/signs back to visually nice subscripts/superscripts for UI
   - ensureKeywordsArray: guarantees keywords field is an array
   - createSearchIndex: returns normalized index used by Fuse
   - highlight: returns array of React nodes highlighting matched ranges
   ======================== */

// maps for subscripts/superscripts
const SUB_MAP = {
  "₀": "0",
  "₁": "1",
  "₂": "2",
  "₃": "3",
  "₄": "4",
  "₅": "5",
  "₆": "6",
  "₇": "7",
  "₈": "8",
  "₉": "9",
};
const SUP_MAP = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
};

function normalizeChemicalText(text = "") {
  // convert special subscripts/superscripts and plus/minus signs to ascii
  let s = String(text);
  s = s.replace(/[₀₁₂₃₄₅₆₇₈₉]/g, (m) => SUB_MAP[m] || m);
  s = s.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹]/g, (m) => SUP_MAP[m] || m);
  s = s.replace(/[⁺₊]/g, "+");
  s = s.replace(/[⁻₋]/g, "-");
  return s.toLowerCase();
}

const SUB_PRETTY = {
  0: "₀",
  1: "₁",
  2: "₂",
  3: "₃",
  4: "₄",
  5: "₅",
  6: "₆",
  7: "₇",
  8: "₈",
  9: "₉",
};
const SUP_PRETTY = {
  0: "⁰",
  1: "¹",
  2: "²",
  3: "³",
  4: "⁴",
  5: "⁵",
  6: "⁶",
  7: "⁷",
  8: "⁸",
  9: "⁹",
  "+": "⁺",
  "-": "⁻",
};

function prettifyChemicalText(text = "") {
  // Try to convert ascii numbers following letters to subscript; convert patterns like 2+ to superscript + (if needed)
  // We'll do a conservative prettify: convert digits after letters to subscript, and convert ^2+ patterns if present.
  let s = String(text);

  // convert numeric sequences after letters to subscript: e.g., "CuSO4" -> "CuSO₄"
  s = s.replace(
    /([A-Za-z\)\]])([0-9]+)/g,
    (_, letter, numbers) =>
      letter +
      numbers
        .split("")
        .map((d) => SUB_PRETTY[d] || d)
        .join("")
  );

  // convert patterns like "2+" or "3-" to superscripts (e.g., "Cu2+" -> "Cu²⁺")
  s = s.replace(
    /([0-9]+)([+\-])/g,
    (_, nums, sign) =>
      nums
        .split("")
        .map((d) => SUP_PRETTY[d] || d)
        .join("") + SUP_PRETTY[sign]
  );

  // also convert trailing + or - after a letter like "Fe+" -> "Fe⁺"
  s = s.replace(
    /([A-Za-z\)\]])([+\-])/g,
    (_, letter, sign) => letter + SUP_PRETTY[sign]
  );

  return s;
}

function ensureKeywordsArray(item) {
  if (!item) return [];
  if (Array.isArray(item.keywords)) return item.keywords;
  if (typeof item.keywords === "string") {
    // split by comma or semicolon, trim, filter
    const parts = item.keywords
      .split(/[;,]/)
      .map((p) => p.trim())
      .filter(Boolean);
    return parts;
  }
  return [];
}

// build normalized index for Fuse
function createSearchIndex(data) {
  return data.map((item) => {
    const keywordsArr = ensureKeywordsArray(item);
    return {
      id: item.id,
      title: item.title || "",
      url: item.url || "#",
      // normalized searchable fields
      normTitle: normalizeChemicalText(item.title || ""),
      normKeywords: keywordsArr.map((k) => normalizeChemicalText(k)),
      // keep original for UI
      rawTitle: item.title || "",
      rawKeywords: keywordsArr,
      description: item.description || "",
    };
  });
}

// highlight helper: we show prettified text but highlight based on normalized query
function highlightPrettified(rawText, normalizedQuery) {
  // We will normalize rawText and find positions of normalizedQuery within it
  const normalized = normalizeChemicalText(rawText);
  if (!normalizedQuery) return prettifyChemicalText(rawText);

  // simple approach: find all match indices of query in normalized string
  const q = normalizedQuery.toLowerCase();
  if (!q) return prettifyChemicalText(rawText);

  const parts = [];
  let i = 0;
  let lastIndex = 0;
  while (true) {
    const idx = normalized.indexOf(q, lastIndex);
    if (idx === -1) break;
    // slice of original rawText corresponding to normalized slice is not 1:1 due to unicode,
    // so we'll fallback to a best-effort: map normalized char positions to rawText by iterating.
    // Build map from normalized index -> raw index.
    break;
  }

  // Fallback simpler: do case-insensitive search on a "ascii-fied" version for highlighting,
  // then apply prettify on non-matching parts.
  const ascii = normalized;
  const pretty = prettifyChemicalText(rawText);

  // Build mapping from ascii characters to pretty characters with same length? Not safe; instead highlight by plain text on pretty with regex using escaped normalizedQuery but operating on a normalized-to-pretty string:
  // We'll replace sequences of digits in pretty with digits (for matching) to create a "searchablePretty" that aligns with normalized.
  // For simplicity and robust UX, highlight by matching normalizedQuery in normalized and then highlight best-effort on pretty using substring search of normalizedQuery's ascii digits/letters.

  // Create a simplified "searchablePretty" by mapping pretty back to ascii using normalizeChemicalText
  const searchablePretty = normalizeChemicalText(pretty);

  // find all matches in searchablePretty
  const segments = [];
  let pos = 0;
  let last = 0;
  while (true) {
    const found = searchablePretty.indexOf(q, last);
    if (found === -1) break;
    if (found > last) {
      segments.push({
        text: pretty.slice(pos, pos + (found - last)),
        highlight: false,
      });
      pos += found - last;
    }
    // highlight length = q.length characters in pretty — approximate by taking same length slice
    segments.push({ text: pretty.slice(pos, pos + q.length), highlight: true });
    pos += q.length;
    last = found + q.length;
  }
  // push remaining
  if (pos < pretty.length)
    segments.push({ text: pretty.slice(pos), highlight: false });

  // If no segments found, just return pretty as single element
  if (segments.length === 0) return pretty;

  // Return React nodes
  return segments.map((seg, idx) =>
    seg.highlight ? (
      <mark key={idx} className={styles.highlight}>
        {seg.text}
      </mark>
    ) : (
      <span key={idx}>{seg.text}</span>
    )
  );
}

/* ========================
   Create Fuse index
   ======================== */
const INDEX = createSearchIndex(searchData);

const fuse = new Fuse(INDEX, {
  keys: [
    { name: "normTitle", weight: 0.8 },
    { name: "normKeywords", weight: 0.6 },
    // we could index description if present
  ],
  includeScore: true,
  threshold: 0.35,
  ignoreLocation: true,
  useExtendedSearch: false,
});

/* ========================
   ModalSearch component
   Features:
   - overlay modal
   - input with autofocus
   - keyboard navigation (up/down/enter/esc)
   - fuzzy search via Fuse
   - highlight & prettify in UI
   - close on click outside
   ======================== */

export default function ModalSearch({ onClose }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);
  const modalRef = useRef(null);
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((prev) => (prev < results.length - 1 ? prev + 1 : prev));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((prev) => (prev > 0 ? prev - 1 : prev));
      } else if (e.key === "Enter" && results.length > 0) {
        e.preventDefault();
        const activeResult = results[active];
        if (activeResult) {
          window.location.href = activeResult.url;
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [results, active, onClose]);

  useEffect(() => {
    // focus input on mount
    inputRef.current?.focus();
    // click outside to close
    function onClick(e) {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [onClose]);

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [active]);

  const doSearch = (raw) => {
    const normalized = normalizeChemicalText(raw);
    if (!normalized || normalized.length <= 1) {
      setResults([]);
      setActive(0);
      return;
    }
    const fuseRes = fuse.search(normalized, { limit: 20 });
    // Map and rank: prefer exact normalizedTitle matches, then score
    const mapped = fuseRes
      .map((r) => ({
        id: r.item.id,
        title: r.item.rawTitle,
        url: r.item.url,
        score: r.score,
        raw: r.item,
      }))
      .sort((a, b) => {
        // boost exact normalized match
        const aExact = normalizeChemicalText(a.title).includes(normalized)
          ? 0
          : 1;
        const bExact = normalizeChemicalText(b.title).includes(normalized)
          ? 0
          : 1;
        if (aExact !== bExact) return aExact - bExact;
        return (a.score || 1) - (b.score || 1);
      });
    setResults(mapped);
    setActive(0);
  };

  const onChange = (e) => {
    const v = e.target.value;
    setQuery(v);
    doSearch(v);
  };

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.modal} ref={modalRef}>
        <div className={styles.inputRow}>
          <input
            ref={inputRef}
            className={styles.searchInput}
            placeholder="Tìm thí nghiệm, hoá chất, dụng cụ..."
            value={query}
            onChange={onChange}
            aria-label="Search"
          />
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close search"
          >
            ✖
          </button>
        </div>

        <div className={styles.hintRow}>
          <small>Nhấn <kbd>Esc</kbd> để thoát • <kbd>↑</kbd><kbd>↓</kbd> để điều hướng • <kbd>Enter</kbd> để chọn</small>
        </div>
        <div className={styles.resultsWrap}>
          {results.length === 0 && query.length > 1 ? (
            <div className={styles.noResults}>
              <p>Không tìm thấy kết quả cho "{query}"</p>
              <p className={styles.noResultsHint}>
                Thử tìm kiếm với từ khóa khác hoặc kiểm tra chính tả
              </p>
            </div>
          ) : results.length === 0 && query.length <= 1 ? (
            <div className={styles.noResults}>
              <p>Nhập từ khóa để tìm kiếm...</p>
            </div>
          ) : (
            results.map((item, index) => (
              <li
                key={item.id}
                ref={index === active ? listRef : null}
                className={`${styles.resultCard} ${
                  index === active ? styles.active : ""
                }`}
              >
                <Link to={item.url}>
                  <h4 className={styles.cardTitle}>{item.title}</h4>
                  {item.description && (
                    <p className={styles.cardDesc}>{item.description}</p>
                  )}
                </Link>
              </li>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
