import React, { createContext, useCallback, useEffect, useMemo } from "react";
import useInvoked from "../hooks/useInvoked";
import addRenderFormattingRules from "../utils/addRenderFormattingRules";
import Selection from "../utils/Selection";
import useChangeCallback from "../hooks/useChangeCallback";
import stringifyId from "../utils/stringifyId";

function compareCells(oldCell, newCell) {
    return stringifyId(oldCell) === stringifyId(newCell);
}

function compareSelectedCells(oldCells, newCells) {
    if (oldCells.length !== newCells.length)
        return false;

    const selection = new Selection(oldCells);
    return newCells.every(cell => selection.isIdSelected(cell.rowId, cell.columnId));
}

const DataContext = createContext();
const ColumnsAndRowsContext = createContext();
const MeasuringContext = createContext();
const InteractionsContext = createContext();
const RenderingContext = createContext();

export function StateProvider(props) {
    const data = props.data;
    const columnsLeft = useInvoked(props.columnsLeft, [data]);
    const columns = useInvoked(props.columns, [data]);
    const columnsRight = useInvoked(props.columnsRight, [data]);
    const rowsTop = useInvoked(props.rowsTop, [data]);
    const rows = useInvoked(props.rows, [data]);
    const rowsBottom = useInvoked(props.rowsBottom, [data]);
    const selection = useMemo(() => new Selection(props.selectedCells), [props.selectedCells]);
    const hoveredCell = props.hoveredCell;
    const focusedCell = props.focusedCell;
    const formatting = props.formatting;
    const renderFormatting = useMemo(() => addRenderFormattingRules(formatting, hoveredCell, focusedCell, selection), [formatting, hoveredCell, focusedCell, selection]);

    const setSelectedCells = useChangeCallback(props.selectedCells, props.onSelectedCellsChange, compareSelectedCells);
    const setHoveredCell = useChangeCallback(props.hoveredCell, props.onHoveredCellChange, compareCells);
    const setFocusedCell = useChangeCallback(props.focusedCell, props.onFocusedCellChange, compareCells);
    const addSelectedCells = useCallback(cells => setSelectedCells(oldSelectedCells => { // TODO: Should the selected cells include info about the section?
        const selection = new Selection(oldSelectedCells);
        const newSelectedCells = cells.filter(cell => !selection.isIdSelected(cell.rowId, cell.columnId));
        return [...oldSelectedCells, ...newSelectedCells];
    }), [setSelectedCells]);

    useEffect(() => { console.log(props.selectedCells) }, [props.selectedCells]);

    const contexts = [
        [DataContext, useMemo(() => ({
            data
        }), [data])],
        [ColumnsAndRowsContext, useMemo(() => ({
            columnsLeft, columns, columnsRight, rowsTop, rows, rowsBottom
        }), [columnsLeft, columns, columnsRight, rowsTop, rows, rowsBottom])],
        [MeasuringContext, useMemo(() => ({
            formatting
        }), [formatting])],
        [InteractionsContext, useMemo(() => ({
            selection, hoveredCell, focusedCell, setSelectedCells, setHoveredCell, setFocusedCell, addSelectedCells
        }), [selection, hoveredCell, focusedCell, setSelectedCells, setHoveredCell, setFocusedCell, addSelectedCells])],
        [RenderingContext, useMemo(() => ({
            renderFormatting
        }), [renderFormatting])],
    ];

    return contexts.reduce((children, [Context, value]) => (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    ), props.children);
}

export const useData = () => React.useContext(DataContext).data;
export const useColumnsLeft = () => React.useContext(ColumnsAndRowsContext).columnsLeft;
export const useColumns = () => React.useContext(ColumnsAndRowsContext).columns;
export const useColumnsRight = () => React.useContext(ColumnsAndRowsContext).columnsRight;
export const useRowsTop = () => React.useContext(ColumnsAndRowsContext).rowsTop;
export const useRows = () => React.useContext(ColumnsAndRowsContext).rows;
export const useRowsBottom = () => React.useContext(ColumnsAndRowsContext).rowsBottom;
export const useFormatting = () => React.useContext(MeasuringContext).formatting;
export const useSelection = () => React.useContext(InteractionsContext).selection;
export const useHoveredCell = () => React.useContext(InteractionsContext).hoveredCell;
export const useFocusedCell = () => React.useContext(InteractionsContext).focusedCell;
export const useRenderFormatting = () => React.useContext(RenderingContext).renderFormatting;
export const useSetSelectedCells = () => React.useContext(InteractionsContext).setSelectedCells;
export const useSetHoveredCell = () => React.useContext(InteractionsContext).setHoveredCell;
export const useSetFocusedCell = () => React.useContext(InteractionsContext).setFocusedCell;
export const useAddSelectedCells = () => React.useContext(InteractionsContext).addSelectedCells;