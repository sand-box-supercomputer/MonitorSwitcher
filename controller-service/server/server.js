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

server.get('/monitors', (req, res) => {
  res.send({ monitors, monitorsSetting })
})

server.post('/monitors/:monitorName/changeInput', (req, res) => {
  console.log(req.body)
  const { monitorName } = req.params;
  const { portName } = req.body;
  switchInput(monitorName, portName);
  res.send(monitors)
})

server.get('/presets', (req, res) => {
  res.send({ presets, presetsSetting });
})

server.post('/presets/:key0/:key1/activate', (req, res) => {
  const { key0, key1 } = req.params;
  presets[key0][key1].trigger();
  res.send({ presets, presetsSetting })
})

server.post('/presets/:key0/set-usb-switch-mode', (req, res) => {
  const { key0 } = req.params;
  presetsSetting['Preset mode for USB switch'] = key0;
  res.send({ presetsSetting })
})

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
  presets[key0][key1].trigger();
  console.log(`Activated preset[${key0}][${key1}].`)
  res.send(`Activated preset[${key0}][${key1}].`);
})
