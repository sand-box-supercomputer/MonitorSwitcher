import { useEffect, useState } from 'react';
import Monitor from './components/Monitor';
import axios from "axios"
import Button from './components/Button';
import { Button as AntButton } from "antd"

const BACKEND_URL = ""

export default function App() {
  const [password, setPassword] = useState("");

  /**
   * Monitor input status
  */
  const [monitors, setMonitors] = useState([]);

  const fetchMonitors = async () => {
    return axios.get(`${BACKEND_URL}/monitors`, { headers: { Authorization: password } })
      .then(({ data }) => setMonitors(data.monitors))
  }

  const onChangeInput = async (monitorName, portName) => {
    return axios.post(`${BACKEND_URL}/monitors/${monitorName}/changeInput`, { portName }, { headers: { Authorization: password } })
      .then(({ data }) => setMonitors(data.monitors))
  }

  /**
   * Monitor volume status
   */
  const changeVolume = async (monitorName, volumeValue, isMuted) => {
    return axios.post(`${BACKEND_URL}/monitors/${monitorName}/changeVolume`, { volumeValue, isMuted }, { headers: { Authorization: password } })
      .then(({ data }) => setMonitors(data.monitors))
  }

  const changeMuteAll = (isMuted) => {
    for (const monitor of monitors) {
      changeVolume(monitor.monitorName, undefined, isMuted);
    }
  }

  const isAllMuted = monitors.filter(monitor => monitor.isMuted || monitor.volume === 0).length === monitors.length;

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

  const fetchPresets = async () => {
    return axios.get(`${BACKEND_URL}/presets`, { headers: { Authorization: password } })
      .then(({ data }) => {
        setPresets(data.presets);
        setPresetsSetting(data.presetsSetting);
      })
  }

  const onActivatePreset = async ({ key0, key1 }) => {
    return axios.post(`${BACKEND_URL}/presets/${key0}/${key1}/activate`, {}, { headers: { Authorization: password } })
      .then(() => fetchMonitors())
  }

  const onPresetSetUsbSwitchMode = async (key0) => {
    return axios.post(`${BACKEND_URL}/presets/${key0}/set-usb-switch-mode`, {}, { headers: { Authorization: password } })
  }

  /**
   * Reloading
  */
  useEffect(() => {
    if (localStorage.getItem("password") === null) {
      let pwd = prompt("Please enter password");
      localStorage.setItem("password", pwd);
    }
    setPassword(localStorage.getItem("password"));
  }, []);

  useEffect(() => {
    if (password === "") return;
    const repeat = () => setTimeout(async () => {
      await Promise.all([
        fetchMonitors(),
        fetchPresets(),
      ]);
      repeat();
    }, 333);
    fetchMonitors();
    fetchPresets();
    repeat();
  }, [password])

  return (
    <div>
      <h1>Display Presets</h1>
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

      <h1>Preset on USB Switch</h1>
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

      <AntButton
        type="primary"
        size="large"
        danger={!isAllMuted}
        onClick={() => changeMuteAll(!isAllMuted)}
      >
        <b>{isAllMuted ? "UNMUTE ALL" : "MUTE ALL"}</b>
      </AntButton>

      <div style={styles.container}>
        {
          monitors.map((monitor => (<Monitor key={monitor.monitorName}
            monitor={monitor}
            monitorName={monitor.monitorName}

            inputs={monitor.inputs}
            onChangeInput={onChangeInput}

            isMuted={monitor.isMuted}
            volumeValue={!monitor.isMuted ? monitor.volume : monitor.volumeBeforeMute}
            onVolumeChange={(volumeValue) => changeVolume(monitor.monitorName, volumeValue, undefined)}
            onMuteButtonClick={() => changeVolume(monitor.monitorName, undefined, !monitor.isMuted)}
          ></Monitor>)))
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