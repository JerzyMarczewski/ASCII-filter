import { useEffect, useState } from "react";
import styles from "./styles/App.module.css";
import "./styles/index.css";
import FilterViewer from "./components/FilterViewer";

function App() {
  type playButtonStateType = "default" | "loading" | "reload" | "final";
  const [playButtonState, setPlayButtonState] =
    useState<playButtonStateType>("default");

  const isWebcamAllowed = async (): Promise<boolean> => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true });
      return true;
    } catch (error) {
      return false;
    }
  };

  const checkWebcamAccess = async () => {
    const allowed = await isWebcamAllowed();
    if (allowed) setPlayButtonState("final");
    else setPlayButtonState("reload");
  };

  useEffect(() => {
    if (playButtonState === "loading") {
      setTimeout(() => {
        void checkWebcamAccess();
        setPlayButtonState("final");
      }, 500);
    }
  }, [playButtonState]);

  // if (webcamIsAllowed === null) return <div>Checking webcam access...</div>;

  // if (!webcamIsAllowed)
  //   return (
  //     <div>Webcam isn't allowed. Please allow to use the application.</div>
  //   );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ASCII Filter</h1>
      <p onClick={() => setPlayButtonState("loading")}>{playButtonState}</p>
      <span className={styles.play}></span>
      <span className={styles.loader}></span>
    </div>
  );
}

export default App;
