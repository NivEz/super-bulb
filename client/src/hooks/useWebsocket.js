import { useCallback, useMemo, useState } from 'react';

export const useWebsocket = ({
    host,
}) => {
    const [reMemo, setReMemo] = useState(null);

    const ws = useMemo(() => {
        const protocol = location.protocol === "https:" ? "wss" : "ws";
        return new WebSocket(`${protocol}://${host}`);
    }, [reMemo])

    const sendMessage = useCallback((commandType, commandValue = '') => {
        ws.send(`${commandType}!${commandValue}`);
    }, [ws, reMemo])

    const reConnectToWebsocket = () => {
        ws.close();
        // using timeout to ensure websocket is closed
        // before createing a new websocket instance.
        setTimeout(() => {
            setReMemo(!reMemo);
        }, 1000);
    };

    return { ws, sendMessage, reConnectToWebsocket };
};
