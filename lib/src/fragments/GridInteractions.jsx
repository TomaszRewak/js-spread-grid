import React, { useEffect, useMemo } from 'react';
import stringifyId from '../utils/stringifyId';
import { useInteraction, useMousePosition } from '../contexts/MouseAndKeyboardContext';
import { useAddSelectedCells, useBorderWidth, useColumns, useFixedSize, useFocusedCell, useHoveredCell, useRows, useSetFocusedCell, useSetHoveredCell, useSetSelectedCells, useTotalSize } from '../contexts/StateContext';
import { useClientSize, useScrollOffset } from '../contexts/SizeAndScrollContext';

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

export default function GridInteractions() {
    // console.count('render GridInteractions');

    const size = useClientSize();
    const mousePosition = useMousePosition();
    const scrollOffset = useScrollOffset();
    const hoveredCell = useHoveredCell();
    const focusedCell = useFocusedCell();
    const borderWidth = useBorderWidth();

    const setSelectedCells = useSetSelectedCells();
    const setHoveredCell = useSetHoveredCell();
    const setFocusedCell = useSetFocusedCell();
    const addSelectedCells = useAddSelectedCells();

    const columns = useColumns();
    const rows = useRows();

    const columnPlacement = useColumnPlacement(columns, borderWidth);
    const rowPlacement = useRowPlacement(rows, borderWidth);

    const fixedSize = useFixedSize();
    const totalSize = useTotalSize();

    const columnLookup = useMemo(() => columns.reduce((map, column) => map.set(column.key, column), new Map()), [columns]);
    const rowLookup = useMemo(() => rows.reduce((map, row) => map.set(row.key, row), new Map()), [rows]);

    // TODO: Invoke this function also directly on the mousemove event. Though leave it as a effect as well, so that it is invoked when the scrollOffset changes.
    useEffect(() => {
        if (!mousePosition) {
            setHoveredCell(null);
            return;
        }

        const x = mousePosition.x <= fixedSize.left
            ? mousePosition.x
            : mousePosition.x >= size.width - fixedSize.right
                ? totalSize.width - size.width + mousePosition.x
                : mousePosition.x + scrollOffset.left;
        const y = mousePosition.y <= fixedSize.top
            ? mousePosition.y
            : mousePosition.y >= size.height - fixedSize.bottom
                ? totalSize.height - size.height + mousePosition.y
                : mousePosition.y + scrollOffset.top;

        const hoverRowIndex = findRowIndex(rowPlacement, y);
        const hoverColumnIndex = findColumnIndex(columnPlacement, x);

        if (hoverRowIndex === -1 || hoverColumnIndex === -1) {
            setHoveredCell(null);
            return;
        }

        setHoveredCell({
            rowId: rows[hoverRowIndex].id,
            columnId: columns[hoverColumnIndex].id
        });
    }, [columnPlacement, columns, mousePosition, rowPlacement, rows, scrollOffset, setHoveredCell, size, fixedSize, totalSize]);

    useInteraction('mousedown', event => {
        if (!hoveredCell)
            return;

        setFocusedCell(hoveredCell);

        if (event.ctrlKey)
            addSelectedCells([hoveredCell]);
        else
            setSelectedCells([hoveredCell]);
    });

    useInteraction('keydown', event => {
        console.log('onKeyDown', event.key);

        const arrowTo = (cell, event) => {
            setFocusedCell(cell);

            if (event.shiftKey)
                addSelectedCells([cell]);
            else
                setSelectedCells([cell]);
        };

        const arrowHorizontally = (offset, event) => {
            if (!focusedCell)
                return;

            const focusedColumnKey = stringifyId(focusedCell.columnId);
            if (!columnLookup.has(focusedColumnKey))
                return;

            const focusedColumnIndex = columnLookup.get(focusedColumnKey).index;
            const newColumnIndex = Math.max(0, Math.min(columns.length - 1, focusedColumnIndex + offset));
            if (newColumnIndex === focusedColumnIndex)
                return;

            const newFocusedCell = { rowId: focusedCell.rowId, columnId: columns[newColumnIndex].id };

            arrowTo(newFocusedCell, event);
        }

        const arrowVertically = (offset, event) => {
            if (!focusedCell)
                return;

            const focusedRowKey = stringifyId(focusedCell.rowId);
            if (!rowLookup.has(focusedRowKey))
                return;

            const focusedRowIndex = rowLookup.get(focusedRowKey).index;
            const newRowIndex = Math.max(0, Math.min(rows.length - 1, focusedRowIndex + offset));
            if (newRowIndex === focusedRowIndex)
                return;

            const newFocusedCell = { rowId: rows[newRowIndex].id, columnId: focusedCell.columnId };

            arrowTo(newFocusedCell, event);
        }

        switch (event.key) {
            case 'Escape':
                {
                    setFocusedCell(null);
                    setSelectedCells([]);
                    break;
                }
            case 'ArrowUp':
                // TODO: When ctrl and shift are pressed together, select all cells between the focused cell and the new cell
                arrowVertically(event.ctrlKey ? -rows.length : -1, event);
                break;
            case 'ArrowDown':
                arrowVertically(event.ctrlKey ? rows.length : 1, event);
                break;
            case 'ArrowLeft':
                arrowHorizontally(event.ctrlKey ? -columns.length : -1, event);
                break;
            case 'ArrowRight':
                arrowHorizontally(event.ctrlKey ? columns.length : 1, event);
                break;
            default:
                return;
        }
    });

    return (
        <></>
    );
}