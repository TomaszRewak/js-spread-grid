/** @import * as Types from "./typings.js" **/

import getEditableCells from "./state-utils/getEditableCells.js";
import stringifyId from "./core-utils/stringifyId.js";
import render from "./core/render.js";
import updateState from "./core/state.js";
import getCombinedCells from "./state-utils/getCombinedCells.js";
import getReducedCells from "./state-utils/getReducedCells.js";
import getMousePosition from "./state-utils/getMousePosition.js";
import getNewSortBy from "./state-utils/getNewSortBy.js";
import getClipboardData from "./state-utils/getClipboardData.js";
import getToggledValue from "./state-utils/getToggledValue.js";
import getCellEditType from "./state-utils/getCellEditType.js";
import getInternalPosition from "./state-utils/getInternalPosition.js";
import { getWithAssumedId } from "./state-utils/getWithAssumedId.js";
import { getReorderedColumns, getReorderedRows } from "./state-utils/getReordered.js";


/**
 * @param {Types.Context} context
 */
function updateGrid(context) {
    updateState(context);
    if (context.hasVisualChanges) {
        context.hasVisualChanges = false;
        render(context);
    }
}

/**
 * @param {HTMLElement} element
 */
function initialize(element) {
    if ('spread-grid-context' in element) return;

    const canvases = {
        'top-left': document.createElement('canvas'),
        'top-center': document.createElement('canvas'),
        'top-right': document.createElement('canvas'),
        'middle-left': document.createElement('canvas'),
        'middle-center': document.createElement('canvas'),
        'middle-right': document.createElement('canvas'),
        'bottom-left': document.createElement('canvas'),
        'bottom-center': document.createElement('canvas'),
        'bottom-right': document.createElement('canvas')
    };
    const input = document.createElement('input');
    const tooltip = document.createElement('div');

    element.setAttribute('tabindex', '0');
    element.setAttribute('style', 'max-width: 100vw; max-height: 100vh; overflow: auto; display: grid; position: relative; grid-template-columns: fit-content(0) fit-content(0) fit-content(0); grid-template-rows: fit-content(0) fit-content(0) fit-content(0); outline: none; user-select: none; touch-action: manipulation;');
    element.classList.add('spread-grid');
    canvases['top-left'].setAttribute('style', 'position: sticky; left: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 1;');
    canvases['top-center'].setAttribute('style', 'position: sticky; top: 0; z-index: 1; grid-row: 1; grid-column: 2;');
    canvases['top-right'].setAttribute('style', 'position: sticky; right: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 3;');
    canvases['middle-left'].setAttribute('style', 'position: sticky; left: 0; z-index: 1; grid-row: 2; grid-column: 1;');
    canvases['middle-center'].setAttribute('style', 'grid-row: 2; grid-column: 2; z-index: 0;');
    canvases['middle-right'].setAttribute('style', 'position: sticky; right: 0; z-index: 1; grid-row: 2; grid-column: 3;');
    canvases['bottom-left'].setAttribute('style', 'position: sticky; left: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 1;');
    canvases['bottom-center'].setAttribute('style', 'position: sticky; bottom: 0; z-index: 1; grid-row: 3; grid-column: 2;');
    canvases['bottom-right'].setAttribute('style', 'position: sticky; right: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 3;');
    input.setAttribute('style', 'position: sticky; z-index: 3; outline: none; border: none; box-shadow: none; padding: 0 5px; font-size: 12px; font-family: Calibri; background-color: white; box-sizing: border-box; opacity: 0; pointer-events: none;');
    tooltip.setAttribute('style', 'pointer-events: none; background-color: white; color: black; border: 1px solid black; padding: 3px 7px; inset: unset; position: absolute; font-size: 12px; font-family: Calibri; ');
    tooltip.setAttribute('popover', 'manual');
    tooltip.classList.add('spread-grid-tooltip');

    const context = /** @type {Types.Context} */({
        element,
        canvases,
        input,
        tooltip,
        localOptions: null,
        externalOptions: {},
        state: null,
        memory: {},
        renderRequested: false,
        mousePosition: null,
        isMouseDown: false,
        columnWidthCache: new Map(),
        rowHeightCache: new Map(),
        isReordering: false,
        errorRendered: false,
        error: null,
        resizingColumn: null,
        resizingRow: null,
        reorderedColumn: null,
        reorderedRow: null,
        didReorder: false,
        mouseDownPosition: null,
        mouseDownCell: null,
        requestNewRender: null,
        hasVisualChanges: true,
        fractionalScrollProgressVertical: 0,
        fractionalScrollProgressHorizontal: 0,
    });

    context.requestNewRender = () => {
        if (context.renderRequested) return;
        context.renderRequested = true;
        requestAnimationFrame(() => {
            context.renderRequested = false;
            updateGrid(context);
        });
    }

    context.localOptions = /** @type {Types.Options} */ ({
        data: [],
        columns: [{ type: 'DATA-BLOCK' }],
        rows: [{ type: 'HEADER' }, { type: 'DATA-BLOCK' }],
        formatting: [],
        filtering: [],
        sorting: [],
        dataSelector: ({ data, row, column }) => data?.[row.selector]?.[column.selector],
        pinnedTop: 0,
        pinnedBottom: 0,
        pinnedLeft: 0,
        pinnedRight: 0,
        borderWidth: 1,
        focusedCell: null,
        onFocusedCellChange: (focusedCell) => {
            context.localOptions.focusedCell = focusedCell;
            context.requestNewRender();
        },
        selectedCells: [],
        onSelectedCellsChange: (selectedCells) => {
            context.localOptions.selectedCells = selectedCells;
            context.requestNewRender();
        },
        highlightedCells: [],
        editedCells: [],
        onEditedCellsChange: (editedCells) => {
            // TODO: optimize by coalescing
            context.localOptions.editedCells = editedCells;
            context.requestNewRender();
        },
        filters: [],
        onFiltersChange: (filters) => {
            context.localOptions.filters = filters;
            context.requestNewRender();
        },
        sortBy: [],
        onSortByChange: (sortBy) => {
            context.localOptions.sortBy = sortBy;
            context.requestNewRender();
        },
        onCellClick: () => { },
        onCustomCellClick: () => { },
        columnWidths: [],
        onColumnWidthsChange: (columnWidths) => {
            context.localOptions.columnWidths = columnWidths;
            context.requestNewRender();
        },
        rowHeights: [],
        onRowHeightsChange: (rowHeights) => {
            context.localOptions.rowHeights = rowHeights;
            context.requestNewRender();
        },
        columnsOrder: [],
        onColumnsOrderChange: (columnsOrder) => {
            context.localOptions.columnsOrder = columnsOrder;
            context.requestNewRender();
        },
        rowsOrder: [],
        onRowsOrderChange: (rowsOrder) => {
            context.localOptions.rowsOrder = rowsOrder;
            context.requestNewRender();
        },
        onActiveColumnsChange: () => { },
        onActiveRowsChange: () => { },
        onHoveredCellChange: () => { },
        onStateChange: () => { },
        verticalScrollTarget: null,
        horizontalScrollTarget: null,
    });

    /**
     * @template {keyof HTMLElementEventMap} K
     * @param {HTMLElement} element
     * @param {K} type
     * @param {(event: HTMLElementEventMap[K]) => void} listener
     */
    function addEventListener(element, type, listener) {
        element.addEventListener(type, (event) => {
            try {
                listener(event);
            }
            catch (error) {
                error.message = `[${type} event]: ${error.message}`;
                context.error = error;
                context.requestNewRender();
            }
        });
    }

    (/** @type {any} */ (element))['spread-grid-context'] = context;

    /** @param {string} text */
    const setText = (text) => {
        input.value = text;
        input.dispatchEvent(new Event('input'));
    }

    /** @param {boolean} autoCommit */
    const accept = (autoCommit) => {
        const selectedCells = context.state.options.selectedCells;
        const formatResolver = context.state.inputFormatResolver;
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const text = context.state.text;
        const isTextValid = context.state.isTextValid;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const setFilters = context.state.options.onFiltersChange;
        /** @param {Types.EditedCell[]} cells */
        const addEditedCells = (cells) => setEditedCells(getCombinedCells(context.state.options.editedCells, cells));
        /** @param {(Types.Filter & Types.CellId)[]} cells */
        const addFilters = (cells) => setFilters(getCombinedCells(getWithAssumedId(context.state.options.filters, 'FILTER'), cells));
        const editableCells = getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup);

        if (text === '')
            return;
        if (!isTextValid)
            return;
        if (autoCommit && !editableCells.every(cell => cell.edit.autoCommit))
            return;

        const dataCells = editableCells.filter(cell => cell.type === 'DATA');
        const filterCells = editableCells.filter(cell => cell.type === 'FILTER');

        addEditedCells(dataCells.map(cell => ({ ...cell.cell, value: cell.edit.parse({ string: text }) })));
        addFilters(filterCells.map(cell => ({ ...cell.cell, expression: cell.edit.parse({ string: text }) })));

        if (!autoCommit)
            setText('');
    };

    /** @param {boolean} autoCommit */
    const clear = (autoCommit) => {
        const selectedCells = context.state.options.selectedCells;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const setFilters = context.state.options.onFiltersChange;
        /** @param {Types.CellId[]} cells */
        const removeEditedCells = (cells) => setEditedCells(getReducedCells(context.state.options.editedCells, cells));
        /** @param {Types.CellId[]} cells */
        const removeFilters = (cells) => setFilters(getReducedCells(getWithAssumedId(context.state.options.filters, 'FILTER'), cells));
        const formatResolver = context.state.inputFormatResolver;
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const editableCells = getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup);

        if (autoCommit && !editableCells.every(cell => cell.edit.autoCommit))
            return;

        removeEditedCells(selectedCells);
        removeFilters(selectedCells);
    }

    // TODO: Move other input functions here as well

    addEventListener(element, 'scroll', (event) => {
        // TODO: only request new render if scroll position changed outside of the scope
        // TODO: how to: calculate the new scrollRect here and compare it to the one in the state
        // TODO: Also don't forget to check if the highlighted cell did change
        // TODO: Consider forcing a new render when visible scrollRect changes (without waiting for the next render frame)
        context.requestNewRender();
    });

    addEventListener(element, 'pointerenter', (event) => {
        context.mousePosition = getMousePosition(event);
        context.requestNewRender();
    });

    addEventListener(element, 'pointermove', (event) => {
        context.mousePosition = getMousePosition(event);

        if (context.resizingColumn) {
            const column = context.state.columnLookup.get(stringifyId(context.resizingColumn));
            const columnWidth = column.width;
            const columnRight = column.right;
            const internalPosition = getInternalPosition(context.mousePosition, context.state.clientSize, context.state.scrollOffset, context.state.fixedSize, context.state.totalSize);
            const newColumnWidth = Math.max(10, internalPosition.x - columnRight + columnWidth);
            const previousColumnWidths = context.state.options.columnWidths;
            const newColumnWidths = previousColumnWidths
                .filter(columnWidth => stringifyId(columnWidth.columnId) !== column.key)
                .concat([{ columnId: column.id, width: newColumnWidth }]);
            context.state.options.onColumnWidthsChange(newColumnWidths);
        }
        if (context.resizingRow) {
            const row = context.state.rowLookup.get(stringifyId(context.resizingRow));
            const rowHeight = row.height;
            const rowBottom = row.bottom;
            const internalPosition = getInternalPosition(context.mousePosition, context.state.clientSize, context.state.scrollOffset, context.state.fixedSize, context.state.totalSize);
            const newRowHeight = Math.max(10, internalPosition.y - rowBottom + rowHeight);
            const previousRowHeights = context.state.options.rowHeights;
            const newRowHeights = previousRowHeights
                .filter(rowHeight => stringifyId(rowHeight.rowId) !== row.key)
                .concat([{ rowId: row.id, height: newRowHeight }]);
            context.state.options.onRowHeightsChange(newRowHeights);
        }
        if (context.reorderedColumn) {
            const columns = context.state.columns;
            const hoveredCell = context.state.hoveredCell;
            const internalPosition = getInternalPosition(context.mousePosition, context.state.clientSize, context.state.scrollOffset, context.state.fixedSize, context.state.totalSize);
            const reorderedColumns = getReorderedColumns(columns, context.reorderedColumn, hoveredCell, internalPosition);
            if (reorderedColumns) {
                context.didReorder = true;
                context.isReordering = true;
                context.state.options.onColumnsOrderChange(reorderedColumns);
            }
        }
        if (context.reorderedRow) {
            const rows = context.state.rows;
            const hoveredCell = context.state.hoveredCell;
            const internalPosition = getInternalPosition(context.mousePosition, context.state.clientSize, context.state.scrollOffset, context.state.fixedSize, context.state.totalSize);
            const reorderedRows = getReorderedRows(rows, context.reorderedRow, hoveredCell, internalPosition);
            if (reorderedRows) {
                context.didReorder = true;
                context.isReordering = true;
                context.state.options.onRowsOrderChange(reorderedRows);
            }
        }

        // TODO: only request new render if hovered cell changed
        context.requestNewRender();
    });

    addEventListener(element, 'touchmove', (event) => {
        const isUserInteracting = context.resizingColumn || context.resizingRow || context.reorderedColumn || context.reorderedRow;

        if (isUserInteracting) {
            event.preventDefault();
            event.stopPropagation();
        }
    });

    addEventListener(element, 'pointerleave', () => {
        context.mousePosition = null;
        context.requestNewRender();
    });

    // TODO: update mouse position on resize

    addEventListener(element, 'pointerdown', (event) => {
        context.mousePosition = getMousePosition(event);

        updateState(context);
        setText('');

        const hoveredCell = context.state.hoveredCell;

        context.isMouseDown = true;
        context.didReorder = false;
        context.mouseDownPosition = context.mousePosition;
        context.mouseDownCell = hoveredCell;

        if (context.state.resizableColumn) {
            context.resizingColumn = context.state.resizableColumn;
        }
        if (context.state.resizableRow) {
            context.resizingRow = context.state.resizableRow;
        }
        if (!context.resizingColumn && hoveredCell) {
            const row = context.state.rowLookup.get(stringifyId(hoveredCell.rowId));
            context.reorderedColumn = row.type === 'HEADER' ? hoveredCell.columnId : null;
        }
        if (!context.resizingRow && hoveredCell) {
            const column = context.state.columnLookup.get(stringifyId(hoveredCell.columnId));
            context.reorderedRow = column.type === 'HEADER' ? hoveredCell.rowId : null;
        }

        if (!context.resizingColumn && !context.resizingRow) {
            context.state.options.onFocusedCellChange(hoveredCell);
        }

        if (!event.ctrlKey)
            context.state.options.onSelectedCellsChange([]);

        context.requestNewRender();
    });

    addEventListener(element, 'pointerup', (event) => {
        context.mousePosition = getMousePosition(event);

        updateState(context);

        context.isMouseDown = false;
        context.isReordering = false;
        context.resizingColumn = null;
        context.resizingRow = null;
        context.reorderedColumn = null;
        context.reorderedRow = null;

        context.state.options.onSelectedCellsChange(getCombinedCells(context.state.options.selectedCells, context.state.highlightedCells));
        context.requestNewRender();
    });

    addEventListener(element, 'pointerdown', (event) => {
        context.element.setPointerCapture(event.pointerId);
    });

    addEventListener(element, 'pointerup', (event) => {
        context.element.releasePointerCapture(event.pointerId);
    });

    addEventListener(element, 'click', (event) => {
        context.mousePosition = getMousePosition(event);

        updateState(context);

        const cell = context.state.hoveredCell;
        const mouseDownCell = context.mouseDownCell;

        if (context.state.resizableColumn || context.state.resizableRow)
            return;
        if (context.didReorder)
            return;
        if (cell === null)
            return;
        if (mouseDownCell === null)
            return;
        if (stringifyId(cell.columnId) !== stringifyId(mouseDownCell.columnId))
            return;
        if (stringifyId(cell.rowId) !== stringifyId(mouseDownCell.rowId))
            return;

        const column = context.state.columnLookup.get(stringifyId(cell.columnId));
        const row = context.state.rowLookup.get(stringifyId(cell.rowId));
        const sortBy = context.state.options.sortBy;
        const formatResolver = context.state.inputFormatResolver;
        const cellData = formatResolver.resolve(row, column);
        const eventProperties = {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
            button: event.button,
            buttons: event.buttons,
            detail: event.detail,
        };

        if (cellData.edit?.toggle) {
            const edition = context.state.edition;
            const newValue = getToggledValue(cellData, column, row, edition);
            const cellType = getCellEditType(column, row);
            if (cellType === 'DATA')
                context.state.options.onEditedCellsChange(getCombinedCells(context.state.options.editedCells, [{ ...cell, value: newValue }]));
            if (cellType === 'FILTER')
                context.state.options.onFiltersChange(getCombinedCells(getWithAssumedId(context.state.options.filters, 'FILTER'), [{ ...cell, expression: newValue }]));
        } else if (column.type === 'DATA' && row.type === 'DATA') {
            context.state.options.onCellClick({ ...context.state.hoveredCell, ...eventProperties });
        } else if (column.type === 'CUSTOM' || row.type === 'CUSTOM') {
            context.state.options.onCustomCellClick({ ...context.state.hoveredCell, ...eventProperties });
        } else if (column.type === 'HEADER' || row.type === 'HEADER') {
            const newSortBy = getNewSortBy(sortBy, column, row, event.ctrlKey);
            context.state.options.onSortByChange(newSortBy);
            context.state.options.onSelectedCellsChange([]);
        }
    });

    addEventListener(element, 'dblclick', (event) => {
        context.mousePosition = getMousePosition(event);

        updateState(context);

        if (context.state.resizableColumn) {
            const resizableColumnKey = stringifyId(context.state.resizableColumn);
            const newColumnWidths = context.state.options.columnWidths.filter(columnWidth => stringifyId(columnWidth.columnId) !== resizableColumnKey);
            context.state.options.onColumnWidthsChange(newColumnWidths);
            context.columnWidthCache.delete(resizableColumnKey);
        }
        if (context.state.resizableRow) {
            const resizableRowKey = stringifyId(context.state.resizableRow);
            const newRowHeights = context.state.options.rowHeights.filter(rowHeight => stringifyId(rowHeight.rowId) !== resizableRowKey);
            context.state.options.onRowHeightsChange(newRowHeights);
            context.rowHeightCache.delete(resizableRowKey);
        }

        const focusedCell = context.state.focusedCell;
        if (focusedCell === null)
            return;

        const focusedColumnKey = stringifyId(focusedCell.columnId);
        const focusedRowKey = stringifyId(focusedCell.rowId);
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const formatResolver = context.state.inputFormatResolver;

        if (!columnLookup.has(focusedColumnKey))
            return;
        if (!rowLookup.has(focusedRowKey))
            return;

        const column = columnLookup.get(focusedColumnKey);
        const row = rowLookup.get(focusedRowKey);
        const cell = formatResolver.resolve(row, column);
        const text = cell.text; // TODO: Make it configurable

        if (!cell.edit)
            return;
        if (cell.edit.toggle)
            return;

        setText(text);
        input?.select();
    });

    addEventListener(element, 'focus', () => {
        if (input.parentElement)
            input.focus({ preventScroll: true });
    });

    addEventListener(element, 'keydown', (event) => {
        // TODO: make sure it's not invoked on keydown of the input
        updateState(context);

        const focusedCell = context.state.focusedCell;
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const selectedCells = context.state.options.selectedCells;
        const setSelectedCells = context.state.options.onSelectedCellsChange;
        /** @param {Types.CellId[]} cells */
        const addSelectedCells = (cells) => setSelectedCells(getCombinedCells(selectedCells, cells));
        const setFocusedCell = context.state.options.onFocusedCellChange;
        const editedCells = context.state.options.editedCells;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const columns = context.state.columns;
        const rows = context.state.rows;
        const text = context.state.text;
        const inputFormatResolver = context.state.inputFormatResolver;

        /** @param {Types.CellId} cell, @param {KeyboardEvent} event */
        const arrowTo = (cell, event) => {
            setFocusedCell(cell);

            if (event.shiftKey)
                addSelectedCells([cell]);
            else
                setSelectedCells([cell]);
        };

        /** @param {number} offset, @param {KeyboardEvent} event */
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

        /** @param {number} offset, @param {KeyboardEvent} event */
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
            else if (selectedCells.length > 1) {
                setSelectedCells([focusedCell]);
            }
            else if (editedCells.length > 0) {
                setEditedCells([]);
            }
            else {
                setFocusedCell(null);
                setSelectedCells([]);
            }
        };

        /** @param {KeyboardEvent} event */
        const copyToClipboard = (event) => {
            if (!event.ctrlKey)
                return;

            const clipboardData = getClipboardData(selectedCells, columns, rows, inputFormatResolver);

            if (navigator.clipboard) {
                navigator.clipboard.writeText(clipboardData);
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = clipboardData;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
            }
        }

        switch (event.key) {
            case 'Escape':
                cancel();
                break;
            case 'Enter':
                accept(false);
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
            case 'Delete':
            case 'Backspace':
                clear(false);
                break;
            case 'c':
                copyToClipboard(event);
                break;
            default:
                break;
        }
    });

    new ResizeObserver(() => {
        context.requestNewRender();
    }).observe(element);

    addEventListener(input, 'input', (event) => {
        // TODO: check performance of this (if it's ok to update the state on every input event)
        updateState(context);

        if (input.value) {
            accept(true);

            input.style.opacity = '1';
            input.style.pointerEvents = 'auto';
        }
        else {
            if (event.isTrusted)
                clear(true);

            input.style.opacity = '0';
            input.style.pointerEvents = 'none';
        }
    });

    addEventListener(input, 'click', (event) => {
        event.stopPropagation();
    });

    addEventListener(input, 'dblclick', (event) => {
        event.stopPropagation();
    });

    addEventListener(input, 'pointerdown', (event) => {
        event.stopPropagation();
    });

    addEventListener(input, 'keydown', (event) => {
        switch (event.key) {
            case 'Enter':
            case 'Escape':
                break;
            case 'Delete':
            case 'Backspace':
            case 'ArrowUp':
            case 'ArrowDown':
            case 'ArrowLeft':
            case 'ArrowRight':
                if (input.value !== '') {
                    event.stopPropagation();
                    context.requestNewRender();
                }
                break;
            default:
                event.stopPropagation();
                // TODO: maybe only check if the new text is valid
                context.requestNewRender();
                break;
        }
    });

    addEventListener(element, 'wheel', (event) => {
        if (context.state.activeVerticalScroll || context.state.activeHorizontalScroll) {
            element.scrollBy({
                top: event.deltaY,
                left: event.deltaX,
                behavior: 'auto'
            });

            event.preventDefault();
            event.stopPropagation();
        }
    });
}

/**
 * @param {HTMLElement} element
 * @param {Types.ExternalOptions} options
 */
export default function createGrid(element, options) {
    // console.log('createGrid');

    initialize(element);

    /** @type {Types.Context} */
    const context = (/** @type {*} */(element))['spread-grid-context'];
    context.externalOptions = options;

    if (context.state === null) {
        updateGrid(context);
    }
    else {
        context.requestNewRender();
    }
}