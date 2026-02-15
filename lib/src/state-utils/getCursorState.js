/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.Id} resizableColumn
 * @param {Types.Id} resizableRow
 * @param {boolean} isReordering
 * @returns {Types.CursorState}
 */
export default function getCursorState(resizableColumn, resizableRow, isReordering) {
    return { resizableColumn, resizableRow, isReordering };
}
