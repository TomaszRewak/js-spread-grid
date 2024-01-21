import React, { createContext, useCallback, useEffect, useMemo } from "react";
import useInvoked from "../hooks/useInvoked";
import getRenderFormattingRules from "../utils/getRenderFormattingRules";
import Selection from "../utils/Selection";
import useChangeCallback from "../hooks/useChangeCallback";
import stringifyId from "../utils/stringifyId";
import getDataFormattingRules from "../utils/getDataFormattingRules";
import useDevicePixelRatio, { roundToPixels } from "../hooks/useDevicePixelRatio";
import getSections from "../utils/getSections";
import getInputFormattingRules from "../utils/getInputFormattingRules";
import Edition from "../utils/Edition";
import FormattingRules from "../utils/FormattingRules";
import FormatResolver from "../utils/FormatResolver";
import getVisibilityFormattingRules from "../utils/getVisibilityFormattingRules";
import Filtering from "../utils/Filtering";
import VisibilityResolver from "../utils/VisibilityResolver";

function compareCells(oldCell, newCell) {
    return stringifyId(oldCell) === stringifyId(newCell);
}

function compareSelectedCells(oldCells, newCells) {
    if (oldCells.length !== newCells.length)
        return false;

    const selection = new Selection(oldCells);
    return newCells.every(cell => selection.isIdSelected(cell.rowId, cell.columnId));
}

function compareEditedCells(oldCells, newCells) {
    if (oldCells.length !== newCells.length)
        return false;

    const edition = new Edition(oldCells);
    return newCells.every(cell => edition.getValueById(cell.rowId, cell.columnId) === cell.value);
}

function compareFilters(oldFilters, newFilters) {
    if (oldFilters.length !== newFilters.length)
        return false;

    const filtering = new Filtering(oldFilters);
    return newFilters.every(filter => filtering.getValueById(filter.rowId, filter.columnId) === filter.value);

}

function getPinned(index, length, pinnedBegin, pinnedEnd) {
    if (index < pinnedBegin)
        return "BEGIN";
    if (index >= length - pinnedEnd)
        return "END";
    return undefined;
}

function useResolvedColumnsOrRows(elements, pinnedBegin, pinnedEnd) {
    return useMemo(() => {
        return elements.map((element, index) => {
            return {
                ...element,
                type: element.type || "DATA",
                index: index,
                key: stringifyId(element.id),
                pinned: getPinned(index, elements.length, pinnedBegin, pinnedEnd)
            }
        });
    }, [elements, pinnedBegin, pinnedEnd]);
}

function usePlacedColumns(columns, devicePixelRatio, borderWidth) {
    return useMemo(() => {
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
    }, [borderWidth, columns, devicePixelRatio]);
}

function usePlacedRows(rows, devicePixelRatio, borderWidth) {
    return useMemo(() => {
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
    }, [borderWidth, rows, devicePixelRatio]);
}

function useFormatResolver(dataFormatting, data, rows, columns, edition) {
    const formattingRules = useMemo(() => new FormattingRules(dataFormatting), [dataFormatting]);
    const formatResolver = useMemo(() => new FormatResolver(formattingRules, data, rows, columns, edition), [formattingRules, data, columns, rows, edition]);

    return formatResolver;
}

function useVisibilityResolver(dataFormatting, data, rows, columns, filters) {
    const formattingRules = useMemo(() => new FormattingRules(dataFormatting), [dataFormatting]);
    const formatResolver = useMemo(() => new VisibilityResolver(formattingRules, data, rows, columns, filters), [formattingRules, data, columns, rows, filters]);

    return formatResolver;
}

const DataContext = createContext();
const ColumnsAndRowsContext = createContext();
const InteractionsContext = createContext();
const RenderingContext = createContext();
const SizeContext = createContext();

