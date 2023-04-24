import { css } from "@emotion/css"

export default function Button({ children, onClick, isActivated }) {
  return (
    <button className={styles.button(isActivated)} onClick={onClick}>
      {children}
    </button>
  );
};

const styles = {
  button: (isActivated) => css`
    font-size: 16px;
    padding: 8px 16px;
    border: 1px solid black;
    background-color: ${isActivated ? '#00c853' : '#f2f2f2'};
    color: #333;
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;
    margin: 10px;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
    }
  `,
};
