export const SuperComputer = "SuperComputer"
export const MacbookPro = "Macbook Pro"
export const DellLaptop = "DellLaptop"

export const monitorsSetting = {

}

export const monitors = [
  {
    monitorName: "Lenovo L32p-30",
    monitorIdKeyword: "LEN66C9",
    monitorId: "",
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
    monitorName: "Asus PG32UQ",
    monitorIdKeyword: "#AUS32E1",
    monitorId: "",
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
    monitorName: "Lenovo L27p-20",
    monitorIdKeyword: "LEN61E9",
    monitorId: "",
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

export const PRIMARY_MONITOR = monitors[1]
export const SECONDARY_MONITOR_LEFT = monitors[0]
export const SECONDARY_MONITOR_RIGHT = monitors[2]

/**
 * Constants
 */

export const MONITOR_INPUT_CODE = {
  DP: 15,
  HDMI1: 17,
  HDMI2: 18,
  "USB-C": 49,
}
