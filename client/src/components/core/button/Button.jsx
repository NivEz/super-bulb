import React from 'react';
import styles from './button.module.css';

export const Button = ({ onClick, disabled, children }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={styles.button}
            style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
        >
            {children}
        </button>
    );
};
