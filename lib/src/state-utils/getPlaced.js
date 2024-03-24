import roundToPixels from "../core-utils/roundToPixels.js";

export function getPlacedColumns(columns, devicePixelRatio, borderWidth) {
    let left = borderWidth;

    return columns.map((column, index) => {
        const assignedWidth = 'width' in column ? column.width : 100;
        const width = roundToPixels(assignedWidth, devicePixelRatio);
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

export function getPlacedRows(rows, devicePixelRatio, borderWidth) {
    let top = borderWidth;

    return rows.map((row, index) => {
        const assignedHeight = 'height' in row ? row.height : 20;
        const height = roundToPixels(assignedHeight, devicePixelRatio);
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
