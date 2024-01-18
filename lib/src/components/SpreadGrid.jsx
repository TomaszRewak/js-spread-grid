import React, { useState } from "react";
import { StateProvider } from "../contexts/StateContext";
import Grid from "../fragments/Grid";

const defaultData = [];
const defaultColumns = data => data.length > 0 ? Object.keys(data[0]).map(key => ({ id: key, width: 100 })) : [];
const defaultRows = data => [{ id: 'top-header', type: 'HEADER', height: 20 }, ...data.map((_, index) => ({ id: index, height: 20 }))];
const defaultFormatting = [];
const defaultDataSelector = ({data, row, column}) => data[row.id][column.id];
const defaultPinnedTop = 0;
const defaultPinnedBottom = 0;
const defaultPinnedLeft = 0;
const defaultPinnedRight = 0;
const defaultBorderWidth = 1;

export default function SpreadGrid(props) {
    const [localSelectedCells, setLocalSelectedCells] = useState([]);
    const [localHighlightedCells, setLocalHighlightedCells] = useState([]);
    const [localEditedCells, setLocalEditedCells] = useState([]);
    const [localFilters, setLocalFilters] = useState([]);
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
    const highlightedCells = 'highlightedCells' in props ? props.highlightedCells : localHighlightedCells;
    const editedCells = 'editedCells' in props ? props.editedCells : localEditedCells;
    const filters = 'filters' in props ? props.filters : localFilters;
    const hoveredCell = 'hoveredCell' in props ? props.hoveredCell : localHoveredCell;
    const focusedCell = 'focusedCell' in props ? props.focusedCell : localFocusedCell;
    const borderWidth = 'borderWidth' in props ? props.borderWidth : defaultBorderWidth;

    const onSelectedCellsChange = selectedCells => {
        setLocalSelectedCells(selectedCells);
        props.onSelectedCellsChange?.(selectedCells);
    };
    const onHighlightedCellsChange = highlightedCells => {
        setLocalHighlightedCells(highlightedCells);
        props.onHighlightedCellsChange?.(highlightedCells);
    }
    const onEditedCellsChange = editedCells => {
        setLocalEditedCells(editedCells);
        props.onEditedCellsChange?.(editedCells);
    }
    const onFiltersChange = filters => {
        setLocalFilters(filters);
        props.onFiltersChange?.(filters);
    }
    const onHoveredCellChange = hoveredCell => {
        setLocalHoveredCell(hoveredCell);
        props.onHoveredCellChange?.(hoveredCell);
    }
    const onFocusedCellChange = focusedCell => {
        setLocalFocusedCell(focusedCell);
        props.onFocusedCellChange?.(focusedCell);
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
            highlightedCells={highlightedCells}
            editedCells={editedCells}
            filters={filters}
            hoveredCell={hoveredCell}
            focusedCell={focusedCell}
            borderWidth={borderWidth}
            onSelectedCellsChange={onSelectedCellsChange}
            onHighlightedCellsChange={onHighlightedCellsChange}
            onEditedCellsChange={onEditedCellsChange}
            onFiltersChange={onFiltersChange}
            onHoveredCellChange={onHoveredCellChange}
            onFocusedCellChange={onFocusedCellChange}
        >
            <Grid />
        </StateProvider>
    );
}