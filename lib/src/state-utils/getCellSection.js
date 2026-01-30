/** @import * as Types from "../typings.js"; */

/**
 * @param {Types.PlacedRow} row
 * @returns {Types.VerticalSectionName}
 */
function getVerticalSection(row) {
    if (row.pinned === "BEGIN")
        return "top";
    if (row.pinned === "END")
        return "bottom";
    return "middle";
}

/**
 * @param {Types.PlacedColumn} column
 * @returns {Types.HorizontalSectionName}
 */
function getHorizontalSection(column) {
    if (column.pinned === "BEGIN")
        return "left";
    if (column.pinned === "END")
        return "right";
    return "center";
}

/**
 * @param {Types.PlacedColumn} column
 * @param {Types.PlacedRow} row
 * @returns {Types.SectionName}
 */
export default function getCellSection(column, row) {
    const verticalSection = getVerticalSection(row);
    const horizontalSection = getHorizontalSection(column);

    return `${verticalSection}-${horizontalSection}`;
}