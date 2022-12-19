const nodeCmd = require('node-cmd');
const express = require('express')
const app = express()

const API_KEY = "b2cad1cd-7eac-4b68-82ad-73aa086e2705"

const VALID_SETTERS = {
    macbook: () => setMonitorToMacbook(),
    pc: () => setMonitorToPc(),
}

const MONITOR_MODES = {
    DP: "15",
    HDMI1: "17",
    HDMI2: "18",
}

function setMonitorToPc() {
    return [
        nodeCmd.runSync(`D:\\_Work\\ControlMyMonitor\\ControlMyMonitor.exe /SetValue "\\\\.\\DISPLAY1\\Monitor0" 60 ${MONITOR_MODES.DP}`),
        nodeCmd.runSync(`D:\\_Work\\ControlMyMonitor\\ControlMyMonitor.exe /SetValue "\\\\.\\DISPLAY2\\Monitor0" 60 ${MONITOR_MODES.DP}`),
    ]
}

function setMonitorToMacbook() {
    return [
        nodeCmd.runSync(`D:\\_Work\\ControlMyMonitor\\ControlMyMonitor.exe /SetValue "\\\\.\\DISPLAY1\\Monitor0" 60 ${MONITOR_MODES.HDMI1}`),
        nodeCmd.runSync(`D:\\_Work\\ControlMyMonitor\\ControlMyMonitor.exe /SetValue "\\\\.\\DISPLAY2\\Monitor0" 60 ${MONITOR_MODES.HDMI2}`),
    ]
}
const port = 444

app.post(`/switchToComputer/:id/${API_KEY}`, (req, res) => {
    let id = req.params.id
    if (!(id in VALID_SETTERS)) {
        res.status(404).json({ status: "invalid ID" })
        return
    }

    let data = VALID_SETTERS[id]()
    console.log(data)
    res.status(200).json({ status: 'OK', data })
})

app.listen(port, () => {
    console.log(`Monitor switch server listening on port ${port}`)
})
