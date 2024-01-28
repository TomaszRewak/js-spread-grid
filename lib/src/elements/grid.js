import getEditableCells from "../state-utils/getEditableCells";
import Selection from "../utils/Selection";
import stringifyId from "../utils/stringifyId";
import render from "./render";
import updateState from "./state";

function getCombinedCells(previousCells, newCells) {
    const selection = new Selection(newCells);
    return [...newCells, ...previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId))];
}

function getReducedCells(previousCells, cellsToRemove) {
    const selection = new Selection(cellsToRemove);
    return previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId));
}

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
    element.setAttribute('style', 'width: fit-content; height: fit-content; max-width: 100vw; max-height: 100vh; overflow: auto; display: grid; position: relative; grid-template-columns: auto auto auto; grid-template-rows: auto auto auto; outline: none;');
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

    context.localOptions = {
        data: [],
        columns: data => data.length > 0 ? Object.keys(data[0]).map(key => ({ id: key, width: 100 })) : [],
        rows: data => [{ id: 'top-header', type: 'HEADER', height: 20 }, ...data.map((_, index) => ({ id: index, height: 20 }))],
        formatting: [],
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
    };

    element['spread-grid-context'] = context;

    const setText = (text) => {
        input.value = text;
        input.dispatchEvent(new Event('input'));
    }

    element.addEventListener('scroll', (event) => {
        // TODO: only request new render if scroll position changed outside of the scope
        // TODO: how to: calculate the new scrollRect here and compare it to the one in the state
        // TODO: Also don't forget to check if the highlighted cell did change
        context.requestNewRender();
    });

    element.addEventListener('mouseenter', (event) => {
        context.mousePosition = {
            x: event.clientX - element.offsetLeft,
            y: event.clientY - element.offsetTop
        };
        context.requestNewRender();
    });

    element.addEventListener('mousemove', (event) => {
        context.mousePosition = {
            x: event.clientX - element.offsetLeft,
            y: event.clientY - element.offsetTop
        };
        // TODO: only request new render if hovered cell changed
        context.requestNewRender();
    });

    element.addEventListener('mouseleave', () => {
        context.mousePosition = null;
        context.requestNewRender();
    });

    element.addEventListener('mousedown', (event) => {
        updateState(context);
        setText('');

        context.isMouseDown = true;
        context.state.options.onFocusedCellChange(context.state.hoveredCell);

        if (!event.ctrlKey)
            context.state.options.onSelectedCellsChange([]);

        context.requestNewRender();
    });

    element.addEventListener('mouseup', (event) => {
        updateState(context);

        context.isMouseDown = false;
        context.state.options.onSelectedCellsChange(getCombinedCells(context.state.options.selectedCells, context.state.highlightedCells));
        context.requestNewRender();
    });

    element.addEventListener('dblclick', (event) => {
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

    element.addEventListener('focus', () => {
        if (input.parentElement)
            input.focus();
    });

    element.addEventListener('keydown', (event) => {
        updateState(context);

        const focusedCell = context.state.focusedCell;
        const columnLookup = context.state.columnLookup;
        const rowLookup = context.state.rowLookup;
        const formatResolver = context.state.inputFormatResolver;
        const selectedCells = context.state.options.selectedCells;
        const setSelectedCells = context.state.options.onSelectedCellsChange;
        const addSelectedCells = (cells) => setSelectedCells(getCombinedCells(selectedCells, cells));
        const setFocusedCell = context.state.options.onFocusedCellChange;
        const editedCells = context.state.options.editedCells;
        const setEditedCells = context.state.options.onEditedCellsChange;
        const addEditedCells = (cells) => setEditedCells(getCombinedCells(context.state.options.editedCells, cells));
        const removeEditedCells = (cells) => setEditedCells(getReducedCells(context.state.options.editedCells, cells));
        const setFilters = context.state.options.onFiltersChange;
        const addFilters = (cells) => setFilters(getCombinedCells(context.state.options.filters, cells));
        const removeFilters = (cells) => setFilters(getReducedCells(context.state.options.filters, cells));
        const columns = context.state.columns;
        const rows = context.state.rows;
        const text = input.value;

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

        const accept = () => {
            const editableCells = getEditableCells(selectedCells, formatResolver, columnLookup, rowLookup);

            if (text === '')
                return;
            if (!editableCells.every(cell => cell.edit.validate({ string: text })))
                return;

            const dataCells = editableCells.filter(cell => cell.type === 'DATA');
            const filterCells = editableCells.filter(cell => cell.type === 'FILTER');

            addEditedCells(dataCells.map(cell => ({ ...cell.cell, value: cell.edit.parse({ string: text }) })));
            addFilters(filterCells.map(cell => ({ ...cell.cell, expression: cell.edit.parse({ string: text }) })));

            setText('');
        };

        const clear = () => {
            removeEditedCells(selectedCells);
            removeFilters(selectedCells);
        }

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
                return;
        }
    });

    new ResizeObserver(() => {
        context.requestNewRender();
    }).observe(element);

    input.addEventListener('input', (event) => {
        if (event.target.value) {
            input.style.opacity = 1;
            input.style.pointerEvents = 'auto';
        }
        else {
            input.style.opacity = 0;
            input.style.pointerEvents = 'none';
        }
    });

    input.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    input.addEventListener('dblclick', (event) => {
        event.stopPropagation();
    });

    input.addEventListener('mousedown', (event) => {
        event.stopPropagation();
    });

    input.addEventListener('keydown', (event) => {
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
                if (input.value !== '')
                    event.stopPropagation();
                break;
            default:
                event.stopPropagation();
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