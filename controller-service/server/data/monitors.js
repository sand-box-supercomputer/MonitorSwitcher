export const SuperComputer = "SuperComputer"
export const MacbookPro = "Macbook Pro"

export const monitorsSetting = {

}

export const monitors = [
  {
    monitorName: "Lenovo L32p-30",
    monitorIdKeyword: "LEN",
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
    monitorName: "ASUS PG32UQ",
    monitorIdKeyword: "AUS",
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
