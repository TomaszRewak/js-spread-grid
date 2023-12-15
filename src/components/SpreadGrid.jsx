import React, { useState, useCallback } from "react";
import { StateProvider } from "../contexts/StateContext";
import Grid from "../fragments/Grid";

const defaultData = [];
const defaultColumnsLeft = [];
const defaultColumns = [];
const defaultColumnsRight = [];
const defaultRowsTop = [];
const defaultRows = [];
const defaultRowsBottom = [];
const defaultFormatting = [];
const defaultDataSelector = (data, rows, columns, row, column) => data[row.id][column.id];

export default function SpreadGrid(props) {
    const [localSelectedCells, setLocalSelectedCells] = useState([]);
    const [localHoveredCell, setLocalHoveredCell] = useState(null);
    const [localFocusedCell, setLocalFocusedCell] = useState(null);

    const data = 'data' in props ? props.data : defaultData;
    const columnsLeft = 'columnsLeft' in props ? props.columnsLeft : defaultColumnsLeft;
    const columns = 'columns' in props ? props.columns : defaultColumns;
    const columnsRight = 'columnsRight' in props ? props.columnsRight : defaultColumnsRight;
    const rowsTop = 'rowsTop' in props ? props.rowsTop : defaultRowsTop;
    const rows = 'rows' in props ? props.rows : defaultRows;
    const rowsBottom = 'rowsBottom' in props ? props.rowsBottom : defaultRowsBottom;
    const formatting = 'formatting' in props ? props.formatting : defaultFormatting;
    const dataSelector = 'dataSelector' in props ? props.dataSelector : defaultDataSelector;
    const selectedCells = 'selectedCells' in props ? props.selectedCells : localSelectedCells;
    const hoveredCell = 'hoveredCell' in props ? props.hoveredCell : localHoveredCell;
    const focusedCell = 'focusedCell' in props ? props.focusedCell : localFocusedCell;

    const onSelectedCellsChange = selectedCells => {
        setLocalSelectedCells(selectedCells);
        if (props.onSelectedCellsChange)
            props.onSelectedCellsChange(selectedCells);
    };
    const onHoveredCellChange = hoveredCell => {
        setLocalHoveredCell(hoveredCell);
        if (props.onHoveredCellChange)
            props.onHoveredCellChange(hoveredCell);
    }
    const onFocusedCellChange = focusedCell => {
        setLocalFocusedCell(focusedCell);
        if (props.onFocusedCellChange)
            props.onFocusedCellChange(focusedCell);
    }

    return (
        <StateProvider
            data={data}
            columnsLeft={columnsLeft}
            columns={columns}
            columnsRight={columnsRight}
            rowsTop={rowsTop}
            rows={rows}
            rowsBottom={rowsBottom}
            formatting={formatting}
            dataSelector={dataSelector}
            selectedCells={selectedCells}
            hoveredCell={hoveredCell}
            focusedCell={focusedCell}
            onSelectedCellsChange={onSelectedCellsChange}
            onHoveredCellChange={onHoveredCellChange}
            onFocusedCellChange={onFocusedCellChange}
        >
            <Grid />
        </StateProvider>
    );
}