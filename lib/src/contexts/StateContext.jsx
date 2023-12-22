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
    return newCells.every(cell => edition.getIdValue(cell.rowId, cell.columnId) === cell.value);
}

function useResolvedColumns(columns, devicePixelRatio, borderWidth) {
    return useMemo(() => {
        let left = borderWidth;

        return columns.map((column, index) => {
            const width = roundToPixels(column.width, devicePixelRatio);
            const newColumn = {
                ...column,
                width: width,
                leftWithBorder: left - borderWidth,
                left: left,
                right: left + width,
                rightWithBorder: left + width + borderWidth,
                index: index,
                key: stringifyId(column.id)
            }

            left += newColumn.width + borderWidth;

            return newColumn;
        });
    }, [borderWidth, columns, devicePixelRatio]);
}

function useResolvedRows(rows, devicePixelRatio, borderWidth) {
    return useMemo(() => {
        let top = borderWidth;

        return rows.map((row, index) => {
            const height = roundToPixels(row.height, devicePixelRatio);
            const newRow = {
                ...row,
                height: height,
                topWithBorder: top - borderWidth,
                top: top,
                bottom: top + height,
                bottomWithBorder: top + height + borderWidth,
                index: index,
                key: stringifyId(row.id)
            }

            top += newRow.height + borderWidth;

            return newRow;
        });
    }, [borderWidth, rows, devicePixelRatio]);
}

const DataContext = createContext();
const ColumnsAndRowsContext = createContext();
const MeasuringContext = createContext();
const InteractionsContext = createContext();
const RenderingContext = createContext();
const SizeContext = createContext();

