import CanvasBoard from "./components/CanvasBoard";
import ResultDisplay from "./components/ResultDisplay";
import { useState } from "react";

function App() {
  const [result, setResult] = useState(null);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Handwritten Number Detection</h2>
      <CanvasBoard setResult={setResult} />
      <ResultDisplay result={result} />
    </div>
  );
}

export default App;
