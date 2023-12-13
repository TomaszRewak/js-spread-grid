import React, { useEffect, useMemo, useState } from 'react';
import stringifyId from '../utils/stringifyId';

function useColumnPlacement(columns, borderWidth) {
    return useMemo(() => {
        const placement = [];

        columns.reduce((offset, column) => {
            placement.push({
                left: offset,
                right: offset + column.width + borderWidth,
                id: column.id
            });

            return offset + column.width + borderWidth;
        }, 0);

        return placement;
    }, [columns, borderWidth]);
}

function useRowPlacement(rows, borderWidth) {
    return useMemo(() => {
        const placement = [];

        rows.reduce((offset, row) => {
            placement.push({
                top: offset,
                bottom: offset + row.height + borderWidth,
                id: row.id
            });

            return offset + row.height + borderWidth;
        }, 0);

        return placement;
    }, [rows, borderWidth]);
}

function useSize(element) {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (!element)
            return () => { };

        const onResize = () => {
            const newSize = {
                width: element.clientWidth,
                height: element.clientHeight
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
                x: event.clientX - element.offsetLeft,
                y: event.clientY - element.offsetTop
            };

            setPosition(oldPosition => {
                if (oldPosition && oldPosition.x === newPosition.x && oldPosition.y === newPosition.y)
                    return oldPosition;

                return newPosition;
            });
        };

        element.addEventListener('mousemove', onMouseMove);
        element.addEventListener('mouseenter', onMouseMove);

        return () => {
            element.removeEventListener('mousemove', onMouseMove);
            element.removeEventListener('mouseenter', onMouseMove);
        };
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

function useScrollOffset(element) {
    // TODO: initial scroll - is it ok to set to 0?
    const [scrollOffset, setScrollOffset] = useState({ left: 0, top: 0 });

    useEffect(() => {
        if (!element)
            return () => { };

        const onScroll = () => {
            const newScrollOffset = {
                left: element.scrollLeft,
                top: element.scrollTop
            };

            setScrollOffset(oldScrollOffset => {
                if (oldScrollOffset.left === newScrollOffset.left && oldScrollOffset.top === newScrollOffset.top)
                    return oldScrollOffset;

                return newScrollOffset;
            });
        };

        element.addEventListener('scroll', onScroll);

        return () => element.removeEventListener('scroll', onScroll);
    }, [element]);

    return scrollOffset;
}

function findColumnIndex(placement, x) {
    if (placement.length === 0)
        return -1;
    if (x < placement[0].left)
        return -1;
    if (x > placement[placement.length - 1].right)
        return -1;

    let iterA = 0;
    let iterC = placement.length - 1;

    while (iterA <= iterC) {
        const iterB = Math.floor((iterA + iterC) / 2);

        if (x < placement[iterB].left)
            iterC = iterB - 1;
        else if (x > placement[iterB].right)
            iterA = iterB + 1;
        else
            return iterB;
    }

    return -1;
}

function findRowIndex(placement, y) {
    if (placement.length === 0)
        return -1;
    if (y < placement[0].top)
        return -1;
    if (y > placement[placement.length - 1].bottom)
        return -1;

    let iterA = 0;
    let iterC = placement.length - 1;

    while (iterA <= iterC) {
        const iterB = Math.floor((iterA + iterC) / 2);

        if (y < placement[iterB].top)
            iterC = iterB - 1;
        else if (y > placement[iterB].bottom)
            iterA = iterB + 1;
        else
            return iterB;
    }

    return -1;
}

function pickColumns(leftColumnPlacement, middleColumnPlacement, rightColumnPlacement, x, width, scrollOffset) {
    if (leftColumnPlacement.length && x <= leftColumnPlacement.at(-1).right)
        return [x, leftColumnPlacement];

    if (rightColumnPlacement.length && x >= width - rightColumnPlacement.at(-1).right)
        return [x - width + rightColumnPlacement.at(-1).right, rightColumnPlacement];

    const leftOffset = leftColumnPlacement.length ? leftColumnPlacement.at(-1).right : 0;

    return [x - leftOffset + scrollOffset, middleColumnPlacement];
}

function pickRows(topRowPlacement, middleRowPlacement, bottomRowPlacement, y, height, scrollOffset) {
    if (topRowPlacement.length && y <= topRowPlacement.at(-1).bottom)
        return [y, topRowPlacement];

    if (bottomRowPlacement.length && y >= height - bottomRowPlacement.at(-1).bottom)
        return [y - height + bottomRowPlacement.at(-1).bottom, bottomRowPlacement];

    const topOffset = topRowPlacement.length ? topRowPlacement.at(-1).bottom : 0;

    return [y - topOffset + scrollOffset, middleRowPlacement];
}


export default function GridInteractions({ setProps, container, leftColumns, middleColumns, rightColumns, topRows, middleRows, bottomRows, borderWidth, hoveredCell, focusedCell, selectedCells, selectedCellsLookup }) {
    console.count('render GridInteractions');

    const size = useSize(container);
    const mousePosition = useMousePosition(container);
    const scrollOffset = useScrollOffset(container);

    const leftColumnPlacement = useColumnPlacement(leftColumns, borderWidth);
    const middleColumnPlacement = useColumnPlacement(middleColumns, borderWidth);
    const rightColumnPlacement = useColumnPlacement(rightColumns, borderWidth);
    const topRowPlacement = useRowPlacement(topRows, borderWidth);
    const middleRowPlacement = useRowPlacement(middleRows, borderWidth);
    const bottomRowPlacement = useRowPlacement(bottomRows, borderWidth);

    const allColumns = useMemo(() => [...leftColumns, ...middleColumns, ...rightColumns].map((column, index) => ({ ...column, index })), [leftColumns, middleColumns, rightColumns]);
    const allRows = useMemo(() => [...topRows, ...middleRows, ...bottomRows].map((row, index) => ({ ...row, index })), [topRows, middleRows, bottomRows]);

    const columnLookup = useMemo(() => allColumns.reduce((map, column) => map.set(column.key, column), new Map()), [allColumns]);
    const rowLookup = useMemo(() => allRows.reduce((map, row) => map.set(row.key, row), new Map()), [allRows]);

    useEffect(() => {
        if (!mousePosition) {
            setProps({ hoveredCell: null });
            return;
        }

        const [x, columns] = pickColumns(leftColumnPlacement, middleColumnPlacement, rightColumnPlacement, mousePosition.x, size.width, scrollOffset.left);
        const [y, rows] = pickRows(topRowPlacement, middleRowPlacement, bottomRowPlacement, mousePosition.y, size.height, scrollOffset.top);

        const hoverRowIndex = findRowIndex(rows, y);
        const hoverColumnIndex = findColumnIndex(columns, x);

        if (hoverRowIndex === -1 || hoverColumnIndex === -1) {
            setProps({ hoveredCell: null });
            return;
        }

        const hoverRowId = rows[hoverRowIndex].id;
        const hoverColumnId = columns[hoverColumnIndex].id;

        const newHover = {
            rowId: hoverRowId,
            columnId: hoverColumnId
        };

        // TODO: This effect should not use hoveredCell, instead it should do something like setProps(oldProps => { ... }) - to avoid unnecessary rerenders
        if (stringifyId(hoveredCell) === stringifyId(newHover))
            return;

        // TODO: remove console.log
        console.log('newHover', newHover);

        setProps({ hoveredCell: newHover });
    }, [bottomRowPlacement, leftColumnPlacement, middleColumnPlacement, middleColumns, middleRowPlacement, middleRows, mousePosition, rightColumnPlacement, size, scrollOffset, topRowPlacement, setProps, hoveredCell]);

    useEffect(() => {
        if (!container)
            return () => { };

        const onMouseDown = event => {
            if (!hoveredCell)
                return;

            const hoverRowKey = stringifyId(hoveredCell.rowId);
            const hoverColumnKey = stringifyId(hoveredCell.columnId);

            const isAlreadySelected = selectedCellsLookup.has(hoverRowKey) && selectedCellsLookup.get(hoverRowKey).has(hoverColumnKey);

            console.log('selectedCells', selectedCells);

            if (event.ctrlKey) {
                setProps({
                    focusedCell: hoveredCell,
                    selectedCells: isAlreadySelected
                        ? selectedCells
                        : [...selectedCells, hoveredCell]
                });
            }
            else {
                setProps({
                    focusedCell: hoveredCell,
                    selectedCells: [hoveredCell]
                });
            }
        };

        // TODO: Make sure the event is not re-registered every time one of the dependencies changes
        container.addEventListener('mousedown', onMouseDown);

        return () => container.removeEventListener('mousedown', onMouseDown);
    }, [container, hoveredCell, selectedCells, selectedCellsLookup, setProps]);

    useEffect(() => {
        if (!container)
            return () => { };

        const onKeyDown = (event) => {
            event.preventDefault();
            event.stopPropagation();

            console.log('onKeyDown', event.key);

            const arrowTo = (cell, event) => {
                if (event.shiftKey) {
                    const columnKey = stringifyId(cell.columnId);
                    const rowKey = stringifyId(cell.rowId);
                    const isAlreadySelected = selectedCellsLookup.has(rowKey) && selectedCellsLookup.get(rowKey).has(columnKey);

                    setProps({
                        focusedCell: cell,
                        selectedCells: isAlreadySelected
                            ? selectedCells
                            : [...selectedCells, cell]
                    });
                }
                else {
                    setProps({
                        focusedCell: cell,
                        selectedCells: [cell]
                    });
                }
            };

            const arrowHorizontally = (offset, event) => {
                if (!focusedCell)
                    return;

                const focusedColumnKey = stringifyId(focusedCell.columnId);
                if (!columnLookup.has(focusedColumnKey))
                    return;

                const focusedColumnIndex = columnLookup.get(focusedColumnKey).index;
                const newColumnIndex = Math.max(0, Math.min(allColumns.length - 1, focusedColumnIndex + offset));
                if (newColumnIndex === focusedColumnIndex)
                    return;

                const newFocusedCell = { rowId: focusedCell.rowId, columnId: allColumns[newColumnIndex].id };

                arrowTo(newFocusedCell, event);
            }

            const arrowVertically = (offset, event) => {
                if (!focusedCell)
                    return;

                const focusedRowKey = stringifyId(focusedCell.rowId);
                if (!rowLookup.has(focusedRowKey))
                    return;

                const focusedRowIndex = rowLookup.get(focusedRowKey).index;
                const newRowIndex = Math.max(0, Math.min(allRows.length - 1, focusedRowIndex + offset));
                if (newRowIndex === focusedRowIndex)
                    return;

                const newFocusedCell = { rowId: allRows[newRowIndex].id, columnId: focusedCell.columnId };

                arrowTo(newFocusedCell, event);
            }

            switch (event.key) {
                case 'Escape':
                    {
                        setProps({
                            focusedCell: null,
                            selectedCells: []
                        });
                        break;
                    }
                case 'ArrowUp':
                    // TODO: When ctrl and shift are pressed together, select all cells between the focused cell and the new cell
                    arrowVertically(event.ctrlKey ? -allRows.length : -1, event);
                    break;
                case 'ArrowDown':
                    arrowVertically(event.ctrlKey ? allRows.length : 1, event);
                    break;
                case 'ArrowLeft':
                    arrowHorizontally(event.ctrlKey ? -allColumns.length : -1, event);
                    break;
                case 'ArrowRight':
                    arrowHorizontally(event.ctrlKey ? allColumns.length : 1, event);
                    break;
                default:
                    return;
            }
        };

        // TODO: Make sure the event is not re-registered every time one of the dependencies changes
        container.addEventListener('keydown', onKeyDown);

        return () => container.removeEventListener('keydown', onKeyDown);
    }, [allColumns, allRows, columnLookup, container, focusedCell, rowLookup, selectedCells, selectedCellsLookup, setProps]);

    return (
        <></>
    );
}