import React, { createContext, useContext, useMemo, useRef } from "react";
import useDeepState from "../hooks/useDeepState";
import useEventListener from "../hooks/useEventListener";

const MouseAndKeyboardContext = createContext();

function compareMousePositions(oldMousePosition, newMousePosition) {
    return oldMousePosition?.x === newMousePosition?.x && oldMousePosition?.y === newMousePosition?.y;
}

export function MouseAndKeyboardProvider({ element, children }) {
    const interactions = useRef({});
    const [mousePosition, setMousePosition] = useDeepState(null, compareMousePositions);
    const [isMouseDown, setIsMouseDown] = useDeepState(false);

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

    useEventListener(element, 'mousedown', (event) => {
        setIsMouseDown(true);

        if (interactions.current.mousedown)
            interactions.current.mousedown(event);
    }, []);

    useEventListener(element, 'mouseup', (event) => {
        setIsMouseDown(false);

        if (interactions.current.mouseup)
            interactions.current.mouseup(event);
    }, []);

    useEventListener(element, 'keydown', (event) => {
        if (interactions.current.keydown)
            interactions.current.keydown(event);
    }, []);

    useEventListener(element, 'click', (event) => {
        if (interactions.current.click)
            interactions.current.click(event);
    }, []);

    useEventListener(element, 'dblclick', (event) => {
        if (interactions.current.dblclick)
            interactions.current.dblclick(event);
    }, []);

    useEventListener(element, 'focus', (event) => {
        if (interactions.current.focus)
            interactions.current.focus(event);
    }, []);

    const value = useMemo(() => ({
        mousePosition,
        isMouseDown,
        interactions
    }), [mousePosition, isMouseDown]);

    return (
        <MouseAndKeyboardContext.Provider value={value}>
            {children}
        </MouseAndKeyboardContext.Provider>
    );
}

export function useInteraction(name, handler) {
    useContext(MouseAndKeyboardContext).interactions.current[name] = handler;
}

export const useMousePosition = () => useContext(MouseAndKeyboardContext).mousePosition;
export const useIsMouseDown = () => useContext(MouseAndKeyboardContext).isMouseDown;