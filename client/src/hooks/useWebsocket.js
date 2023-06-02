import {useCallback, useMemo, useState} from 'react';

export const useWebsocket = ({
                                 host,
                                 port,
                                 reConnectTimeout,
                             }) => {
    const [reMemoNum, setReMemoNum] = useState(0);

    const ws = useMemo(() => new WebSocket(`ws://${host}:${port}`), [reMemoNum]);

    const sendMessage = useCallback((commandType, commandValue = '') => {
        return `${commandType}!${commandValue}`
    }, [ws])

    const reConnectToWebsocket = () => {
        setTimeout(() => {
            setReMemoNum(reMemoNum + 1);
        }, reConnectTimeout);
    };

    return {ws, sendMessage, reConnectToWebsocket};
};
