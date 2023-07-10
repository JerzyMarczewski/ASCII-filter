import { useCallback, useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 360,
  height: 360,
  facingMode: "user",
};

const LiveCameraViewer = () => {
  const webcamRef = useRef<Webcam | null>(null);

  const [screenshot, setScreenshot] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const imageSrc = webcamRef?.current?.getScreenshot();
      if (imageSrc) setScreenshot(imageSrc);
    }, 1000 / 60);

    () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Webcam
        audio={false}
        height={0}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        width={0}
        videoConstraints={videoConstraints}
      />
      {screenshot && <img src={screenshot} />}
    </>
  );
};

export default LiveCameraViewer;
