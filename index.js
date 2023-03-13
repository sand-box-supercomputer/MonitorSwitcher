const nodeCmd = require('node-cmd');
const express = require('express')
const app = express()
const usbDetect = require('usb-detection');

/**
 * Constants
 */
const PORT = 444
const API_KEY = "b2cad1cd-7eac-4b68-82ad-73aa086e2705"
const USB_VID_PID = "5426:545" // vendorId and productId of the USB device used for detect switching.
const MONITOR_MODES = {
    DP: "15",
    HDMI1: "17",
    HDMI2: "18",
}
const ASUS_PG32UQ = "Primary"
const LENOVO_L32P30 = "Secondary"
const CONTROL_MY_MONITOR_EXE = `D:\\_Work\\ControlMyMonitor\\ControlMyMonitor.exe`

const SET_MONITOR_TO = {
    pc: () => setMonitorToPc(),
    laptop: () => setMonitorToLaptop(),
    // for backward-compatibility with older setup
    macbook: () => setMonitorToLaptop(),
}

function setMonitorToPc() {
    console.log("Set monitor to PC.")
    return [
        nodeCmd.runSync(`${CONTROL_MY_MONITOR_EXE} /SetValueIfNeeded ${ASUS_PG32UQ} 60 ${MONITOR_MODES.DP}`),
        nodeCmd.runSync(`${CONTROL_MY_MONITOR_EXE} /SetValueIfNeeded ${LENOVO_L32P30} 60 ${MONITOR_MODES.DP}`),
    ]
}

function setMonitorToLaptop() {
    console.log("Set monitor to laptop.")
    return [
        nodeCmd.runSync(`${CONTROL_MY_MONITOR_EXE} /SetValueIfNeeded ${ASUS_PG32UQ} 60 ${MONITOR_MODES.HDMI2}`),
        nodeCmd.runSync(`${CONTROL_MY_MONITOR_EXE} /SetValueIfNeeded ${LENOVO_L32P30} 60 ${MONITOR_MODES.HDMI1}`),
    ]
}

/**
 * Detect USB change to swap screen
 */

usbDetect.startMonitoring();
usbDetect.on(`add:${USB_VID_PID}`, (device) => SET_MONITOR_TO.pc());
usbDetect.on(`remove:${USB_VID_PID}`, (device) => SET_MONITOR_TO.laptop());


/**
 * API server to swap screen
 */
app.post(`/switchToComputer/:id/${API_KEY}`, (req, res) => {
    let id = req.params.id
    if (!(id in SET_MONITOR_TO)) {
        res.status(404).json({ status: "invalid ID" })
        return
    }

    SET_MONITOR_TO[id]()
    res.status(200).json({ status: 'OK' })
})

app.listen(PORT, () => {
    console.log(`Monitor switch server listening on port ${PORT}`)
})
