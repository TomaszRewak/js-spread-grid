import React, { createContext, useContext, useMemo, useRef } from "react";
import useDeepState from "../hooks/useDeepState";
import useEventListener from "../hooks/useEventListener";
import useDomObserver from "../hooks/useDomObserver";

const InteractionsContext = createContext();

function compareScrollOffsets(oldScrollOffset, newScrollOffset) {
    return oldScrollOffset.left === newScrollOffset.left && oldScrollOffset.top === newScrollOffset.top;
}

function compareSizes(oldSize, newSize) {
    return oldSize.width === newSize.width && oldSize.height === newSize.height;
}

export function InteractionsProvider({ element, children }) {
    const interactions = useRef({});
    const [scrollOffset, setScrollOffset] = useDeepState({ left: 0, top: 0 }, compareScrollOffsets);
    const [size, setSize] = useDeepState({ width: 0, height: 0 }, compareSizes);

    useEventListener(element, 'scroll', () => {
        setScrollOffset({
            left: element.scrollLeft,
            top: element.scrollTop
        });
    }, [setScrollOffset]);

    useEventListener(element, 'mouseenter', (event) => {
        if (interactions.current.mousemove)
            interactions.current.mousemove({
                x: event.clientX - element.offsetLeft,
                y: event.clientY - element.offsetTop
            });
    }, []);

    useEventListener(element, 'mousemove', (event) => {
        if (interactions.current.mousemove)
            interactions.current.mousemove({
                x: event.clientX - element.offsetLeft,
                y: event.clientY - element.offsetTop
            });
    }, []);

    useEventListener(element, 'mouseleave', () => {
        if (interactions.current.mousemove)
            interactions.current.mousemove(null);
    }, []);

    useDomObserver(element, ResizeObserver, () => {
        setSize({
            width: element.clientWidth,
            height: element.clientHeight
        });
    }, [setSize]);

    useEventListener(element, 'mousedown', (event) => {
        element.focus();

        if (interactions.current.mousedown)
            interactions.current.mousedown(event);

        event.preventDefault();
        event.stopPropagation();
    }, []);

    useEventListener(element, 'mouseup', (event) => {
        if (interactions.current.mouseup)
            interactions.current.mouseup(event);

        event.preventDefault();
        event.stopPropagation();
    }, []);

    useEventListener(element, 'keydown', (event) => {
        if (interactions.current.keydown)
            interactions.current.keydown(event);

        event.preventDefault();
        event.stopPropagation();
    }, []);

    const value = useMemo(() => ({
        scrollOffset,
        size,
        interactions
    }), [scrollOffset, size]);

    return (
        <InteractionsContext.Provider value={value}>
            {children}
        </InteractionsContext.Provider>
    );
}

export function useInteraction(name, handler) {
    useContext(InteractionsContext).interactions.current[name] = handler;
}

export const useScrollOffset = () => useContext(InteractionsContext).scrollOffset;
export const useMousePosition = () => useContext(InteractionsContext).mousePosition;
export const useSize = () => useContext(InteractionsContext).size;