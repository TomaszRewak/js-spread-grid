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
import { getVisibleColumns, getVisibleRows } from "../state-utils/getVisible.js";
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

function updateStateInternal(context) {
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
    const text = context.input.value;
    const dataFormatting = cache('dataFormatting', getDataFormatting, [options.formatting, options.dataSelector]);
    const editedCellsAndFilters = cache('editedCellsAndFilters', getEditedCellsAndFilters, [options.editedCells, options.filters]);
    const edition = cache('edition', getEdition, [editedCellsAndFilters]);
    const invokedColumns = cache('invokedColumns', getInvoked, [options.columns, data]);
    const invokedRows = cache('invokedRows', getInvoked, [options.rows, data]);
    // TODO: throw on duplicate ids
    // TODO: throw on duplicate row/column filter ids
    const unfoldedColumns = cache('unfoldedColumns', getUnfoldedColumns, [invokedColumns, data]);
    const unfoldedRows = cache('unfoldedRows', getUnfoldedRows, [invokedRows, data]);
    const unfilteredColumns = cache('unfilteredColumns', getResolvedColumns, [unfoldedColumns, options.pinnedLeft, options.pinnedRight]);
    const unfilteredRows = cache('unfilteredRows', getResolvedRows, [unfoldedRows, options.pinnedTop, options.pinnedBottom]);
    
    // Filtering
    const filterFormatting = cache('filterFormatting', getFilterFormatting, [dataFormatting]);
    const filterFormattingRules = cache('filterFormattingRules', getFormattingRules, [filterFormatting]);
    const filteringRules = cache('filteringRules', getFilteringRules, [options.filtering]);
    const filteredColumns = cache('filteredColumns', getVisibleColumns, [options.filters, filteringRules, filterFormattingRules, data, unfilteredRows, unfilteredColumns, edition]);
    const filteredRows = cache('filteredRows', getVisibleRows, [options.filters, filteringRules, filterFormattingRules, data, unfilteredRows, unfilteredColumns, edition]);

    // Placement
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
    const renderFormatting = cache('renderFormatting', getRenderFormatting, [dataFormatting, hoveredCell, focusedCell, selection, highlight, edition]);
    const renderFormattingRules = cache('renderFormattingRules', getFormattingRules, [renderFormatting]);
    const renderFormatResolver = cache('renderFormatResolver', getFormatResolver, [renderFormattingRules, data, rows, columns, edition]);
    const inputFormatting = cache('inputFormatting', getInputFormatting, [dataFormatting]);
    const inputFormattingRules = cache('inputFormattingRules', getFormattingRules, [inputFormatting]);
    const inputFormatResolver = cache('inputFormatResolver', getFormatResolver, [inputFormattingRules, data, rows, columns, edition]);
    const textResolver = cache('textResolver', getTextResolver, []);
    const editableCells = cache('editableCells', getEditableCells, [selectedCells, inputFormatResolver, columnLookup, rowLookup]);
    const inputPlacement = cache('inputPlacement', getInputPlacement, [editableCells, focusedCell, columnLookup, rowLookup]);
    const isTextValid = cache('isTextValid', getIsTextValid, [text, editableCells]);

    // cache result, but not call
    const scrollRect = getScrollRect(previousState?.scrollRect, totalSize, fixedSize, context.element);

    context.state = {
        options,
        devicePixelRatio,
        borderWidth,
        data,
        dataFormatting,
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
        isTextValid
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