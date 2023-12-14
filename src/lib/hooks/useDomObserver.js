/* eslint-disable react-hooks/exhaustive-deps */

import { useEffect } from "react";

// TODO: add unit tests is possible
export default function useDomObserver(element, ObserverClass, handler, deps) {
    useEffect(() => {
        console.count('useDomObserver');

        if (!element)
            return () => { };

        const observer = new ObserverClass(handler);
        observer.observe(element);

        return () => observer.disconnect();
    }, [element, ObserverClass, ...deps]);
}