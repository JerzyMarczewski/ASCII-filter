import { useEffect, useState } from "react";
import styles from "./styles/App.module.css";
import "./styles/index.css";
import FilterViewer from "./components/FilterViewer";

function App() {
  const [webcamIsAllowed, setWebcamIsAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const checkWebcamAccess = async () => {
      try {
        await navigator.mediaDevices.getUserMedia({ video: true });
        setWebcamIsAllowed(true);
      } catch (error) {
        setWebcamIsAllowed(false);
      }
    };

    void checkWebcamAccess();
  }, []);

  // if (webcamIsAllowed === null) return <div>Checking webcam access...</div>;

  // if (!webcamIsAllowed)
  //   return (
  //     <div>Webcam isn't allowed. Please allow to use the application.</div>
  //   );

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>ASCII Filter</h1>
      <span className={styles.play}></span>
      <span className={styles.loader}></span>
    </div>
  );
}

export default App;
