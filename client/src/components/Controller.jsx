import {useCallback, useEffect, useState} from "react";
import {Slider} from "./core/Slider/Slider.jsx";
import {Switch} from "./core/switch/Switch.jsx";
import {useWebsocket} from "../hooks/useWebsocket.js";

// const host = process.env.IP || 'localhost';
const host = 'localhost';
const port = 6543;
const reConnectTimeout = 1000;

export const Controller = () => {
    const [isConnected, setIsConnected] = useState(false);
    const [bulbState, setBulbState] = useState(null);
    const [power, setPower] = useState(0);
    const [brightness, setBrightness] = useState(1);

    const {ws, sendMessage} = useWebsocket({host, port, reConnectTimeout,})
    // console.log("-> ws", ws);

    useEffect(() => {
        ws.onopen = () => {
            sendMessage("connect")
        }
        ws.onmessage = ev => {
            const msg = ev.data;
            if (msg === "connected") {
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
    }, [ws])

    useEffect(() => {
        // Set initial bulb state
        if (isConnected) {
            sendMessage("state")
        }
    }, [isConnected])

    const handlePowerSwitch = useCallback(() => {
        const newPower = !!power ? 0 : 1
        setPower(newPower)
        sendMessage("power", newPower)
    }, [power])

    const handleBrightness = useCallback(val => {
        setBrightness(val)
        sendMessage("brightness", val)
    }, [brightness])

    if (!isConnected) {
        return;
    }

    return (
        <section>
            <Switch isToggled={!!power} onChange={handlePowerSwitch}/>
            <Slider defaultValue={brightness} onChange={handleBrightness} disabled={!power}/>
        </section>
    )
}
