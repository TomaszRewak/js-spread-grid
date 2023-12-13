import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
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
    const [scrollOffset, setScrollOffset] = useDeepState({ left: 0, top: 0 }, compareScrollOffsets);
    const [mousePosition, setMousePosition] = useDeepState(null, compareMousePositions);
    const [size, setSize] = useDeepState({ width: 0, height: 0 }, compareSizes);
    const [events, setEvents] = useState([]);

    const popEvents = useCallback(number => setEvents(events => events.slice(number)), [setEvents]);

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

        setEvents(events => [...events, {
            type: 'mousedown',
            ctrlKey: event.ctrlKey
        }]);

        event.preventDefault();
        event.stopPropagation();
    }, [setEvents]);

    useEventListener(element, 'keydown', (event) => {
        setEvents(events => [...events, {
            type: 'keydown',
            key: event.key,
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey
        }]);

        event.preventDefault();
        event.stopPropagation();
    }, [setEvents]);

    const value = useMemo(() => ({
        scrollOffset,
        mousePosition,
        size,
        events,
        popEvents
    }), [popEvents, events, mousePosition, scrollOffset, size]);

    return (
        <InteractionsContext.Provider value={value}>
            {children}
        </InteractionsContext.Provider>
    );
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

export function useEvents() {
    return useContext(InteractionsContext).events;
}

export function usePopEvents() {
    return useContext(InteractionsContext).popEvents;
}