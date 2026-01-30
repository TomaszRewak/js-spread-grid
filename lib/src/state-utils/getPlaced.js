/** @import * as Types from "../typings.js"; */

import roundToPixels from "../core-utils/roundToPixels.js";
import getPinned from "./getPinned.js";

/**
 * @param {Types.MeasuredStaticColumn[]} columns
 * @param {Types.Pinning} pinning
 * @param {number} borderWidth
 * @returns {Types.PlacedColumn[]}
 */
export function getPlacedColumns(columns, pinning, borderWidth) {
    let left = borderWidth;

    return columns.map((column, index) => {
        const width = column.width
        const newColumn = {
            ...column,
            index: index,
            width: width,
            leftWithBorder: left - borderWidth,
            left: left,
            right: left + width,
            rightWithBorder: left + width + borderWidth,
            pinned: getPinned(index, columns.length, pinning.left, pinning.right, column.type)
        };

        left += newColumn.width + borderWidth;

        return newColumn;
    });
}

/**
 * @param {Types.MeasuredStaticRow[]} rows
 * @param {Types.Pinning} pinning
 * @param {number} borderWidth
 * @returns {Types.PlacedRow[]}
 */
export function getPlacedRows(rows, pinning, borderWidth) {
    let top = borderWidth;

    return rows.map((row, index) => {
        const height = row.height
        const newRow = {
            ...row,
            index: index,
            height: height,
            topWithBorder: top - borderWidth,
            top: top,
            bottom: top + height,
            bottomWithBorder: top + height + borderWidth,
            pinned: getPinned(index, rows.length, pinning.top, pinning.bottom, row.type)
        };

        top += newRow.height + borderWidth;

        return newRow;
    });
}
