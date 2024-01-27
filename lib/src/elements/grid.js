import Selection from "../utils/Selection";
import render from "./render";
import updateState from "./state";

function getCombinedCells(previousCells, newCells) {
    const selection = new Selection(newCells);
    return [...newCells, ...previousCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId))];
}

function initialize(element) {
    if ('spread-grid-context' in element) return;

    const elements = {
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

    element.setAttribute('tabindex', '0');
    element.setAttribute('style', 'max-width: fit-content; max-height: fit-content; overflow: auto; display: grid; position: relative; grid-template-columns: auto auto auto; grid-template-rows: auto auto auto; outline: none;');
    elements['top-left'].setAttribute('style', 'position: sticky; left: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 1;');
    elements['top-center'].setAttribute('style', 'position: sticky; top: 0; z-index: 1; grid-row: 1; grid-column: 2;');
    elements['top-right'].setAttribute('style', 'position: sticky; right: 0; top: 0; z-index: 2; grid-row: 1; grid-column: 3;');
    elements['middle-left'].setAttribute('style', 'position: sticky; left: 0; z-index: 1; grid-row: 2; grid-column: 1;');
    elements['middle-center'].setAttribute('style', 'grid-row: 2; grid-column: 2;');
    elements['middle-right'].setAttribute('style', 'position: sticky; right: 0; z-index: 1; grid-row: 2; grid-column: 3;');
    elements['bottom-left'].setAttribute('style', 'position: sticky; left: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 1;');
    elements['bottom-center'].setAttribute('style', 'position: sticky; bottom: 0; z-index: 1; grid-row: 3; grid-column: 2;');
    elements['bottom-right'].setAttribute('style', 'position: sticky; right: 0; bottom: 0; z-index: 2; grid-row: 3; grid-column: 3;');

    const context = {
        externalOptions: {},
        state: null,
        memory: {},
        element: element,
        elements: elements,
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
        filters: []
    };

    element['spread-grid-context'] = context;

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
        context.state.options.onFocusedCellChange([]);
        context.requestNewRender();
    });

    new ResizeObserver(() => {
        context.requestNewRender();
    }).observe(element);
}

export default function createGrid(element, options) {
    console.log('createGrid');

    initialize(element);

    const context = element['spread-grid-context'];
    context.externalOptions = options;

    if (context.state === null)
        updateState(context);

    context.requestNewRender();
}