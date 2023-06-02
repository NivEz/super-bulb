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

    useEffect(() => {
        ws.onopen = () => {
            sendMessage("connection")
        }
        ws.onmessage = ev => {
            const message = ev.data;
            console.log("-> message", message);
            messageHandler(message)
            switch (message) {
                case "connected":
                    setIsConnected(true)
                    break;
                case "connection_failed":
                    setIsConnected(false)
                    break;
                case "invalid_payload":
                    console.error("Invalid payload")
                    break;
            }
        }
    }, [ws])

    useEffect(() => {
        // Set initial bulb state
        if (isConnected) {
            // set state
        }
    }, [isConnected])

    return (
        <>
            <Button/>
            <Slider/>
        </>
    )
}
