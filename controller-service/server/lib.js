import ddcci from "@hensm/ddcci";
import { monitors, MONITOR_INPUT_CODE } from "./data/monitors.js";

export function getInputSource(monitorId) {
    return ddcci._getVCP(monitorId, 0x60)[0];
}

export function setInputSource(monitorId, value) {
    ddcci._setVCP(monitorId, 0x60, value)
}

export function switchInput(monitorName, portName) {
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

export function fetchRealStatus() {
    try {
        ddcci._refresh();
        const rawMonitorIds = ddcci.getMonitorList();

        monitors.forEach(monitor => {
            monitor.monitorId = rawMonitorIds.find(id => id.includes(monitor.monitorIdKeyword));
            const currentInputCode = getInputSource(monitor.monitorId);
            monitor.inputs.forEach(input => {
                input.isActivated = (MONITOR_INPUT_CODE[input.portName] === currentInputCode);
            })
        })
    } catch (e) {
        // suck it up
    }
    setTimeout(fetchRealStatus, 500);
}
