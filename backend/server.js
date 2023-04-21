const express = require('express')
const cors = require('cors')
const nodeCmd = require('node-cmd');
const fs = require('fs');
const ddcci = require("@hensm/ddcci");
const rawMonitorIds = ddcci.getMonitorList();

/**
 * Configuration
 */
const generalSettings = {
  "Listen to USB switch": true,
}

const SuperComputer = "SuperComputer"
const MacbookPro = "Macbook Pro"

const monitors = [
  {
    monitorName: "Lenovo L32p-30",
    monitorId: rawMonitorIds.find(id => id.includes("LEN")),
    inputs: [
      {
        computerName: MacbookPro,
        portName: "HDMI1",
        isActivated: false,
      },
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
    ]
  },

  {
    monitorName: "ASUS PG32UQ",
    monitorId: rawMonitorIds.find(id => id.includes("AUS")),
    inputs: [
      {
        computerName: MacbookPro,
        portName: "HDMI2",
        isActivated: false,
      },
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
    ]
  },
]

const presets = {
  "All to SuperComputer": () => {
    switchInput(monitors[0].monitorName, monitors[0].inputs.find(input => input.computerName === SuperComputer).portName);
    switchInput(monitors[1].monitorName, monitors[1].inputs.find(input => input.computerName === SuperComputer).portName);
  },
  "All to Macbook Pro": () => {
    switchInput(monitors[0].monitorName, monitors[0].inputs.find(input => input.computerName === MacbookPro).portName);
    switchInput(monitors[1].monitorName, monitors[1].inputs.find(input => input.computerName === MacbookPro).portName);
  }
}

/**
 * Implementation
 */

const MONITOR_INPUT_CODE = {
  DP: 15,
  HDMI1: 17,
  HDMI2: 18,
}

function getInputSource(monitorId) {
  return ddcci._getVCP(monitorId, 0x60)[0];
}

function setInputSource(monitorId, value) {
  ddcci._setVCP(monitorId, 0x60, value)
}

function switchInput(monitorName, portName) {
  monitors.forEach(m => {
    if (m.monitorName === monitorName) {
      m.inputs.forEach(input => {
        input.isActivated = (input.portName === portName);
        if (input.isActivated) {
          console.log(`Set ${m.monitorName} to ${input.computerName} (${input.portName}).`);
          if (getInputSource(m.monitorId) !== MONITOR_INPUT_CODE[input.portName]) {
            setInputSource(m.monitorId, MONITOR_INPUT_CODE[input.portName])
          }
        }
      })
    }
  })
}

function fetchRealStatus() {
  monitors.forEach(monitor => {
    try {
      const currentInputCode = getInputSource(monitor.monitorId);
      monitor.inputs.forEach(input => {
        input.isActivated = (MONITOR_INPUT_CODE[input.portName] === currentInputCode);
      })
    } catch (e) {
      // suck it up
    }
  })
  setTimeout(fetchRealStatus, 500);
}

fetchRealStatus();

/** 
 * Express Server
*/

const app = express()
app.use(cors())
app.use(express.json())

const port = 3443

app.get('/general-settings', (req, res) => {
  res.send(generalSettings);
})

app.post('/general-settings', (req, res) => {
  Object.assign(generalSettings, req.body);
  res.send(generalSettings);
})

app.get('/monitors', (req, res) => {
  res.send(monitors)
})

app.post('/monitors/:monitorName/changeInput', (req, res) => {
  console.log(req.body)
  const { monitorName } = req.params;
  const { portName } = req.body;
  switchInput(monitorName, portName);
  res.send(monitors)
})

app.get('/presets', (req, res) => {
  res.send(Object.keys(presets));
})

app.post('/presets/:preset/activate', (req, res) => {
  const { preset } = req.params;
  presets[preset]();
  res.send(monitors)
})

app.post('/usb-switch/:keyword', (req, res) => {
  if (generalSettings['Listen to USB switch']) {
    let { keyword } = req.params;
    let presetNames = Object.keys(presets);
    let matchingPresetName = presetNames.find(p => p.toLowerCase().includes(keyword.toLowerCase()));
    presets[matchingPresetName]();
    res.send(`Activated preset "${matchingPresetName}".`);
  } else {
    res.send("USB switch is disabled.");
  }
})

app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})
