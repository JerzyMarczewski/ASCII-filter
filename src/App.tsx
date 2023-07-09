import { useEffect, useRef } from "react";
import "./App.css";
import image1 from "./assets/image1.jpeg";

const getSquareIndexes = (
  x: number,
  y: number,
  rowLength: number,
  size: number
): number[] => {
  const indexes: number[] = [];
  for (let row = y; row < y + size; row++) {
    for (let col = x; col < x + size; col++) {
      const pixelIndex = (row * rowLength + col) * 4;
      indexes.push(pixelIndex);
    }
  }
  return indexes;
};

const getSquareAverage = (
  data: Uint8ClampedArray,
  indexes: number[],
  size: number
) => {
  let sum = 0;
  for (const index of indexes) {
    const R = data[index];
    const G = data[index + 1];
    const B = data[index + 2];
    sum += (R + G + B) / 3;
  }
  const average = sum / size ** 2;
  return average;
};

const putASCIIonSquare = (
  context: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  average: number
) => {
  // function divides the 255 color by 3 creating 85 sectors that correspond to ASCII values
  const value = (average - (average % 3)) / 3;
  const grayscaledASCII = [
    " ",
    ".",
    "-",
    "'",
    ":",
    "_",
    ",",
    "^",
    "=",
    ";",
    ">",
    "<",
    "+",
    "!",
    "r",
    "c",
    "*",
    "/",
    "z",
    "?",
    "s",
    "L",
    "T",
    "v",
    ")",
    "J",
    "7",
    "|",
    "F",
    "i",
    "{",
    "C",
    "}",
    "f",
    "I",
    "3",
    "1",
    "t",
    "l",
    "u",
    "[",
    "n",
    "e",
    "o",
    "Z",
    "5",
    "Y",
    "x",
    "j",
    "y",
    "a",
    "]",
    "2",
    "E",
    "S",
    "w",
    "q",
    "k",
    "P",
    "6",
    "h",
    "9",
    "d",
    "4",
    "V",
    "p",
    "O",
    "G",
    "b",
    "U",
    "A",
    "K",
    "X",
    "H",
    "m",
    "8",
    "R",
    "D",
    "#",
    "$",
    "B",
    "g",
    "0",
    "M",
    "N",
    "W",
    "Q",
    "%",
    "&",
    "@",
  ];
  context.font = `${size}px Arial`;
  context.fillStyle = "white";
  context.fillText(grayscaledASCII[value], x, y + size);
};

function App() {
  const inputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const inputCanvas = inputCanvasRef.current;
    const inputContext = inputCanvas?.getContext("2d");
    const outputCanvas = outputCanvasRef.current;
    const outputContext = outputCanvas?.getContext("2d");

    if (!inputCanvas || !inputContext || !outputCanvas || !outputContext)
      return;

    const image = new Image();
    image.src = image1;

    image.onload = () => {
      const newWidth = 500;
      const scaledHeight = (image.height * newWidth) / image.width;
      const newHeight = scaledHeight - (scaledHeight % 10);

      inputCanvas.width = newWidth;
      inputCanvas.height = newHeight;

      outputCanvas.width = newWidth;
      outputCanvas.height = newHeight;

      inputContext.drawImage(image, 0, 0, newWidth, newHeight);
      outputContext.fillStyle = "black";
      outputContext.fillRect(0, 0, newWidth, newHeight);

      const imageData = inputContext.getImageData(0, 0, newWidth, newHeight);
      const data = imageData.data;

      // for (let i = 0; i < data.length; i += 4) {
      //   const average = (data[i] + data[i + 1] + data[i + 2]) / 3;
      //   data[i] = average;
      //   data[i + 1] = average;
      //   data[i + 2] = average;
      // }

      const squareSize = 5;

      for (let y = 0; y < newHeight; y += squareSize) {
        for (let x = 0; x < newWidth; x += squareSize) {
          const indexes = getSquareIndexes(x, y, newWidth, squareSize);
          const average = getSquareAverage(data, indexes, squareSize);
          putASCIIonSquare(outputContext, squareSize, x, y, average);
        }
      }
    };
  }, []);

  return (
    <>
      <canvas ref={inputCanvasRef}></canvas>
      <canvas ref={outputCanvasRef}></canvas>
    </>
  );
}

export default App;
