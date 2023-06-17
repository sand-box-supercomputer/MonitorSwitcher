import { switchInput } from "../lib.js";
import { DellLaptop, MONITOR_CENTER, MONITOR_LEFT, MONITOR_RIGHT, MacbookPro, SuperComputer, monitors } from "./monitors.js";

function _switch(monitorName, computerName) {
    const monitor = monitors.find(m => m.monitorName === monitorName);
    let portName = monitor.inputs.find(input => input.computerName === computerName)?.portName;
    if (!portName) {
        console.log("No port found for computer", computerName, "on monitor", monitor.monitorName);
        return;
    }
    switchInput(monitor.monitorName, portName);
}

function trigger(text, fn) {
    return { text, trigger: fn }
}

export const presets = {
    "Single monitor per computer": {
        [`${SuperComputer} main`]:
            trigger(`${SuperComputer} & others`, () => {
                _switch(MONITOR_CENTER, SuperComputer);
                _switch(MONITOR_LEFT, MacbookPro);
                _switch(MONITOR_RIGHT, DellLaptop);
            }),
        [`${MacbookPro} main`]:
            trigger(`${MacbookPro} & others`, () => {
                _switch(MONITOR_CENTER, MacbookPro);
                _switch(MONITOR_LEFT, SuperComputer);
                _switch(MONITOR_RIGHT, DellLaptop);
            }),
        [`${DellLaptop} main`]:
            trigger(`${DellLaptop} & others`, () => {
                _switch(MONITOR_CENTER, DellLaptop);
                _switch(MONITOR_LEFT, MacbookPro);
                _switch(MONITOR_RIGHT, SuperComputer);
            }),
    },


    "All monitors for main computer": {
        [`${SuperComputer} main`]:
            trigger(`All ${SuperComputer}`, () => {
                _switch(MONITOR_CENTER, SuperComputer);
                _switch(MONITOR_LEFT, SuperComputer);
                _switch(MONITOR_RIGHT, SuperComputer);
            }),
        [`${MacbookPro} main`]:
            trigger(`All ${MacbookPro}`, () => {
                _switch(MONITOR_CENTER, MacbookPro);
                _switch(MONITOR_LEFT, MacbookPro);
            }),
        [`${DellLaptop} main`]:
            trigger(`All ${DellLaptop}`, () => {
                _switch(MONITOR_CENTER, DellLaptop);
                _switch(MONITOR_RIGHT, DellLaptop);
            }),
    },


    "Do nothing": {
    }
}

export const presetsSetting = {
    "Preset mode for USB switch": Object.keys(presets)[0], // key of `presets` object
}