export function StateProvider(props) {
    const devicePixelRatio = useDevicePixelRatio();
    const borderWidth = props.borderWidth / devicePixelRatio;
    const data = props.data;
    const columns = useResolvedColumns(useInvoked(props.columns, [data]), devicePixelRatio, borderWidth); // TODO: Throw on duplicate ids
    const rows = useResolvedRows(useInvoked(props.rows, [data]), devicePixelRatio, borderWidth);
    const pinned = useMemo(() => ({ top: props.pinnedTop, bottom: props.pinnedBottom, left: props.pinnedLeft, right: props.pinnedRight }), [props.pinnedTop, props.pinnedBottom, props.pinnedLeft, props.pinnedRight]);
    const sections = useMemo(() => getSections(columns, rows, pinned), [columns, rows, pinned]);
    const selectedCells = props.selectedCells;
    const selection = useMemo(() => new Selection(props.selectedCells), [props.selectedCells]);
    const highlight = useMemo(() => new Selection(props.highlightedCells), [props.highlightedCells]);
    const edition = useMemo(() => new Edition(props.editedCells), [props.editedCells]);
    const hoveredCell = props.hoveredCell;
    const focusedCell = props.focusedCell;
    // TODO: addDataFormattingRules and addRenderFormattingRules should remove unnecessary rules
    const dataFormatting = useMemo(() => getDataFormattingRules(props.formatting, props.dataSelector), [props.formatting, props.dataSelector]);
    const renderFormatting = useMemo(() => getRenderFormattingRules(dataFormatting, hoveredCell, focusedCell, selection, highlight, edition), [dataFormatting, hoveredCell, focusedCell, selection, highlight, edition]);
    const inputFormatting = useMemo(() => getInputFormattingRules(dataFormatting), [dataFormatting]);
    const fixedSize = useMemo(() => ({
        top: sections.top.height,
        bottom: sections.bottom.height,
        left: sections.left.width,
        right: sections.right.width
    }), [sections.top.height, sections.bottom.height, sections.left.width, sections.right.width]);
    const totalSize = useMemo(() => ({
        width: columns.at(-1).rightWithBorder,
        height: rows.at(-1).bottomWithBorder
    }), [columns, rows]);

    const setSelectedCells = useChangeCallback(props.selectedCells, props.onSelectedCellsChange, compareSelectedCells);
    const setHighlightedCells = useChangeCallback(props.highlightedCells, props.onHighlightedCellsChange, compareSelectedCells);
    const setEditedCells = useChangeCallback(props.editedCells, props.onEditedCellsChange, compareEditedCells);
    const setHoveredCell = useChangeCallback(props.hoveredCell, props.onHoveredCellChange, compareCells);
    const setFocusedCell = useChangeCallback(props.focusedCell, props.onFocusedCellChange, compareCells);
    const addSelectedCells = useCallback(cells => setSelectedCells(oldSelectedCells => { // TODO: Should the selected cells include info about the section?
        const selection = new Selection(cells);
        return [...cells, ...oldSelectedCells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId))];
    }), [setSelectedCells]);
    const addEditedCells = useCallback(cells => setEditedCells(oldEditedCells => {
        const edition = new Edition(cells);
        return [...cells, ...oldEditedCells.filter(cell => !edition.hasIdValue(cell.rowId, cell.columnId))];
    }), [setEditedCells]);

    useEffect(() => { console.log(props.selectedCells) }, [props.selectedCells]);

    const contexts = [
        [DataContext, useMemo(() => ({
            data
        }), [data])],
        [ColumnsAndRowsContext, useMemo(() => ({
            columns, rows, pinned, sections
        }), [columns, rows, pinned, sections])],
        [MeasuringContext, useMemo(() => ({
            dataFormatting
        }), [dataFormatting])],
        [InteractionsContext, useMemo(() => ({
            selectedCells, selection, hoveredCell, focusedCell, inputFormatting, edition, setSelectedCells, setHighlightedCells, setHoveredCell, setEditedCells, setFocusedCell, addSelectedCells, addEditedCells
        }), [selectedCells, selection, hoveredCell, focusedCell, inputFormatting, edition, setSelectedCells, setHighlightedCells, setHoveredCell, setEditedCells, setFocusedCell, addSelectedCells, addEditedCells])],
        [RenderingContext, useMemo(() => ({
            renderFormatting
        }), [renderFormatting])],
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

export const useData = () => React.useContext(DataContext).data;
export const useColumns = () => React.useContext(ColumnsAndRowsContext).columns;
export const useRows = () => React.useContext(ColumnsAndRowsContext).rows;
export const usePinned = () => React.useContext(ColumnsAndRowsContext).pinned;
export const useSections = () => React.useContext(ColumnsAndRowsContext).sections;
export const useDataFormatting = () => React.useContext(MeasuringContext).dataFormatting;
export const useSelectedCells = () => React.useContext(InteractionsContext).selectedCells;
export const useSelection = () => React.useContext(InteractionsContext).selection;
export const useEdition = () => React.useContext(InteractionsContext).edition;
export const useHoveredCell = () => React.useContext(InteractionsContext).hoveredCell;
export const useFocusedCell = () => React.useContext(InteractionsContext).focusedCell;
export const useRenderFormatting = () => React.useContext(RenderingContext).renderFormatting;
export const useInputFormatting = () => React.useContext(InteractionsContext).inputFormatting;
export const useSetSelectedCells = () => React.useContext(InteractionsContext).setSelectedCells;
export const useSetHighlightedCells = () => React.useContext(InteractionsContext).setHighlightedCells;
export const useSetEditedCells = () => React.useContext(InteractionsContext).setEditedCells;
export const useSetHoveredCell = () => React.useContext(InteractionsContext).setHoveredCell;
export const useSetFocusedCell = () => React.useContext(InteractionsContext).setFocusedCell;
export const useAddSelectedCells = () => React.useContext(InteractionsContext).addSelectedCells;
export const useAddEditedCells = () => React.useContext(InteractionsContext).addEditedCells;
export const useFixedSize = () => React.useContext(SizeContext).fixedSize;
export const useTotalSize = () => React.useContext(SizeContext).totalSize;
export const useBorderWidth = () => React.useContext(SizeContext).borderWidth;