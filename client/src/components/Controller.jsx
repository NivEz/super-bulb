import {useEffect, useState} from "react";
import {Button} from "./core/Button.jsx";
import {Slider} from "./core/Slider.jsx";
import {Icon} from "./core/Icon.jsx";
import {useWebsocket} from "../hooks/useWebsocket.js";
import {messageHandler} from "../../utils/messageHandler.js";

// const host = process.env.IP || 'localhost';
const host = 'localhost';
const port = 6543;
const reConnectTimeout = 1000;

export const Controller = () => {
    const [isConnected, setIsConnected] = useState(false);

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
                // message is in json format
                console.log((JSON.parse(msg)))
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

    return (
        <>
            <Button/>
            <Slider/>
        </>
    )
}
