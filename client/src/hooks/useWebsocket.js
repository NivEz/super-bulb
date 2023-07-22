import { useCallback, useMemo, useState } from 'react';

export const useWebsocket = ({
    host,
    port,
}) => {
    const [reMemo, setReMemo] = useState(null);

    const ws = useMemo(() => new WebSocket(`ws://${host}:${port}`), [reMemo]);

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
