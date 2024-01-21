import render from "./render";
import updateState from "./state";

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

    element.appendChild(elements['top-left']);
    element.appendChild(elements['top-center']);
    element.appendChild(elements['top-right']);
    element.appendChild(elements['middle-left']);
    element.appendChild(elements['middle-center']);
    element.appendChild(elements['middle-right']);
    element.appendChild(elements['bottom-left']);
    element.appendChild(elements['bottom-center']);
    element.appendChild(elements['bottom-right']);

    const context = {
        options: {},
        memory: {},
        element: element,
        elements: elements
    };

    element['spread-grid-context'] = context;

    const requestNewRender = () => {
        if (context.renderRequested) return;
        context.renderRequested = true;
        requestAnimationFrame(() => {
            context.renderRequested = false;
            updateState(context);
            render(context);
        });
    }

    element.addEventListener("scroll", (event) => {
        requestNewRender();
    });

    requestNewRender();
}

const defaultData = [];
const defaultColumns = data => data.length > 0 ? Object.keys(data[0]).map(key => ({ id: key, width: 100 })) : [];
const defaultRows = data => [{ id: 'top-header', type: 'HEADER', height: 20 }, ...data.map((_, index) => ({ id: index, height: 20 }))];
const defaultFormatting = [];
const defaultDataSelector = ({ data, row, column }) => data[row.id][column.id];
const defaultPinnedTop = 0;
const defaultPinnedBottom = 0;
const defaultPinnedLeft = 0;
const defaultPinnedRight = 0;
const defaultBorderWidth = 1;

function setDefaultOptions(options) {
    return {
        data: 'data' in options ? options.data : defaultData,
        columns: 'columns' in options ? options.columns : defaultColumns,
        rows: 'rows' in options ? options.rows : defaultRows,
        formatting: 'formatting' in options ? options.formatting : defaultFormatting,
        dataSelector: 'dataSelector' in options ? options.dataSelector : defaultDataSelector,
        pinnedTop: 'pinnedTop' in options ? options.pinnedTop : defaultPinnedTop,
        pinnedBottom: 'pinnedBottom' in options ? options.pinnedBottom : defaultPinnedBottom,
        pinnedLeft: 'pinnedLeft' in options ? options.pinnedLeft : defaultPinnedLeft,
        pinnedRight: 'pinnedRight' in options ? options.pinnedRight : defaultPinnedRight,
        borderWidth: 'borderWidth' in options ? options.borderWidth : defaultBorderWidth,
        selectedCells: 'selectedCells' in options ? options.selectedCells : [],
        highlightedCells: 'highlightedCells' in options ? options.highlightedCells : [],
        editedCells: 'editedCells' in options ? options.editedCells : [],
        filters: 'filters' in options ? options.filters : []
    };
}

export default function createGrid(element, options) {
    console.log('createGrid');

    initialize(element);

    const context = element['spread-grid-context'];
    context.options = setDefaultOptions(options);
}