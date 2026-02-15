/** @import * as Types from "../typings.js"; */

import getEditableCells from "../state-utils/getEditableCells.js";
import getDataFormatting from "../state-utils/getDataFormatting.js";
import getInputFormatting from "../state-utils/getInputFormatting.js";
import getRenderFormatting from "../state-utils/getRenderFormatting.js";
import getSections from "../state-utils/getSections.js";
import getEditedCellsAndFilters from "../state-utils/getEditedCellsAndFilters.js";
import getEdition from "../state-utils/getEdition.js";
import getSelection from "../state-utils/getSelection.js";
import { getGeneratedColumns, getGeneratedRows } from "../state-utils/getGenerated.js";
import { getResolvedColumns, getResolvedRows } from "../state-utils/getResolved.js";
import { getPlacedColumns, getPlacedRows } from "../state-utils/getPlaced.js";
import getFormattingRules from "../state-utils/getFormattingRules.js";
import getFormatResolver from "../state-utils/getFormatResolver.js";
import { getFilteredColumns as getFilteredColumns, getFilteredRows as getFilteredRows } from "../state-utils/getFiltered.js";
import getFixedSize from "../state-utils/getFixedSize.js";
import getTotalSize from "../state-utils/getTotalSize.js";
import getTextResolver from "../state-utils/getTextResolver.js";
import getScrollRect from "../state-utils/getScrollRect.js";
import getHoveredCell from "../state-utils/getHoveredCell.js";
import getLookup from "../state-utils/getLookup.js";
import getHighlightedCells from "../state-utils/getHighlightedCells.js";
import getInputPlacement from "../state-utils/getInputPlacement.js";
import getIsTextValid from "../state-utils/getIsTextValid.js";
import { getUnfoldedColumns, getUnfoldedRows } from "../state-utils/getUnfolded.js";
import getFilteringRules from "../state-utils/getFilteringRules.js";
import getFilterFormatting from "../state-utils/getFilterFormatting.js";
import getMeasureFormatting from "../state-utils/getMeasureFormatting.js";
import { getMeasuredColumns, getMeasuredRows } from "../state-utils/getMeasured.js";
import getKeys from "../state-utils/getKeys.js";
import getSortingFormatting from "../state-utils/getSortingFormatting.js";
import getSortOrderFormatting from "../state-utils/getSortOrderFormatting.js";
import getSortingRules from "../state-utils/getSortingRules.js";
import { getSortedColumns, getSortedRows } from "../state-utils/getSorted.js";
import { getResizableColumn, getResizableRow } from "../state-utils/getResizable.js";
import getResolvedSortBy from "../state-utils/getResolvedSortBy.js";
import getResolvedFilters from "../state-utils/getResolvedFilters.js";
import { getActiveColumns, getActiveRows } from "../state-utils/getActive.js";
import getContextFormatting from "../state-utils/getContextFormatting.js";
import getTooltip from "../state-utils/getTooltip.js";
import getTooltipPlacement from "../state-utils/getTooltipPlacement.js";
import getOrder from "../state-utils/getOrder.js";
import { getOrderedColumns, getOrderedRows } from "../state-utils/getOrdered.js";
import { getStaticColumns, getStaticRows } from "../state-utils/getStatic.js";
import getPinning from "../state-utils/getPinning.js";
import getClientSize from "../state-utils/getClientSize.js";
import getScrollOffset from "../state-utils/getScrollOffset.js";
import getInternalPosition from "../state-utils/getInternalPosition.js";
import stringifyId from "../core-utils/stringifyId.js";
import { getHorizontalScrollTarget, getVerticalScrollTarget } from "../state-utils/getScrollTarget.js";
import getResolvedScrollSpeed from "../state-utils/getResolvedScrollSpeed.js";
import getScrollState from "../state-utils/getScrollState.js";
import getStyleState from "../state-utils/getStyleState.js";
import getRenderState from "../state-utils/getRenderState.js";
import getInputState from "../state-utils/getInputState.js";
import getCursorState from "../state-utils/getCursorState.js";
import getTooltipState from "../state-utils/getTooltipState.js";
import getDynamicRowHeight from "../state-utils/getDynamicRowHeight.js";

