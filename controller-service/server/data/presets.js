import { switchInput } from "../lib.js";
import { MacbookPro, SuperComputer, monitors } from "./monitors.js";

function _switch(monitor, computerName) {
    switchInput(monitor.monitorName, monitor.inputs.find(input => input.computerName === computerName).portName);
}

export const presets = {
    "Single monitor per computer": {
        "Macbook main": {
            text: "[SuperComputer] Macbook",
            trigger: () => {
                _switch(monitors[0], MacbookPro);
                _switch(monitors[1], SuperComputer);
            }
        },
        "SuperComputer main": {
            text: "[Macbook] SuperComputer",
            trigger: () => {
                _switch(monitors[0], SuperComputer);
                _switch(monitors[1], MacbookPro);
            }
        },
    },
    "All monitors for main computer": {
        "Macbook main": {
            text: "All Macbook",
            trigger: () => {
                _switch(monitors[0], MacbookPro);
                _switch(monitors[1], MacbookPro);
            },
        },
        "SuperComputer main": {
            text: "All SuperComputer",
            trigger: () => {
                _switch(monitors[0], SuperComputer);
                _switch(monitors[1], SuperComputer);
            },
        },
    },
    "Do nothing": {
    }
}

export const presetsSetting = {
    "Preset mode for USB switch": Object.keys(presets)[0], // key of `presets` object
}