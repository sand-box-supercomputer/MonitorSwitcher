import express from 'express'
import cors from 'cors'
import { monitors, monitorsSetting } from './data/monitors.js';
import { fetchRealStatus, switchInput } from './lib.js';
import { presetsSetting, presets } from './data/presets.js';

fetchRealStatus();

/** 
 * Express Server
*/

export const server = express()
server.use(cors())
server.use(express.json())

function requiresAuth(req, res, next) {
  if (req.headers.authorization === "Hello1controller") {
    next()
  } else {
    res.status(401).send('Unauthorized')
  }
}

server.get('/monitors', requiresAuth, (req, res) => {
  res.send({ monitors, monitorsSetting })
})

server.post('/monitors/:monitorName/changeInput', requiresAuth, (req, res) => {
  console.log(req.body)
  const { monitorName } = req.params;
  const { portName } = req.body;
  switchInput(monitorName, portName);
  res.send(monitors)
})

server.get('/presets', requiresAuth, (req, res) => {
  res.send({ presets, presetsSetting });
})

server.post('/presets/:key0/:key1/activate', requiresAuth, (req, res) => {
  const { key0, key1 } = req.params;
  presets[key0][key1].trigger();
  res.send({ presets, presetsSetting })
})

server.post('/presets/:key0/set-usb-switch-mode', requiresAuth, (req, res) => {
  const { key0 } = req.params;
  presetsSetting['Preset mode for USB switch'] = key0;
  res.send({ presetsSetting })
})

// This endpoint is unauthenticated for devices to submit USB events
server.post('/usb-switch/:keyword', (req, res) => {
  let { keyword } = req.params;
  let key0 = presetsSetting["Preset mode for USB switch"]
  if (Object.keys(presets[key0]).length <= 0) {
    console.log(presets[key0])
    res.send("Do nothing because preset is empty.")
    return;
  }

  let key1s = Object.keys(presets[key0]);
  let key1 = key1s.find(p => p.toLowerCase().includes(keyword.toLowerCase()));
  console.log(key0, key1)
  if (!key1) {
    res.status(404).send(`No preset for keyword "${keyword}" found.`);
  }

  presets[key0][key1].trigger();
  console.log(`Activated preset[${key0}][${key1}].`)
  res.send(`OK`);
})
