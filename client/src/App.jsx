import {useEffect, useState} from 'react'
import './App.css'
import {Controller} from "./components/controller/Controller.jsx";

function App() {
    const [didMount, setDidMount] = useState(null);
    const [ws, setWs] = useState(null)

    useEffect(() => {
        setDidMount(true)
    }, [])

    // useEffect(() => {
    //     if (!didMount) {
    //         return;
    //     }
    //     console.log("Initialize websocket connection...");
    //     const ws = new WebSocket(`ws://localhost:6543`)
    //     setWs(ws)
    //     ws.onopen = (e => {
    //         ws.send("connect");
    //     })
    //     ws.onclose = () => {
    //         console.log("WS closed...")
    //     }
    // }, [didMount])

    const sendMessages = () => {
        // ws.send("power!1")
        // ws.send("color!100-20-150")
        // ws.send("colormode!1")
        return
        new Array(5).fill(null).forEach(() => {
            ws.send("power!1")
        })
        console.log("-> ws", ws);
    }

    return (
        <>
            <h1>Smart bulb</h1>
            <Controller />
        </>
    )
}

export default App
