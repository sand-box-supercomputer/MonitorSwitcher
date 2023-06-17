import usbDetect from 'usb-detection';
import axios from "axios";
import { io } from "socket.io-client";
import { execFile } from "child_process";
import { AUDIO_MONITOR_PRIORITY, COMPUTER_NAME } from './local-config.js';

const USB_VID_PID = "5426:545" // vendorId and productId of the USB device used for detect switching.
const CONTROL_SERVER_URL = COMPUTER_NAME === "SuperComputer" ? "http://localhost:10555" : "http://pqhuy.ddns.net:10555"

const MONITOR_SPEAKER_MAP = {
  "Asus PG32UQ": (isMuted) => !isMuted ? "ASUS PG32UQ" : "Speakers",
  "Lenovo P27h-20": () => "P27h-20",
  "Lenovo L32p-30": () => "L32p-30",
}

/**
 * USB detector
 */

console.log("Start USB detector")

async function sendEventWithKeyword(keyword) {
  console.log(keyword)
  try {
    await axios.post(`${CONTROL_SERVER_URL}/usb-switch/${keyword}`).then(({ data }) => console.log(data));
  } catch (e) {
    console.log(e);
    // swallow
  }
}

usbDetect.startMonitoring();
usbDetect.on(`add:${USB_VID_PID}`, (device) => sendEventWithKeyword(COMPUTER_NAME));

/**
 * Socket.io client
 */

console.log("Start socket.io client")
const socket = io(CONTROL_SERVER_URL, { path: "/client-computer" });
socket.on("connect", () => {
  console.log("Connected to socket.io server");
  socket.emit("register", COMPUTER_NAME);
});

socket.on("connectedMonitors", (data) => {
  const connectedMonitors = data.monitors
    .filter(monitor => monitor.isActivated)
  console.log("connected monitors", connectedMonitors.map(m => m.monitorName));

  for (const monitorName of AUDIO_MONITOR_PRIORITY) {
    const chosenMonitor = connectedMonitors.find(m => m.monitorName === monitorName);
    if (chosenMonitor) {
      console.log(`Switch audio output to ${chosenMonitor.monitorName}`);
      switchAudioOutput(chosenMonitor);
      break;
    }
  }
})

function switchAudioOutput(chosenMonitor) {
  const audioOutput = MONITOR_SPEAKER_MAP[chosenMonitor.monitorName](chosenMonitor.isMuted);
  if (audioOutput) {
    console.log("CMD: ./nircmd/nircmd.exe setdefaultsounddevice", audioOutput)
    execFile("./nircmd/nircmd.exe", ["setdefaultsounddevice", audioOutput], (error, data) => {
      if (error) {
        console.log(error, data);
      }
    });
  }
}

socket.on("connect_error", (err) => {
  console.log(`connect_error due to ${err}`);
});