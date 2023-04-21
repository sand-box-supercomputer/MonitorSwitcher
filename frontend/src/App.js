import { useEffect, useState } from 'react';
import './App.css';
import Monitor from './components/Monitor';
import axios from "axios"
import Button from './components/Button';
import BooleanSetting from './components/BooleanSettings';

const BACKEND_URL = "http://192.168.0.195:3443"

export default function App() {
  /**
   * General settings
  */
  const [generalSettings, setGeneralSettings] = useState({});

  const fetchGeneralSettings = () => {
    axios.get(`${BACKEND_URL}/general-settings`)
      .then(({ data }) => setGeneralSettings(data))
  }

  const updateGeneralSettings = (settings) => {
    axios.post(`${BACKEND_URL}/general-settings`, settings)
      .then(() => fetchGeneralSettings())
  }

  /**
   * Monitor input status
  */
  const [monitors, setMonitors] = useState([]);

  const fetchMonitors = () => {
    axios.get(`${BACKEND_URL}/monitors`)
      .then(({ data }) => setMonitors(data))
  }

  const onChangeInput = (monitorName, portName) => {
    axios.post(`${BACKEND_URL}/monitors/${monitorName}/changeInput`, { portName })
      .then(() => fetchMonitors())
  }

  /**
   * Presets
  */
  const [presets, setPresets] = useState([]);
  const fetchPresets = () => {
    axios.get(`${BACKEND_URL}/presets`)
      .then(({ data }) => setPresets(data))
  }

  const onActivatePreset = (presetName) => {
    axios.post(`${BACKEND_URL}/presets/${presetName}/activate`)
      .then(() => fetchMonitors())
  }


  useEffect(() => {
    fetchGeneralSettings();
    fetchMonitors();
    fetchPresets();
    let itv = setInterval(() => {
      fetchGeneralSettings();
      fetchMonitors();
    }, 1000);
    return () => clearInterval(itv);
  }, [])

  return (
    <div>
      <h1>Monitors</h1>
      <div style={styles.container}>
        {
          monitors.map((monitor => (<Monitor key={monitor.monitorName}
            monitorName={monitor.monitorName}
            inputs={monitor.inputs}
            onChangeInput={onChangeInput}></Monitor>)))
        }
      </div>


      <h1>General Settings</h1>
      <div style={styles.container}>
        <div style={styles.settingBlock}>
          {
            Object.keys(generalSettings).map(settingName => {
              if (typeof generalSettings[settingName] === "boolean") {
                return <BooleanSetting
                  label={settingName}
                  value={generalSettings[settingName]}
                  onChange={(value) => updateGeneralSettings({ [settingName]: value })}
                />
              }
              return null;
            })
          }
        </div>
      </div>


      <h1>Presets</h1>
      <div style={styles.container}>
        {
          presets.map(preset => (
            <Button key={preset} onClick={() => onActivatePreset(preset)}>
              {preset}
            </Button>
          ))
        }
      </div>

    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100%",
    minWidth: "100%",
    spaceBetween: "100px",
    flexWrap: "wrap",
  },
}