/**
 * @param {Types.Position} a
 * @param {Types.Position} b
 * @returns {boolean}
 */
function comparePositions(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return a.x === b.x && a.y === b.y;
}

/**
 * @param {Types.ClientSize} a
 * @param {Types.ClientSize} b
 * @returns {boolean}
 */
function compareClientSizes(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return a.width === b.width && a.height === b.height;
}

/**
 * @param {Types.ScrollOffset} a
 * @param {Types.ScrollOffset} b
 * @returns {boolean}
 */
function compareScrollOffsets(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return a.left === b.left && a.top === b.top;
}

/**
 * @param {Types.Rect} a
 * @param {Types.Rect} b
 * @returns {boolean}
 */
function compareRects(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return a.left === b.left && a.top === b.top && a.width === b.width && a.height === b.height;
}

/**
 * @param {Types.CellId} a
 * @param {Types.CellId} b
 * @returns {boolean}
 */
function compareCellIds(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return stringifyId(a.rowId) === stringifyId(b.rowId) && stringifyId(a.columnId) === stringifyId(b.columnId);
}

/**
 * @param {Types.StyleState} a
 * @param {Types.StyleState} b
 * @returns {boolean}
 */
function compareStyleStates(a, b) {
    if (!a && !b)
        return true;
    if (!a || !b)
        return false;
    return a.scrollbarWidth === b.scrollbarWidth;
}


// TODO: write some test to check if the cache is working properly
/**
 * @param {Types.Context} context
 */
