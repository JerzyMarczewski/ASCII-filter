import { useEffect, useState } from "react";
import "./App.css";
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
    <>
      <h1>ASCII Filter</h1>
    </>
  );
}

export default App;
