import { DellLaptop, MONITOR_CENTER, MONITOR_LEFT, MONITOR_RIGHT, MacbookPro, SuperComputer } from "./monitors.js";

export const COMPUTER_CONFIG = {
    "Huy Pham@SuperComputer": {
        COMPUTER_NAME: SuperComputer,
        CONTROL_SERVER_URL: "https://monitor.quangdel.com",
        USB_VID_PID: "3787:8297",
        AUDIO_MONITOR_PRIORITY: [MONITOR_CENTER, MONITOR_LEFT, MONITOR_RIGHT],
        MONITOR_SPEAKER_MAP: {
            [MONITOR_CENTER]: {
                notMuted: "ASUS PG32UQ",
                muted: "Speakers",
            },
            [MONITOR_LEFT]: {
                notMuted: "L32p-30",
                muted: "L32p-30",
            },
            [MONITOR_RIGHT]: {
                notMuted: "P27h-20",
                muted: "P27h-20",
            },
        },
    },
    "huy.pham@Dell-Laptop": {
        COMPUTER_NAME: DellLaptop,
        CONTROL_SERVER_URL: "https://monitor.quangdel.com",
        USB_VID_PID: "3787:8297",
        AUDIO_MONITOR_PRIORITY: [MONITOR_CENTER, MONITOR_RIGHT],
        MONITOR_SPEAKER_MAP: {
            [MONITOR_CENTER]: {
                notMuted: "ASUS PG32UQ",
                muted: "Speakers",
            },
            [MONITOR_RIGHT]: {
                notMuted: "P27h-20",
                muted: "P27h-20",
            },
        },
    },
    "pqhuy@3c22fbe466a9": {
        COMPUTER_NAME: MacbookPro,
        CONTROL_SERVER_URL: "https://monitor.quangdel.com",
        USB_VID_PID: "3787:8297",
        AUDIO_MONITOR_PRIORITY: [MONITOR_CENTER, MONITOR_LEFT],
        MONITOR_SPEAKER_MAP: {
            [MONITOR_CENTER]: {
                notMuted: "ASUS PG32UQ",
                muted: "JBL Quantum810 Wireless Game",
            },
            [MONITOR_LEFT]: {
                notMuted: "L32p-30",
                muted: "L32p-30",
            },
        },
    },
}
COMPUTER_CONFIG["Sandbox@DESKTOP-BADROU1"] = COMPUTER_CONFIG["Huy Pham@SuperComputer"];

export function getComputerName(id) {
    return COMPUTER_CONFIG[id]?.COMPUTER_NAME;
}