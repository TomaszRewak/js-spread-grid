import { roundToPixels } from "../hooks/useDevicePixelRatio";
import Edition from "../utils/Edition";
import Filtering from "../utils/Filtering";
import FormatResolver from "../utils/FormatResolver";
import FormattingRules from "../utils/FormattingRules";
import Selection from "../utils/Selection";
import TextResolver from "../utils/TextResolver";
import VisibilityResolver from "../utils/VisibilityResolver";
import getDataFormattingRules from "../utils/getDataFormattingRules";
import getInputFormattingRules from "../utils/getInputFormattingRules";
import getRenderFormattingRules from "../utils/getRenderFormattingRules";
import getSections from "../utils/getSections";
import getVisibilityFormattingRules from "../utils/getVisibilityFormattingRules";
import { area, clip, contains, expand, subtract } from "../utils/rect";
import stringifyId from "../utils/stringifyId";

// TODO: Move
function getEditedCellsAndFilters(editedCells, filters) {
    return [...editedCells, ...filters.map(filter => ({ columnId: filter.columnId, rowId: filter.rowId, value: filter.expression }))];
}

// TODO: Move
function getEdition(editedCellsAndFilters) {
    return new Edition(editedCellsAndFilters);
}

// TODO: Move
function getFilters(filters) {
    return new Filtering(filters);
}

function getSelection(selectedCells) {
    return new Selection(selectedCells);
}

// TODO: Move
function getPinned(index, length, pinnedBegin, pinnedEnd) {
    if (index < pinnedBegin)
        return "BEGIN";
    if (index >= length - pinnedEnd)
        return "END";
    return undefined;
}

function getColumnsOrRows(columnsOrRows, data) {
    return typeof columnsOrRows === 'function'
        ? columnsOrRows(data)
        : columnsOrRows;
}

// TODO: Move
function getResolvedColumnsOrRows(elements, pinnedBegin, pinnedEnd) {
    return elements.map((element, index) => {
        return {
            ...element,
            type: element.type || "DATA",
            index: index,
            key: stringifyId(element.id),
            pinned: getPinned(index, elements.length, pinnedBegin, pinnedEnd)
        }
    });
}

function getPlacedColumns(columns, devicePixelRatio, borderWidth) {
    let left = borderWidth;

    return columns.map((column, index) => {
        const width = roundToPixels(column.width, devicePixelRatio);
        const newColumn = {
            ...column,
            index: index,
            width: width,
            leftWithBorder: left - borderWidth,
            left: left,
            right: left + width,
            rightWithBorder: left + width + borderWidth
        }

        left += newColumn.width + borderWidth;

        return newColumn;
    });
}

function getPlacedRows(rows, devicePixelRatio, borderWidth) {
    let top = borderWidth;

    return rows.map((row, index) => {
        const height = roundToPixels(row.height, devicePixelRatio);
        const newRow = {
            ...row,
            index: index,
            height: height,
            topWithBorder: top - borderWidth,
            top: top,
            bottom: top + height,
            bottomWithBorder: top + height + borderWidth
        }

        top += newRow.height + borderWidth;

        return newRow;
    });
}

function getFormattingRules(dataFormatting) {
    return new FormattingRules(dataFormatting);
}

function getFormatResolver(formattingRules, data, rows, columns, edition) {
    return new FormatResolver(formattingRules, data, rows, columns, edition);
}

function getVisibilityResolver(formattingRules, data, rows, columns, filters) {
    return new VisibilityResolver(formattingRules, data, rows, columns, filters);
}

function getVisibleColumns(visibilityResolver) {
    return visibilityResolver.findVisibleColumns();
}

function getVisibleRows(visibilityResolver) {
    return visibilityResolver.findVisibleRows();
}

function getFixedSize(top, bottom, left, right) {
    return {
        top: top,
        bottom: bottom,
        left: left,
        right: right
    };
}

function getTotalSize(columns, rows) {
    return {
        width: columns.length ? columns.at(-1).rightWithBorder : 0,
        height: rows.length ? rows.at(-1).bottomWithBorder : 0
    };
}

function getTextResolver() {
    return new TextResolver();
}

const requiredMargin = 200;
const preloadedMargin = 400;
const emptyRect = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
};

