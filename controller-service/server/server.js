import express from 'express'
import cors from 'cors'
import https from 'https';
import fs from 'fs';
import { monitors, monitorsSetting } from './data/monitors.js';
import { changeMuteMonitor, changeVolume, syncRealStatus, switchInput, toggleMuteMonitor } from './lib.js';
import { presetsSetting, presets } from './data/presets.js';
import { Server } from "socket.io";
import { COMPUTER_CONFIG, getComputerName } from './data/computer_config.js';

syncRealStatus();

/** 
 * Express server
*/

export const expressApp = express()
expressApp.use(cors())
expressApp.use(express.json())

/**
 * Express endpoints
 */

function requiresAuth(req, res, next) {
  if (req.headers.authorization === "Hello1controller") {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

expressApp.get('/computer-config/:computerId', (req, res) => {
  const { computerId } = req.params;
  const config = COMPUTER_CONFIG[computerId];
  if (config) {
    res.send(config);
  } else {
    res.status(404).send(`No config for computer "${computerId}" found.`);
  }
})

expressApp.get('/monitors', requiresAuth, (req, res) => {
  res.send({ monitors, monitorsSetting })
})

expressApp.post('/monitors/:monitorName/changeInput', requiresAuth, (req, res) => {
  const { monitorName } = req.params;
  const { portName } = req.body;
  console.log("\nchangeInput", monitorName, portName);

  switchInput(monitorName, portName);
  res.send({ monitors, monitorsSetting })
  notifyAllComputers();
})

expressApp.post('/monitors/:monitorName/changeVolume', requiresAuth, (req, res) => {
  const { monitorName } = req.params;
  const { volumeValue, volumeAdded, isMuted, toggleMute } = req.body;
  console.log("\nchangeVolume", monitorName, { volumeValue, volumeAdded, isMuted, toggleMute });

  const isPreviouslyMuted = monitors.find(m => m.monitorName === monitorName).isMuted;

  if (volumeValue !== undefined || volumeAdded !== undefined) {
    changeVolume(monitorName, volumeValue, volumeAdded);
  }
  if (isMuted !== undefined) {
    changeMuteMonitor(monitorName, isMuted);
  }
  if (toggleMute === true && isMuted === undefined) {
    toggleMuteMonitor(monitorName);
  }
  res.send({ monitors, monitorsSetting })

  const isNowMuted = monitors.find(m => m.monitorName === monitorName).isMuted;
  if (isPreviouslyMuted !== isNowMuted) {
    notifyAllComputers();
  }
})

expressApp.get('/presets', requiresAuth, (req, res) => {
  res.send({ presets, presetsSetting });
})

expressApp.post('/presets/:key0/:key1/activate', requiresAuth, (req, res) => {
  const { key0, key1 } = req.params;
  console.log(`\nactivate preset [${key0}][${key1}].`);

  presets[key0][key1].trigger();
  res.send({ presets, presetsSetting })
  notifyAllComputers();
})

expressApp.post('/presets/:key0/set-usb-switch-mode', requiresAuth, (req, res) => {
  const { key0 } = req.params;
  console.log("\nset usb switch mode", key0);

  presetsSetting['Preset mode for USB switch'] = key0;
  res.send({ presetsSetting })
})

// This endpoint is unauthenticated for devices to submit USB events
expressApp.post('/usb-switch/:computerId', (req, res) => {
  let { computerId } = req.params;
  let computerName = getComputerName(computerId);
  if (!computerName) {
    res.status(404).send(`Unknown computer "${computerId}".`);
    return;
  }

  let key0 = presetsSetting["Preset mode for USB switch"]
  if (Object.keys(presets[key0]).length <= 0) {
    console.log(presets[key0])
    res.send("Do nothing because preset is empty.")
    return;
  }

  let key1s = Object.keys(presets[key0]);
  let key1 = key1s.find(p => p.toLowerCase().includes(computerName.toLowerCase()));
  console.log(key0, key1)
  if (!key1) {
    res.status(404).send(`No preset for computer "${computerName}" found.`);
  }

  presets[key0][key1].trigger();
  console.log(`Activated preset[${key0}][${key1}].`)
  res.send(`OK`);
  notifyAllComputers();
})

/**
 * Socket.io server
 */

// read https certificate

export const server = https.createServer({
  key: fs.readFileSync("C:\\Certbot\\live\\monitor.quangdel.com\\privkey.pem"),
  cert: fs.readFileSync("C:\\Certbot\\live\\monitor.quangdel.com\\fullchain.pem"),
}, expressApp);

const clientComputerSocketIo = new Server(server, {
  path: "/client-computer",
});
clientComputerSocketIo.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('register', (computerId) => {
    const computerName = getComputerName(computerId);
    if (!computerName) {
      console.log(`Unknown connected computer "${computerId}".`);
      socket.disconnect(true);
      return;
    }

    console.log(`Register computer ${computerId} (${computerName})`);
    socket.join(`events/${computerName}`);
    notifyAllComputers();
  });
});


function notifyAllComputers() {
  // Notify the computers
  const connectedMonitors = {};
  for (const monitor of monitors) {
    // add all monitor connected to the computer
    monitor.inputs.forEach(input => {
      if (!connectedMonitors[input.computerName]) {
        connectedMonitors[input.computerName] = [];
      }
      connectedMonitors[input.computerName].push({
        monitorName: monitor.monitorName,
        isActivated: input.isActivated,
        isMuted: monitor.isMuted,
      });
    });
  }
  for (const computerName in connectedMonitors) {
    clientComputerSocketIo.to(`events/${computerName}`).emit('connectedMonitors', {
      computerName,
      monitors: connectedMonitors[computerName]
    });
  }
}
