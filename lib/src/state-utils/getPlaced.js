import roundToPixels from "../core-utils/roundToPixels.js";

/**
 * @param {MeasuredColumn[]} columns
 * @param {number} borderWidth
 * @returns {PlacedColumn[]}
 */
export function getPlacedColumns(columns, borderWidth) {
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
            rightWithBorder: left + width + borderWidth
        };

        left += newColumn.width + borderWidth;

        return newColumn;
    });
}

/**
 * @param {MeasuredRow[]} rows
 * @param {number} borderWidth
 * @returns {PlacedRow[]}
 */
export function getPlacedRows(rows, borderWidth) {
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
            bottomWithBorder: top + height + borderWidth
        };

        top += newRow.height + borderWidth;

        return newRow;
    });
}
