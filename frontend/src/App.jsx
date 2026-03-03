import React, { useState } from "react";
import CanvasBoard from "./components/CanvasBoard";
import ResultDisplay from "./components/ResultDisplay";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div className="glass-panel">
      <h1 className="title-gradient">Digit Recognizer</h1>
      {/* <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
        Draw a number (0-9) inside the glowing boundaries below.
      </p> */}

      <CanvasBoard setResult={setResult} />

      <ResultDisplay result={result} />
    </div>
  );
}

export default App;