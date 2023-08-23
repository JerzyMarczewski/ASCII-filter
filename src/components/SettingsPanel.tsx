import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import Setting from "./Setting";
import { resetFilterSettings, settingType } from "../features/appStatusSlice";

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
    <Setting settingName={setting as settingType} />
  ));

  return (
    <div>
      {settings}
      <button onClick={() => dispatch(resetFilterSettings(selectedFilter))}>
        reset
      </button>
    </div>
  );
};

export default SettingsPanel;
