import React, { useRef, useEffect, useState } from "react";

const CanvasBoard = ({ setResult }) => {
  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    
    // Make canvas responsive
    const containerWidth = Math.min(window.innerWidth - 64, 400); // Max width 400, padding 32x2
    canvas.width = containerWidth;
    canvas.height = 200;

    const ctx = canvas.getContext("2d");

    // Black Background
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // White Stroke (Digit)
    ctx.strokeStyle = "white";
    ctx.lineWidth = 18;
    ctx.lineCap = "round";

    contextRef.current = ctx;
  };

  useEffect(() => {
    initCanvas();

    window.addEventListener("resize", initCanvas);
    return () => window.removeEventListener("resize", initCanvas);
  }, []);

  const getPosition = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if (event.touches) {
      // Prevent scrolling when drawing on touch devices!
      event.preventDefault();
      return {
        x: event.touches[0].clientX - rect.left,
        y: event.touches[0].clientY - rect.top,
      };
    }

    return {
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    };
  };

  const startDrawing = (event) => {
    const { x, y } = getPosition(event);
    contextRef.current.beginPath();
    contextRef.current.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (event) => {
    if (!isDrawing) return;

    if(event.cancelable) {
       event.preventDefault(); // Stop mobile from scrolling if dragging inside the canvas
    }

    const { x, y } = getPosition(event);
    contextRef.current.lineTo(x, y);
    contextRef.current.stroke();
  };

  const stopDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    setResult(null);
  };

  const handlePredict = async () => {
    const canvas = canvasRef.current;

    try {
      const dataURL = canvas.toDataURL("image/png");

      const blob = await (await fetch(dataURL)).blob();

      const formData = new FormData();
      formData.append("file", blob, "canvas.png");

      const response = await fetch("http://localhost:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.final_number !== null) {
        setResult(data.final_number);
      } else {
        setResult("No digit detected");
      }

    } catch (error) {
      console.error("Error:", error);
      setResult("Server Error");
    }
  };

  return (
    <div className="canvas-container">
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          style={{
            cursor: "crosshair",
            display: "block",
            borderRadius: "12px", // Adding internal radius to match the wrapper
            touchAction: "none" // Ensures mobile gestures don't interfere
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
        />
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "16px" }}>
        <button className="action-btn" onClick={handlePredict}>
          <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
          Predict
        </button>

        <button className="action-btn secondary" onClick={clearCanvas}>
          <svg style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
          Clear
        </button>
      </div>
    </div>
  );
};

export default CanvasBoard;