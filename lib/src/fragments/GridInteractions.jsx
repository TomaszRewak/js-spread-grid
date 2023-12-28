import React, { useEffect, useMemo } from 'react';
import stringifyId from '../utils/stringifyId';
import { useFocus, useInteraction, useIsMouseDown, useMousePosition } from '../contexts/MouseAndKeyboardContext';
import { useAddEditedCells, useAddSelectedCells, useBorderWidth, useColumns, useFixedSize, useFocusedCell, useHoveredCell, useInputFormatResolver, useRows, useSelectedCells, useSetEditedCells, useSetFocusedCell, useSetHighlightedCells, useSetHoveredCell, useSetSelectedCells, useTotalSize } from '../contexts/StateContext';
import { useClientSize, useScrollOffset } from '../contexts/SizeAndScrollContext';
import { useState } from 'react';
import GridInput from './GridInput';

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

function findHighlightedCells(focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup) {
    if (!hoveredCell)
        return [];
    if (!focusedCell)
        return [];

    const focusedColumnKey = stringifyId(focusedCell.columnId);
    const focusedRowKey = stringifyId(focusedCell.rowId);
    const hoveredColumnKey = stringifyId(hoveredCell.columnId);
    const hoveredRowKey = stringifyId(hoveredCell.rowId);

    if (!columnLookup.has(focusedColumnKey))
        return [];
    if (!rowLookup.has(focusedRowKey))
        return [];
    if (!columnLookup.has(hoveredColumnKey))
        return [];
    if (!rowLookup.has(hoveredRowKey))
        return [];

    const minColumnIndex = Math.min(columnLookup.get(focusedColumnKey).index, columnLookup.get(hoveredColumnKey).index);
    const maxColumnIndex = Math.max(columnLookup.get(focusedColumnKey).index, columnLookup.get(hoveredColumnKey).index);
    const minRowIndex = Math.min(rowLookup.get(focusedRowKey).index, rowLookup.get(hoveredRowKey).index);
    const maxRowIndex = Math.max(rowLookup.get(focusedRowKey).index, rowLookup.get(hoveredRowKey).index);

    return columns.slice(minColumnIndex, maxColumnIndex + 1).flatMap(column => {
        return rows.slice(minRowIndex, maxRowIndex + 1).map(row => {
            return {
                rowId: row.id,
                columnId: column.id
            };
        });
    });
}

function getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup) {
    return selectedCells.map(cell => {
        const columnKey = stringifyId(cell.columnId);
        const rowKey = stringifyId(cell.rowId);

        if (!columnLookup.has(columnKey))
            return null;
        if (!rowLookup.has(rowKey))
            return null;

        const column = columnLookup.get(columnKey);
        const row = rowLookup.get(rowKey);

        return {
            edit: formatResolver.resolve(row, column).edit,
            cell: cell
        }
    }).filter(cell => cell?.edit);
}

