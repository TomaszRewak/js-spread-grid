/**
 * @param {EditedCell[]} editedCells
 * @param {Filter[]} filters
 * @returns {EditedCell[]}
 */
export default function getEditedCellsAndFilters(editedCells, filters) {
    return [...editedCells, ...filters.map(filter => ({ columnId: filter.columnId, rowId: filter.rowId, value: filter.expression }))];
}
