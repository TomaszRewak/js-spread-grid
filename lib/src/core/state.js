import getEditableCells from "../state-utils/getEditableCells";
import getDataFormattingRules from "../state-utils/getDataFormattingRules";
import getInputFormattingRules from "../state-utils/getInputFormattingRules";
import getRenderFormattingRules from "../state-utils/getRenderFormattingRules";
import getSections from "../state-utils/getSections";
import getVisibilityFormattingRules from "../state-utils/getVisibilityFormattingRules";
import getEditedCellsAndFilters from "../state-utils/getEditedCellsAndFilters";
import getEdition from "../state-utils/getEdition";
import getFilters from "../state-utils/getFilters";
import getSelection from "../state-utils/getSelection";
import getColumnsOrRows from "../state-utils/getColumnsOrRows";
import getResolvedColumnsOrRows from "../state-utils/getResolvedColumnsOrRows";
import getPlacedColumns from "../state-utils/getPlacedColumns";
import getPlacedRows from "../state-utils/getPlacedRows";
import getFormattingRules from "../state-utils/getFormattingRules";
import getFormatResolver from "../state-utils/getFormatResolver";
import getVisibilityResolver from "../state-utils/getVisibilityResolver";
import getVisibleColumns from "../state-utils/getVisibleColumns";
import getVisibleRows from "../state-utils/getVisibleRows";
import getFixedSize from "../state-utils/getFixedSize";
import getTotalSize from "../state-utils/getTotalSize";
import getTextResolver from "../state-utils/getTextResolver";
import getScrollRect from "../state-utils/getScrollRect";
import getHoveredCell from "../state-utils/getHoveredCell";
import getLookup from "../state-utils/getLookup";
import getHighlightedCells from "../state-utils/getHighlightedCells";
import getInputPlacement from "../state-utils/getInputPlacement";
import getIsTextValid from "../state-utils/getIsTextValid";

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
    const text = context.input.value;
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
        inputPlacement,
        columnLookup,
        rowLookup,
        text,
        isTextValid
    };
}