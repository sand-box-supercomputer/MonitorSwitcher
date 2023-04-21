import React from 'react';
import { css } from '@emotion/css';

export default function BooleanSetting({ label, value, onChange }) {

  const handleToggle = () => {
    const newValue = !value;
    onChange && onChange(newValue);
  };

  return (
    <div className={styles.container}>
      <span className={styles.label}>{label}</span>
      <div className={styles.toggle}>
        <button
          className={styles.toggleButton + (value ? ` ${styles.active}` : '')}
          onClick={handleToggle}
        >
          True
        </button>
        <button
          className={styles.toggleButton + (!value ? ` ${styles.active}` : '')}
          onClick={handleToggle}
        >
          False
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: css`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
  `,
  label: css`
    font-size: 16px;
    margin-right: 16px;
  `,
  toggle: css`
    display: flex;
    border: 1px solid black;
    border-radius: 20px;
    overflow: hidden;
  `,
  toggleButton: css`
    flex: 1;
    font-size: 16px;
    font-weight: bold;
    padding: 8px 16px;
    border: none;
    background-color: #f2f2f2;
    color: #333;
    transition: background-color 0.3s ease, color 0.3s ease;
    cursor: pointer;

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
    }
  `,
  active: css`
    background-color: #0077ff;
    color: #fff;
  `,
};