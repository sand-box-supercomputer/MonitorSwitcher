export const SuperComputer = "SuperComputer"
export const MacbookPro = "Macbook Pro"
export const DellLaptop = "DellLaptop"

export const monitorsSetting = {

}

export const monitors = [
  {
    monitorName: "Lenovo L32p-30",
    monitorIdKeyword: "LEN",
    monitorId: "",
    inputs: [
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
      {
        computerName: MacbookPro,
        portName: "HDMI1",
        isActivated: false,
      },
    ]
  },

  {
    monitorName: "Asus PG32UQ",
    monitorIdKeyword: "AUS",
    monitorId: "",
    inputs: [
      {
        computerName: SuperComputer,
        portName: "DP",
        isActivated: true,
      },
      {
        computerName: MacbookPro,
        portName: "HDMI2",
        isActivated: false,
      },
      {
        computerName: DellLaptop,
        portName: "HDMI1",
        isActivated: false,
      },
    ]
  },
]

export const PRIMARY_MONITOR = monitors[1]
export const SECONDARY_MONITOR = monitors[0]

/**
 * Constants
 */

export const MONITOR_INPUT_CODE = {
  DP: 15,
  HDMI1: 17,
  HDMI2: 18,
}
