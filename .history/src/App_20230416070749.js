import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [rotating, setRotating] = useState(null);
  const [selectedQuadIndex, setSelectedQuadIndex] = useState(null);
  const [quads, setQuads] = useState([]);

  const drawHandle = (ctx, x, y, color) => {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  };

  const drawSquare = (canvas, cnt, color, drawHandles = false) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cnt[0].x, cnt[0].y);
    for (let i = 1; i < cnt.length; i++) {
      ctx.lineTo(cnt[i].x, cnt[i].y);
    }
    ctx.closePath();
    ctx.fill();

    if (drawHandles) {
      for (const point of cnt) {
        drawHandle(ctx, point.x, point.y, "rgba(255, 0, 0, 1)");
      }
    }
  };

  const onCanvasMouseMove = (e) => {
    if (dragging && (resizing || rotating)) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (resizing) {
        const { index, handleIndex, quad } = resizing;
        quad[handleIndex].x = x;
        quad[handleIndex].y = y;
        drawSquare(canvasRef.current, quad, "rgba(169, 169, 169, 1)", true);
      } else if (rotating) {
        const { index, quad } = rotating;

        // ...

        canvasRef.current.addEventListener("click", onCanvasClick);
        canvasRef.current.addEventListener("mousemove", onCanvasMouseMove);
        canvasRef.current.addEventListener("mouseup", onCanvasMouseUp);

        return () => {
          canvasRef.current.removeEventListener("click", onCanvasClick);
          canvasRef.current.removeEventListener("mousemove", onCanvasMouseMove);
          canvasRef.current.removeEventListener("mouseup", onCanvasMouseUp);
        };
      }
    }
  };

  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        // ... (Le code existant dans le callback img.onload, jusqu'à `approx.delete();`)
      };
    }
  }, [imageSrc]);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const addQuad = (quad) => {
    setQuads((prevQuads) => [...prevQuads, quad]);
  };

  return (
    <div className="App">
      <input type="file" onChange={handleImageChange} />
      <div>
        <canvas ref={canvasRef}></canvas>
        {quads.map((quad, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: Math.min(quad[0].y, quad[1].y, quad[2].y, quad[3].y) - 20,
              left: Math.min(quad[0].x, quad[1].x, quad[2].x, quad[3].x),
              backgroundColor: selectedQuadIndex === index ? "rgba(0, 255, 0, 0.5)" : "transparent",
              border: "2px solid rgba(0, 255, 0, 1)",
              borderRadius: 3,
              padding: "2px 4px",
              cursor: "pointer",
            }}
            onClick={() => setSelectedQuadIndex(index)}
          >
            Quad {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

    