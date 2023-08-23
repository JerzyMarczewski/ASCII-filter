import { useSelector } from "react-redux";
import { RootState } from "../app/store";
import Setting from "./Setting";
import { settingType } from "../features/appStatusSlice";

const SettingsPanel = () => {
  const selectedFilter = useSelector(
    (state: RootState) => state.appStatus.filter
  );
  const filterSettings = useSelector(
    (state: RootState) => state.appStatus.filterSettings
  );

  const selectedFilterSetting = filterSettings[selectedFilter];

  return (
    <div>
      {Object.keys(selectedFilterSetting).map((setting) => (
        <Setting settingName={setting as settingType} />
      ))}
    </div>
  );
};

export default SettingsPanel;
