import { css } from "@emotion/css"
import { Button as AntButton } from "antd"

export default function Button({ children, onClick, isActivated }) {
  return (
    <AntButton
      type={isActivated ? "primary" : "default"}
      onClick={onClick}
      style={styles.antButton} size="large"
    >
      {children}
    </AntButton >
  );
};

const styles = {
  antButton: {
    fontSize: "16px",
    margin: "10px",
  }
};
