import { useRef, useState } from "react";

const CanvasBoard = ({ setResult }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);

  const startDraw = () => setDrawing(true);
  const stopDraw = () => setDrawing(false);

  const draw = (e) => {
    if (!drawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";

    ctx.lineTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(
      e.nativeEvent.offsetX,
      e.nativeEvent.offsetY
    );
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    setResult(null);
  };

  const submitDrawing = async () => {
    const canvas = canvasRef.current;

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "digit.png");

      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.final_number);
    });
  };

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={300}
        height={150}
        style={{
          border: "2px solid black",
          background: "white",
          cursor: "crosshair",
        }}
        onMouseDown={startDraw}
        onMouseUp={stopDraw}
        onMouseMove={draw}
        onMouseLeave={stopDraw}
      />
      <br /><br />
      <button onClick={submitDrawing}>Detect Number</button>
      <button onClick={clearCanvas} style={{ marginLeft: "10px" }}>
        Clear
      </button>
    </div>
  );
};

export default CanvasBoard;
