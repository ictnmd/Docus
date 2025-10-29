import React, { useState } from "react";
import "./QuestBox.css"; // style riêng nếu cần

export default function QuestBox({ question, options }) {
  const [selected, setSelected] = useState(null);

  const handleClick = (index, isCorrect) => {
    if (selected !== null) return; // chỉ chọn 1 lần
    setSelected(index);
  };

  return (
    <div className="quest-box">
      <div className="quest-question">
        <strong>{question}</strong>
      </div>
      <ul className="options">
        {options.map((opt, index) => {
          const isChosen = selected === index;
          const isCorrect = opt.correct;
          let className = "";

          if (selected !== null) {
            if (isChosen && isCorrect) className = "correct";
            else if (isChosen && !isCorrect) className = "wrong";
            else if (!isChosen && isCorrect) className = "correct";
          }

          return (
            <li
              key={index}
              className={className}
              onClick={() => handleClick(index, opt.correct)}
            >
              {opt.text}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