export function StateProvider(props) {
    const devicePixelRatio = useDevicePixelRatio();
    const borderWidth = props.borderWidth / devicePixelRatio;
    const data = props.data;
    const dataFormatting = useMemo(() => getDataFormattingRules(props.formatting, props.dataSelector), [props.formatting, props.dataSelector]);
    const editedCellsAndFilters = useMemo(() => [...props.editedCells, ...props.filters.map(filter => ({ columnId: filter.columnId, rowId: filter.rowId, value: filter.expression }))], [props.editedCells, props.filters]);
    const edition = useMemo(() => new Edition(editedCellsAndFilters), [editedCellsAndFilters]);
    const filters = useMemo(() => new Filtering(props.filters), [props.filters]);
    const unfilteredColumns = useResolvedColumnsOrRows(useInvoked(props.columns, [data]), props.pinnedLeft, props.pinnedRight); // TODO: Throw on duplicate ids
    const unfilteredRows = useResolvedColumnsOrRows(useInvoked(props.rows, [data]), props.pinnedTop, props.pinnedBottom);
    const visibilityFormatting = useMemo(() => getVisibilityFormattingRules(dataFormatting), [dataFormatting]);
    const visibilityResolver = useVisibilityResolver(visibilityFormatting, data, unfilteredRows, unfilteredColumns, filters);
    const filteredColumns = useMemo(() => visibilityResolver.findVisibleColumns(), [visibilityResolver]);
    const filteredRows = useMemo(() => visibilityResolver.findVisibleRows(), [visibilityResolver]);
    const columns = usePlacedColumns(filteredColumns, devicePixelRatio, borderWidth);
    const rows = usePlacedRows(filteredRows, devicePixelRatio, borderWidth);
    const sections = useMemo(() => getSections(columns, rows), [columns, rows]);
    const selectedCells = props.selectedCells;
    const selection = useMemo(() => new Selection(props.selectedCells), [props.selectedCells]);
    const highlight = useMemo(() => new Selection(props.highlightedCells), [props.highlightedCells]);
    const hoveredCell = props.hoveredCell;
    const focusedCell = props.focusedCell;
    // TODO: addDataFormattingRules and addRenderFormattingRules should remove unnecessary rules
    const renderFormatting = useMemo(() => getRenderFormattingRules(dataFormatting, hoveredCell, focusedCell, selection, highlight, edition), [dataFormatting, hoveredCell, focusedCell, selection, highlight, edition]);
    const renderFormatResolver = useFormatResolver(renderFormatting, data, rows, columns, edition);
    const inputFormatting = useMemo(() => getInputFormattingRules(dataFormatting), [dataFormatting]);
    const inputFormatResolver = useFormatResolver(inputFormatting, data, rows, columns, edition);
    const fixedSize = useMemo(() => ({
        top: sections.top.height,
        bottom: sections.bottom.height,
        left: sections.left.width,
        right: sections.right.width
    }), [sections.top.height, sections.bottom.height, sections.left.width, sections.right.width]);
    const totalSize = useMemo(() => ({
        width: columns.length ? columns.at(-1).rightWithBorder : 0,
        height: rows.length ? rows.at(-1).bottomWithBorder : 0
    }), [columns, rows]);

    const setSelectedCells = useChangeCallback(props.selectedCells, props.onSelectedCellsChange, compareSelectedCells);
    const setHighlightedCells = useChangeCallback(props.highlightedCells, props.onHighlightedCellsChange, compareSelectedCells);
    const setEditedCells = useChangeCallback(props.editedCells, props.onEditedCellsChange, compareEditedCells);
    const setHoveredCell = useChangeCallback(props.hoveredCell, props.onHoveredCellChange, compareCells);
    const setFocusedCell = useChangeCallback(props.focusedCell, props.onFocusedCellChange, compareCells);
    const setFilters = useChangeCallback(props.filters, props.onFiltersChange, compareFilters);
    const addSelectedCells = useCallback(cells => setSelectedCells(oldSelectedCells => { // TODO: Should the selected cells include info about the section?
        const selection = new Selection(cells);
        return [...cells, ...oldSelectedCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId))];
    }), [setSelectedCells]);
    const addEditedCells = useCallback(cells => setEditedCells(oldEditedCells => {
        const edition = new Edition(cells);
        return [...cells, ...oldEditedCells.filter(cell => !edition.hasValueById(cell.rowId, cell.columnId))];
    }), [setEditedCells]);
    const addFilters = useCallback(filters => setFilters(oldFilters => {
        const filtering = new Filtering(filters);
        return [...filters, ...oldFilters.filter(filter => !filtering.hasValueById(filter.rowId, filter.columnId))];
    }), [setFilters]);
    const removeEditedCells = useCallback(cells => setEditedCells(oldEditedCells => {
        const selection = new Selection(cells);
        return oldEditedCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId));
    }), [setEditedCells]);
    const removeFilters = useCallback(cells => setFilters(oldFilters => {
        const selection = new Selection(cells);
        return oldFilters.filter(filter => !selection.isIdSelected(filter.rowId, filter.columnId));
    }), [setFilters]);

    const contexts = [
        [DataContext, useMemo(() => ({
            data
        }), [data])],
        [ColumnsAndRowsContext, useMemo(() => ({
            columns, rows, sections
        }), [columns, rows, sections])],
        [InteractionsContext, useMemo(() => ({
            selectedCells, selection, hoveredCell, focusedCell, inputFormatResolver, setSelectedCells, setHighlightedCells, setHoveredCell, setEditedCells, setFocusedCell, addSelectedCells, addEditedCells, addFilters, removeEditedCells, removeFilters
        }), [selectedCells, selection, hoveredCell, focusedCell, inputFormatResolver, setSelectedCells, setHighlightedCells, setHoveredCell, setEditedCells, setFocusedCell, addSelectedCells, addEditedCells, addFilters, removeEditedCells, removeFilters])],
        [RenderingContext, useMemo(() => ({
            renderFormatResolver
        }), [renderFormatResolver])],
        [SizeContext, useMemo(() => ({
            fixedSize, totalSize, borderWidth
        }), [fixedSize, totalSize, borderWidth])]
    ];

    return contexts.reduce((children, [Context, value]) => (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    ), props.children);
}

