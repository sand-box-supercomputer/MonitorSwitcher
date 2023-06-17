// Computers
export const SuperComputer = "SuperComputer"
export const MacbookPro = "MacbookPro"
export const DellLaptop = "DellLaptop"

// Monitors
export const MONITOR_LEFT = "Lenovo L32p-30";
export const MONITOR_CENTER = "Asus PG32UQ";
export const MONITOR_RIGHT = "Lenovo P27h-20";

export const monitorsSetting = {

}

export const monitors = [
  {
    monitorName: MONITOR_LEFT,
    monitorIdKeyword: "LEN66C9",
    monitorId: "",
    volume: -1,
    volumeBeforeMute: -1,
    isMuted: true,
    inputs: [
      {
        computerName: MacbookPro,
        portName: "HDMI1",
        isActivated: false,
      },
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
    ]
  },

  {
    monitorName: MONITOR_CENTER,
    monitorIdKeyword: "#AUS32E1",
    monitorId: "",
    volume: -1,
    volumeBeforeMute: -1,
    isMuted: true,
    inputs: [
      {
        computerName: MacbookPro,
        portName: "HDMI2",
        isActivated: false,
      },
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
      {
        computerName: DellLaptop,
        portName: "HDMI1",
        isActivated: false,
      },
    ]
  },

  {
    monitorName: MONITOR_RIGHT,
    monitorIdKeyword: "LEN61E9",
    monitorId: "",
    volume: -1,
    volumeBeforeMute: -1,
    isMuted: true,
    inputs: [
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
      {
        computerName: DellLaptop,
        portName: "USB-C",
        isActivated: false,
      },
    ]
  },
]

/**
 * Constants
 */

export const MONITOR_INPUT_CODE = {
  DP: 15,
  HDMI1: 17,
  HDMI2: 18,
  "USB-C": 49,
}