function getScrollRect(previous, totalSize, fixedSize, element) {
    // TODO: Is it optimal to use getBoundingClientRect()?
    const size = {
        width: element.getBoundingClientRect().width,
        height: element.getBoundingClientRect().height
    };
    const scrollOffset = {
        left: element.scrollLeft,
        top: element.scrollTop
    };

    const prevScrollRect = previous || emptyRect;

    const totalRect = { left: 0, top: 0, ...totalSize };
    const bounds = subtract(totalRect, fixedSize);
    const scrollRect = subtract({ ...scrollOffset, ...size }, fixedSize);
    const requiredScrollRect = clip(bounds, expand(scrollRect, requiredMargin));
    const preloadedScrollRect = clip(bounds, expand(scrollRect, preloadedMargin));

    if (!contains(bounds, prevScrollRect))
        return preloadedScrollRect;

    if (!contains(prevScrollRect, requiredScrollRect))
        return preloadedScrollRect;

    if (area(prevScrollRect) > 2 * area(preloadedScrollRect))
        return preloadedScrollRect;

    return prevScrollRect;
}

function findColumnIndex(columns, x) {
    if (columns.length === 0)
        return -1;
    if (x < columns[0].leftWithBorder)
        return -1;
    if (x > columns[columns.length - 1].rightWithBorder)
        return -1;

    let iterA = 0;
    let iterC = columns.length - 1;

    while (iterA <= iterC) {
        const iterB = Math.floor((iterA + iterC) / 2);

        if (x < columns[iterB].leftWithBorder)
            iterC = iterB - 1;
        else if (x > columns[iterB].rightWithBorder)
            iterA = iterB + 1;
        else
            return iterB;
    }

    return -1;
}

function findRowIndex(rows, y) {
    if (rows.length === 0)
        return -1;
    if (y < rows[0].topWithBorder)
        return -1;
    if (y > rows[rows.length - 1].bottomWithBorder)
        return -1;

    let iterA = 0;
    let iterC = rows.length - 1;

    while (iterA <= iterC) {
        const iterB = Math.floor((iterA + iterC) / 2);

        if (y < rows[iterB].topWithBorder)
            iterC = iterB - 1;
        else if (y > rows[iterB].bottomWithBorder)
            iterA = iterB + 1;
        else
            return iterB;
    }

    return -1;
}

function getHoveredCell(element, mousePosition, rows, columns, fixedSize, totalSize) {
    if (!mousePosition)
        return null;

    const scrollOffset = {
        left: element.scrollLeft,
        top: element.scrollTop
    };

    const clientSize = {
        width: element.clientWidth,
        height: element.clientHeight
    };

    const x = mousePosition.x <= fixedSize.left
        ? mousePosition.x
        : mousePosition.x >= clientSize.width - fixedSize.right
            ? totalSize.width - clientSize.width + mousePosition.x
            : mousePosition.x + scrollOffset.left;
    const y = mousePosition.y <= fixedSize.top
        ? mousePosition.y
        : mousePosition.y >= clientSize.height - fixedSize.bottom
            ? totalSize.height - clientSize.height + mousePosition.y
            : mousePosition.y + scrollOffset.top;

    const hoverRowIndex = findRowIndex(rows, y);
    const hoverColumnIndex = findColumnIndex(columns, x);

    if (hoverRowIndex === -1 || hoverColumnIndex === -1)
        return null;

    return {
        rowId: rows[hoverRowIndex].id,
        columnId: columns[hoverColumnIndex].id
    };
}

function getLookup(elements) {
    return elements.reduce((lookup, element) => lookup.set(element.key, element), new Map());
}

