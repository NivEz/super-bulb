import styles from "./switch.css"

export const Switch = ({isToggled, onChange}) => {
    return (
        <div className="switch__container">
            <input id="switch-shadow" className="switch switch--shadow" type="checkbox"
                   checked={isToggled}
                   onChange={() => {
                       onChange && onChange()
                   }
                   }/>
            <label htmlFor="switch-shadow"></label>
        </div>
    )
};
