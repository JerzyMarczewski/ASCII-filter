import { useRef } from "react";
import { CSSTransition } from "react-transition-group";
import { Icon } from "@iconify/react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../app/store";
import {
  setLoaderIsDisplayed,
  setPlayButtonIsDisplayed,
  setReloaderIsDisplayed,
} from "../features/mainButtonSlice";
import { setAppStatus } from "../features/appStatusSlice";

const MainButton = () => {
  const playButtonIsDisplayed = useSelector(
    (state: RootState) => state.mainButton.playButtonIsDisplayed
  );
  const loaderIsDisplayed = useSelector(
    (state: RootState) => state.mainButton.loaderIsDisplayed
  );
  const reloaderIsDisplayed = useSelector(
    (state: RootState) => state.mainButton.reloaderIsDisplayed
  );

  const playButtonRef = useRef(null);
  const loaderRef = useRef(null);
  const reloaderRef = useRef(null);

  const dispatch = useDispatch();

  return (
    <div>
      <CSSTransition
        nodeRef={playButtonRef}
        in={playButtonIsDisplayed}
        timeout={500}
        classNames="playButton"
        onExited={() => dispatch(setLoaderIsDisplayed(true))}
        unmountOnExit
      >
        <span
          ref={playButtonRef}
          className="playButton"
          onClick={() => {
            dispatch(setPlayButtonIsDisplayed(false));
            dispatch(setAppStatus("loading"));
          }}
        ></span>
      </CSSTransition>
      <CSSTransition
        nodeRef={loaderRef}
        in={loaderIsDisplayed}
        timeout={0}
        classNames="loader"
        onExited={() => dispatch(setReloaderIsDisplayed(true))}
        unmountOnExit
      >
        <span ref={loaderRef} className="loader"></span>
      </CSSTransition>
      <CSSTransition
        nodeRef={reloaderRef}
        in={reloaderIsDisplayed}
        timeout={500}
        classNames="reloader"
        enter
        onExited={() => dispatch(setLoaderIsDisplayed(true))}
        unmountOnExit
      >
        <span
          ref={reloaderRef}
          className="reloader"
          onClick={() => {
            dispatch(setReloaderIsDisplayed(false));
            dispatch(setAppStatus("loading"));
          }}
        >
          <Icon icon="tabler:reload" className="reloaderIcon" />
        </span>
      </CSSTransition>
    </div>
  );
};

export default MainButton;
