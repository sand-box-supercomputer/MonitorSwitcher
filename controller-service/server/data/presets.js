import { switchInput } from "../lib.js";
import { MacbookPro, PRIMARY_MONITOR, SECONDARY_MONITOR, SuperComputer, monitors } from "./monitors.js";

function _switch(monitor, computerName) {
    switchInput(monitor.monitorName, monitor.inputs.find(input => input.computerName === computerName).portName);
}

function trigger(text, fn) {
    return { text, trigger: fn }
}

export const presets = {
    "Single monitor per computer": {
        "SuperComputer main":
            trigger("[SuperComputer] Macbook", () => {
                _switch(PRIMARY_MONITOR, SuperComputer);
                _switch(SECONDARY_MONITOR, MacbookPro);
            }),
        "Macbook main":
            trigger("[Macbook] SuperComputer", () => {
                _switch(PRIMARY_MONITOR, MacbookPro);
                _switch(SECONDARY_MONITOR, SuperComputer);
            }),
    },


    "All monitors for main computer": {
        "SuperComputer main":
            trigger("All SuperComputer", () => {
                _switch(PRIMARY_MONITOR, SuperComputer);
                _switch(SECONDARY_MONITOR, SuperComputer);
            }),
        "Macbook main":
            trigger("All Macbook", () => {
                _switch(PRIMARY_MONITOR, MacbookPro);
                _switch(SECONDARY_MONITOR, MacbookPro);
            }),
    },


    "Do nothing": {
    }
}

export const presetsSetting = {
    "Preset mode for USB switch": Object.keys(presets)[0], // key of `presets` object
}