import roundToPixels from "../core-utils/roundToPixels.js";

export default function getPlacedColumns(columns, devicePixelRatio, borderWidth) {
    let left = borderWidth;

    return columns.map((column, index) => {
        const width = roundToPixels(column.width, devicePixelRatio);
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
