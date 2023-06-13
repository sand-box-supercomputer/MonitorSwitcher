import { switchInput } from "../lib.js";
import { DellLaptop, MacbookPro, PRIMARY_MONITOR, SECONDARY_MONITOR_LEFT, SECONDARY_MONITOR_RIGHT, SuperComputer, monitors } from "./monitors.js";

function _switch(monitor, computerName) {
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
        "SuperComputer main":
            trigger("SuperComputer & others", () => {
                _switch(PRIMARY_MONITOR, SuperComputer);
                _switch(SECONDARY_MONITOR_LEFT, MacbookPro);
                _switch(SECONDARY_MONITOR_RIGHT, DellLaptop);
            }),
        "Macbook main":
            trigger("Macbook & others", () => {
                _switch(PRIMARY_MONITOR, MacbookPro);
                _switch(SECONDARY_MONITOR_LEFT, SuperComputer);
                _switch(SECONDARY_MONITOR_RIGHT, DellLaptop);
            }),
        "DellLaptop main":
            trigger("DellLaptop & others", () => {
                _switch(PRIMARY_MONITOR, DellLaptop);
                _switch(SECONDARY_MONITOR_LEFT, MacbookPro);
                _switch(SECONDARY_MONITOR_RIGHT, SuperComputer);
            }),
    },


    "All monitors for main computer": {
        "SuperComputer main":
            trigger("All SuperComputer", () => {
                _switch(PRIMARY_MONITOR, SuperComputer);
                _switch(SECONDARY_MONITOR_LEFT, SuperComputer);
                _switch(SECONDARY_MONITOR_RIGHT, SuperComputer);
            }),
        "Macbook main":
            trigger("All Macbook", () => {
                _switch(PRIMARY_MONITOR, MacbookPro);
                _switch(SECONDARY_MONITOR_LEFT, MacbookPro);
            }),
        "DellLaptop main":
            trigger("All DellLaptop", () => {
                _switch(PRIMARY_MONITOR, DellLaptop);
                _switch(SECONDARY_MONITOR_RIGHT, DellLaptop);
            }),
    },


    "Do nothing": {
    }
}

export const presetsSetting = {
    "Preset mode for USB switch": Object.keys(presets)[0], // key of `presets` object
}