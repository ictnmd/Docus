import React, { useState } from "react";
import "./FAQ.css"; // để style riêng

export default function FAQ({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      <div className="faq-question" onClick={() => setOpen(!open)}>
        <span>{question}</span>
        <span>{open ? "−" : "+"}</span>
      </div>
      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
}
