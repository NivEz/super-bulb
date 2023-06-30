import {useMemo} from "react";
import {throttle} from "../../utils/throttle.js";

export const useThrottle = ({onChange, delay = 200}) => {
    const throttleEventHandler = useMemo(() => throttle(onChange, delay), []);
    return throttleEventHandler;
}
