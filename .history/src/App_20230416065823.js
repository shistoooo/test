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
  
  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        // ... (Le code existant dans le callback img.onload, jusqu'à `approx.delete();`)

        const onCanvasClick = (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          let quadIndex = null;
          let handleIndex = null;
          for (const [index, quad] of quads.entries()) {
            for (let i = 0; i < quad.length; i++) {
              const handle = quad[i];
              const distance = Math.sqrt(Math.pow(handle.x - x, 2) + Math.pow(handle.y - y, 2));
              if (distance <= 5) {
                quadIndex = index;
                handleIndex = i;
                break;
              }
            }
            if (quadIndex !== null) break;
          }

          if (quadIndex !== null && handleIndex !== null) {
            if (e.shiftKey) {
              // Delete selected quad
              setQuads((prevQuads) => prevQuads.filter((_, index) => index !== quadIndex));
              setSelectedQuadIndex(null);
            } else {
              // Select quad
              setSelectedQuadIndex(quadIndex);
            }
          } else if (e.shiftKey) {
            // Deselect quad
            setSelectedQuadIndex(null);
          }
        };

        function onCanvasMouseMove(e) {
          if (dragging && (resizing || rotating)) {
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (resizing) {
              const { index, handleIndex, quad } = resizing;
              quad[handleIndex].x = x;
              quad[handleIndex].y = y;
              drawSquare(canvas, quad, "rgba(169, 169, 169, 1)", true);
            } else if (rotating) {
              const { index, quad } = rotating;


              const onCanvasMouseUp = () => {
                setDragging(false);
                setResizing(null);
                setRotating(null);
              };

              canvas.addEventListener("click", onCanvasClick);
              canvas.addEventListener("mousemove", onCanvasMouseMove);
              canvas.addEventListener("mouseup", onCanvasMouseUp);

              return () => {
                canvas.removeEventListener("click", onCanvasClick);
                canvas.removeEventListener("mousemove", onCanvasMouseMove);
                canvas.removeEventListener("mouseup", onCanvasMouseUp);
              };
            };
          }
          import React, { useState, useRef } from "react";

          function App() {
            const [imageSrc, setImageSrc] = useState(null);
            const [quads, setQuads] = useState([]);
            const [selectedQuadIndex, setSelectedQuadIndex] = useState(null);
            const canvasRef = useRef(null);

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
        }
export default App;
