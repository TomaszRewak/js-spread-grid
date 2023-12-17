import { useCallback, useRef } from "react";

export default function useChangeCallback(currentValue, callback, comparator) {
    const ref = useRef({});

    ref.current.value = currentValue;
    ref.current.callback = callback;

    return useCallback((value) => {
        const newValue = typeof value === 'function'
            ? value(ref.current.value) 
            : value;

        const comparatorResult = ref.current.value === newValue || (comparator && comparator(ref.current.value, newValue));

        if (!comparatorResult)
        {
            ref.current.value = newValue;
            ref.current.callback(newValue);
        }
    }, [comparator]);
}