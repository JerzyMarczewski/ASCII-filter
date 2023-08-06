import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./styles/App.css";
import "./styles/index.css";
import FilterViewer from "./components/FilterViewer";
import MainButton from "./components/MainButton";
import { RootState } from "./app/store";
import { setAppStatus } from "./features/appStatusSlice";
import { setLoaderIsDisplayed } from "./features/mainButtonSlice";
import { CSSTransition } from "react-transition-group";

function App() {
  const status = useSelector((state: RootState) => state.appStatus.status);

  const dispatch = useDispatch();

  const containerRef = useRef(null);

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
    if (allowed) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    if (status !== "loading") return;

    // remove timeout for production
    setTimeout(async () => {
      const webcamIsAllowed = await checkWebcamAccess();
      if (webcamIsAllowed) {
        dispatch(setAppStatus("final"));
      } else {
        dispatch(setAppStatus("reload"));
        dispatch(setLoaderIsDisplayed(false)); // think about moving this to the main Button component
      }
    }, 3000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  return (
    <CSSTransition
      nodeRef={containerRef}
      in={status !== "final"}
      timeout={500}
      classNames="container"
    >
      <div ref={containerRef} className="container">
        <h1 className="title">ASCII Filter</h1>
        {status === "final" ? <FilterViewer /> : <MainButton />}
      </div>
    </CSSTransition>
  );
}

export default App;
