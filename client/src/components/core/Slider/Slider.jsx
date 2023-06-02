import React from 'react';

export const Slider = ({defaultValue, onChange, disabled, min = 1, max = 100}) => {
    return (
        <input
            type='range'
            min={min}
            max={max}
            onMouseUp={e => onChange && onChange(e.target.value)}
            defaultValue={defaultValue}
            style={{
                width: "75%",
                ...!disabled && {cursor: "pointer"}
            }}
            disabled={disabled}
        />
    );
};
