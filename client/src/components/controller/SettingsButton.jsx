import { Symbol } from "../symbol/Symbol";
import styles from "./controller.module.css";

export const SettingsButton = ({ isSettingsOpen, setIsSettingsOpen }) => {
    return (
        <span className={styles.settingsBtn}>
            <Symbol
                symbol={isSettingsOpen ? "✖️" : "⚙️"}
                color="black"
                opacity="0.8"
                fontSize="20px"
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                cursor="pointer"
                className={styles.settingsSymbol}
            />
        </span>
    )
}