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

  const squareSize = 20;

  const getAverageSquareValue = (
    context: CanvasRenderingContext2D,
    squareSize: number,
    x: number,
    y: number
  ) => {
    if (!props.width || !props.height)
      throw new Error("CameraViewer has undefined width and height props!");

    const imageSquareData = context.getImageData(x, y, squareSize, squareSize);

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
    console.log("total pixels", totalPixels);
    console.log([
      totalRed / totalPixels,
      totalGreen / totalPixels,
      totalBlue / totalPixels,
    ]);
    return [
      totalRed / totalPixels,
      totalGreen / totalPixels,
      totalBlue / totalPixels,
    ];
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
      else if (filter === "pixelized")
        applyPixelizedFilter(tempContext, imageContext, squareSize);
    };
  }, [props, filter]);

  if (!props.imgSrc) return <h1>NO IMAGE SRC</h1>;
  return (
    <>
      <canvas
        ref={tempCanvasRef}
        width={props.width}
        height={props.height}
        // style={{ display: "none" }}
      />
      <canvas ref={imageCanvasRef} width={props.width} height={props.height} />
    </>
  );
};

export default CameraViewer;
