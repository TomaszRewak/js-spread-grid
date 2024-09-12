import getEditableCells from "../state-utils/getEditableCells.js";
import getDataFormatting from "../state-utils/getDataFormatting.js";
import getInputFormatting from "../state-utils/getInputFormatting.js";
import getRenderFormatting from "../state-utils/getRenderFormatting.js";
import getSections from "../state-utils/getSections.js";
import getEditedCellsAndFilters from "../state-utils/getEditedCellsAndFilters.js";
import getEdition from "../state-utils/getEdition.js";
import getSelection from "../state-utils/getSelection.js";
import getInvoked from "../state-utils/getInvoked.js";
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
import getOrdered from "../state-utils/getOrdered.js";

// TODO: write some test to check if the cache is working properly
function updateStateInternal(context) {
    // console.count('updateState');

    const options = { ...context.localOptions, ...context.externalOptions };
    const memory = context.memory;
    const previousState = context.state;
    const element = context.element;
    const stateChanges = [];

    // TODO: Move to utils
    function cache(key, func, dependencies) {
        const previousDependencies = memory[key] && memory[key].dependencies;
        if (!previousDependencies || dependencies.some((dependency, index) => dependency !== previousDependencies[index])) {
            memory[key] = { value: func(...dependencies), dependencies };
            stateChanges.push(key);
        }
        return memory[key].value;
    }

    function cache_value_deep(key, value) {
        const previousValue = memory[key] && memory[key].value;
        if (JSON.stringify(previousValue) !== JSON.stringify(value)) {
            memory[key] = { value };
            stateChanges.push(key);
        }
        return memory[key].value;
    }

    function invoke_change_callback(key, value, callback) {
        const previousValue = memory[key] && memory[key].value;
        if (previousValue !== value) {
            memory[key] = { value };
            callback(value);
        }
    }

    const devicePixelRatio = window.devicePixelRatio; // TODO: Trigger update on devicePixelRatio change
    const borderWidth = options.borderWidth / devicePixelRatio;
    const data = options.data;
    const text = context.input.value;
    const sortBy = cache('sortBy', getResolvedSortBy, [options.sortBy]);
    const filters = cache('filters', getResolvedFilters, [options.filters]);
    const textResolver = cache('textResolver', getTextResolver, []);
    const dataFormatting = cache('dataFormatting', getDataFormatting, [options.formatting, options.dataSelector, sortBy]);
    const editedCellsAndFilters = cache('editedCellsAndFilters', getEditedCellsAndFilters, [options.editedCells, filters]);
    const edition = cache('edition', getEdition, [editedCellsAndFilters]);
    const invokedColumns = cache('invokedColumns', getInvoked, [options.columns, data]);
    const invokedRows = cache('invokedRows', getInvoked, [options.rows, data]);
    // TODO: throw on duplicate ids
    // TODO: throw on duplicate row/column filter ids

    // Resolving
    const unfoldedColumns = cache('unfoldedColumns', getUnfoldedColumns, [invokedColumns, data]);
    const unfoldedRows = cache('unfoldedRows', getUnfoldedRows, [invokedRows, data]);
    const unfilteredColumns = cache('unfilteredColumns', getResolvedColumns, [unfoldedColumns, options.pinnedLeft, options.pinnedRight, options.columnWidths]);
    const unfilteredRows = cache('unfilteredRows', getResolvedRows, [unfoldedRows, options.pinnedTop, options.pinnedBottom, options.rowHeights]);
    const unfilteredColumnKeys = cache('unfilteredColumnKeys', getKeys, [unfilteredColumns]);
    const unfilteredRowKeys = cache('unfilteredRowKeys', getKeys, [unfilteredRows]);

    // Ordering
    const columnsOrder = cache('columnsOrder', getOrder, [options.columnsOrder]);
    const rowsOrder = cache('rowsOrder', getOrder, [options.rowsOrder]);
    const orderedColumns = cache('orderedColumns', getOrdered, [unfilteredColumns, columnsOrder]);
    const orderedRows = cache('orderedRows', getOrdered, [unfilteredRows, rowsOrder]);

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

    // Shaping
    const shapedColumns = sortedColumns;
    const shapedRows = sortedRows;

    // Measuring
    const measureFormatting = cache('measureFormatting', getMeasureFormatting, [dataFormatting]);
    const measureFormattingRules = cache('measureFormattingRules', getFormattingRules, [measureFormatting]);
    const measureFormatResolver = cache('measureFormatResolver', getFormatResolver, [measureFormattingRules, data, shapedRows, shapedColumns, edition]);
    const columnWidthCache = context.columnWidthCache;
    const rowHeightCache = context.rowHeightCache;
    const measuredColumns = cache('measuredColumns', getMeasuredColumns, [shapedColumns, shapedRows, textResolver, measureFormatResolver, columnWidthCache, unfilteredColumnKeys]);
    const measuredRows = cache('measuredRows', getMeasuredRows, [shapedColumns, shapedRows, textResolver, measureFormatResolver, rowHeightCache, unfilteredRowKeys]);

    // Placement
    const columns = cache('columns', getPlacedColumns, [measuredColumns, devicePixelRatio, borderWidth]);
    const rows = cache('rows', getPlacedRows, [measuredRows, devicePixelRatio, borderWidth]);
    const columnLookup = cache('columnLookup', getLookup, [columns]);
    const rowLookup = cache('rowLookup', getLookup, [rows]);
    const focusedCell = options.focusedCell;
    const sections = cache('sections', getSections, [columns, rows]);
    const selectedCells = options.selectedCells;
    const fixedSize = cache('fixedSize', getFixedSize, [sections.top.height, sections.bottom.height, sections.left.width, sections.right.width]);
    const totalSize = cache('totalSize', getTotalSize, [columns, rows]);
    const hoveredCell = cache_value_deep('hoveredCell', getHoveredCell(element, context.mousePosition, rows, columns, fixedSize, totalSize));
    const isReordering = context.isReordering;
    // TODO: this does not seem to be cached properly (see onStateChange)
    const resizableColumn = context.resizingColumn || cache('resizableColumn', getResizableColumn, [columns, columnLookup, rowLookup, hoveredCell, element, context.mousePosition, isReordering, fixedSize, totalSize]);
    const resizableRow = context.resizingRow || cache('resizableRow', getResizableRow, [rows, columnLookup, rowLookup, hoveredCell, element, context.mousePosition, isReordering, fixedSize, totalSize]);
    const isMouseDown = context.isMouseDown;
    const canHighlight = !resizableColumn && !resizableRow && !context.didReorder;
    const highlightedCells = cache('highlightedCells', getHighlightedCells, [isMouseDown, canHighlight, focusedCell, hoveredCell, columns, rows, columnLookup, rowLookup]);
    const selection = cache('selection', getSelection, [selectedCells]);
    const highlight = cache('highlight', getSelection, [highlightedCells]);
    // TODO: addDataFormattingRules and addRenderFormattingRules should remove unnecessary rules
    const renderFormatting = cache('renderFormatting', getRenderFormatting, [dataFormatting, hoveredCell, focusedCell, selection, highlight, edition, sortBy, resizableColumn, resizableRow, options.borderWidth, isReordering, context.reorderedColumn, context.reorderedRow]);
    const renderFormattingRules = cache('renderFormattingRules', getFormattingRules, [renderFormatting]);
    const renderFormatResolver = cache('renderFormatResolver', getFormatResolver, [renderFormattingRules, data, rows, columns, edition]);
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
    const tooltipPlacement = cache('tooltipPlacement', getTooltipPlacement, [tooltip, hoveredCell, columnLookup, rowLookup, sections]);
    const scrollRect = cache_value_deep('scrollRect', getScrollRect(previousState?.scrollRect, totalSize, fixedSize, element));

    // callbacks
    const activeColumns = cache('activeColumns', getActiveColumns, [columns]);
    const activeRows = cache('activeRows', getActiveRows, [rows]);

    invoke_change_callback('activeColumnsCallback', activeColumns, options.onActiveColumnsChange);
    invoke_change_callback('activeRowsCallback', activeRows, options.onActiveRowsChange);
    invoke_change_callback('hoveredCellCallback', hoveredCell, options.onHoveredCellChange);

    options.onStateChange(stateChanges);

    context.state = {
        options,
        devicePixelRatio,
        borderWidth,
        data,
        edition,
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
        inputPlacement,
        columnLookup,
        rowLookup,
        text,
        isTextValid,
        resizableColumn,
        resizableRow,
        tooltip,
        tooltipPlacement,
    };
}

export default function updateState(context) {
    if (!context.error) {
        try {
            updateStateInternal(context);
        } catch (error) {
            context.error = error;
        }
    }
}