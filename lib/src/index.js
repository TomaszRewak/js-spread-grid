import getEditableCells from "./state-utils/getEditableCells.js";
import stringifyId from "./core-utils/stringifyId.js";
import render from "./core/render.js";
import updateState from "./core/state.js";
import getCombinedCells from "./state-utils/getCombinedCells.js";
import getReducedCells from "./state-utils/getReducedCells.js";
import getMousePosition from "./state-utils/getMousePosition.js";

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

    element.setAttribute('tabindex', '0');
    element.setAttribute('style', 'max-width: 100vw; max-height: 100vh; overflow: auto; display: grid; position: relative; grid-template-columns: fit-content(0) fit-content(0) fit-content(0); grid-template-rows: fit-content(0) fit-content(0) fit-content(0); outline: none;');
    element.classList.add('spread-grid');
    canvases['top-left'].setAttribute('style', 'position: sticky; left: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 1;');
    canvases['top-center'].setAttribute('style', 'position: sticky; top: 0; z-index: 1; grid-row: 1; grid-column: 2;');
    canvases['top-right'].setAttribute('style', 'position: sticky; right: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 3;');
    canvases['middle-left'].setAttribute('style', 'position: sticky; left: 0; z-index: 1; grid-row: 2; grid-column: 1;');
    canvases['middle-center'].setAttribute('style', 'grid-row: 2; grid-column: 2;');
    canvases['middle-right'].setAttribute('style', 'position: sticky; right: 0; z-index: 1; grid-row: 2; grid-column: 3;');
    canvases['bottom-left'].setAttribute('style', 'position: sticky; left: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 1;');
    canvases['bottom-center'].setAttribute('style', 'position: sticky; bottom: 0; z-index: 1; grid-row: 3; grid-column: 2;');
    canvases['bottom-right'].setAttribute('style', 'position: sticky; right: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 3;');
    input.setAttribute('style', 'position: absolute; z-index: 3; outline: none; border: none; box-shadow: none; padding: 0 5px; font-size: 12px; font-family: Calibri; background-color: white; box-sizing: border-box; opacity: 0; pointer-events: none;');

    const context = {
        externalOptions: {},
        state: null,
        memory: {},
        element: element,
        canvases: canvases,
        input: input,
        renderRequested: false,
        mousePosition: null,
        isMouseDown: false,
    };

    context.requestNewRender = () => {
        if (context.renderRequested) return;
        context.renderRequested = true;
        requestAnimationFrame(() => {
            context.renderRequested = false;
            updateState(context);
            render(context);
        });
    };

    context.addEventListener = (element, type, listener) => {
        element.addEventListener(type, (event) => {
            try {
                listener(event);
            }
            catch (error) {
                context.error = error;
                context.requestNewRender();
            }
        });
    }

    context.localOptions = {
        data: [],
        columns: data => data.length > 0 ? Object.keys(data[0]).map(key => ({ id: key, header: key, width: 100 })) : [],
        rows: data => [{ id: 'top-header', type: 'HEADER', height: 20 }, ...data.map((_, index) => ({ id: index, height: 20 }))],
        formatting: [],
        filtering: [{ condition: ({ text, expression }) => text.includes(expression) }],
        dataSelector: ({ data, row, column }) => data[row.id][column.id],
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
        onCellClick: () => { },
    };

    element['spread-grid-context'] = context;

    const setText = (text) => {
        input.value = text;
        input.dispatchEvent(new Event('input'));
    }

    const accept = (autoCommit) => {
        const selectedCells = context.state.options.selectedCells;
        const formatResolver = context.state.inputFormatResolver;
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const text = context.state.text;
        const isTextValid = context.state.isTextValid;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const setFilters = context.state.options.onFiltersChange;
        const addEditedCells = (cells) => setEditedCells(getCombinedCells(context.state.options.editedCells, cells));
        const addFilters = (cells) => setFilters(getCombinedCells(context.state.options.filters, cells));
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

    const clear = (autoCommit) => {
        const selectedCells = context.state.options.selectedCells;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const setFilters = context.state.options.onFiltersChange;
        const removeEditedCells = (cells) => setEditedCells(getReducedCells(context.state.options.editedCells, cells));
        const removeFilters = (cells) => setFilters(getReducedCells(context.state.options.filters, cells));
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

    context.addEventListener(element, 'scroll', (event) => {
        // TODO: only request new render if scroll position changed outside of the scope
        // TODO: how to: calculate the new scrollRect here and compare it to the one in the state
        // TODO: Also don't forget to check if the highlighted cell did change
        // TODO: Consider forcing a new render when visible scrollRect changes (without waiting for the next render frame)
        context.requestNewRender();
    });

    context.addEventListener(element, 'mouseenter', (event) => {
        context.mousePosition = getMousePosition(event);
        context.requestNewRender();
    });

    context.addEventListener(element, 'mousemove', (event) => {
        context.mousePosition = getMousePosition(event);
        if (context.isMouseDown)
            context.mouseDragged = true;
        // TODO: only request new render if hovered cell changed
        context.requestNewRender();
    });

    context.addEventListener(element, 'mouseleave', () => {
        context.mousePosition = null;
        context.requestNewRender();
    });

    context.addEventListener(element, 'mousedown', (event) => {
        updateState(context);
        setText('');

        context.isMouseDown = true;
        context.mouseDownPosition = context.mousePosition;
        context.mouseDownCell = context.state.hoveredCell;
        context.mouseDragged = false;
        context.state.options.onFocusedCellChange(context.state.hoveredCell);

        if (!event.ctrlKey)
            context.state.options.onSelectedCellsChange([]);

        context.requestNewRender();
    });

    context.addEventListener(element, 'mouseup', (event) => {
        updateState(context);

        context.isMouseDown = false;
        context.state.options.onSelectedCellsChange(getCombinedCells(context.state.options.selectedCells, context.state.highlightedCells));
        context.requestNewRender();
    });

    context.addEventListener(element, 'click', (event) => {
        updateState(context);

        if (context.mouseDragged)
            return;

        context.state.options.onCellClick(context.state.hoveredCell);
    });

    context.addEventListener(element, 'dblclick', (event) => {
        updateState(context);

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
        const text = `${cell.value}` // TODO: Use the text, not value (???)

        setText(text);
        input?.select();
    });

    context.addEventListener(element, 'focus', () => {
        if (input.parentElement)
            input.focus();
    });

    context.addEventListener(element, 'keydown', (event) => {
        // TODO: make sure it's not invoked on keydown of the input
        updateState(context);

        const focusedCell = context.state.focusedCell;
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const selectedCells = context.state.options.selectedCells;
        const setSelectedCells = context.state.options.onSelectedCellsChange;
        const addSelectedCells = (cells) => setSelectedCells(getCombinedCells(selectedCells, cells));
        const setFocusedCell = context.state.options.onFocusedCellChange;
        const editedCells = context.state.options.editedCells;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const columns = context.state.columns;
        const rows = context.state.rows;
        const text = context.state.text;

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
            case 'Delete':
            case 'Backspace':
                clear();
                break;
            default:
                break;
        }
    });

    new ResizeObserver(() => {
        context.requestNewRender();
    }).observe(element);

    context.addEventListener(input, 'input', (event) => {
        // TODO: check performance of this (if it's ok to update the state on every input event)
        updateState(context);

        if (event.target.value) {
            accept(true);

            input.style.opacity = 1;
            input.style.pointerEvents = 'auto';
        }
        else {
            if (event.isTrusted)
                clear(true);

            input.style.opacity = 0;
            input.style.pointerEvents = 'none';
        }
    });

    context.addEventListener(input, 'click', (event) => {
        event.stopPropagation();
    });

    context.addEventListener(input, 'dblclick', (event) => {
        event.stopPropagation();
    });

    context.addEventListener(input, 'mousedown', (event) => {
        event.stopPropagation();
    });

    context.addEventListener(input, 'keydown', (event) => {
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
}

export default function createGrid(element, options) {
    console.log('createGrid');

    initialize(element);

    const context = element['spread-grid-context'];
    context.externalOptions = options;

    if (context.state === null) {
        updateState(context);
        render(context);
    }
    else {
        context.requestNewRender();
    }
}