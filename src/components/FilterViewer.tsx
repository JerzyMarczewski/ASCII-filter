import { setNextFilter, setPreviousFilter } from "../features/appStatusSlice";
import { RootState } from "../app/store";
import { useDispatch, useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import "../styles/FilterViewer.css";
import CameraViewer from "./CameraViewer";

function FilterViewer() {
  const filter = useSelector((state: RootState) => state.appStatus.filter);

  const dispatch = useDispatch();

  return (
    <>
      <CameraViewer />
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
