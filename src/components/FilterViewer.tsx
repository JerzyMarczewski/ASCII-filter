import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import {
  setNextFilter,
  setPreviousFilter,
  webcamDimensionsType,
} from "../features/appStatusSlice";
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import "../styles/FilterViewer.css";
import CameraViewer from "./CameraViewer";

interface videoConstraintsInterface {
  width: number | undefined;
  height: number | undefined;
  facingMode: "user";
}

const videoConstraints: videoConstraintsInterface = {
  width: undefined,
  height: undefined,
  facingMode: "user",
};

function FilterViewer() {
  const webcamDimensions = useSelector(
    (state: RootState) => state.appStatus.webcamDimensions
  );
  const filter = useSelector((state: RootState) => state.appStatus.filter);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [videoResolution, setVideoResolution] =
    useState<webcamDimensionsType | null>(null);
  const [screenshot, setScreenshot] = useState<string | undefined>(undefined);

  const webcamRef = useRef<Webcam | null>(null);

  const dispatch = useDispatch();

  const handleResize = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  });

  useEffect(() => {
    if (!webcamDimensions) return;

    let newWidth = undefined;
    let newHeight = undefined;

    if (windowWidth < webcamDimensions.x) {
      newWidth = webcamDimensions.x / 2;
      newHeight = webcamDimensions.y / 2;
    } else {
      newWidth = webcamDimensions.x;
      newHeight = webcamDimensions.y;
    }

    setVideoResolution({ x: newWidth, y: newHeight });
    videoConstraints.width = newWidth;
    videoConstraints.height = newHeight;
  }, [webcamDimensions, windowWidth]);

  useEffect(() => {
    if (!webcamRef) return;

    const interval = setInterval(() => {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) setScreenshot(imageSrc);
    }, 100);

    () => {
      clearInterval(interval);
    };
  }, []);

  if (!videoResolution) return;

  return (
    <>
      <Webcam
        audio={false}
        height={videoResolution.y}
        width={videoResolution.x}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
      <CameraViewer
        imgSrc={screenshot}
        width={videoResolution.x}
        height={videoResolution.y}
      />
      <div className="filterOptions">
        <div
          className="arrowWrapper"
          onClick={() => dispatch(setPreviousFilter())}
        >
          <Icon className="arrow" icon="ic:round-arrow-left" />
        </div>
        <div className="chosenFilterDisplay">{filter}</div>
        <div className="arrowWrapper" onClick={() => dispatch(setNextFilter())}>
          <Icon className="arrow" icon="ic:round-arrow-right" />
        </div>
      </div>
    </>
  );
}

export default FilterViewer;
