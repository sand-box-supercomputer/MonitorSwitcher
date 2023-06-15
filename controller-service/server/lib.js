import ddcci from "@hensm/ddcci";
import { monitors, MONITOR_INPUT_CODE } from "./data/monitors.js";

export function getInputSource(monitorId) {
    return ddcci._getVCP(monitorId, 0x60)[0];
}

export function setInputSource(monitorId, value) {
    ddcci._setVCP(monitorId, 0x60, value)
}

export function getVolume(monitorId) {
    return ddcci._getVCP(monitorId, 0x62)[0];
}

export function setVolume(monitorId, value) {
    ddcci._setVCP(monitorId, 0x62, value)
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

export function changeVolume(monitorName, value, addedValue) {
    monitors.forEach(m => {
        if (m.monitorName === monitorName) {
            if (value !== undefined) {
                m.volume = value;
            }
            if (addedValue !== undefined) {
                if (m.isMuted) {
                    m.isMuted = false;
                    m.volume = m.volumeBeforeMute;
                }
                m.volume += addedValue;
                m.volume = Math.max(0, Math.min(100, m.volume));
            }
            m.volumeBeforeMute = m.volume;
            m.isMuted = (m.volume === 0);
            setVolume(m.monitorId, m.volume);
        }
    })
}

export function changeMuteMonitor(monitorName, isMuted) {
    monitors.forEach(m => {
        if (m.monitorName === monitorName) {
            m.isMuted = isMuted;
            m.volume = m.isMuted ? 0 : m.volumeBeforeMute;
            setVolume(m.monitorId, m.volume);
        }
    })
}

export function toggleMuteMonitor(monitorName) {
    monitors.forEach(m => {
        if (m.monitorName === monitorName) {
            m.isMuted = !m.isMuted;
            m.volume = m.isMuted ? 0 : m.volumeBeforeMute;
            setVolume(m.monitorId, m.volume);
        }
    })
}


export function syncRealStatus() {
    try {
        ddcci._refresh();
        const rawMonitorIds = ddcci.getMonitorList();

        monitors.forEach(monitor => {
            monitor.monitorId = rawMonitorIds.find(id => id.includes(monitor.monitorIdKeyword));
            try {
                const currentInputCode = getInputSource(monitor.monitorId);
                monitor.inputs.forEach(input => {
                    input.isActivated = (MONITOR_INPUT_CODE[input.portName] === currentInputCode);
                })
            } catch (e) {
                // suck it up
            }
            try {
                monitor.volume = getVolume(monitor.monitorId);
                monitor.isMuted = (monitor.volume === 0);
                if (monitor.volume > 0) {
                    monitor.volumeBeforeMute = monitor.volume;
                }
            } catch (e) {
                // suck it up
            }
        })
    } catch (e) {
        // suck it up
    }
    setTimeout(syncRealStatus, 500);
}
