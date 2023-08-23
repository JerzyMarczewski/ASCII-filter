import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { changeGammaSetting, settingType } from "../features/appStatusSlice";

interface SettingProps {
  settingName: settingType;
}

const Setting = (props: SettingProps) => {
  const selectedFilter = useSelector(
    (state: RootState) => state.appStatus.filter
  );
  const filterSettings = useSelector(
    (state: RootState) => state.appStatus.filterSettings
  );
  const settingsLimits = useSelector(
    (state: RootState) => state.appStatus.settingsLimits
  );

  const selectedFilterSetting = filterSettings[selectedFilter];
  const selectedSettingValue = selectedFilterSetting[props.settingName];
  const selectedSettingLimits = settingsLimits[props.settingName];

  const dispatch = useDispatch();

  if (selectedSettingValue === undefined) return;

  return (
    <div>
      <div>
        <div>{props.settingName}</div>
        <div>{selectedFilterSetting[props.settingName]}</div>
      </div>
      <input
        type="range"
        name=""
        id=""
        min={selectedSettingLimits.min * 100}
        max={selectedSettingLimits.max * 100}
        value={selectedSettingValue * 100}
        onChange={(event) => {
          if (props.settingName === "gamma")
            dispatch(changeGammaSetting(parseInt(event.target.value) / 100));
        }}
      />
    </div>
  );
};

export default Setting;
