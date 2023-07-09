import { useEffect, useRef, useState } from "react";
import "./App.css";
import image1 from "./assets/image1.jpeg";

function App() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const image = new Image();
    image.src = image1;

    image.onload = () => {
      const scaleFactor = 0.2;
      const newWidth = image.width * scaleFactor;
      const newHeight = image.height * scaleFactor;

      canvas.width = newWidth;
      canvas.height = newHeight;
      context.drawImage(image, 0, 0, newWidth, newHeight);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default App;
