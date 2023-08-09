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

  useEffect(() => {
    const imageCanvas = imageCanvasRef.current;
    const imageContext = imageCanvas?.getContext("2d");

    if (!imageCanvas || !imageContext) return;
    if (!props.imgSrc || !props.width || !props.height) return;

    const image = new Image();
    image.src = props.imgSrc;

    image.onload = () => {
      console.log("image loaded");
      if (filter === "normal")
        imageContext.drawImage(image, 0, 0, props.width, props.height);
      else imageContext.fillRect(0, 0, props.width, props.height);
    };
  }, [props]);

  if (!props.imgSrc) return <h1>NO IMAGE SRC</h1>;
  return (
    <canvas ref={imageCanvasRef} width={props.width} height={props.height} />
  );
};

export default CameraViewer;
