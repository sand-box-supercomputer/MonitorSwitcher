import Button from "./Button"

export default function Monitor({ monitorName, inputs, onChangeInput }) {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <b>{monitorName}</b>
      </div>
      <div style={styles.inputSection}>
        {inputs.map(input => (
          <Button key={input.portName}
            isActivated={input.isActivated}
            onClick={() => onChangeInput(monitorName, input.portName)}>

            <b>{input.computerName}</b> ({input.portName})
          </Button>))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    aspectRatio: 16 / 9,
    border: "5px solid #888",
    borderBottom: "25px solid #888",
    borderRadius: "10px",
    margin: "30px",
    padding: "30px",
  },
  header: {
    fontSize: 30,
    paddingBottom: "30px",
    textAlign: "center",
  },
  inputSection: {
    bottom: "10px",
    flexGrow: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  button: {
    fontSize: "15px",
    cursor: "pointer",
    padding: "10px",
    margin: "10px",
  }
}