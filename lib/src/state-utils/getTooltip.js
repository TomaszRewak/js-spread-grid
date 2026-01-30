/** @import * as Types from "../typings.js"; */

import stringifyId from "../core-utils/stringifyId.js";

/**
 * @param {Types.CellId} hoveredCell
 * @param {Types.FormatResolver} formatResolver
 * @param {Types.ColumnLookup} columnLookup
 * @param {Types.RowLookup} rowLookup
 * @returns {string}
 */
export default function getTooltip(hoveredCell, formatResolver, columnLookup, rowLookup) {
    if (!hoveredCell)
        return null;

    const columnKey = stringifyId(hoveredCell.columnId);
    const rowKey = stringifyId(hoveredCell.rowId);

    if (!columnLookup.has(columnKey))
        return null;
    if (!rowLookup.has(rowKey))
        return null;

    const row = rowLookup.get(rowKey);
    const column = columnLookup.get(columnKey);

    return formatResolver.resolve(row, column).tooltip;
}