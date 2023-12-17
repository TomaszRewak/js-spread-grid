import React, { useEffect, useMemo } from 'react';
import stringifyId from '../utils/stringifyId';
import { useInteraction, useMousePosition, useScrollOffset, useSize } from '../contexts/InteractionsContext';
import { useAddSelectedCells, useFocusedCell, useHoveredCell, useSetFocusedCell, useSetHoveredCell, useSetSelectedCells } from '../contexts/StateContext';
import Selection from '../utils/Selection';

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


export default function GridInteractions({ /*don't remove yet, as the ones in StateContext are not rounded*/leftColumns, middleColumns, rightColumns, topRows, middleRows, bottomRows, borderWidth }) {
    // console.count('render GridInteractions');

    const size = useSize();
    const mousePosition = useMousePosition();
    const scrollOffset = useScrollOffset();
    const hoveredCell = useHoveredCell();
    const focusedCell = useFocusedCell();

    const setSelectedCells = useSetSelectedCells();
    const setHoveredCell = useSetHoveredCell();
    const setFocusedCell = useSetFocusedCell();
    const addSelectedCells = useAddSelectedCells();

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
            setHoveredCell(null);
            return;
        }

        const [x, columns] = pickColumns(leftColumnPlacement, middleColumnPlacement, rightColumnPlacement, mousePosition.x, size.width, scrollOffset.left);
        const [y, rows] = pickRows(topRowPlacement, middleRowPlacement, bottomRowPlacement, mousePosition.y, size.height, scrollOffset.top);

        const hoverRowIndex = findRowIndex(rows, y);
        const hoverColumnIndex = findColumnIndex(columns, x);

        if (hoverRowIndex === -1 || hoverColumnIndex === -1) {
            setHoveredCell(null);
            return;
        }

        setHoveredCell({
            rowId: rows[hoverRowIndex].id,
            columnId: columns[hoverColumnIndex].id
        });
    }, [bottomRowPlacement, leftColumnPlacement, middleColumnPlacement, middleRowPlacement, mousePosition, rightColumnPlacement, scrollOffset, setHoveredCell, size, topRowPlacement]);

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
                    setFocusedCell(null);
                    setSelectedCells([]);
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
    });

    return (
        <></>
    );
}