import { useEffect, useRef, useState } from "react";
import "./styles/App.css";
import "./styles/index.css";
import FilterViewer from "./components/FilterViewer";
import { CSSTransition } from "react-transition-group";

function App() {
  type playButtonStateType = "default" | "loading" | "reload" | "final";
  const [playButtonState, setPlayButtonState] =
    useState<playButtonStateType>("default");
  const [playButtonIsDisplayed, setPlayButtonIsDisplayed] =
    useState<boolean>(true);
  const [loaderIsDisplayed, setLoaderIsDisplayed] = useState<boolean>(false);
  const [reloaderIsDisplayed, setReloaderIsDisplayed] =
    useState<boolean>(false);

  const playButtonRef = useRef(null);
  const loaderRef = useRef(null);
  const reloaderRef = useRef(null);

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
        setLoaderIsDisplayed(false);
      }, 3000);
    }
  }, [playButtonState]);

  // if (webcamIsAllowed === null) return <div>Checking webcam access...</div>;

  // if (!webcamIsAllowed)
  //   return (
  //     <div>Webcam isn't allowed. Please allow to use the application.</div>
  //   );

  return (
    <div className="container">
      <h1 className="title">ASCII Filter</h1>
      <p>{playButtonState}</p>
      <CSSTransition
        nodeRef={playButtonRef}
        in={playButtonIsDisplayed}
        timeout={500}
        classNames="playButton"
        unmountOnExit
        onExited={() => setLoaderIsDisplayed(true)}
      >
        <span
          ref={playButtonRef}
          className="playButton"
          onClick={() => {
            setPlayButtonIsDisplayed(false);
            setPlayButtonState("loading");
          }}
        ></span>
      </CSSTransition>
      <CSSTransition
        nodeRef={loaderRef}
        in={loaderIsDisplayed}
        timeout={500}
        classNames="loader"
        unmountOnExit
        onExited={() => setReloaderIsDisplayed(true)}
      >
        <span ref={loaderRef} className="loader"></span>
      </CSSTransition>
      <CSSTransition
        nodeRef={reloaderRef}
        in={reloaderIsDisplayed}
        timeout={500}
        classNames="reloader"
        unmountOnExit
        onExited={() => setPlayButtonIsDisplayed(true)}
      >
        <span ref={reloaderRef} className="reloader"></span>
      </CSSTransition>
      {/* <span className={styles.loader}></span> */}
    </div>
  );
}

export default App;
