/** @import * as Types from "../typings.js"; */

/**
 * @template {Types.OptionalCellId} T
 * @param {T[]} cells
 * @param {Types.Id} defaultId
 * @returns {(T & Types.CellId)[]}
 */
export function getWithAssumedId(cells, defaultId) {
    return cells.map(cell => ({
        ...cell,
        columnId: 'columnId' in cell ? cell.columnId : defaultId,
        rowId: 'rowId' in cell ? cell.rowId : defaultId
    }));
}