// TODO: see if calling the useContext hook multiple times is a performance issue
export const useData = () => React.useContext(DataContext).data;
export const useColumns = () => React.useContext(ColumnsAndRowsContext).columns;
export const useRows = () => React.useContext(ColumnsAndRowsContext).rows;
export const useSections = () => React.useContext(ColumnsAndRowsContext).sections;
export const useSelectedCells = () => React.useContext(InteractionsContext).selectedCells;
export const useSelection = () => React.useContext(InteractionsContext).selection;
export const useHoveredCell = () => React.useContext(InteractionsContext).hoveredCell;
export const useFocusedCell = () => React.useContext(InteractionsContext).focusedCell;
export const useRenderFormatResolver = () => React.useContext(RenderingContext).renderFormatResolver;
export const useInputFormatResolver = () => React.useContext(InteractionsContext).inputFormatResolver;
export const useSetSelectedCells = () => React.useContext(InteractionsContext).setSelectedCells;
export const useSetHighlightedCells = () => React.useContext(InteractionsContext).setHighlightedCells;
export const useSetEditedCells = () => React.useContext(InteractionsContext).setEditedCells;
export const useSetHoveredCell = () => React.useContext(InteractionsContext).setHoveredCell;
export const useSetFocusedCell = () => React.useContext(InteractionsContext).setFocusedCell;
export const useAddSelectedCells = () => React.useContext(InteractionsContext).addSelectedCells;
export const useAddEditedCells = () => React.useContext(InteractionsContext).addEditedCells;
export const useAddFilters = () => React.useContext(InteractionsContext).addFilters;
export const useRemoveEditedCells = () => React.useContext(InteractionsContext).removeEditedCells;
export const useRemoveFilters = () => React.useContext(InteractionsContext).removeFilters;
export const useFixedSize = () => React.useContext(SizeContext).fixedSize;
export const useTotalSize = () => React.useContext(SizeContext).totalSize;
export const useBorderWidth = () => React.useContext(SizeContext).borderWidth;