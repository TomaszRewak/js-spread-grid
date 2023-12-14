/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";

// TODO: add unit tests
export default function useEventListener(element, eventName, handler, deps) {
    useEffect(() => {
        if (!element)
            return () => { };

        element.addEventListener(eventName, handler);

        return () => element.removeEventListener(eventName, handler);
    }, [element, eventName, ...deps]);
}