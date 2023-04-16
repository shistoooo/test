import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [rotating, setRotating] = useState(null);
  const [selectedQuadIndex, setSelectedQuadIndex] = useState(null);

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
Partie 2 :

javascript
Copy code
  useEffect(() => {
    if (imageSrc && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = imageSrc;
      img.onload = async () => {
        // ... (Le code existant dans le callback img.onload, jusqu'à `approx.delete();`)

        const onCanvasClick = (e) => {
          // ... (Le code existant dans la fonction onCanvasClick, jusqu'à `customQuadMat.delete();`)
        };

        const onCanvasMouseMove = (e) => {
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
              // ...
            }
          }
        };

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
  }, [imageSrc]);
Partie 3 :

javascript
Copy code
  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImage



Shisto naito
continu

D'accord, voici la suite du code en respectant la règle des trois parties.

Partie 3 (suite) :

javascript
Copy code
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="App">
      <input type="file" onChange={handleImageChange} />
      <div>
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

export default App;