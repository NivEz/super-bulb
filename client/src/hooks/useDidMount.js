import { useState, useEffect } from 'react';

export const useDidMount = () => {
    const [didMount, setDidMount] = useState(false);

    // sets didMount to true after the first render
    useEffect(() => {
        setDidMount(true);
    }, []);

    return didMount;
};
