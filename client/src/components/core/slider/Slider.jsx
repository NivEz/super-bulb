import React, {useEffect, useState} from 'react';
import {useThrottle} from "../../../hooks/useThrottle.js";


export const Slider = ({defaultValue, onChange, disabled, min = 1, max = 100, step = 1}) => {
    const [value, setValue] = useState(defaultValue || min);

    useEffect(() => {
        setValue(defaultValue)
    }, [defaultValue]);

    const throttleEventHandler = useThrottle({onChange});

    return (
        <input
            type='range'
            min={min}
            max={max}
            step={step}
            onChange={e => {
                const val = e.target.value;
                throttleEventHandler(val);
                setValue(val);
            }}
            value={value}
            style={{
                width: "65%",
                ...!disabled && {cursor: "pointer"}
            }}
            disabled={disabled}
        />
    );
};
