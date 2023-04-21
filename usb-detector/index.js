const usbDetect = require('usb-detection');
const axios = require("axios");

const USB_VID_PID = "5426:545" // vendorId and productId of the USB device used for detect switching.
const CONTROL_SERVER_URL = "http://localhost:3443"

let presets = [];
getPresets();

function getPresets() {
    axios.get(`${CONTROL_SERVER_URL}/presets`).then(({ data }) => {
        presets = data;
        console.log("Loaded preset successfully:", presets)
    }).catch((e) => {
        console.log("Cannot load preset, retrying...")
        setTimeout(getPresets, 3000);
    })
}

async function checkUsbSwitchEnabled() {
    let data = await axios.get(`${CONTROL_SERVER_URL}/general-settings`);
    return data["Listen to USB switch"] === true;
}

async function sendEventWithKeyword(keyword) {
    axios.post(`${CONTROL_SERVER_URL}/usb-switch/${keyword}`).then(({ data }) => console.log(data));
}

usbDetect.startMonitoring();
usbDetect.on(`add:${USB_VID_PID}`, (device) => sendEventWithKeyword("SuperComputer"));
usbDetect.on(`remove:${USB_VID_PID}`, (device) => sendEventWithKeyword("Macbook"));