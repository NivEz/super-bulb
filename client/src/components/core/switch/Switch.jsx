import styles from "./switch.css"

export const Switch = ({isToggled, onChange, htmlId}) => {
    return (
        <div className="switch__container">
            <input id={htmlId} className="switch switch--shadow" type="checkbox"
                   checked={isToggled}
                   onChange={() => {
                       onChange && onChange()
                   }
                   }/>
            <label htmlFor={htmlId}></label>
        </div>
    )
};
