import React, {useMemo} from 'react';
import {throttle} from "../../../../utils/throttle";


export const Slider = ({defaultValue, onChange, disabled, min = 1, max = 100}) => {
    const throttleEventHandler = useMemo(() => throttle(onChange, 250), []);

    return (
        <input
            type='range'
            min={min}
            max={max}
            onChange={e => throttleEventHandler(e.target.value)}
            defaultValue={defaultValue}
            style={{
                width: "75%",
                ...!disabled && {cursor: "pointer"}
            }}
            disabled={disabled}
        />
    );
};
