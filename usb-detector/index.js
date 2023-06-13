import usbDetect from 'usb-detection';
import axios from "axios";

const USB_VID_PID = "5426:545" // vendorId and productId of the USB device used for detect switching.
const CONTROL_SERVER_URL = "http://pqhuy.ddns.net:10555"

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
usbDetect.on(`add:${USB_VID_PID}`, (device) => sendEventWithKeyword("SuperComputer"));
// usbDetect.on(`remove:${USB_VID_PID}`, (device) => sendEventWithKeyword("Macbook"));
