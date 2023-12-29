import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import useEventListener from "../hooks/useEventListener";

const GridInput = forwardRef(({ text, onTextChange, placement, isValid }, ref) => {
    const [element, setElement] = useState(null);
    const internalText = useRef('');

    useEventListener(element, 'mousedown', event => {
        event.stopPropagation();
    }, []);

    useEventListener(element, 'keydown', event => {
        switch (event.key) {
            case 'Enter':
            case 'Escape':
                break;
            default:
                event.stopPropagation();
                break;
        }
    }, []);

    useEventListener(element, 'click', event => {
        event.stopPropagation();
    }, []);

    useEventListener(element, 'dblclick', event => {
        event.stopPropagation();
    }, []);

    const setElementAndRef = useCallback(element => {
        setElement(element);
        ref?.(element);
    }, [ref]);

    const onChange = useCallback(event => {
        internalText.current = event.target.value;
        onTextChange(event.target.value);
    }, [onTextChange]);

    useEffect(() => {
        if (text === internalText.current)
            return;

        internalText.current = text;
        element?.select();
    }, [text, element]);

    if (!placement)
        return <></>;

    // TODO: It's currently not possible to clear the text as the input hides before the text is cleared.
    return <input
        ref={setElementAndRef}
        autoFocus
        style={{
            position: 'absolute',
            zIndex: 3, ...placement,
            opacity: (text ? 1 : 0),
            pointerEvents: text ? 'auto' : 'none',
            outline: 'none',
            border: 'none',
            boxShadow: 'none',
            padding: '0 5px',
            fontSize: '12px',
            fontFamily: 'Calibri',
            backgroundColor: isValid ? 'white' : '#eb3434'
        }}
        placeholder='placeholder'
        value={text}
        onChange={onChange}
        opacity={text === '' ? 1 : 0}
    />
});

export default GridInput;