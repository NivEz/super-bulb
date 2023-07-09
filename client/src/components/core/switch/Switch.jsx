import styles from "./switch.module.css"

export const Switch = ({isToggled, onChange, htmlId, disabled}) => {
    return (
        <>
            <input
                id={htmlId}
                className={`${styles.switch} ${styles.switchShadow}`}
                type="checkbox"
                checked={isToggled}
                onChange={() => {
                    onChange && onChange()
                }}
                disabled={disabled}
            />
            <label htmlFor={htmlId}></label>
        </>
    )
};
