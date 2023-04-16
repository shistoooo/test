import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const [selectedQuad, setSelectedQuad] = useState(null);
  const [selectedCorner, setSelectedCorner] = useState(null);
  const [selectedQuadIndex, setSelectedQuadIndex] = useState(null);
  const canvasRef = useRef(null);

  const drawSquare = (canvas, cnt, color, isSelected) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = isSelected ? "rgba(0, 255, 0, 1)" : color;
    ctx.beginPath();
    ctx.moveTo(cnt[0].x, cnt[0].y);
    for (let i = 1; i < cnt.length; i++) {
      ctx.lineTo(cnt[i].x, cnt[i].y);
    }
    ctx.closePath();
    ctx.fill();
  };

  // ...

  useEffect(() => {
    // ...

    const redrawCanvas = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      for (const [index, quad] of quads.entries()) {
        drawSquare(canvas, quad, "rgba(169, 169, 169, 1)", index === selectedQuadIndex);
      }
    };

    const onCanvasClick = (e) => {
      // ...
      for (const [quadIndex, quad] of quads.entries()) {
        // ...
        if (
          x >= corner.x - cornerSize / 2 &&
          x <= corner.x + cornerSize / 2 &&
          y >= corner.y - cornerSize / 2 &&
          y <= corner.y + cornerSize / 2
        ) {
          setSelectedQuad(quadIndex);
          setSelectedCorner(cornerIndex);
          setSelectedQuadIndex(quadIndex);
          return;
        }
      }
    };

    const onCanvasMouseMove = (e) => {
      if (selectedQuad !== null && selectedCorner !== null) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const quad = quads[selectedQuad];
        const dx = x - quad[selectedCorner].x;
        const dy = y - quad[selectedCorner].y;

        const oppositeCornerIndex = (selectedCorner + 2) % 4;
        const side1 = {
          x: quad[oppositeCornerIndex].x - quad[(selectedCorner + 1) % 4].x,
          y: quad[oppositeCornerIndex].y - quad[(selectedCorner + 1) % 4].y,
        };
        const side2 = {
          x: quad[oppositeCornerIndex].x - quad[(selectedCorner + 3) % 4].x,
          y: quad[oppositeCornerIndex].y - quad[(selectedCorner + 3) % 4].y,
        };

        quad[selectedCorner] = { x, y };
        quad[(selectedCorner + 1) % 4] = {
          x: quad[oppositeCornerIndex].x - side1.x + dx,
          y: quad[oppositeCornerIndex].y - side1.y + dy,
        };
        quad[(selectedCorner + 3) % 4] = {
          x: quad[oppositeCornerIndex].x - side2.x + dx,
          y: quad[oppositeCornerIndex].y - side2.y + dy,
        };

        redrawCanvas();
      }
    };

    const onCanvasMouseUp = () => {
      setSelectedQuad(null);
      setSelectedCorner(null);
    };

    canvas.addEventListener("click", onCanvasClick);
    canvas.addEventListener("mousemove", onCanvasMouseMove);
    canvas.addEventListener("mouseup", onCanvasMouseUp);

    // ...

    return () => {
      canvas.removeEventListener("click", onCanvasClick);
      canvas.removeEventListener("mousemove", onCanvasMouseMove);
      canvas.removeEventListener("mouseup", onCanvasMouseUp);
    };
  }, [imageSrc]);

  const handleImageChange = async (e) => {
    // ...
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

