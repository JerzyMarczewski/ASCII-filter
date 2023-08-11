import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store";

interface CameraViewerPropsType {
  imgSrc: string | undefined;
  width: number | undefined;
  height: number | undefined;
}

const CameraViewer = (props: CameraViewerPropsType) => {
  const filter = useSelector((state: RootState) => state.appStatus.filter);
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const squareSize = 25;

  const getAverageSquareValue = (
    context: CanvasRenderingContext2D,
    squareSize: number,
    x: number,
    y: number
  ) => {
    if (!props.width || !props.height)
      throw new Error("CameraViewer has undefined width and height props!");

    const newWidth =
      props.width - x < squareSize ? props.width - x : squareSize;
    const newHeight =
      props.height - y < squareSize ? props.height - y : squareSize;

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

  const applySepiaFilter = (
    context: CanvasRenderingContext2D,
    filteredContext: CanvasRenderingContext2D
  ) => {
    if (!props.width || !props.height)
      throw new Error("CameraViewer has undefined width and height props!");

    const imageData = context.getImageData(0, 0, props.width, props.height);
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
    if (!props.width || !props.height)
      throw new Error("CameraViewer has undefined width and height props!");

    for (let y = 0; y < props.height; y += squareSize) {
      for (let x = 0; x < props.width; x += squareSize) {
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
    if (!props.width || !props.height)
      throw new Error("CameraViewer has undefined width and height props!");

    filteredContext.fillStyle = "black";
    filteredContext.fillRect(0, 0, props.width, props.height);

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

    for (let y = 0; y < props.height; y += squareSize) {
      for (let x = 0; x < props.width; x += squareSize) {
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

  useEffect(() => {
    const tempCanvas = tempCanvasRef.current;
    const tempContext = tempCanvas?.getContext("2d", {
      willReadFrequently: true,
    });
    const imageCanvas = imageCanvasRef.current;
    const imageContext = imageCanvas?.getContext("2d", {
      willReadFrequently: true,
    });

    if (!tempCanvas || !tempContext || !imageCanvas || !imageContext) return;

    if (!props.imgSrc)
      throw new Error("CameraViewer has some undefined props!");

    const image = new Image();
    image.src = props.imgSrc;

    image.onload = () => {
      console.log("image loaded");
      if (!props.width || !props.height)
        throw new Error("CameraViewer has some undefined props!");
      tempContext.drawImage(image, 0, 0, props.width, props.height);
      if (filter === "normal")
        imageContext.drawImage(image, 0, 0, props.width, props.height);
      else if (filter === "sepia") applySepiaFilter(tempContext, imageContext);
      else if (filter === "pixelized")
        applyPixelizedFilter(tempContext, imageContext, squareSize);
      else if (filter === "ascii")
        applyASCIIFilter(tempContext, imageContext, squareSize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props, filter]);

  if (!props.imgSrc) return <h1>NO IMAGE SRC</h1>;
  return (
    <>
      <canvas
        ref={tempCanvasRef}
        width={props.width}
        height={props.height}
        style={{ display: "none" }}
      />
      <canvas ref={imageCanvasRef} width={props.width} height={props.height} />
    </>
  );
};

export default CameraViewer;
