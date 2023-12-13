import React, { createContext, useContext, useMemo, useRef } from "react";
import useDeepState from "../hooks/useDeepState";
import useEventListener from "../hooks/useEventListener";
import useDomObserver from "../hooks/useDomObserver";

const InteractionsContext = createContext();

function compareScrollOffsets(oldScrollOffset, newScrollOffset) {
    return oldScrollOffset.left === newScrollOffset.left && oldScrollOffset.top === newScrollOffset.top;
}

function compareMousePositions(oldMousePosition, newMousePosition) {
    return oldMousePosition?.x === newMousePosition?.x && oldMousePosition?.y === newMousePosition?.y;
}

function compareSizes(oldSize, newSize) {
    return oldSize.width === newSize.width && oldSize.height === newSize.height;
}

export function InteractionsProvider({ element, children }) {
    const interactions = useRef({});
    const [scrollOffset, setScrollOffset] = useDeepState({ left: 0, top: 0 }, compareScrollOffsets);
    const [mousePosition, setMousePosition] = useDeepState(null, compareMousePositions);
    const [size, setSize] = useDeepState({ width: 0, height: 0 }, compareSizes);

    useEventListener(element, 'scroll', () => {
        setScrollOffset({
            left: element.scrollLeft,
            top: element.scrollTop
        });
    }, [setScrollOffset]);

    useEventListener(element, 'mouseenter', (event) => {
        setMousePosition({
            x: event.clientX - element.offsetLeft,
            y: event.clientY - element.offsetTop
        });
    }, [setMousePosition]);

    useEventListener(element, 'mousemove', (event) => {
        setMousePosition({
            x: event.clientX - element.offsetLeft,
            y: event.clientY - element.offsetTop
        });
    }, [setMousePosition]);

    useEventListener(element, 'mouseleave', () => {
        setMousePosition(null);
    }, [setMousePosition]);

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
        mousePosition,
        size,
        interactions
    }), [mousePosition, scrollOffset, size]);

    return (
        <InteractionsContext.Provider value={value}>
            {children}
        </InteractionsContext.Provider>
    );
}

export function useInteraction(name, handler) {
    useContext(InteractionsContext).interactions.current[name] = handler;
}

export function useScrollOffset() {
    return useContext(InteractionsContext).scrollOffset;
}

export function useMousePosition() {
    return useContext(InteractionsContext).mousePosition;
}

export function useSize() {
    return useContext(InteractionsContext).size;
}