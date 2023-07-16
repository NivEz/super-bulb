import { useState } from "react";
import { TextInput } from "../core/textInput/TextInput";
import styles from "./credentials.module.css";
import { Button } from "../core/button/Button";

export const Credentials = ({ connect }) => {
    const [wsHost, setWsHost] = useState("localhost");
    const [ip, setIp] = useState("");
    const [ssid, setSsid] = useState("");
    const [wifiPassword, setWifiPassword] = useState("");
    return (
        <form>
            <label className={styles.formLabel}>Websocket host</label>
            <TextInput value={wsHost} onChange={setWsHost} />
            <label className={styles.formLabel}>Bulb IP</label>
            <TextInput value={ip} onChange={setIp} />
            <label className={styles.formLabel}>SSID</label>
            <TextInput value={ssid} onChange={setSsid} />
            <label className={styles.formLabel}>Wifi password</label>
            <TextInput value={wifiPassword} onChange={setWifiPassword} censored={true} />
            <div>
                <br />
                <Button onClick={connect} disabled={!wsHost || !ip}>Connect</Button>
            </div>
        </form>
    )
};