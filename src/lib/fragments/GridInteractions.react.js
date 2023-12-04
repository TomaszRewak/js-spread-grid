import React, { useEffect, useMemo, useState } from 'react';

function useColumnPlacement(columns) {
    return useMemo(() => {
        console.log('useColumnPlacement');
        const placement = [];

        columns.reduce((offset, column) => {
            placement.push({
                offset,
                column: column
            });

            // TODO: Make that "1" configurable as cell spacing
            return offset + column.width + 1;
        }, 0);

        return placement;
    }, [columns]);
}

function useRowPlacement(rows) {
    return useMemo(() => {
        const placement = [];

        rows.reduce((offset, row) => {
            placement.push({
                offset,
                row: row
            });

            // TODO: Make that "1" configurable as cell spacing
            return offset + row.height + 1;
        }, 0);

        return placement;
    }, [rows]);
}

function useSize(element) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!element)
            return () => { };

        const onResize = () => {
            const newSize = {
                width: element.offsetWidth,
                height: element.offsetHeight
            };

            setSize(oldSize => {
                if (oldSize.width === newSize.width && oldSize.height === newSize.height)
                    return oldSize;

                return newSize;
            });
        };

        const observer = new ResizeObserver(onResize);
        observer.observe(element);

        return () => observer.disconnect();
    }, [element]);

    return size;
}

function useMousePosition(element) {
    const [position, setPosition] = useState(null);

    useEffect(() => {
        if (!element)
            return () => { };

        const onMouseMove = (event) => {
            const newPosition = {
                x: event.clientX,
                y: event.clientY
            };

            setPosition(oldPosition => {
                if (!oldPosition)
                    return newPosition;

                if (oldPosition.x === newPosition.x && oldPosition.y === newPosition.y)
                    return oldPosition;

                return newPosition;
            });
        };

        element.addEventListener('mousemove', onMouseMove);

        return () => element.removeEventListener('mousemove', onMouseMove);
    }, [element]);

    useEffect(() => {
        if (!element)
            return () => { };

        const onMouseLeave = () => {
            setPosition(null);
        };

        element.addEventListener('mouseleave', onMouseLeave);

        return () => element.removeEventListener('mouseleave', onMouseLeave);
    }, [element]);

    return position;
}

export default function GridInteractions({ style, leftColumns, middleColumns, rightColumns, topRows, middleRows, bottomRows }) {
    const [element, setElement] = useState(null);

    const size = useSize(element);
    const mousePosition = useMousePosition(element);

    const leftColumnPlacement = useColumnPlacement(leftColumns);
    const middleColumnPlacement = useColumnPlacement(middleColumns);
    const rightColumnPlacement = useColumnPlacement(rightColumns);
    const topRowPlacement = useRowPlacement(topRows);
    const middleRowPlacement = useRowPlacement(middleRows);
    const bottomRowPlacement = useRowPlacement(bottomRows);

    // TODO: Memoize style
    return (
        <div ref={setElement} style={{ ...style, position: 'relative' }}>
            <div style={{ position: 'absolute', width: '5px', height: '5px', backgroundColor: 'red', left: mousePosition?.x, top: mousePosition?.y }}></div>
        </div>
    );
}