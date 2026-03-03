import React from "react";

const ResultDisplay = ({ result }) => {
  if (result === null) return null;

  return (
    <div className="result-card">
      <div style={{ fontSize: "1.2rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "2px" }}>
        Detected Number
      </div>
      <div className="result-value">
        {result}
      </div>
    </div>
  );
};

export default ResultDisplay;