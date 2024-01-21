import { useState, useEffect } from 'react';

export default function useThrottled(value) {
    const [throttledValue, setThrottledValue] = useState(value);

    useEffect(() => {
        const frame = requestAnimationFrame(() => {
            setThrottledValue(value);
        });

        return () => cancelAnimationFrame(frame);
    }, [value]);

    return throttledValue;
}