const API_KEY = "b2cad1cd-7eac-4b68-82ad-73aa086e2705"
const VALID_IDS = ["15", "18"]

const SET_MONITOR_CMD_PREFIX = `D:\\_Work\\ControlMyMonitor\\ControlMyMonitor.exe /SetValue "\\\\.\\DISPLAY1\\Monitor0" 60`

function setMonitorToComputer(computerId) {
    return nodeCmd.runSync(`${SET_MONITOR_CMD_PREFIX} ${computerId}`)
}

const nodeCmd = require('node-cmd');
const express = require('express')
const app = express()
const port = 65100

app.post(`/switchToComputer/:id/${API_KEY}`, (req, res) => {
    let id = req.params.id
    if (!VALID_IDS.includes(id)) {
        res.status(404).json({ status: "invalid ID" })
        return
    }

    let data = setMonitorToComputer(id)
    console.log(data)
    res.status(200).json({ status: 'OK', data })
})

app.listen(port, () => {
    console.log(`Monitor switch server listening on port ${port}`)
})
