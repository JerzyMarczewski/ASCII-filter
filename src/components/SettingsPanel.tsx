import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import Setting from "./Setting";
import { resetFilterSettings, settingType } from "../features/appStatusSlice";
import "../styles/index.css";
import "../styles/SettingsPanel.css";

const SettingsPanel = () => {
  const selectedFilter = useSelector(
    (state: RootState) => state.appStatus.filter
  );
  const filterSettings = useSelector(
    (state: RootState) => state.appStatus.filterSettings
  );

  const dispatch = useDispatch();

  const selectedFilterSetting = filterSettings[selectedFilter];

  const settings = Object.keys(selectedFilterSetting).map((setting) => (
    <Setting key={setting} settingName={setting as settingType} />
  ));

  return (
    <div className="settingsPanel">
      {settings}
      <button
        className="resetButton"
        onClick={() => dispatch(resetFilterSettings(selectedFilter))}
      >
        RESET
      </button>
    </div>
  );
};

export default SettingsPanel;