function getHighlightedCells(isMouseDown, focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup) {
    if (!isMouseDown)
        return [];
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

export default function updateState(context) {
    console.count('updateState');

    const options = { ...context.localOptions, ...context.externalOptions };
    const memory = context.memory;
    const previousState = context.state;

    // TODO: Move to utils
    function cache(key, func, dependencies) {
        const previousDependencies = memory[key] && memory[key].dependencies;
        if (!previousDependencies || dependencies.some((dependency, index) => dependency !== previousDependencies[index]))
            memory[key] = { value: func(...dependencies), dependencies };
        return memory[key].value;
    }

    const devicePixelRatio = window.devicePixelRatio; // TODO: Trigger update on devicePixelRatio change
    const borderWidth = options.borderWidth / devicePixelRatio;
    const data = options.data;
    const dataFormatting = cache('dataFormatting', getDataFormattingRules, [options.formatting, options.dataSelector]);
    const editedCellsAndFilters = cache('editedCellsAndFilters', getEditedCellsAndFilters, [options.editedCells, options.filters]);
    const edition = cache('edition', getEdition, [editedCellsAndFilters]);
    const filters = cache('filters', getFilters, [options.filters]);
    const invokedColumns = cache('invokedColumns', getColumnsOrRows, [options.columns, data]);
    const invokedRows = cache('invokedRows', getColumnsOrRows, [options.rows, data]);
    const unfilteredColumns = cache('unfilteredColumns', getResolvedColumnsOrRows, [invokedColumns, options.pinnedLeft, options.pinnedRight]);
    const unfilteredRows = cache('unfilteredRows', getResolvedColumnsOrRows, [invokedRows, options.pinnedTop, options.pinnedBottom]);
    const visibilityFormatting = cache('visibilityFormatting', getVisibilityFormattingRules, [dataFormatting]);
    const visibilityFormattingRules = cache('visibilityFormattingRules', getFormattingRules, [visibilityFormatting]);
    const visibilityResolver = cache('visibilityResolver', getVisibilityResolver, [visibilityFormattingRules, data, unfilteredRows, unfilteredColumns, filters]);
    const filteredColumns = cache('filteredColumns', getVisibleColumns, [visibilityResolver]);
    const filteredRows = cache('filteredRows', getVisibleRows, [visibilityResolver]);
    const columns = cache('columns', getPlacedColumns, [filteredColumns, devicePixelRatio, borderWidth]);
    const rows = cache('rows', getPlacedRows, [filteredRows, devicePixelRatio, borderWidth]);
    const columnLookup = cache('columnLookup', getLookup, [columns]);
    const rowLookup = cache('rowLookup', getLookup, [rows]);
    const focusedCell = options.focusedCell;
    const sections = cache('sections', getSections, [columns, rows]);
    const selectedCells = options.selectedCells;
    const fixedSize = cache('fixedSize', getFixedSize, [sections.top.height, sections.bottom.height, sections.left.width, sections.right.width]);
    const totalSize = cache('totalSize', getTotalSize, [columns, rows]);
    // TODO: do some proper caching, so that if value is not changed, the old value is returned (currently not working because of scrolling)
    const hoveredCell = getHoveredCell(context.element, context.mousePosition, rows, columns, fixedSize, totalSize);
    const isMouseDown = context.isMouseDown;
    const highlightedCells = cache('highlightedCells', getHighlightedCells, [isMouseDown, focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup]);
    const selection = cache('selection', getSelection, [selectedCells]);
    const highlight = cache('highlight', getSelection, [highlightedCells]);
    // TODO: addDataFormattingRules and addRenderFormattingRules should remove unnecessary rules
    const renderFormatting = cache('renderFormatting', getRenderFormattingRules, [dataFormatting, hoveredCell, focusedCell, selection, highlight, edition]);
    const renderFormattingRules = cache('renderFormattingRules', getFormattingRules, [renderFormatting]);
    const renderFormatResolver = cache('renderFormatResolver', getFormatResolver, [renderFormattingRules, data, rows, columns, edition]);
    const inputFormatting = cache('inputFormatting', getInputFormattingRules, [dataFormatting]);
    const inputFormattingRules = cache('inputFormattingRules', getFormattingRules, [inputFormatting]);
    const inputFormatResolver = cache('inputFormatResolver', getFormatResolver, [inputFormattingRules, data, rows, columns, edition]);
    const textResolver = cache('textResolver', getTextResolver, []);

    // cache result, but not call
    const scrollRect = getScrollRect(previousState?.scrollRect, totalSize, fixedSize, context.element);

    context.state = {
        options,
        devicePixelRatio,
        borderWidth,
        data,
        dataFormatting,
        edition,
        filters,
        unfilteredColumns,
        unfilteredRows,
        visibilityFormatting,
        visibilityResolver,
        filteredColumns,
        filteredRows,
        columns,
        rows,
        sections,
        selectedCells,
        selection,
        highlight,
        hoveredCell,
        focusedCell,
        renderFormatting,
        renderFormatResolver,
        inputFormatting,
        inputFormatResolver,
        fixedSize,
        totalSize,
        textResolver,
        scrollRect,
        highlightedCells,
    };
}