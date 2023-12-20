import React, { createContext, useCallback, useEffect, useMemo } from "react";
import useInvoked from "../hooks/useInvoked";
import addRenderFormattingRules from "../utils/addRenderFormattingRules";
import Selection from "../utils/Selection";
import useChangeCallback from "../hooks/useChangeCallback";
import stringifyId from "../utils/stringifyId";
import addDataFormattingRules from "../utils/addDataFormattingRules";
import useDevicePixelRatio, { roundToPixels } from "../hooks/useDevicePixelRatio";

function compareCells(oldCell, newCell) {
    return stringifyId(oldCell) === stringifyId(newCell);
}

function compareSelectedCells(oldCells, newCells) {
    if (oldCells.length !== newCells.length)
        return false;

    const selection = new Selection(oldCells);
    return newCells.every(cell => selection.isIdSelected(cell.rowId, cell.columnId));
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
    const columns = useResolvedColumns(useInvoked(props.columns, [data]), devicePixelRatio, borderWidth);
    const rows = useResolvedRows(useInvoked(props.rows, [data]), devicePixelRatio, borderWidth);
    const pinned = useMemo(() => ({ top: props.pinnedTop, bottom: props.pinnedBottom, left: props.pinnedLeft, right: props.pinnedRight }), [props.pinnedTop, props.pinnedBottom, props.pinnedLeft, props.pinnedRight]);
    const selection = useMemo(() => new Selection(props.selectedCells), [props.selectedCells]);
    const hoveredCell = props.hoveredCell;
    const focusedCell = props.focusedCell;
    const formatting = useMemo(() => addDataFormattingRules(props.formatting, props.dataSelector), [props.formatting, props.dataSelector]);
    const renderFormatting = useMemo(() => addRenderFormattingRules(formatting, hoveredCell, focusedCell, selection), [formatting, hoveredCell, focusedCell, selection]);
    const fixedSize = useMemo(() => ({
        top: pinned.top ? rows.at(pinned.top - 1).bottomWithBorder : 0,
        bottom: pinned.bottom ? rows.at(-1).bottomWithBorder - rows.at(-pinned.bottom).topWithBorder : 0,
        left: pinned.left ? columns.at(pinned.left - 1).rightWithBorder : 0,
        right: pinned.right ? columns.at(-1).rightWithBorder - columns.at(-pinned.right).leftWithBorder : 0
    }), [pinned, columns, rows]);
    const totalSize = useMemo(() => ({
        width: columns.at(-1).rightWithBorder,
        height: rows.at(-1).bottomWithBorder
    }), [columns, rows]);

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
            columns, rows, pinned
        }), [columns, rows, pinned])],
        [MeasuringContext, useMemo(() => ({
            formatting
        }), [formatting])],
        [InteractionsContext, useMemo(() => ({
            selection, hoveredCell, focusedCell, setSelectedCells, setHoveredCell, setFocusedCell, addSelectedCells
        }), [selection, hoveredCell, focusedCell, setSelectedCells, setHoveredCell, setFocusedCell, addSelectedCells])],
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
export const useFormatting = () => React.useContext(MeasuringContext).formatting;
export const useSelection = () => React.useContext(InteractionsContext).selection;
export const useHoveredCell = () => React.useContext(InteractionsContext).hoveredCell;
export const useFocusedCell = () => React.useContext(InteractionsContext).focusedCell;
export const useRenderFormatting = () => React.useContext(RenderingContext).renderFormatting;
export const useSetSelectedCells = () => React.useContext(InteractionsContext).setSelectedCells;
export const useSetHoveredCell = () => React.useContext(InteractionsContext).setHoveredCell;
export const useSetFocusedCell = () => React.useContext(InteractionsContext).setFocusedCell;
export const useAddSelectedCells = () => React.useContext(InteractionsContext).addSelectedCells;
export const useFixedSize = () => React.useContext(SizeContext).fixedSize;
export const useTotalSize = () => React.useContext(SizeContext).totalSize;
export const useBorderWidth = () => React.useContext(SizeContext).borderWidth;