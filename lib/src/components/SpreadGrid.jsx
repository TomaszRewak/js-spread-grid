import React, { useState } from "react";
import { StateProvider } from "../contexts/StateContext";
import Grid from "../fragments/Grid";

const defaultData = [];
const defaultColumns = data => data.length > 0 ? Object.keys(data[0]).map(key => ({ id: key, width: 100 })) : [];
const defaultRows = data => [{ id: 'top-header', type: 'HEADER', height: 20 }, ...data.map((_, index) => ({ id: index, height: 20 }))];
const defaultFormatting = [];
const defaultDataSelector = ({data, row, column}) => data[row.id][column.id];
const defaultPinnedTop = 1;
const defaultPinnedBottom = 0;
const defaultPinnedLeft = 0;
const defaultPinnedRight = 0;

export default function SpreadGrid(props) {
    const [localSelectedCells, setLocalSelectedCells] = useState([]);
    const [localHoveredCell, setLocalHoveredCell] = useState(null);
    const [localFocusedCell, setLocalFocusedCell] = useState(null);

    const data = 'data' in props ? props.data : defaultData;
    const columns = 'columns' in props ? props.columns : defaultColumns;
    const rows = 'rows' in props ? props.rows : defaultRows;
    const formatting = 'formatting' in props ? props.formatting : defaultFormatting;
    const dataSelector = 'dataSelector' in props ? props.dataSelector : defaultDataSelector;
    const pinnedTop = 'pinnedTop' in props ? props.pinnedTop : defaultPinnedTop; // TODO: Throw error if pinnedTop + pinnedBottom > rows.length (and same for columns)
    const pinnedBottom = 'pinnedBottom' in props ? props.pinnedBottom : defaultPinnedBottom;
    const pinnedLeft = 'pinnedLeft' in props ? props.pinnedLeft : defaultPinnedLeft;
    const pinnedRight = 'pinnedRight' in props ? props.pinnedRight : defaultPinnedRight;
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
            columns={columns}
            rows={rows}
            pinnedTop={pinnedTop}
            pinnedBottom={pinnedBottom}
            pinnedLeft={pinnedLeft}
            pinnedRight={pinnedRight}
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