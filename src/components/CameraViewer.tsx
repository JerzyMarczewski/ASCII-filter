import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

const CameraViewer = () => {
  const filter = useSelector((state: RootState) => state.appStatus.filter);
  const webcamDimensions = useSelector(
    (state: RootState) => state.appStatus.webcamDimensions
  );

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [videoWidth, setVideoWidth] = useState<number | undefined>(undefined);
  const [videoHeight, setVideoHeight] = useState<number | undefined>(undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const inputCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const outputCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const squareSize = 25;
  const timeBetweenFrames = 100;
  const gamma = 2;

  const getAverageSquareValue = (
    context: CanvasRenderingContext2D,
    squareSize: number,
    x: number,
    y: number
  ) => {
    if (!videoWidth || !videoHeight)
      throw new Error("CameraViewer has undefined width and height!");

    const newWidth = videoWidth - x < squareSize ? videoWidth - x : squareSize;
    const newHeight =
      videoHeight - y < squareSize ? videoHeight - y : squareSize;

    const imageSquareData = context.getImageData(x, y, newWidth, newHeight);

    let totalRed = 0;
    let totalGreen = 0;
    let totalBlue = 0;

    for (let i = 0; i < imageSquareData.data.length; i += 4) {
      const red = imageSquareData.data[i];
      const green = imageSquareData.data[i + 1];
      const blue = imageSquareData.data[i + 2];

      totalRed += red;
      totalGreen += green;
      totalBlue += blue;
    }

    const totalPixels = imageSquareData.data.length / 4;

    return [
      totalRed / totalPixels,
      totalGreen / totalPixels,
      totalBlue / totalPixels,
    ];
  };

  const applyGammaCorrection = (context: CanvasRenderingContext2D) => {
    if (!videoWidth || !videoHeight)
      throw new Error("CameraViewer has undefined width and height!");

    if (!gamma) throw new Error("CameraViewer has undefined gamma!");

    const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const correctedR = Math.pow(r / 255, gamma) * 255;
      const correctedG = Math.pow(g / 255, gamma) * 255;
      const correctedB = Math.pow(b / 255, gamma) * 255;

      data[i] = correctedR;
      data[i + 1] = correctedG;
      data[i + 2] = correctedB;
    }

    context.putImageData(imageData, 0, 0);
  };

  const applyGrayscaleFilter = (
    context: CanvasRenderingContext2D,
    filteredContext: CanvasRenderingContext2D
  ) => {
    if (!videoWidth || !videoHeight)
      throw new Error("CameraViewer has undefined width and height!");

    const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const gray = 0.2989 * r + 0.587 * g + 0.114 * b;

      data[i] = gray;
      data[i + 1] = gray;
      data[i + 2] = gray;
    }

    filteredContext.putImageData(imageData, 0, 0);
  };

  const applySepiaFilter = (
    context: CanvasRenderingContext2D,
    filteredContext: CanvasRenderingContext2D
  ) => {
    if (!videoWidth || !videoHeight)
      throw new Error("CameraViewer has undefined width and height!");

    const imageData = context.getImageData(0, 0, videoWidth, videoHeight);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      const sepiaR = Math.min(0.393 * r + 0.769 * g + 0.189 * b, 255);
      const sepiaG = Math.min(0.349 * r + 0.686 * g + 0.168 * b, 255);
      const sepiaB = Math.min(0.272 * r + 0.534 * g + 0.131 * b, 255);

      data[i] = sepiaR;
      data[i + 1] = sepiaG;
      data[i + 2] = sepiaB;
    }

    filteredContext.putImageData(imageData, 0, 0);
  };

  const applyPixelizedFilter = (
    context: CanvasRenderingContext2D,
    filteredContext: CanvasRenderingContext2D,
    squareSize: number
  ) => {
    if (!videoWidth || !videoHeight)
      throw new Error("CameraViewer has undefined width and height!");

    for (let y = 0; y < videoHeight; y += squareSize) {
      for (let x = 0; x < videoWidth; x += squareSize) {
        const averageSquareValue = getAverageSquareValue(
          context,
          squareSize,
          x,
          y
        );
        filteredContext.fillStyle = `rgb(${averageSquareValue[0]}, ${averageSquareValue[1]}, ${averageSquareValue[2]})`;
        filteredContext.fillRect(x, y, squareSize, squareSize);
      }
    }
  };

  const applyASCIIFilter = (
    context: CanvasRenderingContext2D,
    filteredContext: CanvasRenderingContext2D,
    squareSize: number
  ) => {
    if (!videoWidth || !videoHeight)
      throw new Error("CameraViewer has undefined width and height props!");

    filteredContext.fillStyle = "black";
    filteredContext.fillRect(0, 0, videoWidth, videoHeight);

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

    for (let y = 0; y < videoHeight; y += squareSize) {
      for (let x = 0; x < videoWidth; x += squareSize) {
        const averageSquareValue = getAverageSquareValue(
          context,
          squareSize,
          x,
          y
        );
        const grayscaleValue =
          (averageSquareValue[0] +
            averageSquareValue[1] +
            averageSquareValue[2]) /
          3;
        const ASCIIGrayscaleValue = (grayscaleValue - (grayscaleValue % 3)) / 3;

        filteredContext.fillStyle = "white";
        filteredContext.font = `${squareSize}px Arial`;
        filteredContext.fillText(
          grayscaledASCII[ASCIIGrayscaleValue],
          x,
          y + squareSize
        );
      }
    }
  };

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          void videoRef.current!.play();
        };
      }
    } catch (error) {
      console.error("Error accessing webcam:", error);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    void startWebcam();
  }, []);

  useEffect(() => {
    if (!videoHeight || !videoWidth) return;

    const interval = setInterval(() => {
      const video = videoRef.current;
      if (!video) return;

      const inputCanvas = inputCanvasRef.current;
      const outputCanvas = outputCanvasRef.current;
      if (!inputCanvas || !outputCanvas) return;

      const inputContext = inputCanvas.getContext("2d");
      const outputContext = outputCanvas.getContext("2d");
      if (!inputContext || !outputContext) return;

      inputContext.drawImage(video, 0, 0, videoWidth, videoHeight);
      applyGammaCorrection(inputContext);

      if (filter === "normal") {
        outputContext.drawImage(inputCanvas, 0, 0, videoWidth, videoHeight);
      } else if (filter === "grayscale") {
        applyGrayscaleFilter(inputContext, outputContext);
      } else if (filter === "sepia") {
        applySepiaFilter(inputContext, outputContext);
      } else if (filter === "pixelized") {
        applyPixelizedFilter(inputContext, outputContext, squareSize);
      } else if (filter === "ascii") {
        applyASCIIFilter(inputContext, outputContext, squareSize);
      }
    }, timeBetweenFrames);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoWidth, videoHeight, filter]);

  useEffect(() => {
    if (!webcamDimensions) return;

    let newWidth = videoWidth ?? webcamDimensions.x;
    let newHeight = videoHeight ?? webcamDimensions.y;

    if (windowWidth < newWidth) {
      newWidth = newWidth / 2;
      newHeight = newHeight / 2;
    }

    if (windowWidth > 2 * newWidth && 2 * newWidth <= 720) {
      newWidth = newWidth * 2;
      newHeight = newHeight * 2;
    }

    setVideoWidth(newWidth);
    setVideoHeight(newHeight);
  }, [webcamDimensions, windowWidth, videoWidth, videoHeight]);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    if (!inputCanvasRef.current) return;
    const inputCanvas = inputCanvasRef.current;

    if (!outputCanvasRef.current) return;
    const outputCanvas = outputCanvasRef.current;

    if (!videoHeight || !videoWidth) return;
    inputCanvas.width = videoWidth;
    inputCanvas.height = videoHeight;
    outputCanvas.width = videoWidth;
    outputCanvas.height = videoHeight;
    video.style.width = `${videoWidth}px`;
    video.style.height = `${videoHeight}px`;
  }, [videoWidth, videoHeight]);

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{ display: "none" }}
      />
      <canvas ref={inputCanvasRef} />
      <canvas ref={outputCanvasRef} />
    </div>
  );
};

export default CameraViewer;
