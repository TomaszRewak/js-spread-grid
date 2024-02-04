// TODO: Move
export default function getEditedCellsAndFilters(editedCells, filters) {
    return [...editedCells, ...filters.map(filter => ({ columnId: filter.columnId, rowId: filter.rowId, value: filter.expression }))];
}