export default function GridInteractions() {
    // console.count('render GridInteractions');
    const [text, setText] = useState('');
    const [input, setInput] = useState(null);

    const size = useClientSize();
    const mousePosition = useMousePosition();
    const isMouseDown = useIsMouseDown();
    const focus = useFocus();
    const scrollOffset = useScrollOffset();
    const hoveredCell = useHoveredCell();
    const focusedCell = useFocusedCell();
    const borderWidth = useBorderWidth();

    const selectedCells = useSelectedCells();
    const setSelectedCells = useSetSelectedCells();
    const setHighlightedCells = useSetHighlightedCells();
    const setEditedCells = useSetEditedCells();
    const setHoveredCell = useSetHoveredCell();
    const setFocusedCell = useSetFocusedCell();
    const addSelectedCells = useAddSelectedCells();
    const addEditedCells = useAddEditedCells();

    const columns = useColumns();
    const rows = useRows();

    const columnPlacement = useColumnPlacement(columns, borderWidth);
    const rowPlacement = useRowPlacement(rows, borderWidth);

    const fixedSize = useFixedSize();
    const totalSize = useTotalSize();

    const formatResolver = useInputFormatResolver();

    const columnLookup = useMemo(() => columns.reduce((map, column) => map.set(column.key, column), new Map()), [columns]);
    const rowLookup = useMemo(() => rows.reduce((map, row) => map.set(row.key, row), new Map()), [rows]);

    const isTextValid = useMemo(() => {
        const editableCells = getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup);
        return editableCells.every(cell => cell.edit.validate({ string: text }));
    }, [selectedCells, formatResolver, columnLookup, rowLookup, text]);

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

    useEffect(() => {
        // TODO: Make sure it behaves correctly when the mouse is moved outside the grid while the mouse button is down
        if (!isMouseDown)
            return;

        setHighlightedCells(findHighlightedCells(focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup));
    }, [isMouseDown, hoveredCell, focusedCell, columns, rows, columnLookup, rowLookup, setHighlightedCells]);

    useInteraction('mousedown', event => {
        if (!hoveredCell)
            return;

        setText('');
        setFocusedCell(hoveredCell);

        if (!event.ctrlKey)
            setSelectedCells([]);
    });

    useInteraction('mouseup', () => {
        if (!focusedCell)
            return;

        addSelectedCells(findHighlightedCells(focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup));
        setHighlightedCells([]);
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

        const preventDefault = () => {
            event.preventDefault();
            event.stopPropagation();
        };

        const cancel = () => {
            if (text !== '') {
                setText('');
            }
            else if (focusedCell) {
                setFocusedCell(null);
                setSelectedCells([]);
            }
            else {
                setEditedCells([]);
            }
        };

        const accept = () => {
            const editableCells = getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup);

            if (text === '')
                return;
            if (!editableCells.every(cell => cell.edit.validate({ string: text })))
                return;

            addEditedCells(editableCells.map(cell => ({ ...cell.cell, value: text })));
            setText('');
        };

        switch (event.key) {
            case 'Escape':
                cancel();
                break;
            case 'Enter':
                accept();
                break;
            case 'ArrowUp':
                // TODO: When ctrl and shift are pressed together, select all cells between the focused cell and the new cell
                // TODO: When shift is pressed, expand the current rect selection instead of moving the focused cell
                preventDefault();
                arrowVertically(event.ctrlKey ? -rows.length : -1, event);
                break;
            case 'ArrowDown':
                preventDefault();
                arrowVertically(event.ctrlKey ? rows.length : 1, event);
                break;
            case 'ArrowLeft':
                preventDefault();
                arrowHorizontally(event.ctrlKey ? -columns.length : -1, event);
                break;
            case 'ArrowRight':
                preventDefault();
                arrowHorizontally(event.ctrlKey ? columns.length : 1, event);
                break;
            default:
                return;
        }
    });

    useInteraction('dblclick', () => {
        if (!focusedCell)
            return;

        const focusedColumnKey = stringifyId(focusedCell.columnId);
        const focusedRowKey = stringifyId(focusedCell.rowId);

        if (!columnLookup.has(focusedColumnKey))
            return;
        if (!rowLookup.has(focusedRowKey))
            return;

        const column = columnLookup.get(focusedColumnKey);
        const row = rowLookup.get(focusedRowKey);
        const cell = formatResolver.resolve(row, column);
        const text = `${cell.value}` // TODO: Use the text, not value (???)

        setText(text);
    });

    useInteraction('focus', () => {
        console.log('refocusing on input');
        input?.focus();
    });

    const inputPlacement = useMemo(() => {
        if (!focusedCell)
            return null;

        const focusedColumnKey = stringifyId(focusedCell.columnId);
        const focusedRowKey = stringifyId(focusedCell.rowId);

        if (!columnLookup.has(focusedColumnKey))
            return null;
        if (!rowLookup.has(focusedRowKey))
            return null;

        const column = columnLookup.get(focusedColumnKey);
        const row = rowLookup.get(focusedRowKey);

        return {
            left: column.left,
            top: row.top,
            width: column.width,
            height: row.height,
            boxSizing: 'border-box',
        };
    }, [focusedCell, columnLookup, rowLookup]);

    const inputHasFocus = input && document.activeElement === input;

    useEffect(() => {
        if (inputHasFocus && !inputPlacement)
            focus();
    }, [inputPlacement, inputHasFocus, focus]);

    return (
        <>
            <GridInput ref={setInput} text={text} onTextChange={setText} placement={inputPlacement} isValid={isTextValid} />
        </>
    );
}