/**
 * @param {MeasuredColumn[]} columns
 * @param {MeasuredRow[]} rows
 * @param {number} borderWidth
 * @returns {FixedSize}
 */
export default function getFixedSize(columns, rows, borderWidth) {
    let top = 0;
    let bottom = 0;
    let left = 0;
    let right = 0;

    for (const row of rows) {
        if (row.pinned === 'BEGIN') {
            top = top || borderWidth;
            top += row.height + borderWidth;
        }

        if (row.pinned === 'END') {
            bottom = bottom || borderWidth;
            bottom += row.height + borderWidth;
        }
    }

    for (const column of columns) {
        if (column.pinned === 'BEGIN') {
            left = left || borderWidth;
            left += column.width + borderWidth;
        }

        if (column.pinned === 'END') {
            right = right || borderWidth;
            right += column.width + borderWidth;
        }
    }

    return {
        top: top,
        bottom: bottom,
        left: left,
        right: right
    };
}
