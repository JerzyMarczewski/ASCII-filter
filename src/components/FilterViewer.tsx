import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

type filterType = "ascii" | "pixelized";

const videoConstraints = {
  width: 360,
  height: 360,
  facingMode: "user",
};

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
  const sum = [0, 0, 0];
  for (const index of indexes) {
    const R = data[index];
    const G = data[index + 1];
    const B = data[index + 2];
    sum[0] += R;
    sum[1] += G;
    sum[2] += B;
  }
  return [sum[0] / size ** 2, sum[1] / size ** 2, sum[2] / size ** 2];
};

const putASCIIonSquare = (
  context: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  average: number[],
  R: number | undefined = undefined,
  G: number | undefined = undefined,
  B: number | undefined = undefined
) => {
  // function divides the 255 color by 3 creating 85 sectors that correspond to ASCII values
  const averageRGB = (average[0] + average[1] + average[2]) / 3;
  const value = (averageRGB - (averageRGB % 3)) / 3;
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
  if (!R || !G || !B) context.fillStyle = "white";
  else context.fillStyle = `rgb(${R}, ${G}, ${B})`;

  context.font = `${size}px Arial`;
  context.fillText(grayscaledASCII[value], x, y + size);
};

const colorSquareByAverage = (
  context: CanvasRenderingContext2D,
  size: number,
  x: number,
  y: number,
  average: number[]
) => {
  context.fillStyle = `rgb(${average[0]}, ${average[1]}, ${average[2]})`;
  context.fillRect(x, y, size, size);
};

function FilterViewer() {
  const webcamRef = useRef<Webcam | null>(null);
  const inputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [chosenFilter, setChosenFilter] = useState<filterType>("pixelized");

  useEffect(() => {
    const inputCanvas = inputCanvasRef.current;
    const inputContext = inputCanvas?.getContext("2d", {
      willReadFrequently: true,
    });
    const outputCanvas = outputCanvasRef.current;
    const outputContext = outputCanvas?.getContext("2d");

    if (!inputCanvas || !inputContext || !outputCanvas || !outputContext)
      return;

    if (!screenshot) return;

    const image = new Image();
    image.src = screenshot;

    image.onload = () => {
      const newWidth = 360;
      const newHeight = 360;

      inputCanvas.width = newWidth;
      inputCanvas.height = newHeight;
      outputCanvas.width = newWidth;
      outputCanvas.height = newHeight;

      inputContext.drawImage(image, 0, 0, newWidth, newHeight);
      outputContext.fillStyle = "black";
      outputContext.fillRect(0, 0, newWidth, newHeight);

      const imageData = inputContext.getImageData(0, 0, newWidth, newHeight);
      const data = imageData.data;

      const squareSize = 5;

      for (let y = 0; y < newHeight; y += squareSize) {
        for (let x = 0; x < newWidth; x += squareSize) {
          const indexes = getSquareIndexes(x, y, newWidth, squareSize);
          const average = getSquareAverage(data, indexes, squareSize);

          if (chosenFilter === "ascii") {
            putASCIIonSquare(outputContext, squareSize, x, y, average);
          } else if (chosenFilter === "pixelized") {
            colorSquareByAverage(outputContext, squareSize, x, y, average);
          }
        }
      }
    };
  }, [screenshot]);

  useEffect(() => {
    if (!webcamRef) return;

    const interval = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) setScreenshot(imageSrc);
    }, 10);

    () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Webcam
        audio={false}
        height={360}
        width={360}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <canvas ref={inputCanvasRef}></canvas>
      <canvas ref={outputCanvasRef}></canvas>
      <div className="filterOptions">
        <button className="filterOption">ASCII</button>
        <button className="filterOption">Pixelized</button>
      </div>
    </>
  );
}

export default FilterViewer;
