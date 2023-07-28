import { useCallback, useEffect, useState } from "react";
import { Slider } from "../core/slider/Slider.jsx";
import { Switch } from "../core/switch/Switch.jsx";
import { ColorWheel } from "../colorWheel/ColorWheel.jsx";
import { useWebsocket } from "../../hooks/useWebsocket.js";
import { useAudioAnalyzer } from "../../hooks/useAudioAnalyzer.js";
import { Flex } from "../core/flex/Flex";
import { Symbol } from "../symbol/Symbol";
import styles from "./controller.module.css";
import { Credentials } from "../credentials/Credentials.jsx";
import { useLocalStorage } from "../../hooks/useLocalStorage.js";
import { SettingsButton } from "./SettingsButton.jsx";

const port = 6543;

const defaultCredentials = JSON.stringify({
    wsHost: 'localhost',
});

export const Controller = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [power, setPower] = useState(0);
    const [brightness, setBrightness] = useState(1);
    const [isInteractive, setIsInteractive] = useState(false);
    const [transitionDuration, setTransitionDuration] = useState(500);
    const [isColorMode, setIsColorMode] = useState(false);
    const [credentials, setCredentials] = useLocalStorage("credentials", defaultCredentials);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const { ws, sendMessage, reConnectToWebsocket } = useWebsocket({ host: credentials.wsHost, port });

    useEffect(() => {
        ws.onopen = () => {
            const credsCopy = { ...credentials };
            delete credsCopy.wsHost;
            const payload = Object.values(credsCopy).join("-");
            sendMessage("connect", payload);
        }
        ws.onmessage = ev => {
            const msg = ev.data;
            if (msg === "connected") {
                alert("Connected")
                setIsConnected(true);
                sendMessage("state");
            } else if (msg === "connection_failed") {
                alert("Connection failed");
            }
            if (msg.startsWith("{")) {
                // message is in json format - the only json format message is the state data
                const state = JSON.parse(msg);
                setPower(state.pwr);
                setBrightness(Number(state.brightness));
                setTransitionDuration(state.transitionduration);
                setIsColorMode(state.bulb_colormode === 0 ? true : false);
            }
        }
        ws.onerror = (err) => {
            alert("Websocket error");
            console.error(err);
        }
        ws.onclose = () => {
            if (isConnected) {
                alert("Disconnected");
            }
            setIsConnected(false);
            setPower(0);
        }
    }, [ws]);

    const handlePowerSwitch = useCallback(() => {
        const newPower = !!power ? 0 : 1;
        setPower(newPower);
        sendMessage("power", newPower);
    }, [power, sendMessage]);

    const handleBrightness = useCallback(val => {
        setBrightness(Number(val));
        sendMessage("brightness", val);
    }, [sendMessage]);

    const handleTransitionDurationChange = useCallback(val => {
        setTransitionDuration(val);
        sendMessage("transition_duration", val);
    }, [sendMessage]);

    const handleColorMode = useCallback(val => {
        setIsColorMode(val);
        sendMessage("colormode", val ? 0 : 1);
    }, [sendMessage]);

    const handleConnect = (creds = { wsHost, bulbIp, ssid, wifiPassword }) => {
        setCredentials(creds);
        reConnectToWebsocket();
    };

    useAudioAnalyzer({ isActive: isInteractive, handleBrightness });

    return (
        <section className={`${styles.controllerContainer} ${!isConnected && styles.cursorWait}`}>
            <SettingsButton isSettingsOpen={isSettingsOpen} setIsSettingsOpen={setIsSettingsOpen} />
            <div className={isSettingsOpen ? styles.fadeIn : styles.settingsFadeOut}>
                <Credentials
                    connect={handleConnect}
                    defaultWsHost={credentials.wsHost}
                    defaultIp={credentials.bulbIp}
                    defaultSsid={credentials.ssid}
                />
            </div>
            <div className={isSettingsOpen ? styles.controllerFadeOut : styles.fadeIn}>
                <Flex label="Power">
                    <Switch
                        isToggled={!!power}
                        onChange={handlePowerSwitch}
                        htmlId="power-switch-shadow"
                        disabled={!isConnected}
                    />
                </Flex>
                <Flex>
                    <Symbol symbol="🔆" color="grey" />
                    <Slider defaultValue={brightness} onChange={handleBrightness} disabled={!power} />
                    <Symbol symbol="🔆" color="#ffb02e" />
                </Flex>
                <Flex label="Interactive">
                    <Switch
                        isToggled={isInteractive}
                        onChange={() => setIsInteractive(!isInteractive)}
                        htmlId="interactive-switch-shadow"
                        disabled={!power}
                    />
                </Flex>
                <Flex label="Transition">
                    <Slider
                        defaultValue={transitionDuration}
                        onChange={handleTransitionDurationChange}
                        min={0}
                        max={1500}
                        disabled={!power}
                    />
                    {<span>{isConnected && transitionDuration}</span>}
                </Flex>
                <Flex label="Color mode">
                    <Switch
                        isToggled={isColorMode}
                        onChange={() => handleColorMode(!isColorMode)}
                        htmlId="colormode-switch-shadow"
                        disabled={!power}
                    />
                </Flex>
                {(isColorMode && power) ? <ColorWheel onChange={rgb => sendMessage("color", Object.values(rgb).join("-"))} /> : null}
            </div>
        </section>
    )
}
