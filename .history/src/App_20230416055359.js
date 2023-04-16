/* global cv */
import React, { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);

  const drawSquare = (canvas, cnt, color) => {
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(cnt[0].x, cnt[0].y);
    for (let i = 1; i < cnt.length; i++) {
      ctx.lineTo(cnt[i].x, cnt[i].y);
    }
    ctx.closePath();
    ctx.fill();
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

        // La partie suivante est ajoutée pour permettre de modifier la taille et la forme des quadrilatères

        // Variables pour gérer le redimensionnement
        let isResizing = false;
        let currentHandle = null;

        const createResizeHandles = (quad) => {
          return quad.map((point, index) => ({
            x: point.x,
            y: point.y,
            width: 10,
            height: 10,
            index,
          }));
        };

        const drawResizeHandles = (handles) => {
          const ctx = canvas.getContext("2d");
          for (const handle of handles) {
            ctx.fillStyle = "red";
            ctx.fillRect(handle.x - handle.width / 2, handle.y - handle.height / 2, handle.width, handle.height);
          }
        };

        const hitTest = (x, y, handle) => {
          return (
            x >= handle.x - handle.width / 2 &&
            x <= handle.x + handle
            width / 2 &&
            y >= handle.y - handle.height / 2 &&
            y <= handle.y + handle.height / 2
            );
            };
            const getMousePosition = (e) => {
              const rect = canvas.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const y = e.clientY - rect.top;
              return { x, y };
            };
        
            const onMouseDown = (e) => {
              const { x, y } = getMousePosition(e);
              for (const quad of quads) {
                const handles = createResizeHandles(quad);
                for (const handle of handles) {
                  if (hitTest(x, y, handle)) {
                    isResizing = true;
                    currentHandle = { ...handle, quad };
                    break;
                  }
                }
                if (isResizing) {
                  break;
                }
              }
            };
        
            const onMouseMove = (e) => {
              if (isResizing && currentHandle) {
                const { x, y } = getMousePosition(e);
                currentHandle.quad[currentHandle.index] = { x, y };
                redrawCanvas(canvas, quads);
              }
            };
        
            const onMouseUp = () => {
              isResizing = false;
              currentHandle = null;
            };
        
            const redrawCanvas = (canvas, quads) => {
              const ctx = canvas.getContext("2d");
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0, img.width, img.height);
              for (const quad of quads) {
                drawSquare(canvas, quad, "rgba(169, 169, 169, 1)");
                const handles = createResizeHandles(quad);
                drawResizeHandles(handles);
              }
            };
        
            canvas.addEventListener("mousedown", onMouseDown);
            canvas.addEventListener("mousemove", onMouseMove);
            canvas.addEventListener("mouseup", onMouseUp);
        
            src.delete();
            dst.delete();
            contours.delete();
            hierarchy.delete();
        
            return () => {
              canvas.removeEventListener("mousedown", onMouseDown);
              canvas.removeEventListener("mousemove", onMouseMove);
              canvas.removeEventListener("mouseup", onMouseUp);
            };
          };
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
        
