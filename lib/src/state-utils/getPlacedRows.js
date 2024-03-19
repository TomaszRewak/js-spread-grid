import roundToPixels from "../core-utils/roundToPixels.js";

export default function getPlacedRows(rows, devicePixelRatio, borderWidth) {
    let top = borderWidth;

    return rows.map((row, index) => {
        const height = roundToPixels(row.height, devicePixelRatio);
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
