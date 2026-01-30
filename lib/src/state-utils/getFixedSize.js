/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.MeasuredRow} row 
 * @param {number} count
 * @param {number} borderWidth
 * @returns {[number, number]}
 */
function measureRow(row, count, borderWidth) {
    if (row.type !== 'DYNAMIC-BLOCK')
        return [row.height + borderWidth, 1];

    const cappedCount = Math.min(count, row.count);
    return [
        (row.rowHeight + borderWidth) * cappedCount,
        cappedCount
    ];
}

/**
 * @param {Types.MeasuredColumn} column
 * @param {number} count
 * @param {number} borderWidth
 * @returns {[number, number]}
 */
function measureColumn(column, count, borderWidth) {
    if (column.type !== 'DYNAMIC-BLOCK')
        return [column.width + borderWidth, 1];

    const cappedCount = Math.min(count, column.count);
    return [
        (column.columnWidth + borderWidth) * cappedCount,
        cappedCount
    ];
}

/**
 * @param {Types.MeasuredColumn[]} columns
 * @param {Types.MeasuredRow[]} rows
 * @param {Types.Pinning} pinning
 * @param {number} borderWidth
 * @returns {Types.FixedSize}
 */
export default function getFixedSize(columns, rows, pinning, borderWidth) {
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    if (pinning.top > 0) {
        top = borderWidth;

        for (let i = 0, j = 0; j < pinning.top; i++) {
            const row = rows[i];
            const [height, count] = measureRow(row, pinning.top - j, borderWidth);
            top += height;
            j += count;
        }
    }

    if (pinning.left > 0) {
        left = borderWidth;

        for (let i = 0, j = 0; j < pinning.left; i++) {
            const column = columns[i];
            const [width, count] = measureColumn(column, pinning.left - j, borderWidth);
            left += width;
            j += count;
        }
    }

    if (pinning.bottom > 0) {
        bottom = borderWidth;

        for (let i = rows.length - 1, j = 0; j < pinning.bottom; i--) {
            const row = rows[i];
            const [height, count] = measureRow(row, pinning.bottom - j, borderWidth);
            bottom += height;
            j += count;
        }
    }

    if (pinning.right > 0) {
        right = borderWidth;

        for (let i = columns.length - 1, j = 0; j < pinning.right; i--) {
            const column = columns[i];
            const [height, count] = measureColumn(column, pinning.right - j, borderWidth);
            right += height;
            j += count;
        }
    }

    return {
        top: top,
        bottom: bottom,
        left: left,
        right: right
    };
}
