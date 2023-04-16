import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(null);
  const [rotating, setRotating] = useState(null);

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
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0, img.width, img.height);

        const src = cv.imread(canvas);
        const dst = new cv.Mat();
        cv.cvtColor(src, src, cv.COLOR_RGBA2GRAY);
        const blur = new cv.Mat();
        cv.GaussianBlur(src, blur, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
        cv.Canny(blur, dst, 100, 200, 3, false);
        blur.delete();

        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE);

        const quads = [];

        for (let i = 0; i < contours.size(); i++) {
          const cnt = contours.get(i);
          const approx = new cv.Mat();
          const perimeter = cv.arcLength(cnt, true);
          cv.approxPolyDP(cnt, approx, 0.02 * perimeter, true);

          if (approx.rows === 4 && cv.contourArea(cnt) > 1000) {
            const quad = Array.from({ length: approx.rows }, (_, i) => ({
              x: approx.data32S[i * 2],
              y: approx.data32S[i * 2 + 1],
            }));
            quads.push(quad);
            drawSquare(canvas, quad, "rgba(169, 169, 169, 1)");
          }

          approx.delete();
        }

        const onCanvasClick = (e) => {
          const rect = canvas.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;

          for (const [index, quad] of quads.entries()) {
            const point = new cv.Point(x, y);
            const customQuadMat = new cv.Mat(quad.length, 1, cv.CV_32SC2);
            for (let i = 0; i < quad.length; i++) {
              customQuadMat.data32S[i * 2] = quad[i].x;
              customQuadMat.data32S[i * 2 + 1] = quad[i].y;
            }
            if (cv.pointPolygonTest(customQuadMat, point, false) > 0) {
              const currentColor = ctx.getImageData(x, y, 1, 1).data;
              const newColor = currentColor[1] === 169 ? "rgba(0, 255, 0, 1)" : "rgba(169, 169, 169, 1)";
              drawSquare(canvas, quad, newColor);
              break;
            }
            customQuadMat.delete();
          }
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

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => setImageSrc(e.target.result);
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

