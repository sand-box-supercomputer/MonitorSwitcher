import { useEffect, useState } from 'react';
import Monitor from './components/Monitor';
import axios from "axios"
import Button from './components/Button';

const BACKEND_URL = ""

export default function App() {

  /**
   * Monitor input status
  */
  const [monitors, setMonitors] = useState([]);

  const fetchMonitors = () => {
    axios.get(`${BACKEND_URL}/monitors`)
      .then(({ data }) => setMonitors(data.monitors))
  }

  const onChangeInput = (monitorName, portName) => {
    axios.post(`${BACKEND_URL}/monitors/${monitorName}/changeInput`, { portName })
      .then(() => fetchMonitors())
  }

  /**
   * Presets
  */
  const [presets, setPresets] = useState([]);
  const [presetsSetting, setPresetsSetting] = useState({});
  const presetList = [];
  Object.keys(presets).forEach(key0 => {
    Object.keys(presets[key0]).forEach(key1 => {
      presetList.push({ key0, key1, text: presets[key0][key1].text })
    })
  })

  const fetchPresets = () => {
    axios.get(`${BACKEND_URL}/presets`)
      .then(({ data }) => {
        setPresets(data.presets);
        setPresetsSetting(data.presetsSetting);
      })
  }

  const onActivatePreset = ({ key0, key1 }) => {
    axios.post(`${BACKEND_URL}/presets/${key0}/${key1}/activate`)
      .then(() => fetchMonitors())
  }

  const onPresetSetUsbSwitchMode = (key0) => {
    axios.post(`${BACKEND_URL}/presets/${key0}/set-usb-switch-mode`)
  }

  /**
   * Reloading
  */
  useEffect(() => {
    fetchMonitors();
    fetchPresets();
    let itv = setInterval(() => {
      fetchMonitors();
      fetchPresets();
    }, 1000);
    return () => clearInterval(itv);
  }, [])

  return (
    <div>
      <h1>Execute Presets</h1>
      <div>
        {
          Object.keys(presets).map(key0 => {
            return <div key={key0} style={styles.container}>
              {
                Object.keys(presets[key0]).map(key1 => (
                  <Button key={key0 + "." + key1} onClick={() => onActivatePreset({ key0, key1 })}>
                    {presets[key0][key1].text}
                  </Button>
                ))
              }
            </div>

          })
        }
      </div>


      <h1>Preset for USB Switch</h1>
      <div style={styles.container}>
        <div style={styles.settingBlock}>
          {
            Object.keys(presets).map(key0 => <Button
              key={key0}
              isActivated={presetsSetting["Preset mode for USB switch"] === key0}
              onClick={() => onPresetSetUsbSwitchMode(key0)}>
              {key0}
            </Button>)
          }
        </div>
      </div>


      <h1>Monitors</h1>
      <div style={styles.container}>
        {
          monitors.map((monitor => (<Monitor key={monitor.monitorName}
            monitorName={monitor.monitorName}
            inputs={monitor.inputs}
            onChangeInput={onChangeInput}></Monitor>)))
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
    // minHeight: "100%",
    // minWidth: "80%",
    spaceBetween: "100px",
    flexWrap: "wrap",
  },
}