export default function updateState(context) {
    // console.count('updateState');

    const options = { ...context.localOptions, ...context.externalOptions };
    const memory = context.memory;
    const previousState = context.state;
    const element = context.element;

    /** @type {string[]} */
    const stateChanges = [];

    // TODO: Move to utils
    /**
     * @template {keyof Types.Memory} K
     * @template {Array<*>} U
     * @param {K} key
     * @param {(...args: U) => Types.Memory[K]['value']} func
     * @param {U} dependencies
     * @param {(a: Types.Memory[K]['value'], b: Types.Memory[K]['value']) => boolean} [comparator]
     * @returns {Types.Memory[K]['value']}
     */
    function cache(key, func, dependencies, comparator = (a, b) => a === b) {
        const previousDependencies = memory[key] && memory[key].dependencies;
        if (!previousDependencies || dependencies.some((dependency, index) => dependency !== previousDependencies[index])) {
            const previousValue = memory[key] && memory[key].value;
            const previousVersion = memory[key] && memory[key].version || 0;
            const newValue = func(...dependencies);
            if (!comparator(previousValue, newValue)) {
                memory[key] = /** @type {Types.Memory[K]} */ ({ value: newValue, dependencies, version: previousVersion + 1 });
                stateChanges.push(key);
            } else {
                memory[key] = /** @type {Types.Memory[K]} */ ({ value: previousValue, dependencies, version: previousVersion });
            }
        }
        return memory[key].value;
    }

    /**
     * @template {keyof Types.Memory} K
     * @param {K} key
     * @param {Types.Memory[K]['value']} value
     * @param {(value: Types.Memory[K]['value']) => void} callback
     */
    function invoke_change_callback(key, value, callback) {
        const previousValue = memory[key] && memory[key].value;
        if (previousValue !== value) {
            memory[key] = /** @type {Types.Memory[K]} */ ({ value });
            callback(value);
        }
    }

    const devicePixelRatio = /** @type {number} */ cache('devicePixelRatio', v => v, [window.devicePixelRatio]);
    const borderWidth = /** @type {number} */ cache('borderWidth', v => v, [options.borderWidth / devicePixelRatio]);
    const data = options.data;
    const text = context.input.value;
    const sortBy = cache('sortBy', getResolvedSortBy, [options.sortBy]);
    const filters = cache('filters', getResolvedFilters, [options.filters]);
    const textResolver = cache('textResolver', getTextResolver, []);
    const dataFormatting = cache('dataFormatting', getDataFormatting, [options.formatting, options.dataSelector, sortBy]);
    const editedCellsAndFilters = cache('editedCellsAndFilters', getEditedCellsAndFilters, [options.editedCells, filters]);
    const edition = cache('edition', getEdition, [editedCellsAndFilters]);
    const invokedColumns = cache('invokedColumns', getGeneratedColumns, [options.columns, data]);
    const invokedRows = cache('invokedRows', getGeneratedRows, [options.rows, data]);
    const mousePosition = cache('mousePosition', v => v, [context.mousePosition], comparePositions);
    // TODO: throw on duplicate ids
    // TODO: throw on duplicate row/column filter ids

    // Resolving
    const unfoldedColumns = cache('unfoldedColumns', getUnfoldedColumns, [invokedColumns, data]);
    const unfoldedRows = cache('unfoldedRows', getUnfoldedRows, [invokedRows, data]);
    const dynamicColumnWidth = 150;
    const dynamicRowHeight = cache('dynamicRowHeight', getDynamicRowHeight, [textResolver]);
    const unfilteredColumns = cache('unfilteredColumns', getResolvedColumns, [unfoldedColumns, options.columnWidths, borderWidth, devicePixelRatio, dynamicColumnWidth]);
    const unfilteredRows = cache('unfilteredRows', getResolvedRows, [unfoldedRows, options.rowHeights, borderWidth, devicePixelRatio, dynamicRowHeight]);
    const unfilteredColumnKeys = cache('unfilteredColumnKeys', getKeys, [unfilteredColumns]);
    const unfilteredRowKeys = cache('unfilteredRowKeys', getKeys, [unfilteredRows]);

    // Ordering
    const columnsOrder = cache('columnsOrder', getOrder, [options.columnsOrder]);
    const rowsOrder = cache('rowsOrder', getOrder, [options.rowsOrder]);
    const orderedColumns = cache('orderedColumns', getOrderedColumns, [unfilteredColumns, columnsOrder]);
    const orderedRows = cache('orderedRows', getOrderedRows, [unfilteredRows, rowsOrder]);

    // Filtering
    const filterFormatting = cache('filterFormatting', getFilterFormatting, [dataFormatting]);
    const filterFormattingRules = cache('filterFormattingRules', getFormattingRules, [filterFormatting]);
    const filteringRules = cache('filteringRules', getFilteringRules, [options.filtering]);
    const filteredColumns = cache('filteredColumns', getFilteredColumns, [filters, filteringRules, filterFormattingRules, data, orderedRows, orderedColumns, edition]);
    const filteredRows = cache('filteredRows', getFilteredRows, [filters, filteringRules, filterFormattingRules, data, orderedRows, orderedColumns, edition]);

    // Sorting
    const sortingFormatting = cache('sortingFormatting', getSortingFormatting, [dataFormatting]);
    const sortingFormattingRules = cache('sortingFormattingRules', getFormattingRules, [sortingFormatting]);
    const sortingRules = cache('sortingRules', getSortingRules, [options.sorting]);
    const sortedColumns = cache('sortedColumns', getSortedColumns, [sortBy, sortingRules, sortingFormattingRules, data, filteredRows, filteredColumns, edition]);
    const sortedRows = cache('sortedRows', getSortedRows, [sortBy, sortingRules, sortingFormattingRules, data, filteredRows, filteredColumns, edition]);

    // Shaping finalization
    const shapedColumns = sortedColumns;
    const shapedRows = sortedRows;
    const pinning = cache('pinning', getPinning, [shapedColumns, shapedRows, options.pinnedTop, options.pinnedBottom, options.pinnedLeft, options.pinnedRight]);

    // Measuring
    const measureFormatting = cache('measureFormatting', getMeasureFormatting, [dataFormatting]);
    const measureFormattingRules = cache('measureFormattingRules', getFormattingRules, [measureFormatting]);
    const measureFormatResolver = cache('measureFormatResolver', getFormatResolver, [measureFormattingRules, data, shapedRows, shapedColumns, edition]);
    const columnWidthCache = context.columnWidthCache;
    const rowHeightCache = context.rowHeightCache;
    const measuredColumns = cache('measuredColumns', getMeasuredColumns, [shapedColumns, shapedRows, textResolver, measureFormatResolver, columnWidthCache, unfilteredColumnKeys, devicePixelRatio]);
    const measuredRows = cache('measuredRows', getMeasuredRows, [shapedColumns, shapedRows, textResolver, measureFormatResolver, rowHeightCache, unfilteredRowKeys, devicePixelRatio]);

    // Scrolling
    const fixedSize = cache('fixedSize', getFixedSize, [measuredColumns, measuredRows, pinning, borderWidth]);
    const totalSize = cache('totalSize', getTotalSize, [measuredColumns, measuredRows, borderWidth]);
    const clientSize = cache('clientSize', v => v, [getClientSize(element)], compareClientSizes);
    const boundingClientSize = cache('boundingClientSize', v => v, [getClientSize(element)], compareClientSizes);
    const scrollOffset = cache('scrollOffset', v => v, [getScrollOffset(element)], compareScrollOffsets);
    const internalMousePosition = cache('internalMousePosition', getInternalPosition, [mousePosition, clientSize, scrollOffset, fixedSize, totalSize], comparePositions);
    const scrollRect = cache('scrollRect', getScrollRect, [previousState?.renderState?.scrollRect, scrollOffset, totalSize, fixedSize, boundingClientSize], compareRects);
    const horizontalScrollTarget = cache('horizontalScrollTarget', getHorizontalScrollTarget, [options.horizontalScrollTarget, options.disableScrollOnHover, measuredColumns, pinning, internalMousePosition, fixedSize, totalSize, clientSize, borderWidth]);
    const verticalScrollTarget = cache('verticalScrollTarget', getVerticalScrollTarget, [options.verticalScrollTarget, options.disableScrollOnHover, measuredRows, pinning, internalMousePosition, fixedSize, totalSize, clientSize, borderWidth]);
    const horizontalScrollSpeed = cache('horizontalScrollSpeed', getResolvedScrollSpeed, [options.horizontalScrollSpeed]);
    const verticalScrollSpeed = cache('verticalScrollSpeed', getResolvedScrollSpeed, [options.verticalScrollSpeed]);

    // Dynamic allocation
    const staticColumns = cache('staticColumns', getStaticColumns, [data, measuredColumns, pinning, scrollRect, fixedSize, borderWidth]);
    const staticRows = cache('staticRows', getStaticRows, [data, measuredRows, pinning, scrollRect, fixedSize, borderWidth]);

    // Placement
    const columns = cache('columns', getPlacedColumns, [staticColumns, pinning, borderWidth]);
    const rows = cache('rows', getPlacedRows, [staticRows, pinning, borderWidth]);
    const columnLookup = cache('columnLookup', getLookup, [columns]);
    const rowLookup = cache('rowLookup', getLookup, [rows]);
    const focusedCell = options.focusedCell;
    const sections = cache('sections', getSections, [columns, rows]);
    const selectedCells = options.selectedCells;
    const hoveredCell = cache('hoveredCell', getHoveredCell, [internalMousePosition, rows, columns, fixedSize, totalSize], compareCellIds);
    const isReordering = context.isReordering;
    // TODO: this does not seem to be cached properly (see onStateChange)
    const resizableColumn = context.resizingColumn || cache('resizableColumn', getResizableColumn, [columns, columnLookup, rowLookup, hoveredCell, internalMousePosition, isReordering]);
    const resizableRow = context.resizingRow || cache('resizableRow', getResizableRow, [rows, columnLookup, rowLookup, hoveredCell, internalMousePosition, isReordering]);
    const isMouseDown = context.isMouseDown;
    const canHighlight = !resizableColumn && !resizableRow && !context.didReorder;
    const highlightedCells = cache('highlightedCells', getHighlightedCells, [isMouseDown, canHighlight, focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup]);
    const selection = cache('selection', getSelection, [selectedCells]);
    const highlight = cache('highlight', getSelection, [highlightedCells]);
    // TODO: addDataFormattingRules and addRenderFormattingRules should remove unnecessary rules
    const renderFormatting = cache('renderFormatting', getRenderFormatting, [dataFormatting, hoveredCell, focusedCell, selection, highlight, edition, sortBy, resizableColumn, resizableRow, options.borderWidth, isReordering, context.reorderedColumn, context.reorderedRow]);
    const renderFormattingRules = cache('renderFormattingRules', getFormattingRules, [renderFormatting]);
    const renderFormatResolver = cache('renderFormatResolver', getFormatResolver, [renderFormattingRules, data, rows, columns, edition]);
    const sortOrderFormatting = cache('sortOrderFormatting', getSortOrderFormatting, [dataFormatting]);
    const sortOrderFormattingRules = cache('sortOrderFormattingRules', getFormattingRules, [sortOrderFormatting]);
    const sortOrderFormatResolver = cache('sortOrderFormatResolver', getFormatResolver, [sortOrderFormattingRules, data, rows, columns, edition]);
    const inputFormatting = cache('inputFormatting', getInputFormatting, [dataFormatting]);
    const inputFormattingRules = cache('inputFormattingRules', getFormattingRules, [inputFormatting]);
    const inputFormatResolver = cache('inputFormatResolver', getFormatResolver, [inputFormattingRules, data, rows, columns, edition]);
    const editableCells = cache('editableCells', getEditableCells, [selectedCells, inputFormatResolver, columnLookup, rowLookup]);
    const inputPlacement = cache('inputPlacement', getInputPlacement, [editableCells, focusedCell, columnLookup, rowLookup, sections]);
    const isTextValid = cache('isTextValid', getIsTextValid, [text, editableCells]);
    const contextFormatting = cache('contextFormatting', getContextFormatting, [dataFormatting]);
    const contextFormattingRules = cache('contextFormattingRules', getFormattingRules, [contextFormatting]);
    const contextFormatResolver = cache('contextFormatResolver', getFormatResolver, [contextFormattingRules, data, rows, columns, edition]);
    const tooltip = cache('tooltip', getTooltip, [hoveredCell, contextFormatResolver, columnLookup, rowLookup]);
    const tooltipPlacement = cache('tooltipPlacement', getTooltipPlacement, [tooltip, mousePosition]);

    // Sub-states
    const renderState = cache('renderState', getRenderState, [sections, devicePixelRatio, scrollRect, renderFormatResolver, borderWidth, textResolver]);
    const inputState = cache('inputState', getInputState, [inputPlacement, isTextValid]);
    const cursorState = cache('cursorState', getCursorState, [resizableColumn, resizableRow, context.isReordering]);
    const tooltipState = cache('tooltipState', getTooltipState, [tooltip, tooltipPlacement]);
    const scrollState = cache('scrollState', getScrollState, [verticalScrollTarget, horizontalScrollTarget, verticalScrollSpeed, horizontalScrollSpeed, memory.clientSize.version]);

    // Style
    const styleState = cache('styleState', getStyleState, [options.style], compareStyleStates);

    // callbacks
    const activeColumns = cache('activeColumns', getActiveColumns, [columns]);
    const activeRows = cache('activeRows', getActiveRows, [rows]);

    invoke_change_callback('activeColumnsCallback', activeColumns, options.onActiveColumnsChange);
    invoke_change_callback('activeRowsCallback', activeRows, options.onActiveRowsChange);
    invoke_change_callback('hoveredCellCallback', hoveredCell, options.onHoveredCellChange);

    options.onStateChange(stateChanges);

    context.state = {
        options,
        edition,
        columns,
        rows,
        hoveredCell,
        focusedCell,
        inputFormatResolver,
        fixedSize,
        totalSize,
        clientSize,
        scrollOffset,
        highlightedCells,
        columnLookup,
        rowLookup,
        text,
        scrollState,
        styleState,
        sortOrderFormatResolver,
        renderState,
        inputState,
        cursorState,
        tooltipState,
    };
}