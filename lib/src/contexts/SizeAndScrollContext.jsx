import React, { createContext, useContext, useMemo } from "react";
import useDeepState from "../hooks/useDeepState";
import useEventListener from "../hooks/useEventListener";
import useDomObserver from "../hooks/useDomObserver";

const SizeAndScrollContext = createContext();

function compareScrollOffsets(oldScrollOffset, newScrollOffset) {
    return oldScrollOffset.left === newScrollOffset.left && oldScrollOffset.top === newScrollOffset.top;
}

function compareSizes(oldSize, newSize) {
    return oldSize.width === newSize.width && oldSize.height === newSize.height;
}

export function SizeAndScrollProvider({ element, children }) {
    const [scrollOffset, setScrollOffset] = useDeepState({ left: 0, top: 0 }, compareScrollOffsets);
    const [size, setSize] = useDeepState({ width: 0, height: 0 }, compareSizes);

    useEventListener(element, 'scroll', () => {
        setScrollOffset({
            left: element.scrollLeft,
            top: element.scrollTop
        });
    }, [setScrollOffset]);

    useDomObserver(element, ResizeObserver, () => {
        setSize({
            width: element.getBoundingClientRect().width,
            height: element.getBoundingClientRect().height
        });
    }, [setSize]);

    const value = useMemo(() => ({
        scrollOffset,
        size
    }), [scrollOffset, size]);

    return (
        <SizeAndScrollContext.Provider value={value}>
            {children}
        </SizeAndScrollContext.Provider>
    );
}

export const useScrollOffset = () => useContext(SizeAndScrollContext).scrollOffset;
export const useSize = () => useContext(SizeAndScrollContext).size;