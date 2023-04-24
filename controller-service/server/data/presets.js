import { switchInput } from "../lib.js";
import { MacbookPro, SuperComputer, monitors } from "./monitors.js";

function _switch(monitor, computerName) {
    switchInput(monitor.monitorName, monitor.inputs.find(input => input.computerName === computerName).portName);
}

function trigger(text, fn) {
    return { text, fn }
}

export const presets = {
    "Single monitor per computer": {
        "Macbook main":
            trigger("[SuperComputer] Macbook", () => {
                _switch(PRIMARY_MONITOR, SuperComputer);
                _switch(SECONDARY_MONITOR, MacbookPro);
            }),
        "SuperComputer main":
            trigger("[Macbook] SuperComputer", () => {
                _switch(PRIMARY_MONITOR, MacbookPro);
                _switch(SECONDARY_MONITOR, SuperComputer);
            }),
    },


    "All monitors for main computer": {
        "Macbook main":
            trigger("All Macbook", () => {
                _switch(PRIMARY_MONITOR, MacbookPro);
                _switch(SECONDARY_MONITOR, MacbookPro);
            }),
        "SuperComputer main":
            trigger("All SuperComputer", () => {
                _switch(PRIMARY_MONITOR, SuperComputer);
                _switch(SECONDARY_MONITOR, SuperComputer);
            }),
    },


    "Do nothing": {
    }
}

export const presetsSetting = {
    "Preset mode for USB switch": Object.keys(presets)[0], // key of `presets` object
}