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

      const imageData = context.getImageData(0, 0, newWidth, newHeight);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
        data[i] = average;
        data[i + 1] = average;
        data[i + 2] = average;
      }

      context.putImageData(imageData, 0, 0);
    };
  }, []);

  return <canvas ref={canvasRef}></canvas>;
}

export default App;
