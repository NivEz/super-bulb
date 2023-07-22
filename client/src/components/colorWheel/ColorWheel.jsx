import React, { useRef, useMemo } from 'react';
import iro from '@jaames/iro';
import { useDidMount } from '../../hooks/useDidMount';
import {useThrottle} from "../../hooks/useThrottle.js";


export const ColorWheel = ({ onChange }) => {
	const didMount = useDidMount();
    const throttleEventHandler = useThrottle({onChange});

	const colorPickerRef = useRef(null);

	const colorPicker = useMemo(() => {
		// since we use the color picker ref (DOM element) we need to wait for mount
		if (!didMount) return;
		const colorPicker = new iro.ColorPicker(colorPickerRef.current, {
			layout: [
				{
					component: iro.ui.Wheel,
				},
			],
		});
		// Set color on picker change
		colorPicker.on('input:change', (input) => {
            throttleEventHandler(input.rgb);
		});
		return colorPicker;
	}, [didMount]);

	return <div ref={colorPickerRef} />;
};
