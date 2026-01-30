/** @import * as Types from "../typings.js"; */

import getColumnIndex from "./getColumnIndex.js";
import getRowIndex from "./getRowIndex.js";

/**
 * @param {Types.Position} internalMousePosition
 * @param {Types.PlacedRow[]} rows
 * @param {Types.PlacedColumn[]} columns
 * @param {Types.FixedSize} fixedSize
 * @param {Types.TotalSize} totalSize
 * @returns {Types.CellId | null}
 */
export default function getHoveredCell(internalMousePosition, rows, columns, fixedSize, totalSize) {
    if (!internalMousePosition)
        return null;
    if (internalMousePosition.x < 0 || internalMousePosition.y < 0 || internalMousePosition.x > totalSize.width || internalMousePosition.y > totalSize.height)
        return null;

    const hoverRowIndex = getRowIndex(rows, internalMousePosition.y);
    const hoverColumnIndex = getColumnIndex(columns, internalMousePosition.x);

    if (hoverRowIndex === -1 || hoverColumnIndex === -1)
        return null;

    return {
        rowId: rows[hoverRowIndex].id,
        columnId: columns[hoverColumnIndex].id
    };
}
