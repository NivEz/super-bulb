import { useState } from "react";
import { TextInput } from "../core/textInput/TextInput";
import styles from "./credentials.module.css";
import { Button } from "../core/button/Button";

export const Credentials = ({ connect, defaultWsHost, defaultIp, defaultSsid }) => {
    const [wsHost, setWsHost] = useState(defaultWsHost);
    const [bulbIp, setBulbIp] = useState(defaultIp);
    const [ssid, setSsid] = useState(defaultSsid);
    const [wifiPassword, setWifiPassword] = useState("");
    return (
        <form>
            <label className={styles.formLabel}>Websocket host & port</label>
            <TextInput value={wsHost} onChange={setWsHost} />
            <label className={styles.formLabel}>Bulb IP</label>
            <TextInput value={bulbIp} onChange={setBulbIp} />
            <label className={styles.formLabel}>SSID</label>
            <TextInput value={ssid} onChange={setSsid} />
            <label className={styles.formLabel}>Wifi password</label>
            <TextInput value={wifiPassword} onChange={setWifiPassword} censored={true} />
            <div>
                <br />
                <Button onClick={e => {
                    e.preventDefault();
                    connect({ wsHost, bulbIp, ssid, wifiPassword });
                }} disabled={!wsHost || !bulbIp}>Connect</Button>
            </div>
        </form>
    )
};