/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.EditedCell[]} editedCells
 * @param {Types.Filter[]} filters
 * @returns {Types.EditedCell[]}
 */
export default function getEditedCellsAndFilters(editedCells, filters) {
    return [...editedCells, ...filters.map(filter => ({ columnId: filter.columnId, rowId: filter.rowId, value: filter.expression }))];
}
