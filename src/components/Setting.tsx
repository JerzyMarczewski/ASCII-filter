import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import { changeSetting, settingType } from "../features/appStatusSlice";
import "../styles/index.css";
import "../styles/Setting.css";

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

  const slider =
    props.settingName === "gamma" ? (
      <input
        className="slider"
        type="range"
        name=""
        id=""
        min={selectedSettingLimits.min * 100}
        max={selectedSettingLimits.max * 100}
        value={selectedSettingValue * 100}
        onChange={(event) => {
          dispatch(
            changeSetting({
              settingName: props.settingName,
              value: parseInt(event.target.value) / 100,
            })
          );
        }}
      />
    ) : (
      <input
        className="slider"
        type="range"
        name=""
        id=""
        min={selectedSettingLimits.min}
        max={selectedSettingLimits.max}
        value={selectedSettingValue}
        onChange={(event) => {
          dispatch(
            changeSetting({
              settingName: props.settingName,
              value: parseInt(event.target.value),
            })
          );
        }}
      />
    );

  return (
    <div className="setting">
      <div className="settingNameAndValue">
        {props.settingName === "gamma" ? <div>Gamma</div> : ""}
        {props.settingName === "squareSize" ? <div>Square size</div> : ""}
        <div className="settingValue">
          {selectedFilterSetting[props.settingName]}
        </div>
      </div>
      {slider}
    </div>
  );
};

export default Setting;
