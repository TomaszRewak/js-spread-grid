import roundToPixels from "../core-utils/roundToPixels.js";
import getPinned from "./getPinned.js";

/**
 * @param {MeasuredStaticColumn[]} columns
 * @param {Pinning} pinning
 * @param {number} borderWidth
 * @returns {PlacedColumn[]}
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
 * @param {MeasuredStaticRow[]} rows
 * @param {Pinning} pinning
 * @param {number} borderWidth
 * @returns {PlacedRow[]}
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
