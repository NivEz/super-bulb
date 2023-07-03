import {useCallback, useEffect, useState} from "react";
import {Slider} from "../core/slider/Slider.jsx";
import {Switch} from "../core/switch/Switch.jsx";
import {useWebsocket} from "../../hooks/useWebsocket.js";
import {useAudioAnalyzer} from "../../hooks/useAudioAnalyzer.js";
import {Flex} from "../core/flex/Flex";
import {Symbol} from "../symbol/Symbol";
import styles from "./controller.module.css";

// const host = process.env.IP || 'localhost';
const host = 'localhost';
const port = 6543;
const reConnectTimeout = 1000;

export const Controller = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [power, setPower] = useState(0);
    const [brightness, setBrightness] = useState(1);
    const [isInteractive, setIsInteractive] = useState(false);

    const {ws, sendMessage} = useWebsocket({host, port, reConnectTimeout})

    useEffect(() => {
        ws.onopen = () => {
            sendMessage("connect")
        }
        ws.onmessage = ev => {
            const msg = ev.data;
            if (msg === "connected") {
                // TODO - optimize - instead of set state send ws message
                setIsConnected(true)
            }
            if (msg.startsWith("{")) {
                // message is in json format - the only json format message is the state data
                const state = JSON.parse(msg);
                console.log("-> state", state);
                setPower(state.pwr);
                setBrightness(state.brightness);
                // setBulbState(state)
            }
        }
        ws.onerror = () => {

        }
        ws.onclose = () => {

        }
    }, [ws]);

    useEffect(() => {
        // Set initial bulb state
        if (isConnected) {
            sendMessage("state")
        }
    }, [isConnected]);

    const handlePowerSwitch = useCallback(() => {
        const newPower = !!power ? 0 : 1
        setPower(newPower)
        sendMessage("power", newPower)
    }, [power]);

    const handleBrightness = useCallback(val => {
        setBrightness(val);
        sendMessage("brightness", val);
    }, []);

    useAudioAnalyzer({isActive: isInteractive, handleBrightness});

    if (!isConnected) {
        return;
    }

    return (
        <section className={styles.controllerContainer}>
            <Flex label="Power">
                <Switch
                    isToggled={!!power}
                    onChange={handlePowerSwitch}
                    htmlId="power-switch-shadow"
                />
            </Flex>
            <Flex>
                <Symbol symbol="🔆" color="grey"/>
                <Slider defaultValue={brightness} onChange={handleBrightness} disabled={!power}/>
                <Symbol symbol="🔆" color="#ffb02e"/>
            </Flex>
            <Flex label="Interactive">
                <Switch
                    isToggled={isInteractive}
                    onChange={() => setIsInteractive(!isInteractive)}
                    htmlId="interactive-switch-shadow"/>
            </Flex>
        </section>
    )
}
